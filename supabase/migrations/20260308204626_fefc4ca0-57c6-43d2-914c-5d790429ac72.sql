
-- Company message usage tracking table
CREATE TABLE public.company_message_usage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
  billing_period_start timestamp with time zone NOT NULL DEFAULT date_trunc('month', now()),
  messages_sent integer NOT NULL DEFAULT 0,
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(company_id, billing_period_start)
);

ALTER TABLE public.company_message_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage all message usage"
  ON public.company_message_usage FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Companies view own usage"
  ON public.company_message_usage FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.companies
    WHERE companies.id = company_message_usage.company_id
    AND companies.user_id = auth.uid()
  ));

CREATE TRIGGER update_company_message_usage_updated_at BEFORE UPDATE ON public.company_message_usage
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to create notification when profile is viewed
CREATE OR REPLACE FUNCTION public.notify_profile_view()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  candidate_user_id uuid;
BEGIN
  -- Get the candidate's user_id
  SELECT user_id INTO candidate_user_id
  FROM public.candidate_profiles
  WHERE id = NEW.candidate_id;

  IF candidate_user_id IS NOT NULL THEN
    INSERT INTO public.notifications (user_id, type, content)
    VALUES (
      candidate_user_id,
      'profile_view',
      'Your profile was viewed by a company.'
    );
  END IF;

  RETURN NEW;
END;
$$;

-- Trigger to fire notification on profile view
CREATE TRIGGER on_profile_view_notify
  AFTER INSERT ON public.profile_views
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_profile_view();
