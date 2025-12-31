
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import TTSAssistant from './TTSAssistant';
import InfoButton from './InfoButton';

interface ArticleSummarizerProps {
  isDarkMode: boolean;
}

const ArticleSummarizer: React.FC<ArticleSummarizerProps> = ({ isDarkMode }) => {
  const [content, setContent] = useState('');
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [status, setStatus] = useState('');
  const [summaryMode, setSummaryMode] = useState<'brief' | 'viral' | 'strategy'>('strategy');

  const executeSummarization = async () => {
    if (!content.trim()) return;
    setIsSummarizing(true);
    setStatus('Ingesting raw intelligence...');
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const instructions = {
        brief: "Provide a concise, executive 3-bullet summary focusing on raw facts and data.",
        viral: "Extract the 5 most 'viral' or controversial hooks from this content. Turn them into social media headlines.",
        strategy: "Provide a deep SWOT analysis based on this content. Identify marketing opportunities and technical vulnerabilities."
      };

      const isUrl = content.trim().startsWith('http');
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: isUrl 
          ? `Summarize the key contents of this URL: ${content.trim()}`
          : `Summarize this text: \n\n${content.trim()}`,
        config: {
          systemInstruction: `You are the Lead Intel Summarizer. ${instructions[summaryMode]} Format your response with clear headers and bold key terms. Be ROI-focused and professional.`,
          tools: isUrl ? [{ googleSearch: {} }] : undefined
        }
      });

      setSummary(response.text || 'No summary generated.');
      setStatus('Synthesis complete.');
    } catch (err: any) {
      console.error(err);
      setStatus(`Node Error: ${err.message}`);
    } finally {
      setIsSummarizing(false);
    }
  };

  const presets = [
    { label: "Executive Brief", mode: 'brief' as const },
    { label: "Viral Hook Pack", mode: 'viral' as const },
    { label: "Strategy Audit", mode: 'strategy' as const }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white leading-none uppercase tracking-tighter italic flex items-center">
            <span className="text-amber-500 mr-2">Article</span> Intel Hub
            <InfoButton id="article_intel" />
          </h2>
          <p className="text-slate-500 text-sm mt-2 font-medium">Hyper-speed content synthesis for competitive research and viral repurposing.</p>
        </div>
        <div className="flex bg-white dark:bg-slate-900 p-1 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          {presets.map(p => (
            <button
              key={p.mode}
              onClick={() => setSummaryMode(p.mode)}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                summaryMode === p.mode ? 'bg-amber-500 text-slate-950 shadow-lg' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input Terminal */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-3xl pointer-events-none"></div>
             
             <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Input Source (URL or Text)</label>
                <textarea 
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Paste article URL or raw text here..."
                  className={`w-full h-80 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 text-sm font-medium outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all resize-none shadow-inner ${isDarkMode ? 'text-white' : 'text-slate-900'}`}
                />
             </div>

             <button 
                onClick={executeSummarization}
                disabled={isSummarizing || !content.trim()}
                className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-3 transition-all shadow-xl active:scale-95 ${
                  isSummarizing ? 'bg-slate-200 text-slate-400' : 'bg-amber-500 text-white hover:bg-amber-600 shadow-amber-500/30'
                }`}
             >
               {isSummarizing ? (
                 <>
                   <div className="w-5 h-5 border-3 border-slate-400 border-t-amber-600 rounded-full animate-spin"></div>
                   Synthesizing...
                 </>
               ) : (
                 <>
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                   Extract Intelligence
                 </>
               )}
             </button>
             {status && <p className="text-[10px] font-bold text-center text-slate-400 uppercase tracking-widest animate-pulse">{status}</p>}
          </div>

          <div className="bg-slate-900 p-8 rounded-3xl text-white shadow-2xl space-y-4 border border-white/5">
             <h4 className="text-[10px] font-black text-amber-500 uppercase tracking-widest border-b border-white/5 pb-2">Summarization Intel</h4>
             <div className="space-y-4 text-xs font-medium text-slate-400 leading-relaxed uppercase">
                <p>Use the <strong className="text-amber-500 italic">Viral Hook Pack</strong> to generate LinkedIn/Twitter content from long articles instantly.</p>
                <p>The <strong className="text-amber-500 italic">Strategy Audit</strong> is best for vetting competitor whitepapers or local news.</p>
             </div>
          </div>
        </div>

        {/* Output Hub */}
        <div className="lg:col-span-8">
          <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-2xl min-h-[750px] flex flex-col overflow-hidden relative p-8 md:p-12 group transition-colors duration-500">
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-500/5 blur-[120px] pointer-events-none"></div>
            
            <div className="flex items-center justify-between mb-10 border-b border-slate-100 dark:border-slate-800 pb-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-amber-500 rounded-2xl flex items-center justify-center text-slate-950 shadow-lg border border-white/10">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-widest leading-none italic">Synthesis Output</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Mode: {summaryMode.toUpperCase()}</p>
                </div>
              </div>
              
              {summary && (
                <div className="flex items-center gap-4">
                  <TTSAssistant 
                    text={summary} 
                    label="Read Summary Aloud"
                  />
                  <button 
                    onClick={() => { navigator.clipboard.writeText(summary); setStatus('Data copied.'); }}
                    className="px-6 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-amber-500 transition-all flex items-center gap-2 shadow-xl shadow-slate-200"
                  >
                    Copy Intel
                  </button>
                </div>
              )}
            </div>

            <div className="flex-1 overflow-y-auto font-medium text-slate-700 dark:text-slate-300 leading-relaxed text-sm whitespace-pre-wrap">
              {isSummarizing ? (
                <div className="space-y-8 flex flex-col items-center justify-center h-full">
                  <div className="relative w-32 h-32">
                    <div className="absolute inset-0 border-4 border-amber-100 dark:border-amber-900 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-transparent border-t-amber-500 rounded-full animate-spin"></div>
                  </div>
                  <div className="text-center space-y-3">
                    <p className="text-lg font-black uppercase italic tracking-tighter text-slate-900 dark:text-white animate-pulse">Neural Text Processing</p>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Decoding source syntax for strategic extraction...</p>
                  </div>
                </div>
              ) : summary ? (
                <div className="animate-in fade-in duration-700 bg-amber-50/20 dark:bg-amber-950/10 p-8 rounded-3xl border border-amber-100/30 dark:border-amber-800/30 shadow-inner">
                  {summary}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
                  <svg className="w-24 h-24 mb-6 text-slate-200 dark:text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                  <p className="text-2xl font-black uppercase italic tracking-tighter text-slate-900 dark:text-white">Intel Hub Idle</p>
                  <p className="text-xs font-bold max-w-sm mt-2 uppercase tracking-widest">Input an article URL or text to trigger high-speed strategic summarization.</p>
                </div>
              )}
            </div>

            <div className="mt-10 pt-8 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[9px] font-black text-slate-400 uppercase tracking-widest">
               <div className="flex gap-4">
                 <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span> Gemini 3 Flash Core</span>
                 <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span> Semantic Compression Active</span>
               </div>
               <div>Intel Hub v3.0</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleSummarizer;
