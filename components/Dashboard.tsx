
import React from 'react';
import { Lead, RegionConfig } from '../types';
import InfoButton from './InfoButton';

interface Props { leads: Lead[]; health: any; currentRegion: RegionConfig; onNavigate: (t: string) => void; }

const Dashboard: React.FC<Props> = ({ leads, health, currentRegion, onNavigate }) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="relative p-12 rounded-[3rem] glass-panel overflow-hidden text-center group">
        {/* Dynamic Background Effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-indigo-500/5 to-transparent pointer-events-none"></div>
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-500/10 blur-[100px] pointer-events-none"></div>

        <div className="relative z-10 flex flex-col items-center">
           <div className="flex items-center gap-3 mb-6 bg-black/20 px-4 py-1.5 rounded-full border border-white/5 backdrop-blur-md">
             <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
             <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">System Online</span>
           </div>
           
           <h2 className="text-7xl md:text-8xl font-black italic uppercase tracking-tighter text-white text-glow mb-4 leading-none">
             Mission <span className="text-indigo-500">Control</span>
           </h2>
           <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.4em] mb-10">Active Theater: <span className="text-white">{currentRegion.country}</span></p>
           
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl">
              {['API UPLINK', 'THEATER LOCK', 'TOKEN FLOW', 'SCHEMA SYNC'].map(l => (
                <div key={l} className="bg-white/5 border border-white/5 p-4 rounded-2xl backdrop-blur-sm hover:bg-white/10 transition-colors">
                   <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">{l}</p>
                   <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">SECURE</p>
                </div>
              ))}
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <button onClick={() => onNavigate('recon')} className="group p-8 glass-card rounded-[2.5rem] text-left hover:bg-indigo-600/10 hover:border-indigo-500/30 transition-all duration-300">
            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-2xl mb-6 border border-white/10 group-hover:scale-110 transition-transform">📡</div>
            <h3 className="text-2xl font-black italic uppercase text-white group-hover:text-indigo-400 transition-colors">Recon</h3>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-2 group-hover:text-slate-300">Scan & Capture</p>
         </button>
         
         <button onClick={() => onNavigate('targets')} className="group p-8 glass-card rounded-[2.5rem] text-left hover:bg-emerald-600/10 hover:border-emerald-500/30 transition-all duration-300">
            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-2xl mb-6 border border-white/10 group-hover:scale-110 transition-transform">🎯</div>
            <h3 className="text-2xl font-black italic uppercase text-white group-hover:text-emerald-400 transition-colors">Targets</h3>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-2 group-hover:text-slate-300">{leads.length} Active Assets</p>
         </button>
         
         <button onClick={() => onNavigate('pitch')} className="group p-8 glass-card rounded-[2.5rem] text-left hover:bg-rose-600/10 hover:border-rose-500/30 transition-all duration-300">
            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-2xl mb-6 border border-white/10 group-hover:scale-110 transition-transform">🎬</div>
            <h3 className="text-2xl font-black italic uppercase text-white group-hover:text-rose-400 transition-colors">Create</h3>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-2 group-hover:text-slate-300">Forge Payloads</p>
         </button>
      </div>
    </div>
  );
};
export default Dashboard;
