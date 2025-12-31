
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { VaultAsset } from '../types';
import InfoButton from './InfoButton';

interface AIImageStudioProps {
  onProduced: (asset: Omit<VaultAsset, 'id' | 'timestamp'>) => void;
}

const AIImageStudio: React.FC<AIImageStudioProps> = ({ onProduced }) => {
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [status, setStatus] = useState('');
  const [aspectRatio, setAspectRatio] = useState<'1:1' | '3:4' | '4:3' | '9:16' | '16:9'>('1:1');
  const [imageSize, setImageSize] = useState<'1K' | '2K' | '4K'>('1K');
  const [mode, setMode] = useState<'flash' | 'pro'>('flash');
  const [useSearch, setUseSearch] = useState(false);
  const [hasApiKey, setHasApiKey] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState(false);
  
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
      reader.onload = (event) => {
        setSourceImage(event.target?.result as string);
        setResultImage(null);
        setIsSaved(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const saveToHub = () => {
    if (resultImage && !isSaved) {
      onProduced({
        url: resultImage,
        title: `Visual: ${prompt.substring(0, 30)}...`,
        type: 'image'
      });
      setIsSaved(true);
      setStatus('Saved to Production Hub.');
    }
  };

  const processImage = async () => {
    if (!prompt.trim()) {
      setStatus('Please enter a prompt first.');
      return;
    }

    if (mode === 'pro' && !hasApiKey) {
      handleOpenKeyDialog();
      return;
    }
    
    setIsProcessing(true);
    setStatus(mode === 'pro' ? 'Initializing Pro High-Fidelity Engine...' : 'Initializing Flash Neural Engine...');
    setIsSaved(false);
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const modelName = mode === 'pro' ? 'gemini-3-pro-image-preview' : 'gemini-2.5-flash-image';
      
      const contents: any[] = [{ text: prompt }];
      
      if (sourceImage && mode === 'flash') {
        setStatus('Uploading source visual context...');
        const base64Data = sourceImage.split(',')[1];
        const mimeType = sourceImage.split(';')[0].split(':')[1];
        contents.unshift({
          inlineData: {
            data: base64Data,
            mimeType: mimeType
          }
        });
      }

      setStatus(mode === 'pro' ? `Generating ${imageSize} Asset...` : 'Processing Visual...');

      const config: any = {
        imageConfig: {
          aspectRatio: aspectRatio,
        }
      };

      if (mode === 'pro') {
        config.imageConfig.imageSize = imageSize;
        if (useSearch) {
          config.tools = [{ googleSearch: {} }];
          setStatus('Grounding prompt in real-time trends...');
        }
      }

      const response = await ai.models.generateContent({
        model: modelName,
        contents: { parts: contents },
        config: config
      });

      setStatus('Finalizing export...');
      
      let foundImage = false;
      const candidate = response.candidates?.[0];
      if (candidate) {
        for (const part of candidate.content.parts) {
          if (part.inlineData) {
            const imageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
            setResultImage(imageUrl);
            foundImage = true;
            break;
          }
        }
      }

      if (!foundImage) {
        setStatus('No image returned. Try a more descriptive prompt.');
      } else {
        setStatus('Production Complete.');
      }
    } catch (err: any) {
      console.error(err);
      if (err.message?.includes("Requested entity was not found")) {
        setHasApiKey(false);
        setStatus('API Key not found or invalid. Please re-select.');
      } else {
        setStatus(`Error: ${err.message || 'Processing failed'}`);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const framePresets = [
    { label: "Smartphone Wallpaper", ratio: '9:16', icon: "M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" },
    { label: "Web Banner", ratio: '16:9', icon: "M4 5h16a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V6a1 1 0 011-1z" },
    { label: "Standard UI", ratio: '4:3', icon: "M3 7a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" },
    { label: "Portrait Ad", ratio: '3:4', icon: "M4 3h16a2 2 0 012 2v14a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2z" },
    { label: "Social Post", ratio: '1:1', icon: "M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z" }
  ];

  const flashPresets = [
    { label: "Remove BG", prompt: "Remove the background and replace with luxury marble." },
    { label: "Golden Hour", prompt: "Change lighting to cinematic golden hour." },
    { label: "Cyberpunk", prompt: "Apply a futuristic cyberpunk neon style." }
  ];

  const proPresets = [
    { label: "Blog Hero", prompt: "A hyper-realistic 4K wide-angle hero image for a luxury lifestyle blog, minimalist aesthetic, copy space on left." },
    { label: "Concept Art", prompt: "Atmospheric concept art of a sustainable Mediterranean smart-city in 2050, high detail, architectural masterpiece." },
    { label: "Brand Mockup", prompt: "A premium 3D product render of high-end skincare on a basalt stone in a serene spa setting, soft lighting." }
  ];

  const getAspectBoxClass = (ratio: string) => {
    switch(ratio) {
      case '1:1': return 'aspect-square w-16';
      case '9:16': return 'aspect-[9/16] w-10';
      case '16:9': return 'aspect-[16/9] w-20';
      case '4:3': return 'aspect-[4/3] w-18';
      case '3:4': return 'aspect-[3/4] w-12';
      default: return 'aspect-square w-16';
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 leading-none uppercase tracking-tighter italic flex items-center">
            <span className={mode === 'pro' ? "text-indigo-600" : "text-yellow-500"}>
              {mode === 'pro' ? 'Banana Pro' : 'Nano Banana'}
            </span> Visual Studio
            <InfoButton id="visual_studio" />
          </h2>
          <p className="text-slate-500 text-sm mt-2 font-medium">
            {mode === 'pro' 
              ? 'High-fidelity asset generation for blogs, hero sections, and professional concept art.' 
              : 'Rapid image editing, background removal, and instant style transfers.'}
          </p>
        </div>
        
        <div className="flex items-center gap-3 bg-white p-1 rounded-2xl border border-slate-200 shadow-sm">
          <button 
            onClick={() => setMode('flash')}
            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'flash' ? 'bg-yellow-500 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Flash Edit
          </button>
          <button 
            onClick={() => setMode('pro')}
            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'pro' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Pro Generate
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Workspace Controls */}
        <div className="lg:col-span-4 space-y-6">
          <div className={`bg-white p-6 rounded-3xl border ${mode === 'pro' ? 'border-indigo-100 shadow-indigo-100/50' : 'border-slate-200'} shadow-xl space-y-6`}>
            
            {/* Frame Architect Module */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4 shadow-inner">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 flex justify-between items-center">
                Frame Architect
                <span className="text-indigo-600 mono">{aspectRatio}</span>
              </label>
              
              <div className="flex items-center justify-center h-24 bg-white/50 rounded-xl border border-slate-100 overflow-hidden relative">
                 <div className={`${getAspectBoxClass(aspectRatio)} bg-indigo-600/10 border-2 border-indigo-600 rounded-lg flex items-center justify-center transition-all duration-300 shadow-lg shadow-indigo-500/10`}>
                    <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-pulse"></div>
                 </div>
                 <div className="absolute bottom-2 right-2 text-[8px] font-bold text-slate-300 uppercase tracking-widest">Crop Projection</div>
              </div>

              <div className="grid grid-cols-5 gap-2">
                {framePresets.map(preset => (
                  <button 
                    key={preset.label}
                    onClick={() => setAspectRatio(preset.ratio as any)}
                    title={preset.label}
                    className={`aspect-square rounded-xl flex items-center justify-center transition-all ${aspectRatio === preset.ratio ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-slate-400 border border-slate-100 hover:bg-slate-100'}`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={preset.icon} />
                    </svg>
                  </button>
                ))}
              </div>
              <p className="text-[9px] font-bold text-slate-400 text-center uppercase tracking-widest">Select Fit-for-Purpose Frame</p>
            </div>

            {mode === 'flash' && (
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">1. Source Plate</label>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-32 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100 transition-colors group overflow-hidden relative"
                >
                  {sourceImage ? (
                    <img 
                      src={sourceImage} 
                      className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" 
                      alt="Source" 
                      onClick={(e) => { e.stopPropagation(); console.log(sourceImage); }}
                    />
                  ) : (
                    <>
                      <svg className="w-8 h-8 text-slate-300 group-hover:text-indigo-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-widest">Select Image</p>
                    </>
                  )}
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </div>
              </div>
            )}

            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
                {mode === 'pro' ? '1. Concept Prompt' : '2. Transformation Script'}
              </label>
              <textarea 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={mode === 'pro' ? "Describe the high-quality asset to generate..." : "What should the AI do to the source image?"}
                className="w-full h-32 bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-medium outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all resize-none shadow-inner"
              />
              <div className="grid grid-cols-2 gap-2">
                {(mode === 'pro' ? proPresets : flashPresets).map(preset => (
                  <button 
                    key={preset.label} 
                    onClick={() => setPrompt(preset.prompt)}
                    className="text-[9px] font-black text-slate-500 uppercase border border-slate-200 p-2 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-all"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Config & Formatting</label>
              
              <div className="flex flex-col gap-4">
                {mode === 'pro' && (
                  <>
                    <div className="space-y-2">
                      <p className="text-[9px] font-bold text-slate-400 uppercase ml-1">Resolution (Pro Only)</p>
                      <div className="flex gap-2">
                        {(['1K', '2K', '4K'] as const).map(size => (
                          <button 
                            key={size}
                            onClick={() => setImageSize(size)}
                            className={`flex-1 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all ${imageSize === size ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-100 text-slate-400'}`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>

                    <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200 cursor-pointer group">
                      <div className="flex-1">
                        <p className="text-[10px] font-black text-slate-700 uppercase">Trend Grounding</p>
                        <p className="text-[8px] font-bold text-slate-400 uppercase">Search live trends for context</p>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={useSearch} 
                        onChange={() => setUseSearch(!useSearch)}
                        className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      />
                    </label>
                  </>
                )}
              </div>
            </div>

            <button 
              onClick={processImage}
              disabled={isProcessing || !prompt}
              className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-3 transition-all shadow-xl active:scale-95 ${
                isProcessing 
                  ? 'bg-slate-200 text-slate-400' 
                  : mode === 'pro' ? 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-indigo-500/30' : 'bg-yellow-500 text-white hover:bg-yellow-600'
              }`}
            >
              {isProcessing ? (
                <>
                  <div className="w-5 h-5 border-3 border-slate-400 border-t-indigo-600 rounded-full animate-spin"></div>
                  Neural Computing...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  {mode === 'pro' ? 'Generate 4K Asset' : 'Execute Edit'}
                </>
              )}
            </button>
            {status && <p className="text-[9px] font-bold text-center text-slate-400 uppercase tracking-widest animate-pulse">{status}</p>}
          </div>
        </div>

        {/* Studio Canvas Area */}
        <div className="lg:col-span-8">
          <div className={`bg-slate-900 rounded-[3rem] p-8 md:p-12 shadow-2xl min-h-[650px] flex flex-col items-center justify-center relative overflow-hidden border ${mode === 'pro' ? 'border-indigo-500/20' : 'border-white/10'} group`}>
            {/* Ambient Background Glow */}
            <div className={`absolute top-0 right-0 w-96 h-96 ${mode === 'pro' ? 'bg-indigo-500/10' : 'bg-yellow-500/5'} blur-[150px] pointer-events-none`}></div>
            
            <div className="w-full flex flex-col items-center gap-10 z-10">
              <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                {/* Comparison View or Context */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between px-4">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">{mode === 'flash' ? 'Original Plate' : 'Inspiration Source'}</span>
                    <span className="text-[9px] font-bold text-slate-600 mono">RAW_SOURCE_IN</span>
                  </div>
                  <div className="aspect-square bg-white/5 rounded-3xl border border-white/10 overflow-hidden flex items-center justify-center relative">
                    {sourceImage ? (
                      <img src={sourceImage} className="w-full h-full object-contain cursor-pointer" alt="Original" onClick={() => console.log(sourceImage)} />
                    ) : (
                      <div className="text-center p-8 opacity-20">
                        <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        <p className="text-xs font-black uppercase">Source Empty</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* AI Result View */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between px-4">
                    <span className={`text-[10px] font-black uppercase tracking-[0.3em] ${mode === 'pro' ? 'text-indigo-400' : 'text-yellow-400'}`}>{mode === 'pro' ? 'Pro Generation' : 'Flash Enhancement'}</span>
                    <div className="flex gap-1">
                      <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${mode === 'pro' ? 'bg-indigo-500' : 'bg-yellow-500'}`}></div>
                      <span className={`text-[9px] font-bold mono ${mode === 'pro' ? 'text-indigo-500' : 'text-yellow-500'}`}>PROCESSED_OUT</span>
                    </div>
                  </div>
                  <div className={`aspect-square bg-white/5 rounded-3xl border ${mode === 'pro' ? 'border-indigo-500/30' : 'border-yellow-500/20'} overflow-hidden flex items-center justify-center relative group/result`}>
                    {resultImage ? (
                      <>
                        <img src={resultImage} className="w-full h-full object-contain animate-in zoom-in duration-700 cursor-pointer" alt="Result" onClick={() => console.log(resultImage)} />
                        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[8px] font-black text-white uppercase tracking-widest border border-white/10">
                          {mode === 'pro' ? `${imageSize} FIDELITY` : 'FLASH EDIT'}
                        </div>
                        <a 
                          href={resultImage} 
                          download={`AI_Production_${Date.now()}.png`}
                          className="absolute bottom-6 right-6 p-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-white opacity-0 group-hover/result:opacity-100 transition-opacity hover:bg-white hover:text-slate-900"
                        >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                        </a>
                      </>
                    ) : (
                      <div className="text-center p-8">
                        {isProcessing ? (
                          <div className="space-y-4">
                            <div className={`w-12 h-12 border-4 rounded-full animate-spin mx-auto ${mode === 'pro' ? 'border-indigo-500/30 border-t-indigo-500' : 'border-yellow-500/30 border-t-yellow-500'}`}></div>
                            <p className={`text-xs font-black uppercase tracking-widest ${mode === 'pro' ? 'text-indigo-400' : 'text-yellow-400'}`}>Neural Synthesis...</p>
                          </div>
                        ) : (
                          <div className="opacity-20">
                            <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                            <p className="text-xs font-black uppercase">Neural Interface Offline</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {resultImage && (
                <div className="w-full max-w-xl bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                     <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white ${mode === 'pro' ? 'bg-indigo-600' : 'bg-yellow-500'}`}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                     </div>
                     <div>
                       <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Asset Ready</p>
                       <p className="text-xs font-bold text-white">Commercial Grade Export Available</p>
                     </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={saveToHub}
                      disabled={isSaved}
                      className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all border ${isSaved ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-white/10 text-white hover:bg-white/20 border-white/10'}`}
                    >
                      {isSaved ? 'Saved to Hub' : 'Archive to Studio'}
                    </button>
                    <button 
                      onClick={() => {
                        setSourceImage(resultImage);
                        setResultImage(null);
                        setMode('flash');
                        setStatus('Editing generated asset...');
                        setIsSaved(false);
                      }}
                      className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-[10px] font-black uppercase text-white transition-all border border-white/10"
                    >
                      Refine in Flash
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {mode === 'pro' && !hasApiKey && (
            <div className="mt-6 p-6 bg-amber-50 border border-amber-200 rounded-3xl flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center text-white">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 00-2 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                </div>
                <div>
                  <p className="text-xs font-black text-amber-900 uppercase">Paid Tier Key Required</p>
                  <p className="text-[10px] font-medium text-amber-700">Banana Pro generation utilizes high-compute models. Please authorize with a Paid Key.</p>
                </div>
              </div>
              <button 
                onClick={handleOpenKeyDialog}
                className="px-6 py-2 bg-amber-600 text-white rounded-xl text-[10px] font-black uppercase hover:bg-amber-700 transition-all shadow-lg shadow-amber-200"
              >
                Select Key
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIImageStudio;
