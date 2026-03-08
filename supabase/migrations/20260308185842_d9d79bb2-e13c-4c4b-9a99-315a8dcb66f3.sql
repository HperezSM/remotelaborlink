
-- Role enum
CREATE TYPE public.app_role AS ENUM ('candidate', 'company', 'admin');

-- User roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

-- RLS for user_roles
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Candidate profiles
CREATE TABLE public.candidate_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  country TEXT NOT NULL,
  city TEXT NOT NULL,
  linkedin_url TEXT,
  portfolio_url TEXT,
  profile_photo_url TEXT,
  roles_applied TEXT[] NOT NULL DEFAULT '{}',
  years_experience TEXT,
  seniority_level TEXT,
  employment_status TEXT,
  availability TEXT,
  expected_rate_usd INTEGER,
  work_type_preference TEXT,
  technical_skills TEXT[] DEFAULT '{}',
  bio TEXT,
  proud_achievement TEXT,
  industries TEXT[] DEFAULT '{}',
  resume_url TEXT,
  loom_video_url TEXT,
  portfolio_link TEXT,
  english_proficiency TEXT,
  status TEXT NOT NULL DEFAULT 'pending_review',
  onboarding_completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.candidate_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Candidates view own profile" ON public.candidate_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Candidates insert own profile" ON public.candidate_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Candidates update own profile" ON public.candidate_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins view all candidates" ON public.candidate_profiles FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update all candidates" ON public.candidate_profiles FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

-- Companies
CREATE TABLE public.companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  company_name TEXT NOT NULL,
  company_email TEXT NOT NULL,
  company_website TEXT,
  company_size TEXT,
  industry TEXT,
  how_heard TEXT,
  contact_person_name TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Companies view own record" ON public.companies FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Companies insert own record" ON public.companies FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Companies update own record" ON public.companies FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins view all companies" ON public.companies FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage all companies" ON public.companies FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Role requests
CREATE TABLE public.role_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
  role_title TEXT NOT NULL,
  role_type TEXT NOT NULL,
  seniority TEXT NOT NULL,
  num_hires INTEGER DEFAULT 1,
  responsibilities TEXT,
  must_have_skills TEXT[] DEFAULT '{}',
  nice_to_have_skills TEXT[] DEFAULT '{}',
  budget_min INTEGER,
  budget_max INTEGER,
  start_timeline TEXT,
  engagement_type TEXT,
  additional_notes TEXT,
  admin_notes TEXT,
  status TEXT NOT NULL DEFAULT 'submitted',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.role_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Companies view own role requests" ON public.role_requests FOR SELECT USING (EXISTS (SELECT 1 FROM public.companies WHERE id = role_requests.company_id AND user_id = auth.uid()));
CREATE POLICY "Companies insert own role requests" ON public.role_requests FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.companies WHERE id = role_requests.company_id AND user_id = auth.uid()));
CREATE POLICY "Companies update own role requests" ON public.role_requests FOR UPDATE USING (EXISTS (SELECT 1 FROM public.companies WHERE id = role_requests.company_id AND user_id = auth.uid()));
CREATE POLICY "Admins manage all role requests" ON public.role_requests FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Candidate pushes
CREATE TABLE public.candidate_pushes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id UUID REFERENCES public.candidate_profiles(id) ON DELETE CASCADE NOT NULL,
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
  role_request_id UUID REFERENCES public.role_requests(id) ON DELETE SET NULL,
  admin_note TEXT,
  company_action TEXT NOT NULL DEFAULT 'none',
  pushed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.candidate_pushes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Companies view pushed candidates" ON public.candidate_pushes FOR SELECT USING (EXISTS (SELECT 1 FROM public.companies WHERE id = candidate_pushes.company_id AND user_id = auth.uid()));
CREATE POLICY "Companies update push action" ON public.candidate_pushes FOR UPDATE USING (EXISTS (SELECT 1 FROM public.companies WHERE id = candidate_pushes.company_id AND user_id = auth.uid()));
CREATE POLICY "Admins manage all pushes" ON public.candidate_pushes FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Messages
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id UUID NOT NULL,
  sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  sender_role app_role NOT NULL,
  recipient_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  recipient_role app_role NOT NULL,
  content TEXT NOT NULL,
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own messages" ON public.messages FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = recipient_id);
CREATE POLICY "Users send messages" ON public.messages FOR INSERT WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "Recipients mark read" ON public.messages FOR UPDATE USING (auth.uid() = recipient_id);
CREATE POLICY "Admins view all messages" ON public.messages FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins send messages" ON public.messages FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Notifications
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL,
  content TEXT NOT NULL,
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users update own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins create notifications" ON public.notifications FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_candidate_profiles_updated_at BEFORE UPDATE ON public.candidate_profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON public.companies FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_role_requests_updated_at BEFORE UPDATE ON public.role_requests FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('profile-photos', 'profile-photos', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('resumes', 'resumes', false);

CREATE POLICY "Profile photos public read" ON storage.objects FOR SELECT USING (bucket_id = 'profile-photos');
CREATE POLICY "Upload own profile photo" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'profile-photos' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Update own profile photo" ON storage.objects FOR UPDATE USING (bucket_id = 'profile-photos' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Resume owner view" ON storage.objects FOR SELECT USING (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Admins view resumes" ON storage.objects FOR SELECT USING (bucket_id = 'resumes' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Upload own resume" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Auto-assign role on signup via trigger
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, COALESCE((NEW.raw_user_meta_data->>'app_role')::app_role, 'candidate'));
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_role();
