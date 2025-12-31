
import React, { useState, useEffect } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import InfoButton from './InfoButton';

interface OSForgeProps {
  isDarkMode: boolean;
}

const OSForge: React.FC<OSForgeProps> = ({ isDarkMode }) => {
  const [instruction, setInstruction] = useState('');
  const [isArchitecting, setIsArchitecting] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
  const [status, setStatus] = useState('Neural Forge Standby');
  const [activeFile, setActiveFile] = useState('App.tsx');

  const PROJECT_FILES = [
    'App.tsx', 'index.tsx', 'types.ts', 'constants.tsx', 
    'components/Dashboard.tsx', 'components/LeadTable.tsx', 
    'components/OSForge.tsx'
  ];

  const commenceEvolution = async () => {
    if (!instruction.trim()) return;
    setIsArchitecting(true);
    setStatus('Ingesting System Anatomy...');
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `You are the SELF-ARCHITECT logic node of the Prospector OS. 
        The current project structure is: ${PROJECT_FILES.join(', ')}.
        
        USER GOAL: ${instruction}
        TARGET FILE: ${activeFile}
        
        Your task is to write the updated Typescript/React code for the target file to satisfy the user goal. 
        Maintain the high-fidelity, cyber-sophisticated aesthetic of the current OS. 
        Provide the FULL code for the file within a single code block.
        Include technical comments on how to "hot-swap" this into the project.`,
        config: {
          thinkingConfig: { thinkingBudget: 8000 }
        }
      });

      setGeneratedCode(response.text || 'Synthesis failed.');
      setStatus('Evolution Blueprint Secured.');
    } catch (e: any) {
      console.error(e);
      setStatus(`System Error: ${e.message}`);
    } finally {
      setIsArchitecting(false);
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(generatedCode);
    alert('Blueprints copied to Clipboard. Ready for manual commit.');
  };

  const downloadDeploymentScript = () => {
    const script = `
# Prospector OS Evolution Script
# Run this to apply the AI-generated changes to your project.
cat <<EOF > ./${activeFile}
${generatedCode}
EOF
echo "Evolution successful: ${activeFile} has been mutated."
    `;
    const blob = new Blob([script], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `evolve_${activeFile.replace('/', '_')}.sh`;
    link.click();
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h2 className={`text-4xl font-black italic uppercase tracking-tighter ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
             OS <span className="text-indigo-500">Forge</span>
           </h2>
           <p className="text-slate-500 text-sm mt-2 font-medium uppercase tracking-widest">Metacognitive Development & Self-Mutation Lab</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-slate-900 rounded-full text-white border border-indigo-500/20 shadow-2xl">
           <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse shadow-[0_0_10px_#6366f1]"></span>
           <span className="text-[10px] font-black uppercase tracking-[0.2em]">Self-Awareness Loop: ACTIVE</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Architect Input */}
        <div className="lg:col-span-4 space-y-6">
           <div className={`p-8 rounded-[3rem] border shadow-2xl space-y-8 relative overflow-hidden ${isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl"></div>
              
              <div className="space-y-4">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Target Module for Mutation</label>
                 <select 
                   value={activeFile}
                   onChange={e => setActiveFile(e.target.value)}
                   className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-3 text-xs font-bold outline-none focus:ring-4 focus:ring-indigo-500/10"
                 >
                    {PROJECT_FILES.map(f => <option key={f} value={f}>{f}</option>)}
                 </select>
              </div>

              <div className="space-y-4">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mutation Command</label>
                 <textarea 
                   value={instruction}
                   onChange={e => setInstruction(e.target.value)}
                   placeholder="Describe how the OS should evolve..."
                   className="w-full h-48 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 text-sm font-medium outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all resize-none shadow-inner"
                 />
                 <div className="flex flex-wrap gap-2">
                    {['Add Dark Mode Toggle', 'New Analytics View', 'Optimize Latency', 'Futuristic Font'].map(p => (
                      <button key={p} onClick={() => setInstruction(p)} className="text-[8px] font-black uppercase border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-lg hover:bg-indigo-500 hover:text-white transition-all">{p}</button>
                    ))}
                 </div>
              </div>

              <button 
                onClick={commenceEvolution}
                disabled={isArchitecting || !instruction.trim()}
                className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.4em] shadow-xl hover:bg-indigo-500 transition-all active:scale-95 disabled:opacity-30 border-b-4 border-indigo-900"
              >
                {isArchitecting ? 'Architecting Evolution...' : 'Commence Self-Mutation'}
              </button>
           </div>

           <div className="p-8 rounded-[2.5rem] bg-slate-950 text-white shadow-2xl border border-white/5 space-y-4">
              <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest italic border-b border-white/5 pb-2">The AI Deployment Paradox</h4>
              <p className="text-[10px] text-slate-400 leading-relaxed uppercase font-medium">As a browser application, I cannot directly write to your file system. I provide the "hand" (the code) and the "tool" (the shell script). You must be the "consciousness" that executes the update.</p>
           </div>
        </div>

        {/* Code View */}
        <div className="lg:col-span-8">
           <div className={`rounded-[4rem] border shadow-2xl min-h-[700px] flex flex-col overflow-hidden relative ${isDarkMode ? 'bg-[#020617] border-slate-800' : 'bg-white border-slate-100'}`}>
              <div className="p-8 border-b border-white/5 flex justify-between items-center bg-slate-900 text-white">
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-xl">🛠️</div>
                    <div>
                       <h3 className="text-sm font-black uppercase tracking-widest italic">Mutation Blueprint</h3>
                       <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Status: {status}</p>
                    </div>
                 </div>
                 {generatedCode && (
                    <div className="flex gap-4">
                       <button onClick={copyCode} className="px-5 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all">Copy Blueprints</button>
                       <button onClick={downloadDeploymentScript} className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all shadow-lg">Download .sh Patch</button>
                    </div>
                 )}
              </div>

              <div className="flex-1 overflow-auto p-8 font-mono text-[11px] leading-relaxed relative group">
                 {isArchitecting ? (
                   <div className="h-full flex flex-col items-center justify-center space-y-8 animate-pulse">
                      <div className="w-24 h-24 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
                      <p className="text-indigo-500 font-black uppercase tracking-[0.5em] text-sm italic">Synthesizing Self-Code...</p>
                   </div>
                 ) : generatedCode ? (
                   <pre className={`p-8 rounded-3xl ${isDarkMode ? 'bg-slate-950 text-indigo-400' : 'bg-slate-50 text-slate-700'} border border-white/5 shadow-inner animate-in fade-in zoom-in-95 duration-500`}>
                      {generatedCode}
                   </pre>
                 ) : (
                   <div className="h-full flex flex-col items-center justify-center opacity-10 space-y-6">
                      <div className="text-9xl">🧠</div>
                      <p className="text-2xl font-black uppercase italic tracking-[0.4em]">Forge Idle</p>
                   </div>
                 )}
              </div>

              <div className="p-6 bg-slate-900/50 border-t border-white/5 flex items-center justify-between text-[9px] font-black text-slate-500 uppercase tracking-widest">
                 <span>Architecture: Multi-Modal React v19</span>
                 <span>Version: EVO_0.1.A</span>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default OSForge;
