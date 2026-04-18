
-- Create site_visits table
CREATE TABLE IF NOT EXISTS public.site_visits (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    page_url TEXT NOT NULL,
    referrer TEXT,
    user_agent TEXT,
    session_id TEXT,
    country TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.site_visits ENABLE ROW LEVEL SECURITY;

-- Allow public to insert (required for tracking from edge function if it doesn't use service role, 
-- but we'll use service role in edge function for country logic, so we can keep it strict)
-- Actually, for simplicity and to allow direct frontend fallback if needed:
CREATE POLICY "Enable insert for everyone" ON public.site_visits FOR INSERT WITH CHECK (true);

-- Allow admins to view
CREATE POLICY "Enable select for authenticated users" ON public.site_visits FOR SELECT TO authenticated USING (true);

-- Create index for performance on analytics queries
CREATE INDEX IF NOT EXISTS idx_site_visits_created_at ON public.site_visits(created_at);
CREATE INDEX IF NOT EXISTS idx_site_visits_page_url ON public.site_visits(page_url);
