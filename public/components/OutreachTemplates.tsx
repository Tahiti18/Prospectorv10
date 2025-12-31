
import React, { useState } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { Lead } from '../types';
import InfoButton from './InfoButton';

interface OutreachTemplatesProps {
  selectedLead: Lead | null;
  isDarkMode: boolean;
}

const OutreachTemplates: React.FC<OutreachTemplatesProps> = ({ selectedLead, isDarkMode }) => {
  const [userName, setUserName] = useState<string>('Alex');
  const [isGenerating, setIsGenerating] = useState(false);
  const [tone, setTone] = useState<'Sophisticated' | 'Aggressive' | 'Friendly'>('Sophisticated');
  
  const [aiTemplates, setAiTemplates] = useState<{
    linkedin_conn: string;
    linkedin_dm: string;
    whatsapp: string;
    email: string;
  } | null>(null);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Signal Copied to Clipboard.');
  };

  const generateAITemplates = async () => {
    if (!selectedLead) return;
    setIsGenerating(true);
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `
        Act as a world-class high-ticket outreach specialist for Pomelli, an AI agency.
        Target Lead: ${selectedLead.businessName} (${selectedLead.niche} in ${selectedLead.city})
        Visual Assets: ${selectedLead.visualProof}
        Social Gap: ${selectedLead.socialGap}
        Sender Name: ${userName}
        Tone: ${tone}
        
        Task:
        1. LinkedIn connection note (max 300 chars).
        2. LinkedIn Direct Message (post-connection follow-up, max 800 chars).
        3. WhatsApp signal. Short, informal but high-status, asking for permission to send a 30s demo video.
        4. High-conversion Cold Email (140 words max).
        
        Return JSON format: { "linkedin_conn": "...", "linkedin_dm": "...", "whatsapp": "...", "email": "..." }
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              linkedin_conn: { type: Type.STRING },
              linkedin_dm: { type: Type.STRING },
              whatsapp: { type: Type.STRING },
              email: { type: Type.STRING }
            }
          }
        }
      });

      const data = JSON.parse(response.text || "{}");
      setAiTemplates(data);
    } catch (e) {
      console.error(e);
      alert("Neural synthesis interrupted. Check API uplink.");
    } finally {
      setIsGenerating(false);
    }
  };

  const getPlaceholderValue = (field: string) => {
    if (!selectedLead) return `[${field}]`;
    switch(field) {
      case 'Name': return selectedLead.decisionMaker || 'the owner';
      case 'Business Name': return selectedLead.businessName;
      case 'Visual Proof': return selectedLead.visualProof;
      case 'Social Gap': return selectedLead.socialGap;
      case 'City': return selectedLead.city;
      case 'First Deliverable': return selectedLead.firstDeliverable;
      case 'Niche': return selectedLead.niche;
      default: return `[${field}]`;
    }
  };

  // Base Templates (Fallback)
  const baseLinkedInDM = `Hi ${getPlaceholderValue('Name')},\n\nI was looking at the ${getPlaceholderValue('Visual Proof')} for ${getPlaceholderValue('Business Name')} today. Genuinely world-class quality.\n\nHowever, noticed those assets aren't being effectively leveraged on social right now. In ${getPlaceholderValue('City')}, that's likely causing a significant revenue leak to competitors who are more digitally active.\n\nI’ve drafted a custom ${getPlaceholderValue('First Deliverable')} for you that shows how we can fix this with AI automation.\n\nWould you be open to a 3-minute video walkthrough of the blueprint?\n\nBest,\n${userName}`;

  const baseWhatsApp = `Hi ${getPlaceholderValue('Name')}, this is ${userName} from Pomelli.\n\nI just saw the ${getPlaceholderValue('Visual Proof')} on your site—stunning.\n\nI noticed a specific conversion gap on your Instagram that we can fix with AI. Mind if I send a 30s demo video of how we can recover those missed bookings?`;

  return (
    <div className="space-y-12 pb-24 animate-in fade-in duration-1000 max-w-7xl mx-auto w-full">
      {/* Settings Header */}
      <section className="glass-card p-10 rounded-[3rem] border border-white/5 shadow-2xl flex flex-col lg:flex-row gap-10 items-end">
        <div className="flex-1 space-y-6 w-full">
          <div className="flex items-center gap-4">
             <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
             <h3 className="text-sm font-black uppercase tracking-[0.3em] italic text-indigo-400">Signal Orchestration Center</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 italic">Operator Identity</label>
              <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} className="w-full px-6 py-4 bg-slate-950 border border-white/5 rounded-2xl text-sm font-bold text-white outline-none focus:border-indigo-500/50 transition-all shadow-inner" />
            </div>
            <div>
              <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 italic">Target Tone Protocol</label>
              <div className="flex bg-slate-950 p-1 rounded-2xl border border-white/5">
                {(['Sophisticated', 'Aggressive', 'Friendly'] as const).map(t => (
                  <button key={t} onClick={() => setTone(t)} className={`flex-1 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${tone === t ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-end">
               <button 
                 onClick={generateAITemplates}
                 disabled={isGenerating || !selectedLead}
                 className="w-full py-4 bg-indigo-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] shadow-xl hover:bg-indigo-400 transition-all active:scale-95 disabled:opacity-30 disabled:grayscale"
               >
                 {isGenerating ? 'Synthesizing Signals...' : 'Generate Neural Templates'}
               </button>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* LinkedIn & WhatsApp Column */}
        <div className="lg:col-span-6 space-y-10">
          
          <div className="space-y-4">
             <div className="flex justify-between items-center px-4">
               <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 italic">01. LinkedIn Direct Message (Bridge)</h4>
               <span className="text-[8px] font-black text-indigo-400 px-2 py-0.5 border border-indigo-400/20 rounded uppercase">Context: {aiTemplates?.linkedin_dm ? 'NEURAL' : 'BASE'}</span>
             </div>
             <div className={`p-10 rounded-[3.5rem] shadow-2xl relative overflow-hidden transition-all border ${isDarkMode ? 'bg-slate-950 border-white/10' : 'bg-white border-slate-100'} min-h-[300px]`}>
                <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/5 blur-[80px] pointer-events-none"></div>
                <div className="flex justify-between items-start mb-6">
                   <span className="text-[9px] font-black uppercase tracking-widest text-slate-600">{aiTemplates?.linkedin_dm ? 'Synthesized Payload' : 'Base Protocol'}</span>
                   <button onClick={() => copyToClipboard(aiTemplates?.linkedin_dm || baseLinkedInDM)} className="text-[9px] font-black uppercase tracking-widest text-indigo-400 hover:text-indigo-300 transition-colors bg-white/5 px-4 py-2 rounded-xl border border-white/5">Copy DM</button>
                </div>
                <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed italic text-slate-400 selection:bg-indigo-500/30">
                  {aiTemplates?.linkedin_dm || baseLinkedInDM}
                </pre>
             </div>
          </div>

          <div className="space-y-4">
             <div className="flex justify-between items-center px-4">
               <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 italic">02. WhatsApp Signal (Permission Request)</h4>
               <span className="text-[8px] font-black text-emerald-400 px-2 py-0.5 border border-emerald-400/20 rounded uppercase">Direct mobile infiltration</span>
             </div>
             <div className={`p-10 rounded-[3rem] shadow-2xl relative overflow-hidden transition-all border ${isDarkMode ? 'bg-slate-900 border-white/5' : 'bg-white border-slate-100'}`}>
                <div className="flex justify-between items-start mb-6">
                   <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                      <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Short & High-Status</span>
                   </div>
                   <button onClick={() => copyToClipboard(aiTemplates?.whatsapp || baseWhatsApp)} className="text-[9px] font-black uppercase tracking-widest text-emerald-500 hover:text-emerald-400 transition-colors bg-white/5 px-4 py-2 rounded-xl border border-white/5">Copy Message</button>
                </div>
                <p className="text-sm font-black italic leading-relaxed text-slate-300">
                  "{aiTemplates?.whatsapp || baseWhatsApp}"
                </p>
             </div>
          </div>
        </div>

        {/* Email & Info Column */}
        <div className="lg:col-span-6 space-y-10">
          <div className="space-y-4">
             <div className="flex justify-between items-center px-4">
               <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 italic">03. High-Conversion Cold Email</h4>
               <span className="text-[8px] font-black text-indigo-400 px-2 py-0.5 border border-indigo-400/20 rounded">TYPE: MASTER PAYLOAD</span>
             </div>
             <div className="bg-slate-950 p-12 rounded-[4rem] border border-white/10 space-y-10 shadow-2xl relative overflow-hidden group">
                <div className="absolute bottom-0 right-0 w-48 h-48 bg-indigo-500/5 blur-[80px]"></div>
                <div className="flex justify-between items-center border-b border-white/5 pb-8">
                   <h4 className="text-xl font-black italic uppercase text-white tracking-tight">Email Signal</h4>
                   <button onClick={() => copyToClipboard(aiTemplates?.email || "Subject: Your visuals deserve more attention...")} className="text-[9px] font-black text-indigo-400 hover:text-indigo-300 uppercase tracking-widest">Copy Email</button>
                </div>
                <div className="prose prose-invert max-w-none text-slate-400 italic text-sm leading-relaxed whitespace-pre-wrap font-medium">
                  {aiTemplates?.email || `Subject: Your visuals deserve more attention in ${getPlaceholderValue('City')}\n\nHi ${getPlaceholderValue('Name')},\n\nI was just browsing your site and saw the incredible ${getPlaceholderValue('Visual Proof')}. Genuinely world-class quality.\n\nHowever, I noticed a major disconnect on your social channels. Your ${getPlaceholderValue('Social Gap')} is likely costing you high-ticket clients who live on Instagram and TikTok.\n\nAt Pomelli, we turn premium assets like yours into a 24/7 conversion engine. I’ve already architected an ${getPlaceholderValue('First Deliverable')} specifically for ${getPlaceholderValue('Business Name')} to show you how we recover those missed bookings.\n\nWould you be open to a 5-minute Zoom next Tuesday to see the blueprint?\n\nBest,\n${userName}`}
                </div>
             </div>
          </div>

          <div className="p-8 rounded-[2.5rem] bg-indigo-950/20 border border-indigo-500/20 text-center">
             <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-2">Strategy Tip</p>
             <p className="text-[10px] text-slate-500 font-bold uppercase italic leading-relaxed">
               "Signals referencing specific site photography (Visual Proof) have 3.4x higher reply rates. Always mention a specific asset to break the generic noise filter."
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OutreachTemplates;
