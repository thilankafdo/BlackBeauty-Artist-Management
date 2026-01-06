
import React, { useState } from 'react';
import { 
  TrendingUp, 
  Calendar, 
  PlayCircle,
  MapPin,
  Zap,
  Mail,
  Instagram,
  Twitter,
  ExternalLink,
  MessageSquare,
  PlusCircle,
  BookOpen,
  Receipt,
  FileText,
  Mic
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ViewState, AuthRole, Gig } from '../types';
import LiveBriefing from './LiveBriefing';

interface DashboardProps {
  onNavigate: (view: ViewState) => void;
  role: AuthRole;
  gigs: Gig[];
}

const data = [
  { name: 'Mon', streams: 4000 },
  { name: 'Tue', streams: 3000 },
  { name: 'Wed', streams: 5000 },
  { name: 'Thu', streams: 4780 },
  { name: 'Fri', streams: 6890 },
  { name: 'Sat', streams: 8390 },
  { name: 'Sun', streams: 7490 },
];

const FEEDS = [
  { id: 1, type: 'email', sender: 'Promoter: Ishara', subject: 'Vibe Club Technical Rider', time: '12m ago', read: false },
  { id: 2, type: 'instagram', sender: '@djblackbeauty', subject: 'New post: Warehouse Project Set...', time: '45m ago', read: true },
  { id: 3, type: 'email', sender: 'Spotify for Artists', subject: 'Your weekly stats are ready!', time: '2h ago', read: true },
  { id: 4, type: 'twitter', sender: 'Fan: @technolover', subject: 'Mental set last night! 🔥', time: '4h ago', read: true },
];

