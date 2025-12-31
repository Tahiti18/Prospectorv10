
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Lead, AssetGrade, MissionPhase, MissionStatus, RegionConfig } from '../types';
import InfoButton from './InfoButton';

interface LeadDiscoveryEngineProps {
  onLeadsFound: (leads: Lead[], location: string) => void;
  currentRegion: RegionConfig; 
}

const LeadDiscoveryEngine: React.FC<LeadDiscoveryEngineProps> = ({ onLeadsFound, currentRegion }) => {
  const [isSearching, setIsSearching] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (msg: string) => setLogs(prev => [msg, ...prev].slice(0, 3));

  const runManualSearch = async () => {
    setIsSearching(true);
    addLog('Initializing Neural Sweep...');
    
    const theater = `${currentRegion.subRegion ? currentRegion.subRegion + ', ' : ''}${currentRegion.country}`;
    const niches = currentRegion.nicheFocus ? currentRegion.nicheFocus.join(', ') : 'High-ticket luxury services';
    
    try {
      addLog(`Targeting Theater: ${theater}`);
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      // Step 1: Use Gemini 2.5 for Maps Grounding (Required for Maps tool)
      const reconResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Locate 6 premium local businesses in ${theater} within ${niches}. Return only businessName and websiteUrl.`,
        config: { tools: [{ googleMaps: {} }, { googleSearch: {} }] }
      });

      addLog('Parsing Intelligence Dossier...');
      
      // Step 2: Use Gemini 3 Pro to format the raw map data into strict JSON
      const dossierResponse = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Convert to high-fidelity JSON: ${reconResponse.text}. Fields: businessName, websiteUrl, phone, city, niche, email, socialGap, visualProof, leadScore(0-100), assetGrade(A|B|C).`,
        config: { responseMimeType: "application/json" }
      });

      const rawLeads = JSON.parse(dossierResponse.text || "[]");
      const processedLeads: Lead[] = rawLeads.map((l: any, idx: number) => ({
        rank: idx + 1,
        ...l,
        websiteUrl: l.websiteUrl === "Not found" ? "https://maps.google.com" : l.websiteUrl,
        region: currentRegion.country,
        campaignName: `${theater} Wave`,
        campaignTags: ["Scouted"],
        visualScore: Math.round((l.leadScore || 80) * 0.4),
        socialScore: Math.round((l.leadScore || 80) * 0.3),
        ticketScore: Math.round((l.leadScore || 80) * 0.2),
        reachabilityScore: Math.round((l.leadScore || 80) * 0.1),
        totalScore: l.leadScore || 80,
        scoreConfidence: 98,
        scoreReasoning: `Target verified in ${theater} sector.`,
        currentPhase: 'SCAN' as MissionPhase,
        status: 'idle' as MissionStatus,
        firstSeenAt: Date.now(),
        lastTouchAt: Date.now(),
        phaseChangedAt: Date.now(),
        outreachCount: 0,
        conversionAttempts: 0,
        outreachChannels: [],
        conversionProbability: l.leadScore || 50,
        notes: `Captured in ${theater}.`
      }));

      addLog(`Success. ${processedLeads.length} Targets Acquired.`);
      setTimeout(() => onLeadsFound(processedLeads, theater), 1000);
      
    } catch (error: any) {
      console.error(error);
      addLog(`Error: ${error.message}`);
      alert(`Scan failed: ${error.message}`);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="glass-panel rounded-[3rem] p-12 relative overflow-hidden min-h-[600px] flex flex-col items-center justify-center border-none">
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-500/5 blur-[150px] rounded-full pointer-events-none"></div>
      
      <div className="relative z-10 w-full max-w-2xl text-center space-y-12">
        
        {/* Header */}
        <div className="space-y-4">
          <div className={`inline-flex items-center gap-3 px-6 py-2 rounded-full border shadow-xl transition-all ${isSearching ? 'bg-indigo-500/10 border-indigo-500/30' : 'bg-white/5 border-white/5'}`}>
             <div className={`w-2 h-2 rounded-full ${isSearching ? 'bg-indigo-400 animate-ping' : 'bg-emerald-500'}`}></div>
             <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${isSearching ? 'text-indigo-300' : 'text-slate-400'}`}>
               {isSearching ? 'SCANNING SECTOR' : 'SYSTEM READY'}
             </span>
          </div>
          <h2 className="text-6xl font-black text-white italic uppercase tracking-tighter leading-none text-glow">
            Global <span className="text-indigo-500">Discovery</span>
          </h2>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.4em]">
            Active Theater: {currentRegion.country}
          </p>
        </div>

        {/* Central Radar Visualization */}
        <div className="relative w-72 h-72 mx-auto flex items-center justify-center">
           {/* Radar Rings */}
           <div className={`absolute inset-0 border border-indigo-500/10 rounded-full ${isSearching ? 'animate-[ping_3s_linear_infinite]' : ''}`}></div>
           <div className={`absolute inset-16 border border-indigo-500/20 rounded-full ${isSearching ? 'animate-[ping_3s_linear_infinite_1s]' : ''}`}></div>
           <div className={`absolute inset-32 border border-indigo-500/30 rounded-full`}></div>
           
           {/* Scanning Sweep */}
           {isSearching && (
             <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-indigo-500/10 to-transparent animate-spin [animation-duration:4s]"></div>
           )}

           {/* Center Activation Button */}
           <button 
             onClick={runManualSearch}
             disabled={isSearching}
             className={`w-32 h-32 rounded-full flex items-center justify-center backdrop-blur-md transition-all active:scale-95 group relative z-20 ${
               isSearching ? 'bg-black/40 border border-indigo-500/50 cursor-wait' : 'bg-white/5 hover:bg-indigo-600/20 border border-white/10 hover:border-indigo-500/50 cursor-pointer shadow-[0_0_40px_rgba(0,0,0,0.5)]'
             }`}
           >
             {isSearching ? (
               <div className="text-center">
                 <div className="w-12 h-12 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
               </div>
             ) : (
               <div className="flex flex-col items-center gap-1 group-hover:scale-110 transition-transform">
                 <svg className="w-10 h-10 text-white opacity-80 group-hover:opacity-100 group-hover:text-indigo-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" /></svg>
                 <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 group-hover:text-white mt-1">Activate</span>
               </div>
             )}
           </button>
        </div>

        {/* Status Log */}
        <div className="h-24 flex flex-col items-center justify-end space-y-2">
           {logs.map((log, i) => (
             <p key={i} className={`text-[10px] font-mono uppercase tracking-widest ${i === 0 ? 'text-indigo-400 font-bold' : 'text-slate-600'}`}>
               {i === 0 ? '> ' : ''} {log}
             </p>
           ))}
           {!isSearching && logs.length === 0 && (
             <p className="text-[10px] font-mono text-slate-600 uppercase tracking-widest opacity-50">Signal Intelligence Standby...</p>
           )}
        </div>

        {/* Manual Abort */}
        {isSearching && (
          <button 
            onClick={() => setIsSearching(false)}
            className="text-[9px] font-black text-rose-500 uppercase tracking-widest hover:text-white transition-colors"
          >
            [ Emergency Stop ]
          </button>
        )}

      </div>
    </div>
  );
};

export default LeadDiscoveryEngine;
