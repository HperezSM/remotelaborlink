
-- Add new columns to candidate_profiles
ALTER TABLE public.candidate_profiles
  ADD COLUMN IF NOT EXISTS first_name text,
  ADD COLUMN IF NOT EXISTS last_name text,
  ADD COLUMN IF NOT EXISTS phone text,
  ADD COLUMN IF NOT EXISTS field_of_study text,
  ADD COLUMN IF NOT EXISTS github_url text,
  ADD COLUMN IF NOT EXISTS us_hours_available text;

-- Candidate certifications table
CREATE TABLE public.candidate_certifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id uuid REFERENCES public.candidate_profiles(id) ON DELETE CASCADE NOT NULL,
  file_url text NOT NULL,
  file_name text NOT NULL,
  file_type text NOT NULL DEFAULT 'pdf',
  uploaded_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.candidate_certifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage all certifications"
  ON public.candidate_certifications FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Candidates manage own certifications"
  ON public.candidate_certifications FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.candidate_profiles
    WHERE candidate_profiles.id = candidate_certifications.candidate_id
    AND candidate_profiles.user_id = auth.uid()
  ));

-- Candidate portfolio links table
CREATE TABLE public.candidate_portfolio_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id uuid REFERENCES public.candidate_profiles(id) ON DELETE CASCADE NOT NULL,
  link_type text NOT NULL DEFAULT 'other',
  url text NOT NULL,
  label text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.candidate_portfolio_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage all portfolio links"
  ON public.candidate_portfolio_links FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Candidates manage own portfolio links"
  ON public.candidate_portfolio_links FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.candidate_profiles
    WHERE candidate_profiles.id = candidate_portfolio_links.candidate_id
    AND candidate_profiles.user_id = auth.uid()
  ));

CREATE POLICY "Anyone can view portfolio links"
  ON public.candidate_portfolio_links FOR SELECT
  USING (true);

-- Profile views table
CREATE TABLE public.profile_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id uuid REFERENCES public.candidate_profiles(id) ON DELETE CASCADE NOT NULL,
  company_id uuid REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
  viewed_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.profile_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage all profile views"
  ON public.profile_views FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Companies insert profile views"
  ON public.profile_views FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.companies
    WHERE companies.id = profile_views.company_id
    AND companies.user_id = auth.uid()
  ));

CREATE POLICY "Candidates view own profile views"
  ON public.profile_views FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.candidate_profiles
    WHERE candidate_profiles.id = profile_views.candidate_id
    AND candidate_profiles.user_id = auth.uid()
  ));

-- Candidate additional photos storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('candidate-photos', 'candidate-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Certifications storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('certifications', 'certifications', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for candidate-photos
CREATE POLICY "Anyone can view candidate photos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'candidate-photos');

CREATE POLICY "Authenticated users upload candidate photos"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'candidate-photos' AND auth.role() = 'authenticated');

CREATE POLICY "Users delete own candidate photos"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'candidate-photos' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Storage policies for certifications
CREATE POLICY "Admins view all certifications"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'certifications' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users view own certifications"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'certifications' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Authenticated users upload certifications"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'certifications' AND auth.role() = 'authenticated');

CREATE POLICY "Users delete own certifications"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'certifications' AND (storage.foldername(name))[1] = auth.uid()::text);
