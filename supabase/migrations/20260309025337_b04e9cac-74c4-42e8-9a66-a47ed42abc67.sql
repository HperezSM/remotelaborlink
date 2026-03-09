
-- Allow candidates to delete (withdraw) their own applications
CREATE POLICY "Candidates delete own applications" ON public.job_applications
FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM candidate_profiles
    WHERE candidate_profiles.id = job_applications.candidate_id
    AND candidate_profiles.user_id = auth.uid()
  )
);

-- Allow candidates to delete their own portfolio links
CREATE POLICY "Candidates delete own portfolio links" ON public.candidate_portfolio_links
FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM candidate_profiles
    WHERE candidate_profiles.id = candidate_portfolio_links.candidate_id
    AND candidate_profiles.user_id = auth.uid()
  )
);

-- Allow candidates to delete own certifications
CREATE POLICY "Candidates delete own certifications" ON public.candidate_certifications
FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM candidate_profiles
    WHERE candidate_profiles.id = candidate_certifications.candidate_id
    AND candidate_profiles.user_id = auth.uid()
  )
);
