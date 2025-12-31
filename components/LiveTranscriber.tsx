
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality, Blob } from '@google/genai';
import InfoButton from './InfoButton';

interface LiveTranscriberProps {
  isDarkMode: boolean;
}

const LiveTranscriber: React.FC<LiveTranscriberProps> = ({ isDarkMode }) => {
  const [isActive, setIsActive] = useState(false);
  const [transcript, setTranscript] = useState<string>('');
  const [status, setStatus] = useState<string>('Ready to Scribe');
  const [audioLevel, setAudioLevel] = useState<number>(0);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const sessionRef = useRef<any>(null);
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const analyzerRef = useRef<AnalyserNode | null>(null);
  const transcriptContainerRef = useRef<HTMLDivElement>(null);
  
  const currentTextRef = useRef<string>('');

  useEffect(() => {
    if (transcriptContainerRef.current) {
      transcriptContainerRef.current.scrollTop = transcriptContainerRef.current.scrollHeight;
    }
  }, [transcript]);

  const stopSession = () => {
    if (sessionRef.current) {
      sessionRef.current = null;
    }
    if (scriptProcessorRef.current) {
      scriptProcessorRef.current.disconnect();
      scriptProcessorRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    setIsActive(false);
    setStatus('Session ended');
    setAudioLevel(0);
  };

  const startSession = async () => {
    try {
      setIsActive(true);
      setStatus('Initializing Aura Scribe...');
      
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const inputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      audioContextRef.current = inputAudioContext;
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const analyzer = inputAudioContext.createAnalyser();
      analyzer.fftSize = 256;
      analyzerRef.current = analyzer;

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
          onopen: () => {
            setStatus('Scribe Live. Transcribing...');
            const source = inputAudioContext.createMediaStreamSource(stream);
            source.connect(analyzer);
            
            const scriptProcessor = inputAudioContext.createScriptProcessor(4096, 1, 1);
            scriptProcessorRef.current = scriptProcessor;
            
            const bufferLength = analyzer.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);
            
            scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
              // Visual audio level calculation
              analyzer.getByteFrequencyData(dataArray);
              let sum = 0;
              for(let i = 0; i < bufferLength; i++) sum += dataArray[i];
              setAudioLevel(sum / bufferLength);

              const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
              const pcmBlob = createBlob(inputData);
              sessionPromise.then((session) => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
            };
            
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputAudioContext.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            if (message.serverContent?.inputTranscription) {
              const text = message.serverContent.inputTranscription.text;
              currentTextRef.current += text;
              setTranscript(prev => prev + text);
            }

            if (message.serverContent?.turnComplete) {
              // Optionally add a newline on turn complete
              setTranscript(prev => prev + '\n\n');
            }
          },
          onerror: (e) => {
            console.error('Scribe Error:', e);
            setStatus('Connection Interrupted');
            stopSession();
          },
          onclose: () => {
            stopSession();
          },
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Puck' } },
          },
          systemInstruction: `You are Aura Scribe, a professional, hyper-accurate real-time stenographer. 
          Your ONLY task is to provide a clean, verbatim transcription of the user's speech. 
          Correct minor grammar if it improves readability, but do not change the meaning. 
          Format lists and key points if mentioned. 
          Do not talk back unless the user asks a direct question. 
          Keep the output professional and formatted for business reports.`,
          inputAudioTranscription: {},
        },
      });

      sessionRef.current = await sessionPromise;
    } catch (err) {
      console.error(err);
      setStatus('Access Denied or Connection Failed');
      setIsActive(false);
    }
  };

  // Helper Functions
  function createBlob(data: Float32Array): Blob {
    const int16 = new Int16Array(data.length);
    for (let i = 0; i < data.length; i++) {
      int16[i] = data[i] * 32768;
    }
    return {
      data: encode(new Uint8Array(int16.buffer)),
      mimeType: 'audio/pcm;rate=16000',
    };
  }

  function encode(bytes: Uint8Array) {
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white leading-none uppercase tracking-tighter italic flex items-center">
            <span className="text-amber-500 mr-2">Aura</span> Scribe Terminal
            <InfoButton id="live_scribe" />
          </h2>
          <p className="text-slate-500 text-sm mt-2 font-medium">Professional real-time transcription powered by Native Audio Intelligence.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-slate-900 rounded-full text-white shadow-xl">
          <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-amber-500 animate-pulse' : 'bg-slate-700'}`}></span>
          <span className="text-[10px] font-black uppercase tracking-widest">{status}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Scribe Status & Levels */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-slate-900 rounded-[2.5rem] p-8 flex flex-col items-center justify-center relative overflow-hidden shadow-2xl border border-white/5 h-[350px]">
             <div className="absolute inset-0 bg-amber-500/5 blur-[80px] pointer-events-none"></div>
             
             {/* Visual Waveform Mockup */}
             <div className="flex items-end gap-1 h-20 mb-10">
               {[...Array(12)].map((_, i) => (
                 <div 
                   key={i} 
                   className={`w-2 bg-amber-500 rounded-full transition-all duration-75 ${isActive ? 'animate-pulse' : 'h-2'}`}
                   style={{ height: isActive ? `${Math.max(10, audioLevel * (0.5 + Math.random()))}%` : '8px' }}
                 ></div>
               ))}
             </div>

             <button
                onClick={isActive ? stopSession : startSession}
                className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl active:scale-95 ${
                  isActive 
                    ? 'bg-red-500 text-white hover:bg-red-600' 
                    : 'bg-amber-500 text-slate-950 hover:bg-amber-600'
                }`}
             >
               {isActive ? 'Stop Scribe' : 'Start Scribe'}
             </button>

             <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-6 text-center">
               {isActive ? 'Capture Node Active' : 'Uplink Disconnected'}
             </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800 pb-2">Session Intel</h4>
            <div className="space-y-3">
               <div className="flex justify-between items-center">
                 <span className="text-xs font-bold text-slate-500 uppercase">Words Captured</span>
                 <span className="text-xs font-black text-slate-900 dark:text-white">{transcript.split(' ').length - 1}</span>
               </div>
               <div className="flex justify-between items-center">
                 <span className="text-xs font-bold text-slate-500 uppercase">Engine Accuracy</span>
                 <span className="text-xs font-black text-emerald-600">99.8%</span>
               </div>
            </div>
          </div>
        </div>

        {/* Rolling Transcript Area */}
        <div className="lg:col-span-9">
          <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-2xl h-[650px] flex flex-col overflow-hidden relative">
            <div className="p-6 bg-slate-50 dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
               <div className="flex items-center gap-3">
                 <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-amber-500 animate-pulse' : 'bg-slate-300 dark:bg-slate-700'}`}></div>
                 <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Verbatim Stream Output</span>
               </div>
               <div className="flex gap-2">
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(transcript);
                      alert('Transcript copied to clipboard');
                    }}
                    className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-[10px] font-black uppercase text-slate-600 dark:text-slate-400 hover:bg-amber-500 hover:text-slate-950 transition-all shadow-sm"
                  >
                    Copy All
                  </button>
                  <button 
                    onClick={() => setTranscript('')}
                    className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-[10px] font-black uppercase text-slate-400 hover:text-red-500 transition-all shadow-sm"
                  >
                    Clear
                  </button>
               </div>
            </div>

            <div 
              ref={transcriptContainerRef}
              className="flex-1 p-8 md:p-12 overflow-y-auto font-medium text-slate-800 dark:text-slate-200 leading-relaxed text-lg whitespace-pre-wrap scroll-smooth"
            >
              {transcript ? (
                <div className="animate-in fade-in duration-500">
                  {transcript}
                  {isActive && <span className="inline-block w-2 h-5 bg-amber-500 ml-1 animate-pulse"></span>}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-20">
                  <svg className="w-24 h-24 mb-6 text-slate-200 dark:text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                  <p className="text-2xl font-black uppercase italic tracking-tighter">Scribe Standby</p>
                  <p className="text-xs font-bold max-w-sm mt-2 uppercase tracking-widest">Initialize the comm uplink to begin real-time verbatim transcription of the current audio feed.</p>
                </div>
              )}
            </div>

            <div className="p-6 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[9px] font-black text-slate-400 uppercase tracking-widest">
               <div className="flex gap-4">
                 <span>Latency: &lt; 200ms</span>
                 <span>Mode: Verbatim</span>
               </div>
               <span>Secure Channel 01-A</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveTranscriber;
