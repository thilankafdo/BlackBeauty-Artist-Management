
import React, { useState } from 'react';
import { Archive, FileText, Download, CheckCircle2, Search, Clock, ExternalLink, Filter, Edit3, MapPin } from 'lucide-react';
import { JobDocument, Gig } from '../types';

interface JobRegistryProps {
  documents: JobDocument[];
  gigs: Gig[];
  onEditDocument: (id: string) => void;
}

const JobRegistry: React.FC<JobRegistryProps> = ({ documents, gigs, onEditDocument }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGigId, setFilterGigId] = useState<string>('');

  const filteredDocs = documents.filter(doc => {
    const gig = gigs.find(g => g.id === doc.gigId);
    const matchesSearch = doc.fileName.toLowerCase().includes(searchTerm.toLowerCase()) || 
           gig?.venue.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGig = filterGigId ? doc.gigId === filterGigId : true;
    return matchesSearch && matchesGig;
  });

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
             <div className="w-12 h-12 rounded-[1.25rem] bg-zinc-900 flex items-center justify-center border border-zinc-800 shadow-2xl"><Archive className="w-6 h-6 text-purple-500" /></div>
             <h2 className="text-3xl font-black text-white font-syncopate uppercase tracking-tighter">Job Registry</h2>
          </div>
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest ml-1">Centralized document management & archives</p>
        </div>
        
        <div className="flex flex-wrap gap-4 w-full lg:w-auto">
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl px-8 py-4 flex flex-col shadow-inner backdrop-blur-md">
            <p className="text-[9px] text-zinc-600 font-black uppercase tracking-[0.2em] mb-1">Active Projects</p>
            <p className="text-2xl font-black text-white font-syncopate leading-none">{gigs.length}</p>
          </div>
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl px-8 py-4 flex flex-col shadow-inner backdrop-blur-md">
            <p className="text-[9px] text-zinc-600 font-black uppercase tracking-[0.2em] mb-1">Total Assets</p>
            <p className="text-2xl font-black text-purple-400 font-syncopate leading-none">{documents.length}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600" />
          <input 
            type="text" 
            placeholder="Search by venue or file ID..." 
            className="w-full bg-zinc-900/80 border border-zinc-800 rounded-[1.5rem] py-5 pl-14 pr-6 text-sm text-white focus:ring-1 focus:ring-purple-500 outline-none shadow-2xl transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="relative w-full md:w-64">
           <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
           <select 
            value={filterGigId} 
            onChange={e => setFilterGigId(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-[1.5rem] py-5 pl-12 pr-6 text-[10px] font-black uppercase tracking-widest text-zinc-400 focus:text-white outline-none appearance-none transition-all"
           >
              <option value="">Filter By Project</option>
              {gigs.map(g => (
                <option key={g.id} value={g.id}>{g.venue}</option>
              ))}
           </select>
        </div>
      </div>

      <div className="bg-zinc-900/30 border border-zinc-800 rounded-[3rem] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.5)] backdrop-blur-xl">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900/50">
                <th className="px-10 py-6 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Document Name</th>
                <th className="px-10 py-6 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Reference Gig</th>
                <th className="px-10 py-6 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Creation Date</th>
                <th className="px-10 py-6 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Status</th>
                <th className="px-10 py-6 text-right text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Value</th>
                <th className="px-10 py-6"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {filteredDocs.length > 0 ? filteredDocs.map(doc => {
                const gig = gigs.find(g => g.id === doc.gigId);
                return (
                  <tr key={doc.id} className="hover:bg-zinc-800/30 transition-all group">
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-2xl bg-zinc-800 flex items-center justify-center text-purple-400 border border-zinc-700 shadow-inner group-hover:bg-purple-600/10 group-hover:border-purple-500/30 transition-all">
                          <FileText className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white group-hover:text-purple-400 transition-colors uppercase tracking-tight">{doc.fileName}</p>
                          <p className="text-[9px] text-zinc-600 font-black uppercase tracking-widest mt-0.5">{doc.type}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <p className="text-sm font-bold text-zinc-300 tracking-tight">{gig?.venue || 'Archive Reference'}</p>
                      <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">{gig?.city || 'Unassigned'}</p>
                    </td>
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-black uppercase tracking-widest">
                        <Clock className="w-3.5 h-3.5" /> {new Date(doc.dateGenerated).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <span className={`inline-flex items-center gap-1.5 text-[9px] font-black uppercase px-3 py-1.5 rounded-xl border ${
                        doc.status === 'Paid' || doc.status === 'Approved' 
                        ? 'text-green-500 bg-green-500/10 border-green-500/20' 
                        : 'text-amber-500 bg-amber-500/10 border-amber-500/20'
                      }`}>
                        <CheckCircle2 className="w-3 h-3" /> {doc.status}
                      </span>
                    </td>
                    <td className="px-10 py-8 text-right font-black font-syncopate text-white">
                       {doc.totalAmount ? `LKR ${doc.totalAmount.toLocaleString()}` : '---'}
                    </td>
                    <td className="px-10 py-8 text-right">
                       <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                        {doc.type === 'Quotation' && doc.status === 'Draft' && (
                          <button 
                            onClick={() => onEditDocument(doc.id)}
                            className="p-3 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-zinc-400 hover:text-white transition-all shadow-xl" 
                            title="Edit Quote"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                        )}
                        <button className="p-3 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-zinc-400 hover:text-white transition-all shadow-xl" title="Download Asset"><Download className="w-4 h-4" /></button>
                        <button className="p-3 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-zinc-400 hover:text-white transition-all shadow-xl" title="Deep Inspection"><ExternalLink className="w-4 h-4" /></button>
                       </div>
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan={6} className="px-10 py-32 text-center">
                    <div className="flex flex-col items-center max-w-sm mx-auto">
                      <div className="w-20 h-20 rounded-[2.5rem] bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-8"><Archive className="w-8 h-8 text-zinc-800" /></div>
                      <h3 className="text-lg font-black text-zinc-500 font-syncopate uppercase tracking-widest mb-2">Vault Empty</h3>
                      <p className="text-[11px] text-zinc-700 font-medium">Documents generated in the Gigs or Quotation sections will be automatically indexed here for the master record.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default JobRegistry;
