
import React, { useState, useEffect } from 'react';
import { AgencyProfile, WhiteLabelConfig } from '../types';

interface AgencyIdentityHubProps {
  isDarkMode: boolean;
}

const AgencyIdentityHub: React.FC<AgencyIdentityHubProps> = ({ isDarkMode }) => {
  const [profile, setProfile] = useState<AgencyProfile>(() => {
    const saved = localStorage.getItem('pomelli_agency_profile');
    return saved ? JSON.parse(saved) : {
      name: 'Pomelli',
      ceoName: 'Alex Pomelli',
      primaryService: 'AI Transformation',
      tagline: 'High-Ticket Automation for Elite Brands',
      contactEmail: 'hq@pomelli.cy',
      contactPhone: '+357 99 000 000',
      brandColor: '#6366f1',
      tier: 'Free',
      whiteLabel: { isEnabled: false, hidePoweredBy: false }
    };
  });

  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    localStorage.setItem('pomelli_agency_profile', JSON.stringify(profile));
  }, [profile]);

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const toggleWhiteLabel = () => {
    if (profile.tier !== 'Enterprise') {
      alert("License Required: White-Labeling is reserved for Enterprise tier.");
      return;
    }
    setProfile({
      ...profile,
      whiteLabel: { ...profile.whiteLabel, isEnabled: !profile.whiteLabel.isEnabled }
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-700 pb-20">
      <div className="text-center space-y-3">
        <h2 className={`text-4xl font-black italic uppercase tracking-tighter ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Agency <span className="text-indigo-600">Architect</span></h2>
        <p className="text-slate-500 text-sm font-medium uppercase tracking-widest">Global Brand Orchestration & White-Labeling</p>
      </div>

      <div className={`p-10 rounded-[3.5rem] border shadow-2xl space-y-12 relative overflow-hidden ${isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Agency Brand Name</label>
              <input type="text" value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} className={`w-full px-5 py-3 rounded-2xl border outline-none font-bold ${isDarkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-100'}`} />
           </div>
           <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Executive Principal (CEO)</label>
              <input type="text" value={profile.ceoName} onChange={e => setProfile({...profile, ceoName: e.target.value})} className={`w-full px-5 py-3 rounded-2xl border outline-none font-bold ${isDarkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-100'}`} />
           </div>
        </div>

        {/* White Label Section */}
        <div className={`p-8 rounded-[2.5rem] border ${profile.whiteLabel.isEnabled ? 'border-indigo-500/50 bg-indigo-500/5' : 'border-slate-200 bg-slate-50 dark:bg-slate-950 dark:border-slate-800'}`}>
           <div className="flex justify-between items-center mb-8">
              <div>
                 <h4 className="text-sm font-black uppercase italic tracking-tighter">White-Label Deployment</h4>
                 <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Detach Pomelli identity from Proposals & Client Portals</p>
              </div>
              <button 
                onClick={toggleWhiteLabel}
                className={`w-14 h-8 rounded-full relative transition-all ${profile.whiteLabel.isEnabled ? 'bg-indigo-600' : 'bg-slate-300'}`}
              >
                <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${profile.whiteLabel.isEnabled ? 'left-7' : 'left-1'}`}></div>
              </button>
           </div>
           
           {profile.whiteLabel.isEnabled && (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-top-4">
                <div className="space-y-2">
                   <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Custom Domain (e.g. leads.youragency.com)</label>
                   <input type="text" placeholder="Pending DNS Setup" className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs" />
                </div>
                <div className="space-y-2">
                   <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Custom Logo Path (SVG/PNG)</label>
                   <input type="text" placeholder="https://..." className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs" />
                </div>
             </div>
           )}
        </div>

        <button onClick={handleSave} className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-xl transition-all active:scale-95 ${isSaved ? 'bg-emerald-500 text-white shadow-emerald-500/20' : 'bg-indigo-600 text-white shadow-indigo-600/20 hover:bg-indigo-500'}`}>
          {isSaved ? 'Identity Matrix Locked' : 'Commit Brand Variables'}
        </button>
      </div>
    </div>
  );
};

export default AgencyIdentityHub;
