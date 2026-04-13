import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    // Get the caller's user from the JWT
    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data: { user: caller }, error: callerError } = await supabaseClient.auth.getUser(token);

    if (callerError || !caller) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders });
    }

    // Check if caller is admin
    const { data: profile, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("role")
      .eq("email", caller.email)
      .maybeSingle();

    if (profileError || profile?.role !== "admin") {
      return new Response(JSON.stringify({ error: "Forbidden: Only admins can manage users" }), { status: 403, headers: corsHeaders });
    }

    const { action, email, password, role, userId } = await req.json();

    if (action === "create_user") {
      if (!email || !password) {
        return new Response(JSON.stringify({ error: "Email and password are required" }), { status: 400, headers: corsHeaders });
      }

      const { data: userData, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });

      if (createError) throw createError;

      // Create profile
      const { error: pError } = await supabaseAdmin
        .from("profiles")
        .insert({ email, role: role || "user" });

      if (pError) throw pError;

      return new Response(JSON.stringify({ success: true, user: userData.user }), { headers: corsHeaders });
    } 
    
    if (action === "update_password") {
      if (!email || !password) {
        return new Response(JSON.stringify({ error: "Email and password are required" }), { status: 400, headers: corsHeaders });
      }

      // Find user by email to get ID
      const { data: users, error: listError } = await supabaseAdmin.auth.admin.listUsers();
      if (listError) throw listError;

      const user = users.users.find(u => u.email === email);
      if (!user) {
        return new Response(JSON.stringify({ error: "User not found in Auth" }), { status: 404, headers: corsHeaders });
      }

      const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(user.id, {
        password,
      });

      if (updateError) throw updateError;

      return new Response(JSON.stringify({ success: true }), { headers: corsHeaders });
    }

    if (action === "update_role") {
      if (!email || !role) {
        return new Response(JSON.stringify({ error: "Email and role are required" }), { status: 400, headers: corsHeaders });
      }

      const { error: updateError } = await supabaseAdmin
        .from("profiles")
        .update({ role })
        .eq("email", email);

      if (updateError) throw updateError;

      return new Response(JSON.stringify({ success: true }), { headers: corsHeaders });
    }

    return new Response(JSON.stringify({ error: "Invalid action" }), { status: 400, headers: corsHeaders });

  } catch (error) {
    console.error("Function error:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: corsHeaders });
  }
});
