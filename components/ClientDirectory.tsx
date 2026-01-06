
import React, { useState } from 'react';
import { Search, UserPlus, Phone, Mail, MapPin, MoreHorizontal, X, Plus } from 'lucide-react';
import { Client } from '../types';

const INITIAL_CLIENTS: Client[] = [
  { id: '1', name: 'Ishara Jay', company: 'Vibe Club', email: 'ishara@vibe.lk', phone: '+94 77 123 4567', category: 'Venue' },
  { id: '2', name: 'John Smith', company: 'Warehouse Project', email: 'john@whp.uk', phone: '+44 20 7123 4567', category: 'Promoter' },
  { id: '3', name: 'Marina Diaz', company: 'Ibiza Global', email: 'marina@ibiza.es', phone: '+34 971 123 456', category: 'Agency' },
];

const ClientDirectory: React.FC = () => {
  const [clients, setClients] = useState<Client[]>(INITIAL_CLIENTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Client Directory</h2>
          <p className="text-zinc-500 text-xs">Manage venues, promoters, and agencies.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-6 py-3 bg-purple-600 rounded-2xl font-bold text-white shadow-lg active:scale-95 transition-all">
          <UserPlus className="w-4 h-4" /> Add Client
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
        <input type="text" placeholder="Search clients by name or venue..." className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 text-sm text-white focus:ring-1 focus:ring-purple-500 outline-none" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClients.map(client => (
          <div key={client.id} className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-6 hover:border-zinc-700 transition-all group">
            <div className="flex justify-between items-start">
              <div className="w-12 h-12 rounded-2xl bg-zinc-800 flex items-center justify-center text-xl font-black text-purple-400 border border-zinc-700">{client.company.charAt(0)}</div>
              <button className="p-2 hover:bg-zinc-800 rounded-xl text-zinc-600"><MoreHorizontal className="w-5 h-5" /></button>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">{client.name}</h3>
              <p className="text-purple-500 text-xs font-bold uppercase tracking-widest">{client.company}</p>
            </div>
            <div className="space-y-3 pt-4 border-t border-zinc-800">
              <div className="flex items-center gap-3 text-zinc-400 text-xs font-medium"><Mail className="w-4 h-4 text-zinc-600" /> {client.email}</div>
              <div className="flex items-center gap-3 text-zinc-400 text-xs font-medium"><Phone className="w-4 h-4 text-zinc-600" /> {client.phone}</div>
              <div className="flex items-center gap-3 text-zinc-400 text-xs font-medium"><MapPin className="w-4 h-4 text-zinc-600" /> {client.category}</div>
            </div>
            <button className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl text-xs font-bold transition-all">View Full History</button>
          </div>
        ))}
        <button onClick={() => setIsModalOpen(true)} className="border-2 border-dashed border-zinc-800 rounded-3xl flex flex-col items-center justify-center py-12 text-zinc-600 hover:border-zinc-600 hover:text-zinc-400 transition-all">
          <Plus className="w-8 h-8 mb-2" />
          <span className="text-xs font-bold uppercase tracking-widest">Register New Client</span>
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-md rounded-[2.5rem] p-8 space-y-6 shadow-2xl">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-white font-syncopate uppercase tracking-tighter">Add Client</h3>
              <button onClick={() => setIsModalOpen(false)}><X className="w-6 h-6 text-zinc-500" /></button>
            </div>
            <div className="space-y-4">
              <input type="text" placeholder="Full Name" className="w-full bg-black border border-zinc-800 rounded-2xl px-5 py-4 text-white outline-none" />
              <input type="text" placeholder="Company / Venue" className="w-full bg-black border border-zinc-800 rounded-2xl px-5 py-4 text-white outline-none" />
              <input type="email" placeholder="Email Address" className="w-full bg-black border border-zinc-800 rounded-2xl px-5 py-4 text-white outline-none" />
              <input type="tel" placeholder="Phone Number" className="w-full bg-black border border-zinc-800 rounded-2xl px-5 py-4 text-white outline-none" />
              <select className="w-full bg-black border border-zinc-800 rounded-2xl px-5 py-4 text-zinc-400 outline-none">
                <option>Venue</option><option>Promoter</option><option>Corporate</option><option>Agency</option>
              </select>
            </div>
            <button onClick={() => setIsModalOpen(false)} className="w-full py-5 bg-purple-600 text-white rounded-[1.5rem] font-bold shadow-xl active:scale-95 transition-all">SAVE CLIENT</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientDirectory;
