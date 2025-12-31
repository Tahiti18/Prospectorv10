
import React, { useState, useRef } from 'react';
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Lead } from '../types';
import InfoButton from './InfoButton';

interface FlashSparkProps {
  selectedLead: Lead | null;
}

const FlashSpark: React.FC<FlashSparkProps> = ({ selectedLead }) => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [isSparking, setIsSparking] = useState(false);
  
  const sparkStream = async (customPrompt?: string) => {
    const finalPrompt = customPrompt || input;
    if (!finalPrompt.trim()) return;

    setIsSparking(true);
    setResult('');
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const context = selectedLead 
        ? `Focus context: ${selectedLead.businessName} (${selectedLead.niche} in ${selectedLead.city}). Gap: ${selectedLead.socialGap}. `
        : "";

      const responseStream = await ai.models.generateContentStream({
        model: 'gemini-flash-lite-latest',
        contents: `${context}Task: ${finalPrompt}. Be extremely fast, concise, and provide multiple options in bullet points.`,
        config: {
          temperature: 1,
          topP: 0.95,
          topK: 40
        }
      });

      for await (const chunk of responseStream) {
        const c = chunk as GenerateContentResponse;
        setResult(prev => prev + (c.text || ''));
      }
    } catch (err: any) {
      console.error(err);
      setResult("Error in Spark Transmission.");
    } finally {
      setIsSparking(false);
    }
  };

  const instantCommands = [
    { label: "5 Viral Hook Ideas", prompt: "Give me 5 viral social media hook ideas specifically for this lead's visual proof." },
    { label: "Phone Rebuttal", prompt: "The prospect says 'We don't have budget right now'. Give me a 2-sentence sophisticated rebuttal." },
    { label: "Subject Line Burst", prompt: "Generate 5 click-worthy email subject lines that reference luxury visual assets." },
    { label: "WhatsApp Icebreaker", prompt: "Write a short, professional WhatsApp icebreaker referencing their high-ticket niche." }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 leading-none uppercase tracking-tighter italic flex items-center">
            <span className="text-cyan-500 mr-2">Flash</span> Spark Node
            {/* Fix: Ensured the id is a string "flash_spark" and not a boolean variable like isSparking */}
            <InfoButton id="flash_spark" />
          </h2>
          <p className="text-slate-500 text-sm mt-2 font-medium">Ultra-low latency micro-task automation for high-speed agency ops.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-cyan-50 border border-cyan-100 rounded-full text-cyan-600">
          <span className={`w-2 h-2 rounded-full ${isSparking ? 'bg-cyan-500 animate-ping' : 'bg-slate-300'}`}></span>
          <span className="text-[10px] font-black uppercase tracking-widest">{isSparking ? 'Sparking...' : 'Node Standby'}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xl space-y-6">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Instant Commands</h4>
            <div className="space-y-2">
              {instantCommands.map(cmd => (
                <button
                  key={cmd.label}
                  onClick={() => sparkStream(cmd.prompt)}
                  className="w-full text-left p-4 rounded-2xl text-[11px] font-black text-slate-600 hover:bg-cyan-50 hover:text-cyan-600 border border-transparent hover:border-cyan-200 transition-all flex items-center justify-between group"
                >
                  {cmd.label}
                  <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                </button>
              ))}
            </div>
          </div>
          <div className="bg-slate-900 p-6 rounded-3xl text-white shadow-2xl space-y-4">
            <div className="w-10 h-10 bg-cyan-500 rounded-xl flex items-center justify-center text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <h3 className="text-sm font-black uppercase italic tracking-tighter">Powered by Gemini Flash</h3>
            <p className="text-[10px] font-medium text-slate-400 leading-relaxed">Flash Spark leverages the ultra-low latency Gemini Flash model to deliver creative hooks and rebuttals in sub-seconds.</p>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl h-[500px] flex flex-col overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Spark Output Node</span>
              <button 
                onClick={() => setResult('')}
                className="text-[9px] font-black text-slate-400 hover:text-cyan-600 uppercase tracking-widest transition-colors"
              >
                Clear
              </button>
            </div>
            <div className="flex-1 p-8 overflow-y-auto font-medium text-slate-700 leading-relaxed text-sm whitespace-pre-wrap">
              {result ? (
                <div className="animate-in fade-in duration-300">{result}</div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-20">
                  <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  <p className="text-lg font-black uppercase italic">Node Standby</p>
                  <p className="text-xs font-bold max-w-xs mt-1 uppercase tracking-widest">Select an instant command or input a micro-task below.</p>
                </div>
              )}
            </div>
            <div className="p-6 bg-white border-t border-slate-100">
              <div className="flex gap-3">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sparkStream()}
                  placeholder="Rapid hook, rebuttal, or micro-task..."
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 text-sm font-medium outline-none focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500 transition-all"
                />
                <button 
                  onClick={() => sparkStream()}
                  disabled={isSparking || !input.trim()}
                  className="bg-slate-900 text-white p-3 rounded-2xl hover:bg-cyan-600 transition-all active:scale-90 shadow-lg disabled:opacity-50"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Fix: Added default export to resolve import error in App.tsx
export default FlashSpark;