const Dashboard: React.FC<DashboardProps> = ({ onNavigate, role, gigs }) => {
  const [showBriefing, setShowBriefing] = useState(false);
  const today = new Date().toISOString().split('T')[0];
  const upcomingGigs = [...gigs]
    .filter(gig => gig.date >= today && gig.status !== 'Canceled')
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 3);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Hero Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative p-10 md:p-16 rounded-[4rem] bg-zinc-900/20 border border-zinc-800/50 overflow-hidden group">
        <div className="absolute right-0 top-0 h-full w-full pointer-events-none overflow-hidden">
           <div className="absolute inset-0 bg-gradient-to-l from-black/0 via-black/80 to-black z-10"></div>
           <img 
            src="https://images.unsplash.com/photo-1598387181032-a3103a2db5b3?q=80&w=2000&auto=format&fit=crop" 
            className="h-full w-full object-cover object-right opacity-30 grayscale-[0.5] group-hover:scale-105 transition-transform duration-1000" 
            alt="Artist Hero"
           />
        </div>

        <div className="space-y-4 z-20 flex flex-col items-start relative">
          <div className="relative">
             <span className="font-logo text-6xl md:text-9xl neon-logo-glow leading-[0.8] inline-block whitespace-nowrap">
               Black Beauty
             </span>
          </div>
          <p className="text-zinc-500 text-[10px] md:text-xs uppercase tracking-[0.4em] font-black flex items-center gap-3 mt-4">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse"></span>
            {role === 'Artist' ? 'Active Session • Global Portal' : 'Sarah Jenkins • Executive Hub'}
          </p>
        </div>
        
        <div className="flex flex-wrap gap-4 z-20">
          <button 
            onClick={() => setShowBriefing(true)}
            className="group px-8 py-5 bg-zinc-900 border border-zinc-800 rounded-3xl text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-white shadow-xl hover:bg-zinc-800 transition-all flex items-center gap-3 active:scale-95"
          >
            <Mic className="w-4 h-4 text-purple-500 group-hover:scale-125 transition-transform" />
            Live Briefing
          </button>
          <button 
            onClick={() => onNavigate('gigs')}
            className="group px-8 py-5 bg-purple-600 border border-purple-500 rounded-3xl text-[10px] font-black uppercase tracking-widest text-white shadow-[0_20px_40px_rgba(168,85,247,0.3)] hover:bg-purple-500 transition-all flex items-center gap-3 active:scale-95"
          >
            <PlusCircle className="w-4 h-4 text-white group-hover:rotate-90 transition-transform" />
            Lock In Show
          </button>
        </div>
      </div>

      {/* Quick Action Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Calendar', icon: Calendar, view: 'gigs', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-blue-500/5' },
          { label: 'Quotations', icon: Receipt, view: 'quotation', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-emerald-500/5' },
          { label: 'Journal', icon: BookOpen, view: 'journal', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20 shadow-purple-500/5' },
          { label: 'EPK Hub', icon: FileText, view: 'epk', color: 'bg-pink-500/10 text-pink-400 border-pink-500/20 shadow-pink-500/5' },
        ].map((action, i) => (
          <button 
            key={i}
            onClick={() => onNavigate(action.view as ViewState)}
            className={`flex flex-col items-center justify-center gap-4 p-8 rounded-[2.5rem] border transition-all hover:scale-[1.02] active:scale-95 shadow-xl group ${action.color}`}
          >
            <action.icon className="w-7 h-7 group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-widest">{action.label}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: 'Streams', value: '1.2M', growth: '+12%', icon: PlayCircle, color: 'text-purple-500' },
              { label: 'Total Gigs', value: gigs.length.toString(), growth: '+2', icon: Calendar, color: 'text-pink-500' },
              { label: 'Revenue YTD', value: 'LKR 4.2M', growth: '+8%', icon: TrendingUp, color: 'text-green-500' },
            ].map((stat, i) => (
              <div key={i} className="bg-zinc-900/40 border border-zinc-800/50 p-7 rounded-[2.5rem] hover:border-zinc-700 transition-all shadow-xl group">
                <div className="flex items-center justify-between mb-5">
                  <div className={`w-11 h-11 bg-zinc-950 rounded-2xl flex items-center justify-center ${stat.color} border border-zinc-800 shadow-inner group-hover:scale-110 transition-transform`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <span className={`text-[9px] font-black px-2.5 py-1.5 rounded-xl bg-zinc-800 border border-zinc-700/50 ${stat.growth.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                    {stat.growth}
                  </span>
                </div>
                <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.2em] mb-1.5">{stat.label}</p>
                <h3 className="text-2xl font-black text-white font-syncopate tracking-tighter leading-tight">{stat.value}</h3>
              </div>
            ))}
          </div>

          <div className="bg-zinc-900/40 border border-zinc-800/50 p-8 rounded-[3rem] shadow-2xl relative overflow-hidden h-[450px]">
             <div className="flex items-center justify-between mb-10">
                <div className="space-y-1">
                  <h3 className="font-black text-xl text-white font-syncopate tracking-tighter uppercase">Market Reach</h3>
                  <p className="text-zinc-600 text-[10px] font-black uppercase tracking-widest">Global engagement growth matrix</p>
                </div>
             </div>
             <div className="h-full w-full pb-20">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data}>
                    <defs>
                      <linearGradient id="colorStreams" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} strokeOpacity={0.3} />
                    <XAxis dataKey="name" stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} dy={10} fontWeight="black" />
                    <YAxis stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} dx={-10} fontWeight="black" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '1.5rem', fontSize: '10px' }}
                      itemStyle={{ color: '#a78bfa', fontWeight: 'black' }}
                    />
                    <Area type="monotone" dataKey="streams" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorStreams)" strokeWidth={4} />
                  </AreaChart>
                </ResponsiveContainer>
             </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <div className="bg-zinc-950 border border-zinc-800/80 p-8 rounded-[3rem] shadow-2xl relative overflow-hidden">
            <h3 className="font-black text-xl text-white font-syncopate tracking-tighter uppercase mb-8">Next Shows</h3>
            <div className="space-y-4">
              {upcomingGigs.map((gig) => (
                <div 
                  key={gig.id} 
                  onClick={() => onNavigate('gigs')}
                  className="flex items-center gap-4 p-5 bg-zinc-900/50 rounded-[2rem] border border-zinc-800/50 hover:border-purple-500/30 transition-all cursor-pointer group shadow-lg active:scale-95"
                >
                  <div className="w-14 h-14 rounded-2xl bg-zinc-950 flex flex-col items-center justify-center border border-zinc-800 group-hover:border-purple-500 transition-all">
                    <span className="text-[8px] font-black uppercase text-zinc-600">{new Date(gig.date).toLocaleString('en-US', { month: 'short' })}</span>
                    <span className="text-xl font-black text-white leading-none">{new Date(gig.date).getDate()}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-black text-white truncate uppercase tracking-tight">{gig.venue}</h4>
                    <p className="text-[9px] text-zinc-600 font-black uppercase tracking-widest mt-1.5 flex items-center gap-1"><MapPin className="w-3 h-3" /> {gig.city}</p>
                  </div>
                </div>
              ))}
            </div>
            <button 
              onClick={() => onNavigate('gigs')}
              className="w-full mt-8 py-5 bg-zinc-900/80 hover:bg-zinc-800 text-[10px] font-black uppercase tracking-[0.4em] rounded-2xl transition-all border border-zinc-800 text-zinc-500"
            >
              Tour Routing
            </button>
          </div>

          <div className="bg-zinc-900/30 border border-zinc-800 p-8 rounded-[3rem] shadow-2xl space-y-8">
            <h3 className="font-black text-xl text-white font-syncopate tracking-tighter uppercase">Sync Feed</h3>
            <div className="space-y-4">
              {FEEDS.map((feed) => (
                <div key={feed.id} className="relative p-5 bg-black/40 border border-zinc-900 rounded-[1.75rem] group hover:border-zinc-700 transition-all cursor-pointer">
                  {!feed.read && <div className="absolute top-5 right-5 w-2 h-2 bg-purple-500 rounded-full shadow-[0_0_12px_#a855f7]"></div>}
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-400">
                      {feed.type === 'email' ? <Mail className="w-4 h-4" /> : <Instagram className="w-4 h-4" />}
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <p className="text-[10px] font-black text-zinc-400 uppercase truncate">{feed.sender}</p>
                      <p className="text-xs font-bold text-white leading-tight truncate">{feed.subject}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showBriefing && <LiveBriefing gigs={gigs} onClose={() => setShowBriefing(false)} />}
    </div>
  );
};

export default Dashboard;
