
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Modality } from "@google/genai";
import { decodeBase64, decodeRawPcm } from '../utils/audioUtils';

export type VoiceName = 'Zephyr' | 'Puck' | 'Charon' | 'Kore' | 'Fenrir';

interface TTSAssistantProps {
  text: string;
  autoPlay?: boolean;
  onStart?: () => void;
  onEnd?: () => void;
  label?: string;
  className?: string;
}

const TTSAssistant: React.FC<TTSAssistantProps> = ({ 
  text, 
  autoPlay = false, 
  onStart, 
  onEnd,
  label = "Listen",
  className = ""
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [loading, setLoading] = useState(false);
  const [voice, setVoice] = useState<VoiceName>('Zephyr');
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);

  const stopPlayback = () => {
    if (sourceRef.current) {
      sourceRef.current.stop();
      sourceRef.current = null;
    }
    setIsSpeaking(false);
  };

  const speak = async () => {
    if (isSpeaking) {
      stopPlayback();
      return;
    }

    if (!text) return;

    setLoading(true);
    if (onStart) onStart();

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: text.substring(0, 2000) }] }], // Limit length for TTS safety
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: voice },
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (!base64Audio) throw new Error("No audio data returned");

      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }

      const audioBuffer = await decodeRawPcm(
        decodeBase64(base64Audio),
        audioContextRef.current,
        24000,
        1
      );

      const source = audioContextRef.current.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContextRef.current.destination);
      
      source.onended = () => {
        setIsSpeaking(false);
        if (onEnd) onEnd();
      };

      sourceRef.current = source;
      source.start();
      setIsSpeaking(true);
    } catch (error) {
      console.error("TTS Error:", error);
      alert("Voice synthesis failed. Check your connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (autoPlay) speak();
    return () => stopPlayback();
  }, [autoPlay]);

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <button
        onClick={speak}
        disabled={loading}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm border ${
          isSpeaking 
            ? 'bg-indigo-600 text-white border-indigo-500 scale-105' 
            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
        }`}
      >
        {loading ? (
          <div className="w-3 h-3 border-2 border-slate-300 border-t-indigo-600 rounded-full animate-spin"></div>
        ) : isSpeaking ? (
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
        ) : (
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>
        )}
        {isSpeaking ? 'Stop Audio' : label}
      </button>

      {/* Voice Selection Dropdown */}
      <select 
        value={voice}
        onChange={(e) => setVoice(e.target.value as VoiceName)}
        className="bg-transparent text-[8px] font-bold text-slate-400 uppercase tracking-tighter outline-none cursor-pointer hover:text-indigo-600 transition-colors"
      >
        <option value="Zephyr">Zephyr (Exec)</option>
        <option value="Kore">Kore (Smooth)</option>
        <option value="Puck">Puck (Energetic)</option>
        <option value="Charon">Charon (Deep)</option>
        <option value="Fenrir">Fenrir (Classic)</option>
      </select>
    </div>
  );
};

export default TTSAssistant;
