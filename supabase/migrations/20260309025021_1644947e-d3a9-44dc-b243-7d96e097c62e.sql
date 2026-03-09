
-- Create candidate_photos table for additional portfolio photos
CREATE TABLE public.candidate_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id uuid NOT NULL REFERENCES public.candidate_profiles(id) ON DELETE CASCADE,
  photo_url text NOT NULL,
  display_order integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.candidate_photos ENABLE ROW LEVEL SECURITY;

-- Candidates manage own photos
CREATE POLICY "Candidates manage own photos" ON public.candidate_photos
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM candidate_profiles
    WHERE candidate_profiles.id = candidate_photos.candidate_id
    AND candidate_profiles.user_id = auth.uid()
  )
);

-- Admins manage all photos
CREATE POLICY "Admins manage all photos" ON public.candidate_photos
FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Anyone can view photos (public profile)
CREATE POLICY "Anyone can view photos" ON public.candidate_photos
FOR SELECT USING (true);

-- Create candidate-photos storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('candidate-photos', 'candidate-photos', true)
ON CONFLICT (id) DO NOTHING;
