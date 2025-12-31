
import React, { useState, useEffect } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { Lead, LeadTask, MissionPhase, ForgeSnapshot, LeadDiagnostics } from '../types';
import SWOTRadarChart from './SWOTRadarChart';
import BrandKitExtractor from './BrandKitExtractor';
import ScoringDiagnosticsHUD from './ScoringDiagnosticsHUD';

interface LeadDetailModalProps {
  lead: Lead | null;
  isArchived: boolean;
  isDarkMode: boolean;
  onToggleArchive: (id: number) => void;
  onUpdateLead: (lead: Lead) => void;
  onClose: () => void;
}

const PHASES: MissionPhase[] = ['SCAN', 'SCORE', 'STRATEGIZE', 'SEND', 'CLOSE'];
const FORGE_VERSION = "g3_flash_25.02";

const LeadDetailModal: React.FC<LeadDetailModalProps> = ({ lead, isArchived, isDarkMode, onToggleArchive, onUpdateLead, onClose }) => {
  const [tasks, setTasks] = useState<LeadTask[]>([]);
  const [isForging, setIsForging] = useState(false);
  const [isGeneratingRecovery, setIsGeneratingRecovery] = useState(false);
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    if (lead) {
      const savedTasks = localStorage.getItem(`tasks_${lead.rank}`);
      setTasks(savedTasks ? JSON.parse(savedTasks) : []);
    }
  }, [lead]);

  const forgePayload = async (currentLead: Lead) => {
    setIsForging(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Architect an OFFENSIVE conversion payload for "${currentLead.businessName}". 
        Context: ${currentLead.niche} in ${currentLead.city}. Gap: ${currentLead.socialGap}. Proof: ${currentLead.visualProof}.
        
        Generate:
        1. 1x Headline Hook
        2. 3x Offer Framings
        3. 2x Objection Targets
        4. Delivery Mechanism
        5. Expected ROI Line
        
        Return JSON.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              headline: { type: Type.STRING },
              offers: { type: Type.ARRAY, items: { type: Type.STRING } },
              objectionTargets: { type: Type.ARRAY, items: { type: Type.STRING } },
              deliveryMechanism: { type: Type.STRING },
              expectedROI: { type: Type.STRING }
            }
          }
        }
      });
      
      const payload = JSON.parse(response.text || "{}");
      const snapshot: ForgeSnapshot = {
        version: FORGE_VERSION,
        timestamp: Date.now(),
        payload: { ...payload, confirmed: false }
      };

      onUpdateLead({
        ...currentLead,
        payload: { ...payload, confirmed: false },
        forgeHistory: [snapshot, ...(currentLead.forgeHistory || [])]
      });
    } catch (e) {
      console.error("Forge failed", e);
    } finally {
      setIsForging(false);
    }
  };

  const advancePhase = () => {
    if (!lead) return;
    const currentIdx = PHASES.indexOf(lead.currentPhase);
    
    if (currentIdx < PHASES.length - 1) {
      const nextPhase = PHASES[currentIdx + 1];
      
      if (nextPhase === 'STRATEGIZE' && (!lead.payload || lead.forgeHistory?.[0]?.version !== FORGE_VERSION)) {
        forgePayload(lead);
      }

      onUpdateLead({
        ...lead,
        currentPhase: nextPhase,
        phaseChangedAt: Date.now(),
        lastTouchAt: Date.now(),
        phaseHoldReason: undefined
      });
    }
  };

  const handleOutcome = async (outcome: 'won' | 'lost') => {
    if (!lead) return;
    
    if (outcome === 'won') {
      const value = prompt("Enter Deal Value (€):", "4500");
      onUpdateLead({
        ...lead,
        status: outcome,
        dealValue: value ? parseInt(value) : undefined,
        lastTouchAt: Date.now()
      });
    } else {
      const reason = prompt("Capture Objection Class (Lost reason):");
      setIsGeneratingRecovery(true);
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: `Create a "Revenue Recovery Script" for a deal that was just lost. 
          Target: ${lead.businessName}. Reason: ${reason}.`,
        });
        
        onUpdateLead({
          ...lead,
          status: outcome,
          lostReason: reason || undefined,
          recoveryScript: response.text,
          lastTouchAt: Date.now()
        });
      } catch (e) {
        console.error(e);
      } finally {
        setIsGeneratingRecovery(false);
      }
    }
  };

  const addTag = () => {
    if (!lead || !newTag.trim()) return;
    const tags = Array.from(new Set([...(lead.campaignTags || []), newTag.trim()]));
    onUpdateLead({ ...lead, campaignTags: tags });
    setNewTag('');
  };

  const removeTag = (tag: string) => {
    if (!lead) return;
    onUpdateLead({ ...lead, campaignTags: lead.campaignTags?.filter(t => t !== tag) });
  };

  const updateDiagnostics = (diag: Partial<LeadDiagnostics>) => {
    if (!lead) return;
    onUpdateLead({ ...lead, ...diag });
  };

  if (!lead) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
      <div className="rounded-[3rem] shadow-2xl w-full max-w-7xl overflow-hidden animate-in fade-in zoom-in duration-200 border bg-slate-900 border-slate-700 flex flex-col h-[90vh]">
        
        <div className="bg-slate-950 px-10 py-4 border-b border-white/5 flex justify-between items-center shrink-0">
           <div className="flex gap-4">
              {PHASES.map((p, i) => (
                <div key={p} className="flex items-center gap-2">
                   <div className={`w-1.5 h-1.5 rounded-full ${
                     PHASES.indexOf(lead.currentPhase) >= i ? 'bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.8)]' : 'bg-slate-800'
                   }`}></div>
                   <span className={`text-[8px] font-black uppercase tracking-widest ${
                     lead.currentPhase === p ? 'text-white' : 'text-slate-600'
                   }`}>{p}</span>
                </div>
              ))}
           </div>
           <div className="flex items-center gap-6">
             <div className="text-[9px] font-black text-indigo-500 uppercase tracking-widest italic">
               MISSION CLOCK: {Math.floor((Date.now() - lead.phaseChangedAt) / 3600000)}H
             </div>
           </div>
        </div>

        <div className="p-8 flex justify-between items-center bg-slate-900 text-white shrink-0">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black shadow-inner border bg-slate-950 border-indigo-500/20 text-indigo-400 italic">
               {lead.rank}
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="bg-indigo-600 text-white text-[8px] font-black px-2 py-0.5 rounded tracking-widest uppercase">TGT_{lead.rank}</span>
                <h3 className="text-3xl font-black italic uppercase tracking-tighter">{lead.businessName}</h3>
              </div>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">{lead.city} • {lead.region} • PROB: {lead.conversionProbability}%</p>
            </div>
          </div>
          <div className="flex gap-4">
             <button onClick={onClose} className="p-4 bg-white/10 hover:bg-white/20 rounded-2xl transition-all">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
             </button>
          </div>
        </div>
        
        <div className="p-8 space-y-8 overflow-y-auto no-scrollbar flex-1">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-8">
              
              {/* Enhanced Scoring HUD */}
              <ScoringDiagnosticsHUD lead={lead} onUpdateDiagnostics={updateDiagnostics} isDarkMode={isDarkMode} />

              <section className="p-8 rounded-[2.5rem] border bg-slate-950 border-slate-800">
                <div className="flex justify-between items-center mb-6">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Phase Protocol: {lead.currentPhase}</h4>
                  <button 
                    onClick={advancePhase} 
                    className="px-6 py-2 bg-emerald-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-emerald-500 transition-all"
                  >
                    Advance Signal →
                  </button>
                </div>
                <div className="space-y-3">
                  {tasks.map(t => (
                    <div key={t.id} className={`flex items-center gap-4 p-4 rounded-xl border border-white/5 bg-white/5`}>
                        <input type="checkbox" checked={t.completed} readOnly className="w-4 h-4 rounded border-slate-700 text-indigo-500" />
                        <span className={`text-xs font-bold uppercase ${t.completed ? 'line-through opacity-40' : ''}`}>{t.text}</span>
                    </div>
                  ))}
                </div>
              </section>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <section className="p-8 rounded-[2.5rem] border bg-slate-800/40 border-slate-700">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 italic">Visual Asset Proof</h4>
                    <p className="text-xs font-medium text-slate-300 leading-relaxed italic">"{lead.visualProof}"</p>
                 </section>
                 <section className="p-8 rounded-[2.5rem] border bg-slate-800/40 border-slate-700">
                    <h4 className="text-[10px] font-black text-rose-400 uppercase tracking-widest mb-4 italic">Identified Deficit</h4>
                    <p className="text-xs font-medium text-slate-300 leading-relaxed italic">"{lead.socialGap}"</p>
                 </section>
              </div>
            </div>

            <div className="lg:col-span-4 space-y-6">
              <section className="p-6 rounded-[2.5rem] border transition-all bg-slate-800/50 border-slate-700">
                 <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 italic">Campaign Metadata</h4>
                 <div className="space-y-4">
                    <div>
                       <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Primary Campaign</p>
                       <p className="text-xs font-black text-indigo-400 uppercase mono italic">{lead.campaignName || 'UNASSIGNED'}</p>
                    </div>
                    <div className="space-y-2">
                       <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Intelligence Tags</p>
                       <div className="flex flex-wrap gap-2">
                          {lead.campaignTags?.map(tag => (
                            <span key={tag} className="group flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded text-[9px] font-black uppercase mono italic">
                              {tag}
                              <button onClick={() => removeTag(tag)} className="opacity-0 group-hover:opacity-100 hover:text-rose-500 transition-all">×</button>
                            </span>
                          ))}
                          <div className="flex gap-1 mt-1">
                             <input 
                              type="text" 
                              value={newTag} 
                              onChange={e => setNewTag(e.target.value)} 
                              onKeyDown={e => e.key === 'Enter' && addTag()}
                              placeholder="+ Label" 
                              className="bg-transparent border-b border-slate-700 text-[9px] font-black uppercase text-slate-400 outline-none w-16 focus:w-24 focus:border-indigo-500 transition-all"
                             />
                          </div>
                       </div>
                    </div>
                 </div>
              </section>

              <BrandKitExtractor selectedLead={lead} onExtracted={(id, kit) => onUpdateLead({ ...lead, brandKit: kit })} isDarkMode={isDarkMode} />

              <section className="p-6 rounded-[2.5rem] border transition-all bg-slate-800/50 border-slate-700 flex flex-col items-center">
                 <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 self-start">Vulnerability Radar</h4>
                 <SWOTRadarChart isDarkMode={true} scores={{ visual: lead.visualScore, social: lead.socialScore, ticket: lead.ticketScore, reach: lead.reachabilityScore, market: lead.totalScore }} />
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadDetailModal;
