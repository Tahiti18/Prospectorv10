
import React, { useState } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import InfoButton from './InfoButton';

interface BenchmarkHubProps {
  isDarkMode: boolean;
}

interface BenchmarkResult {
  brandName: string;
  summary: string;
  features: {
    visual: string[];
    motion: string[];
    sonic: string[];
    commercial: string[];
  };
  monetization: string;
  uiuxRating: string;
  agencyAngle: string;
  gapAnalysis: string;
}

const BenchmarkHub: React.FC<BenchmarkHubProps> = ({ isDarkMode }) => {
  const [url, setUrl] = useState('https://fomoai.com/');
  const [isCrawling, setIsCrawling] = useState(false);
  const [result, setResult] = useState<BenchmarkResult | null>(null);
  const [status, setStatus] = useState('');

  const runBenchmark = async () => {
    if (!url.trim()) return;
    setIsCrawling(true);
    setStatus('Initializing Multimedia Recon Suite...');
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      setStatus('Crawling for Sonic & Motion capabilities...');
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Study the website: ${url}. 
        Specifically deconstruct their multimedia stack:
        - Visuals (Image editing, background removal, 4K generation).
        - Motion (Video generation via Veo/Luma, cinematic editing).
        - Sonic (Music generation via Suno/Udio, voice synthesis, audio mixing).
        - Commercial (Pricing tiers, credit systems, B2B white-labeling).
        
        Compare this to an internal tool that has Veo 3.1 video and Gemini 3 4K mockups.
        
        Provide JSON Output: 
        {
          brandName, 
          summary, 
          features: { visual: [], motion: [], sonic: [], commercial: [] }, 
          monetization, 
          uiuxRating, 
          agencyAngle,
          gapAnalysis (1 sentence on how our app can surpass them)
        }`,
        config: {
          tools: [{ googleSearch: {} }],
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              brandName: { type: Type.STRING },
              summary: { type: Type.STRING },
              features: {
                type: Type.OBJECT,
                properties: {
                  visual: { type: Type.ARRAY, items: { type: Type.STRING } },
                  motion: { type: Type.ARRAY, items: { type: Type.STRING } },
                  sonic: { type: Type.ARRAY, items: { type: Type.STRING } },
                  commercial: { type: Type.ARRAY, items: { type: Type.STRING } }
                }
              },
              monetization: { type: Type.STRING },
              uiuxRating: { type: Type.STRING },
              agencyAngle: { type: Type.STRING },
              gapAnalysis: { type: Type.STRING }
            }
          }
        }
      });

      const data = JSON.parse(response.text || "{}");
      setResult(data);
      setStatus('Deep Intelligence Secured.');
    } catch (e: any) {
      console.error(e);
      setStatus(`Crawl Error: ${e.message}`);
    } finally {
      setIsCrawling(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in duration-700 pb-20">
      <div className="text-center space-y-4">
        <h2 className={`text-4xl font-black italic uppercase tracking-tighter ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Market <span className="text-amber-500">Reverse-Eng</span> Hub</h2>
        <p className="text-slate-500 text-sm font-medium uppercase tracking-widest">Multimedia Deconstruction & Tech Gap Analysis</p>
      </div>

      <div className={`p-10 rounded-[3.5rem] border shadow-2xl space-y-8 relative overflow-hidden ${isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
         <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 blur-[100px] pointer-events-none"></div>
         
         <div className="flex flex-col md:flex-row gap-4">
            <input 
              type="text" 
              value={url}
              onChange={e => setUrl(e.target.value)}
              placeholder="Enter target URL (e.g. fomoai.com)..."
              className={`flex-1 px-6 py-4 rounded-2xl border outline-none font-bold text-sm ${isDarkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-100'}`}
            />
            <button 
              onClick={runBenchmark}
              disabled={isCrawling}
              className="bg-amber-500 text-slate-950 px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-amber-600 transition-all active:scale-95 disabled:opacity-50"
            >
              {isCrawling ? 'Deconstructing Stack...' : 'Commence Deep Dive'}
            </button>
         </div>

         {isCrawling && (
           <div className="py-20 flex flex-col items-center justify-center space-y-6 animate-pulse">
              <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-[10px] font-black uppercase text-amber-500 tracking-[0.3em]">{status}</p>
           </div>
         )}

         {result && !isCrawling && (
           <div className="space-y-12 animate-in slide-in-from-bottom-4 duration-500">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                 <div className="lg:col-span-7 space-y-8">
                    <div>
                       <h3 className={`text-3xl font-black italic uppercase tracking-tighter mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{result.brandName}</h3>
                       <p className="text-sm font-medium text-slate-400 italic leading-relaxed">"{result.summary}"</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="space-y-4">
                          <h4 className="text-[10px] font-black text-amber-500 uppercase tracking-widest italic">Visual / Motion Stack</h4>
                          <div className="space-y-2">
                             {[...result.features.visual, ...result.features.motion].map((f, i) => (
                               <div key={i} className={`p-3 rounded-xl border flex items-center gap-3 ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
                                  <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
                                  <span className="text-[10px] font-bold uppercase text-slate-500">{f}</span>
                               </div>
                             ))}
                          </div>
                       </div>
                       <div className="space-y-4">
                          <h4 className="text-[10px] font-black text-amber-600 uppercase tracking-widest italic">Sonic / Music Stack</h4>
                          <div className="space-y-2">
                             {result.features.sonic.map((f, i) => (
                               <div key={i} className={`p-3 rounded-xl border flex items-center gap-3 ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
                                  <div className="w-1.5 h-1.5 bg-amber-600 rounded-full"></div>
                                  <span className="text-[10px] font-bold uppercase text-slate-500">{f}</span>
                               </div>
                             ))}
                             {result.features.sonic.length === 0 && <p className="text-[9px] font-black text-slate-400 uppercase italic">No Audio Capabilities Detected</p>}
                          </div>
                       </div>
                    </div>
                 </div>

                 <div className="lg:col-span-5 space-y-6">
                    <div className={`p-8 rounded-[2.5rem] border bg-amber-500 text-slate-950 shadow-xl`}>
                       <h4 className="text-[10px] font-black uppercase tracking-widest mb-4 opacity-60 italic">Feature Gap Analysis</h4>
                       <p className="text-xs font-bold leading-relaxed italic">"{result.gapAnalysis}"</p>
                    </div>

                    <div className={`p-8 rounded-[2.5rem] border ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-100'}`}>
                       <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Commercial Intelligence</h4>
                       <div className="space-y-6">
                          <div>
                             <p className="text-[8px] font-black text-slate-500 uppercase mb-1">Business Model</p>
                             <p className={`text-xs font-black uppercase italic ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{result.monetization}</p>
                          </div>
                          <div>
                             <p className="text-[8px] font-black text-slate-500 uppercase mb-1">Design System</p>
                             <p className={`text-xs font-black uppercase italic ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{result.uiuxRating}</p>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
         )}
      </div>
    </div>
  );
};

export default BenchmarkHub;
