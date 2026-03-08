
-- Interview scheduling table
CREATE TABLE public.interviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_push_id UUID REFERENCES public.candidate_pushes(id) ON DELETE CASCADE NOT NULL,
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
  candidate_id UUID REFERENCES public.candidate_profiles(id) ON DELETE CASCADE NOT NULL,
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 30,
  meeting_link TEXT,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'scheduled',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.interviews ENABLE ROW LEVEL SECURITY;

-- Admins manage all
CREATE POLICY "Admins manage all interviews" ON public.interviews FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Companies view/update their interviews
CREATE POLICY "Companies view own interviews" ON public.interviews FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.companies WHERE companies.id = interviews.company_id AND companies.user_id = auth.uid()));

CREATE POLICY "Companies update own interviews" ON public.interviews FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.companies WHERE companies.id = interviews.company_id AND companies.user_id = auth.uid()));

-- Companies can insert interviews
CREATE POLICY "Companies insert interviews" ON public.interviews FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.companies WHERE companies.id = interviews.company_id AND companies.user_id = auth.uid()));

-- Candidates view their interviews
CREATE POLICY "Candidates view own interviews" ON public.interviews FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.candidate_profiles WHERE candidate_profiles.id = interviews.candidate_id AND candidate_profiles.user_id = auth.uid()));

-- Trigger for updated_at
CREATE TRIGGER update_interviews_updated_at BEFORE UPDATE ON public.interviews
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.interviews;
