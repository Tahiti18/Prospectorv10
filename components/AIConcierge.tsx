
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Chat } from "@google/genai";
import { Lead } from '../types';
import InfoButton from './InfoButton';

interface Message {
  role: 'user' | 'model';
  text: string;
}

interface AIConciergeProps {
  selectedLead: Lead | null;
}

const AIConcierge: React.FC<AIConciergeProps> = ({ selectedLead }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Welcome to the Executive Concierge. I am your dedicated support agent for building multi-step booking funnels and troubleshooting high-ticket outreach missions.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatRef = useRef<Chat | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const initChat = () => {
    if (!chatRef.current) {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const contextPrompt = selectedLead 
        ? `You are currently supporting the user with the lead: ${selectedLead.businessName} (${selectedLead.niche} in ${selectedLead.city}). They have a ${selectedLead.socialGap}.`
        : "No specific lead is currently selected, but you are ready to assist with general agency troubleshooting.";

      chatRef.current = ai.chats.create({
        model: 'gemini-3-pro-preview',
        config: {
          systemInstruction: `You are the Lead Intelligence Concierge. You are a world-class support agent for high-ticket marketing agencies.
          Tasks:
          1. Multi-step Bookings: Guide users through designing complex booking funnels.
          2. Troubleshooting: Help users solve outreach blocks (e.g., "They haven't replied to my third email").
          3. Technical Support: Explain how to use the app's AI features (Voice, Visual Studio, Veo).
          4. Memory: You remember previous steps in the conversation to maintain a cohesive support experience.
          
          Tone: Calm, professional, helpful, and strategic.
          Context: ${contextPrompt}`,
        },
      });
    }
  };

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || input;
    if (!textToSend.trim() || isLoading) return;

    if (!customText) setInput('');
    setMessages(prev => [...prev, { role: 'user', text: textToSend }]);
    setIsLoading(true);

    try {
      if (!chatRef.current) initChat();
      const result = await chatRef.current!.sendMessage({ message: textToSend });
      setMessages(prev => [...prev, { role: 'model', text: result.text || 'I encountered an issue processing that step.' }]);
    } catch (error) {
      console.error('Concierge error:', error);
      setMessages(prev => [...prev, { role: 'model', text: 'Connectivity lost. Please check your network and mission parameters.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const workflowTemplates = [
    { label: "Design Booking Funnel", prompt: "I want to design a multi-step booking funnel for my current lead. Let's start with the first touchpoint." },
    { label: "Troubleshoot No-Replies", prompt: "I've sent two emails to this lead and haven't heard back. What's the best high-pressure/high-value follow-up?" },
    { label: "Technical Onboarding", prompt: "Explain how I should best use the Nano Banana Visual Studio to impress a high-ticket real estate client." }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 leading-none uppercase tracking-tighter italic flex items-center">
            <span className="text-indigo-600 mr-2">Executive</span> AI Concierge
            <InfoButton id="concierge" />
          </h2>
          <p className="text-slate-500 text-sm mt-2 font-medium">Your dedicated agent for multi-step mission planning and agency support.</p>
        </div>
        {selectedLead && (
          <div className="px-4 py-2 bg-indigo-600 rounded-2xl flex items-center gap-3 shadow-lg shadow-indigo-200">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center text-white font-black text-xs">
              {selectedLead.rank}
            </div>
            <div>
              <p className="text-[10px] font-black text-white/70 uppercase leading-none">Active Context</p>
              <p className="text-xs font-black text-white uppercase mt-0.5 truncate max-w-[150px]">{selectedLead.businessName}</p>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Support Menu */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xl space-y-6">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Active Workflows</h4>
            <div className="space-y-3">
              {workflowTemplates.map(wf => (
                <button 
                  key={wf.label}
                  onClick={() => handleSendMessage(wf.prompt)}
                  className="w-full text-left p-4 rounded-2xl text-[11px] font-black text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 border border-slate-100 hover:border-indigo-200 transition-all flex items-center justify-between group"
                >
                  <span className="uppercase tracking-wider">{wf.label}</span>
                  <svg className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 p-8 rounded-3xl text-white shadow-2xl space-y-4">
             <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center mb-4">
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
             </div>
             <h4 className="text-sm font-black uppercase italic tracking-tighter">Memory Mode: Enabled</h4>
             <p className="text-[10px] font-medium text-slate-400 leading-relaxed uppercase tracking-widest">The concierge maintains a persistent chat session to help you finalize multi-day outreach projects and troubleshooting loops.</p>
          </div>
        </div>

        {/* Chat Interface */}
        <div className="lg:col-span-8">
          <div className="bg-white rounded-[3rem] border border-slate-200 shadow-2xl h-[700px] flex flex-col overflow-hidden relative">
            {/* Context Awareness Bar */}
            <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
               <div className="flex items-center gap-3">
                 <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                 <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Agent Online & Context-Aware</span>
               </div>
               <button 
                 onClick={() => { setMessages([]); chatRef.current = null; }}
                 className="text-[10px] font-black text-slate-400 hover:text-red-500 uppercase tracking-widest transition-colors"
               >
                 Reset Session
               </button>
            </div>

            {/* Message Stream */}
            <div ref={scrollRef} className="flex-1 p-8 overflow-y-auto space-y-6">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
                  <div className={`max-w-[80%] p-5 rounded-[2rem] text-sm leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-slate-100 text-slate-900 rounded-tr-none' 
                      : 'bg-indigo-600 text-white rounded-tl-none shadow-xl'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-slate-100 p-4 rounded-3xl rounded-tl-none flex gap-1.5 items-center">
                    <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                  </div>
                </div>
              )}
            </div>

            {/* Control Bar */}
            <div className="p-8 bg-white border-t border-slate-100">
              <div className="flex gap-4">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask for support, troubleshooting, or design a workflow..."
                  className="flex-1 px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all shadow-inner"
                />
                <button 
                  onClick={() => handleSendMessage()}
                  disabled={isLoading || !input.trim()}
                  className="p-4 bg-slate-900 text-white rounded-2xl hover:bg-slate-800 transition-all active:scale-90 shadow-lg disabled:opacity-50"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 19l9-2-9-18-9 18 9-2zm0 0v-8" /></svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIConcierge;
