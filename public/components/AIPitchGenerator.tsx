
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Lead } from '../types';
import TTSAssistant from './TTSAssistant';

interface AIPitchGeneratorProps {
  lead: Lead | null;
  isDarkMode: boolean;
}

type Language = 'English' | 'Greek' | 'Russian';

const AIPitchGenerator: React.FC<AIPitchGeneratorProps> = ({ lead, isDarkMode }) => {
  const [pitch, setPitch] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [language, setLanguage] = useState<Language>('English');
  const [isAudioMode, setIsAudioMode] = useState(false);

  const generatePitch = async () => {
    if (!lead) return;
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Act as a senior marketing strategist for Pomelli, an AI transformation agency in Limassol.
        Generate a hyper-personalized outreach pitch for the following lead in Cyprus in the language: ${language}.
        
        Business: ${lead.businessName}
        Niche: ${lead.niche}
        City: ${lead.city}
        Visual Proof: ${lead.visualProof}
        Social Gap: ${lead.socialGap}
        
        Guidelines:
        - If language is Greek or Russian, do not just translate; use cultural transcreation appropriate for local high-ticket business owners.
        - Paragraph 1: Compliment their visual assets.
        - Paragraph 2: Point out the social gap/revenue leakage.
        - Paragraph 3: Offer a custom audit and AI content demo.
        - Tone: Executive, sophisticated, and ROI-focused.`,
      });
      setPitch(response.text || 'Failed to generate pitch.');
    } catch (error) {
      setPitch('Error generating pitch. Please ensure API key is valid.');
    } finally {
      setLoading(false);
    }
  };

  if (!lead) {
    return (
      <div className={`border-2 border-dashed rounded-2xl p-12 text-center transition-colors ${
        isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200'
      }`}>
        <p className="text-slate-400 font-medium">Select a lead from the list to generate a custom AI pitch.</p>
      </div>
    );
  }

  return (
    <div className={`border rounded-2xl overflow-hidden shadow-sm transition-colors ${
      isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'
    }`}>
      <div className="bg-indigo-600 p-4 text-white flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-lg">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
          <h3 className="font-bold uppercase tracking-widest text-sm">Transcreation Engine</h3>
        </div>
        
        <div className="flex items-center gap-2 bg-black/20 p-1 rounded-xl">
           {(['English', 'Greek', 'Russian'] as Language[]).map(l => (
             <button
              key={l}
              onClick={() => setLanguage(l)}
              className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                language === l ? 'bg-white text-indigo-600 shadow-md' : 'text-white/60 hover:text-white'
              }`}
             >
               {l}
             </button>
           ))}
        </div>

        <button 
          onClick={generatePitch} 
          disabled={loading}
          className="bg-white text-indigo-600 px-6 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-indigo-50 transition-all disabled:opacity-50 active:scale-95"
        >
          {loading ? 'Transcreating...' : 'Engage Logic Node'}
        </button>
      </div>
      
      <div className="p-8">
        {loading ? (
          <div className="space-y-4 animate-pulse">
            <div className={`h-4 rounded w-3/4 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}></div>
            <div className={`h-4 rounded w-full ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}></div>
            <div className={`h-4 rounded w-5/6 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}></div>
            <div className={`h-24 rounded w-full ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}></div>
          </div>
        ) : pitch ? (
          <div className="space-y-8">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
               <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Signal Output: {language}</span>
               <button onClick={() => setIsAudioMode(!isAudioMode)} className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${isAudioMode ? 'text-indigo-600' : 'text-slate-400'}`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                  Voice Mode
               </button>
            </div>
            
            {isAudioMode ? (
              <div className="py-12 bg-slate-50 rounded-[3rem] border border-slate-100 flex flex-col items-center justify-center space-y-8 animate-in zoom-in duration-300">
                  <div className="flex items-end gap-1.5 h-16">
                     {[...Array(15)].map((_, i) => (
                       <div key={i} className="w-1.5 bg-indigo-500 rounded-full animate-pulse" style={{ height: `${Math.random() * 80 + 20}%`, animationDelay: `${i * 0.1}s` }}></div>
                     ))}
                  </div>
                  <TTSAssistant text={pitch} label="Synthesize WhatsApp Voice Memo" />
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Agency Voice Identification Active</p>
              </div>
            ) : (
              <div className={`prose prose-sm max-w-none leading-relaxed whitespace-pre-wrap italic font-medium ${
                isDarkMode ? 'text-slate-300' : 'text-slate-700'
              }`}>
                {pitch}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {!isAudioMode && <TTSAssistant text={pitch} label="Listen to Narrative" />}
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(pitch);
                  alert('Pitch copied to clipboard!');
                }}
                className={`w-full py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                  isDarkMode ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-slate-900 text-white hover:bg-slate-800'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
                Copy to Clipboard
              </button>
            </div>
          </div>
        ) : (
          <div className="py-20 text-center opacity-20">
            <p className="text-xl font-black uppercase italic tracking-tighter">Strategist Standby</p>
            <p className="text-[10px] font-bold uppercase tracking-widest mt-2">Target: {lead.businessName} ({language})</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIPitchGenerator;
