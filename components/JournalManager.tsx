
import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  ThumbsUp, 
  ThumbsDown, 
  Sparkles, 
  Calendar, 
  MapPin, 
  Smile, 
  Frown, 
  Zap, 
  Coffee, 
  Ghost,
  X,
  Search,
  BookOpen,
  Filter,
  Check
} from 'lucide-react';
import { JournalEntry, Gig } from '../types';

interface JournalManagerProps {
  gigs: Gig[];
}

const INITIAL_JOURNAL: JournalEntry[] = [
  {
    id: 'j1',
    date: '2025-05-19',
    gigId: '1',
    mood: 'Inspired',
    theGood: 'The crowd connection was phenomenal during the peak hour. The new remix of "Solar Flare" landed perfectly.',
    theBad: 'Monitors were a bit muddy in the low end. Need to ask the sound engineer for a tighter sub-kick next time.',
    reflection: 'Techno in Colombo is evolving. Vibe Club is definitely the hub.'
  }
];

const JournalManager: React.FC<JournalManagerProps> = ({ gigs }) => {
  const [entries, setEntries] = useState<JournalEntry[]>(INITIAL_JOURNAL);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Form State
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [gigId, setGigId] = useState('');
  const [mood, setMood] = useState<JournalEntry['mood']>('Inspired');
  const [theGood, setTheGood] = useState('');
  const [theBad, setTheBad] = useState('');
  const [reflection, setReflection] = useState('');

  const handleAddEntry = (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry: JournalEntry = {
      id: Math.random().toString(36).substr(2, 9),
      date,
      gigId,
      mood,
      theGood,
      theBad,
      reflection
    };
    setEntries([newEntry, ...entries]);
    setIsModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setDate(new Date().toISOString().split('T')[0]);
    setGigId('');
    setMood('Inspired');
    setTheGood('');
    setTheBad('');
    setReflection('');
  };

  const deleteEntry = (id: string) => {
    setEntries(entries.filter(e => e.id !== id));
  };

  const filteredEntries = entries.filter(e => 
    e.theGood.toLowerCase().includes(searchTerm.toLowerCase()) || 
    e.theBad.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.reflection.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const moodIcons = {
    Energetic: <Zap className="w-4 h-4 text-amber-400" />,
    Exhausted: <Coffee className="w-4 h-4 text-blue-400" />,
    Inspired: <Sparkles className="w-4 h-4 text-purple-400" />,
    Frustrated: <Ghost className="w-4 h-4 text-red-400" />,
    Neutral: <Smile className="w-4 h-4 text-zinc-400" />
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
             <div className="w-12 h-12 rounded-[1.25rem] bg-zinc-900 flex items-center justify-center border border-zinc-800 shadow-2xl"><BookOpen className="w-6 h-6 text-purple-500" /></div>
             <h2 className="text-3xl font-black text-white font-syncopate uppercase tracking-tighter">Artist Journal</h2>
          </div>
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest ml-1">Documenting the journey, set by set</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="flex items-center justify-center gap-3 px-10 py-5 bg-gradient-to-tr from-purple-600 to-indigo-600 rounded-3xl text-xs font-black text-white hover:bg-purple-500 transition-all active:scale-95 shadow-[0_20px_40px_rgba(139,92,246,0.3)] uppercase tracking-widest">
          <Plus className="w-5 h-5" /> Write Entry
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600" />
          <input 
            type="text" 
            placeholder="Search reflections, highlights or challenges..." 
            className="w-full bg-zinc-900 border border-zinc-800 rounded-[1.75rem] py-5 pl-14 pr-6 text-sm text-white focus:ring-1 focus:ring-purple-500 outline-none shadow-2xl transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="flex items-center gap-2 px-6 py-5 bg-zinc-900 border border-zinc-800 rounded-[1.5rem] text-xs font-bold text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all shadow-xl">
          <Filter className="w-4 h-4" /> Filter By Mood
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredEntries.length > 0 ? filteredEntries.map(entry => {
          const gig = gigs.find(g => g.id === entry.gigId);
          return (
            <div key={entry.id} className="bg-zinc-900/40 border border-zinc-800 rounded-[2.5rem] p-8 space-y-8 hover:border-purple-500/30 transition-all shadow-2xl relative overflow-hidden group">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5" /> {new Date(entry.date).toLocaleDateString('en-US', { dateStyle: 'long' })}
                    </span>
                    <span className="px-3 py-1 bg-zinc-800 rounded-full border border-zinc-700 text-[9px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
                      {moodIcons[entry.mood]} {entry.mood}
                    </span>
                  </div>
                  {gig && (
                    <div className="flex items-center gap-2 text-purple-400 text-xs font-bold uppercase tracking-tight mt-2">
                      <MapPin className="w-3.5 h-3.5" /> {gig.venue}, {gig.city}
                    </div>
                  )}
                </div>
                <button onClick={() => deleteEntry(entry.id)} className="p-3 bg-zinc-800 hover:bg-red-500/10 rounded-2xl text-zinc-600 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"><Trash2 className="w-4 h-4" /></button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="p-5 bg-green-500/5 border border-green-500/10 rounded-[1.5rem] space-y-3">
                  <p className="text-[10px] font-black text-green-400 uppercase tracking-[0.2em] flex items-center gap-2">
                    <ThumbsUp className="w-3.5 h-3.5" /> The Good
                  </p>
                  <p className="text-xs text-zinc-300 leading-relaxed italic">"{entry.theGood}"</p>
                </div>
                <div className="p-5 bg-red-500/5 border border-red-500/10 rounded-[1.5rem] space-y-3">
                  <p className="text-[10px] font-black text-red-400 uppercase tracking-[0.2em] flex items-center gap-2">
                    <ThumbsDown className="w-3.5 h-3.5" /> The Bad
                  </p>
                  <p className="text-xs text-zinc-300 leading-relaxed italic">"{entry.theBad}"</p>
                </div>
              </div>

              <div className="p-6 bg-zinc-950/50 border border-zinc-800/50 rounded-[1.5rem] space-y-2">
                <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">General Reflection</p>
                <p className="text-sm font-medium text-white tracking-tight leading-relaxed">{entry.reflection}</p>
              </div>
            </div>
          );
        }) : (
          <div className="md:col-span-2 py-32 flex flex-col items-center justify-center border-2 border-dashed border-zinc-800 rounded-[3rem] bg-zinc-950/20">
            <BookOpen className="w-16 h-16 text-zinc-800 mb-6" />
            <p className="text-sm font-black text-zinc-600 uppercase tracking-widest">No Journal Entries Found</p>
            <p className="text-[10px] text-zinc-700 mt-2">Start documenting your performances and growth.</p>
          </div>
        )}
      </div>

      {/* Entry Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center bg-black/95 backdrop-blur-2xl">
          <div className="bg-[#0c0c0c] border-t md:border border-zinc-800 w-full max-w-2xl rounded-t-[3rem] md:rounded-[3.5rem] shadow-[0_-50px_100px_rgba(0,0,0,0.8)] flex flex-col max-h-[95dvh] animate-in slide-in-from-bottom-12 duration-500">
            <div className="p-10 flex items-center justify-between border-b border-zinc-900/50">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-[1.5rem] bg-purple-600/10 flex items-center justify-center border border-purple-500/20"><BookOpen className="w-6 h-6 text-purple-500" /></div>
                 <div>
                    <h3 className="text-2xl font-black text-white font-syncopate uppercase tracking-tighter">New Journal Entry</h3>
                    <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest mt-0.5">Capturing raw event insights</p>
                 </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-4 bg-zinc-900 rounded-2xl border border-zinc-800 text-zinc-500 hover:text-white transition-all"><X className="w-6 h-6" /></button>
            </div>
            
            <form onSubmit={handleAddEntry} className="flex-1 overflow-y-auto p-10 space-y-8 custom-scrollbar pb-32 md:pb-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Event Date</label>
                  <input required type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full bg-black border border-zinc-800 rounded-[1.5rem] px-6 py-4 text-zinc-300 outline-none focus:ring-1 focus:ring-purple-500 shadow-inner" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Associated Gig</label>
                  <select value={gigId} onChange={(e) => setGigId(e.target.value)} className="w-full bg-black border border-zinc-800 rounded-[1.5rem] px-6 py-4 text-zinc-300 outline-none focus:ring-1 focus:ring-purple-500 shadow-inner appearance-none">
                    <option value="">No Gig Linked</option>
                    {gigs.map(g => (
                      <option key={g.id} value={g.id}>{g.venue} ({g.date})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Current Vibe / Mood</label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                  {(['Inspired', 'Energetic', 'Neutral', 'Exhausted', 'Frustrated'] as const).map(m => (
                    <button 
                      key={m}
                      type="button"
                      onClick={() => setMood(m)}
                      className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all ${mood === m ? 'bg-purple-600/10 border-purple-500 text-white' : 'bg-black border-zinc-800 text-zinc-600 hover:border-zinc-700'}`}
                    >
                      {moodIcons[m]}
                      <span className="text-[9px] font-black uppercase">{m}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-green-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <ThumbsUp className="w-3.5 h-3.5" /> The Good
                  </label>
                  <textarea required value={theGood} onChange={(e) => setTheGood(e.target.value)} placeholder="What went well? Crowd reactions, track selections..." className="w-full bg-black border border-zinc-800 rounded-[1.5rem] px-6 py-4 text-zinc-300 min-h-[120px] outline-none focus:ring-1 focus:ring-purple-500 shadow-inner resize-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-red-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <ThumbsDown className="w-3.5 h-3.5" /> The Bad
                  </label>
                  <textarea required value={theBad} onChange={(e) => setTheBad(e.target.value)} placeholder="Technical issues, logistics, vibe killers..." className="w-full bg-black border border-zinc-800 rounded-[1.5rem] px-6 py-4 text-zinc-300 min-h-[120px] outline-none focus:ring-1 focus:ring-purple-500 shadow-inner resize-none" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Daily Reflection</label>
                <textarea required value={reflection} onChange={(e) => setReflection(e.target.value)} placeholder="Lessons learned, future set goals, general state of mind..." className="w-full bg-black border border-zinc-800 rounded-[1.5rem] px-6 py-4 text-zinc-300 min-h-[120px] outline-none focus:ring-1 focus:ring-purple-500 shadow-inner resize-none font-medium" />
              </div>
              
              <button type="submit" className="w-full py-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-[2rem] text-sm font-black uppercase tracking-[0.2em] shadow-2xl shadow-purple-600/30 transition-all active:scale-[0.98] mt-4 flex items-center justify-center gap-3">
                <Check className="w-5 h-5" /> Archive Entry
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default JournalManager;
