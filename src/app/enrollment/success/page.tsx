import Link from 'next/link';

export default function EnrollmentSuccessPage() {
  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center justify-center p-6 bg-grid-pattern bg-[size:30px_30px]">
      
      {/* Success Content Box */}
      <div className="max-w-md w-full bg-white border border-slate-200/80 rounded-3xl p-8 shadow-xl text-center flex flex-col items-center">
        
        {/* Animated Check Icon */}
        <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center text-3xl font-bold mb-6 animate-bounce">
          ✓
        </div>

        <span className="text-[10px] font-black tracking-[0.2em] text-[#A27B2C] uppercase mb-2">
          Registration Complete
        </span>
        
        <h1 className="text-2xl font-black text-[#001D4A] tracking-tight mb-3">
          Seat Secured Successfully!
        </h1>
        
        <p className="text-slate-500 text-sm leading-relaxed mb-8">
          Your payment has been fully verified. We have generated your portal tracking token and sent your learning schedule to your inbox.
        </p>

        <div className="w-full flex flex-col gap-3">
          <Link 
            href="/" 
            className="w-full bg-[#001D4A] hover:bg-[#A27B2C] text-white font-bold text-xs py-3.5 px-4 rounded-xl transition-all shadow-md tracking-wider uppercase"
          >
            Return to Main Hub
          </Link>
        </div>
      </div>

      {/* Decorative Branding Subtext */}
      <p className="text-[10px] font-medium text-slate-400 mt-6 tracking-widest uppercase">
        Steins Academy • Infrastructure Engine
      </p>
    </div>
  );
}