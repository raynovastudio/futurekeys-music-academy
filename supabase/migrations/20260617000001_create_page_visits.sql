CREATE TABLE public.page_visits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  path text NOT NULL,
  referrer text,
  user_agent text,
  ip_address text,
  country text,
  city text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Allow anyone to insert (for tracking)
CREATE POLICY "Allow anon insert page_visits"
  ON public.page_visits FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Only admins can select
CREATE POLICY "Allow admin select page_visits"
  ON public.page_visits FOR SELECT
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- Auto-create is_admin function if missing
CREATE OR REPLACE FUNCTION public.is_admin(_user_id uuid)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  RETURN EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = 'super_admin');
END;
$$;

-- Enable RLS
ALTER TABLE public.page_visits ENABLE ROW LEVEL SECURITY;
