import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { notFound } from 'next/navigation';
import { getSupabaseServer } from '@/lib/supabase';

// Keep email entries entirely lowercase for standard matching
const CORE_TEAM_WHITELIST = [
  'steinsincoprations@gmail.com',
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 1. Retrieve the cookie container from the incoming browser request
  const cookieStore = cookies();
  const token = cookieStore.get('sb-access-token')?.value;

  // Guard: If no cookie token exists, send them back to the gate
  if (!token) {
    console.warn('🔒 Guard Intercept: No token cookie found.');
    redirect('/login');
  }

  const supabaseServer = getSupabaseServer();
  
  // 2. Pass the token directly into getUser() so the server authenticates this specific session
  const { data: { user }, error } = await supabaseServer.auth.getUser(token);

  // Guard: If Supabase rejects the token or user object is missing
  if (error || !user) {
    console.error('🔒 Guard Intercept: Token verification failed.');
    redirect('/login');
  }

  // 3. Normalize strings and execute the core infrastructure whitelist filter
  const userEmail = user.email?.toLowerCase() || '';
  const isCoreTeam = CORE_TEAM_WHITELIST.includes(userEmail);

  // Guard: If authenticated but unauthorized, trigger the stealth 404
  if (!isCoreTeam) {
    console.error(`🚫 Access Denied: ${userEmail} is not registered in the core team vault.`);
    notFound();
  }

  // 4. Clean clearance achieved
  return (
    <div className="min-h-screen bg-[#fafafa]">
      <main className="p-6 md:p-10">
        {children}
      </main>
    </div>
  );
}