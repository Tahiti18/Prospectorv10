
import React, { useState, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";

const CinemaIntelHub: React.FC = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [analysisResult, setAnalysisResult] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [status, setStatus] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 20 * 1024 * 1024) {
        alert("Please upload a video under 20MB for direct browser processing.");
        return;
      }
      setVideoFile(file);
      setVideoPreviewUrl(URL.createObjectURL(file));
      setAnalysisResult('');
      setStatus('Video plate loaded.');
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = (reader.result as string).split(',')[1];
        resolve(base64String);
      };
      reader.onerror = error => reject(error);
    });
  };

  const analyzeVideo = async (customPrompt?: string) => {
    if (!videoFile) {
      setStatus('Please upload a video first.');
      return;
    }

    const finalPrompt = customPrompt || prompt || "Analyze this video and provide a comprehensive summary of key moments, visual highlights, and strategic marketing takeaways.";
    
    setIsAnalyzing(true);
    setStatus('Decoding Cinema Data...');

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const base64Data = await fileToBase64(videoFile);
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [
          {
            parts: [
              {
                inlineData: {
                  data: base64Data,
                  mimeType: videoFile.type
                }
              },
              { text: finalPrompt }
            ]
          }
        ],
        config: {
          systemInstruction: "You are the Cinema Intel Agent for an elite marketing firm. Your job is to perform deep analysis on video files. Extract timestamps for viral moments, create marketing summaries, identify visual quality, and generate educational flashcards or highlights based on the footage. Be analytical, professional, and insight-driven."
        }
      });

      setAnalysisResult(response.text || 'No intelligence extracted from cinema plate.');
      setStatus('Analysis Finalized.');
    } catch (err: any) {
      console.error(err);
      setStatus(`System Error: ${err.message}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const intelPresets = [
    { label: "Marketing Highlights", prompt: "Identify the 5 most visually engaging moments in this video. Provide timestamps and explain why they would make great social media hooks." },
    { label: "Executive Summary", prompt: "Create a 3-paragraph executive summary of this video. Focus on the core message, production value, and target audience fit." },
    { label: "Educational Flashcards", prompt: "Extract the key educational points from this video and format them as 5 Q&A flashcards for a study guide." },
    { label: "Direct Hook Script", prompt: "Based on the content of this video, write a 15-second high-energy voiceover script for an Instagram Ad." }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 leading-none uppercase tracking-tighter italic flex items-center gap-3">
            <span className="text-rose-600">Cinema</span> Intel Hub
          </h2>
          <p className="text-slate-500 text-sm mt-2 font-medium">Deep-layer video understanding. Extract summaries, hooks, and timestamps instantly.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-rose-50 border border-rose-100 rounded-full text-rose-600 shadow-sm">
          <span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></span>
          <span className="text-[10px] font-black uppercase tracking-widest">Temporal Analysis Node</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Workspace Controls */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-2xl space-y-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 blur-3xl pointer-events-none"></div>
            
            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">1. Video Source Plate</label>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`relative w-full aspect-video rounded-3xl border-2 border-dashed transition-all flex flex-col items-center justify-center cursor-pointer overflow-hidden ${
                  videoPreviewUrl ? 'border-rose-600 bg-black' : 'border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-rose-400'
                }`}
              >
                {videoPreviewUrl ? (
                  <>
                    <video src={videoPreviewUrl} className="w-full h-full object-contain opacity-80" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-black uppercase">Replace Video</div>
                  </>
                ) : (
                  <>
                    <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4 text-slate-300">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                    </div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Drop MP4/WebM Source</p>
                    <p className="text-[8px] text-slate-400 mt-1">MAX 20MB FOR QUICK ANALYSIS</p>
                  </>
                )}
                <input ref={fileInputRef} type="file" accept="video/*" onChange={handleVideoUpload} className="hidden" />
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">2. Intelligence Mission</label>
              <textarea 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="What deep insights should I extract from this cinema plate?"
                className="w-full h-32 bg-slate-50 border border-slate-200 rounded-2xl p-5 text-sm font-medium outline-none focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 transition-all resize-none shadow-inner"
              />
              <div className="grid grid-cols-2 gap-2">
                {intelPresets.map(p => (
                  <button 
                    key={p.label}
                    onClick={() => { setPrompt(p.prompt); analyzeVideo(p.prompt); }}
                    className="text-[9px] font-black text-slate-500 uppercase border border-slate-200 p-2.5 rounded-xl hover:bg-rose-600 hover:text-white hover:border-rose-600 transition-all text-left"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <button 
              onClick={() => analyzeVideo()}
              disabled={isAnalyzing || !videoFile}
              className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-3 transition-all shadow-xl active:scale-95 ${
                isAnalyzing ? 'bg-slate-200 text-slate-400' : 'bg-rose-600 text-white hover:bg-rose-500 shadow-rose-500/30'
              }`}
            >
              {isAnalyzing ? (
                <>
                  <div className="w-5 h-5 border-3 border-slate-400 border-t-rose-600 rounded-full animate-spin"></div>
                  Extracting Intel...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  Analyze Video Plate
                </>
              )}
            </button>
            {status && <p className="text-[10px] font-bold text-center text-slate-400 uppercase tracking-widest animate-pulse">{status}</p>}
          </div>
        </div>

        {/* Intelligence Hub Area */}
        <div className="lg:col-span-7">
          <div className="bg-slate-900 rounded-[3rem] border border-white/5 shadow-2xl min-h-[700px] flex flex-col overflow-hidden relative p-8 md:p-12">
            <div className="absolute top-0 left-0 w-64 h-64 bg-rose-500/5 blur-[120px] pointer-events-none"></div>
            
            <div className="flex items-center justify-between mb-10 border-b border-white/5 pb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-rose-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-widest leading-none">Intelligence Output</h3>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Multi-Modal Temporal Decoding</p>
                </div>
              </div>
              
              {analysisResult && (
                <button 
                  onClick={() => { navigator.clipboard.writeText(analysisResult); setStatus('Data copied.'); }}
                  className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase text-white hover:bg-rose-600 transition-all flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
                  Copy Briefing
                </button>
              )}
            </div>

            <div className="flex-1 overflow-y-auto font-medium text-slate-300 leading-relaxed text-sm whitespace-pre-wrap font-mono">
              {isAnalyzing ? (
                <div className="space-y-6">
                  <div className="h-4 bg-white/5 rounded w-3/4 animate-pulse"></div>
                  <div className="h-4 bg-white/5 rounded w-full animate-pulse"></div>
                  <div className="h-4 bg-white/5 rounded w-5/6 animate-pulse"></div>
                  <div className="h-48 bg-white/5 rounded-3xl w-full animate-pulse"></div>
                  <div className="h-4 bg-white/5 rounded w-2/3 animate-pulse"></div>
                </div>
              ) : analysisResult ? (
                <div className="animate-in fade-in duration-500 bg-black/30 p-8 rounded-3xl border border-white/5 shadow-inner">
                  {analysisResult}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-20">
                  <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6">
                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                  </div>
                  <p className="text-2xl font-black uppercase italic tracking-tighter text-white">Cinema Stream Idle</p>
                  <p className="text-xs font-bold max-w-sm mt-2">Upload a video and choose a mission preset to engage the deep-layer temporal analyst.</p>
                </div>
              )}
            </div>

            <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-between text-[9px] font-black text-slate-500 uppercase tracking-widest">
              <div className="flex gap-4">
                <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-rose-500 rounded-full"></span> V-DECODE V3</span>
                <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-rose-500 rounded-full"></span> TEMPORAL SYNC</span>
              </div>
              <div>Intelligence Core v3.0</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CinemaIntelHub;
