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

    // Verify user is admin
    const { data: isAdmin, error: adminError } = await supabaseClient
      .from("admins")
      .select("user_id")
      .eq("user_id", user.id)
      .single();

    if (adminError || !isAdmin) {
      throw new Error("Unauthorized: Admin access required");
    }

    const { withdrawal_id, tx_hash } = await req.json();

    if (!withdrawal_id || !tx_hash) {
      throw new Error("Missing required fields: withdrawal_id, tx_hash");
    }

    // Get withdrawal details
    const { data: withdrawal, error: withdrawalError } = await supabaseClient
      .from("withdrawals")
      .select("*")
      .eq("id", withdrawal_id)
      .single();

    if (withdrawalError || !withdrawal) {
      throw new Error(`Withdrawal not found: ${withdrawalError?.message || "Unknown error"}`);
    }

    if (withdrawal.status !== "pending") {
      throw new Error(`Withdrawal already ${withdrawal.status}`);
    }

    // Get current balance
    const { data: balance, error: balanceError } = await supabaseClient
      .from("balances")
      .select("*")
      .eq("user_id", withdrawal.user_id)
      .eq("token", withdrawal.token)
      .single();

    if (balanceError || !balance) {
      throw new Error(`Balance not found: ${balanceError?.message || "Unknown error"}`);
    }

    const currentBalance = parseFloat(balance.amount);
    const withdrawAmount = parseFloat(withdrawal.amount);

    if (currentBalance < withdrawAmount) {
      throw new Error(`Insufficient balance: ${currentBalance} < ${withdrawAmount}`);
    }

    // Update withdrawal status
    const { error: updateWithdrawalError } = await supabaseClient
      .from("withdrawals")
      .update({
        status: "completed",
        tx_hash,
        processed_at: new Date().toISOString(),
      })
      .eq("id", withdrawal_id);

    if (updateWithdrawalError) {
      throw new Error(`Failed to update withdrawal: ${updateWithdrawalError.message}`);
    }

    // Deduct from balance
    const newAmount = currentBalance - withdrawAmount;
    const { error: updateBalanceError } = await supabaseClient
      .from("balances")
      .update({ amount: newAmount })
      .eq("user_id", withdrawal.user_id)
      .eq("token", withdrawal.token);

    if (updateBalanceError) {
      throw new Error(`Failed to update balance: ${updateBalanceError.message}`);
    }

    // Create transaction record
    const { error: txError } = await supabaseClient.from("transactions").insert({
      user_id: withdrawal.user_id,
      type: "withdraw",
      token: withdrawal.token,
      amount: withdrawAmount,
      status: "completed",
      tx_hash,
    });

    if (txError) {
      throw new Error(`Failed to create transaction record: ${txError.message}`);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Withdrawal approved and processed",
        withdrawal_id,
        new_balance: newAmount
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in approve_withdrawal:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
    );
  }
});
