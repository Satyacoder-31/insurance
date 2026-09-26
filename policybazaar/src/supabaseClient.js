import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://xqhntbozubabmsweewto.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhxaG50Ym96dWJhYm1zd2Vld3RvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA0MDY0NjYsImV4cCI6MjEwNTk4MjQ2Nn0.GwIHGbooMIRBvTw7v0eNDd-DvCsFo8hLbOeeE0lfez0";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Register a new user in Supabase
 */
export const registerUserInSupabase = async ({ name, phoneNumber, password, email = "" }) => {
  try {
    // Check if user already exists
    const { data: existingUser, error: checkError } = await supabase
      .from("users")
      .select("phone_number")
      .eq("phone_number", phoneNumber)
      .maybeSingle();

    if (checkError) {
      console.error("Supabase check error:", checkError);
    }

    if (existingUser) {
      return { success: false, message: "User with this phone number is already registered. Please sign in." };
    }

    // Insert user
    const { data, error } = await supabase
      .from("users")
      .insert([
        {
          name,
          phone_number: phoneNumber,
          password,
          email: email || `${phoneNumber}@safelife.com`,
          created_at: new Date().toISOString(),
          last_login: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      return { success: false, message: error.message || "Failed to register user." };
    }

    return { success: true, user: data };
  } catch (err) {
    console.error("Unexpected register error:", err);
    return { success: false, message: "Network error. Please try again." };
  }
};

/**
 * Login user via Supabase
 */
export const loginUserWithSupabase = async (phoneNumber, password) => {
  try {
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("phone_number", phoneNumber)
      .maybeSingle();

    if (error) {
      console.error("Supabase query error:", error);
      return { success: false, message: "Error contacting authentication server." };
    }

    if (!user) {
      return { success: false, message: "Phone number not registered. Please sign up first." };
    }

    if (user.password !== password) {
      return { success: false, message: "Incorrect password. Please re-enter and try again." };
    }

    // Update last_login
    await supabase
      .from("users")
      .update({ last_login: new Date().toISOString() })
      .eq("id", user.id);

    return {
      success: true,
      user: {
        isAuth: true,
        id: user.id,
        name: user.name,
        phoneNumber: user.phone_number,
        email: user.email,
      },
    };
  } catch (err) {
    console.error("Unexpected login error:", err);
    return { success: false, message: "Network error. Please check your connection." };
  }
};

/**
 * Store user policy quote / purchase in Supabase
 */
export const recordUserPolicy = async ({ userPhone, userName, policyType, insurerName, planName, premium }) => {
  try {
    const { data, error } = await supabase.from("user_policies").insert([
      {
        user_phone: userPhone,
        user_name: userName,
        policy_type: policyType,
        insurer_name: insurerName,
        plan_name: planName,
        premium: Number(premium) || 0,
        status: "Active",
        created_at: new Date().toISOString(),
      },
    ]);

    if (error) throw error;
    return { success: true, data };
  } catch (err) {
    console.error("Failed to record policy in Supabase:", err);
    return { success: false, error: err };
  }
};
