
import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Plus, 
  X,
  Briefcase,
  Zap,
  Plane,
  Speaker,
  Receipt,
  FileText
} from 'lucide-react';
import { Gig, Expense, JobDocument } from '../types';

interface FinancialsProps {
  gigs: Gig[];
  expenses: Expense[];
  documents: JobDocument[];
  onAddExpense: (expense: Omit<Expense, 'id'>) => void;
}

const Financials: React.FC<FinancialsProps> = ({ gigs, expenses, documents, onAddExpense }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'expenses' | 'ledger'>('overview');
  const [showAddExpense, setShowAddExpense] = useState(false);

  // Form State
  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');
  const [cat, setCat] = useState<Expense['category']>('Travel');
  const [gigId, setGigId] = useState('');

  const totalRevenue = gigs.filter(g => g.status === 'Confirmed').reduce((sum, g) => sum + g.fee, 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const netProfit = totalRevenue - totalExpenses;

  const chartData = [
    { name: 'Revenue', val: totalRevenue, fill: '#8b5cf6' },
    { name: 'Expenses', val: totalExpenses, fill: '#ef4444' },
    { name: 'Net', val: Math.max(0, netProfit), fill: '#10b981' }
  ];

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    onAddExpense({
      description: desc,
      amount: Number(amount),
      category: cat,
      gigId: gigId || undefined,
      date: new Date().toISOString().split('T')[0],
      currency: 'LKR'
    });
    setDesc(''); setAmount(''); setShowAddExpense(false);
  };

  const getIcon = (c: string) => {
    switch(c) {
      case 'Travel': return <Plane className="w-4 h-4 text-sky-400" />;
      case 'Gear': return <Speaker className="w-4 h-4 text-purple-400" />;
      case 'Staff': return <Briefcase className="w-4 h-4 text-emerald-400" />;
      default: return <Receipt className="w-4 h-4 text-zinc-400" />;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black text-white font-syncopate uppercase tracking-tighter">Accounting</h2>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em] mt-2">Daily Profit & Operating Ledger</p>
        </div>
        <button onClick={() => setShowAddExpense(true)} className="flex items-center gap-2 px-8 py-4 bg-emerald-600 text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 transition-all shadow-xl shadow-emerald-600/20">
          <Plus className="w-4 h-4" /> Log Expense
        </button>
      </div>

      <div className="flex bg-zinc-900/50 p-2 rounded-[2rem] border border-zinc-800 w-fit">
        {(['overview', 'expenses', 'ledger'] as const).map(t => (
          <button key={t} onClick={() => setActiveTab(t)} className={`px-6 py-3 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === t ? 'bg-zinc-800 text-white shadow-xl' : 'text-zinc-600 hover:text-zinc-400'}`}>
            {t}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-10 bg-zinc-950 border border-zinc-900 rounded-[3rem] shadow-2xl">
              <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-2">Revenue</p>
              <h3 className="text-4xl font-black text-white font-syncopate tracking-tighter">LKR {totalRevenue.toLocaleString()}</h3>
            </div>
            <div className="p-10 bg-zinc-950 border border-zinc-900 rounded-[3rem] shadow-2xl">
              <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-2">Expenses</p>
              <h3 className="text-4xl font-black text-white font-syncopate tracking-tighter">LKR {totalExpenses.toLocaleString()}</h3>
            </div>
            <div className={`p-10 border rounded-[3rem] shadow-2xl ${netProfit >= 0 ? 'bg-emerald-600/10 border-emerald-500/20' : 'bg-red-600/10 border-red-500/20'}`}>
              <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-2">Net Profit</p>
              <h3 className={`text-4xl font-black font-syncopate tracking-tighter ${netProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                LKR {netProfit.toLocaleString()}
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-zinc-900/40 border border-zinc-800 p-10 rounded-[3rem] h-[400px]">
              <h4 className="text-xs font-black text-white uppercase tracking-widest mb-8">Performance Mix</h4>
              <ResponsiveContainer width="100%" height="80%">
                <BarChart data={chartData}>
                  <XAxis dataKey="name" stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip cursor={{fill: 'transparent'}} contentStyle={{backgroundColor: '#0c0c0c', border: '1px solid #27272a', borderRadius: '1rem'}} />
                  <Bar dataKey="val" radius={[12, 12, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-zinc-900/40 border border-zinc-800 p-10 rounded-[3rem] space-y-6">
              <h4 className="text-xs font-black text-white uppercase tracking-widest">Linked Assets</h4>
              <div className="space-y-3">
                {documents.slice(0, 5).map(doc => (
                  <div key={doc.id} className="p-5 bg-black/40 border border-zinc-800 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <FileText className="w-5 h-5 text-purple-400" />
                      <p className="text-xs font-bold text-white uppercase">{doc.fileName}</p>
                    </div>
                    <span className="text-[10px] font-black text-zinc-500">{doc.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'expenses' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {expenses.map(e => (
            <div key={e.id} className="bg-zinc-900/60 border border-zinc-800 p-8 rounded-[2.5rem] space-y-4 hover:border-zinc-700 transition-all group">
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 rounded-2xl bg-zinc-800 flex items-center justify-center border border-zinc-700">{getIcon(e.category)}</div>
                <div className="text-right">
                  <p className="text-lg font-black text-white font-syncopate tracking-tighter">{e.amount.toLocaleString()}</p>
                  <p className="text-[9px] text-zinc-600 font-black uppercase tracking-widest">{e.date}</p>
                </div>
              </div>
              <p className="text-xs font-bold text-white uppercase truncate">{e.description}</p>
              <p className="text-[9px] text-zinc-500 font-black uppercase tracking-widest">{e.category}</p>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'ledger' && (
        <div className="bg-zinc-950 border border-zinc-900 rounded-[3rem] overflow-hidden shadow-2xl">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-zinc-900 bg-zinc-900/30">
                <th className="px-10 py-6 text-[9px] font-black text-zinc-600 uppercase tracking-widest">Details</th>
                <th className="px-10 py-6 text-[9px] font-black text-zinc-600 uppercase tracking-widest">Date</th>
                <th className="px-10 py-6 text-right text-[9px] font-black text-zinc-600 uppercase tracking-widest">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900 font-medium">
              {gigs.filter(g => g.status === 'Confirmed').map(g => (
                <tr key={g.id} className="hover:bg-emerald-500/5 transition-all">
                  <td className="px-10 py-6">
                    <p className="text-xs font-black text-white uppercase">Gig: {g.venue}</p>
                    <p className="text-[9px] text-zinc-600 font-black uppercase tracking-widest">Performance Income</p>
                  </td>
                  <td className="px-10 py-6 text-xs">{g.date}</td>
                  <td className="px-10 py-6 text-right text-emerald-400 font-black font-syncopate">+ {g.fee.toLocaleString()}</td>
                </tr>
              ))}
              {expenses.map(e => (
                <tr key={e.id} className="hover:bg-red-500/5 transition-all">
                  <td className="px-10 py-6">
                    <p className="text-xs font-black text-white uppercase">{e.description}</p>
                    <p className="text-[9px] text-zinc-600 font-black uppercase tracking-widest">{e.category}</p>
                  </td>
                  <td className="px-10 py-6 text-xs">{e.date}</td>
                  <td className="px-10 py-6 text-right text-red-400 font-black font-syncopate">- {e.amount.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showAddExpense && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-2xl p-4">
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-md rounded-[3rem] p-10 space-y-8 shadow-2xl animate-in zoom-in-95">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-black text-white font-syncopate uppercase tracking-tighter">New Expense</h3>
              <button onClick={() => setShowAddExpense(false)} className="p-3 bg-zinc-800 rounded-xl"><X className="w-5 h-5 text-zinc-500" /></button>
            </div>
            <form onSubmit={handleAdd} className="space-y-6">
              <input required placeholder="Description (e.g. Venue Flight)" value={desc} onChange={e => setDesc(e.target.value)} className="w-full bg-black border border-zinc-800 rounded-2xl px-6 py-4 text-white outline-none" />
              <input required type="number" placeholder="Amount (LKR)" value={amount} onChange={e => setAmount(e.target.value)} className="w-full bg-black border border-zinc-800 rounded-2xl px-6 py-4 text-white outline-none" />
              <select value={cat} onChange={e => setCat(e.target.value as any)} className="w-full bg-black border border-zinc-800 rounded-2xl px-6 py-4 text-zinc-400 outline-none appearance-none">
                <option value="Travel">Travel</option><option value="Gear">Gear</option><option value="Staff">Staff</option><option value="Marketing">Marketing</option><option value="Other">Other</option>
              </select>
              <select value={gigId} onChange={e => setGigId(e.target.value)} className="w-full bg-black border border-zinc-800 rounded-2xl px-6 py-4 text-zinc-400 outline-none appearance-none">
                <option value="">Link to Gig (Optional)</option>
                {gigs.map(g => <option key={g.id} value={g.id}>{g.venue}</option>)}
              </select>
              <button type="submit" className="w-full py-6 bg-emerald-600 text-white rounded-[2rem] text-xs font-black uppercase tracking-widest shadow-2xl">Confirm Entry</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Financials;
