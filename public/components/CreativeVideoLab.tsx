
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { VaultAsset } from '../types';
import InfoButton from './InfoButton';

interface VideoState {
  isGenerating: boolean;
  statusMessage: string;
  videoUrl: string | null;
  error: string | null;
}

interface CreativeVideoLabProps {
  onArchive: (asset: Omit<VaultAsset, 'id' | 'timestamp'>) => void;
}

const CreativeVideoLab: React.FC<CreativeVideoLabProps> = ({ onArchive }) => {
  const [prompt, setPrompt] = useState('');
  const [videoState, setVideoState] = useState<VideoState>({
    isGenerating: false,
    statusMessage: '',
    videoUrl: null,
    error: null
  });
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [resolution, setResolution] = useState<'720p' | '1080p'>('720p');
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  const [hasApiKey, setHasApiKey] = useState<boolean>(false);
  const [isArchived, setIsArchived] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    checkKeyStatus();
  }, []);

  const checkKeyStatus = async () => {
    // @ts-ignore
    if (window.aistudio && typeof window.aistudio.hasSelectedApiKey === 'function') {
      // @ts-ignore
      const hasKey = await window.aistudio.hasSelectedApiKey();
      setHasApiKey(hasKey);
    }
  };

  const handleOpenKeyDialog = async () => {
    // @ts-ignore
    if (window.aistudio && typeof window.aistudio.openSelectKey === 'function') {
      // @ts-ignore
      await window.aistudio.openSelectKey();
      setHasApiKey(true);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setReferenceImage(event.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleArchive = () => {
    if (videoState.videoUrl && !isArchived) {
      onArchive({
        url: videoState.videoUrl,
        title: `Lab: ${prompt.substring(0, 30)}...`,
        type: 'lab'
      });
      setIsArchived(true);
    }
  };

  const generateVideo = async () => {
    if (!prompt.trim() && !referenceImage) return;
    if (!hasApiKey) {
      handleOpenKeyDialog();
      return;
    }

    setVideoState({
      isGenerating: true,
      statusMessage: 'Connecting to Veo Temporal Node...',
      videoUrl: null,
      error: null
    });
    setIsArchived(false);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const payload: any = {
        model: 'veo-3.1-fast-generate-preview',
        prompt: prompt,
        config: {
          numberOfVideos: 1,
          resolution: resolution,
          aspectRatio: aspectRatio
        }
      };

      if (referenceImage) {
        payload.image = {
          imageBytes: referenceImage.split(',')[1],
          mimeType: referenceImage.split(';')[0].split(':')[1]
        };
      }

      let operation = await ai.models.generateVideos(payload);

      const logs = [
        "Analyzing script architecture...",
        "Simulating cinematic environments...",
        "Rendering high-fidelity frames...",
        "Applying AI lighting and textures...",
        "Finalizing video encoding...",
        "Syncing production metadata..."
      ];

      let logIdx = 0;
      while (!operation.done) {
        setVideoState(prev => ({ ...prev, statusMessage: logs[logIdx % logs.length] }));
        logIdx++;
        await new Promise(resolve => setTimeout(resolve, 10000));
        operation = await ai.operations.getVideosOperation({ operation: operation });
      }

      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      if (downloadLink) {
        const videoResponse = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
        const blob = await videoResponse.blob();
        const url = URL.createObjectURL(blob);
        setVideoState({ isGenerating: false, statusMessage: 'Production Complete!', videoUrl: url, error: null });
      }
    } catch (err: any) {
      console.error(err);
      setVideoState({ isGenerating: false, statusMessage: '', videoUrl: null, error: err.message });
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 leading-none uppercase tracking-tighter italic flex items-center">
            <span className="text-indigo-600 mr-2">Creative</span> Motion Lab
            <InfoButton id="video_lab" />
          </h2>
          <p className="text-slate-500 text-sm mt-2 font-medium">Image-to-Video & Scripted Cinematic Production with Veo 3.1.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xl space-y-6">
            
            <div className="space-y-4">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Optional Reference Frame (I2V)</label>
               <div 
                 onClick={() => fileInputRef.current?.click()}
                 className={`w-full h-32 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden ${referenceImage ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 bg-slate-50 hover:bg-slate-100'}`}
               >
                  {referenceImage ? (
                    <img src={referenceImage} className="w-full h-full object-cover" alt="Reference" />
                  ) : (
                    <>
                      <svg className="w-6 h-6 text-slate-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      <p className="text-[9px] font-black text-slate-400 uppercase">Upload Source Plate</p>
                    </>
                  )}
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
               </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Motion Script</label>
              <textarea 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="E.g. A slow cinematic tracking shot of this product on a table with morning light..."
                className="w-full h-32 bg-slate-50 border border-slate-200 rounded-2xl p-5 text-sm font-medium outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all resize-none shadow-inner"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                  <p className="text-[8px] font-black text-slate-400 uppercase ml-1">Ratio</p>
                  <select value={aspectRatio} onChange={e => setAspectRatio(e.target.value as any)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-[10px] font-black uppercase">
                     <option value="16:9">16:9 Landscape</option>
                     <option value="9:16">9:16 Portrait</option>
                  </select>
               </div>
               <div className="space-y-2">
                  <p className="text-[8px] font-black text-slate-400 uppercase ml-1">Resolution</p>
                  <select value={resolution} onChange={e => setResolution(e.target.value as any)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-[10px] font-black uppercase">
                     <option value="720p">720p Standard</option>
                     <option value="1080p">1080p Ultra</option>
                  </select>
               </div>
            </div>

            <button 
              onClick={generateVideo}
              disabled={videoState.isGenerating || (!prompt && !referenceImage)}
              className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-3 transition-all shadow-xl active:scale-95 ${
                videoState.isGenerating ? 'bg-slate-200 text-slate-400' : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-indigo-500/30'
              }`}
            >
              {videoState.isGenerating ? 'Producing...' : 'Generate Motion'}
            </button>
          </div>
        </div>

        <div className="lg:col-span-8">
          <div className="bg-slate-900 rounded-[3rem] p-8 md:p-12 shadow-2xl min-h-[600px] flex flex-col items-center justify-center relative overflow-hidden border border-white/5 group">
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 blur-[150px] pointer-events-none"></div>
            {videoState.videoUrl ? (
              <div className="w-full max-w-4xl space-y-6">
                <div className={`mx-auto bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/10 ${aspectRatio === '9:16' ? 'max-w-[300px]' : 'w-full'}`}>
                  <video src={videoState.videoUrl} className="w-full h-auto" controls autoPlay loop />
                </div>
                <div className="flex justify-center gap-4">
                   <button onClick={handleArchive} disabled={isArchived} className={`px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest ${isArchived ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-indigo-600 text-white hover:bg-indigo-500'}`}>
                      {isArchived ? 'Secured in Vault' : 'Archive to Vault'}
                   </button>
                   <a href={videoState.videoUrl} download={`Motion_Lab_${Date.now()}.mp4`} className="bg-white text-slate-900 px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-indigo-500 hover:text-white transition-all shadow-xl">Download MP4</a>
                </div>
              </div>
            ) : (
              <div className="text-center p-8 space-y-6">
                {videoState.isGenerating ? (
                  <div className="space-y-6 animate-in zoom-in duration-300">
                    <div className="w-20 h-20 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="text-indigo-400 text-[10px] font-black uppercase tracking-widest animate-pulse">{videoState.statusMessage}</p>
                  </div>
                ) : (
                  <div className="opacity-20 space-y-6">
                    <svg className="w-24 h-24 text-white mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    <p className="text-white text-2xl font-black uppercase italic tracking-tighter">Motion Standby</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreativeVideoLab;
