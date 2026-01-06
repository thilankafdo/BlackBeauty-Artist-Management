
import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Calendar, 
  DollarSign, 
  FileText, 
  Sparkles, 
  Menu, 
  X, 
  Bell, 
  Users,
  Archive,
  Settings,
  LogOut,
  Receipt,
  BookOpen
} from 'lucide-react';
import Dashboard from './components/Dashboard';
import GigsManager from './components/GigsManager';
import Financials from './components/Financials';
import EPKBuilder from './components/EPKBuilder';
import AIAssistant from './components/AIAssistant';
import AccessManager from './components/AccessManager';
import ClientDirectory from './components/ClientDirectory';
import JobRegistry from './components/JobRegistry';
import QuotationBuilder from './components/QuotationBuilder';
import JournalManager from './components/JournalManager';
import Auth from './components/Auth';
import { ViewState, Gig, AuthRole, JobDocument, Client, Expense } from './types';

const INITIAL_GIGS: Gig[] = [
  { id: '1', venue: 'Vibe Club', city: 'Colombo', date: '2025-05-18', startTime: '22:00', endTime: '02:00', status: 'Confirmed', fee: 150000, currency: 'LKR', notes: 'Main Stage Techno Set', clientId: '1' },
  { id: '2', venue: 'Warehouse Project', city: 'Manchester', date: '2025-06-02', startTime: '02:00', endTime: '04:00', status: 'Confirmed', fee: 18000, currency: 'GBP', clientId: '2' },
];

