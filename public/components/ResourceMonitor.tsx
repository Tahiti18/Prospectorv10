
import React from 'react';
const ResourceMonitor: React.FC<{isDarkMode: boolean}> = () => (
  <div className="fixed bottom-0 left-0 right-0 h-8 bg-[#020617] border-t border-white/10 flex items-center px-6 justify-between z-[100]">
    <div className="flex gap-6 text-[9px] font-black uppercase tracking-widest text-slate-500">
      <span className="text-emerald-500">SYSTEM: ONLINE</span>
      <span>LATENCY: 42ms</span>
      <span>TOKENS: 0</span>
    </div>
    <div className="text-[9px] font-black uppercase tracking-widest text-indigo-500">PROSPECTOR_OS v10.0</div>
  </div>
);
export default ResourceMonitor;
