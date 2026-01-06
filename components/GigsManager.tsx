
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
  Archive,
  Briefcase,
  LayoutGrid,
  List,
  ChevronLeft,
  ExternalLink
} from 'lucide-react';
import { Gig, JobDocument, Client } from '../types';

interface GigsManagerProps {
  gigs: Gig[];
  documents: JobDocument[];
  clients: Client[];
  onAddGig: (gig: Omit<Gig, 'id'>) => void;
  onUpdateGig?: (id: string, updates: Partial<Gig>) => void;
  onSaveDocument: (doc: JobDocument) => void;
}

const GigsManager: React.FC<GigsManagerProps> = ({ gigs, documents, clients, onAddGig, onUpdateGig, onSaveDocument }) => {
  const [isCreating, setIsCreating] = useState(false);
  const [newGig, setNewGig] = useState<Partial<Gig>>({ currency: 'LKR', status: 'Pending' });
  const [searchTerm, setSearchTerm] = useState('');
  const [showJobFolder, setShowJobFolder] = useState(false);
  const [selectedGig, setSelectedGig] = useState<Gig | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [docSearch, setDocSearch] = useState('');

  // Calendar Helpers
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return { firstDay, daysInMonth };
  };

  const navigateMonth = (direction: number) => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + direction, 1));
  };

  // Update Gig Helper
  const handleUpdate = (updates: Partial<Gig>) => {
    if (selectedGig && onUpdateGig) {
      onUpdateGig(selectedGig.id, updates);
      setSelectedGig(prev => prev ? { ...prev, ...updates } : null);
    }
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (newGig.venue && newGig.date && newGig.fee) {
      onAddGig({
        venue: newGig.venue,
        city: newGig.city || '',
        date: newGig.date,
        startTime: newGig.startTime,
        endTime: newGig.endTime,
        fee: Number(newGig.fee),
        currency: newGig.currency || 'LKR',
        status: 'Pending',
        isDepositPaid: false,
        isFeePaid: false,
        deposit: 0,
        notes: newGig.notes
      } as any);
      setIsCreating(false);
      setNewGig({ currency: 'LKR', status: 'Pending' });
    }
  };

  const addToCalendarUrl = (gig: Gig) => {
    const start = gig.date.replace(/-/g, '') + 'T' + (gig.startTime?.replace(':', '') || '000000');
    // Approximate end time or default 2 hours
    const end = gig.date.replace(/-/g, '') + 'T' + (gig.endTime?.replace(':', '') || '230000');
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(gig.venue + ' - Performance')}&dates=${start}/${end}&details=${encodeURIComponent('Fee: ' + gig.currency + ' ' + gig.fee + '\nNotes: ' + (gig.notes || ''))}&location=${encodeURIComponent(gig.venue + ', ' + gig.city)}`;
  };

  const filteredGigs = gigs.filter(g => g.venue.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black text-white font-syncopate uppercase tracking-tighter">Touring</h2>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em] mt-2">Master Routing & Booking Management</p>
        </div>
        <div className="flex gap-4">
          <div className="flex bg-zinc-900 border border-zinc-800 rounded-2xl p-1 overflow-hidden mr-4">
            <button onClick={() => setViewMode('list')} className={`p-3 rounded-xl transition-all ${viewMode === 'list' ? 'bg-purple-600 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}>
              <List className="w-4 h-4" />
            </button>
            <button onClick={() => setViewMode('calendar')} className={`p-3 rounded-xl transition-all ${viewMode === 'calendar' ? 'bg-purple-600 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}>
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
          <button onClick={() => window.print()} className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl text-zinc-400 hover:text-white"><Printer className="w-5 h-5" /></button>
          <button onClick={() => setIsCreating(true)} className="flex items-center gap-2 px-10 py-5 bg-gradient-to-tr from-purple-600 to-indigo-600 text-white rounded-[2rem] text-[10px] font-black uppercase tracking-widest shadow-2xl hover:scale-105 transition-transform">
            <Plus className="w-5 h-5" /> Reserve Show
          </button>
        </div>
      </div>

      {viewMode === 'list' ? (
        <>
          <div className="relative">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600" />
            <input type="text" placeholder="Search venues..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-[2rem] py-5 pl-16 pr-8 text-sm text-white focus:ring-1 focus:ring-purple-500 outline-none" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGigs.map(gig => (
              <div key={gig.id} className="bg-zinc-900/60 border border-zinc-800 p-8 rounded-[2.5rem] space-y-6 hover:border-purple-500/30 transition-all shadow-2xl group cursor-pointer" onClick={() => { setSelectedGig(gig); setShowJobFolder(true); }}>
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
        </>
      ) : (
        <div className="space-y-6 animate-in zoom-in-95 duration-500">
          <div className="flex items-center justify-between bg-zinc-900/50 border border-zinc-800/50 p-6 rounded-[2rem] backdrop-blur-xl">
            <h3 className="text-xl font-black text-white uppercase tracking-tighter">
              {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </h3>
            <div className="flex gap-2">
              <button onClick={() => navigateMonth(-1)} className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-400 hover:text-white"><ChevronLeft size={20} /></button>
              <button onClick={() => navigateMonth(1)} className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-400 hover:text-white"><ChevronRight size={20} /></button>
            </div>
          </div>

          <div className="bg-zinc-900/40 border border-zinc-800 rounded-[2.5rem] overflow-hidden backdrop-blur-md">
            <div className="grid grid-cols-7 border-b border-zinc-800/50">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="py-4 text-center text-[10px] font-black text-zinc-600 uppercase tracking-widest border-r last:border-r-0 border-zinc-800/30">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 min-h-[600px]">
              {Array.from({ length: getDaysInMonth(currentMonth).firstDay }).map((_, i) => (
                <div key={`pad-${i}`} className="border-r border-b border-zinc-800/30 p-4 bg-black/5" />
              ))}
              {Array.from({ length: getDaysInMonth(currentMonth).daysInMonth }).map((_, i) => {
                const day = i + 1;
                const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                const dayGigs = gigs.filter(g => g.date === dateStr);
                const isToday = new Date().toISOString().split('T')[0] === dateStr;

                return (
                  <div key={day} className={`border-r border-b border-zinc-800/30 p-4 min-h-[140px] transition-all relative group ${isToday ? 'bg-purple-600/5' : 'hover:bg-zinc-800/10'}`}>
                    <div className="flex justify-between items-start">
                      <span className={`text-xs font-black ${isToday ? 'text-purple-500' : 'text-zinc-600'} group-hover:text-zinc-400`}>{day}</span>
                      <button
                        onClick={() => {
                          setNewGig({ ...newGig, date: dateStr });
                          setIsCreating(true);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 bg-zinc-800 rounded-md text-zinc-500 hover:text-white transition-all shadow-lg active:scale-90"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="mt-2 space-y-1">
                      {dayGigs.map(gig => (
                        <div
                          key={gig.id}
                          onClick={() => { setSelectedGig(gig); setShowJobFolder(true); }}
                          className="bg-zinc-800/80 border border-zinc-700/50 p-2 rounded-lg cursor-pointer hover:border-purple-500/50 hover:bg-zinc-800 transition-all overflow-hidden shadow-sm"
                        >
                          <p className="text-[9px] font-black text-white truncate uppercase">{gig.venue}</p>
                          <div className="flex items-center gap-1 mt-1">
                            <div className={`w-1.5 h-1.5 rounded-full ${gig.status === 'Confirmed' ? 'bg-green-500' : 'bg-amber-500'} shadow-[0_0_8px_rgba(34,197,94,0.5)]`} />
                            <span className="text-[8px] text-zinc-500 font-bold uppercase truncate">{gig.city}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Detail Vault Modal */}
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
                  <h4 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] flex items-center gap-2"><MapPin className="w-4 h-4" /> Logistics & Timing</h4>
                  <div className="p-8 bg-zinc-950 rounded-[2rem] border border-zinc-900 space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-zinc-600 uppercase">Performance Date</label>
                      <input
                        type="date"
                        value={selectedGig.date}
                        onChange={(e) => handleUpdate({ date: e.target.value })}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-purple-500 transition-all font-mono"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-zinc-600 uppercase">Curtain Call</label>
                        <input
                          type="time"
                          value={selectedGig.startTime || ''}
                          onChange={(e) => handleUpdate({ startTime: e.target.value })}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-purple-500 transition-all font-mono"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-zinc-600 uppercase">Closing Set</label>
                        <input
                          type="time"
                          value={selectedGig.endTime || ''}
                          onChange={(e) => handleUpdate({ endTime: e.target.value })}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-purple-500 transition-all font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  <h4 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] flex items-center gap-2"><FileText className="w-4 h-4" /> Gig-Linked Documents</h4>
                  <div className="space-y-4">
                    <div className="relative mb-6">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600" />
                      <input
                        type="text"
                        placeholder="Search by client or venue..."
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-[10px] text-white focus:ring-1 focus:ring-purple-500 outline-none transition-all shadow-inner uppercase"
                        onChange={(e) => setDocSearch(e.target.value.toLowerCase())}
                      />
                    </div>

                    <a href={addToCalendarUrl(selectedGig)} target="_blank" rel="noopener noreferrer" className="w-full p-4 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center gap-2 text-zinc-400 hover:text-white hover:border-purple-500/50 transition-all font-bold text-xs uppercase">
                      <Calendar className="w-4 h-4" /> Add to Google Calendar
                    </a>

                    {documents.filter(d =>
                      (d.gigId === selectedGig.id ||
                        d.clientName?.toLowerCase().includes(docSearch) ||
                        d.venueName?.toLowerCase().includes(docSearch) ||
                        d.fileName.toLowerCase().includes(docSearch)) &&
                      (docSearch ? true : d.gigId === selectedGig.id)
                    ).length > 0 ? (
                      documents.filter(d =>
                        (d.gigId === selectedGig.id ||
                          d.clientName?.toLowerCase().includes(docSearch) ||
                          d.venueName?.toLowerCase().includes(docSearch) ||
                          d.fileName.toLowerCase().includes(docSearch)) &&
                        (docSearch ? true : d.gigId === selectedGig.id)
                      ).map(doc => (
                        <div key={doc.id} className="p-4 bg-zinc-950 border border-zinc-900 rounded-2xl flex items-center justify-between hover:border-purple-500/30 transition-all">
                          <div className="flex-1 min-w-0 mr-4">
                            <p className="text-xs font-bold text-white uppercase tracking-tight truncate">{doc.fileName}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <p className="text-[9px] text-zinc-600 font-black uppercase">{doc.type}</p>
                              {doc.clientName && <span className="text-[8px] text-purple-400/50 font-black uppercase tracking-widest">• {doc.clientName}</span>}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            {doc.googleDriveUrl && (
                              <a
                                href={doc.googleDriveUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 bg-purple-600/10 hover:bg-purple-600/20 rounded-xl text-purple-400 transition-all border border-purple-500/20"
                                title="View on Google Drive"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            )}
                            <button className="p-2 bg-zinc-900 rounded-xl text-zinc-400 hover:text-white transition-all"><Download className="w-4 h-4" /></button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="py-8 flex flex-col items-center justify-center border-2 border-dashed border-zinc-900 rounded-3xl">
                        <Archive className="w-8 h-8 text-zinc-900 mb-3" />
                        <p className="text-[9px] text-zinc-700 font-black uppercase tracking-widest">No documents found</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-6">
                  <h4 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] flex items-center gap-2"><Briefcase className="w-4 h-4" /> Financial Sync</h4>
                  <div className="p-8 bg-zinc-950 rounded-[2rem] border border-zinc-900 space-y-6">
                    <div className="flex justify-between items-end">
                      <span className="text-[10px] font-black text-zinc-600 uppercase">Total Fee</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-zinc-500">{selectedGig.currency}</span>
                        <input
                          type="number"
                          value={selectedGig.fee}
                          onChange={(e) => handleUpdate({ fee: Number(e.target.value) })}
                          className="bg-zinc-900 text-white text-xl font-black text-right w-32 outline-none border-b border-zinc-800 focus:border-purple-500"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <span className="text-[10px] font-black text-zinc-600 uppercase">Notes</span>
                      <textarea
                        value={selectedGig.notes || ''}
                        onChange={(e) => handleUpdate({ notes: e.target.value })}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-xs text-zinc-300 outline-none focus:border-purple-500/50 resize-none h-24"
                        placeholder="Add gig notes here..."
                      />
                    </div>

                    {/* Payment Updates */}
                    <div className="space-y-4 pt-6 border-t border-zinc-900">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-zinc-500 uppercase">Deposit</span>
                        <div className="flex items-center gap-3">
                          <input type="number"
                            value={selectedGig.deposit || 0}
                            onChange={e => handleUpdate({ deposit: Number(e.target.value) })}
                            className="w-20 bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-right text-xs text-white"
                            placeholder="0"
                          />
                          <button
                            onClick={() => handleUpdate({ isDepositPaid: !selectedGig.isDepositPaid })}
                            className={`p-2 rounded-lg ${selectedGig.isDepositPaid ? 'bg-green-500/20 text-green-500' : 'bg-zinc-900 text-zinc-600'}`}
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-zinc-500 uppercase">Full Settlement</span>
                        <button
                          onClick={() => handleUpdate({ isFeePaid: !selectedGig.isFeePaid })}
                          className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border ${selectedGig.isFeePaid ? 'bg-green-500/20 text-green-500 border-green-500/20' : 'bg-zinc-900 text-zinc-500 border-zinc-800'}`}
                        >
                          {selectedGig.isFeePaid ? 'Paid in Full' : 'Pending'}
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-between items-end pt-6 border-t border-zinc-900">
                      <span className="text-[10px] font-black text-zinc-600 uppercase">Booking Status</span>
                      <select
                        value={selectedGig.status}
                        onChange={(e) => handleUpdate({ status: e.target.value as any })}
                        className="bg-zinc-900 text-white text-[10px] font-black uppercase px-3 py-1 rounded-lg outline-none border border-zinc-800"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Canceled">Canceled</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Gig Modal */}
      {isCreating && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-2xl p-4">
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-lg rounded-[3rem] p-10 space-y-8 shadow-2xl animate-in zoom-in-95">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-black text-white font-syncopate uppercase tracking-tighter">New Booking</h3>
              <button onClick={() => setIsCreating(false)} className="p-3 bg-zinc-800 rounded-xl"><X className="w-5 h-5 text-zinc-500" /></button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input required placeholder="Venue Name" value={newGig.venue || ''} onChange={e => setNewGig({ ...newGig, venue: e.target.value })} className="col-span-2 bg-black border border-zinc-800 rounded-2xl px-6 py-4 text-white outline-none" />
                <input required placeholder="City / Location" value={newGig.city || ''} onChange={e => setNewGig({ ...newGig, city: e.target.value })} className="col-span-2 bg-black border border-zinc-800 rounded-2xl px-6 py-4 text-white outline-none" />
                <input type="date" required value={newGig.date || ''} onChange={e => setNewGig({ ...newGig, date: e.target.value })} className="bg-black border border-zinc-800 rounded-2xl px-6 py-4 text-white outline-none" />
                <div className="flex gap-2">
                  <input type="time" placeholder="Start" value={newGig.startTime || ''} onChange={e => setNewGig({ ...newGig, startTime: e.target.value })} className="w-1/2 bg-black border border-zinc-800 rounded-2xl px-4 py-4 text-white outline-none" />
                  <input type="time" placeholder="End" value={newGig.endTime || ''} onChange={e => setNewGig({ ...newGig, endTime: e.target.value })} className="w-1/2 bg-black border border-zinc-800 rounded-2xl px-4 py-4 text-white outline-none" />
                </div>
                <div className="col-span-2 flex gap-4">
                  <input type="number" required placeholder="Fee" value={newGig.fee || ''} onChange={e => setNewGig({ ...newGig, fee: Number(e.target.value) })} className="flex-1 bg-black border border-zinc-800 rounded-2xl px-6 py-4 text-white outline-none" />
                  <select value={newGig.currency} onChange={e => setNewGig({ ...newGig, currency: e.target.value })} className="w-24 bg-black border border-zinc-800 rounded-2xl px-4 py-4 text-white outline-none">
                    <option value="LKR">LKR</option>
                    <option value="USD">USD</option>
                    <option value="GBP">GBP</option>
                    <option value="EUR">EUR</option>
                  </select>
                </div>
                <textarea placeholder="Additional Notes" value={newGig.notes || ''} onChange={e => setNewGig({ ...newGig, notes: e.target.value })} className="col-span-2 bg-black border border-zinc-800 rounded-2xl px-6 py-4 text-white outline-none h-24 resize-none"></textarea>
              </div>
              <button type="submit" className="w-full py-5 bg-purple-600 text-white rounded-[2rem] text-xs font-black uppercase tracking-widest shadow-2xl hover:bg-purple-500 transition-all">Confirm Booking</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GigsManager;
