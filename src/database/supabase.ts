import { createClient } from "@supabase/supabase-js";
import "dotenv/config";

const options = {
  schema: "public",
  headers: { "x-cubecave": "cubecave-app" },
  autoRefreshToken: true,
  persistSession: true,
  detectSessionInUrl: true,
};

const supabaseUrl = process.env.SUPABASE_URL as string;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY as string;

const supabase = createClient(supabaseUrl, supabaseAnonKey, options);

export { supabase };
