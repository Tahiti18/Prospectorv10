
import React, { useState } from 'react';
import { Lead } from '../types';

interface AttackSequencerProps {
  lead: Lead | null;
  isDarkMode: boolean;
}

const AttackSequencer: React.FC<AttackSequencerProps> = ({ lead, isDarkMode }) => {
  const [activeDay, setActiveDay] = useState(1);

  const SEQUENCE = [
    { day: 1, action: 'Bespoke Email', channel: 'Email', icon: '📧', desc: 'Send the AI Strategy Pitch + 4K Mockup. Reference their visual proof directly.' },
    { day: 2, action: 'WhatsApp Follow-up', channel: 'WhatsApp', icon: '💬', desc: 'Quick 30-sec video teaser via WhatsApp. Keep it informal but elite.' },
    { day: 3, action: 'LinkedIn Connection', channel: 'LinkedIn', icon: '🔗', desc: 'Connect with a note: "Loved your portfolio shots. Sent you an email earlier this week."' },
    { day: 5, action: 'The Closing Call', channel: 'Cold Call', icon: '📞', desc: 'Call between 10am-12pm. Use the "Aura Scribe" for live rebuttal support.' },
    { day: 7, action: 'Final Strategic Rebound', channel: 'Email', icon: '📈', desc: 'Last touch. Send the "Revenue Leakage Report" generated in the Deep Reasoning lab.' }
  ];

  if (!lead) {
    return (
      <div className="p-12 text-center opacity-30">
        <p className="text-xl font-black uppercase italic tracking-tighter">Sequencer Standby</p>
        <p className="text-xs font-bold mt-2 uppercase tracking-widest">Select a target in the leads tab to architect a sequence.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between px-2">
        <h3 className={`text-sm font-black uppercase tracking-[0.3em] ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>Omnichannel Attack Sequence</h3>
        <span className={`text-[10px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Target: {lead.businessName}</span>
      </div>

      <div className="relative flex justify-between items-center px-4 max-w-2xl mx-auto mb-12">
        <div className={`absolute left-0 right-0 h-1 top-1/2 -translate-y-1/2 transition-colors ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}></div>
        {SEQUENCE.map((s) => (
          <button
            key={s.day}
            onClick={() => setActiveDay(s.day)}
            className={`relative w-10 h-10 rounded-full flex items-center justify-center font-black text-xs transition-all z-10 ${
              activeDay === s.day 
                ? 'bg-indigo-600 text-white scale-125 shadow-xl shadow-indigo-500/30' 
                : (isDarkMode ? 'bg-slate-900 border border-slate-700 text-slate-500' : 'bg-white border border-slate-200 text-slate-400')
            }`}
          >
            {s.day}
            {activeDay === s.day && (
              <span className="absolute -bottom-6 text-[8px] uppercase tracking-widest font-black text-indigo-500 whitespace-nowrap">ACTIVE</span>
            )}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8">
          <div className={`rounded-[3rem] p-10 border transition-all shadow-2xl relative overflow-hidden ${
            isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl"></div>
            {SEQUENCE.map(s => activeDay === s.day && (
              <div key={s.day} className="animate-in slide-in-from-right-4 duration-300">
                <div className="flex items-center gap-6 mb-8">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-lg border ${isDarkMode ? 'bg-slate-950 border-slate-800 shadow-indigo-500/5' : 'bg-slate-50 border-slate-100'}`}>
                    {s.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 bg-indigo-500 text-white text-[9px] font-black rounded-full uppercase tracking-widest">Day {s.day}</span>
                      <h4 className={`text-xl font-black italic uppercase tracking-tighter ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{s.action}</h4>
                    </div>
                    <p className={`text-[10px] font-bold uppercase tracking-widest mt-1 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Channel: {s.channel}</p>
                  </div>
                </div>
                <div className={`p-8 rounded-3xl border italic font-medium leading-relaxed transition-colors ${
                  isDarkMode ? 'bg-slate-950/50 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-100 text-slate-700'
                }`}>
                  "{s.desc}"
                </div>
                <div className="mt-8 flex gap-4">
                   <button className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-indigo-500/20 hover:bg-indigo-500 transition-all active:scale-95">Open {s.channel} Workflow</button>
                   <button className={`px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all border ${
                     isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-400' : 'bg-white border-slate-200 text-slate-500'
                   }`}>Mark Complete</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
           <div className={`p-8 rounded-3xl border transition-all ${isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-900 text-white shadow-2xl'}`}>
              <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-6 border-b border-white/5 pb-2">Campaign Logistics</h4>
              <div className="space-y-4">
                 <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Mission Level</span>
                    <span className="text-xs font-black uppercase text-emerald-500">Elite</span>
                 </div>
                 <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Touchpoints</span>
                    <span className="text-xs font-black uppercase">5 Total</span>
                 </div>
                 <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Est. Conv Rate</span>
                    <span className="text-xs font-black uppercase text-indigo-400">12.5%</span>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AttackSequencer;
