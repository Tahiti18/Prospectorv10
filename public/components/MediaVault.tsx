
import React, { useState, useRef } from 'react';
import { VaultAsset } from '../types';

interface MediaVaultProps {
  assets: VaultAsset[];
  onAddExternal: (asset: Omit<VaultAsset, 'id' | 'timestamp'>) => void;
}

const MediaVault: React.FC<MediaVaultProps> = ({ assets, onAddExternal }) => {
  const [selectedAsset, setSelectedAsset] = useState<VaultAsset | null>(null);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExternalUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      onAddExternal({
        url,
        title: file.name,
        type: 'external'
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 leading-none uppercase tracking-tighter italic flex items-center gap-3">
            <span className="text-indigo-600">Production</span> Vault
          </h2>
          <p className="text-slate-500 text-sm mt-2 font-medium italic">High-fidelity playback hub for all generated pitches and local video assets.</p>
        </div>
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="bg-white border border-slate-200 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 flex items-center gap-2 shadow-sm transition-all active:scale-95"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
          Import Media
          <input ref={fileInputRef} type="file" accept="video/*" onChange={handleExternalUpload} className="hidden" />
        </button>
      </div>

      {assets.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-slate-200 rounded-[3rem] p-20 text-center flex flex-col items-center justify-center opacity-40">
           <svg className="w-24 h-24 mb-6 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
           <h3 className="text-2xl font-black uppercase italic tracking-tighter text-slate-900">Vault Empty</h3>
           <p className="text-xs font-bold max-w-sm mt-2 uppercase tracking-widest">Archive your pitches from the 'Video Pitch' tab or import external files to begin high-fidelity review.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {assets.map((asset) => (
            <div 
              key={asset.id} 
              onClick={() => setSelectedAsset(asset)}
              className="group bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-lg cursor-pointer hover:shadow-2xl hover:scale-[1.02] transition-all relative"
            >
              <div className="aspect-[9/16] bg-slate-900 flex items-center justify-center relative">
                {asset.type === 'image' ? (
                  <img 
                    src={asset.url} 
                    loading="lazy" 
                    decoding="async"
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-500" 
                    alt={asset.title}
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log(asset.url);
                    }}
                  />
                ) : (
                  <video src={asset.url} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                )}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors"></div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                   <div className="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center text-white border border-white/30">
                      <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                   </div>
                </div>
              </div>
              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                   <span className={`text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-widest ${
                     asset.type === 'pitch' ? 'bg-indigo-100 text-indigo-600' : 
                     asset.type === 'lab' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-600'
                   }`}>
                     {asset.type}
                   </span>
                   <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">
                     {new Date(asset.timestamp).toLocaleDateString()}
                   </span>
                </div>
                <h4 className="text-sm font-black text-slate-900 truncate">{asset.title}</h4>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedAsset && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-3xl animate-in fade-in duration-500">
           <div className={`relative w-full transition-all duration-700 ${isFocusMode ? 'max-w-none h-full p-0' : 'max-w-4xl max-h-[90vh]'}`}>
              {/* Controls */}
              <div className="absolute top-8 right-8 flex gap-4 z-[110]">
                 <button 
                  onClick={() => setIsFocusMode(!isFocusMode)}
                  className="p-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl backdrop-blur-xl border border-white/10 transition-all"
                  title="Toggle Focus Mode"
                 >
                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
                 </button>
                 <button 
                  onClick={() => { setSelectedAsset(null); setIsFocusMode(false); }}
                  className="p-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl backdrop-blur-xl border border-white/10 transition-all"
                 >
                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                 </button>
              </div>

              <div className={`h-full w-full bg-black flex items-center justify-center overflow-hidden transition-all duration-700 ${isFocusMode ? 'rounded-none shadow-none' : 'rounded-[3rem] shadow-[0_50px_100px_rgba(0,0,0,0.8)] border border-white/10'}`}>
                {selectedAsset.type === 'image' ? (
                  <img 
                    src={selectedAsset.url} 
                    decoding="async"
                    className={`max-h-full transition-all duration-700 object-contain animate-in zoom-in-95 cursor-pointer ${isFocusMode ? 'h-full w-auto' : 'w-full'}`} 
                    alt={selectedAsset.title}
                    onClick={() => console.log(selectedAsset.url)}
                  />
                ) : (
                  <video 
                    src={selectedAsset.url} 
                    className={`max-h-full transition-all duration-700 ${isFocusMode ? 'h-full w-auto' : 'w-full'}`}
                    controls 
                    autoPlay
                  />
                )}
              </div>

              {!isFocusMode && (
                <div className="absolute bottom-10 left-10 right-10 flex justify-between items-end animate-in slide-in-from-bottom-4 duration-700 pointer-events-none">
                   <div className="p-6 bg-black/40 backdrop-blur-xl rounded-[2rem] border border-white/10 max-w-md pointer-events-auto">
                      <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Active Production</p>
                      <h3 className="text-xl font-black text-white italic truncate">{selectedAsset.title}</h3>
                      <div className="flex gap-4 mt-4">
                         <a 
                          href={selectedAsset.url} 
                          download={`Vault_Export_${selectedAsset.id}.${selectedAsset.type === 'image' ? 'png' : 'mp4'}`}
                          className="px-6 py-2 bg-white text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all shadow-xl"
                         >
                           Export {selectedAsset.type === 'image' ? 'PNG' : '4K'}
                         </a>
                         <button className="px-6 py-2 bg-white/10 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/20 transition-all border border-white/10">
                           Analyze Content
                         </button>
                      </div>
                   </div>
                </div>
              )}
           </div>
        </div>
      )}
    </div>
  );
};

export default MediaVault;
