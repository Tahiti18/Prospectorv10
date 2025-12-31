
import React, { useState, useEffect } from 'react';
import InfoButton from './InfoButton';

interface AffiliateHubProps {
  isDarkMode: boolean;
}

const AffiliateHub: React.FC<AffiliateHubProps> = ({ isDarkMode }) => {
  const [refCode, setRefCode] = useState('');
  const [stats, setStats] = useState({
    clicks: 142,
    referrals: 8,
    earnings: 450.00,
    unpaid: 120.00
  });

  useEffect(() => {
    const saved = localStorage.getItem('pomelli_ref_code');
    if (saved) setRefCode(saved);
    else {
      const newCode = 'GP-' + Math.random().toString(36).substr(2, 6).toUpperCase();
      setRefCode(newCode);
      localStorage.setItem('pomelli_ref_code', newCode);
    }
  }, []);

  const referralLink = `${window.location.origin}?ref=${refCode}`;

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    alert('Referral Link copied to clipboard!');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in duration-700 pb-20">
      <div className="text-center space-y-4">
        <h2 className={`text-4xl font-black italic uppercase tracking-tighter ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Affiliate <span className="text-emerald-500">Growth</span> Hub</h2>
        <p className="text-slate-500 text-sm font-medium uppercase tracking-widest">Global Partner Network & Commission Terminal</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         {[
           { label: 'Total Partner Clicks', val: stats.clicks, icon: '🖱️', color: 'indigo' },
           { label: 'Active Subscriptions', val: stats.referrals, icon: '🤝', color: 'emerald' },
           { label: 'Total Remuneration', val: `€${stats.earnings}`, icon: '💰', color: 'indigo' },
           { label: 'Pending Payout', val: `€${stats.unpaid}`, icon: '⏳', color: 'amber' }
         ].map((stat, i) => (
           <div key={i} className={`p-8 rounded-[2.5rem] border shadow-xl ${isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
              <div className="flex justify-between items-start mb-4">
                 <div className="text-3xl">{stat.icon}</div>
                 <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-${stat.color}-500/10 text-${stat.color}-500`}>Real-time</span>
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <p className={`text-3xl font-black italic tracking-tighter ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{stat.val}</p>
           </div>
         ))}
      </div>

      <div className={`p-12 rounded-[3.5rem] border shadow-2xl space-y-8 relative overflow-hidden ${isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
         <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 blur-[120px] pointer-events-none"></div>
         
         <div className="flex flex-col md:flex-row justify-between items-center gap-12">
            <div className="space-y-6 max-w-xl">
               <div>
                  <h3 className={`text-3xl font-black italic uppercase tracking-tighter ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Your <span className="text-emerald-500">Universal</span> Referral Node</h3>
                  <p className="text-sm font-medium text-slate-400 mt-2 leading-relaxed italic">Earn a 20% recurring commission for every user who initializes a Pro or Enterprise mission via your link. No caps on growth.</p>
               </div>
               
               <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-3xl">
                  <code className="flex-1 font-mono text-xs font-black text-indigo-500 truncate">{referralLink}</code>
                  <button onClick={copyLink} className="bg-indigo-600 text-white px-6 py-2 rounded-2xl text-[9px] font-black uppercase tracking-widest shadow-lg hover:bg-indigo-500 transition-all active:scale-95">Copy Link</button>
               </div>
            </div>

            <div className={`p-8 rounded-[2.5rem] border border-emerald-500/20 bg-emerald-500/5 text-center space-y-4 shrink-0 w-full md:w-64`}>
               <p className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.3em]">Partner Grade</p>
               <p className={`text-5xl font-black italic tracking-tighter ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Tier 1</p>
               <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Next Tier at 20 Refs</p>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <div className={`p-10 rounded-[3rem] border ${isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 shadow-xl'}`}>
            <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-500 mb-8 italic">Partner Guidelines</h4>
            <ul className="space-y-4">
               {[
                 'Automated Payouts: Every 1st of the month via Stripe/PayPal.',
                 '1-Level Depth: Direct referrals only for high-fidelity tracking.',
                 'Cooke Duration: 90-day persistence on target browsers.',
                 'Enterprise Bonus: €200 flat bonus for every Enterprise close.'
               ].map((rule, i) => (
                 <li key={i} className="flex items-start gap-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5"></div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-tight leading-relaxed">{rule}</p>
                 </li>
               ))}
            </ul>
         </div>
         <div className={`p-10 rounded-[3rem] border bg-slate-950 border-slate-800 text-white relative overflow-hidden`}>
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#10b981 1px, transparent 0)', backgroundSize: '15px 15px' }}></div>
            <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-400 mb-6 italic">Payout Terminal</h4>
            <div className="space-y-8 relative z-10">
               <div>
                  <p className="text-[8px] font-black text-slate-500 uppercase">Available for Withdrawal</p>
                  <p className="text-4xl font-black italic tracking-tighter text-white">€120.00</p>
               </div>
               <button className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-emerald-500 transition-all active:scale-95 disabled:opacity-30">Request Instant Disbursement</button>
               <p className="text-[8px] font-bold text-slate-500 uppercase text-center tracking-widest">Min. Withdrawal: €50.00</p>
            </div>
         </div>
      </div>
    </div>
  );
};

export default AffiliateHub;
