
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Lead, RegionConfig, AssetGrade } from '../types';
import InfoButton from './InfoButton';

interface Props {
  onLeadsFound: (leads: Lead[]) => void;
  currentRegion: RegionConfig;
}

const TheaterReconHub: React.FC<Props> = ({ onLeadsFound, currentRegion }) => {
  const [mode, setMode] = useState<'sweep' | 'surgical'>('sweep');
  const [query, setQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState('');

  const execute = async () => {
    setIsProcessing(true);
    setStatus(mode === 'sweep' ? `Scanning ${currentRegion.country} Sector...` : `Surgical Scout: ${query}...`);
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      let prompt = "";
      
      if (mode === 'sweep') {
        prompt = `Find 5 high-ticket businesses in ${currentRegion.country} (${currentRegion.subRegion || 'Capital'}) matching: ${currentRegion.nicheFocus?.join(', ')}. 
        Focus on 'Digital Ghosts' (High physical reputation, weak digital). Return a raw JSON array of leads.`;
      } else {
        prompt = `Find 5 businesses matching "${query}" in ${currentRegion.country}. Return a raw JSON array of leads.`;
      }

      // Updated to Gemini 2.5 Flash for Maps support
      // Removed responseMimeType: "application/json" as it is not supported with Google Maps tool
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt + " Output Format: [{businessName, websiteUrl, niche, city, socialGap, visualProof, score (0-100)}]. Do not use markdown formatting.",
        config: { tools: [{ googleSearch: {} }, { googleMaps: {} }] }
      });

      // Manual JSON cleanup since we can't use responseMimeType with Maps
      const cleanText = response.text?.replace(/```json|```/g, '').trim() || "[]";
      const raw = JSON.parse(cleanText);
      
      const leads: Lead[] = raw.map((l: any, i: number) => ({
        rank: Date.now() + i,
        ...l,
        region: currentRegion.country,
        assetGrade: l.score > 80 ? AssetGrade.A : AssetGrade.B,
        leadScore: l.score,
        currentPhase: 'SCAN',
        status: 'idle',
        firstSeenAt: Date.now(),
        lastTouchAt: Date.now(),
        phaseChangedAt: Date.now(),
        visualScore: 30, socialScore: 30, ticketScore: 20, reachabilityScore: 10,
        scoreConfidence: 85,
        conversionProbability: 50,
        outreachCount: 0, conversionAttempts: 0, outreachChannels: [],
        riskFlags: [], notes: ''
      }));

      onLeadsFound(leads);
      setStatus(`Acquired ${leads.length} Targets.`);
    } catch (e: any) {
      console.error(e);
      setStatus(`Error: ${e.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="p-8 glass-panel rounded-[2.5rem] relative overflow-hidden">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">Theater <span className="text-indigo-500">Recon</span> <InfoButton id="recon_hub"/></h2>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Sector: {currentRegion.country}</p>
        </div>
        <div className="flex bg-slate-900 p-1 rounded-xl">
          <button onClick={() => setMode('sweep')} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase ${mode === 'sweep' ? 'bg-indigo-600 text-white' : 'text-slate-500'}`}>Sweep</button>
          <button onClick={() => setMode('surgical')} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase ${mode === 'surgical' ? 'bg-rose-600 text-white' : 'text-slate-500'}`}>Surgical</button>
        </div>
      </div>

      {mode === 'surgical' && (
        <input type="text" value={query} onChange={e => setQuery(e.target.value)} placeholder="Target Niche (e.g. 'Dubai Crypto Lawyers')" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-xs font-bold mb-4 outline-none focus:border-rose-500" />
      )}

      <button onClick={execute} disabled={isProcessing} className={`w-full py-4 rounded-xl font-black text-xs uppercase tracking-[0.3em] transition-all ${isProcessing ? 'bg-slate-800 text-slate-500' : 'bg-white text-slate-900 hover:bg-indigo-500 hover:text-white'}`}>
        {isProcessing ? 'Scanning...' : 'Launch Recon'}
      </button>
      {status && <p className="text-center text-[10px] font-mono text-indigo-400 mt-4 uppercase">{status}</p>}
    </div>
  );
};
export default TheaterReconHub;
