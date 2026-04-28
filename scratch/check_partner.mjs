import { createClient } from '@supabase/supabase-js';
const s = createClient(
  "https://mwxbskzggzznxvkwgrnz.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13eGJza3pnZ3p6bnh2a3dncm56Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzNjE5OTUsImV4cCI6MjA4ODkzNzk5NX0.EFfaaN79uifOMgFdIZlQ5C8c-HQH-YodNGWf0MEcf9o"
);
for (const t of ['package_types','packages_types','package_type']) {
  const { data, error } = await s.from(t).select('*').limit(5);
  console.log(t,'->', error?error.message:JSON.stringify(data,null,2));
}
// Pegar match flamengo x vasco e seus packages
const { data: m } = await s.from('matches').select('id,slug,home_team,away_team').ilike('slug','%flamengo%vasco%').limit(3);
console.log('\nMatches flamengo x vasco:', m);
if (m && m[0]) {
  const { data: pkgs } = await s.from('match_packages').select('*').eq('match_id', m[0].id);
  console.log('\nPackages:', JSON.stringify(pkgs,null,2));
}
