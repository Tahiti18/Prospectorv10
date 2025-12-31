
import React, { useState } from 'react';
import { GoogleGenAI, Chat } from "@google/genai";
import { Lead, DemoConfig } from '../types';
import InfoButton from './InfoButton';

interface DemoSandboxProps {
  selectedLead: Lead | null;
  isDarkMode: boolean;
}

const DemoSandbox: React.FC<DemoSandboxProps> = ({ selectedLead, isDarkMode }) => {
  const [isBuilding, setIsBuilding] = useState(false);
  const [demoConfig, setDemoConfig] = useState<DemoConfig | null>(null);
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'model', text: string }[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chatRef, setChatRef] = useState<Chat | null>(null);

  const buildDemo = async () => {
    if (!selectedLead) return;
    setIsBuilding(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Architect a specialized "AI Concierge" demo persona for "${selectedLead.businessName}" in ${selectedLead.city}. 
        Return JSON object: {welcomeMessage, persona, knowledgeBase: string[]}. 
        Knowledge base should include 5 likely services/prices for a ${selectedLead.niche}.`,
        config: { responseMimeType: "application/json" }
      });
      const config = JSON.parse(response.text || "{}");
      setDemoConfig(config);
      setChatMessages([{ role: 'model', text: config.welcomeMessage }]);
      
      const newChat = ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: {
          systemInstruction: `You are the AI Concierge for ${selectedLead.businessName}. 
          Your persona: ${config.persona}. 
          Your knowledge: ${config.knowledgeBase.join('. ')}. 
          Be helpful, elite, and focused on booking appointments.`,
        }
      });
      setChatRef(newChat);
    } catch (e) {
      console.error(e);
    } finally {
      setIsBuilding(false);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || !chatRef) return;
    const userText = input;
    setInput('');
    setChatMessages(prev => [...prev, { role: 'user', text: userText }]);
    setIsTyping(true);
    try {
      const result = await chatRef.sendMessage({ message: userText });
      setChatMessages(prev => [...prev, { role: 'model', text: result.text || '' }]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsTyping(false);
    }
  };

  if (!selectedLead) return <div className="p-20 text-center opacity-30 italic font-black uppercase tracking-[0.5em]">Sandbox Offline</div>;

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h2 className={`text-2xl font-black italic uppercase tracking-tighter ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>The Deliverable Sandbox</h2>
           <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Simulate Final Client Experience</p>
        </div>
        {!demoConfig && (
          <button 
            onClick={buildDemo}
            disabled={isBuilding}
            className="bg-indigo-600 text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-indigo-500 transition-all"
          >
            {isBuilding ? 'Synthesizing Sandbox...' : 'Initialize AI Demo'}
          </button>
        )}
      </div>

      {demoConfig ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
           <div className="lg:col-span-4 space-y-6">
              <div className={`p-8 rounded-[3rem] border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-xl`}>
                 <h4 className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-6 italic">Persona Blueprint</h4>
                 <p className="text-sm font-bold text-slate-500 italic leading-relaxed uppercase tracking-tight">"{demoConfig.persona}"</p>
                 <div className="mt-8 space-y-3">
                    {demoConfig.knowledgeBase.map((item, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                         <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></div>
                         <span className="text-[10px] font-black uppercase text-slate-400 truncate">{item}</span>
                      </div>
                    ))}
                 </div>
              </div>
              <button 
                onClick={() => setDemoConfig(null)}
                className="w-full py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest hover:text-rose-500 transition-colors"
              >
                Destroy Sandbox & Re-Initialize
              </button>
           </div>

           <div className="lg:col-span-8">
              <div className={`rounded-[3.5rem] border overflow-hidden flex flex-col h-[600px] shadow-2xl ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-100'}`}>
                 <div className="p-6 bg-slate-900 text-white flex justify-between items-center">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center rotate-3 border border-indigo-400/30">AI</div>
                       <div>
                          <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Preview Mode</p>
                          <p className="text-xs font-black uppercase tracking-tighter italic">Concierge: {selectedLead.businessName}</p>
                       </div>
                    </div>
                 </div>

                 <div className="flex-1 overflow-y-auto p-8 space-y-6 scroll-smooth">
                    {chatMessages.map((m, i) => (
                      <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
                        <div className={`max-w-[75%] p-5 rounded-3xl text-sm font-medium leading-relaxed ${
                          m.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-slate-100 text-slate-700 rounded-tl-none border border-slate-200 shadow-sm'
                        }`}>
                          {m.text}
                        </div>
                      </div>
                    ))}
                    {isTyping && (
                       <div className="flex justify-start">
                          <div className="bg-slate-50 border border-slate-100 px-4 py-3 rounded-full flex gap-1">
                             <div className="w-1 h-1 bg-indigo-500 rounded-full animate-bounce"></div>
                             <div className="w-1 h-1 bg-indigo-500 rounded-full animate-bounce delay-75"></div>
                             <div className="w-1 h-1 bg-indigo-500 rounded-full animate-bounce delay-150"></div>
                          </div>
                       </div>
                    )}
                 </div>

                 <div className="p-8 bg-slate-50/50 border-t border-slate-100">
                    <div className="flex gap-4">
                       <input 
                        type="text" 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                        placeholder="Test the AI Receptionist..."
                        className="flex-1 px-6 py-4 bg-white border border-slate-200 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-indigo-500/10 shadow-inner"
                       />
                       <button 
                        onClick={sendMessage}
                        className="p-4 bg-slate-900 text-white rounded-2xl hover:bg-indigo-600 transition-all"
                       >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 19l9-2-9-18-9 18 9-2zm0 0v-8" /></svg>
                       </button>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      ) : (
        <div className="h-[500px] flex flex-col items-center justify-center opacity-10">
           <svg className="w-32 h-32 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M11 4a2 2 0 114 0v1a2 2 0 002 2h3a2 2 0 012 2v3a2 2 0 002 2h1a2 2 0 110 4h-1a2 2 0 00-2 2v3a2 2 0 01-2 2h-3a2 2 0 00-2 2v1a2 2 0 11-4 0v-1a2 2 0 00-2-2H7a2 2 0 01-2-2v-3a2 2 0 00-2-2H4a2 2 0 110-4h1a2 2 0 002-2V7a2 2 0 012-2h3a2 2 0 002-2V4z" /></svg>
           <p className="text-2xl font-black uppercase tracking-widest italic">Awaiting Logic Block</p>
        </div>
      )}
    </div>
  );
};

export default DemoSandbox;
