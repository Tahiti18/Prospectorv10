
import React, { useState } from 'react';
import { Proposal, Lead, VaultAsset } from '../types';
import InfoButton from './InfoButton';
import QRGenerator from './QRGenerator';

interface ProposalStudioProps {
  proposals: Proposal[];
  setProposals: React.Dispatch<React.SetStateAction<Proposal[]>>;
  assets: VaultAsset[];
  selectedLead: Lead | null;
}

const ProposalStudio: React.FC<ProposalStudioProps> = ({ proposals, setProposals, assets, selectedLead }) => {
  const [activeTab, setActiveTab] = useState<'create' | 'history'>('create');
  const [pitchText, setPitchText] = useState('');
  const [selectedMockupId, setSelectedMockupId] = useState<string | null>(null);
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [copyStatus, setCopyStatus] = useState<string | null>(null);

  const mockups = assets.filter(a => a.type === 'mockup');
  const videos = assets.filter(a => ['pitch', 'lab', 'external'].includes(a.type));

  const createProposal = () => {
    if (!selectedLead || !pitchText) return;
    setIsCreating(true);

    const proposal: Proposal = {
      id: Math.random().toString(36).substr(2, 9),
      leadName: selectedLead.businessName,
      niche: selectedLead.niche,
      pitchText,
      mockupUrl: assets.find(a => a.id === selectedMockupId)?.url,
      videoUrl: assets.find(a => a.id === selectedVideoId)?.url,
      timestamp: Date.now()
    };

    setProposals(prev => [proposal, ...prev]);
    setIsCreating(false);
    setActiveTab('history');
  };

  const getMagicLink = (proposal: Proposal) => {
    const payload = btoa(JSON.stringify(proposal));
    const url = new URL(window.location.href);
    url.searchParams.set('p', payload);
    return url.toString();
  };

  const copyLink = (proposal: Proposal) => {
    const link = getMagicLink(proposal);
    navigator.clipboard.writeText(link);
    setCopyStatus(proposal.id);
    setTimeout(() => setCopyStatus(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 leading-none uppercase tracking-tighter italic flex items-center">
            Magic Link <span className="text-indigo-600 ml-2">Architect</span>
            <InfoButton id="proposals" />
          </h2>
          <p className="text-slate-500 text-sm mt-2 font-medium italic">Bundle your intelligence assets into a high-end conversion portal for the client.</p>
        </div>
        <div className="flex bg-white p-1 rounded-2xl border border-slate-200 shadow-sm">
          <button onClick={() => setActiveTab('create')} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'create' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}>Architect New</button>
          <button onClick={() => setActiveTab('history')} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'history' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}>Active Proposals ({proposals.length})</button>
        </div>
      </div>

      {activeTab === 'create' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-2xl space-y-8 relative overflow-hidden">
               {!selectedLead ? (
                 <div className="py-12 text-center space-y-4 opacity-40">
                   <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4v16m8-8H4" /></svg>
                   <p className="text-xs font-black uppercase tracking-widest">Select a lead to begin architecting</p>
                 </div>
               ) : (
                 <>
                   <div className="space-y-4">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">1. Strategic Narrative (Pitch)</label>
                      <textarea value={pitchText} onChange={(e) => setPitchText(e.target.value)} placeholder="Paste your generated pitch text here..." className="w-full h-40 bg-slate-50 border border-slate-200 rounded-2xl p-5 text-sm font-medium outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all resize-none shadow-inner" />
                   </div>
                   <div className="space-y-4">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">2. Select 4K Mockup</label>
                      <div className="grid grid-cols-3 gap-2">
                        {mockups.map(m => (
                          <button key={m.id} onClick={() => setSelectedMockupId(m.id)} className={`aspect-video rounded-xl overflow-hidden border-2 transition-all ${selectedMockupId === m.id ? 'border-indigo-600 scale-105 shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'}`}>
                            <img src={m.url} loading="lazy" decoding="async" className="w-full h-full object-cover" alt={m.title} />
                          </button>
                        ))}
                      </div>
                   </div>
                   <div className="space-y-4">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">3. Select Video Pitch</label>
                      <div className="grid grid-cols-3 gap-2">
                        {videos.map(v => (
                          <button key={v.id} onClick={() => setSelectedVideoId(v.id)} className={`aspect-[9/16] rounded-xl overflow-hidden border-2 transition-all ${selectedVideoId === v.id ? 'border-indigo-600 scale-105 shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'}`}><video src={v.url} className="w-full h-full object-cover" /></button>
                        ))}
                      </div>
                   </div>
                   <button onClick={createProposal} disabled={isCreating || !selectedLead || !pitchText} className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:bg-indigo-500 transition-all shadow-xl disabled:opacity-50">Construct Magic Link</button>
                 </>
               )}
            </div>
          </div>
          <div className="lg:col-span-7">
            <div className="bg-slate-900 rounded-[3rem] p-10 shadow-2xl min-h-[600px] flex flex-col relative overflow-hidden border border-white/10 group">
              <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 blur-[150px] pointer-events-none"></div>
              <div className="flex justify-between items-start mb-10 border-b border-white/5 pb-8">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white">QR</div>
                    <div><h3 className="text-sm font-black text-white uppercase tracking-widest">Proposal Blueprint</h3><p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Agency Preview Node</p></div>
                 </div>
                 {selectedLead && <QRGenerator url={selectedLead.websiteUrl} businessName={selectedLead.businessName} />}
              </div>
              <div className="flex-1 space-y-10">
                 {selectedLead ? (
                   <>
                    <div className="space-y-4"><h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">Transformation Narrative</h4><div className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap italic">{pitchText || "The pitch narrative will populate here."}</div></div>
                    <div className="grid grid-cols-2 gap-6">
                       <div className="space-y-4">
                        <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">Visual Anchor</h4>
                        <div className="aspect-video bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center overflow-hidden">
                          {selectedMockupId ? (
                            <img 
                              src={assets.find(a => a.id === selectedMockupId)?.url} 
                              decoding="async"
                              className="w-full h-full object-cover animate-in fade-in" 
                              alt="Mockup Preview"
                            />
                          ) : (
                            <p className="text-[9px] font-bold text-slate-600 uppercase">No Mockup</p>
                          )}
                        </div>
                       </div>
                       <div className="space-y-4"><h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">Engagement Anchor</h4><div className="aspect-video bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center overflow-hidden">{selectedVideoId ? <video src={assets.find(a => a.id === selectedVideoId)?.url} className="w-full h-full object-cover" /> : <p className="text-[9px] font-bold text-slate-600 uppercase">No Video</p>}</div></div>
                    </div>
                   </>
                 ) : <div className="h-full flex flex-col items-center justify-center opacity-20 py-20 text-center"><p className="text-xl font-black uppercase italic text-white tracking-tighter">Architect Mode Idle</p></div>}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {proposals.map(p => (
            <div key={p.id} className="bg-white rounded-3xl border border-slate-200 p-8 shadow-lg hover:shadow-2xl transition-all space-y-6 relative overflow-hidden group">
               <div className="flex justify-between items-start">
                  <div className="space-y-1"><h4 className="text-lg font-black italic uppercase tracking-tighter text-slate-900">{p.leadName}</h4><p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{p.niche}</p></div>
                  <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">{new Date(p.timestamp).toLocaleDateString()}</span>
               </div>
               <div className="flex gap-2">
                  <button onClick={() => copyLink(p)} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${copyStatus === p.id ? 'bg-emerald-500 text-white' : 'bg-slate-900 text-white hover:bg-indigo-600'}`}>{copyStatus === p.id ? 'Copied Magic Link' : 'Copy Magic Link'}</button>
               </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProposalStudio;
