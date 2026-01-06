
import React, { useState, useRef } from 'react';
import { 
  UserPlus, 
  Search, 
  MoreHorizontal, 
  ShieldCheck, 
  Mail, 
  Trash2, 
  ShieldAlert,
  CheckCircle2,
  Clock3,
  X,
  ImageIcon,
  Upload,
  Link,
  Save,
  Sparkles
} from 'lucide-react';
import { UserAccount } from '../types';

interface AccessManagerProps {
  loginBg: string;
  onUpdateLoginBg: (url: string) => void;
}

const INITIAL_USERS: UserAccount[] = [
  { id: '1', name: 'DJ Black Beauty', email: 'artist@blackbeauty.fm', role: 'Owner', status: 'Active', lastActive: '2 mins ago' },
  { id: '2', name: 'Sarah Jenkins', email: 'sarah@mgmt.agency', role: 'Manager', status: 'Active', lastActive: '1 hour ago' },
  { id: '3', name: 'Marco Rossi', email: 'marco@tourbooking.it', role: 'Agent', status: 'Active', lastActive: '6 hours ago' },
  { id: '4', name: 'Elena Vance', email: 'elena@vancefinance.com', role: 'Accountant', status: 'Pending', lastActive: 'Invited' },
  { id: '5', name: 'David Kim', email: 'david@prpro.co', role: 'PR', status: 'Inactive', lastActive: '2 days ago' },
];

