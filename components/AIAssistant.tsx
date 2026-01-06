
import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  BrainCircuit, 
  Bot, 
  User, 
  Loader2, 
  CheckCircle, 
  ExternalLink,
  MapPin,
  X
} from 'lucide-react';
import { geminiService } from '../services/geminiService';
import { ViewState } from '../types';

interface BookingData {
  venue: string;
  city: string;
  date: string;
  startTime?: string;
  endTime?: string;
  fee: number;
  currency: string;
  notes?: string;
  status: 'Confirmed' | 'Pending' | 'Canceled';
}

interface Message {
  role: 'user' | 'assistant';
  content?: string;
  booking?: BookingData;
}

interface AIAssistantProps {
  onBookingCreated: (booking: BookingData) => void;
  onNavigate: (view: ViewState) => void;
  onClose?: () => void;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ onBookingCreated, onNavigate, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hey Manager! I'm DJ Black Beauty's digital booking agent. Operative in LKR and global currencies. Tell me about a gig. Example: 'Book Vibe Club Colombo for 150k LKR on May 18th'." }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await geminiService.chatWithManager(userMessage);
      
      if (response.functionCalls && response.functionCalls.length > 0) {
        for (const fc of response.functionCalls) {
          if (fc.name === 'create_booking') {
            const args = fc.args as any;
            const booking: BookingData = {
              ...args,
              status: args.status || 'Pending'
            };
            onBookingCreated(booking);
            
            setMessages(prev => [...prev, { 
              role: 'assistant', 
              content: `Gig at ${booking.venue} has been added to the master tour calendar in ${booking.currency}. Details below:`,
              booking: booking
            }]);
          }
        }
      } else if (response.text) {
        setMessages(prev => [...prev, { role: 'assistant', content: response.text }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Patchy connection... Try again?" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-zinc-950 border border-zinc-800 rounded-[2rem] overflow-hidden shadow-2xl ring-1 ring-white/10">
      <div className="px-5 py-4 bg-zinc-950 border-b border-zinc-900 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-600/20">
            <BrainCircuit className="text-white w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-sm text-white uppercase tracking-tight">AI Agent</h2>
            <div className="flex items-center gap-1 text-[8px] text-green-400 font-black uppercase tracking-[0.2em]">
              <span className="w-1 h-1 rounded-full bg-green-400 animate-pulse"></span>
              Synchronized
            </div>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-2 hover:bg-zinc-900 rounded-full transition-colors text-zinc-500">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-5 scroll-smooth custom-scrollbar bg-black/60"
      >
        {messages.map((msg, i) => (
          <div 
            key={i} 
            className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center shadow-md ${
              msg.role === 'user' ? 'bg-zinc-800' : 'bg-purple-600'
            }`}>
              {msg.role === 'user' ? <User className="w-3.5 h-3.5 text-zinc-400" /> : <Bot className="w-3.5 h-3.5 text-white" />}
            </div>
            <div className={`max-w-[85%] space-y-3 ${msg.role === 'user' ? 'text-right' : ''}`}>
              {msg.content && (
                <div className={`p-3.5 rounded-2xl text-[12px] leading-snug shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-purple-600 border border-purple-500 text-white rounded-tr-none' 
                    : 'bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 text-zinc-300 rounded-tl-none text-left'
                }`}>
                  {msg.content}
                </div>
              )}
              
              {msg.booking && (
                <div className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl animate-in slide-in-from-top-2 duration-300 ring-1 ring-white/5 text-left">
                  <div className="bg-green-500/10 px-4 py-2 border-b border-green-500/20 flex items-center justify-between">
                    <span className="text-[9px] font-black text-green-400 uppercase tracking-widest">GIG DRAFTED</span>
                    <CheckCircle className="w-3 h-3 text-green-400" />
                  </div>
                  <div className="p-4 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-zinc-900 rounded-xl text-zinc-400 border border-zinc-800">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-white truncate">{msg.booking.venue}</p>
                        <p className="text-[9px] text-zinc-500 uppercase font-black">{msg.booking.city}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 pt-3 border-t border-zinc-900">
                      <div className="space-y-0.5">
                        <p className="text-[8px] text-zinc-600 font-black uppercase">Schedule</p>
                        <p className="text-[10px] text-zinc-300 font-bold">{msg.booking.date}</p>
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-[8px] text-zinc-600 font-black uppercase">Settlement</p>
                        <p className="text-[10px] text-white font-bold font-syncopate">
                          {msg.booking.currency} {msg.booking.fee.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <button 
                      onClick={() => onNavigate('gigs')}
                      className="w-full flex items-center justify-center gap-2 py-3 bg-zinc-900/80 hover:bg-zinc-800 rounded-xl text-[9px] font-black uppercase tracking-widest text-zinc-300 transition-all border border-zinc-800"
                    >
                      Calendar <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-purple-600 flex items-center justify-center">
              <Bot className="w-3.5 h-3.5 text-white" />
            </div>
            <div className="bg-zinc-900 border border-zinc-800 p-3.5 rounded-2xl rounded-tl-none">
              <Loader2 className="w-4 h-4 text-purple-400 animate-spin" />
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-zinc-950 border-t border-zinc-900 shrink-0">
        <div className="relative flex items-center gap-2 w-full">
          <input 
            type="text" 
            placeholder="Book show at..."
            className="flex-1 bg-zinc-900 border border-zinc-800 rounded-2xl py-3.5 pl-4 pr-12 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500/50 text-white placeholder:text-zinc-600 shadow-inner"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="absolute right-2 p-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 disabled:bg-zinc-800 transition-all active:scale-90 shadow-lg shadow-purple-600/20"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
