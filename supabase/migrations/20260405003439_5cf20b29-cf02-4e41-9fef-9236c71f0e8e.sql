
-- User roles enum and table
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

-- Drop old permissive policies and replace with admin-only
DROP POLICY "Authenticated users can insert tours" ON public.tours;
DROP POLICY "Authenticated users can update tours" ON public.tours;
DROP POLICY "Authenticated users can delete tours" ON public.tours;

CREATE POLICY "Admins can insert tours" ON public.tours FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update tours" ON public.tours FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete tours" ON public.tours FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY "Authenticated users can insert pages" ON public.pages;
DROP POLICY "Authenticated users can update pages" ON public.pages;
DROP POLICY "Authenticated users can delete pages" ON public.pages;

CREATE POLICY "Admins can insert pages" ON public.pages FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update pages" ON public.pages FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete pages" ON public.pages FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY "Authenticated users can insert site images" ON public.site_images;
DROP POLICY "Authenticated users can update site images" ON public.site_images;
DROP POLICY "Authenticated users can delete site images" ON public.site_images;

CREATE POLICY "Admins can insert site images" ON public.site_images FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update site images" ON public.site_images FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete site images" ON public.site_images FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY "Authenticated users can insert social media" ON public.social_media;
DROP POLICY "Authenticated users can update social media" ON public.social_media;
DROP POLICY "Authenticated users can delete social media" ON public.social_media;

CREATE POLICY "Admins can insert social media" ON public.social_media FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update social media" ON public.social_media FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete social media" ON public.social_media FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY "Authenticated users can upload site images" ON storage.objects;
DROP POLICY "Authenticated users can update site images" ON storage.objects;
DROP POLICY "Authenticated users can delete site images" ON storage.objects;

CREATE POLICY "Admins can upload site images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'site-images' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update site images storage" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'site-images' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete site images storage" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'site-images' AND public.has_role(auth.uid(), 'admin'));

-- Auto-assign admin role trigger for first user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Auto-assign admin role
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
