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
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { type, user_id, content, metadata } = await req.json();

    // Create in-app notification
    const { error: notifError } = await supabase.from("notifications").insert({
      user_id,
      type,
      content,
    });

    if (notifError) {
      console.error("Notification insert error:", notifError);
    }

    // Log the notification event (email would be sent here with a proper email service)
    console.log(`Notification sent: type=${type}, user=${user_id}, content=${content}`);

    return new Response(
      JSON.stringify({ success: true, message: "Notification created" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
