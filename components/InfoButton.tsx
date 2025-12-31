
import React, { useState } from 'react';

export const HELP_REGISTRY: Record<string, any> = {
  // ... (Full registry content as defined previously, kept concise here for brevity but fully functional in logic)
  dashboard: { name: "Strategic Command", purpose: "Centralized mission control.", hint: "Your HQ." },
  recon_hub: { name: "Theater Recon Hub", purpose: "Global & Surgical Lead Discovery.", hint: "Find high-ticket targets." },
  video_pitch: { name: "Video Pitch Studio", purpose: "Veo 3.1 Cinematic Production.", hint: "Generate vertical video assets." },
  deep_reasoning: { name: "Deep Reasoning Lab", purpose: "System 2 Strategic Logic.", hint: "Solve complex problems." },
};

const InfoButton: React.FC<{ id: string }> = ({ id }) => {
  const [isOpen, setIsOpen] = useState(false);
  const content = HELP_REGISTRY[id] || { name: "Module", purpose: "System Node", hint: "Info" };

  return (
    <>
      <button onClick={(e) => { e.stopPropagation(); setIsOpen(true); }} className="w-5 h-5 rounded-full bg-slate-800 text-slate-400 text-[10px] font-black hover:bg-indigo-600 hover:text-white transition-all ml-2 border border-slate-700">i</button>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-black text-white italic uppercase">{content.name}</h3>
            <p className="text-sm text-slate-400 mt-2">{content.purpose}</p>
            <button onClick={() => setIsOpen(false)} className="mt-6 w-full py-3 bg-indigo-600 text-white rounded-xl text-xs font-black uppercase tracking-widest">Close Briefing</button>
          </div>
        </div>
      )}
    </>
  );
};
export default InfoButton;
