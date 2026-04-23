

## Plan: Make country tracking work in Analytics

### Problem
All 215 visits in `site_visits` are recorded as `"Unknown"`. The `track-visit` edge function reads `x-country-code` from request headers, but Supabase Edge Runtime does not inject that header (that's a Cloudflare-specific header on the user's CDN, not on the function call). Result: country column is always `"Unknown"`, so the "Top Countries" chart in Admin Analytics shows nothing useful.

### Solution
Resolve country server-side from the client IP using a free, no-auth IP geolocation service. Country detection will happen inside the `track-visit` edge function — no client changes needed.

### Implementation

**1. Update `supabase/functions/track-visit/index.ts`**

- Extract the real client IP from standard proxy headers (in priority order):
  - `cf-connecting-ip`
  - `x-forwarded-for` (first entry)
  - `x-real-ip`
- Call `https://ipapi.co/<ip>/country_name/` (free, no API key, ~30k req/month) to resolve the country name.
- Fallback chain: ipapi result → `cf-ipcountry` header (if present) → `"Unknown"`.
- Skip lookup for localhost/private IPs (`127.0.0.1`, `::1`, `10.*`, `192.168.*`).
- Wrap geolocation in try/catch with a short timeout (3s) so a slow lookup never blocks visit insertion.
- Insert visit with the resolved `country`.

**2. Backfill existing rows (optional, but recommended)**

Existing 215 rows have `country = "Unknown"` and no IP stored, so we cannot retroactively geolocate them. They'll stay as "Unknown" and naturally age out. Going forward, all new visits will have proper country data.

**3. No frontend changes required**

`AdminAnalytics.tsx` already reads `country` from `site_visits` and renders the "Top Países" pie chart. Once the function writes real values, the chart will populate automatically.

### Files changed
- `supabase/functions/track-visit/index.ts` — add IP extraction + ipapi.co lookup
- Deploy the function after the edit

### Notes
- ipapi.co free tier: 1,000 requests/day, 30,000/month — sufficient for this site's traffic.
- If you'd prefer a different provider (ipinfo.io, ip-api.com) or want to cache by IP to reduce calls, let me know before I implement.

