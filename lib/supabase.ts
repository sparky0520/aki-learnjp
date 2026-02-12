import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
// Prioritize the secret key (server-side only) for admin access, 
// otherwise use the publishable key (safe for client-side).
const supabaseKey = process.env.SUPABASE_SECRET_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "";

if (!supabaseUrl || !supabaseKey) {
  console.warn("Supabase credentials missing. Please check your environment variables:");
  if (!supabaseUrl) console.warn(" - NEXT_PUBLIC_SUPABASE_URL is missing");
  if (!supabaseKey) console.warn(" - SUPABASE_SECRET_KEY and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY are both missing");
}

export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseKey || "placeholder-key",
);
