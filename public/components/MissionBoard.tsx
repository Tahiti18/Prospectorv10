
import React, { useState } from 'react';
import { Lead, MissionPhase } from '../types';
import InfoButton from './InfoButton';

interface MissionBoardProps {
  leads: Lead[];
  onSelectLead: (lead: Lead) => void;
  isDarkMode: boolean;
  onReorderLeads: (leads: Lead[]) => void;
  missionStep?: number;
}

const PHASES: { id: MissionPhase; label: string; desc: string; helpId: string }[] = [
  { id: 'SCAN', label: 'Theater Recon', desc: 'Discovery & Contact', helpId: 'viral_pulse' },
  { id: 'SCORE', label: 'Intel Audit', desc: 'Asset Grading & SWOT', helpId: 'vision_intel' },
  { id: 'STRATEGIZE', label: 'Payload Forge', desc: 'Mockups & Video', helpId: 'video_pitch' },
  { id: 'SEND', label: 'Signal Dist.', desc: 'Proposal Deploy', helpId: 'proposals' },
  { id: 'CLOSE', label: 'Rev Recovery', desc: 'Bank & Onboarding', helpId: 'auth' },
];

const MissionBoard: React.FC<MissionBoardProps> = ({ leads, onSelectLead, isDarkMode, onReorderLeads, missionStep = 0 }) => {
  const [draggedLeadRank, setDraggedLeadRank] = useState<number | null>(null);

  const getLeadsInPhase = (phase: MissionPhase) => leads.filter(l => l.currentPhase === phase);

  const getPhaseAge = (timestamp: number) => {
    const hours = Math.floor((Date.now() - timestamp) / (1000 * 60 * 60));
    if (hours < 1) return '< 1h';
    if (hours < 24) return `${hours}h`;
    return `${Math.floor(hours / 24)}d`;
  };

  const getHeatLevel = (lead: Lead): 'RED' | 'AMBER' | 'GREEN' | 'BLUE' | 'WHITE' => {
    const daysInPhase = (Date.now() - lead.phaseChangedAt) / (1000 * 60 * 60 * 24);
    const isHighTicket = lead.assetGrade === 'A' || lead.leadScore > 90;
    const isNew = (Date.now() - lead.firstSeenAt) < (1000 * 60 * 60 * 24);

    if (daysInPhase > 7) return 'WHITE'; // Dormant
    if (isHighTicket && daysInPhase > 2) return 'RED'; // High-ticket stall
    if (daysInPhase > 2) return 'AMBER'; // Mid-ticket stall
    if (isNew) return 'BLUE'; // Fresh entry
    return 'GREEN'; // Active movement
  };

  const getHeatColors = (level: string) => {
    switch(level) {
      case 'RED': return 'border-rose-500/40 bg-rose-950/20 shadow-rose-900/10';
      case 'AMBER': return 'border-amber-500/40 bg-amber-950/20 shadow-amber-900/10';
      case 'BLUE': return 'border-indigo-500/40 bg-indigo-950/20 shadow-indigo-900/10';
      case 'WHITE': return 'border-slate-700/50 bg-slate-900/40 opacity-50 grayscale';
      default: return 'border-emerald-500/40 bg-emerald-950/20 shadow-emerald-900/10';
    }
  };

  const handleDragStart = (rank: number) => {
    setDraggedLeadRank(rank);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (targetRank: number) => {
    if (draggedLeadRank === null || draggedLeadRank === targetRank) return;

    const sourceIdx = leads.findIndex(l => l.rank === draggedLeadRank);
    const targetIdx = leads.findIndex(l => l.rank === targetRank);

    const updatedLeads = [...leads];
    const [movedLead] = updatedLeads.splice(sourceIdx, 1);
    updatedLeads.splice(targetIdx, 0, movedLead);

    onReorderLeads(updatedLeads);
    setDraggedLeadRank(null);
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <div className="flex justify-between items-end px-2">
        <div>
           <h2 className={`text-3xl font-black italic uppercase tracking-tighter ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Mission Pipeline</h2>
           <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-2">Economic Lens: Phase Urgency Visualization (Drag to Prioritize) <InfoButton id="leads" /></p>
        </div>
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl px-6 py-2.5 flex items-center gap-8 shadow-xl">
           <div className="flex items-center gap-2.5">
              <div className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]"></div>
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Critical Stall</span>
           </div>
           <div className="flex items-center gap-2.5">
              <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(79,70,229,0.6)]"></div>
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">New Entry</span>
           </div>
        </div>
      </div>

      <div className="flex gap-8 overflow-x-auto pb-10 no-scrollbar min-h-[750px] items-start">
        {PHASES.map((phase, pIdx) => (
          <div key={phase.id} className="flex-1 min-w-[320px] space-y-6">
            <div className={`p-6 rounded-[2.5rem] border relative overflow-hidden flex flex-col gap-1.5 transition-all ${isDarkMode ? 'bg-[#0f172a]/50 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
              <div className="flex justify-between items-center relative z-10">
                <div className="flex items-center gap-2">
                  <span className={`text-[11px] font-black uppercase tracking-[0.3em] ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>{phase.label}</span>
                  <InfoButton id={phase.helpId} />
                </div>
                <div className="bg-indigo-600 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg">{getLeadsInPhase(phase.id).length}</div>
              </div>
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest relative z-10">{phase.desc}</p>
              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 blur-2xl pointer-events-none"></div>
            </div>

            <div className="space-y-5">
              {getLeadsInPhase(phase.id).map((lead, lIdx) => {
                const heat = getHeatLevel(lead);
                const isBeingDragged = draggedLeadRank === lead.rank;
                
                // Guidance: If intel is secured (Step 2/3), guide to select first lead in SCAN/SCORE
                const isGuided = missionStep === 2 && pIdx === 0 && lIdx === 0;

                return (
                  <div 
                    key={lead.rank}
                    draggable
                    onDragStart={() => handleDragStart(lead.rank)}
                    onDragOver={handleDragOver}
                    onDrop={() => handleDrop(lead.rank)}
                    onClick={() => onSelectLead(lead)}
                    className={`p-7 rounded-[2.5rem] border cursor-grab active:cursor-grabbing group hover:scale-[1.04] hover:-rotate-1 transition-all duration-300 shadow-2xl relative overflow-hidden ${
                      isDarkMode ? `bg-[#0f172a] ${getHeatColors(heat)}` : 'bg-white'
                    } ${isBeingDragged ? 'opacity-30 border-dashed border-indigo-500 ring-2 ring-indigo-500' : ''} ${isGuided ? 'ring-4 ring-indigo-500 animate-pulse scale-[1.02]' : ''}`}
                  >
                    {isGuided && (
                       <div className="absolute inset-0 bg-indigo-500/5 pointer-events-none"></div>
                    )}
                    <div className="flex justify-between items-start mb-5 relative z-10">
                      <div className="flex flex-col">
                         <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">TGT_{lead.rank}</span>
                         <span className={`text-[9px] font-black uppercase tracking-widest mt-1 ${heat === 'RED' ? 'text-rose-500 animate-pulse' : 'text-indigo-400'}`}>{getPhaseAge(lead.phaseChangedAt)} in phase</span>
                      </div>
                      <div className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${isDarkMode ? 'bg-[#020617] text-slate-400 border border-slate-800' : 'bg-slate-100'}`}>GRADE {lead.assetGrade}</div>
                    </div>
                    
                    <h4 className={`text-lg font-black uppercase italic tracking-tighter truncate leading-none relative z-10 transition-colors group-hover:text-indigo-400 ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>{lead.businessName}</h4>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-2 truncate relative z-10 italic">{lead.city} • {lead.niche}</p>
                    
                    <div className="mt-8 flex items-center justify-between pt-5 border-t border-slate-800/60 relative z-10">
                      <div className="flex items-center gap-2.5">
                         <div className={`w-2 h-2 rounded-full ${lead.status === 'in-progress' ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]' : 'bg-slate-700'}`}></div>
                         <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{lead.status}</span>
                      </div>
                      <div className="text-[11px] font-black text-indigo-500 drop-shadow-sm">€12.5K</div>
                    </div>
                    {isGuided && (
                      <div className="mt-4 text-center">
                        <span className="text-[8px] font-black text-indigo-400 uppercase tracking-[0.3em] animate-bounce block">ENGAGE TARGET →</span>
                      </div>
                    )}
                  </div>
                );
              })}
              {getLeadsInPhase(phase.id).length === 0 && (
                <div className={`p-20 border-2 border-dashed rounded-[3rem] text-center transition-opacity hover:opacity-100 opacity-20 ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] italic">Sector Clear</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MissionBoard;
