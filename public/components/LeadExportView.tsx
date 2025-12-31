
import React, { useState } from 'react';
import { Lead } from '../types';

interface LeadExportViewProps {
  leads: Lead[];
  isDarkMode: boolean;
}

const LeadExportView: React.FC<LeadExportViewProps> = ({ leads, isDarkMode }) => {
  const [activeSection, setActiveSection] = useState<'A' | 'B' | 'C'>('A');

  const generateCSV = () => {
    const headers = [
      "Rank", "Business Name", "Website URL", "Chosen Niche", "City/Area", "Phone", "Email", 
      "Contact Page URL", "Instagram URL", "TikTok URL", "YouTube URL", "Social Gap", "Visual Proof", 
      "Pomelli Asset Grade", "Lead Score", "Score Breakdown", "Best Angle", "Personalized Hook", 
      "First Deliverable", "Notes"
    ];
    
    const rows = leads.map(l => [
      l.rank, l.businessName, l.websiteUrl, l.niche, l.city, l.phone, l.email, 
      l.contactUrl, l.instagram, l.tiktok, l.youtube, l.socialGap, l.visualProof, 
      l.assetGrade, l.leadScore, `Vis:${l.visualScore} Soc:${l.socialScore} Tkt:${l.ticketScore} Rch:${l.reachabilityScore}`, 
      l.bestAngle, l.personalizedHook, l.firstDeliverable, l.notes
    ].map(val => `"${val}"`).join(","));

    return [headers.join(","), ...rows].join("\n");
  };

  const copyCSV = () => {
    navigator.clipboard.writeText(generateCSV());
    alert("Section A: Intelligence Table copied to clipboard (CSV Format).");
  };

  if (leads.length === 0) {
    return (
      <div className="p-40 text-center flex flex-col items-center justify-center space-y-6 opacity-30 italic font-black uppercase tracking-[0.5em] text-white">
        <div className="w-20 h-20 border-4 border-dashed border-slate-700 rounded-full animate-spin"></div>
        <span>Dossier Empty: Initial Recon Required</span>
      </div>
    );
  }

  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-6 duration-1000 pb-32 max-w-6xl mx-auto w-full">
      {/* Centered Strategic Header */}
      <div className="flex flex-col items-center text-center space-y-6">
        <div className="flex items-center gap-4">
          <span className="bg-indigo-600 text-white text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.3em] shadow-lg shadow-indigo-600/20">
            CY_PROTOCOL_ACTIVE
          </span>
          <div className="h-px w-12 bg-white/10"></div>
          <span className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px]">
            Captured: {leads.length} Targets
          </span>
        </div>
        
        <h2 className={`text-6xl md:text-7xl font-black italic uppercase tracking-tighter ${isDarkMode ? 'text-white' : 'text-slate-900'} leading-none text-glow`}>
          Intelligence <span className="text-indigo-500">Dossier</span>
        </h2>
        
        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.5em] italic">
          Executive Transmission: Localized Cyprus Market Recon
        </p>

        {/* Centered Navigation */}
        <nav className="flex items-center gap-2 glass-card p-1.5 rounded-[2rem] border border-white/5 shadow-2xl mt-4">
          {(['A', 'B', 'C'] as const).map(section => (
            <button
              key={section}
              onClick={() => setActiveSection(section)}
              className={`px-12 py-3 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-500 ${
                activeSection === section 
                  ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20 scale-105' 
                  : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
              }`}
            >
              Section {section}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="glass-card rounded-[4rem] border border-white/5 overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.7)] bg-slate-950/40 backdrop-blur-3xl">
        {activeSection === 'A' && (
          <div className="p-12 space-y-12">
             <div className="flex flex-col md:flex-row justify-between items-center gap-8 border-b border-white/5 pb-10">
                <div className="text-center md:text-left">
                   <h3 className="text-2xl font-black italic uppercase tracking-tight text-white">Section A: Lead Intelligence Table</h3>
                   <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1 italic">Google Sheets-ready multi-vector export</p>
                </div>
                <button onClick={copyCSV} className="bg-emerald-600 text-white px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-emerald-500 hover:scale-105 active:scale-95 transition-all flex items-center gap-3">
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
                   Copy CSV Payload
                </button>
             </div>
             
             <div className="overflow-x-auto no-scrollbar rounded-[2.5rem] border border-white/5 bg-slate-900/40">
                <table className="w-full text-left border-collapse min-w-[1200px]">
                   <thead>
                      <tr className="bg-slate-950/80 border-b border-white/5">
                         <th className="px-8 py-6 text-[9px] font-black text-slate-500 uppercase tracking-widest">Rank</th>
                         <th className="px-8 py-6 text-[9px] font-black text-slate-500 uppercase tracking-widest">Target Entity</th>
                         <th className="px-8 py-6 text-[9px] font-black text-slate-500 uppercase tracking-widest">Niche</th>
                         <th className="px-8 py-6 text-[9px] font-black text-slate-500 uppercase tracking-widest text-center">Neural Score</th>
                         <th className="px-8 py-6 text-[9px] font-black text-slate-500 uppercase tracking-widest">Pomelli Grade</th>
                         <th className="px-8 py-6 text-[9px] font-black text-slate-500 uppercase tracking-widest text-right">Deliverable</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-white/5">
                      {leads.map(l => (
                        <tr key={l.rank} className="hover:bg-indigo-500/5 transition-colors group cursor-default">
                           <td className="px-8 py-7 mono text-indigo-400 font-bold italic text-xs">
                             {l.rank < 10 ? `0${l.rank}` : l.rank}
                           </td>
                           <td className="px-8 py-7">
                              <p className="text-sm font-black uppercase text-white group-hover:text-indigo-400 transition-colors">{l.businessName}</p>
                              <p className="text-[9px] font-bold text-slate-500 uppercase mt-1">{l.city}</p>
                           </td>
                           <td className="px-8 py-7">
                              <span className="text-[10px] font-bold uppercase text-slate-400 bg-white/5 px-2.5 py-1 rounded-lg border border-white/5">{l.niche}</span>
                           </td>
                           <td className="px-8 py-7 text-center">
                              <span className="text-sm font-black text-white mono italic">{l.leadScore}</span>
                           </td>
                           <td className="px-8 py-7">
                              <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black tracking-widest border ${
                                l.assetGrade === 'A' 
                                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                                  : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                              }`}>
                                {l.assetGrade}_PRIORITY
                              </span>
                           </td>
                           <td className="px-8 py-7 text-right">
                              <span className="text-[9px] font-black uppercase text-indigo-500 bg-indigo-500/10 px-3 py-1.5 rounded-xl border border-indigo-500/20 italic">
                                {l.firstDeliverable}
                              </span>
                           </td>
                        </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          </div>
        )}

        {activeSection === 'B' && (
          <div className="p-16 space-y-16 animate-in slide-in-from-bottom-6 duration-700">
             <div className="text-center space-y-4">
                <h3 className="text-4xl font-black italic uppercase tracking-tighter text-white">Section B: Scoring Rubric</h3>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.4em]">Neural Weighting Methodology</p>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {[
                  { label: 'Visual Richness (0-40)', desc: 'Analyzes original 4K assets, professional portfolio depth, and aesthetic positioning.' },
                  { label: 'Social Deficit (0-30)', desc: 'Quantifies the gap between brand authority and active social engagement.' },
                  { label: 'High-Ticket Plausibility (0-20)', desc: 'Evaluates pricing, affluent density of service, and clientele profile.' },
                  { label: 'Reachability (0-10)', desc: 'Detects public contact paths: Phone, WhatsApp, LinkedIn, and official email.' }
                ].map(item => (
                  <div key={item.label} className="p-8 rounded-[2.5rem] bg-slate-900/60 border border-white/5 space-y-4 group hover:border-indigo-500/30 transition-all shadow-xl">
                     <h4 className="text-lg font-black italic uppercase text-indigo-400 tracking-tight">{item.label}</h4>
                     <p className="text-[11px] font-bold text-slate-400 leading-relaxed uppercase italic opacity-80">{item.desc}</p>
                  </div>
                ))}
             </div>

             <div className="max-w-4xl mx-auto bg-slate-900/80 rounded-[3.5rem] p-12 border border-white/5 space-y-10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/5 blur-[100px] pointer-events-none"></div>
                <h4 className="text-xs font-black uppercase tracking-[0.3em] text-white border-b border-white/5 pb-6 text-center italic">Pomelli Asset Grade Definitions</h4>
                <div className="grid grid-cols-1 gap-8">
                   {[
                     { grade: 'A', col: 'emerald', desc: 'EXCEPTIONAL visual assets + extreme funnel neglect. MASSIVE revenue recovery potential.' },
                     { grade: 'B', col: 'indigo', desc: 'SOLID visual baseline with clear room for AI optimization. Viable high-profit prospect.' },
                     { grade: 'C', col: 'slate', desc: 'BORDERLINE. Lower initial ROI potential but still viable for long-term transformation.' }
                   ].map(g => (
                     <div key={g.grade} className="flex gap-8 items-center group">
                        <div className={`w-16 h-16 rounded-2xl bg-${g.col}-500/10 text-${g.col}-500 font-black flex items-center justify-center border border-${g.col}-500/20 text-2xl shadow-lg transition-transform group-hover:scale-110`}>
                          {g.grade}
                        </div>
                        <p className="text-sm font-medium text-slate-400 italic leading-relaxed uppercase tracking-tight">
                          {g.desc}
                        </p>
                     </div>
                   ))}
                </div>
             </div>
          </div>
        )}

        {activeSection === 'C' && (
          <div className="p-16 space-y-16 animate-in slide-in-from-bottom-6 duration-700">
             <div className="text-center space-y-4">
                <h3 className="text-4xl font-black italic uppercase tracking-tighter text-white">Section C: Outreach Assets</h3>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.4em]">Offensive Signal Templates</p>
             </div>

             <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-5 space-y-8">
                   <div className="bg-indigo-600 p-10 rounded-[3.5rem] text-white shadow-[0_20px_50px_rgba(99,102,241,0.3)] relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-2xl rounded-full"></div>
                      <h4 className="text-[11px] font-black uppercase tracking-[0.4em] mb-8 italic opacity-70">Voice Protocols</h4>
                      <div className="space-y-10">
                         <div className="space-y-3">
                            <p className="text-[9px] font-black uppercase opacity-60 tracking-widest">Call Opener (20s)</p>
                            <p className="text-sm font-bold italic leading-relaxed">"Hi [Name], I'm looking at your site and the [Visual Proof] is world-class. Reason for the call is that I noticed your [Social Gap] is likely costing you bookings in [City]..."</p>
                         </div>
                         <div className="space-y-3 border-t border-white/10 pt-8">
                            <p className="text-[9px] font-black uppercase opacity-60 tracking-widest">Voicemail Protocol</p>
                            <p className="text-sm font-bold italic leading-relaxed text-indigo-100">"Hi, I was browsing [Business Name] today. Your visuals are incredible but your social presence is ghosting potential clients. I have a specific blueprint for you..."</p>
                         </div>
                      </div>
                   </div>
                   
                   <div className="bg-slate-900 p-10 rounded-[3rem] border border-white/5 text-slate-300 shadow-xl group hover:border-emerald-500/30 transition-all">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.4em] mb-6 italic text-emerald-400">Direct Message Signal</h4>
                      <p className="text-sm font-bold italic leading-relaxed">"Hi! I just reviewed your site. Stunning assets, but I found a major conversion bottleneck in your booking path. Mind if I send a 30s video demo of how we can fix it?"</p>
                   </div>
                </div>

                <div className="lg:col-span-7">
                   <div className="bg-slate-950 p-12 rounded-[4rem] border border-white/10 space-y-10 shadow-2xl relative overflow-hidden group">
                      <div className="absolute bottom-0 right-0 w-48 h-48 bg-indigo-500/5 blur-[80px]"></div>
                      <div className="flex justify-between items-center border-b border-white/5 pb-8">
                         <h4 className="text-xl font-black italic uppercase text-white tracking-tight">Full Cold Email Payload</h4>
                         <span className="text-[9px] font-black uppercase text-slate-600 tracking-widest bg-white/5 px-3 py-1 rounded-full">140 WORD CAP</span>
                      </div>
                      <div className="prose prose-invert max-w-none text-slate-400 italic text-sm leading-relaxed whitespace-pre-wrap font-medium">
{`Subject: Your visuals deserve more attention in [City]

Hi [Name],

I was just browsing your site and saw the incredible [Visual Proof]. Genuinely world-class quality.

However, I noticed a major disconnect on your social channels. Your [Social Gap] is likely costing you high-ticket clients who live on Instagram and TikTok.

At Pomelli, we turn premium assets like yours into a 24/7 conversion engine. I’ve already architected an [First Deliverable] specifically for [Business Name] to show you how we recover those missed bookings.

Would you be open to a 5-minute Zoom next Tuesday to see the blueprint?

Best,
[Your Name]`}
                      </div>
                      <div className="flex flex-col sm:flex-row gap-4 pt-6">
                         <button className="flex-1 py-5 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-indigo-500 shadow-xl transition-all">Copy Master Email</button>
                         <button className="flex-1 py-5 bg-white/5 border border-white/10 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] text-slate-400 hover:text-white hover:bg-white/10 transition-all">Copy 3 Openers</button>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeadExportView;
