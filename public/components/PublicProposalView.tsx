
import React, { useState, useEffect } from 'react';
import { Proposal } from '../types';

interface PublicProposalViewProps {
  proposal: Proposal;
}

const PublicProposalView: React.FC<PublicProposalViewProps> = ({ proposal }) => {
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [activeDecision, setActiveDecision] = useState<string | null>(null);
  
  // ROI Simulator State
  const [avgValue, setAvgValue] = useState(2500);
  const [leadsPerMonth, setLeadsPerMonth] = useState(15);
  const [convRate, setConvRate] = useState(10); // current %
  
  const currentAnnual = (leadsPerMonth * 12) * (convRate / 100) * avgValue;
  const aiAnnual = (leadsPerMonth * 12) * (0.25) * avgValue; // AI baseline 25% conversion
  const recoveryValue = aiAnnual - currentAnnual;

  const handleDecision = (decision: string) => {
    setActiveDecision(decision);
    setFeedbackSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-indigo-100">
      {/* Navigation */}
      <nav className="border-b border-slate-100 py-6 px-8 sticky top-0 bg-white/80 backdrop-blur-xl z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg rotate-3">
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <span className="text-lg font-black tracking-tight italic uppercase">Elite Strategy Portal</span>
           </div>
           <div className="flex gap-4">
              <button 
                onClick={() => handleDecision('accepted')}
                className="bg-indigo-600 text-white px-8 py-3 rounded-[2rem] text-xs font-black uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all hover:scale-105 active:scale-95"
              >
                Accept Proposal
              </button>
           </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-8 py-20 space-y-32 pb-40">
        <section className="text-center space-y-8">
           <div className="inline-block px-5 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-[10px] font-black uppercase tracking-[0.3em] mb-4">CYPRUS MARKET DOMINANCE REPORT</div>
           <h1 className="text-7xl md:text-8xl font-black tracking-tighter leading-none italic text-slate-900 uppercase max-w-4xl mx-auto">
             Visual Transformation <span className="text-indigo-600">Architected</span>
           </h1>
           <p className="text-2xl text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed italic">
             For <span className="text-slate-900 font-black">{proposal.leadName}</span>
           </p>
           <div className="w-1 h-20 bg-indigo-100 mx-auto rounded-full mt-10"></div>
        </section>

        {/* ROI SIMULATOR SECTION */}
        <section className="bg-slate-950 rounded-[4rem] p-16 md:p-24 text-white space-y-16 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 blur-[150px] pointer-events-none"></div>
           <div className="text-center space-y-4 relative z-10">
              <h2 className="text-5xl font-black italic uppercase tracking-tighter">The Revenue <span className="text-indigo-500">Recovery</span> Simulator</h2>
              <p className="text-slate-500 font-bold uppercase text-xs tracking-[0.3em]">Quantifying your current conversion leakages</p>
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <div className="space-y-10">
                 <div className="space-y-4">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
                       <span>Average Sale Value</span>
                       <span className="text-white">€{avgValue.toLocaleString()}</span>
                    </div>
                    <input type="range" min="500" max="50000" step="500" value={avgValue} onChange={(e) => setAvgValue(parseInt(e.target.value))} className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500" />
                 </div>
                 <div className="space-y-4">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
                       <span>Leads Per Month</span>
                       <span className="text-white">{leadsPerMonth}</span>
                    </div>
                    <input type="range" min="1" max="200" step="1" value={leadsPerMonth} onChange={(e) => setLeadsPerMonth(parseInt(e.target.value))} className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500" />
                 </div>
                 <div className="space-y-4">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
                       <span>Current Conversion (%)</span>
                       <span className="text-rose-500">{convRate}%</span>
                    </div>
                    <input type="range" min="1" max="30" step="1" value={convRate} onChange={(e) => setConvRate(parseInt(e.target.value))} className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500" />
                 </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-[3rem] p-12 text-center space-y-8 backdrop-blur-sm">
                 <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em]">Projected Annual Gains</p>
                 <div className="space-y-2">
                    <h3 className="text-7xl font-black italic tracking-tighter text-white">€{Math.max(0, recoveryValue).toLocaleString()}</h3>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">New Net Revenue Recovered by AI</p>
                 </div>
                 <div className="flex justify-center gap-8 pt-8 border-t border-white/5">
                    <div className="text-center">
                       <p className="text-[8px] font-black text-slate-500 uppercase mb-1">Manual ROI</p>
                       <p className="text-sm font-black text-rose-500 tracking-tighter">€{currentAnnual.toLocaleString()}</p>
                    </div>
                    <div className="text-center">
                       <p className="text-[8px] font-black text-slate-500 uppercase mb-1">AI Augmented</p>
                       <p className="text-sm font-black text-emerald-500 tracking-tighter">€{aiAnnual.toLocaleString()}</p>
                    </div>
                 </div>
              </div>
           </div>
        </section>

        {/* Mockup Showcase */}
        {proposal.mockupUrl && (
          <section className="space-y-16 animate-in slide-in-from-bottom-8 duration-1000">
             <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                <div className="space-y-2">
                   <h2 className="text-4xl font-black uppercase italic tracking-tighter">The UI Destination</h2>
                   <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">4K Design Synthesis Proposal</p>
                </div>
                <button className="bg-slate-900 text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-colors">Compare with Current Site</button>
             </div>
             <div className="group relative rounded-[4rem] overflow-hidden shadow-[0_80px_120px_rgba(99,102,241,0.15)] border-8 border-slate-900 bg-slate-900 transition-transform duration-700 hover:scale-[1.01]">
                <img 
                  src={proposal.mockupUrl} 
                  loading="lazy"
                  decoding="async"
                  className="w-full h-auto animate-in fade-in duration-1000" 
                  alt="Transformation Mockup" 
                />
                <div className="absolute inset-0 bg-indigo-600/0 group-hover:bg-indigo-600/5 transition-colors pointer-events-none"></div>
             </div>
          </section>
        )}

        {/* Pitch Text */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-start">
           <div className="lg:col-span-4 space-y-6 sticky top-32">
              <h3 className="text-2xl font-black italic uppercase tracking-tighter leading-none">The Strategic <br/><span className="text-indigo-600">Audit</span></h3>
              <p className="text-sm font-medium text-slate-500 leading-relaxed">Our reasoning engines identified critical engagement leakages in your current social and web funnels. This proposal addresses the €45K+ in annual missed opportunities.</p>
              <div className="space-y-4 pt-6 border-t border-slate-100">
                 <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white text-xs">✓</div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-700">Visual Depth Synthesis</span>
                 </div>
                 <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white text-xs">✓</div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-700">AI Concierge Integration</span>
                 </div>
                 <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white text-xs">✓</div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-700">Multilingual Lead Recovery</span>
                 </div>
              </div>
           </div>
           <div className="lg:col-span-8 bg-slate-950 rounded-[4rem] p-16 md:p-24 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 blur-[150px] pointer-events-none"></div>
              <svg className="w-16 h-16 text-indigo-500 mb-10 opacity-40 group-hover:opacity-100 transition-opacity" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H16.017C14.9124 8 14.017 7.10457 14.017 6V5C14.017 3.34315 15.3602 2 17.017 2H19.017C20.6739 2 22.017 3.34315 22.017 5V15C22.017 18.3137 19.3307 21 16.017 21H14.017ZM2.017 21L2.017 18C2.017 16.8954 2.91243 16 4.017 16H7.017C7.56928 16 8.017 15.5523 8.017 15V9C8.017 8.44772 7.56928 8 7.017 8H4.017C2.91243 8 2.017 7.10457 2.017 6V5C2.017 3.34315 3.36015 2 5.017 2H7.017C8.67386 2 10.017 3.34315 10.017 5V15C10.017 18.3137 7.33072 21 4.017 21H2.017Z" /></svg>
              <div className="prose prose-invert prose-lg max-w-none text-slate-300 leading-relaxed font-medium italic whitespace-pre-wrap">
                 {proposal.pitchText}
              </div>
           </div>
        </section>

        {/* Video Pitch */}
        {proposal.videoUrl && (
          <section className="space-y-16">
             <div className="text-center space-y-4">
                <h2 className="text-5xl font-black uppercase italic tracking-tighter">Cinematic Engagement</h2>
                <p className="text-slate-400 font-bold uppercase text-xs tracking-[0.3em]">AI Video Synthesis Teaser</p>
             </div>
             <div className="max-w-sm mx-auto rounded-[3.5rem] overflow-hidden shadow-[0_80px_120px_rgba(0,0,0,0.3)] border-[12px] border-slate-900 bg-slate-900 transform -rotate-2 hover:rotate-0 transition-transform duration-700">
                <video src={proposal.videoUrl} className="w-full h-auto" controls autoPlay loop muted />
             </div>
          </section>
        )}

        {/* CTA Decision Cluster */}
        <section className="bg-slate-50 rounded-[4rem] p-16 md:p-24 text-center space-y-12">
           {feedbackSubmitted ? (
             <div className="animate-in zoom-in duration-500 space-y-6">
                <div className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center mx-auto text-white shadow-2xl">
                   <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                </div>
                <h2 className="text-4xl font-black uppercase italic tracking-tighter">Mission Received</h2>
                <p className="text-slate-500 font-medium max-w-sm mx-auto">An executive consultant will finalize the transformation roadmap and contact you within 2 hours.</p>
             </div>
           ) : (
             <>
               <div className="space-y-4">
                  <h2 className="text-5xl font-black tracking-tighter italic text-slate-900 uppercase">Commence Transformation?</h2>
                  <p className="text-slate-400 font-medium uppercase tracking-widest text-xs">Finalize your agency partner decision below</p>
               </div>
               <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                  <button 
                    onClick={() => handleDecision('accepted')}
                    className="w-full md:w-auto bg-indigo-600 text-white px-16 py-6 rounded-[2.5rem] font-black text-sm uppercase tracking-widest shadow-[0_20px_40px_rgba(99,102,241,0.3)] hover:bg-indigo-700 transition-all hover:scale-105 active:scale-95"
                  >
                    Accept & Book Strategy Call
                  </button>
                  <button 
                    onClick={() => handleDecision('revision')}
                    className="w-full md:w-auto bg-white border-2 border-slate-200 text-slate-400 px-16 py-6 rounded-[2.5rem] font-black text-sm uppercase tracking-widest hover:border-indigo-600 hover:text-indigo-600 transition-all"
                  >
                    Request Concept Modification
                  </button>
               </div>
             </>
           )}
        </section>

        <footer className="pt-20 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-8 opacity-40">
           <p className="text-[10px] font-black uppercase tracking-widest">© {new Date().getFullYear()} Pomelli Agency • Limassol, Cyprus</p>
           <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest">
              <a href="#" className="hover:text-indigo-600">Privacy Protocol</a>
              <a href="#" className="hover:text-indigo-600">Legal Architecture</a>
           </div>
        </footer>
      </main>
    </div>
  );
};

export default PublicProposalView;
