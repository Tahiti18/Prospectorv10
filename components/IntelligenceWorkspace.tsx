
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Lead, RegionConfig } from '../types';
import InfoButton from './InfoButton';

interface IntelligenceWorkspaceProps {
  leads: Lead[];
}

const IntelligenceWorkspace: React.FC<IntelligenceWorkspaceProps> = ({ leads }) => {
  const [prompt, setPrompt] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string>('');
  const [selectedContextId, setSelectedContextId] = useState<number | 'all' | 'none'>('none');
  const [status, setStatus] = useState('');
  const [region, setRegion] = useState<RegionConfig | null>(null);

  useEffect(() => {
    const regionStr = localStorage.getItem('pomelli_active_region');
    if (regionStr) setRegion(JSON.parse(regionStr));
  }, []);
  
  const handleTaskExecute = async (customPrompt?: string) => {
    const finalPrompt = customPrompt || prompt;
    if (!finalPrompt.trim()) return;

    setIsAnalyzing(true);
    setStatus('Engaging Gemini 3 Pro reasoning engine...');
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      let contextData = '';
      if (selectedContextId === 'all') {
        contextData = `Context: Analyzing all current leads data: ${JSON.stringify(leads.map(l => ({ name: l.businessName, niche: l.niche, score: l.leadScore, gap: l.socialGap })))}`;
      } else if (typeof selectedContextId === 'number') {
        const lead = leads.find(l => l.rank === selectedContextId);
        if (lead) contextData = `Context: Deep analysis for lead ${lead.businessName} (Niche: ${lead.niche}). Data: ${JSON.stringify(lead)}`;
      }

      const culturalContext = region 
        ? `Location: ${region.country} ${region.subRegion ? `(${region.subRegion})` : ''}. Market Etiquette: ${region.tone}. Currency: ${region.currency}.`
        : "";

      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `${culturalContext}\n${contextData}\n\nTask: ${finalPrompt}\n\nProvide an expert-level, actionable response. Calibrate your strategy for the local business culture.`,
        config: {
          thinkingConfig: { thinkingBudget: 4000 }
        }
      });

      setAnalysisResult(response.text || 'No response generated.');
      setStatus('Intelligence task complete.');
    } catch (err: any) {
      console.error(err);
      setStatus(`System Error: ${err.message}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const presetTasks = [
    { 
      label: "Market Dominance Report", 
      prompt: "Based on the provided leads, identify the single most underserved niche in this location and outline a 4-week roadmap for total agency dominance in that sub-market." 
    },
    { 
      label: "Revenue Leakage Audit", 
      prompt: "Perform a deep-dive revenue leakage audit for this business. Estimate lost annual revenue based on their social gap and manual booking process. Create a table showing 'Current State' vs 'AI-Optimized State'." 
    },
    { 
      label: "Brand Voice Extraction", 
      prompt: "Analyze the current 'Visual Proof' and business positioning. Extract a sophisticated brand voice and generate a 500-word mission statement and a series of 10 high-conversion headlines." 
    },
    { 
      label: "Competitor Intel", 
      prompt: "Hypothesize the top 3 digital competitors for this business in their local area. Outline a 'Surpass & Outmaneuver' strategy focusing on AI efficiencies they can't match." 
    }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 leading-none uppercase tracking-tighter italic flex items-center">
            <span className="text-indigo-600 mr-2">Gemini 3 Pro</span> Intelligence Workspace
            <InfoButton id="intel_workspace" />
          </h2>
          <p className="text-slate-500 text-sm mt-2 font-medium">Execute complex reasoning and market analysis calibrated for {region?.country || 'Global'} theaters.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-full">
          <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
          <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Reasoning Node: {region?.country || 'Universal'}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xl space-y-6">
            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Context Targeting</label>
              <select 
                value={selectedContextId}
                onChange={(e) => {
                  const val = e.target.value;
                  setSelectedContextId(val === 'all' ? 'all' : val === 'none' ? 'none' : parseInt(val));
                }}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
              >
                <option value="none">No Specific Lead (General Task)</option>
                <option value="all">Analyze All Discovered Leads</option>
                <optgroup label="Target Specific Lead">
                  {leads.map(l => (
                    <option key={l.rank} value={l.rank}>{l.rank}. {l.businessName}</option>
                  ))}
                </optgroup>
              </select>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Advanced Reasoning Task</label>
              <textarea 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="What complex task should Gemini perform?..."
                className="w-full h-40 bg-slate-50 border border-slate-200 rounded-2xl p-5 text-sm font-medium outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all resize-none shadow-inner"
              />
            </div>

            <button 
              onClick={() => handleTaskExecute()}
              disabled={isAnalyzing || !prompt.trim()}
              className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-3 transition-all shadow-xl active:scale-95 ${
                isAnalyzing ? 'bg-slate-200 text-slate-400' : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-indigo-500/30'
              }`}
            >
              {isAnalyzing ? (
                <>
                  <div className="w-5 h-5 border-3 border-slate-400 border-t-indigo-600 rounded-full animate-spin"></div>
                  Neural Reasoning...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  Execute Intelligence Task
                </>
              )}
            </button>
            {status && <p className="text-[10px] font-bold text-center text-slate-400 uppercase tracking-widest animate-pulse">{status}</p>}
          </div>

          <div className="bg-slate-900 p-6 rounded-3xl border border-white/5 shadow-2xl space-y-4">
            <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest border-b border-white/5 pb-2">Intelligence Presets</h4>
            <div className="space-y-2">
              {presetTasks.map(task => (
                <button 
                  key={task.label}
                  onClick={() => {
                    setPrompt(task.prompt);
                    if (selectedContextId === 'none') setSelectedContextId('all');
                  }}
                  className="w-full text-left p-4 rounded-xl text-[11px] font-black text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/5 transition-all flex items-center justify-between group"
                >
                  <span className="uppercase tracking-wider">{task.label}</span>
                  <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-2xl min-h-[750px] flex flex-col overflow-hidden border border-slate-200 relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[100px] pointer-events-none"></div>
            
            <div className="flex items-center justify-between mb-8 border-b border-slate-100 pb-6">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Intelligence Report</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Theater: {region?.country || 'Universal'}</p>
                </div>
              </div>
              
              {analysisResult && (
                <button 
                  onClick={() => { navigator.clipboard.writeText(analysisResult); }}
                  className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-black uppercase text-slate-600 hover:bg-indigo-600 hover:text-white transition-all shadow-sm flex items-center gap-2"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
                  Copy Report
                </button>
              )}
            </div>

            <div className="flex-1 overflow-y-auto prose prose-slate prose-sm max-w-none text-slate-700 leading-relaxed font-medium">
              {isAnalyzing ? (
                <div className="space-y-6">
                  <div className="h-6 bg-slate-50 rounded w-3/4 animate-pulse"></div>
                  <div className="h-4 bg-slate-50 rounded w-full animate-pulse"></div>
                  <div className="h-32 bg-slate-50/50 rounded w-full animate-pulse"></div>
                </div>
              ) : analysisResult ? (
                <div className="whitespace-pre-wrap animate-in fade-in duration-500">
                  {analysisResult}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-30 py-20">
                  <svg className="w-20 h-20 mb-6 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                  <p className="text-2xl font-black uppercase italic tracking-tighter">Standby for Intelligence</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntelligenceWorkspace;
