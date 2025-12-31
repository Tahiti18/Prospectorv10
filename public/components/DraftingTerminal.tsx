
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Lead, AgencyProfile, RegionConfig } from '../types';

interface DraftingTerminalProps {
  selectedLead: Lead | null;
  isDarkMode: boolean;
}

const DraftingTerminal: React.FC<DraftingTerminalProps> = ({ selectedLead, isDarkMode }) => {
  const [draft, setDraft] = useState('');
  const [isDrafting, setIsDrafting] = useState(false);
  const [copyStatus, setCopyStatus] = useState(false);

  const generateDraft = async (type: 'email' | 'whatsapp' | 'linkedin') => {
    if (!selectedLead) return;
    setIsDrafting(true);
    setCopyStatus(false);
    try {
      const profileStr = localStorage.getItem('pomelli_agency_profile');
      const profile: AgencyProfile = profileStr ? JSON.parse(profileStr) : { name: 'Pomelli', ceoName: 'Agency Owner' };
      const regionStr = localStorage.getItem('pomelli_active_region');
      const region: RegionConfig = regionStr ? JSON.parse(regionStr) : { country: 'USA', tone: 'Professional' };

      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Draft a high-conversion ${type} message for "${selectedLead.businessName}" located in ${selectedLead.city}, ${region.country}. 
        Agency: ${profile.name}, CEO: ${profile.ceoName}. 
        Focus: Selling AI Transformation based on their gap: ${selectedLead.socialGap}. 
        Style: ${region.tone}. Local Nuance: Ensure the message feels authentic to a business owner in ${selectedLead.city}. 
        Reference their visual proof: ${selectedLead.visualProof}.`,
      });
      setDraft(response.text || '');
    } catch (e) {
      console.error(e);
    } finally {
      setIsDrafting(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(draft);
    setCopyStatus(true);
    setTimeout(() => setCopyStatus(false), 2000);
  };

  if (!selectedLead) return <div className="p-20 text-center opacity-30 italic font-black uppercase tracking-tighter">Select target to engage terminal</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
           <h2 className={`text-2xl font-black italic uppercase tracking-tighter ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Outreach Drafting Terminal</h2>
           <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Direct Clipboard Finalization</p>
        </div>
        <div className="flex gap-2">
           {(['email', 'whatsapp', 'linkedin'] as const).map(type => (
             <button 
              key={type}
              onClick={() => generateDraft(type)}
              disabled={isDrafting}
              className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                isDarkMode ? 'bg-slate-900 border-slate-800 text-indigo-400 hover:bg-slate-800' : 'bg-white border-slate-200 text-indigo-600 hover:bg-slate-50'
              }`}
             >
               {type}
             </button>
           ))}
        </div>
      </div>

      <div className={`p-10 rounded-[3rem] border h-[500px] flex flex-col relative overflow-hidden transition-all ${
        isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-2xl'
      }`}>
         <div className="absolute inset-0 bg-indigo-500/5 blur-[80px] pointer-events-none"></div>
         
         <div className="flex justify-between items-center mb-6">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Signal Output</span>
            {draft && (
              <button 
                onClick={handleCopy}
                className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                  copyStatus ? 'bg-emerald-500 text-white' : 'bg-indigo-600 text-white hover:bg-indigo-500'
                }`}
              >
                {copyStatus ? 'Copied' : 'Copy to Clipboard'}
              </button>
            )}
         </div>

         <div className="flex-1 overflow-y-auto font-mono text-sm leading-relaxed p-6 bg-black/5 rounded-3xl border border-black/5 shadow-inner">
            {isDrafting ? (
              <div className="h-full flex items-center justify-center">
                 <div className="text-indigo-500 font-black animate-pulse uppercase tracking-[0.3em] text-[10px]">Synthesizing regional draft...</div>
              </div>
            ) : draft ? (
              <div className={`whitespace-pre-wrap ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>{draft}</div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center opacity-10">
                 <p className="font-black uppercase tracking-[0.4em] italic text-sm">Terminal Standby</p>
              </div>
            )}
         </div>
      </div>
    </div>
  );
};

export default DraftingTerminal;
