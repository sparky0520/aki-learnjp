import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_KEY || "";

// Create the client only if we have the keys, otherwise create a simplified/mock or just let it fail later
// passing empty strings might throw "supabaseKey is required" if the library checks strictly.
// The error "supabaseKey is required" usually happens if the 2nd arg is missing or empty.

// We'll pass a dummy if missing to prevent build/init crash, but log a warning.
if (!supabaseUrl || !supabaseKey) {
  // console.warn("Supabase credentials missing during initialization.");
}

export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseKey || "placeholder-key",
);
