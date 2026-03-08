
-- Feature flags table
CREATE TABLE public.feature_flags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  flag_key text UNIQUE NOT NULL,
  flag_label text NOT NULL,
  enabled boolean NOT NULL DEFAULT false,
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.feature_flags ENABLE ROW LEVEL SECURITY;

-- Admins can manage feature flags
CREATE POLICY "Admins manage feature flags"
  ON public.feature_flags FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Anyone can read feature flags (needed for conditional UI)
CREATE POLICY "Anyone can read feature flags"
  ON public.feature_flags FOR SELECT
  USING (true);

-- Insert default flags
INSERT INTO public.feature_flags (flag_key, flag_label, enabled) VALUES
  ('company_subscriptions', 'Company Subscription Plans', false),
  ('profile_view_notifications', 'Profile View Notifications', false),
  ('job_board', 'Job Board', false),
  ('candidate_certifications', 'Candidate Certifications', true);

-- Jobs table
CREATE TABLE public.jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  role_type text NOT NULL,
  company_id uuid REFERENCES public.companies(id) ON DELETE SET NULL,
  show_company_name boolean NOT NULL DEFAULT false,
  engagement_type text,
  seniority text,
  salary_min integer,
  salary_max integer,
  short_description text,
  full_description text,
  requirements text,
  nice_to_haves text,
  status text NOT NULL DEFAULT 'draft',
  posted_at timestamp with time zone NOT NULL DEFAULT now(),
  created_by_admin uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

-- Admins manage all jobs
CREATE POLICY "Admins manage all jobs"
  ON public.jobs FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Anyone can view active jobs (public job board)
CREATE POLICY "Anyone can view active jobs"
  ON public.jobs FOR SELECT
  USING (status = 'active');

-- Job applications table
CREATE TABLE public.job_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid REFERENCES public.jobs(id) ON DELETE CASCADE NOT NULL,
  candidate_id uuid REFERENCES public.candidate_profiles(id) ON DELETE CASCADE NOT NULL,
  applied_at timestamp with time zone NOT NULL DEFAULT now(),
  status text NOT NULL DEFAULT 'applied',
  admin_notes text,
  UNIQUE(job_id, candidate_id)
);

ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

-- Admins manage all applications
CREATE POLICY "Admins manage all applications"
  ON public.job_applications FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Candidates can view own applications
CREATE POLICY "Candidates view own applications"
  ON public.job_applications FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.candidate_profiles
    WHERE candidate_profiles.id = job_applications.candidate_id
    AND candidate_profiles.user_id = auth.uid()
  ));

-- Candidates can insert own applications
CREATE POLICY "Candidates insert own applications"
  ON public.job_applications FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.candidate_profiles
    WHERE candidate_profiles.id = job_applications.candidate_id
    AND candidate_profiles.user_id = auth.uid()
  ));

-- Updated_at triggers
CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON public.jobs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_feature_flags_updated_at BEFORE UPDATE ON public.feature_flags
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
