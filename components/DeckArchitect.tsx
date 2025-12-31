
import React, { useState } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { Lead, SalesSlide } from '../types';
import InfoButton from './InfoButton';

interface DeckArchitectProps {
  selectedLead: Lead | null;
  isDarkMode: boolean;
}

const DeckArchitect: React.FC<DeckArchitectProps> = ({ selectedLead, isDarkMode }) => {
  const [slides, setSlides] = useState<SalesSlide[]>([]);
  const [isArchitecting, setIsArchitecting] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);

  const generateDeck = async () => {
    if (!selectedLead) return;
    setIsArchitecting(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Create a 6-slide high-ticket sales presentation for "${selectedLead.businessName}" in ${selectedLead.city}. 
        The objective is to sell them an AI Transformation.
        
        Slide 1: Vision & Opportunity
        Slide 2: Current Digital Vulnerabilities (The Gap)
        Slide 3: Competitor Pressure (Cyprus Context)
        Slide 4: The AI Solution Architecture
        Slide 5: 12-Month ROI Forecast
        Slide 6: Commencement Roadmap
        
        Provide JSON array of {title, content, bulletPoints, visualPrompt}.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                content: { type: Type.STRING },
                bulletPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
                visualPrompt: { type: Type.STRING }
              }
            }
          }
        }
      });
      setSlides(JSON.parse(response.text || "[]"));
    } catch (e) {
      console.error(e);
    } finally {
      setIsArchitecting(false);
    }
  };

  if (!selectedLead) return <div className="p-20 text-center opacity-30 italic font-black uppercase tracking-tighter">Target context required for Deck Architecture</div>;

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex justify-between items-center">
        <div>
          <h2 className={`text-2xl font-black italic uppercase tracking-tighter ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Sales Deck Architect</h2>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">High-Conversion Narrative Synthesis</p>
        </div>
        <button 
          onClick={generateDeck}
          disabled={isArchitecting}
          className="bg-indigo-600 text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-indigo-500 transition-all active:scale-95"
        >
          {isArchitecting ? 'Architecting Narrative...' : 'Build Master Deck'}
        </button>
      </div>

      {slides.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-4 space-y-3">
             {slides.map((s, idx) => (
               <button 
                key={idx}
                onClick={() => setActiveSlide(idx)}
                className={`w-full p-6 rounded-3xl border text-left transition-all group ${
                  activeSlide === idx 
                    ? 'bg-indigo-600 border-indigo-500 text-white shadow-xl scale-105' 
                    : isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-500' : 'bg-white border-slate-200 text-slate-400'
                }`}
               >
                 <span className="text-[8px] font-black uppercase tracking-[0.3em] opacity-60">Slide 0{idx + 1}</span>
                 <h4 className="text-xs font-black uppercase mt-1 truncate">{s.title}</h4>
               </button>
             ))}
          </div>

          <div className="lg:col-span-8">
             <div className={`p-16 rounded-[4rem] border min-h-[500px] flex flex-col relative overflow-hidden transition-all ${
               isDarkMode ? 'bg-slate-900 border-slate-800 shadow-2xl' : 'bg-white border-slate-200 shadow-2xl shadow-indigo-500/5'
             }`}>
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/5 blur-[100px] pointer-events-none"></div>
                
                <div className="relative z-10 space-y-8 animate-in slide-in-from-right-8 duration-500" key={activeSlide}>
                   <h3 className={`text-5xl font-black italic uppercase tracking-tighter leading-none ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                     {slides[activeSlide].title}
                   </h3>
                   <p className="text-xl text-slate-400 font-medium italic leading-relaxed">
                     "{slides[activeSlide].content}"
                   </p>
                   <ul className="space-y-4 pt-8 border-t border-slate-800/10">
                      {slides[activeSlide].bulletPoints.map((bp, i) => (
                        <li key={i} className="flex items-start gap-4">
                           <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 shrink-0"></div>
                           <span className="text-sm font-bold uppercase tracking-tight text-slate-500 leading-relaxed">{bp}</span>
                        </li>
                      ))}
                   </ul>
                </div>

                <div className="mt-auto pt-12 flex justify-between items-end border-t border-slate-800/5 opacity-40">
                   <p className="text-[9px] font-black uppercase tracking-[0.3em]">Agency Exclusive Strategy</p>
                   <p className="text-[9px] font-black uppercase tracking-[0.3em]">Confidential Production</p>
                </div>
             </div>
          </div>
        </div>
      ) : (
        <div className={`p-20 border-2 border-dashed rounded-[4rem] text-center opacity-20 ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
          <svg className="w-20 h-20 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
          <p className="text-sm font-black uppercase tracking-widest italic">Awaiting Mission Briefing Synthesis</p>
        </div>
      )}
    </div>
  );
};

export default DeckArchitect;
