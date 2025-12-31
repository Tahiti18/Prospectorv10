
import React from 'react';
import { Lead } from '../types';

interface Props { leads: Lead[]; onSelectLead: (l: Lead) => void; archivedIds: any; isDarkMode: boolean; }

const LeadTable: React.FC<Props> = ({ leads, onSelectLead }) => {
  return (
    <div className="glass-panel rounded-[2.5rem] overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-slate-900/50 border-b border-white/5 text-[9px] font-black text-slate-500 uppercase tracking-widest">
          <tr>
            <th className="px-8 py-6">Identity</th>
            <th className="px-8 py-6">Sector</th>
            <th className="px-8 py-6 text-center">Neural Score</th>
            <th className="px-8 py-6 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {leads.map(l => (
            <tr key={l.rank} onClick={() => onSelectLead(l)} className="hover:bg-white/5 cursor-pointer transition-colors group">
              <td className="px-8 py-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center text-indigo-500 font-mono font-bold text-xs">{l.rank}</div>
                  <div>
                    <div className="text-white font-black text-sm uppercase italic tracking-tight group-hover:text-indigo-400 transition-colors">{l.businessName}</div>
                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{l.city}</div>
                  </div>
                </div>
              </td>
              <td className="px-8 py-6"><span className="px-3 py-1 bg-white/5 rounded-lg text-[10px] font-bold text-slate-400 uppercase">{l.niche}</span></td>
              <td className="px-8 py-6 text-center">
                <span className="text-xl font-black italic text-white">{l.leadScore}</span>
                <div className="h-1 w-20 bg-slate-800 rounded-full mx-auto mt-1 overflow-hidden">
                  <div className="h-full bg-indigo-500" style={{ width: `${l.leadScore}%` }}></div>
                </div>
              </td>
              <td className="px-8 py-6 text-right">
                <button className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[9px] font-black uppercase tracking-widest transition-all">Engage</button>
              </td>
            </tr>
          ))}
          {leads.length === 0 && <tr><td colSpan={4} className="p-20 text-center text-slate-600 font-black uppercase tracking-widest italic">No Targets Acquired</td></tr>}
        </tbody>
      </table>
    </div>
  );
};
export default LeadTable;
