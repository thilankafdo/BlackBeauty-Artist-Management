
import React, { useState, useEffect } from 'react';
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
  BookOpen,
  PenLine
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
import KnowledgeBase from './components/KnowledgeBase';
import Auth from './components/Auth';
import { ViewState, Gig, AuthRole, JobDocument, Client, Expense } from './types';
import { api } from './services/api';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewState>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [jobRegistry, setJobRegistry] = useState<JobDocument[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [authRole, setAuthRole] = useState<AuthRole | null>(null);
  const [editingDocId, setEditingDocId] = useState<string | null>(null);
  const [loginBg, setLoginBg] = useState("/assets/images/img-3.jpg");
  const [hubHero, setHubHero] = useState("/assets/images/img-2.png");
  const [hubHeroScale, setHubHeroScale] = useState(1);

  useEffect(() => {
    if (authRole) {
      api.getGigs().then(setGigs).catch(console.error);
      api.getExpenses().then(setExpenses).catch(console.error);
      api.getClients().then(setClients).catch(console.error);
    }
  }, [authRole]);

  const navigation = [
    { id: 'dashboard', name: 'Hub', icon: LayoutDashboard },
    { id: 'gigs', name: 'Touring', icon: Calendar },
    { id: 'finance', name: 'Accounting', icon: DollarSign },
    { id: 'quotation', name: 'Quotes', icon: Receipt },
    { id: 'registry', name: 'Vault', icon: Archive },
    { id: 'clients', name: 'Clients', icon: Users },
    { id: 'journal', name: 'Journal', icon: PenLine },
    { id: 'epk', name: 'EPK', icon: FileText },
  ];

  const handleAddGig = async (newGig: Omit<Gig, 'id'>) => {
    try {
      const addedGig = await api.addGig(newGig);
      setGigs(prev => [addedGig, ...prev]);
    } catch (error) {
      console.error("Failed to add gig", error);
    }
  };

  const handleAddClient = async (client: Omit<Client, 'id'>) => {
    try {
      const addedClient = await api.addClient(client);
      setClients(prev => [addedClient, ...prev]);
    } catch (error) {
      console.error("Failed to add client", error);
    }
  };

  const handleAddExpense = async (exp: Omit<Expense, 'id'>) => {
    try {
      const addedExpense = await api.addExpense(exp);
      setExpenses(prev => [addedExpense, ...prev]);
    } catch (error) {
      console.error("Failed to add expense", error);
    }
  };

  const handleUpdateGig = async (id: string, updates: Partial<Gig>) => {
    try {
      const updatedGig = await api.updateGig(id, updates);
      setGigs(prev => prev.map(g => g.id === id ? updatedGig : g));
    } catch (error) {
      console.error("Failed to update gig", error);
    }
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
      case 'dashboard': return <Dashboard onNavigate={setActiveView} role={authRole!} gigs={gigs} heroImage={hubHero} heroScale={hubHeroScale} />;
      case 'gigs': return <GigsManager gigs={gigs} documents={jobRegistry} clients={clients} onAddGig={handleAddGig} onUpdateGig={handleUpdateGig} onSaveDocument={handleSaveDoc} />;
      case 'finance': return <Financials gigs={gigs} expenses={expenses} documents={jobRegistry} onAddExpense={handleAddExpense} />;
      case 'quotation': return <QuotationBuilder gigs={gigs} clients={clients} onSaveDocument={handleSaveDoc} initialDoc={jobRegistry.find(d => d.id === editingDocId)} onCancel={() => setActiveView('registry')} />;
      case 'registry': return <JobRegistry documents={jobRegistry} gigs={gigs} onEditDocument={handleEditDoc} />;
      case 'clients': return <ClientDirectory clients={clients} onAddClient={handleAddClient} />;
      case 'journal': return <JournalManager gigs={gigs} />;
      case 'epk': return <EPKBuilder />;
      case 'access': return <AccessManager loginBg={loginBg} onUpdateLoginBg={setLoginBg} hubHero={hubHero} onUpdateHubHero={setHubHero} hubHeroScale={hubHeroScale} onUpdateHubHeroScale={setHubHeroScale} />;
      case 'knowledge': return <KnowledgeBase />;
      default: return <Dashboard onNavigate={setActiveView} role={authRole!} gigs={gigs} heroImage={hubHero} heroScale={hubHeroScale} />;
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
          <button onClick={() => setActiveView('knowledge')} className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all ${activeView === 'knowledge' ? 'bg-purple-600/10 text-white' : 'text-zinc-500 hover:text-white'}`}>
            <BookOpen className="w-5 h-5" /> {isSidebarOpen && <span className="text-[10px] font-black uppercase tracking-widest">Manual</span>}
          </button>
          <button onClick={() => setActiveView('access')} className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all ${activeView === 'access' ? 'bg-purple-600/10 text-white' : 'text-zinc-500 hover:text-white'}`}>
            <Settings className="w-5 h-5" /> {isSidebarOpen && <span className="text-[10px] font-black uppercase tracking-widest">System</span>}
          </button>
          <button onClick={() => setAuthRole(null)} className="w-full flex items-center gap-4 p-4 rounded-2xl text-zinc-500 hover:text-red-400 transition-all">
            <LogOut className="w-5 h-5" /> {isSidebarOpen && <span className="text-[10px] font-black uppercase tracking-widest">Exit</span>}
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-20 border-b border-zinc-900 bg-black/50 backdrop-blur-xl flex items-center justify-between px-10 z-10 shrink-0">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-zinc-900 rounded-xl transition-all"><Menu className="w-5 h-5" /></button>
          <div className="flex items-center gap-6">
            <button className="p-2 text-zinc-500 hover:text-white transition-all"><Bell className="w-5 h-5" /></button>
            <div className="w-10 h-10 rounded-2xl bg-zinc-800 border border-zinc-700 overflow-hidden">
              <img src="/assets/images/img-4.png" className="w-full h-full object-cover" alt="User" />
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
