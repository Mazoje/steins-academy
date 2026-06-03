'use client';

import React, { useEffect, useState } from 'react';

// Setup local frontend client connection
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''; // Use the public client token safely
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface EnrollmentRecord {
  id: string;
  created_at: string;
  full_name: string;
  email: string;
  phone: string;
  course_id: string;
  amount: number;
  status: 'pending' | 'success';
}

export default function AdminDashboard() {
  const [records, setRecords] = useState<EnrollmentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'success' | 'pending'>('all');

  // Fetch telemetry matrix lines directly from Supabase
  const fetchEnrollments = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('enrollments')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setRecords(data as EnrollmentRecord[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEnrollments();
  }, []);

  // Compute operational aggregates metrics dynamically
  const totalRevenue = records
    .filter(r => r.status === 'success')
    .reduce((sum, r) => sum + Number(r.amount), 0);

  const filteredRecords = records.filter(record => {
    if (filter === 'success') return record.status === 'success';
    if (filter === 'pending') return record.status === 'pending';
    return true;
  });

 return (
    // Added pt-28 to push the admin screen layout safely beneath your floating global capsule header
    <div className="min-h-screen bg-[#F8F9FA] text-[#001D4A] p-6 pt-28 font-sans bg-grid-pattern bg-[size:40px_40px]">
      
      {/* Upper Navigation Control Bar */}
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5 mb-8">
        <div>
          <span className="text-[10px] font-black tracking-[0.2em] text-[#A27B2C] uppercase block">Management Ledger</span>
          <h1 className="text-2xl font-black mt-0.5 tracking-tight">Academy Administration</h1>
        </div>
        <button 
          onClick={fetchEnrollments}
          className="self-start sm:self-auto border border-slate-200 bg-white hover:bg-slate-50 font-bold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer shadow-sm"
        >
          🔄 Refresh Ledger
        </button>
      </div>

      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Analytics Summary Scorecards Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white p-5 border border-slate-200 rounded-2xl shadow-xs">
            <span className="text-[9px] font-bold text-slate-400 tracking-wider uppercase block">Total Verified Revenue</span>
            <div className="text-2xl font-black text-[#A27B2C] mt-1">₦{totalRevenue.toLocaleString()}</div>
          </div>
          <div className="bg-white p-5 border border-slate-200 rounded-2xl shadow-xs">
            <span className="text-[9px] font-bold text-slate-400 tracking-wider uppercase block">Confirmed Students</span>
            <div className="text-2xl font-black mt-1">{records.filter(r => r.status === 'success').length}</div>
          </div>
          <div className="bg-white p-5 border border-slate-200 rounded-2xl shadow-xs">
            <span className="text-[9px] font-bold text-slate-400 tracking-wider uppercase block">Abandonded / Pending Leads</span>
            <div className="text-2xl font-black text-slate-400 mt-1">{records.filter(r => r.status === 'pending').length}</div>
          </div>
        </div>

        {/* Dynamic Filter Strip Buttons */}
        <div className="flex gap-2 border-b border-slate-200 pb-2">
          {(['all', 'success', 'pending'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`text-xs font-bold px-4 py-2 rounded-lg transition-all capitalize cursor-pointer ${
                filter === type 
                  ? 'bg-[#001D4A] text-white' 
                  : 'text-slate-400 hover:text-[#001D4A]'
              }`}
            >
              {type === 'all' ? 'All Registrations' : `${type} entries`}
            </button>
          ))}
        </div>

        {/* Operational Records Tracking Table */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-xs font-medium text-slate-400">Querying live database architecture matrices...</div>
          ) : filteredRecords.length === 0 ? (
            <div className="p-12 text-center text-xs font-medium text-slate-400">No enrollment instances match this query filter block.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="p-4 text-[9px] font-black uppercase text-slate-400 tracking-widest">Student Information</th>
                    <th className="p-4 text-[9px] font-black uppercase text-slate-400 tracking-widest">Selected Track</th>
                    <th className="p-4 text-[9px] font-black uppercase text-slate-400 tracking-widest">Fee Value</th>
                    <th className="p-4 text-[9px] font-black uppercase text-slate-400 tracking-widest">Gateway Status</th>
                    <th className="p-4 text-[9px] font-black uppercase text-slate-400 tracking-widest">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-medium">
                  {filteredRecords.map((record) => (
                    <tr key={record.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4">
                        <div className="font-bold text-[#001D4A]">{record.full_name}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">{record.email} • {record.phone || 'No phone'}</div>
                      </td>
                      <td className="p-4 font-mono text-[11px] text-slate-500 uppercase">
                        {record.course_id.replace('track_', '').replace('_', ' ')}
                      </td>
                      <td className="p-4 font-bold">₦{Number(record.amount).toLocaleString()}</td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${
                          record.status === 'success' 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {record.status}
                        </span>
                      </td>
                      <td className="p-4 text-slate-400 text-[11px]">
                        {new Date(record.created_at).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}