INSERT INTO public.feature_flags (flag_key, flag_label, enabled)
VALUES 
  ('candidate_approval', 'Require Admin Approval for Candidates', false),
  ('company_approval', 'Require Admin Approval for Companies', false)
ON CONFLICT (flag_key) DO NOTHING;