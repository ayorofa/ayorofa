import { createClient } from '@supabase/supabase-js';
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
// Client navigateur. Null si les variables ne sont pas encore configurées (évite un crash au build).
export const supabase = url && key ? createClient(url, key) : null;
