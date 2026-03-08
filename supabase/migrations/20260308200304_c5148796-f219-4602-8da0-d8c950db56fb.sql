-- Create team_members table for founders with photos
CREATE TABLE public.team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text NOT NULL,
  initials text NOT NULL,
  photo_url text,
  bullets text[] DEFAULT '{}',
  quote text,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Create partners table for trusted companies
CREATE TABLE public.partners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name text NOT NULL,
  logo_url text NOT NULL,
  website_url text,
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Create testimonials table for client reviews
CREATE TABLE public.testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name text NOT NULL,
  client_role text,
  company_name text,
  content text NOT NULL,
  rating integer DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  photo_url text,
  is_active boolean DEFAULT true,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Enable RLS on all tables
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- Team members policies (public read, admin write)
CREATE POLICY "Anyone can view team members" ON public.team_members
  FOR SELECT USING (true);

CREATE POLICY "Admins manage team members" ON public.team_members
  FOR ALL USING (has_role(auth.uid(), 'admin'));

-- Partners policies (public read, admin write)
CREATE POLICY "Anyone can view partners" ON public.partners
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins manage partners" ON public.partners
  FOR ALL USING (has_role(auth.uid(), 'admin'));

-- Testimonials policies (public read active, admin write)
CREATE POLICY "Anyone can view active testimonials" ON public.testimonials
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins manage testimonials" ON public.testimonials
  FOR ALL USING (has_role(auth.uid(), 'admin'));

-- Create storage bucket for team/partner photos
INSERT INTO storage.buckets (id, name, public) VALUES ('content-images', 'content-images', true);

-- Storage policies for content-images bucket
CREATE POLICY "Anyone can view content images" ON storage.objects
  FOR SELECT USING (bucket_id = 'content-images');

CREATE POLICY "Admins can upload content images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'content-images' AND has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update content images" ON storage.objects
  FOR UPDATE USING (bucket_id = 'content-images' AND has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete content images" ON storage.objects
  FOR DELETE USING (bucket_id = 'content-images' AND has_role(auth.uid(), 'admin'));

-- Insert default team members
INSERT INTO public.team_members (name, role, initials, bullets, quote, display_order) VALUES
('Herber', 'CEO & Head of Operations', 'H', ARRAY['Leads complex IT and product initiatives across distributed teams', 'Brings clarity and execution structure when things get messy', 'Assesses technical talent with a real startup and enterprise lens', '9+ years across healthcare tech, SaaS, cybersecurity, and IT infrastructure'], 'Good systems make good teams possible.', 1),
('Karlis', 'Co-Founder & Head of Marketing', 'K', ARRAY['Leads marketing and growth across multiple industries', 'Keeps teams aligned, supported, and accountable', 'Bridges the gap between founders and talent to build long-term partnerships', 'Specializes in positioning and brand strategy for remote-first companies'], 'Remote work only works when people feel seen and supported.', 2),
('Karla', 'Co-Founder & Head of Talent', 'KA', ARRAY['Psychology background combined with premium recruiting expertise', 'Hands-on throughout every hiring process — asks the right questions', 'Helps founders avoid costly hiring mistakes before they happen', 'Designs the vetting framework that separates real talent from resume noise'], 'The right team starts with the right people.', 3);