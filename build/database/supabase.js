"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supabase = void 0;
var supabase_js_1 = require("@supabase/supabase-js");
require("dotenv/config");
var options = {
    schema: "public",
    headers: { "x-cubecave": "cubecave-app" },
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
};
var supabaseUrl = process.env.SUPABASE_URL;
var supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
var supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseAnonKey, options);
exports.supabase = supabase;
