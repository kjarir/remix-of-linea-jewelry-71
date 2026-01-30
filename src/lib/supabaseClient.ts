import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "❌ Supabase environment variables are missing!\n" +
    "Please ensure you have:\n" +
    "1. Created a .env.local file in the root directory\n" +
    "2. Added VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY\n" +
    "3. Restarted your dev server (npm run dev)\n\n" +
    "Current values:\n" +
    `VITE_SUPABASE_URL: ${supabaseUrl ? "✅ Set" : "❌ Missing"}\n` +
    `VITE_SUPABASE_ANON_KEY: ${supabaseAnonKey ? "✅ Set" : "❌ Missing"}`
  );
}

export const supabase = createClient(
  supabaseUrl || "",
  supabaseAnonKey || ""
);

