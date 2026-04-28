import { createClient } from '@supabase/supabase-js';
const s = createClient(
  "https://mwxbskzggzznxvkwgrnz.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13eGJza3pnZ3p6bnh2a3dncm56Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzNjE5OTUsImV4cCI6MjA4ODkzNzk5NX0.EFfaaN79uifOMgFdIZlQ5C8c-HQH-YodNGWf0MEcf9o"
);
const { data, error } = await s.from('matches').select('*').limit(2);
if (error) { console.log(error); } else {
  console.log("COLUNAS:", Object.keys(data[0]||{}));
  console.log("EXEMPLO:", JSON.stringify(data[0], null, 2));
}
