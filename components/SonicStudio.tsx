
import React, { useState } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { Lead, VaultAsset } from '../types';
import TTSAssistant from './TTSAssistant';
import InfoButton from './InfoButton';

interface SonicStudioProps {
  selectedLead: Lead | null;
  isDarkMode: boolean;
  onProduced: (asset: Omit<VaultAsset, 'id' | 'timestamp'>) => void;
}

const SonicStudio: React.FC<SonicStudioProps> = ({ selectedLead, isDarkMode, onProduced }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [audioPrompt, setAudioPrompt] = useState('');
  const [sunoPrompt, setSunoPrompt] = useState('');
  const [voiceoverScript, setVoiceoverScript] = useState('');

  const architectSonicBrand = async () => {
    if (!selectedLead) return;
    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Create a "Sonic Identity" for ${selectedLead.businessName}, a high-ticket ${selectedLead.niche} in Cyprus. 
        Provide:
        1. A background music prompt for Suno/Udio (Style: Mediterranean Luxury, BPM, Instruments).
        2. A 30-second sophisticated executive voiceover script for their first video pitch.
        
        Return JSON: { musicPrompt, voiceScript }.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              musicPrompt: { type: Type.STRING },
              voiceScript: { type: Type.STRING }
            }
          }
        }
      });
      const data = JSON.parse(response.text || "{}");
      setSunoPrompt(data.musicPrompt);
      setVoiceoverScript(data.voiceScript);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const saveSonicAsset = () => {
    if (voiceoverScript) {
      onProduced({
        url: 'sonic_icon',
        title: `Sonic Identity: ${selectedLead?.businessName}`,
        type: 'sonic',
        content: `MUSIC PROMPT: ${sunoPrompt}\n\nVOICE SCRIPT: ${voiceoverScript}`
      });
      alert('Sonic Brand archived to Production Hub.');
    }
  };

  if (!selectedLead) return <div className="p-20 text-center opacity-30 italic font-black uppercase tracking-widest">Select Target to Begin Sonic Architecture</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in duration-700 pb-20">
      <div className="flex justify-between items-center">
         <div>
            <h2 className={`text-3xl font-black italic uppercase tracking-tighter ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Sonic <span className="text-cyan-500">Studio</span></h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Multi-Sensory Brand Architecture</p>
         </div>
         <button 
           onClick={architectSonicBrand}
           disabled={isGenerating}
           className="bg-cyan-600 text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-cyan-500 transition-all active:scale-95"
         >
           {isGenerating ? 'Synthesizing Vibe...' : 'Architect Sonic Identity'}
         </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <div className={`p-10 rounded-[3.5rem] border shadow-2xl space-y-8 relative overflow-hidden ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            <div className="flex items-center gap-4 border-b border-black/5 pb-6">
               <div className="w-12 h-12 bg-cyan-600/10 text-cyan-600 rounded-2xl flex items-center justify-center text-2xl">🎵</div>
               <div>
                  <h3 className="text-sm font-black uppercase italic">AI Music Engine</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Suno/Udio Prompt Architect</p>
               </div>
            </div>
            
            <div className="space-y-4">
               <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Master Prompt for Third-Party Synthesis</p>
               <div className="p-6 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-3xl italic text-xs font-medium leading-relaxed text-slate-400">
                  {sunoPrompt || "Awaiting architectural sync..."}
               </div>
               {sunoPrompt && (
                 <button onClick={() => navigator.clipboard.writeText(sunoPrompt)} className="text-[9px] font-black text-cyan-600 uppercase hover:underline">Copy Prompt to Suno →</button>
               )}
            </div>
         </div>

         <div className={`p-10 rounded-[3.5rem] border shadow-2xl space-y-8 relative overflow-hidden ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            <div className="flex items-center gap-4 border-b border-black/5 pb-6">
               <div className="w-12 h-12 bg-indigo-600/10 text-indigo-600 rounded-2xl flex items-center justify-center text-2xl">🎙️</div>
               <div>
                  <h3 className="text-sm font-black uppercase italic">Voice Synthesis</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Executive Narrator Engine</p>
               </div>
            </div>

            <div className="space-y-6">
               <div className="p-6 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-3xl italic text-xs font-medium leading-relaxed text-slate-400 max-h-40 overflow-y-auto">
                  {voiceoverScript || "Awaiting script generation..."}
               </div>
               {voiceoverScript && (
                 <div className="flex items-center justify-between">
                    <TTSAssistant text={voiceoverScript} label="Render Script Audio" />
                    <button onClick={saveSonicAsset} className="bg-slate-900 text-white px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest">Archive Script</button>
                 </div>
               )}
            </div>
         </div>
      </div>
    </div>
  );
};

export default SonicStudio;
