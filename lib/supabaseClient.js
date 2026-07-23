import { createClient } from '@supabase/supabase-js';

// Public client — safe to use in the browser. Respects Row Level Security.
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mock.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'mock-anon-key'
);

// Admin client — SERVER-SIDE ONLY. Never import this in a browser-facing
// component. Used by API routes (webhook, access check) to bypass RLS
// when writing verified NDA records.
export function getSupabaseAdmin() {
  const { createClient: createAdminClient } = require('@supabase/supabase-js');
  return createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mock.supabase.co',
    process.env.SUPABASE_SERVICE_ROLE_KEY || 'mock-service-role-key'
  );
}
