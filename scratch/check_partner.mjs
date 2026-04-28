import { createClient } from '@supabase/supabase-js';
const s = createClient(
  "https://mwxbskzggzznxvkwgrnz.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13eGJza3pnZ3p6bnh2a3dncm56Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzNjE5OTUsImV4cCI6MjA4ODkzNzk5NX0.EFfaaN79uifOMgFdIZlQ5C8c-HQH-YodNGWf0MEcf9o"
);
// tentar tabelas que possivelmente tenham setores
for (const t of ['sectors','match_sectors','match_packages','packages','options','match_options','prices','match_prices']) {
  const { data, error } = await s.from(t).select('*').limit(1);
  console.log(t, '->', error ? error.message : `OK (${data.length} rows)`, data && data[0] ? Object.keys(data[0]) : '');
}
