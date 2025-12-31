
import React, { useState } from 'react';
import { VaultAsset } from '../types';
import InfoButton from './InfoButton';

interface ProductionHubProps {
  assets: VaultAsset[];
  setAssets: (assets: VaultAsset[]) => void;
}

const ProductionHub: React.FC<ProductionHubProps> = ({ assets, setAssets }) => {
  const [filter, setFilter] = useState<'all' | 'video' | 'image' | 'report'>('all');
  const [selectedAsset, setSelectedAsset] = useState<VaultAsset | null>(null);
  const [draggedAssetId, setDraggedAssetId] = useState<string | null>(null);

  const filteredAssets = assets.filter(a => {
    if (filter === 'all') return true;
    if (filter === 'video') return ['pitch', 'lab', 'external'].includes(a.type);
    if (filter === 'image') return a.type === 'image';
    if (filter === 'report') return a.type === 'report';
    return true;
  });

  const downloadText = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  const removeAsset = (id: string) => {
    setAssets(assets.filter(a => a.id !== id));
    if (selectedAsset?.id === id) setSelectedAsset(null);
  };

  const handleDragStart = (id: string) => {
    setDraggedAssetId(id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (targetId: string) => {
    if (draggedAssetId === null || draggedAssetId === targetId) return;

    const sourceIdx = assets.findIndex(a => a.id === draggedAssetId);
    const targetIdx = assets.findIndex(a => a.id === targetId);

    const updatedAssets = [...assets];
    const [movedAsset] = updatedAssets.splice(sourceIdx, 1);
    updatedAssets.splice(targetIdx, 0, movedAsset);

    setAssets(updatedAssets);
    setDraggedAssetId(null);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 leading-none uppercase tracking-tighter italic flex items-center">
            <span className="text-indigo-600 mr-2">Production</span> Studio
            <InfoButton id="production_hub" />
          </h2>
          <p className="text-slate-500 text-sm mt-2 font-medium italic">Centralized export hub. Drag to manually sort mission deliverables.</p>
        </div>
        <div className="flex bg-white p-1 rounded-2xl border border-slate-200 shadow-sm overflow-x-auto no-scrollbar">
          {(['all', 'video', 'image', 'report'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                filter === f ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {filteredAssets.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-slate-200 rounded-[3rem] p-20 text-center flex flex-col items-center justify-center opacity-40">
           <svg className="w-24 h-24 mb-6 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
           <h3 className="text-2xl font-black uppercase italic tracking-tighter text-slate-900">Queue Empty</h3>
           <p className="text-xs font-bold max-w-sm mt-2 uppercase tracking-widest">Generate content in the Video Studio, Visual Studio, or Deep Reasoning Lab to populate your production hub.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAssets.map((asset) => {
            const isBeingDragged = draggedAssetId === asset.id;
            return (
              <div 
                key={asset.id}
                draggable
                onDragStart={() => handleDragStart(asset.id)}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(asset.id)}
                className={`group bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-lg hover:shadow-2xl transition-all relative flex flex-col cursor-grab active:cursor-grabbing ${isBeingDragged ? 'opacity-30 scale-95 border-dashed border-indigo-50' : ''}`}
              >
                <div className="aspect-video bg-slate-900 flex items-center justify-center relative overflow-hidden">
                  {['pitch', 'lab', 'external'].includes(asset.type) ? (
                    <video src={asset.url} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity pointer-events-none" />
                  ) : asset.type === 'image' ? (
                    <img 
                      src={asset.url} 
                      loading="lazy" 
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 animate-in fade-in cursor-pointer" 
                      alt={asset.title}
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log(asset.url);
                      }}
                    />
                  ) : (
                    <div className="p-6 text-indigo-400 text-center space-y-2 pointer-events-none">
                      <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                      <p className="text-[10px] font-black uppercase tracking-widest">Strategic Report</p>
                    </div>
                  )}
                  
                  <div className="absolute top-3 left-3 pointer-events-none">
                     <span className={`text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-widest ${
                       asset.type === 'image' ? 'bg-yellow-400 text-slate-900' : 
                       asset.type === 'report' ? 'bg-violet-600 text-white' : 'bg-indigo-600 text-white'
                     }`}>
                       {asset.type}
                     </span>
                  </div>

                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity gap-3">
                     <button 
                       onClick={() => setSelectedAsset(asset)}
                       className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/30 hover:bg-white hover:text-slate-900 transition-all"
                     >
                       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                     </button>
                     <button 
                       onClick={() => removeAsset(asset.id)}
                       className="w-10 h-10 bg-red-500/20 backdrop-blur-md rounded-full flex items-center justify-center text-red-500 border border-red-500/30 hover:bg-red-500 hover:text-white transition-all"
                     >
                       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                     </button>
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col pointer-events-none">
                  <div className="flex justify-between items-start mb-2">
                     <h4 className="text-sm font-black text-slate-900 truncate flex-1">{asset.title}</h4>
                  </div>
                  <div className="mt-auto flex items-center justify-between pointer-events-auto">
                     <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                       {new Date(asset.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                     </span>
                     {asset.type === 'report' ? (
                       <button 
                         onClick={() => downloadText(asset.content || '', `${asset.title.replace(/\s+/g, '_')}.txt`)}
                         className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline"
                       >
                         Download TXT
                       </button>
                     ) : (
                       <a 
                         href={asset.url} 
                         download={`${asset.title.replace(/\s+/g, '_')}.${asset.type === 'image' ? 'png' : 'mp4'}`}
                         className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline"
                       >
                         Download {asset.type === 'image' ? 'PNG' : 'MP4'}
                       </a>
                     )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selectedAsset && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-3xl animate-in fade-in duration-500">
           <div className="relative w-full max-w-5xl max-h-[90vh] bg-white rounded-[3rem] overflow-hidden flex flex-col shadow-2xl">
              <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-white">
                <div>
                   <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-1 block">Production Preview</span>
                   <h3 className="text-2xl font-black text-slate-900 italic">{selectedAsset.title}</h3>
                </div>
                <button 
                  onClick={() => setSelectedAsset(null)}
                  className="p-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl transition-all"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto bg-slate-50 p-8">
                 {['pitch', 'lab', 'external'].includes(selectedAsset.type) ? (
                   <div className="h-full w-full flex items-center justify-center">
                     <video src={selectedAsset.url} className="max-h-full rounded-3xl shadow-xl" controls autoPlay />
                   </div>
                 ) : selectedAsset.type === 'image' ? (
                   <div className="h-full w-full flex items-center justify-center">
                     <img 
                      src={selectedAsset.url} 
                      decoding="async"
                      className="max-h-full rounded-3xl shadow-xl object-contain animate-in zoom-in-95 duration-500 cursor-pointer" 
                      alt={selectedAsset.title}
                      onClick={() => console.log(selectedAsset.url)}
                     />
                   </div>
                 ) : (
                   <div className="prose prose-slate max-w-none bg-white p-12 rounded-3xl border border-slate-200 shadow-sm font-medium leading-relaxed text-slate-700 whitespace-pre-wrap">
                      {selectedAsset.content}
                   </div>
                 )}
              </div>

              <div className="p-8 bg-white border-t border-slate-100 flex items-center justify-between">
                 <div className="flex gap-4">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ID: {selectedAsset.id}</span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Type: {selectedAsset.type}</span>
                 </div>
                 <div className="flex gap-4">
                    {selectedAsset.type === 'report' ? (
                      <button 
                        onClick={() => downloadText(selectedAsset.content || '', `${selectedAsset.title}.txt`)}
                        className="px-8 py-3 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl"
                      >
                        Download Report
                      </button>
                    ) : (
                      <a 
                        href={selectedAsset.url} 
                        download={`${selectedAsset.title}.${selectedAsset.type === 'image' ? 'png' : 'mp4'}`}
                        className="px-8 py-3 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl"
                      >
                        Download File
                      </a>
                    )}
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default ProductionHub;
