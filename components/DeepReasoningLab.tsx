
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Lead, VaultAsset } from '../types';
import InfoButton from './InfoButton';

interface DeepReasoningLabProps {
  selectedLead: Lead | null;
  onProduced: (asset: Omit<VaultAsset, 'id' | 'timestamp'>) => void;
  isDarkMode: boolean;
}

const DeepReasoningLab: React.FC<DeepReasoningLabProps> = ({ selectedLead, onProduced, isDarkMode }) => {
  const [prompt, setPrompt] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [result, setResult] = useState('');
  const [thinkingBudget, setThinkingBudget] = useState(16000); 
  const [status, setStatus] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const executeDeepReasoning = async (customPrompt?: string) => {
    const finalPrompt = customPrompt || prompt;
    if (!finalPrompt.trim() || isThinking) return;

    setIsThinking(true);
    setResult('');
    setIsSaved(false);
    setStatus('Engaging Neural Synapse Nodes...');

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const context = selectedLead 
        ? `Target Lead Context: ${selectedLead.businessName}, ${selectedLead.niche} in ${selectedLead.city}. Score: ${selectedLead.leadScore}. Gap: ${selectedLead.socialGap}. `
        : "General High-Ticket Agency Context. ";

      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `${context}\n\nStrategic Task: ${finalPrompt}\n\nPerform exhaustive reasoning before arriving at a final recommendation.`,
        config: {
          thinkingConfig: {
            thinkingBudget: thinkingBudget
          }
        }
      });

      setResult(response.text || 'No strategic output generated.');
      setStatus('Cognitive Process Finalized.');
    } catch (err: any) {
      console.error(err);
      setStatus(`Reasoning Error: ${err.message}`);
    } finally {
      setIsThinking(false);
    }
  };

  const saveToHub = () => {
    if (result && !isSaved) {
      onProduced({
        url: 'report_icon',
        title: `Strategy: ${selectedLead?.businessName || 'Agency Mission'}`,
        type: 'report',
        content: result
      });
      setIsSaved(true);
      setStatus('Report archived to Production Studio.');
    }
  };

  const strategicPresets = [
    { label: "Red Team Competitive Analysis", prompt: "Identify the top 5 digital competitors for this niche in the region. Find their structural weaknesses and outline a 3-month strategy to capture their market share using AI efficiencies." },
    { label: "5-Year ROI Forecast", prompt: "Based on the current social gap and revenue model for this niche, project the cumulative ROI of a complete AI transformation over 60 months, accounting for labor savings and increased lead conversion." },
    { label: "Full Brand Evolution Map", prompt: "Design a complete digital re-branding architecture. Include tone of voice, visual aesthetic direction, and a content distribution hierarchy for high-net-worth international clientele." }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white leading-none uppercase tracking-tighter italic flex items-center">
            <span className="text-amber-500 mr-2">Deep</span> Reasoning Lab
            <InfoButton id="deep_reasoning" />
          </h2>
          <p className="text-slate-500 text-sm mt-2 font-medium">System 2 high-intensity cognitive processing for the most complex agency missions.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 dark:bg-amber-950 border border-amber-100 dark:border-amber-900 rounded-full text-amber-600 shadow-sm">
          <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span>
          <span className="text-[10px] font-black uppercase tracking-widest">Thinking Mode: Active ({thinkingBudget} Tokens)</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-6">
          <div className={`bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-2xl space-y-8 relative overflow-hidden`}>
             <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-3xl pointer-events-none"></div>
             
             <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 flex justify-between">
                  Thinking Intensity
                  <span className="text-amber-600 font-mono">{thinkingBudget.toLocaleString()}</span>
                </label>
                <input 
                  type="range" 
                  min="4000" 
                  max="32768" 
                  step="1000"
                  value={thinkingBudget}
                  onChange={(e) => setThinkingBudget(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
                <div className="flex justify-between text-[8px] font-black text-slate-400 uppercase tracking-widest">
                   <span>Tactical</span>
                   <span>Strategic</span>
                   <span>Exhaustive</span>
                </div>
             </div>

             <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Mission Parameters</label>
                <textarea 
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Enter a highly complex strategic query..."
                  className={`w-full h-48 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 text-sm font-medium outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all resize-none shadow-inner ${isDarkMode ? 'text-white' : 'text-slate-900'}`}
                />
             </div>

             <button 
                onClick={() => executeDeepReasoning()}
                disabled={isThinking || !prompt.trim()}
                className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-3 transition-all shadow-xl active:scale-95 ${
                  isThinking ? 'bg-slate-200 text-slate-400' : 'bg-amber-500 text-white hover:bg-amber-600 shadow-amber-500/30'
                }`}
             >
               {isThinking ? (
                 <>
                   <div className="w-5 h-5 border-3 border-slate-400 border-t-amber-600 rounded-full animate-spin"></div>
                   Processing Logic...
                 </>
               ) : (
                 <>
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                   Engage Deep Thought
                 </>
               )}
             </button>
             {status && <p className="text-[10px] font-bold text-center text-slate-400 uppercase tracking-widest animate-pulse">{status}</p>}
          </div>

          <div className="bg-slate-900 p-8 rounded-3xl text-white shadow-2xl space-y-4 border border-white/5">
            <h4 className="text-[10px] font-black text-amber-500 uppercase tracking-widest border-b border-white/5 pb-2">Reasoning Presets</h4>
            <div className="space-y-2">
              {strategicPresets.map(preset => (
                <button 
                  key={preset.label}
                  onClick={() => { setPrompt(preset.prompt); executeDeepReasoning(preset.prompt); }}
                  className="w-full text-left p-4 rounded-xl text-[10px] font-black text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/5 transition-all flex items-center justify-between group uppercase tracking-wider"
                >
                  {preset.label}
                  <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-8">
          <div className={`bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-2xl min-h-[750px] flex flex-col overflow-hidden relative p-8 md:p-12 group transition-colors duration-500`}>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-500/5 blur-[120px] pointer-events-none"></div>
            
            <div className="flex items-center justify-between mb-10 border-b border-slate-100 dark:border-slate-800 pb-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-slate-950 rounded-2xl flex items-center justify-center text-white shadow-lg border border-white/10">
                  <svg className="w-8 h-8 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-widest leading-none italic">Reasoning Output</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">High-Compute Logical Extraction</p>
                </div>
              </div>
              
              {result && (
                <div className="flex gap-3">
                   <button 
                    onClick={saveToHub}
                    disabled={isSaved}
                    className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${isSaved ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm'}`}
                  >
                    {isSaved ? 'Archived' : 'Archive Strategy'}
                  </button>
                  <button 
                    onClick={() => { navigator.clipboard.writeText(result); setStatus('Intelligence copied.'); }}
                    className="px-6 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-amber-600 transition-all flex items-center gap-2 shadow-xl shadow-slate-200"
                  >
                    Copy Strategy
                  </button>
                </div>
              )}
            </div>

            <div className="flex-1 overflow-y-auto font-medium text-slate-700 dark:text-slate-300 leading-relaxed text-sm whitespace-pre-wrap">
              {isThinking ? (
                <div className="space-y-8 flex flex-col items-center justify-center h-full">
                  <div className="relative w-32 h-32">
                    <div className="absolute inset-0 border-4 border-amber-100 dark:border-amber-900 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-transparent border-t-amber-500 rounded-full animate-spin"></div>
                    <div className="absolute inset-4 border-2 border-transparent border-b-amber-400 rounded-full animate-spin [animation-duration:3s]"></div>
                  </div>
                  <div className="text-center space-y-3">
                    <p className="text-lg font-black uppercase italic tracking-tighter text-slate-900 dark:text-white animate-pulse">Engaging System 2 Reasoning</p>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Building logical chain for {thinkingBudget.toLocaleString()} tokens...</p>
                  </div>
                  <div className="w-64 h-1 bg-slate-50 dark:bg-slate-950 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 animate-[loading_5s_ease-in-out_infinite]"></div>
                  </div>
                </div>
              ) : result ? (
                <div className="animate-in fade-in duration-700 bg-slate-50/30 dark:bg-slate-950/20 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-inner">
                  {result}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
                  <svg className="w-24 h-24 mb-6 text-slate-200 dark:text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  <p className="text-2xl font-black uppercase italic tracking-tighter text-slate-900 dark:text-white">Cognitive Hub Idle</p>
                  <p className="text-xs font-bold max-w-sm mt-2 uppercase tracking-widest">Activate the reasoning budget and provide strategic parameters to begin multi-modal logical decoding.</p>
                </div>
              )}
            </div>

            <div className="mt-10 pt-8 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[9px] font-black text-slate-400 uppercase tracking-widest">
              <div className="flex gap-4">
                <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span> Thinking Engine V3</span>
                <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span> Logical Consistency Locked</span>
              </div>
              <div>Intelligence Engine v3.0</div>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  );
};

export default DeepReasoningLab;
