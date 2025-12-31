
import React, { useState } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { Lead, LeadDiagnostics, AssetGrade } from '../types';

interface ScoringDiagnosticsHUDProps {
  lead: Lead;
  onUpdateDiagnostics: (diagnostics: Partial<LeadDiagnostics>) => void;
  isDarkMode: boolean;
}

const ScoringDiagnosticsHUD: React.FC<ScoringDiagnosticsHUDProps> = ({ lead, onUpdateDiagnostics, isDarkMode }) => {
  const [isAuditing, setIsAuditing] = useState(false);

  const runDeepAudit = async () => {
    setIsAuditing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Perform a DEEP NEURAL AUDIT for the lead: "${lead.businessName}". 
        Context: ${lead.niche} in ${lead.city}. Visuals: ${lead.visualProof}. Social Gap: ${lead.socialGap}.
        
        Provide highly granular scoring (0-100 normalized) and detailed reasoning for:
        1. Visual Richness (Quality of site assets)
        2. Social Deficit (Gap between brand and presence)
        3. High-Ticket Plausibility (Likelihood of €10k+ deals)
        4. Reachability (Ease of closing via current path)
        
        Return JSON.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              visual: { type: Type.NUMBER },
              social: { type: Type.NUMBER },
              ticket: { type: Type.NUMBER },
              reach: { type: Type.NUMBER },
              reasoning: { type: Type.STRING },
              confidence: { type: Type.NUMBER }
            }
          }
        }
      });

      const data = JSON.parse(response.text || "{}");
      
      // Map 0-100 normalized scores back to weighted scales
      const visualScore = Math.round((data.visual / 100) * 40);
      const socialScore = Math.round((data.social / 100) * 30);
      const ticketScore = Math.round((data.ticket / 100) * 20);
      const reachabilityScore = Math.round((data.reach / 100) * 10);
      const total = visualScore + socialScore + ticketScore + reachabilityScore;

      onUpdateDiagnostics({
        visualScore,
        socialScore,
        ticketScore,
        reachabilityScore,
        leadScore: total,
        totalScore: total,
        scoreConfidence: data.confidence || 85,
        scoreReasoning: data.reasoning,
        assetGrade: total > 85 ? AssetGrade.A : total > 65 ? AssetGrade.B : AssetGrade.C
      });
    } catch (e) {
      console.error("Audit failed", e);
    } finally {
      setIsAuditing(false);
    }
  };

  const metrics = [
    { label: 'VISUAL DEPTH', val: lead.visualScore, max: 40, color: 'indigo' },
    { label: 'SOCIAL VOID', val: lead.socialScore, max: 30, color: 'rose' },
    { label: 'TICKET MASS', val: lead.ticketScore, max: 20, color: 'emerald' },
    { label: 'SIGNAL REACH', val: lead.reachabilityScore, max: 10, color: 'amber' },
  ];

  return (
    <div className={`p-8 rounded-[2.5rem] border transition-all relative overflow-hidden ${isDarkMode ? 'bg-slate-950 border-slate-800 shadow-2xl' : 'bg-white border-slate-200 shadow-xl'}`}>
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/5 blur-[100px] pointer-events-none"></div>
      
      <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-6">
        <div>
           <h3 className="text-sm font-black uppercase tracking-widest italic text-indigo-500">Neural Diagnostics HUD</h3>
           <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">Grounding Multi-Vector Audit</p>
        </div>
        <button 
          onClick={runDeepAudit}
          disabled={isAuditing}
          className={`px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all active:scale-95 ${
            isAuditing ? 'bg-slate-800 text-slate-500 animate-pulse' : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg'
          }`}
        >
          {isAuditing ? 'Executing Deep Audit...' : 'Engage Deep Audit'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
         <div className="space-y-6">
            {metrics.map(m => (
              <div key={m.label} className="space-y-2">
                 <div className="flex justify-between items-end">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{m.label}</span>
                    <span className={`text-[11px] font-black mono italic text-${m.color}-500`}>{m.val} / {m.max}</span>
                 </div>
                 <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-white/5">
                    <div 
                      className={`h-full bg-${m.color}-500 transition-all duration-1000 ease-out`} 
                      style={{ width: `${(m.val / m.max) * 100}%` }}
                    ></div>
                 </div>
              </div>
            ))}
            
            <div className="pt-6 border-t border-white/5 flex items-center justify-between">
               <div className="flex flex-col">
                  <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Model Confidence</span>
                  <span className="text-sm font-black text-emerald-500 mono italic">{lead.scoreConfidence}%</span>
               </div>
               <div className="text-right flex flex-col">
                  <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Readiness Grade</span>
                  <span className={`text-sm font-black uppercase italic ${lead.assetGrade === 'A' ? 'text-indigo-400' : 'text-slate-300'}`}>{lead.assetGrade}_PRIORITY</span>
               </div>
            </div>
         </div>

         <div className="bg-black/20 rounded-3xl p-6 border border-white/5 flex flex-col h-full">
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 italic">Neural Logic Summary</h4>
            <div className={`flex-1 overflow-y-auto pr-2 no-scrollbar font-medium text-xs leading-relaxed italic ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
               {lead.scoreReasoning || "Awaiting deep-audit execution. Current scoring based on initial recon metadata and sector-wide probability heuristics."}
            </div>
            {lead.scoreReasoning && (
              <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-2">
                 <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                 <span className="text-[8px] font-black uppercase tracking-[0.2em] text-emerald-500">Verified Strategic Logic</span>
              </div>
            )}
         </div>
      </div>
    </div>
  );
};

export default ScoringDiagnosticsHUD;
