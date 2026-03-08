import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

Deno.serve(async (req) => {
  const supabaseAdmin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const email = "team@remotelaborlink.com";
  const password = "witgub-poszuD-9mawvy";

  // Create user
  const { data: user, error: createErr } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { app_role: "admin" },
  });

  if (createErr) {
    // If user already exists, find and update role
    if (createErr.message?.includes("already been registered")) {
      const { data: { users } } = await supabaseAdmin.auth.admin.listUsers();
      const existing = users?.find((u: any) => u.email === email);
      if (existing) {
        // Ensure admin role exists
        await supabaseAdmin.from("user_roles").upsert(
          { user_id: existing.id, role: "admin" },
          { onConflict: "user_id,role" }
        );
        return new Response(JSON.stringify({ success: true, message: "Existing user updated to admin" }));
      }
    }
    return new Response(JSON.stringify({ error: createErr.message }), { status: 400 });
  }

  // The trigger should auto-assign admin role from metadata, but ensure it
  if (user?.user) {
    await supabaseAdmin.from("user_roles").upsert(
      { user_id: user.user.id, role: "admin" },
      { onConflict: "user_id,role" }
    );
  }

  return new Response(JSON.stringify({ success: true, message: "Admin user created" }));
});