const INITIAL_EXPENSES: Expense[] = [
  { id: 'e1', date: '2025-05-15', category: 'Travel', description: 'Manchester Flight', amount: 850, currency: 'GBP', gigId: '2' },
  { id: 'e2', date: '2025-05-18', category: 'Gear', description: 'Monitor Rental', amount: 15000, currency: 'LKR', gigId: '1' },
];

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewState>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [gigs, setGigs] = useState<Gig[]>(INITIAL_GIGS);
  const [expenses, setExpenses] = useState<Expense[]>(INITIAL_EXPENSES);
  const [jobRegistry, setJobRegistry] = useState<JobDocument[]>([]);
  const [authRole, setAuthRole] = useState<AuthRole | null>(null);
  const [editingDocId, setEditingDocId] = useState<string | null>(null);
  const [loginBg, setLoginBg] = useState("https://images.unsplash.com/photo-1574672280600-4accfa5b6f98?q=80&w=2000&auto=format&fit=crop");

  const navigation = [
    { id: 'dashboard', name: 'Hub', icon: LayoutDashboard },
    { id: 'gigs', name: 'Touring', icon: Calendar },
    { id: 'finance', name: 'Accounting', icon: DollarSign },
    { id: 'quotation', name: 'Quotes', icon: Receipt },
    { id: 'registry', name: 'Vault', icon: Archive },
    { id: 'clients', name: 'Clients', icon: Users },
    { id: 'journal', name: 'Journal', icon: BookOpen },
    { id: 'epk', name: 'EPK', icon: FileText },
  ];

  const handleAddGig = (newGig: Omit<Gig, 'id'>) => {
    setGigs(prev => [{ ...newGig, id: Math.random().toString(36).substr(2, 9) }, ...prev]);
  };

  const handleAddExpense = (exp: Omit<Expense, 'id'>) => {
    setExpenses(prev => [{ ...exp, id: Math.random().toString(36).substr(2, 9) }, ...prev]);
  };

  const handleSaveDoc = (doc: JobDocument) => {
    setJobRegistry(prev => {
      const exists = prev.find(d => d.id === doc.id);
      if (exists) return prev.map(d => d.id === doc.id ? doc : d);
      return [doc, ...prev];
    });
    setEditingDocId(null);
  };

  const handleEditDoc = (id: string) => {
    setEditingDocId(id);
    setActiveView('quotation');
  };

  const renderView = () => {
    switch (activeView) {
      case 'dashboard': return <Dashboard onNavigate={setActiveView} role={authRole!} gigs={gigs} />;
      case 'gigs': return <GigsManager gigs={gigs} documents={jobRegistry} clients={[]} onAddGig={handleAddGig} onSaveDocument={handleSaveDoc} />;
      case 'finance': return <Financials gigs={gigs} expenses={expenses} documents={jobRegistry} onAddExpense={handleAddExpense} />;
      case 'quotation': return <QuotationBuilder gigs={gigs} clients={[]} onSaveDocument={handleSaveDoc} initialDoc={jobRegistry.find(d => d.id === editingDocId)} onCancel={() => setActiveView('registry')} />;
      case 'registry': return <JobRegistry documents={jobRegistry} gigs={gigs} onEditDocument={handleEditDoc} />;
      case 'clients': return <ClientDirectory />;
      case 'journal': return <JournalManager gigs={gigs} />;
      case 'epk': return <EPKBuilder />;
      case 'access': return <AccessManager loginBg={loginBg} onUpdateLoginBg={setLoginBg} />;
      default: return <Dashboard onNavigate={setActiveView} role={authRole!} gigs={gigs} />;
    }
  };

  if (!authRole) return <Auth onLogin={setAuthRole} background={loginBg} />;

  return (
    <div className="flex h-screen bg-[#050505] text-zinc-300 font-inter overflow-hidden">
      <aside className={`transition-all duration-300 bg-zinc-950 border-r border-zinc-900 flex flex-col z-50 ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="h-24 flex items-center justify-center border-b border-zinc-900">
          <h1 className={`font-logo text-3xl text-white neon-logo-glow ${!isSidebarOpen && 'hidden'}`}>Black Beauty</h1>
          {!isSidebarOpen && <span className="font-logo text-2xl text-purple-500">BB</span>}
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navigation.map(item => (
            <button key={item.id} onClick={() => setActiveView(item.id as ViewState)} className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all ${activeView === item.id ? 'bg-purple-600/10 text-white border border-purple-500/20 shadow-lg' : 'text-zinc-500 hover:bg-zinc-900 hover:text-zinc-300'}`}>
              <item.icon className="w-5 h-5" />
              {isSidebarOpen && <span className="font-bold text-xs uppercase tracking-widest">{item.name}</span>}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-zinc-900 space-y-2">
           <button onClick={() => setActiveView('access')} className="w-full flex items-center gap-4 p-4 rounded-2xl text-zinc-500 hover:text-white"><Settings className="w-5 h-5" /> {isSidebarOpen && 'System'}</button>
           <button onClick={() => setAuthRole(null)} className="w-full flex items-center gap-4 p-4 rounded-2xl text-zinc-500 hover:text-red-400"><LogOut className="w-5 h-5" /> {isSidebarOpen && 'Exit'}</button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-20 border-b border-zinc-900 bg-black/50 backdrop-blur-xl flex items-center justify-between px-10 z-10 shrink-0">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-zinc-900 rounded-xl transition-all"><Menu className="w-5 h-5" /></button>
          <div className="flex items-center gap-6">
            <button className="p-2 text-zinc-500 hover:text-white transition-all"><Bell className="w-5 h-5" /></button>
            <div className="w-10 h-10 rounded-2xl bg-zinc-800 border border-zinc-700 overflow-hidden">
               <img src="https://images.unsplash.com/photo-1598387946413-0975877f2402?q=80&w=100&h=100&auto=format&fit=crop" className="w-full h-full object-cover" alt="User" />
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-8 md:p-12 custom-scrollbar">
          <div className="max-w-7xl mx-auto">{renderView()}</div>
        </div>
      </main>

      <button onClick={() => setIsChatOpen(true)} className="fixed bottom-10 right-10 w-16 h-16 bg-gradient-to-tr from-purple-600 to-indigo-600 rounded-[2rem] flex items-center justify-center shadow-2xl hover:scale-110 active:scale-90 transition-all z-50 group">
        <Sparkles className="w-7 h-7 text-white group-hover:rotate-12 transition-transform" />
      </button>

      {isChatOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsChatOpen(false)}></div>
          <div className="relative w-full max-w-lg h-full bg-[#050505] shadow-2xl border-l border-zinc-900">
            <AIAssistant onBookingCreated={handleAddGig} onNavigate={(v) => { setActiveView(v); setIsChatOpen(false); }} onClose={() => setIsChatOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
