
-- Roles
CREATE TYPE public.app_role AS ENUM ('super_admin', 'staff_admin', 'student');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE OR REPLACE FUNCTION public.is_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role IN ('super_admin','staff_admin'))
$$;

CREATE POLICY "users see own roles" ON public.user_roles FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.is_admin(auth.uid()));

-- Profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own profile read" ON public.profiles FOR SELECT TO authenticated
  USING (id = auth.uid() OR public.is_admin(auth.uid()));
CREATE POLICY "own profile write" ON public.profiles FOR UPDATE TO authenticated
  USING (id = auth.uid()) WITH CHECK (id = auth.uid());
CREATE POLICY "own profile insert" ON public.profiles FOR INSERT TO authenticated
  WITH CHECK (id = auth.uid());

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', NEW.email)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Students / Enrollments
CREATE TABLE public.students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_name TEXT NOT NULL,
  age INT NOT NULL,
  gender TEXT,
  parent_name TEXT NOT NULL,
  parent_phone TEXT NOT NULL,
  parent_email TEXT NOT NULL,
  selected_instrument TEXT NOT NULL,
  selected_package TEXT NOT NULL,
  preferred_days TEXT,
  preferred_time TEXT,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'Pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.students TO authenticated;
GRANT INSERT ON public.students TO anon;
GRANT ALL ON public.students TO service_role;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone can enroll" ON public.students FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "admin manage students" ON public.students FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "admin update students" ON public.students FOR UPDATE TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "admin delete students" ON public.students FOR DELETE TO authenticated USING (public.is_admin(auth.uid()));

-- Lesson packages
CREATE TABLE public.lesson_packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  package_name TEXT NOT NULL,
  price INT NOT NULL,
  description TEXT,
  features JSONB DEFAULT '[]'::jsonb,
  location TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  sort_order INT DEFAULT 0,
  badge TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.lesson_packages TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.lesson_packages TO authenticated;
GRANT ALL ON public.lesson_packages TO service_role;
ALTER TABLE public.lesson_packages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read packages" ON public.lesson_packages FOR SELECT TO anon, authenticated USING (active = true OR public.is_admin(auth.uid()));
CREATE POLICY "admin write packages" ON public.lesson_packages FOR ALL TO authenticated
  USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- Testimonials
CREATE TABLE public.testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT,
  testimonial TEXT NOT NULL,
  image_url TEXT,
  rating INT DEFAULT 5,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.testimonials TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.testimonials TO authenticated;
GRANT ALL ON public.testimonials TO service_role;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read testimonials" ON public.testimonials FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "admin write testimonials" ON public.testimonials FOR ALL TO authenticated
  USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- Gallery
CREATE TABLE public.gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT,
  category TEXT,
  image_url TEXT NOT NULL,
  description TEXT,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.gallery TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.gallery TO authenticated;
GRANT ALL ON public.gallery TO service_role;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read gallery" ON public.gallery FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "admin write gallery" ON public.gallery FOR ALL TO authenticated
  USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- Blog
CREATE TABLE public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL,
  excerpt TEXT,
  featured_image TEXT,
  meta_title TEXT,
  meta_description TEXT,
  category TEXT,
  author TEXT,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.blog_posts TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.blog_posts TO authenticated;
GRANT ALL ON public.blog_posts TO service_role;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read published" ON public.blog_posts FOR SELECT TO anon, authenticated
  USING (published = true OR public.is_admin(auth.uid()));
CREATE POLICY "admin write blog" ON public.blog_posts FOR ALL TO authenticated
  USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- Contact messages
CREATE TABLE public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'New',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT INSERT ON public.contact_messages TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.contact_messages TO authenticated;
GRANT ALL ON public.contact_messages TO service_role;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone send message" ON public.contact_messages FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "admin read messages" ON public.contact_messages FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "admin update messages" ON public.contact_messages FOR UPDATE TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "admin delete messages" ON public.contact_messages FOR DELETE TO authenticated USING (public.is_admin(auth.uid()));

-- Consultations
CREATE TABLE public.consultations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  preferred_package TEXT,
  preferred_date DATE,
  preferred_time TEXT,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'Pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT INSERT ON public.consultations TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.consultations TO authenticated;
GRANT ALL ON public.consultations TO service_role;
ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone book consult" ON public.consultations FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "admin read consults" ON public.consultations FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "admin update consults" ON public.consultations FOR UPDATE TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "admin delete consults" ON public.consultations FOR DELETE TO authenticated USING (public.is_admin(auth.uid()));

-- Seed default packages
INSERT INTO public.lesson_packages (package_name, price, description, features, location, sort_order, badge) VALUES
('Physical Hub Lessons', 30000, 'Perfect for hands-on practical learning at our physical hub.',
  '["Access to premium instruments and learning gear","Face-to-face mentorship","Hands-on technique correction","Safe premium learning environment","Distraction-free atmosphere"]'::jsonb,
  'Uyo, Akwa Ibom State, Nigeria', 1, NULL),
('Premium Home Lessons', 50000, 'Maximum convenience and personalized attention right in your home.',
  '["Instructor travels directly to student","100% personalized attention","No travel stress for parents","Flexible learning pace","Tailored growth plan"]'::jsonb,
  'Uyo Environment', 2, 'Most Popular'),
('Interactive Virtual Lessons', 60000, 'Premium virtual lessons for international and long-distance students.',
  '["Multi-camera teaching setup","Flexible scheduling","Lesson recordings","Assignment tracking","Digital learning resources"]'::jsonb,
  'Worldwide', 3, NULL);

INSERT INTO public.testimonials (name, role, testimonial, rating, featured) VALUES
('Mrs. Adeyemi', 'Parent', 'My daughter has blossomed since joining FutureKeys. The instructors are patient, professional, and truly invested in each child.', 5, true),
('David Okon', 'Adult Student', 'I started from zero at 32. Six months in, I''m playing songs I never thought possible. Best decision I made.', 5, true),
('Mrs. Johnson', 'Parent (UK)', 'The virtual lessons are exceptional. My son in Scotland gets the same quality as kids in Uyo. Truly world-class.', 5, true);
