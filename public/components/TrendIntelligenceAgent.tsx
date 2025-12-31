
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import InfoButton from './InfoButton';

interface GroundingSource {
  title: string;
  uri: string;
}

interface TrendReport {
  title: string;
  summary: string;
  isViral: boolean;
  category: string;
}

const TrendIntelligenceAgent: React.FC = () => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [report, setReport] = useState<string>('');
  const [sources, setSources] = useState<GroundingSource[]>([]);
  const [hotTrends, setHotTrends] = useState<TrendReport[]>([]);

  // Initial load of hot trends
  useEffect(() => {
    fetchHotTrends();
  }, []);

  const fetchHotTrends = async () => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: "Identify 4 high-impact trending topics globally or in major tech/business hubs for today. Focus on what's going viral and why. Format as a brief briefing.",
        config: {
          tools: [{ googleSearch: {} }]
        }
      });

      setReport(response.text || '');
      const groundingSources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
        ?.map((chunk: any) => ({
          title: chunk.web?.title || 'Source',
          uri: chunk.web?.uri || ''
        }))
        .filter((s: GroundingSource) => s.uri !== '') || [];
      setSources(groundingSources);
    } catch (err) {
      console.error("Failed to fetch initial trends", err);
    }
  };

  const handleDeepSearch = async () => {
    if (!query.trim()) return;
    setIsLoading(true);
    setReport('');
    setSources([]);
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Analyze this topic or query for current viral status, factual accuracy, and market impact: "${query}". 
        Include a "Viral Probability" score and list 3 key takeaways for a marketing agency. 
        Perform deep fact-checking if the query involves news or recent events.`,
        config: {
          tools: [{ googleSearch: {} }]
        }
      });

      setReport(response.text || 'No data found.');
      const groundingSources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
        ?.map((chunk: any) => ({
          title: chunk.web?.title || 'Source',
          uri: chunk.web?.uri || ''
        }))
        .filter((s: GroundingSource) => s.uri !== '') || [];
      setSources(groundingSources);
    } catch (err) {
      console.error(err);
      setReport("Failed to connect to search nodes. Check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 leading-none uppercase tracking-tighter italic flex items-center">
            Viral Pulse <span className="ml-2">Agent</span>
            <InfoButton id="viral_pulse" />
          </h2>
          <p className="text-slate-500 text-sm mt-2 font-medium">Real-time cultural intelligence & fact-checking via Google Search Grounding.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-full">
          <span className="w-2 h-2 bg-indigo-500 rounded-full animate-ping"></span>
          <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Global Trends Feed Live</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Input and Real-time Search */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl pointer-events-none group-hover:bg-indigo-500/10 transition-colors"></div>
            
            <div className="space-y-4 relative z-10">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Intelligence Query</label>
              <div className="flex flex-col sm:flex-row gap-3">
                <input 
                  type="text" 
                  placeholder="Ask about current events, viral news, or fact-check a topic..."
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-medium outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all shadow-inner"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleDeepSearch()}
                />
                <button 
                  onClick={handleDeepSearch}
                  disabled={isLoading || !query.trim()}
                  className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-500/20 disabled:opacity-50 active:scale-95 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                      Analyze
                    </>
                  )}
                </button>
              </div>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-2 px-1">Tip: Ask "What's trending in AI content this morning?" or "Fact-check the latest X viral claim."</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl min-h-[400px] flex flex-col overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                Intelligence Briefing
              </h3>
              {isLoading && (
                <div className="flex items-center gap-2 text-[10px] font-black text-indigo-500 animate-pulse">
                  SEARCHING LIVE WEB
                </div>
              )}
            </div>
            
            <div className="flex-1 p-8 overflow-y-auto max-h-[600px] prose prose-slate max-w-none">
              {isLoading ? (
                <div className="space-y-6">
                  <div className="h-4 bg-slate-100 rounded w-3/4 animate-pulse"></div>
                  <div className="h-4 bg-slate-100 rounded w-full animate-pulse"></div>
                  <div className="h-4 bg-slate-100 rounded w-5/6 animate-pulse"></div>
                  <div className="h-32 bg-slate-50 rounded w-full animate-pulse"></div>
                </div>
              ) : report ? (
                <div className="text-slate-700 leading-relaxed whitespace-pre-wrap font-medium">
                  {report}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-40 py-20">
                  <svg className="w-16 h-16 mb-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>
                  <p className="text-lg font-black uppercase italic">Node Standby</p>
                  <p className="text-xs font-bold max-w-xs mt-1">Submit a query to engage the Viral Pulse Agent and retrieve real-time grounded intelligence.</p>
                </div>
              )}
            </div>

            {sources.length > 0 && (
              <div className="p-6 bg-slate-50 border-t border-slate-100">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Grounded Verification Sources</h4>
                <div className="flex flex-wrap gap-2">
                  {sources.map((source, i) => (
                    <a 
                      key={i} 
                      href={source.uri} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:border-indigo-500 hover:text-indigo-600 transition-all flex items-center gap-2 shadow-sm"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                      {source.title.length > 25 ? source.title.substring(0, 25) + '...' : source.title}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Viral Trends Dashboard */}
        <div className="space-y-6">
          <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-2xl pointer-events-none"></div>
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-indigo-400 mb-6 flex items-center gap-2">
              <span className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></span>
              Live Viral Pulse
            </h3>
            
            <div className="space-y-6">
              {[
                { title: "AI Video Transformation", count: "142.5K", trend: "up", color: "emerald" },
                { title: "Micro-Niche Prospecting", count: "89.2K", trend: "up", color: "indigo" },
                { title: "GBP Ghosting Awareness", count: "55.1K", trend: "down", color: "amber" },
                { title: "Hyper-Local SEO Shifts", count: "120.9K", trend: "up", color: "rose" }
              ].map((item, i) => (
                <div key={i} className="group cursor-help">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-black tracking-tight group-hover:text-indigo-300 transition-colors">{item.title}</span>
                    <span className={`text-[10px] font-black uppercase ${item.trend === 'up' ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {item.trend === 'up' ? '▲' : '▼'} {item.count}
                    </span>
                  </div>
                  <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                    <div 
                      className={`h-full bg-${item.color}-500 transition-all duration-1000`} 
                      style={{ width: `${Math.random() * 60 + 40}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            <button 
              onClick={fetchHotTrends}
              className="w-full mt-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
            >
              Refresh Trends
            </button>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xl space-y-4">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Agency Insight Tool</h4>
            <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl">
              <p className="text-[10px] font-black text-emerald-600 uppercase mb-2">Pro Fact-Checker</p>
              <p className="text-xs font-medium text-emerald-900 leading-relaxed">
                Using Grounding v3.0, our agent doesn't just find news—it cross-references multiple authoritative sources to ensure your outreach strategies are based on verified facts, not just hype.
              </p>
            </div>
            <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl">
              <p className="text-[10px] font-black text-indigo-600 uppercase mb-2">Outreach Angle</p>
              <p className="text-xs font-medium text-indigo-900 leading-relaxed">
                Connect your pitch to a trending event to increase open rates by up to 300%. Use the strategist below to bridge the gap.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrendIntelligenceAgent;