const AccessManager: React.FC<AccessManagerProps> = ({ loginBg, onUpdateLoginBg }) => {
  const [users, setUsers] = useState<UserAccount[]>(INITIAL_USERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [tempBg, setTempBg] = useState(loginBg);
  const [useUpload, setUseUpload] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setTempBg(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch(role) {
      case 'Owner': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'Manager': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'Agent': return 'bg-green-500/10 text-green-400 border-green-500/20';
      default: return 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20';
    }
  };

  return (
    <div className="space-y-12 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Platform Settings</h2>
          <p className="text-zinc-500 text-xs">Manage workspace permissions and brand identity.</p>
        </div>
        <button 
          onClick={() => setShowInviteModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg active:scale-95"
        >
          <UserPlus className="w-4 h-4" /> Invite Team Member
        </button>
      </div>

      {/* Brand Identity Section */}
      <div className="bg-zinc-900/40 border border-zinc-800 rounded-[2.5rem] p-8 space-y-8 shadow-2xl overflow-hidden relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-purple-400">
              <ImageIcon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white font-syncopate uppercase tracking-tighter">Platform Identity</h3>
              <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Customize the digital gateway aesthetics</p>
            </div>
          </div>
          <div className="flex bg-zinc-950 p-1.5 rounded-2xl border border-zinc-800 shadow-inner">
            <button 
              onClick={() => setUseUpload(false)}
              className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2 transition-all ${!useUpload ? 'bg-zinc-800 text-white' : 'text-zinc-600 hover:text-zinc-400'}`}
            >
              <Link className="w-3 h-3" /> URL
            </button>
            <button 
              onClick={() => setUseUpload(true)}
              className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2 transition-all ${useUpload ? 'bg-zinc-800 text-white' : 'text-zinc-600 hover:text-zinc-400'}`}
            >
              <Upload className="w-3 h-3" /> Upload
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] ml-1">
                  {useUpload ? 'Local Asset Upload' : 'Remote Background URL'}
                </label>
                
                <div className="flex flex-col gap-4">
                  {useUpload ? (
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full bg-black border-2 border-dashed border-zinc-800 hover:border-purple-500/50 rounded-2xl py-12 flex flex-col items-center justify-center gap-4 cursor-pointer transition-all group active:scale-[0.99] shadow-inner"
                    >
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        accept="image/*" 
                        onChange={handleFileUpload}
                      />
                      <div className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center group-hover:bg-purple-600/10 transition-colors">
                        <Upload className="w-6 h-6 text-zinc-700 group-hover:text-purple-400" />
                      </div>
                      <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Select press photo or key visual</p>
                    </div>
                  ) : (
                    <div className="flex gap-4">
                      <input 
                        type="text" 
                        value={tempBg} 
                        onChange={(e) => setTempBg(e.target.value)}
                        className="flex-1 bg-black border border-zinc-800 rounded-2xl px-6 py-4 text-xs text-white outline-none focus:ring-1 focus:ring-purple-500 transition-all shadow-inner" 
                        placeholder="https://..."
                      />
                    </div>
                  )}

                  <button 
                    onClick={() => { onUpdateLoginBg(tempBg); alert('Platform branding synchronized.'); }}
                    className="w-full py-5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-[0_20px_40px_rgba(139,92,246,0.3)] flex items-center justify-center gap-3 active:scale-95"
                  >
                    <Save className="w-4 h-4" /> Deploy Identity
                  </button>
                </div>
              </div>

              <div className="p-6 bg-purple-600/5 border border-purple-500/10 rounded-[1.5rem] space-y-2">
                 <p className="text-[10px] font-black text-purple-400 uppercase tracking-widest flex items-center gap-2">
                   <Sparkles className="w-3.5 h-3.5" /> Creative Note
                 </p>
                 <p className="text-xs text-zinc-400 leading-relaxed font-medium">Use high-resolution 16:9 vertical portraits. Monochrome or high-contrast visuals align best with the Black Beauty aesthetic.</p>
              </div>
           </div>

           <div className="relative group h-full">
              <div className="aspect-[16/9] md:aspect-auto md:h-full rounded-[2.5rem] overflow-hidden border border-zinc-800 shadow-2xl relative">
                 <img 
                    src={tempBg} 
                    alt="Preview" 
                    className="w-full h-full object-cover grayscale-[0.2] transition-all duration-700"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1574672280600-4accfa5b6f98?q=80&w=2000&auto=format&fit=crop";
                    }}
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex items-end p-8">
                    <div className="space-y-1">
                      <p className="text-[9px] font-black text-purple-500 uppercase tracking-[0.5em]">Session Preview</p>
                      <h4 className="text-2xl font-black text-white font-syncopate uppercase tracking-tighter">Gateway UI</h4>
                    </div>
                 </div>
                 {tempBg !== loginBg && (
                    <div className="absolute top-6 right-6 px-4 py-2 bg-black/40 backdrop-blur-md rounded-xl border border-white/5 text-[9px] font-black text-zinc-500 uppercase tracking-widest animate-pulse">
                      Pending Deployment
                    </div>
                 )}
              </div>
           </div>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
        <div className="p-8 border-b border-zinc-800 bg-zinc-950/30 flex justify-between items-center">
          <h3 className="text-lg font-black text-white font-syncopate uppercase tracking-tighter">Team Roster</h3>
          <div className="relative max-w-sm">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input 
              type="text" 
              placeholder="Search team assets..."
              className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 pl-12 pr-6 text-[11px] focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all text-white shadow-inner"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-950/50">
                <th className="px-10 py-6 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">User Profile</th>
                <th className="px-10 py-6 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Level</th>
                <th className="px-10 py-6 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Sync Status</th>
                <th className="px-10 py-6 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Activity</th>
                <th className="px-10 py-6"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-zinc-800/30 transition-colors group">
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center border border-zinc-700 font-black text-xs text-zinc-400 group-hover:border-purple-500/50 transition-colors uppercase">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white group-hover:text-purple-400 transition-colors tracking-tight uppercase">{user.name}</p>
                        <p className="text-[10px] text-zinc-600 font-medium">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border ${getRoleBadgeColor(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-2">
                      {user.status === 'Active' ? (
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                      ) : user.status === 'Pending' ? (
                        <Clock3 className="w-4 h-4 text-amber-500" />
                      ) : (
                        <ShieldAlert className="w-4 h-4 text-zinc-600" />
                      )}
                      <span className={`text-[10px] font-black uppercase tracking-widest ${
                        user.status === 'Active' ? 'text-zinc-300' : 
                        user.status === 'Pending' ? 'text-amber-500/80' : 'text-zinc-600'
                      }`}>
                        {user.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-10 py-6 text-[11px] font-bold text-zinc-500 uppercase tracking-tight">
                    {user.lastActive}
                  </td>
                  <td className="px-10 py-6 text-right">
                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                      <button className="p-3 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-zinc-500 hover:text-white transition-all shadow-xl" title="Message">
                        <Mail className="w-4 h-4" />
                      </button>
                      <button className="p-3 bg-zinc-800 hover:bg-red-500/10 rounded-xl text-zinc-500 hover:text-red-400 transition-all shadow-xl" title="Revoke Access">
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button className="p-3 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-zinc-500 hover:text-white transition-all shadow-xl">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showInviteModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-3xl animate-in fade-in duration-200">
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-md rounded-[3rem] shadow-[0_50px_100px_rgba(0,0,0,0.6)] overflow-hidden p-10 space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-black text-white font-syncopate uppercase tracking-tighter flex items-center gap-4">
                <ShieldCheck className="text-purple-500 w-7 h-7" /> Team Invite
              </h3>
              <button onClick={() => setShowInviteModal(false)} className="p-3 hover:bg-zinc-800 rounded-full transition-colors text-zinc-500">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.3em] ml-1">Email Dispatch</label>
                <input type="email" placeholder="teammate@agency.com" className="w-full bg-black border border-zinc-800 rounded-2xl px-6 py-4 text-xs text-white focus:outline-none focus:ring-1 focus:ring-purple-500 shadow-inner" />
              </div>
              
              <div className="space-y-2">
                <label className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.3em] ml-1">Assigned Access Level</label>
                <select className="w-full bg-black border border-zinc-800 rounded-2xl px-6 py-4 text-xs text-zinc-400 focus:outline-none focus:ring-1 focus:ring-purple-500 outline-none appearance-none cursor-pointer shadow-inner">
                  <option>Manager</option>
                  <option>Booking Agent</option>
                  <option>Accountant</option>
                  <option>PR Representative</option>
                </select>
              </div>
            </div>

            <div className="pt-4 flex flex-col gap-4">
              <button onClick={() => setShowInviteModal(false)} className="w-full py-6 bg-purple-600 hover:bg-purple-700 text-white rounded-[2rem] text-[10px] font-black uppercase tracking-[0.4em] transition-all shadow-2xl active:scale-95">
                Send Digital Invite
              </button>
              <button onClick={() => setShowInviteModal(false)} className="w-full py-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white rounded-[1.5rem] text-[9px] font-black uppercase tracking-widest transition-all">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccessManager;
