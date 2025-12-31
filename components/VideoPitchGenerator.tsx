
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Lead } from '../types';
import InfoButton from './InfoButton';

interface Props { leads: Lead[]; onArchive: (a: any) => void; }

const VideoPitchGenerator: React.FC<Props> = ({ leads, onArchive }) => {
  const [selectedId, setSelectedId] = useState<number>(leads[0]?.rank);
  const [prompt, setPrompt] = useState('');
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [status, setStatus] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const generate = async () => {
    setIsGenerating(true);
    setStatus("Initializing Veo 3.1...");
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      let op = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: prompt || "Cinematic luxury villa tour, drone shot, golden hour, 4k.",
        config: { resolution: '1080p', aspectRatio: '9:16' }
      });
      
      while (!op.done) {
        setStatus("Rendering Neural Frames...");
        await new Promise(r => setTimeout(r, 5000));
        op = await ai.operations.getVideosOperation({ operation: op });
      }
      
      const uri = op.response?.generatedVideos?.[0]?.video?.uri;
      if (uri) {
        const res = await fetch(`${uri}&key=${process.env.API_KEY}`);
        setVideoUrl(URL.createObjectURL(await res.blob()));
        setStatus("Production Complete.");
      }
    } catch (e: any) { setStatus("Error: " + e.message); } 
    finally { setIsGenerating(false); }
  };

  return (
    <div className="p-8 glass-panel rounded-[2.5rem] flex flex-col md:flex-row gap-8">
      <div className="w-full md:w-1/3 space-y-6">
        <h2 className="text-2xl font-black italic uppercase text-white">Video <span className="text-indigo-500">Forge</span> <InfoButton id="video_pitch"/></h2>
        <select className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-xs font-bold text-white outline-none" onChange={e => setSelectedId(Number(e.target.value))}>
          {leads.map(l => <option key={l.rank} value={l.rank}>{l.businessName}</option>)}
        </select>
        <textarea value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="Describe the cinematic shot..." className="w-full h-32 bg-slate-900 border border-slate-700 rounded-xl p-4 text-xs text-white outline-none" />
        <button onClick={generate} disabled={isGenerating} className="w-full py-4 bg-indigo-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-500 transition-all">
          {isGenerating ? 'Rendering...' : 'Generate 9:16 Pitch'}
        </button>
        <p className="text-center text-[10px] text-indigo-400 font-mono uppercase">{status}</p>
      </div>
      <div className="flex-1 bg-black rounded-3xl flex items-center justify-center border border-white/10 overflow-hidden relative min-h-[500px]">
        {videoUrl ? <video src={videoUrl} controls autoPlay loop className="h-full w-auto max-w-full" /> : <div className="text-slate-600 font-black uppercase tracking-widest text-xs">Viewport Idle</div>}
      </div>
    </div>
  );
};
export default VideoPitchGenerator;
