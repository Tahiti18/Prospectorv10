
import React, { useState } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { Lead } from '../types';
import InfoButton from './InfoButton';

interface FunnelStep {
  id: number;
  label: string;
  type: 'Ad' | 'LeadGen' | 'AI_Node' | 'Booking' | 'Closure';
}

interface FunnelArchitectProps {
  selectedLead: Lead | null;
  isDarkMode: boolean;
}

const FunnelArchitect: React.FC<FunnelArchitectProps> = ({ selectedLead, isDarkMode }) => {
  const [funnelSteps, setFunnelSteps] = useState<FunnelStep[]>([]);
  const [isArchitecting, setIsArchitecting] = useState(false);

  const architectFunnel = async () => {
    if (!selectedLead) return;
    setIsArchitecting(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Design a high-ticket AI conversion funnel for a ${selectedLead.niche} in ${selectedLead.city}. 
        Provide exactly 5 steps in JSON format: id, label, type (one of: Ad, LeadGen, AI_Node, Booking, Closure).`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.NUMBER },
                label: { type: Type.STRING },
                type: { type: Type.STRING }
              }
            }
          }
        }
      });
      setFunnelSteps(JSON.parse(response.text || "[]"));
    } catch (e) {
      console.error(e);
    } finally {
      setIsArchitecting(false);
    }
  };

  if (!selectedLead) return <div className="p-10 text-center opacity-30 italic font-black uppercase tracking-widest">Select target to architect funnel</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h3 className={`text-xl font-black italic uppercase tracking-tighter ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Funnel Logic Map</h3>
        <button 
          onClick={architectFunnel}
          disabled={isArchitecting}
          className="bg-indigo-600 text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:bg-indigo-500 active:scale-95 transition-all"
        >
          {isArchitecting ? 'Architecting...' : 'Build Custom Funnel'}
        </button>
      </div>

      <div className={`p-10 rounded-[3rem] border min-h-[300px] flex items-center justify-center relative overflow-hidden ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xl'}`}>
         <div className="absolute inset-0 bg-indigo-500/5 blur-3xl pointer-events-none"></div>
         
         <div className="relative flex flex-wrap justify-center gap-8 items-center z-10">
            {funnelSteps.length > 0 ? (
              funnelSteps.map((step, idx) => (
                <React.Fragment key={step.id}>
                  <div className="flex flex-col items-center gap-3 group animate-in zoom-in duration-300">
                    <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center text-xl shadow-xl transition-all group-hover:scale-110 group-hover:rotate-3 border ${
                      step.type === 'AI_Node' ? 'bg-indigo-600 text-white border-indigo-400' : 
                      step.type === 'Ad' ? 'bg-rose-500 text-white border-rose-400' :
                      isDarkMode ? 'bg-slate-800 text-slate-300 border-slate-700' : 'bg-white text-slate-600 border-slate-100'
                    }`}>
                      {step.type === 'Ad' && '📣'}
                      {step.type === 'LeadGen' && '📥'}
                      {step.type === 'AI_Node' && '🧠'}
                      {step.type === 'Booking' && '📅'}
                      {step.type === 'Closure' && '💰'}
                    </div>
                    <p className={`text-[9px] font-black uppercase tracking-widest text-center max-w-[80px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{step.label}</p>
                  </div>
                  {idx < funnelSteps.length - 1 && (
                    <div className={`w-8 h-0.5 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'} animate-pulse`}></div>
                  )}
                </React.Fragment>
              ))
            ) : (
              <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.3em] animate-pulse">Waiting for Blueprint Logic...</p>
            )}
         </div>
      </div>
    </div>
  );
};

export default FunnelArchitect;
