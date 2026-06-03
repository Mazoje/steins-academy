'use client';

import React, { useState } from 'react';

interface RegistrationModalProps {
  courseId: string;
  courseTitle: string;
  price: number;
  onClose: () => void;
}

export default function RegistrationModal({ courseId, courseTitle, price, onClose }: RegistrationModalProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ fullName: '', email: '', phone: '' });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePaymentInitialization = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/payments/paystack', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId,
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Server gateway handshake rejected.');
      }

      const data = await response.json();

      if (data?.authorization_url) {
        // Safe top-level redirection to open the Paystack Sandbox layout with explicit null guarding
        if (window.top) {
          window.top.location.href = data.authorization_url;
        } else {
          window.location.href = data.authorization_url;
        }
      } else {
        throw new Error(data.error || 'Empty authorization routing sequence returned.');
      }
    } catch (error: any) {
      console.error('Handshake execution issue:', error);
      alert(`Portal Error: ${error.message || 'Check local server engine terminal logs.'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#001D4A]/40 backdrop-blur-xs p-4">
      <div className="bg-[#F8F9FA] border border-slate-200 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden relative flex flex-col z-50">
        
        <div className="bg-white border-b border-slate-200 p-5 flex justify-between items-center">
          <div>
            <span className="text-[9px] font-black tracking-[0.2em] text-[#A27B2C] uppercase block">Secure Portal</span>
            <h2 className="text-sm font-bold text-[#001D4A] mt-0.5 truncate max-w-[280px]">{courseTitle}</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-[#001D4A] text-sm font-bold transition-colors cursor-pointer">✕</button>
        </div>

        <div className="p-5 flex-1 bg-grid-pattern bg-[size:30px_30px]">
          {step === 1 ? (
            <div className="space-y-4 bg-white p-5 border border-slate-200 rounded-xl">
              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Full Name</label>
                <input type="text" name="fullName" placeholder="John Doe" value={formData.fullName} onChange={handleInputChange} className="w-full bg-white border border-slate-200 px-3 py-2.5 rounded-lg text-xs font-medium text-[#001D4A] outline-none" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Email Address</label>
                <input type="email" name="email" placeholder="john@company.com" value={formData.email} onChange={handleInputChange} className="w-full bg-white border border-slate-200 px-3 py-2.5 rounded-lg text-xs font-medium text-[#001D4A] outline-none" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Phone Number</label>
                <input type="tel" name="phone" placeholder="+234..." value={formData.phone} onChange={handleInputChange} className="w-full bg-white border border-slate-200 px-3 py-2.5 rounded-lg text-xs font-medium text-[#001D4A] outline-none" />
              </div>
            </div>
          ) : (
            <div className="bg-white p-6 border border-slate-200 rounded-xl text-center">
              <span className="text-[9px] font-bold tracking-widest text-slate-400 uppercase block mb-1">Total Fee Summary</span>
              <div className="text-2xl font-black text-[#001D4A]">₦{price.toLocaleString()}</div>
              <p className="text-[11px] text-slate-400 mt-2 max-w-xs mx-auto leading-relaxed">
                Clicking authorize will handoff authorization securely to our sandbox gateway engine.
              </p>
            </div>
          )}
        </div>

        <div className="bg-white border-t border-slate-200 p-5 flex items-center justify-between gap-4">
          <div>
            <span className="text-[8px] font-bold uppercase tracking-wider text-slate-400 block">Subtotal</span>
            <span className="text-sm font-extrabold text-[#001D4A]">₦{price.toLocaleString()}</span>
          </div>

          {step === 1 ? (
            <button
              disabled={!formData.fullName || !formData.email || !formData.phone}
              onClick={() => setStep(2)}
              className="bg-[#001D4A] text-white text-[10px] font-bold px-5 py-2.5 rounded-xl tracking-wider disabled:opacity-30 cursor-pointer"
            >
              CONTINUE
            </button>
          ) : (
            <div className="flex gap-2">
              <button onClick={() => setStep(1)} className="border border-slate-200 text-slate-500 text-[10px] font-bold px-4 py-2.5 rounded-xl cursor-pointer">BACK</button>
              <button
                disabled={loading}
                onClick={handlePaymentInitialization}
                className="bg-[#A27B2C] text-white text-[10px] font-bold px-5 py-2.5 rounded-xl tracking-wider cursor-pointer"
              >
                {loading ? 'WAITING...' : 'AUTHORIZE'}
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}