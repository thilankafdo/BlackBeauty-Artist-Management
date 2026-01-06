
import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  MapPin, 
  Calendar, 
  X,
  ChevronRight,
  FolderOpen,
  FileDown,
  Printer,
  CheckCircle2,
  FileText,
  Download,
  // Added Archive and Briefcase icons
  Archive,
  Briefcase
} from 'lucide-react';
import { Gig, JobDocument, Client } from '../types';

interface GigsManagerProps {
  gigs: Gig[];
  documents: JobDocument[];
  clients: Client[];
  onAddGig: (gig: Omit<Gig, 'id'>) => void;
  onSaveDocument: (doc: JobDocument) => void;
}

const GigsManager: React.FC<GigsManagerProps> = ({ gigs, documents, clients, onAddGig, onSaveDocument }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showJobFolder, setShowJobFolder] = useState(false);
  const [selectedGig, setSelectedGig] = useState<Gig | null>(null);

  const filteredGigs = gigs.filter(g => g.venue.toLowerCase().includes(searchTerm.toLowerCase()));

  const openFolder = (g: Gig) => {
    setSelectedGig(g);
    setShowJobFolder(true);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black text-white font-syncopate uppercase tracking-tighter">Touring</h2>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em] mt-2">Master Routing & Booking Management</p>
        </div>
        <div className="flex gap-4">
          <button onClick={() => window.print()} className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl text-zinc-400 hover:text-white"><Printer className="w-5 h-5" /></button>
          <button className="flex items-center gap-2 px-10 py-5 bg-gradient-to-tr from-purple-600 to-indigo-600 text-white rounded-[2rem] text-[10px] font-black uppercase tracking-widest shadow-2xl">
            <Plus className="w-5 h-5" /> Reserve Show
          </button>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600" />
        <input type="text" placeholder="Search venues..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-[2rem] py-5 pl-16 pr-8 text-sm text-white focus:ring-1 focus:ring-purple-500 outline-none" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGigs.map(gig => (
          <div key={gig.id} className="bg-zinc-900/60 border border-zinc-800 p-8 rounded-[2.5rem] space-y-6 hover:border-purple-500/30 transition-all shadow-2xl group cursor-pointer" onClick={() => openFolder(gig)}>
            <div className="flex justify-between items-start">
              <div className="w-14 h-14 rounded-3xl bg-zinc-800 flex items-center justify-center border border-zinc-700 text-purple-500"><MapPin className="w-6 h-6" /></div>
              <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase border ${gig.status === 'Confirmed' ? 'border-green-500/20 text-green-500 bg-green-500/10' : 'border-amber-500/20 text-amber-500 bg-amber-500/10'}`}>{gig.status}</span>
            </div>
            <div>
              <h4 className="text-xl font-black text-white uppercase tracking-tight leading-none mb-2">{gig.venue}</h4>
              <p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest flex items-center gap-2"><Calendar className="w-3.5 h-3.5" /> {gig.date} • {gig.city}</p>
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-zinc-800/50">
               <span className="text-[10px] font-black text-zinc-500 uppercase">Settlement</span>
               <span className="text-sm font-black text-white">{gig.currency} {gig.fee.toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>

      {showJobFolder && selectedGig && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-2xl p-4">
           <div className="bg-[#0c0c0c] border border-zinc-800 w-full max-w-4xl rounded-[3rem] shadow-2xl flex flex-col max-h-[90dvh] animate-in slide-in-from-bottom-8">
              <div className="p-10 flex items-center justify-between border-b border-zinc-900/50">
                 <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-[1.75rem] bg-zinc-900 flex items-center justify-center border border-zinc-800 shadow-inner"><FolderOpen className="w-8 h-8 text-purple-500" /></div>
                    <div>
                       <h3 className="text-2xl font-black text-white font-syncopate uppercase tracking-tighter">{selectedGig.venue} Vault</h3>
                       <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest mt-1">Audit Trail • {selectedGig.date}</p>
                    </div>
                 </div>
                 <button onClick={() => setShowJobFolder(false)} className="p-4 bg-zinc-900 rounded-2xl text-zinc-500 hover:text-white"><X className="w-6 h-6" /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-12 space-y-12 custom-scrollbar">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-6">
                       <h4 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] flex items-center gap-2"><FileText className="w-4 h-4" /> Gig-Linked Documents</h4>
                       <div className="space-y-4">
                          {documents.filter(d => d.gigId === selectedGig.id).length > 0 ? (
                            documents.filter(d => d.gigId === selectedGig.id).map(doc => (
                              <div key={doc.id} className="p-4 bg-zinc-950 border border-zinc-900 rounded-2xl flex items-center justify-between hover:border-purple-500/30 transition-all">
                                <div>
                                  <p className="text-xs font-bold text-white uppercase tracking-tight">{doc.fileName}</p>
                                  <p className="text-[9px] text-zinc-600 font-black uppercase">{doc.type}</p>
                                </div>
                                <button className="p-2 bg-zinc-900 rounded-xl text-zinc-400 hover:text-white"><Download className="w-4 h-4" /></button>
                              </div>
                            ))
                          ) : (
                            <div className="py-12 flex flex-col items-center justify-center border-2 border-dashed border-zinc-900 rounded-3xl">
                               <Archive className="w-10 h-10 text-zinc-900 mb-4" />
                               <p className="text-[9px] text-zinc-700 font-black uppercase tracking-widest">No documents found for this show</p>
                            </div>
                          )}
                       </div>
                    </div>
                    <div className="space-y-6">
                       <h4 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] flex items-center gap-2"><Briefcase className="w-4 h-4" /> Financial Sync</h4>
                       <div className="p-8 bg-zinc-950 rounded-[2rem] border border-zinc-900 space-y-6">
                          <div className="flex justify-between items-end">
                             <span className="text-[10px] font-black text-zinc-600 uppercase">Revenue</span>
                             <span className="text-xl font-black text-white">{selectedGig.currency} {selectedGig.fee.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between items-end pt-6 border-t border-zinc-900">
                             <span className="text-[10px] font-black text-zinc-600 uppercase">Status</span>
                             <span className={`px-4 py-1 rounded-full text-[9px] font-black uppercase border ${selectedGig.status === 'Confirmed' ? 'border-green-500/20 text-green-500' : 'border-amber-500/20 text-amber-500'}`}>{selectedGig.status}</span>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default GigsManager;
