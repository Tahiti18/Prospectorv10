
import React, { useState } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { Lead, AssetGrade, RegionConfig } from '../types';

interface DominanceCrawlerProps {
  onLeadsFound: (leads: Lead[]) => void;
  isDarkMode: boolean;
  currentRegion: RegionConfig;
}

const DominanceCrawler: React.FC<DominanceCrawlerProps> = ({ onLeadsFound, isDarkMode, currentRegion }) => {
  const [isCrawling, setIsCrawling] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('');

  const runBulkCrawl = async () => {
    setIsCrawling(true);
    setProgress(0);
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    let allLeads: Lead[] = [];

    try {
      // Step 1: Dynamically determine cities for this region
      setStatus(`Targeting high-ticket sectors in ${currentRegion.country}...`);
      const cityResponse = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Identify the 5 most affluent and high-ticket business cities/areas in ${currentRegion.country} ${currentRegion.subRegion ? `specifically in ${currentRegion.subRegion}` : ''}. Return as JSON array of strings.`,
        config: { responseMimeType: "application/json" }
      });
      const cities: string[] = JSON.parse(cityResponse.text || "[]");

      for (let i = 0; i < cities.length; i++) {
        const city = cities[i];
        setStatus(`Sweeping Sector: ${city.toUpperCase()}...`);
        
        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: `Find 6 high-ticket local businesses in ${city}, ${currentRegion.country} for premium niches (Real Estate, Luxury Medical, Yacht/Private Jets, High-end Design). 
          They must have professional visuals on their site but weak social presence.
          Return JSON array: [{businessName, websiteUrl, niche, city, socialGap, visualProof, score (0-100), phone, email}].`,
          config: { 
            tools: [{ googleSearch: {} }],
            responseMimeType: "application/json"
          }
        });

        const batch = JSON.parse(response.text || "[]");
        const batchLeads: Lead[] = batch.map((l: any, idx: number) => ({
          rank: allLeads.length + idx + 1,
          businessName: l.businessName,
          websiteUrl: l.websiteUrl,
          niche: l.niche,
          city: l.city || city,
          phone: l.phone || "Not found",
          email: l.email || "Not found",
          contactUrl: "Not found",
          instagram: "Not found",
          tiktok: "Not found",
          youtube: "Not found",
          socialGap: l.socialGap,
          visualProof: l.visualProof,
          assetGrade: l.score > 85 ? AssetGrade.A : AssetGrade.B,
          leadScore: l.score,
          scoreBreakdown: { visual: 35, social: 30, highTicket: 20, reachability: 10 },
          bestAngle: `AI Transformation calibrated for ${currentRegion.tone} market dynamics.`,
          personalizedHook: `I was analyzing elite brands in ${city} and your assets stood out.`,
          firstDeliverable: "AI website audit + mockup",
          notes: `Automatic discovery in ${currentRegion.country} theater.`,
          region: currentRegion.country
        }));

        allLeads = [...allLeads, ...batchLeads];
        setProgress(((i + 1) / cities.length) * 100);
        await new Promise(r => setTimeout(r, 1500)); 
      }
      
      // Ensure we hit the 30 lead target or close to it
      onLeadsFound(allLeads.slice(0, 30));
      setStatus(`Targeting Protocol Finalized: ${allLeads.length} assets secured.`);
    } catch (e) {
      console.error(e);
      setStatus('Crawl Node Interruption. Sector data partially secured.');
    } finally {
      setIsCrawling(false);
    }
  };

  return (
    <div className={`p-10 rounded-[3rem] border overflow-hidden relative transition-all ${isDarkMode ? 'bg-slate-900 border-indigo-500/30 shadow-2xl shadow-indigo-500/5' : 'bg-white border-slate-200 shadow-2xl'}`}>
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/5 blur-[100px] pointer-events-none"></div>
      
      <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
         <div className="space-y-2">
            <h2 className="text-3xl font-black italic uppercase tracking-tighter text-indigo-500 leading-none">Theater Crawler</h2>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Execute Full-Sector Sweep: {currentRegion.country}</p>
         </div>

         <div className="flex-1 w-full md:max-w-md space-y-4">
            <div className="h-4 bg-slate-100 dark:bg-slate-950 rounded-full overflow-hidden border border-black/5 p-1">
               <div className="h-full bg-indigo-600 rounded-full transition-all duration-700" style={{ width: `${progress}%` }}></div>
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">{status || 'Initiate Global Command sequence'}</p>
         </div>

         <button 
           onClick={runBulkCrawl}
           disabled={isCrawling}
           className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-xl hover:bg-indigo-500 transition-all active:scale-95 disabled:opacity-50"
         >
           {isCrawling ? 'Sweeping Regions...' : 'Commence Universal Recon'}
         </button>
      </div>
    </div>
  );
};

export default DominanceCrawler;
