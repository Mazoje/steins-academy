import React from 'react';

export default function DashboardPage() {
  return (
    <main className="relative min-h-screen bg-[#F8F9FA] bg-grid-pattern bg-[size:40px_40px] flex flex-col items-center justify-center px-4 overflow-hidden">
      
      {/* Background Radial Glow Effect */}
      <div className="absolute inset-0 distribution-glow pointer-events-none" />

      {/* Main Structural Status Container Box */}
      <div className="bg-white border border-slate-200 p-8 rounded-2xl shadow-xl shadow-slate-100/40 text-center max-w-md w-full z-10 relative">
        
        {/* Success Visual Badge Indicator */}
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 mb-6 font-bold text-lg">
          ✓
        </div>

        <span className="text-[10px] font-black tracking-[0.2em] text-[#A27B2C] uppercase block mb-1">
          Verification Confirmed
        </span>
        
        <h1 className="text-2xl font-black text-[#001D4A] tracking-tight uppercase mb-3">
          Enrollment Successful
        </h1>
        
        <p className="text-slate-500 text-xs leading-relaxed max-w-xs mx-auto mb-8">
          Your payment transaction has been logged securely within our local engine. Your course portal access credentials and resource schedules are being compiled.
        </p>

        {/* Action Router Links */}
        <div className="space-y-2">
          <a 
            href="/"
            className="block w-full bg-[#001D4A] hover:bg-opacity-95 text-white py-3 rounded-xl font-bold text-xs tracking-wider uppercase transition-all text-center"
          >
            Return to Academy Hub
          </a>
          
          <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest pt-2">
            Steins Core Automated Infrastructure
          </div>
        </div>

      </div>
    </main>
  );
}