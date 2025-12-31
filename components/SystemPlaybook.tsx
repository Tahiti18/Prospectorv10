import React from 'react';
import InfoButton from './InfoButton';

interface SystemPlaybookProps {
  onNavigate: (tab: string) => void;
  isDarkMode: boolean;
  onRestartTour?: () => void;
}

const SystemPlaybook: React.FC<SystemPlaybookProps> = ({ onNavigate, isDarkMode, onRestartTour }) => {
  const rubric = [
    { label: 'Visual Richness', max: 40, desc: 'Quality of original site photography, 4K galleries, and visual storytelling.' },
    { label: 'Social Deficit', max: 30, desc: 'Gap between brand quality and social activity (inactive posts > 90 days).' },
    { label: 'High-Ticket Plausibility', max: 20, desc: 'Pricing, clientele affluent density, and service premium positioning.' },
    { label: 'Reachability', max: 10, desc: 'Availability of direct phone, WhatsApp, and official contact pathways.' }
  ];

  const grades = [
    { grade: 'A', desc: 'Exceptional premium visuals + weak funnel. Massive upside and immediate ROI potential.' },
    { grade: 'B', desc: 'Solid visuals + room for improvement. Viable prospect with clear conversion lift.' },
    { grade: 'C', desc: 'Borderline. Potentially profitable but requires significant foundational work.' }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in duration-700 pb-20">
      <div className="text-center space-y-4">
        <h2 className={`text-4xl font-black italic uppercase tracking-tighter ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>The Pomelli <span className="text-indigo-600">Playbook</span></h2>
        <p className="text-slate-500 text-sm font-medium uppercase tracking-widest">Master Methodology & Scoring Rubric</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Rubric Section */}
        <div className={`p-10 rounded-[3.5rem] border shadow-2xl space-y-8 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
           <h3 className="text-sm font-black uppercase tracking-widest italic text-indigo-500">Intelligence Scoring Rubric</h3>
           <div className="space-y-6">
              {rubric.map(item => (
                <div key={item.label} className="space-y-2">
                   <div className="flex justify-between items-end">
                      <span className="text-xs font-black uppercase italic">{item.label}</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Max: {item.max} Points</span>
                   </div>
                   <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-950 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-600" style={{ width: `${(item.max / 40) * 100}%` }}></div>
                   </div>
                   <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wide leading-relaxed">{item.desc}</p>
                </div>
              ))}
           </div>
        </div>

        {/* Grade Section */}
        <div className="space-y-6">
           <div className={`p-10 rounded-[3.5rem] border shadow-2xl ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-900 border-slate-800 text-white'}`}>
              <h3 className="text-sm font-black uppercase tracking-widest italic mb-8">Asset Grading Protocol</h3>
              <div className="space-y-8">
                 {grades.map(g => (
                   <div key={g.grade} className="flex gap-6 items-start group">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl border transition-all ${
                        g.grade === 'A' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 
                        g.grade === 'B' ? 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20' : 
                        'bg-slate-500/10 text-slate-500 border-slate-500/20'
                      }`}>
                        {g.grade}
                      </div>
                      <div>
                         <h4 className="text-xs font-black uppercase tracking-widest mb-1">{g.grade === 'A' ? 'Elite Target' : g.grade === 'B' ? 'Viable Target' : 'Secondary Target'}</h4>
                         <p className="text-[10px] text-slate-400 font-medium uppercase leading-relaxed group-hover:text-slate-300 transition-colors">{g.desc}</p>
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           <div className={`p-8 rounded-3xl border border-indigo-500/30 bg-indigo-500/5 text-center space-y-4`}>
              <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-500">Quick Objective</h4>
              <p className="text-xs font-bold text-slate-500 italic leading-relaxed uppercase">"We build for the future by exploiting the gaps of the present. Secure the visual, bridge the social, close the deal."</p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {[
           { label: 'Step 1: Grounding', desc: 'Identify the Grade-A visual gaps.', tab: 'dashboard' },
           { label: 'Step 2: Production', desc: 'Build the 4K Mockup and Veo Pitch.', tab: 'pitch' },
           { label: 'Step 3: Outreach', desc: 'Send the Magic Link and close.', tab: 'closer' },
         ].map(item => (
           <button 
            key={item.label}
            onClick={() => onNavigate(item.tab)}
            className={`p-8 rounded-[2.5rem] border text-left transition-all hover:scale-[1.05] ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100 shadow-lg'}`}
           >
              <h4 className="text-xs font-black uppercase text-indigo-500 mb-2 italic">{item.label}</h4>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.desc}</p>
           </button>
         ))}
      </div>

      {onRestartTour && (
        <div className="flex justify-center pt-10">
           <button 
            onClick={onRestartTour}
            className="px-10 py-4 bg-slate-900 text-slate-400 border border-slate-800 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:text-white hover:border-indigo-500 transition-all"
           >
             Restart Indoctrination Tour
           </button>
        </div>
      )}
    </div>
  );
};

export default SystemPlaybook;