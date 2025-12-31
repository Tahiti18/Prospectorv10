
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Chat } from "@google/genai";
import { Lead, RegionConfig } from '../types';
import TTSAssistant from './TTSAssistant';

interface Message {
  role: 'user' | 'model';
  text: string;
}

interface ChatBotProps {
  selectedLead: Lead | null;
  currentRegion: RegionConfig;
}

const ChatBot: React.FC<ChatBotProps> = ({ selectedLead, currentRegion }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: `Hello! I am your ${currentRegion.country} Lead Intelligence Assistant. How can I help you with your prospecting today?` }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [voiceActive, setVoiceActive] = useState(false);
  
  const chatRef = useRef<Chat | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Update greeting if region changes while window is closed
  useEffect(() => {
    if (messages.length === 1 && messages[0].role === 'model') {
      setMessages([{ role: 'model', text: `Hello! I am your ${currentRegion.country} Lead Intelligence Assistant. How can I help you with your prospecting today?` }]);
    }
    // Force re-init on region change
    chatRef.current = null;
  }, [currentRegion]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const initChat = () => {
    if (!chatRef.current) {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const contextText = selectedLead 
        ? `The user is currently focused on ${selectedLead.businessName} (Rank: ${selectedLead.rank}) in ${selectedLead.city}.`
        : `No specific lead is currently selected. We are in the ${currentRegion.country} theater.`;

      chatRef.current = ai.chats.create({
        model: 'gemini-3-pro-preview',
        config: {
          systemInstruction: `You are the ${currentRegion.country} Lead Intelligence Assistant for Pomelli, an AI transformation agency. 
          Your goal is to help users find the best high-ticket leads in this region.
          Current Theater: ${currentRegion.country}. Tone required: ${currentRegion.tone}. Currency: ${currentRegion.currency}.
          Current Context: ${contextText}
          Advise on digital transformation, AI booking systems, and automated content engines specific to the local culture.
          Be professional, ROI-focused, and knowledgeable about the ${currentRegion.country} market.
          Encourage the user to use the "AI Video Pitch" and "AI Strategist" features for specific leads.`,
        },
      });
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      if (!chatRef.current) initChat();
      const result = await chatRef.current!.sendMessage({ message: userMessage });
      const responseText = result.text;
      setMessages(prev => [...prev, { role: 'model', text: responseText || 'I am sorry, I could not process that.' }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { role: 'model', text: 'An error occurred. Please check your connection and try again.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) initChat();
        }}
        className="fixed bottom-16 right-6 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-indigo-700 transition-all z-50 transform hover:scale-110 active:scale-95 border-4 border-white"
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
        ) : (
          <div className="relative">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
            {selectedLead && <div className="absolute -top-4 -right-4 w-5 h-5 bg-emerald-500 border-2 border-white rounded-full animate-pulse"></div>}
          </div>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-32 right-6 w-80 md:w-96 h-[500px] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden z-50 animate-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="bg-slate-900 p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-widest leading-none">Intelligence AI</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 truncate max-w-[120px]">
                  {selectedLead ? `Target: ${selectedLead.businessName}` : `Theater: ${currentRegion.country}`}
                </p>
              </div>
            </div>
            
            <button 
              onClick={() => setVoiceActive(!voiceActive)}
              className={`p-2 rounded-xl transition-all ${voiceActive ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-800 text-slate-400'}`}
              title="Toggle Voice Output"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/><path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/></svg>
            </button>
          </div>

          {/* Messages Container */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
            {messages.map((msg, i) => (
              <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-indigo-600 text-white rounded-tr-none' 
                    : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none shadow-sm'
                }`}>
                  {msg.text}
                </div>
                {msg.role === 'model' && voiceActive && i === messages.length - 1 && (
                  <TTSAssistant 
                    text={msg.text} 
                    autoPlay={true}
                    className="mt-2"
                    label="Replay"
                  />
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-tl-none shadow-sm flex gap-1">
                  <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-slate-100">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder={`Ask about ${currentRegion.country} leads...`}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
              <button
                onClick={sendMessage}
                disabled={isLoading}
                className="bg-indigo-600 text-white p-2 rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9-2-9-18-9 18 9-2zm0 0v-8" /></svg>
              </button>
            </div>
            <p className="text-[9px] text-center text-slate-400 font-bold uppercase mt-3 tracking-widest">Powered by Gemini 3 Pro + Flash TTS</p>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;
