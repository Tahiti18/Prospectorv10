
import React, { useState, useEffect } from 'react';
import { Invoice, AgencyLedger, RegionConfig, AgencyProfile, SubscriptionTier } from '../types';
import InfoButton from './InfoButton';

interface BillingNodeProps {
  isDarkMode: boolean;
}

const BillingNode: React.FC<BillingNodeProps> = ({ isDarkMode }) => {
  const [profile, setProfile] = useState<AgencyProfile>(() => {
    const saved = localStorage.getItem('pomelli_agency_profile');
    return saved ? JSON.parse(saved) : { tier: 'Free' };
  });

  const [ledger, setLedger] = useState<AgencyLedger>(() => {
    const saved = localStorage.getItem('pomelli_ledger');
    return saved ? JSON.parse(saved) : {
      totalRevenue: 85000,
      subscriptionMRR: 12500,
      computeExpense: 1450,
      profitMargin: 98.2,
      recentInvoices: [
        { id: 'INV-882', clientName: 'Aegean Luxury Yachts', total: 4500, status: 'Paid', date: Date.now(), items: [], currency: 'EUR', paymentMethod: 'Stripe' },
        { id: 'INV-881', clientName: 'Nicosia Wellness', total: 1200, status: 'Paid', date: Date.now() - 86400000, items: [], currency: 'EUR', paymentMethod: 'Crypto' }
      ]
    };
  });

  const [activeRegion, setActiveRegion] = useState<RegionConfig>({ country: 'Cyprus', currency: 'EUR', tone: '' });

  useEffect(() => {
    const regionStr = localStorage.getItem('pomelli_active_region');
    if (regionStr) setActiveRegion(JSON.parse(regionStr));
    localStorage.setItem('pomelli_ledger', JSON.stringify(ledger));
  }, [ledger]);

  const handleUpgrade = (tier: SubscriptionTier) => {
    const updated = { ...profile, tier };
    setProfile(updated);
    localStorage.setItem('pomelli_agency_profile', JSON.stringify(updated));
    alert(`Node Authorization: ${tier} Tier Activated.`);
  };

  const formatMoney = (val: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: activeRegion.currency }).format(val);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h2 className={`text-3xl font-black italic uppercase tracking-tighter ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Financial <span className="text-emerald-500">Command</span></h2>
           <p className="text-slate-500 text-sm mt-2 font-medium italic">Execute monetization protocols and monitor cross-border capital.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
         <div className="lg:col-span-8 space-y-8">
            <div className={`p-10 rounded-[3.5rem] border shadow-2xl ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
               <h3 className="text-sm font-black uppercase tracking-widest italic mb-10">Capital Transmission Log</h3>
               <div className="space-y-4">
                  {ledger.recentInvoices.map(inv => (
                    <div key={inv.id} className={`p-6 rounded-3xl border flex items-center justify-between group hover:border-indigo-500/50 transition-all ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
                       <div className="flex items-center gap-5">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-inner ${inv.paymentMethod === 'Crypto' ? 'bg-amber-500/10 text-amber-500' : 'bg-indigo-500/10 text-indigo-500'}`}>
                            {inv.paymentMethod === 'Crypto' ? '₿' : 'S'}
                          </div>
                          <div>
                             <p className={`text-sm font-black uppercase tracking-tighter ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{inv.clientName}</p>
                             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{inv.paymentMethod} Payment • {new Date(inv.date).toLocaleDateString()}</p>
                          </div>
                       </div>
                       <div className="text-right">
                          <p className="text-sm font-black text-indigo-500">{formatMoney(inv.total)}</p>
                          <span className="text-[8px] font-black uppercase text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">Secured</span>
                       </div>
                    </div>
                  ))}
               </div>
            </div>

            {/* Integration Technical Blueprint */}
            <div className={`p-10 rounded-[3.5rem] border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100 shadow-xl'}`}>
               <h3 className="text-sm font-black uppercase tracking-widest italic mb-6 text-indigo-500">Integration Blueprint: Stripe & Crypto</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                     <p className="text-xs font-black uppercase italic border-b border-black/5 pb-2">Stripe Core (Fiat)</p>
                     <p className="text-[10px] text-slate-400 font-bold uppercase leading-relaxed">Required: Stripe Secret Key (sk_live...) + Backend Node/Express Server. Use Stripe 'PaymentIntents' for custom high-ticket builds or 'Checkout Sessions' for recurring agency fees.</p>
                  </div>
                  <div className="space-y-4">
                     <p className="text-xs font-black uppercase italic border-b border-black/5 pb-2">Web3 Node (Crypto)</p>
                     <p className="text-[10px] text-slate-400 font-bold uppercase leading-relaxed">Required: Web3.js or Ethers.js library. For Cyprus/International expat deals, accept SOL/ETH/USDC. Integration needs a client-side wallet connect (Phantom/MetaMask) for instant proof-of-transfer.</p>
                  </div>
               </div>
            </div>
         </div>

         <div className="lg:col-span-4 space-y-8">
            <div className={`p-8 rounded-[3rem] border shadow-2xl relative overflow-hidden ${isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-900 text-white'}`}>
               <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/10 blur-3xl"></div>
               <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-8 border-b border-white/5 pb-2 italic">Fee Architecture</h4>
               <div className="space-y-6">
                  {[
                    { label: 'AI Web Overhaul', price: '€4,500' },
                    { label: 'Booking Automation', price: '€2,500' },
                    { label: 'Viral Content (Mo)', price: '€1,200' }
                  ].map(f => (
                    <div key={f.label} className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/5">
                       <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">{f.label}</span>
                       <span className="text-xs font-black text-white">{f.price}</span>
                    </div>
                  ))}
               </div>
               <button className="w-full mt-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-indigo-500">Generate High-Ticket Invoice</button>
            </div>
         </div>
      </div>
    </div>
  );
};

export default BillingNode;
