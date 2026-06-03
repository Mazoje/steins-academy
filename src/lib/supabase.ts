import { createClient } from '@supabase/supabase-js';

// 🔒 Wrap initialization inside a function so it NEVER executes on the client-side browser
export function getSupabaseServer() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (typeof window !== 'undefined') {
    throw new Error('❌ Security Violation: Cannot instantiate supabaseServer on the client browser.');
  }

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('❌ Server Environment Error: Missing Supabase keys in environment variables.');
  }
  
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}