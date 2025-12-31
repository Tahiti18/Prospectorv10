
import React, { useState, useEffect } from 'react';
import { Lead, AssetGrade, RegionConfig } from '../types';

interface AgencyAnalyticsProps {
  leads: Lead[];
  isDarkMode: boolean;
}

const AgencyAnalytics: React.FC<AgencyAnalyticsProps> = ({ leads, isDarkMode }) => {
  const [currency, setCurrency] = useState('EUR');

  useEffect(() => {
    const regionStr = localStorage.getItem('pomelli_active_region');
    if (regionStr) {
      const region: RegionConfig = JSON.parse(regionStr);
      setCurrency(region.currency || 'USD');
    }
  }, [leads]);

  const formatVal = (val: number) => {
    return new Intl.NumberFormat('en-US', { notation: 'compact', style: 'currency', currency: currency }).format(val);
  };

  const totalMarketValue = leads.length * 12500; 
  const gradeA = leads.filter(l => l.assetGrade === AssetGrade.A).length;
  const avgLeadScore = leads.length > 0 ? Math.round(leads.reduce((a, b) => a + b.leadScore, 0) / leads.length) : 0;
  
  const estimatedRevenueLeakage = leads.reduce((acc, l) => {
    const leakage = l.assetGrade === 'A' ? 45000 : l.assetGrade === 'B' ? 20000 : 10000;
    return acc + leakage;
  }, 0);

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      <div className="text-center space-y-2">
        <h2 className={`text-4xl font-black italic uppercase tracking-tighter ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
          Market <span className="text-indigo-600">Dominance</span> Analytics
        </h2>
        <p className="text-slate-500 text-sm font-medium uppercase tracking-widest">Aggregate Intelligence for {currency} Operations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className={`p-8 rounded-[2.5rem] border ${isDarkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200 shadow-xl'}`}>
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Pipeline Value</p>
           <p className="text-3xl font-black italic tracking-tighter">{formatVal(totalMarketValue)}</p>
           <p className={`text-[9px] font-bold mt-2 uppercase ${isDarkMode ? 'text-indigo-400' : 'text-indigo-500'}`}>Current Theater Recon</p>
        </div>
        <div className={`p-8 rounded-[2.5rem] border ${isDarkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200 shadow-xl'}`}>
           <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-1">Total Revenue Leakage</p>
           <p className="text-3xl font-black italic tracking-tighter">{formatVal(estimatedRevenueLeakage)}</p>
           <p className="text-[9px] text-slate-500 font-bold mt-2 uppercase">Aggregate Opportunity Cost</p>
        </div>
        <div className={`p-8 rounded-[2.5rem] border ${isDarkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200 shadow-xl'}`}>
           <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">High-Prob Targets</p>
           <p className="text-3xl font-black italic tracking-tighter">{gradeA}</p>
           <p className="text-[9px] text-slate-500 font-bold mt-2 uppercase">Grade-A Lead Density</p>
        </div>
        <div className={`p-8 rounded-[2.5rem] border ${isDarkMode ? 'bg-indigo-600 border-indigo-400 text-white' : 'bg-indigo-600 border-indigo-500 text-white shadow-xl shadow-indigo-500/20'}`}>
           <p className="text-[10px] font-black text-indigo-200 uppercase tracking-widest mb-1">Dominance Index</p>
           <p className="text-3xl font-black italic tracking-tighter">{avgLeadScore}%</p>
           <p className="text-[9px] text-indigo-100 font-bold mt-2 uppercase">Mean Prospect Readiness</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className={`p-10 rounded-[3rem] border ${isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200 shadow-xl'}`}>
           <h3 className="text-sm font-black uppercase tracking-widest mb-8 italic">Revenue Capture Projection</h3>
           <div className="space-y-6">
              {[
                { label: 'Q1 AI Onboarding', val: 35, color: 'indigo' },
                { label: 'Q2 Funnel Optimization', val: 65, color: 'indigo' },
                { label: 'Q3 Category Dominance', val: 92, color: 'emerald' },
              ].map(item => (
                <div key={item.label} className="space-y-2">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                    <span className="text-slate-500">{item.label}</span>
                    <span className={`text-${item.color}-500`}>{item.val}%</span>
                  </div>
                  <div className={`h-2 w-full rounded-full ${isDarkMode ? 'bg-slate-950' : 'bg-slate-100'}`}>
                    <div className={`h-full bg-indigo-500 rounded-full`} style={{ width: `${item.val}%`, backgroundColor: item.color === 'emerald' ? '#10b981' : '#6366f1' }}></div>
                  </div>
                </div>
              ))}
           </div>
        </div>

        <div className={`p-10 rounded-[3rem] border transition-all ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-900 border-slate-800 text-white'}`}>
           <h3 className="text-sm font-black uppercase tracking-widest mb-6 italic text-indigo-400">Market Risk Analysis</h3>
           <div className="space-y-4">
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex gap-4">
                <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-500 flex items-center justify-center shrink-0">!</div>
                <p className="text-[11px] font-medium leading-relaxed uppercase opacity-80">Local saturation increasing. Target high-end luxury sectors for highest conversion rates in this currency zone.</p>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex gap-4">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-500 flex items-center justify-center shrink-0">✓</div>
                <p className="text-[11px] font-medium leading-relaxed uppercase opacity-80">High potential for Multi-lingual AI Concierge integration to recover missed international inquiries.</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AgencyAnalytics;
