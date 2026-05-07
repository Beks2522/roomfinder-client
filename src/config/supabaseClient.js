import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zgmdzugsepukgymqhfjc.supabase.co'; 
const supabaseAnonKey = 'sb_publishable_bAlIaSTjeTAqHJR77CelFg_sikqKwjp';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;