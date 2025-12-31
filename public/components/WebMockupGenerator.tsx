
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Lead, VaultAsset } from '../types';
import InfoButton from './InfoButton';

interface WebMockupGeneratorProps {
  selectedLead: Lead | null;
  onProduced: (asset: Omit<VaultAsset, 'id' | 'timestamp'>) => void;
}

const WebMockupGenerator: React.FC<WebMockupGeneratorProps> = ({ selectedLead, onProduced }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [mockupUrl, setMockupUrl] = useState<string | null>(null);
  const [status, setStatus] = useState('');
  const [style, setStyle] = useState<'modern' | 'luxury' | 'dark' | 'minimal'>('luxury');
  const [hasApiKey, setHasApiKey] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    checkKeyStatus();
  }, []);

  const checkKeyStatus = async () => {
    // @ts-ignore
    if (window.aistudio && typeof window.aistudio.hasSelectedApiKey === 'function') {
      // @ts-ignore
      const hasKey = await window.aistudio.hasSelectedApiKey();
      setHasApiKey(hasKey);
    }
  };

  const generateMockup = async () => {
    if (!selectedLead) return;
    setIsGenerating(true);
    setStatus('Architecting Design System...');
    setIsSaved(false);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `A professional, high-fidelity 4K website mockup for a premium business named "${selectedLead.businessName}" in the ${selectedLead.niche} niche. 
      Style: ${style.toUpperCase()}. 
      Design Features: Ultra-modern UI, elegant typography, high-end photography reflecting ${selectedLead.visualProof}, sophisticated color palette, intuitive booking interface. 
      Perspective: Desktop browser view, centered layout. 
      Atmosphere: Trustworthy, elite, expensive. 
      No generic stock images; use cinematic visuals.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-image-preview',
        contents: { parts: [{ text: prompt }] },
        config: {
          imageConfig: {
            aspectRatio: "16:9",
            imageSize: "4K"
          }
        }
      });

      let foundImage = false;
      const candidate = response.candidates?.[0];
      if (candidate) {
        for (const part of candidate.content.parts) {
          if (part.inlineData) {
            const imageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
            setMockupUrl(imageUrl);
            foundImage = true;
            break;
          }
        }
      }

      if (foundImage) setStatus('Design Logic Finalized.');
      else throw new Error("Synthesis node returned empty result.");

    } catch (err: any) {
      console.error(err);
      setStatus(`Node Failure: ${err.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const saveToVault = () => {
    if (mockupUrl && !isSaved) {
      onProduced({
        url: mockupUrl,
        title: `4K Mockup: ${selectedLead?.businessName}`,
        type: 'mockup'
      });
      setIsSaved(true);
      setStatus('Asset archived to production vault.');
    }
  };

  if (!selectedLead) {
    return (
      <div className="max-w-4xl mx-auto py-20 text-center space-y-6 animate-in fade-in duration-500">
        <div className="w-24 h-24 bg-slate-100 rounded-[2.5rem] flex items-center justify-center mx-auto text-slate-300">
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-black uppercase italic tracking-tighter">Mockup Generator Offline</h3>
          <p className="text-slate-500 text-sm font-medium">Select a high-ticket target from the Leads tab to begin design synthesis.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 leading-none uppercase tracking-tighter italic flex items-center">
            4K Web <span className="text-indigo-600 ml-2">Mockup Engine</span>
            <InfoButton id="mockup" />
          </h2>
          <p className="text-slate-500 text-sm mt-2 font-medium italic">Transform static business profiles into elite 4K design concepts for the first pitch.</p>
        </div>
        <div className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${
            hasApiKey ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-amber-50 border-amber-200 text-amber-600'
        }`}>
            {hasApiKey ? 'Pro Uplink Active' : 'Paid Tier Key Required'}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-2xl space-y-8 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl pointer-events-none"></div>
             
             <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Target Context</label>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                   <p className="text-xs font-black text-slate-900 uppercase truncate">{selectedLead.businessName}</p>
                   <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">{selectedLead.niche}</p>
                </div>
             </div>

             <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Design Aesthetic (Style)</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['luxury', 'modern', 'dark', 'minimal'] as const).map(s => (
                    <button
                      key={s}
                      onClick={() => setStyle(s)}
                      className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                        style === s ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg' : 'bg-slate-50 text-slate-400 border-slate-100 hover:bg-slate-100'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
             </div>

             <button 
                onClick={generateMockup}
                disabled={isGenerating}
                className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-3 transition-all shadow-xl active:scale-95 ${
                  isGenerating ? 'bg-slate-200 text-slate-400' : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-indigo-500/30'
                }`}
             >
               {isGenerating ? (
                 <>
                   <div className="w-5 h-5 border-3 border-slate-400 border-t-indigo-600 rounded-full animate-spin"></div>
                   Synthesizing UI...
                 </>
               ) : (
                 <>
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                   Generate 4K Mockup
                 </>
               )}
             </button>
             {status && <p className="text-[10px] font-bold text-center text-slate-400 uppercase tracking-widest animate-pulse">{status}</p>}
          </div>

          {mockupUrl && (
            <div className="bg-slate-900 p-8 rounded-3xl text-white shadow-2xl space-y-6">
              <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest border-b border-white/5 pb-2">Production Actions</h4>
              <div className="space-y-3">
                 <button 
                  onClick={saveToVault}
                  disabled={isSaved}
                  className={`w-full py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                    isSaved ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-white/10 text-white border-white/10 hover:bg-white/20'
                  }`}
                 >
                   {isSaved ? 'Archived to Vault' : 'Archive to Vault'}
                 </button>
                 <a 
                  href={mockupUrl} 
                  download={`${selectedLead.businessName}_4K_Mockup.png`}
                  className="w-full py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/10 bg-indigo-600 text-white flex items-center justify-center gap-2 hover:bg-indigo-500 transition-all"
                 >
                   Download PNG
                 </a>
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-8">
           <div className="bg-slate-900 rounded-[3rem] p-8 md:p-12 shadow-2xl min-h-[600px] flex flex-col items-center justify-center relative overflow-hidden border border-white/10">
              <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 blur-[150px] pointer-events-none"></div>
              
              {mockupUrl ? (
                <div className="w-full space-y-6 animate-in zoom-in duration-500">
                   <div className="relative group rounded-3xl overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.8)] border border-white/20">
                      <img 
                        src={mockupUrl} 
                        decoding="async"
                        className="w-full h-auto transition-opacity duration-700 fade-in cursor-pointer" 
                        alt="Mockup Synthesis Result" 
                        onClick={() => console.log(mockupUrl)}
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                         <div className="bg-white/10 backdrop-blur-md px-6 py-2 rounded-full border border-white/20 text-[10px] font-black text-white uppercase tracking-widest">4K Design Synthesis</div>
                      </div>
                   </div>
                </div>
              ) : (
                <div className="text-center p-8 space-y-6 opacity-20">
                   <div className="w-24 h-24 bg-white/5 rounded-[2.5rem] flex items-center justify-center mx-auto border border-white/10">
                      <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                   </div>
                   <div className="space-y-2">
                      <p className="text-white text-2xl font-black uppercase italic tracking-tighter">Design Hub Idle</p>
                      <p className="text-indigo-200 text-xs font-bold uppercase tracking-widest max-w-xs mx-auto">Click generate to initialize the 4K pixel synthesis cluster.</p>
                   </div>
                </div>
              )}

              {isGenerating && (
                 <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm flex flex-col items-center justify-center z-50">
                    <div className="relative w-32 h-32 mb-8">
                       <div className="absolute inset-0 border-4 border-indigo-500/20 rounded-full"></div>
                       <div className="absolute inset-0 border-4 border-transparent border-t-indigo-500 rounded-full animate-spin"></div>
                    </div>
                    <p className="text-white font-black uppercase tracking-[0.4em] text-xs">Neural Rendering</p>
                    <p className="text-indigo-400 text-[10px] font-black uppercase mt-2 animate-pulse">{status}</p>
                 </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default WebMockupGenerator;
