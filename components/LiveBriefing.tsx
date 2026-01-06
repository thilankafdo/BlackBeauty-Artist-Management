
import React, { useState, useRef } from 'react';
import { GoogleGenAI, Modality, LiveServerMessage } from '@google/genai';
import { Mic, X, Sparkles } from 'lucide-react';
import { Gig } from '../types';

interface LiveBriefingProps {
  onClose: () => void;
  gigs: Gig[];
}

const LiveBriefing: React.FC<LiveBriefingProps> = ({ onClose, gigs }) => {
  const [isActive, setIsActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const sessionRef = useRef<any>(null);

  const startBriefing = async () => {
    setIsConnecting(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      const inputContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
          onopen: () => {
            setIsActive(true);
            setIsConnecting(false);
            
            // Start input streaming
            const source = inputContext.createMediaStreamSource(stream);
            const processor = inputContext.createScriptProcessor(4096, 1, 1);
            
            processor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const int16 = new Int16Array(inputData.length);
              for (let i = 0; i < inputData.length; i++) {
                int16[i] = inputData[i] * 32768;
              }
              const base64 = btoa(String.fromCharCode(...new Uint8Array(int16.buffer)));
              sessionPromise.then(s => s.sendRealtimeInput({ 
                media: { data: base64, mimeType: 'audio/pcm;rate=16000' } 
              }));
            };
            
            source.connect(processor);
            processor.connect(inputContext.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            if (message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data) {
              const data = message.serverContent.modelTurn.parts[0].inlineData.data;
              const binary = atob(data);
              const bytes = new Uint8Array(binary.length);
              for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
              
              const ctx = audioContextRef.current!;
              const int16 = new Int16Array(bytes.buffer);
              const buffer = ctx.createBuffer(1, int16.length, 24000);
              const channelData = buffer.getChannelData(0);
              for (let i = 0; i < int16.length; i++) channelData[i] = int16[i] / 32768.0;
              
              const source = ctx.createBufferSource();
              source.buffer = buffer;
              source.connect(ctx.destination);
              
              const playTime = Math.max(nextStartTimeRef.current, ctx.currentTime);
              source.start(playTime);
              nextStartTimeRef.current = playTime + buffer.duration;
              sourcesRef.current.add(source);
            }
          },
          onclose: () => stopBriefing(),
          onerror: () => stopBriefing(),
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
          systemInstruction: `You are the Tour Chief of Staff for DJ Black Beauty. 
          The current schedule includes: ${JSON.stringify(gigs.map(g => `${g.venue} on ${g.date}`))}.
          Provide a concise, high-energy voice briefing. Focus on travel, set times, and logistics. 
          Be professional and supportive.`
        }
      });
      
      sessionRef.current = await sessionPromise;
    } catch (e) {
      console.error(e);
      stopBriefing();
    }
  };

  const stopBriefing = () => {
    setIsActive(false);
    setIsConnecting(false);
    sourcesRef.current.forEach(s => s.stop());
    sourcesRef.current.clear();
    if (audioContextRef.current) audioContextRef.current.close();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[300] bg-black/90 backdrop-blur-3xl flex items-center justify-center p-6 animate-in fade-in duration-500">
      <div className="bg-zinc-950 border border-zinc-800 w-full max-w-xl rounded-[4rem] p-12 relative overflow-hidden shadow-[0_0_100px_rgba(168,85,247,0.2)]">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
        
        <button onClick={stopBriefing} className="absolute top-8 right-8 p-4 bg-zinc-900 rounded-full text-zinc-500 hover:text-white transition-all">
          <X className="w-6 h-6" />
        </button>

        <div className="space-y-12 flex flex-col items-center text-center">
          <div className="relative">
            <div className={`w-32 h-32 rounded-[3rem] bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center shadow-2xl transition-all duration-700 ${isActive ? 'scale-110 shadow-purple-500/40 animate-pulse' : 'scale-100 shadow-zinc-900'}`}>
              <Mic className={`w-12 h-12 text-white transition-all ${isActive ? 'scale-110' : 'scale-100'}`} />
            </div>
            {isActive && (
              <div className="absolute inset-[-10px] rounded-[3.5rem] border border-purple-500/30 animate-ping"></div>
            )}
          </div>

          <div className="space-y-4">
            <h3 className="text-3xl font-black text-white font-syncopate uppercase tracking-tighter">
              {isConnecting ? 'Initializing Link...' : isActive ? 'Session Active' : 'Chief of Staff'}
            </h3>
            <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest max-w-xs mx-auto leading-relaxed">
              {isActive ? 'Talk to your tour agent about today\'s logistics and financials.' : 'Ready for your vocal tour briefing.'}
            </p>
          </div>

          {!isActive && !isConnecting && (
            <button 
              onClick={startBriefing}
              className="px-12 py-6 bg-white text-black rounded-3xl text-xs font-black uppercase tracking-[0.3em] hover:scale-105 active:scale-95 transition-all shadow-2xl flex items-center gap-4"
            >
              <Sparkles className="w-5 h-5" /> Start Live Briefing
            </button>
          )}

          {isConnecting && (
             <div className="flex gap-2">
                {[0, 1, 2].map(i => <div key={i} className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.2}s` }}></div>)}
             </div>
          )}

          {isActive && (
            <div className="w-full space-y-8 animate-in slide-in-from-bottom-4">
              <div className="flex justify-center gap-1 h-12 items-center">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="w-1.5 bg-purple-500 rounded-full animate-[pulse_1s_infinite]" style={{ height: `${Math.random() * 100}%`, animationDelay: `${i * 0.1}s` }}></div>
                ))}
              </div>
              <button 
                onClick={stopBriefing}
                className="px-10 py-5 bg-zinc-900 border border-zinc-800 text-zinc-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:text-red-400 hover:border-red-500/20 transition-all"
              >
                Close Connection
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LiveBriefing;
