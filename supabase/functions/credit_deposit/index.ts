import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
    );

    // Verify authentication and get user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Missing authorization header");
    }

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      throw new Error("Unauthorized: Invalid or expired token");
    }

    // Verify user is admin (only admins can credit deposits manually)
    const { data: isAdmin, error: adminError } = await supabaseClient
      .from("admins")
      .select("user_id")
      .eq("user_id", user.id)
      .single();

    if (adminError || !isAdmin) {
      throw new Error("Unauthorized: Admin access required");
    }

    const { target_user_id, token, amount, tx_hash } = await req.json();

    if (!target_user_id || !token || !amount || !tx_hash) {
      throw new Error("Missing required fields: target_user_id, token, amount, tx_hash");
    }

    // Validate amount
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      throw new Error("Invalid amount");
    }

    // Update or create balance using transaction
    const { data: balance, error: selectError } = await supabaseClient
      .from("balances")
      .select("*")
      .eq("user_id", target_user_id)
      .eq("token", token)
      .single();

    if (selectError && selectError.code !== "PGRST116") {
      throw new Error(`Failed to fetch balance: ${selectError.message}`);
    }

    if (balance) {
      const newAmount = parseFloat(balance.amount) + numAmount;
      const { error: updateError } = await supabaseClient
        .from("balances")
        .update({ amount: newAmount })
        .eq("user_id", target_user_id)
        .eq("token", token);

      if (updateError) {
        throw new Error(`Failed to update balance: ${updateError.message}`);
      }
    } else {
      const { error: insertError } = await supabaseClient
        .from("balances")
        .insert({ user_id: target_user_id, token, amount: numAmount });

      if (insertError) {
        throw new Error(`Failed to create balance: ${insertError.message}`);
      }
    }

    // Create transaction record
    const { error: txError } = await supabaseClient.from("transactions").insert({
      user_id: target_user_id,
      type: "deposit",
      token,
      amount: numAmount,
      status: "completed",
      tx_hash,
    });

    if (txError) {
      throw new Error(`Failed to create transaction record: ${txError.message}`);
    }

    return new Response(
      JSON.stringify({ success: true, message: "Deposit credited successfully" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in credit_deposit:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
    );
  }
});
