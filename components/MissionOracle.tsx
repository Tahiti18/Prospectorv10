
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { ActiveMission, MissionStep } from '../types';

interface MissionOracleProps {
  onNavigate: (tab: string) => void;
  isDarkMode: boolean;
}

const MissionOracle: React.FC<MissionOracleProps> = ({ onNavigate, isDarkMode }) => {
  const [goal, setGoal] = useState('');
  const [activeMission, setActiveMission] = useState<ActiveMission | null>(null);
  const [isThinking, setIsThinking] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const SYSTEM_CAPABILITIES = `
    The platform layout consists of:
    - Dashboard: Overview of Cyprus leads and scores.
    - Leads: Deep-recon database for filtering targets.
    - WarRoom: Competitor analysis and vulnerability mapping.
    - Video Studio: Veo 3.1 cinematic vertical pitch generation.
    - 4K Mockup: UI concept generation for high-ticket clients.
    - Proposals: The "Magic Link" architect to bundle assets.
    - ROI Node: Financial leakage and profit forecasting.
    - Billing: Invoicing, subscriptions, and capital management.
    - Settings: API Key authorization (Google, Stripe, Resend).
  `;

  const architectMission = async () => {
    if (!goal.trim()) return;
    setIsThinking(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `User Goal: "${goal}". Based on these platform tabs: ${SYSTEM_CAPABILITIES}, architect a 5-step mission roadmap. 
        For each step, specify the "tabId" to click (e.g., 'leads', 'video', 'proposals'). 
        Return JSON object: { goal, steps: [{task, tabId}] }.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              goal: { type: Type.STRING },
              steps: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    task: { type: Type.STRING },
                    tabId: { type: Type.STRING }
                  }
                }
              }
            }
          }
        }
      });
      const data = JSON.parse(response.text || "{}");
      setActiveMission({ ...data, progress: 0, steps: data.steps.map((s: any) => ({ ...s, isComplete: false })) });
    } catch (e) {
      console.error(e);
    } finally {
      setIsThinking(false);
    }
  };

  const toggleStep = (index: number) => {
    if (!activeMission) return;
    const newSteps = [...activeMission.steps];
    newSteps[index].isComplete = !newSteps[index].isComplete;
    const progress = (newSteps.filter(s => s.isComplete).length / newSteps.length) * 100;
    setActiveMission({ ...activeMission, steps: newSteps, progress });
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-32 left-6 w-14 h-14 bg-emerald-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-emerald-700 transition-all z-50 transform hover:scale-110 border-4 border-white dark:border-slate-900"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
      </button>

      {isOpen && (
        <div className={`fixed bottom-48 left-6 w-80 md:w-96 bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-50 animate-in slide-in-from-bottom-4 duration-300 flex flex-col max-h-[600px]`}>
          <div className="bg-emerald-600 p-6 text-white">
             <h3 className="text-sm font-black uppercase tracking-widest italic">Mission Oracle</h3>
             <p className="text-[10px] opacity-80 font-bold uppercase mt-1">Goal-to-Workflow Engine</p>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
             {!activeMission ? (
               <div className="space-y-4">
                  <p className="text-[11px] font-bold text-slate-500 uppercase leading-relaxed">What do you want to achieve today? (e.g., "Close my first real estate client in Limassol")</p>
                  <textarea 
                    value={goal}
                    onChange={e => setGoal(e.target.value)}
                    placeholder="Describe your objective..."
                    className="w-full h-24 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-xs font-medium outline-none focus:ring-4 focus:ring-emerald-500/10"
                  />
                  <button 
                    onClick={architectMission}
                    disabled={isThinking || !goal.trim()}
                    className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-emerald-500 disabled:opacity-50"
                  >
                    {isThinking ? 'Architecting Roadmap...' : 'Generate Success Path'}
                  </button>
               </div>
             ) : (
               <div className="space-y-6 animate-in fade-in duration-500">
                  <div className="flex justify-between items-end">
                     <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Active Mission</p>
                     <p className="text-[10px] font-black">{Math.round(activeMission.progress)}%</p>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                     <div className="h-full bg-emerald-500 transition-all duration-700" style={{ width: `${activeMission.progress}%` }}></div>
                  </div>

                  <div className="space-y-3">
                     {activeMission.steps.map((step, i) => (
                       <div key={i} className={`p-4 rounded-2xl border transition-all ${step.isComplete ? 'bg-emerald-50 border-emerald-100 opacity-60' : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800'}`}>
                          <div className="flex items-start gap-3">
                             <input 
                              type="checkbox" 
                              checked={step.isComplete} 
                              onChange={() => toggleStep(i)}
                              className="mt-1 w-4 h-4 rounded border-emerald-300 text-emerald-600 focus:ring-emerald-500" 
                             />
                             <div>
                                <p className={`text-xs font-bold ${step.isComplete ? 'line-through text-slate-400' : 'text-slate-700 dark:text-slate-200'}`}>{step.task}</p>
                                <button 
                                  onClick={() => onNavigate(step.tabId)}
                                  className="text-[9px] font-black text-emerald-600 uppercase mt-2 hover:underline"
                                >
                                  Go to {step.tabId} tab →
                                </button>
                             </div>
                          </div>
                       </div>
                     ))}
                  </div>

                  <button 
                    onClick={() => setActiveMission(null)}
                    className="w-full py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest hover:text-rose-500"
                  >
                    Abort Mission & New Goal
                  </button>
               </div>
             )}
          </div>
        </div>
      )}
    </>
  );
};

export default MissionOracle;
