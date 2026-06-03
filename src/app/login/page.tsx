'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

// 🌐 Safe browser-side instance using your public anon keys
const supabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    try {
      // 1. Sign in via Supabase Auth
      const { data, error } = await supabaseClient.auth.signInWithPassword({ 
        email, 
        password 
      });

      if (error) {
        throw new Error(error.message);
      }

      // 2. Clear credentials and route straight to the admin command center
      if (data?.user && data?.session) {
        document.cookie = `sb-access-token=${data.session.access_token}; path=/; max-age=${data.session.expires_in}; SameSite=Lax; Secure`;
        router.push('/admin/dashboard');
        router.refresh(); 
      }
    } catch (err: any) {
      console.error('Authentication failure:', err.message);
      setErrorMessage(err.message || 'Invalid authentication credentials provided.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center justify-center p-6 bg-grid-pattern bg-[size:30px_30px]">
      
      <div className="max-w-md w-full bg-white border border-slate-200/80 rounded-3xl p-8 shadow-xl">
        
        {/* Branding Header */}
        <div className="text-center mb-8">
          <span className="text-[10px] font-black tracking-[0.3em] text-[#A27B2C] uppercase block mb-1">
            Steins Academy
          </span>
          <h1 className="text-2xl font-black text-[#001D4A] tracking-tight">
            Dashboard Access
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Authorized Personnel Authentication 
          </p>
        </div>

        {/* Error Alert Box */}
        {errorMessage && (
          <div className="mb-5 p-4 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 text-xs font-semibold leading-relaxed">
            ⚠️ {errorMessage}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
               Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@steins.inc"
              className="w-full text-sm px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#001D4A]/20 focus:border-[#001D4A] transition-all text-slate-800"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Secure Key Token
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full text-sm px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#001D4A]/20 focus:border-[#001D4A] transition-all text-slate-800"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#001D4A] hover:bg-[#A27B2C] disabled:bg-slate-300 text-white font-bold text-xs py-4 px-4 rounded-xl transition-all shadow-md tracking-wider uppercase mt-2 flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Authorizing...
              </span>
            ) : (
              'Establish Connection'
            )}
          </button>
        </form>
      </div>

      <p className="text-[10px] font-medium text-slate-400 mt-6 tracking-widest uppercase">
        Security Layer • Node Alpha Secured
      </p>
    </div>
  );
}