
import React, { useState, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { VaultAsset } from '../types';
import InfoButton from './InfoButton';

interface ProductStudioProps {
  onProduced: (asset: Omit<VaultAsset, 'id' | 'timestamp'>) => void;
  isDarkMode: boolean;
}

const ProductStudio: React.FC<ProductStudioProps> = ({ onProduced, isDarkMode }) => {
  const [baseImage, setBaseImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [environment, setEnvironment] = useState('Luxury Marble');
  const [status, setStatus] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setBaseImage(event.target?.result as string);
        setResultImage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const processProduct = async () => {
    if (!baseImage) return;
    setIsProcessing(true);
    setStatus('Analyzing Object Geometry...');

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const base64Data = baseImage.split(',')[1];
      const mimeType = baseImage.split(';')[0].split(':')[1];

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            { inlineData: { data: base64Data, mimeType } },
            { text: `Identify the main product in this image and perform a "Studio Overhaul". Remove the current background. Place the product on a high-end ${environment} surface. Apply professional 3-point cinematic studio lighting with realistic soft shadows and reflections. Ensure the product remains physically identical to the original but with elite marketing aesthetic.` }
          ]
        }
      });

      const candidate = response.candidates?.[0];
      if (candidate) {
        for (const part of candidate.content.parts) {
          if (part.inlineData) {
            setResultImage(`data:${part.inlineData.mimeType};base64,${part.inlineData.data}`);
            setStatus('Production Secured.');
            break;
          }
        }
      }
    } catch (e: any) {
      console.error(e);
      setStatus(`Node Failure: ${e.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const saveToVault = () => {
    if (resultImage) {
      onProduced({
        url: resultImage,
        title: `Product Shot: ${environment}`,
        type: 'product'
      });
      alert('High-end asset archived.');
    }
  };

  const environments = [
    { label: 'Luxury Marble', val: 'Minimalist white marble with soft morning sunlight' },
    { label: 'Dark Obsidian', val: 'Matte black volcanic rock with moody indigo backlight' },
    { label: 'Mediterranean Villa', val: 'Limestone terrace in Paphos with sea view background' },
    { label: 'Professional Studio', val: 'Seamless grey cyclorama with high-key lighting' }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h2 className={`text-3xl font-black italic uppercase tracking-tighter ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Product <span className="text-indigo-600">Synthesis</span> Studio</h2>
           <p className="text-slate-500 text-sm mt-2 font-medium">Turn raw smartphone photos into high-ticket studio assets instantly.</p>
        </div>
        <div className="bg-indigo-600/10 text-indigo-600 px-4 py-2 rounded-full border border-indigo-500/20 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
           <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
           Neural Inpainting Active
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-6">
           <div className={`p-8 rounded-[3rem] border shadow-2xl space-y-8 ${isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
              <div className="space-y-4">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">1. Raw Product Plate</label>
                 <div 
                   onClick={() => fileInputRef.current?.click()}
                   className={`w-full aspect-square rounded-[2rem] border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden ${baseImage ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 bg-slate-50 hover:bg-slate-100'}`}
                 >
                    {baseImage ? (
                      <img src={baseImage} className="w-full h-full object-contain" alt="Original" />
                    ) : (
                      <>
                        <div className="text-3xl mb-2">📸</div>
                        <p className="text-[9px] font-black text-slate-400 uppercase">Upload Original Photo</p>
                      </>
                    )}
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
                 </div>
              </div>

              <div className="space-y-4">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">2. Target Environment</label>
                 <div className="grid grid-cols-1 gap-2">
                    {environments.map(env => (
                      <button 
                        key={env.label}
                        onClick={() => setEnvironment(env.val)}
                        className={`text-left p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${environment === env.val ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg' : 'bg-slate-50 border-slate-100 text-slate-500 hover:bg-slate-100'}`}
                      >
                         {env.label}
                      </button>
                    ))}
                 </div>
              </div>

              <button 
                onClick={processProduct}
                disabled={isProcessing || !baseImage}
                className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-xl hover:bg-indigo-500 disabled:opacity-30 transition-all active:scale-95"
              >
                {isProcessing ? 'Synthesizing...' : 'Architect Studio Asset'}
              </button>
              {status && <p className="text-[9px] font-black text-center text-indigo-400 uppercase tracking-widest animate-pulse">{status}</p>}
           </div>
        </div>

        <div className="lg:col-span-8">
           <div className={`rounded-[4rem] p-12 min-h-[600px] flex flex-col items-center justify-center relative overflow-hidden shadow-2xl border ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-900 border-white/5'}`}>
              <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 blur-[150px] pointer-events-none"></div>
              
              {resultImage ? (
                <div className="w-full space-y-8 animate-in zoom-in duration-700">
                   <div className="relative group rounded-[3rem] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.8)] border border-white/10">
                      <img src={resultImage} className="w-full h-auto" alt="Final Product" />
                      <div className="absolute inset-0 bg-indigo-600/0 group-hover:bg-indigo-600/5 transition-colors pointer-events-none"></div>
                   </div>
                   <div className="flex justify-center gap-6">
                      <button onClick={saveToVault} className="bg-emerald-600 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-emerald-500">Archive Asset</button>
                      <a href={resultImage} download="Product_Studio_Asset.png" className="bg-white text-slate-900 px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-slate-50">Download 4K</a>
                   </div>
                </div>
              ) : (
                <div className="text-center space-y-6 opacity-20">
                   <div className="w-24 h-24 bg-white/5 rounded-[2.5rem] flex items-center justify-center mx-auto border border-white/10 text-5xl">✨</div>
                   <p className="text-white text-2xl font-black uppercase italic tracking-tighter">Studio Standby</p>
                   <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Awaiting source visual context to initialize synthesis cluster.</p>
                </div>
              )}

              {isProcessing && (
                <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-center z-50">
                   <div className="w-20 h-20 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-6"></div>
                   <p className="text-white font-black uppercase tracking-[0.4em] text-sm">Neural Studio rendering</p>
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default ProductStudio;
