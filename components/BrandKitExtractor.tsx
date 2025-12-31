
import React, { useState } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { Lead, BrandKit } from '../types';

interface BrandKitExtractorProps {
  selectedLead: Lead | null;
  onExtracted: (leadId: number, kit: BrandKit) => void;
  isDarkMode: boolean;
}

const BrandKitExtractor: React.FC<BrandKitExtractorProps> = ({ selectedLead, onExtracted, isDarkMode }) => {
  const [isExtracting, setIsExtracting] = useState(false);
  const [status, setStatus] = useState('');

  const extractKit = async () => {
    if (!selectedLead) return;
    setIsExtracting(true);
    setStatus('Ingesting site visual CSS & metadata...');
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analyze the visual identity of "${selectedLead.businessName}" via their URL: ${selectedLead.websiteUrl}. 
        Identify:
        1. Primary Brand HEX code.
        2. Secondary Accent HEX code.
        3. Typography style (Serif/Sans-Serif/Minimal).
        4. Overall Brand Vibe (e.g. "Modern Luxury", "Traditional Heritage").
        
        Provide JSON: {primaryColor, secondaryColor, fontStyle, vibe}.`,
        config: {
          tools: [{ googleSearch: {} }],
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              primaryColor: { type: Type.STRING },
              secondaryColor: { type: Type.STRING },
              fontStyle: { type: Type.STRING },
              vibe: { type: Type.STRING }
            }
          }
        }
      });
      const kit = JSON.parse(response.text || "{}");
      onExtracted(selectedLead.rank, kit);
      setStatus('Visual Identity Locked.');
    } catch (e) {
      console.error(e);
      setStatus('Extraction node failed.');
    } finally {
      setIsExtracting(false);
    }
  };

  if (!selectedLead) return null;

  return (
    <div className={`p-8 rounded-[2.5rem] border transition-all ${isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200 shadow-xl'}`}>
      <div className="flex justify-between items-center mb-6">
        <div>
           <h3 className="text-sm font-black uppercase tracking-widest italic">Visual Identity Extractor</h3>
           <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Sync Mockups to Target Brand</p>
        </div>
        <button 
          onClick={extractKit}
          disabled={isExtracting}
          className="bg-indigo-600 text-white px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg hover:bg-indigo-500"
        >
          {isExtracting ? 'Analyzing...' : 'Extract Brand Kit'}
        </button>
      </div>

      {selectedLead.brandKit ? (
        <div className="grid grid-cols-2 gap-4 animate-in fade-in zoom-in-95 duration-500">
           <div className="space-y-3">
              <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Primary / Secondary</p>
              <div className="flex gap-2">
                 <div className="w-10 h-10 rounded-lg shadow-inner border border-black/5" style={{ backgroundColor: selectedLead.brandKit.primaryColor }}></div>
                 <div className="w-10 h-10 rounded-lg shadow-inner border border-black/5" style={{ backgroundColor: selectedLead.brandKit.secondaryColor }}></div>
              </div>
           </div>
           <div className="space-y-1">
              <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Vibe</p>
              <p className="text-[10px] font-black text-indigo-500 uppercase italic">{selectedLead.brandKit.vibe}</p>
              <p className="text-[8px] font-bold text-slate-400 uppercase">{selectedLead.brandKit.fontStyle} Type</p>
           </div>
        </div>
      ) : (
        <div className="py-6 text-center opacity-20 italic text-[10px] font-black uppercase tracking-widest border-2 border-dashed border-slate-300 rounded-2xl">
          Standby for Visual Sync
        </div>
      )}
      {status && <p className="text-[8px] text-center font-black uppercase text-indigo-400 mt-4 animate-pulse">{status}</p>}
    </div>
  );
};

export default BrandKitExtractor;
