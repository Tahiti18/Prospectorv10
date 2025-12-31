
import React, { useState } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { Lead } from '../types';
import InfoButton from './InfoButton';

interface CompetitorIntel {
  name: string;
  advantage: string;
  weakness: string;
  estimatedTraffic: string;
}

interface WarRoomProps {
  selectedLead: Lead | null;
  isDarkMode: boolean;
}

const WarRoom: React.FC<WarRoomProps> = ({ selectedLead, isDarkMode }) => {
  const [intel, setIntel] = useState<CompetitorIntel[]>([]);
  const [isAuditing, setIsAuditing] = useState(false);
  const [status, setStatus] = useState('');

  const runWarRoomAudit = async () => {
    if (!selectedLead) return;
    setIsAuditing(true);
    setStatus('Deploying scouting drones to Limassol/Nicosia sectors...');
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analyze the competitive landscape for "${selectedLead.businessName}" in ${selectedLead.city}. 
        Find 3 direct high-ticket competitors and identify:
        1. Their primary digital advantage.
        2. A critical weakness we can exploit with AI.
        3. Estimated monthly digital footprint.
        
        Provide JSON array of {name, advantage, weakness, estimatedTraffic}.`,
        config: {
          tools: [{ googleSearch: {} }],
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                advantage: { type: Type.STRING },
                weakness: { type: Type.STRING },
                estimatedTraffic: { type: Type.STRING }
              }
            }
          }
        }
      });
      setIntel(JSON.parse(response.text || "[]"));
      setStatus('War Room Intel Secured.');
    } catch (e) {
      console.error(e);
      setStatus('Comms blackout. Check API.');
    } finally {
      setIsAuditing(false);
    }
  };

  if (!selectedLead) return <div className="p-20 text-center opacity-30 italic font-black uppercase tracking-widest">War Room requires target context</div>;

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex justify-between items-center px-2">
        <div>
           <h2 className={`text-2xl font-black italic uppercase tracking-tighter ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Competitive War Room</h2>
           <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Predatory Market Audit & Vulnerability Map</p>
        </div>
        <button 
          onClick={runWarRoomAudit}
          disabled={isAuditing}
          className="bg-rose-600 text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-rose-500 transition-all active:scale-95"
        >
          {isAuditing ? 'Auditing Sector...' : 'Commence Attack Intel'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Intel Board */}
        <div className="lg:col-span-8 space-y-6">
           {intel.length > 0 ? (
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {intel.map((comp, idx) => (
                  <div key={idx} className={`p-6 rounded-[2.5rem] border transition-all ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xl'}`}>
                     <span className="text-[8px] font-black text-rose-500 uppercase tracking-widest mb-2 block italic">Target Competitor 0{idx + 1}</span>
                     <h4 className={`text-sm font-black uppercase italic tracking-tighter mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{comp.name}</h4>
                     
                     <div className="space-y-4">
                        <div className="p-3 bg-indigo-500/5 rounded-xl border border-indigo-500/10">
                           <p className="text-[8px] font-black text-indigo-400 uppercase mb-1">Their Edge</p>
                           <p className="text-[10px] font-bold text-slate-400 leading-tight uppercase">{comp.advantage}</p>
                        </div>
                        <div className="p-3 bg-rose-500/5 rounded-xl border border-rose-500/10">
                           <p className="text-[8px] font-black text-rose-400 uppercase mb-1">Critical Weakness</p>
                           <p className="text-[10px] font-bold text-slate-400 leading-tight uppercase">{comp.weakness}</p>
                        </div>
                        <div className="flex justify-between items-center pt-2">
                           <span className="text-[9px] font-black text-slate-500 uppercase">Est. Traffic</span>
                           <span className="text-[10px] font-bold text-emerald-500">{comp.estimatedTraffic}</span>
                        </div>
                     </div>
                  </div>
                ))}
             </div>
           ) : (
             <div className={`h-[400px] rounded-[3rem] border-2 border-dashed flex flex-col items-center justify-center text-center opacity-20 ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
                <svg className="w-20 h-20 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                <p className="text-sm font-black uppercase tracking-widest italic">Awaiting Sector Deployment</p>
             </div>
           )}

           <div className={`p-10 rounded-[3rem] border shadow-2xl relative overflow-hidden ${isDarkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-900 text-white'}`}>
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[100px] pointer-events-none"></div>
              <h3 className="text-xl font-black italic uppercase tracking-tighter mb-6">Strategic Recommendation</h3>
              <p className="text-sm font-medium text-slate-400 leading-relaxed italic">
                {intel.length > 0 
                  ? `Sector analysis reveals ${intel[0].name} dominates SEO but lacks a conversational concierge. By positioning ${selectedLead.businessName} with an AI booking assistant, we capture the "Immediate Intent" market they are currently ghosting.`
                  : "Initialize audit to generate predatory tactical recommendations."}
              </p>
           </div>
        </div>

        {/* Sidebar Ops */}
        <div className="lg:col-span-4 space-y-6">
           <div className={`p-8 rounded-3xl border ${isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200'} shadow-xl`}>
              <h4 className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-6 italic">Sector Statistics</h4>
              <div className="space-y-6">
                 <div>
                    <div className="flex justify-between text-[10px] font-black uppercase mb-1">
                       <span className="text-slate-400">Market Saturation</span>
                       <span className="text-rose-500">68%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                       <div className="h-full bg-rose-500 rounded-full" style={{ width: '68%' }}></div>
                    </div>
                 </div>
                 <div>
                    <div className="flex justify-between text-[10px] font-black uppercase mb-1">
                       <span className="text-slate-400">AI Readiness Index</span>
                       <span className="text-emerald-500">12%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                       <div className="h-full bg-emerald-500 rounded-full" style={{ width: '12%' }}></div>
                    </div>
                 </div>
              </div>
           </div>

           <div className={`p-8 rounded-3xl border ${isDarkMode ? 'bg-indigo-900/20 border-indigo-500/30 text-white' : 'bg-indigo-600 text-white'}`}>
              <h4 className="text-[10px] font-black uppercase tracking-widest mb-2 opacity-60">The "Trojan Horse" Hook</h4>
              <p className="text-xs font-bold leading-relaxed italic">"While your competitors in Limassol are still manual, we're building your business as the only 24/7 AI-responsive brand in the sector."</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default WarRoom;
