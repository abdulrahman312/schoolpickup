import { createClient } from '@supabase/supabase-js';

// Hardcoded credentials as requested by the user
const SUPABASE_URL = 'https://nytydgmbtshgslkedjwe.supabase.co';
const SUPABASE_KEY = 'sb_publishable_uqZqdXCP57USsTzP93uF1A_y9q3yEbx';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);