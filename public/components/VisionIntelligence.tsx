
import React, { useState, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { VaultAsset } from '../types';
import InfoButton from './InfoButton';

interface VisionIntelligenceProps {
  onProduced: (asset: Omit<VaultAsset, 'id' | 'timestamp'>) => void;
  isDarkMode: boolean;
}

const VisionIntelligence: React.FC<VisionIntelligenceProps> = ({ onProduced, isDarkMode }) => {
  const [image, setImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [status, setStatus] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
        setResult('');
        setIsSaved(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const saveToHub = () => {
    if (result && !isSaved) {
      onProduced({
        url: 'vision_icon',
        title: `Vision Analysis: ${prompt.substring(0, 30) || 'Image Data'}`,
        type: 'report',
        content: result
      });
      setIsSaved(true);
      setStatus('Visual intel archived.');
    }
  };

  const analyzeImage = async () => {
    if (!image || (!prompt && !isAnalyzing)) return;

    setIsAnalyzing(true);
    setStatus('Engaging Neural Vision Nodes...');
    setIsSaved(false);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const base64Data = image.split(',')[1];
      const mimeType = image.split(';')[0].split(':')[1];

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [
          {
            parts: [
              {
                inlineData: {
                  data: base64Data,
                  mimeType: mimeType
                }
              },
              { text: prompt || "Analyze this image in detail and provide a structured summary of its content." }
            ]
          }
        ],
        config: {
          systemInstruction: "You are the Vision Intel Agent for an elite marketing agency. Your job is to extract data, translate menus/text, analyze charts, and provide strategic insights from images. Be precise, professional, and formatted for high-ticket business decision making."
        }
      });

      setResult(response.text || 'No intelligence extracted.');
      setStatus('Analysis Complete.');
    } catch (err: any) {
      console.error(err);
      setStatus(`System Error: ${err.message}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const presets = [
    { label: "Extract Table/CSV", prompt: "Extract all tabular data from this image and format it as a CSV-style list." },
    { label: "Translate Menu", prompt: "Translate this menu into English and identify the 3 highest margin/premium items for a luxury clientele." },
    { label: "Analyze Growth Chart", prompt: "Perform a technical analysis of this chart. Identify the primary growth trend and predict the next 3 months based on current trajectory." },
    { label: "OCR Intelligence", prompt: "Extract all text from this image exactly as written, preserving hierarchy and structure." }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white leading-none uppercase tracking-tighter italic flex items-center">
            <span className="text-amber-500 mr-2">Vision</span> Intel Lab
            <InfoButton id="vision_intel" />
          </h2>
          <p className="text-slate-500 text-sm mt-2 font-medium">Extract, translate, and analyze business intelligence from static visual plates.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-slate-900 rounded-full text-white">
          <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span>
          <span className="text-[10px] font-black uppercase tracking-widest">Multi-Modal Core Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Upload & Prompt Area */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-2xl space-y-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-3xl pointer-events-none"></div>
            
            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">1. Intelligence Plate (Image)</label>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`relative w-full aspect-video rounded-3xl border-2 border-dashed transition-all flex flex-col items-center justify-center cursor-pointer overflow-hidden ${
                  image ? 'border-amber-600 bg-slate-50 dark:bg-slate-950' : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-amber-400'
                }`}
              >
                {image ? (
                  <>
                    <img src={image} className="w-full h-full object-contain" alt="Preview" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-black uppercase">Replace Image</div>
                  </>
                ) : (
                  <>
                    <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl shadow-sm flex items-center justify-center mb-4 text-slate-300">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    </div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Drop receipt, menu, or chart</p>
                  </>
                )}
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">2. Mission Objective</label>
              <textarea 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="What should I extract or analyze from this image?..."
                className={`w-full h-32 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 text-sm font-medium outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all resize-none shadow-inner ${isDarkMode ? 'text-white' : 'text-slate-900'}`}
              />
              <div className="grid grid-cols-2 gap-2">
                {presets.map(p => (
                  <button 
                    key={p.label}
                    onClick={() => { setPrompt(p.prompt); analyzeImage(); }}
                    className="text-[9px] font-black text-slate-500 uppercase border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl hover:bg-amber-500 hover:text-white hover:border-amber-500 transition-all text-left"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <button 
              onClick={analyzeImage}
              disabled={isAnalyzing || !image}
              className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-3 transition-all shadow-xl active:scale-95 ${
                isAnalyzing ? 'bg-slate-200 text-slate-400' : 'bg-amber-500 text-white hover:bg-amber-600 shadow-amber-500/30'
              }`}
            >
              {isAnalyzing ? (
                <>
                  <div className="w-5 h-5 border-3 border-slate-400 border-t-amber-600 rounded-full animate-spin"></div>
                  Neural Vision active...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  Execute Vision Intel
                </>
              )}
            </button>
            {status && <p className="text-[10px] font-bold text-center text-slate-400 uppercase tracking-widest animate-pulse">{status}</p>}
          </div>
        </div>

        {/* Intelligence Output area */}
        <div className="lg:col-span-7">
          <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-2xl min-h-[700px] flex flex-col overflow-hidden relative p-8 md:p-12">
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-amber-500/5 blur-[100px] pointer-events-none"></div>
            
            <div className="flex items-center justify-between mb-10 border-b border-slate-100 dark:border-slate-800 pb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest leading-none">Intelligence Output</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Grounded Visual Reasoning</p>
                </div>
              </div>
              
              {result && (
                <div className="flex gap-2">
                   <button 
                    onClick={saveToHub}
                    disabled={isSaved}
                    className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${isSaved ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm'}`}
                  >
                    {isSaved ? 'Archived' : 'Save Intel'}
                  </button>
                  <button 
                    onClick={() => { navigator.clipboard.writeText(result); setStatus('Intelligence copied.'); }}
                    className="px-5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-[10px] font-black uppercase text-slate-600 dark:text-slate-400 hover:bg-amber-500 hover:text-white hover:border-amber-500 transition-all flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
                    Copy Data
                  </button>
                </div>
              )}
            </div>

            <div className="flex-1 overflow-y-auto font-medium text-slate-700 dark:text-slate-300 leading-relaxed text-sm whitespace-pre-wrap">
              {isAnalyzing ? (
                <div className="space-y-6">
                  <div className="h-4 bg-slate-50 dark:bg-slate-800 rounded w-3/4 animate-pulse"></div>
                  <div className="h-4 bg-slate-50 dark:bg-slate-800 rounded w-full animate-pulse"></div>
                  <div className="h-4 bg-slate-50 dark:bg-slate-800 rounded w-5/6 animate-pulse"></div>
                  <div className="h-32 bg-slate-50/50 dark:bg-slate-800/50 rounded-2xl w-full animate-pulse"></div>
                  <div className="h-4 bg-slate-50 dark:bg-slate-800 rounded w-2/3 animate-pulse"></div>
                </div>
              ) : result ? (
                <div className="animate-in fade-in duration-500">
                  {result}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
                  <svg className="w-24 h-24 mb-6 text-slate-200 dark:text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  <p className="text-2xl font-black uppercase italic tracking-tighter text-slate-900 dark:text-white">Neural Optic Feed Offline</p>
                  <p className="text-xs font-bold max-w-sm mt-2 uppercase">Upload a visual asset and provide mission parameters to begin real-time neural decoding.</p>
                </div>
              )}
            </div>

            <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[9px] font-black text-slate-400 uppercase tracking-widest">
              <div className="flex gap-4">
                <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span> OCR Level 4</span>
                <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span> Multi-Modal Sync</span>
              </div>
              <div>Intelligence Engine v3.0</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisionIntelligence;
