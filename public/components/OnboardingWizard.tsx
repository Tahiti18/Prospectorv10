import React, { useState, useEffect } from 'react';

interface OnboardingStep {
  title: string;
  desc: string;
  action: string;
  icon: string;
  tabId: string;
}

interface OnboardingWizardProps {
  onClose: () => void;
  onNavigate: (tabId: string) => void;
  isDarkMode: boolean;
}

const TOUR_STEPS: OnboardingStep[] = [
  {
    title: "Mission Briefing",
    desc: "Welcome to the Offensive Revenue Engine. You are now equipped to find and close high-ticket digital transformation deals using elite AI capabilities.",
    action: "Authorize Comms",
    icon: "📡",
    tabId: "dashboard"
  },
  {
    title: "Global Discovery",
    desc: "Use the Discovery Engine to find 'Digital Ghosts' anywhere in the world—businesses with high ratings but weak or missing web infrastructure.",
    action: "Scan Web",
    icon: "🔍",
    tabId: "search"
  },
  {
    title: "Intelligence Recon",
    desc: "Your Target Pool stores active leads. Deep-audit their visual assets and social gaps to identify exactly where they are leaking revenue.",
    action: "Verify Targets",
    icon: "🎯",
    tabId: "targets"
  },
  {
    title: "Conversion Studio",
    desc: "Generate cinematic vertical video pitches and 4K web mockups. Show your prospects their future digital state before the first call.",
    action: "Initialize Forge",
    icon: "🎨",
    tabId: "pitch"
  },
  {
    title: "Strategic Execution",
    desc: "Bundle your AI assets into a single 'Magic Link'. Track their ROI recovery value and close the deal with a professional proposal.",
    action: "Commence Operations",
    icon: "🏁",
    tabId: "closer"
  }
];

const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ onClose, onNavigate, isDarkMode }) => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // Navigate the app background to show the relevant feature
    onNavigate(TOUR_STEPS[currentStep].tabId);
  }, [currentStep, onNavigate]);

  const next = () => {
    if (currentStep < TOUR_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const back = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-6 bg-slate-950/40 backdrop-blur-md animate-in fade-in duration-500">
      <div className={`w-full max-w-xl rounded-[3rem] border shadow-[0_50px_100px_rgba(0,0,0,0.6)] overflow-hidden transition-all duration-500 transform scale-100 border-slate-800 bg-[#0f172a]`}>
         
         <div className="bg-indigo-600 px-12 py-8 text-white flex justify-between items-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-2xl rounded-full translate-x-10 -translate-y-10"></div>
            <div className="relative z-10">
               <p className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-200 mb-1">Indoctrination Phase</p>
               <h3 className="text-2xl font-black italic uppercase tracking-tighter">Module 0{currentStep + 1}: {TOUR_STEPS[currentStep].title}</h3>
            </div>
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center text-3xl shadow-inner border border-white/10">
               {TOUR_STEPS[currentStep].icon}
            </div>
         </div>

         <div className="p-12 space-y-8">
            <div className="space-y-4">
               <p className="text-lg font-medium text-slate-300 leading-relaxed italic">
                 "{TOUR_STEPS[currentStep].desc}"
               </p>
               <div className="flex items-center gap-3 py-2">
                  <div className="flex-1 h-1 bg-slate-800 rounded-full overflow-hidden">
                     <div 
                        className="h-full bg-indigo-500 transition-all duration-700 ease-out" 
                        style={{ width: `${((currentStep + 1) / TOUR_STEPS.length) * 100}%` }}
                     ></div>
                  </div>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{currentStep + 1} / {TOUR_STEPS.length}</span>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               {currentStep > 0 ? (
                  <button 
                    onClick={back}
                    className="py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] border border-slate-800 text-slate-500 hover:bg-slate-800 hover:text-white transition-all"
                  >
                    Previous Module
                  </button>
               ) : (
                  <button 
                    onClick={onClose}
                    className="py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] border border-slate-800 text-slate-500 hover:bg-slate-800 hover:text-white transition-all"
                  >
                    Skip Infiltration
                  </button>
               )}
               
               <button 
                 onClick={next}
                 className="py-5 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] shadow-xl hover:bg-indigo-500 transition-all active:scale-95 flex items-center justify-center gap-3 group"
               >
                 {TOUR_STEPS[currentStep].action}
                 <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
               </button>
            </div>
            
            <p className="text-[8px] font-black text-slate-600 text-center uppercase tracking-[0.5em] italic">System Identification: GLOBAL_PROSPECTOR_v9.7</p>
         </div>
      </div>
    </div>
  );
};

export default OnboardingWizard;