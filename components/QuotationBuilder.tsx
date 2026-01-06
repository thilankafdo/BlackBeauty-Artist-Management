
import React, { useState, useEffect, useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import {
  Package,
  Search,
  Trash2,
  FileText,
  Plus,
  Download,
  Mail,
  Printer,
  Zap,
  Speaker,
  Lightbulb,
  X,
  GripVertical,
  Layers,
  Minus,
  Check,
  ChevronRight,
  Save,
  PlusCircle,
  Settings2,
  Users
} from 'lucide-react';
import { Gig, Equipment, QuoteItem, JobDocument, Client } from '../types';

interface QuotationBuilderProps {
  gigs: Gig[];
  clients: Client[];
  onSaveDocument: (doc: JobDocument) => void;
  initialDoc?: JobDocument;
  onCancel?: () => void;
}

const INITIAL_EQUIPMENT: Equipment[] = [
  { id: 'eq1', name: 'Pioneer CDJ-3000 (Pair)', category: 'DJ', dailyRate: 25000 },
  { id: 'eq2', name: 'Pioneer DJM-V10 Mixer', category: 'DJ', dailyRate: 18000 },
  { id: 'eq3', name: 'Void Nexus Sound System', category: 'Audio', dailyRate: 125000 },
  { id: 'eq4', name: 'Shure SM58 Wireless Mic', category: 'Audio', dailyRate: 5000 },
  { id: 'eq5', name: 'Moving Head Beam (Pair)', category: 'Lighting', dailyRate: 12000 },
  { id: 'eq6', name: 'Haze Machine (Large)', category: 'Lighting', dailyRate: 4000 },
  { id: 'eq7', name: 'Technics 1210 MK7 Turntable', category: 'DJ', dailyRate: 7500 },
  { id: 'eq8', name: 'Subwoofer (Single)', category: 'Audio', dailyRate: 15000 },
];

const QuotationBuilder: React.FC<QuotationBuilderProps> = ({ gigs, clients, onSaveDocument, initialDoc, onCancel }) => {
  // Inventory state (The Master List)
  const [inventory, setInventory] = useState<Equipment[]>(INITIAL_EQUIPMENT);

  // Form/Quote states
  const [selectedGigId, setSelectedGigId] = useState<string>(initialDoc?.gigId || gigs[0]?.id || '');
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [items, setItems] = useState<QuoteItem[]>(initialDoc?.quoteItems || []);
  const [searchTerm, setSearchTerm] = useState('');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const pdfRef = useRef<HTMLDivElement>(null);
  const [draggedItem, setDraggedItem] = useState<Equipment | null>(null);
  const [includeArtistFee, setIncludeArtistFee] = useState(initialDoc?.includeArtistFee || false);

  // Modal states
  const [isAddingToInventory, setIsAddingToInventory] = useState(false);
  const [isAddingCustomLine, setIsAddingCustomLine] = useState(false);
  const [overrideArtistFee, setOverrideArtistFee] = useState<number | null>(initialDoc?.totalAmount ? (initialDoc.totalAmount - (initialDoc.quoteItems?.reduce((acc, i) => acc + (i.quantity * i.rate), 0) || 0)) : null);

  // Form refs/states for new Inventory Item
  const [newInvName, setNewInvName] = useState('');
  const [newInvCategory, setNewInvCategory] = useState<Equipment['category']>('DJ');
  const [newInvRate, setNewInvRate] = useState('');

  // Form states for custom line item (on current quote only)
  const [customDesc, setCustomDesc] = useState('');
  const [customRate, setCustomRate] = useState('');

  useEffect(() => {
    if (initialDoc) {
      setSelectedGigId(initialDoc.gigId);
      setItems(initialDoc.quoteItems || []);
      setIncludeArtistFee(initialDoc.includeArtistFee || false);

      const linkedGig = gigs.find(g => g.id === initialDoc.gigId);
      if (linkedGig?.clientId) {
        setSelectedClientId(linkedGig.clientId);
      }
    } else if (gigs.length > 0) {
      const firstGig = gigs[0];
      if (firstGig.clientId) setSelectedClientId(firstGig.clientId);
      setOverrideArtistFee(firstGig.fee);
    }
  }, [initialDoc, gigs]);

  const selectedGig = gigs.find(g => g.id === selectedGigId);
  const selectedClient = clients.find(c => c.id === selectedClientId) ||
    clients.find(c => c.id === selectedGig?.clientId);

  const handleGigChange = (id: string) => {
    setSelectedGigId(id);
    const gig = gigs.find(g => g.id === id);
    if (gig) {
      if (gig.clientId) setSelectedClientId(gig.clientId);
      setOverrideArtistFee(gig.fee);
    }
  };

  const addItemToQuote = (eq: Equipment) => {
    const existing = items.find(i => i.equipmentId === eq.id);
    if (existing) {
      updateQuantity(existing.id, existing.quantity + 1);
    } else {
      setItems([...items, {
        id: Math.random().toString(36).substr(2, 9),
        equipmentId: eq.id,
        description: eq.name,
        quantity: 1,
        rate: eq.dailyRate
      }]);
    }
  };

  const addToMasterInventory = () => {
    if (!newInvName || !newInvRate) return;
    const newItem: Equipment = {
      id: `eq-${Date.now()}`,
      name: newInvName,
      category: newInvCategory,
      dailyRate: Number(newInvRate)
    };
    setInventory(prev => [...prev, newItem]);
    setNewInvName('');
    setNewInvRate('');
    setIsAddingToInventory(false);
  };

  const addCustomLineItem = () => {
    if (!customDesc || !customRate) return;
    setItems([...items, {
      id: `custom-${Date.now()}`,
      description: customDesc,
      quantity: 1,
      rate: Number(customRate)
    }]);
    setCustomDesc('');
    setCustomRate('');
    setIsAddingCustomLine(false);
  };

  const updateQuantity = (id: string, delta: number) => {
    setItems(items.map(i => {
      if (i.id === id) {
        const newQty = Math.max(1, delta);
        return { ...i, quantity: newQty };
      }
      return i;
    }));
  };

  const removeItem = (id: string) => {
    setItems(items.filter(i => i.id !== id));
  };

  const handleDragStart = (eq: Equipment) => setDraggedItem(eq);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (draggedItem) addItemToQuote(draggedItem);
    setDraggedItem(null);
  };

  const equipmentTotal = items.reduce((acc, item) => acc + (Number(item.quantity) * Number(item.rate)), 0);
  const artistFee = includeArtistFee ? Number(overrideArtistFee ?? selectedGig?.fee ?? 0) : 0;
  const totalQuoteAmount = Number(equipmentTotal) + Number(artistFee);

  const handleSave = async () => {
    if (!selectedGig) return;

    try {
      let googleDriveUrl = undefined;

      // Generate PDF
      if (pdfRef.current) {
        const canvas = await html2canvas(pdfRef.current, {
          scale: 2,
          useCORS: true,
          logging: false
        });
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'px',
          format: [canvas.width, canvas.height]
        });

        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
        const pdfBase64 = pdf.output('datauristring');

        // Upload to Backend
        const response = await fetch('http://localhost:3002/api/documents/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            base64Data: pdfBase64,
            fileName: `Quote_${selectedGig.venue.replace(/\s+/g, '_')}_${selectedGig.date}.pdf`,
            gigId: selectedGig.id,
            clientName: selectedClient?.name || 'TBA',
            venueName: selectedGig.venue,
            type: initialDoc?.type || (artistFee > 0 ? 'Invoice' : 'Quotation')
          })
        });

        if (response.ok) {
          const syncedDoc = await response.json();
          googleDriveUrl = syncedDoc.googleDriveUrl;
          onSaveDocument(syncedDoc);
        }
      }

      if (!googleDriveUrl) {
        // Fallback to local save if upload failed or drive not configured
        const newDoc: JobDocument = {
          id: initialDoc?.id || Math.random().toString(36).substr(2, 9),
          gigId: selectedGig.id,
          type: initialDoc?.type || (artistFee > 0 ? 'Invoice' : 'Quotation'),
          dateGenerated: new Date().toISOString().split('T')[0],
          status: initialDoc?.status || (artistFee > 0 ? 'Paid' : 'Approved'),
          fileName: `Quote_${selectedGig.venue.replace(/\s+/g, '_')}_${selectedGig.date}.pdf`,
          totalAmount: totalQuoteAmount,
          quoteItems: items,
          includeArtistFee,
          clientName: selectedClient?.name || 'TBA',
          venueName: selectedGig.venue
        };
        onSaveDocument(newDoc);
      }

      setIsPreviewOpen(false);
      alert('Document synchronized to vault' + (googleDriveUrl ? ' and Google Drive.' : '.'));
    } catch (error) {
      console.error('Save Error:', error);
      alert('Failed to synchronize document.');
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 pb-24 lg:pb-8 animate-in fade-in duration-500">
      {/* Sidebar: Master Inventory Catalog */}
      <aside className="lg:w-80 flex flex-col bg-zinc-900/50 border border-zinc-800 rounded-[2.5rem] overflow-hidden shrink-0 h-fit lg:sticky lg:top-8 max-h-[85vh]">
        <div className="p-6 border-b border-zinc-800 space-y-4 bg-zinc-900/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-600/20 flex items-center justify-center border border-purple-500/20 shadow-xl">
                <Package className="w-5 h-5 text-purple-400" />
              </div>
              <h3 className="font-bold text-white uppercase tracking-tighter font-syncopate text-xs">Inventory</h3>
            </div>
            <button
              onClick={() => setIsAddingToInventory(true)}
              className="p-2.5 bg-zinc-800 hover:bg-purple-600 hover:text-white rounded-xl text-zinc-400 transition-all shadow-inner active:scale-90"
              title="Add New Asset to Library"
            >
              <PlusCircle className="w-5 h-5" />
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Filter master gear..."
              className="w-full bg-black/50 border border-zinc-800 rounded-2xl py-3 pl-10 pr-4 text-xs outline-none focus:ring-1 focus:ring-purple-500 transition-all text-white shadow-inner"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
          {inventory.filter(e => e.name.toLowerCase().includes(searchTerm.toLowerCase())).map(eq => (
            <div
              key={eq.id}
              draggable
              onDragStart={() => handleDragStart(eq)}
              onClick={() => addItemToQuote(eq)}
              className="group p-4 bg-zinc-900/80 border border-zinc-800 rounded-2xl flex items-center justify-between hover:border-purple-500/40 cursor-grab active:cursor-grabbing transition-all hover:bg-zinc-800 shadow-lg active:scale-95"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-zinc-950 flex items-center justify-center group-hover:bg-purple-600/10 transition-colors border border-zinc-800">
                  {eq.category === 'Audio' ? <Speaker className="w-4 h-4 text-blue-400" /> :
                    eq.category === 'Lighting' ? <Lightbulb className="w-4 h-4 text-amber-400" /> :
                      eq.category === 'DJ' ? <Zap className="w-4 h-4 text-purple-400" /> :
                        <Package className="w-4 h-4 text-zinc-400" />}
                </div>
                <div>
                  <p className="text-[11px] font-bold text-white group-hover:text-purple-400 transition-colors truncate max-w-[140px]">{eq.name}</p>
                  <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">LKR {eq.dailyRate.toLocaleString()}</p>
                </div>
              </div>
              <Plus className="w-4 h-4 text-zinc-700 group-hover:text-purple-400" />
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-zinc-800 bg-zinc-950/20">
          <p className="text-[8px] text-zinc-600 uppercase font-black text-center tracking-widest">Master Gear Repository v1.2</p>
        </div>
      </aside>

      {/* Main Builder Area */}
      <div
        className="flex-1 space-y-6"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-6 md:p-10 shadow-2xl relative overflow-hidden">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
            <div className="space-y-2">
              <h2 className="text-2xl md:text-4xl font-black text-white font-syncopate tracking-tighter uppercase leading-none">
                {initialDoc ? 'Modify Quote' : 'Quote Builder'}
              </h2>
              <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.3em] flex items-center gap-2">
                <GripVertical className="w-4 h-4 text-zinc-700" /> Linked to Venue: {selectedGig?.venue || 'Not Selected'}
              </p>
            </div>

            <div className="flex flex-wrap gap-4 items-end">
              <button
                onClick={() => setIsAddingCustomLine(true)}
                className="px-6 py-4 bg-zinc-800 border border-zinc-700 hover:border-purple-500/50 hover:text-purple-400 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl flex items-center gap-2"
              >
                <Settings2 className="w-4 h-4" /> Add One-Off Fee
              </button>
              {onCancel && (
                <button
                  onClick={onCancel}
                  className="px-6 py-4 bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 rounded-2xl text-[10px] font-black uppercase tracking-widest text-zinc-600 hover:text-white transition-all shadow-xl"
                >
                  Discard
                </button>
              )}
            </div>
          </div>

          {/* Context Configuration Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 pb-10 border-b border-zinc-800/50">
            <div className="space-y-3">
              <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest px-1 flex items-center gap-2">
                <FileText className="w-3.5 h-3.5" /> Gig Association
              </label>
              <div className="relative">
                <select
                  value={selectedGigId}
                  onChange={(e) => handleGigChange(e.target.value)}
                  className="w-full bg-black border border-zinc-800 rounded-[1.25rem] px-6 py-4 text-sm text-white focus:ring-1 focus:ring-purple-500 outline-none appearance-none cursor-pointer shadow-xl"
                >
                  {gigs.map(g => (
                    <option key={g.id} value={g.id}>{g.venue} • {new Date(g.date).toLocaleDateString()}</option>
                  ))}
                </select>
                <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 rotate-90 pointer-events-none" />
              </div>
              <p className="text-[9px] text-zinc-700 px-1">Linking a gig automatically calculates artist fees if included.</p>
            </div>

            <div className="space-y-3">
              <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest px-1 flex items-center gap-2">
                <Users className="w-3.5 h-3.5" /> Recipient Client
              </label>
              <div className="relative">
                <select
                  value={selectedClientId}
                  onChange={(e) => setSelectedClientId(e.target.value)}
                  className="w-full bg-black border border-zinc-800 rounded-[1.25rem] px-6 py-4 text-sm text-white focus:ring-1 focus:ring-purple-500 outline-none appearance-none cursor-pointer shadow-xl"
                >
                  <option value="">Select Recipient...</option>
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>{c.name} {c.company ? `(${c.company})` : ''}</option>
                  ))}
                </select>
                <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 rotate-90 pointer-events-none" />
              </div>
              {selectedClient && (
                <p className="text-[9px] text-purple-400 font-black px-1 uppercase tracking-widest animate-in fade-in">
                  Bill To: {selectedClient.email} • {selectedClient.phone}
                </p>
              )}
            </div>
          </div>

          {/* Items List */}
          <div className="space-y-4 min-h-[350px]">
            {isAddingCustomLine && (
              <div className="p-8 bg-purple-600/5 border border-purple-500/30 rounded-[2rem] flex flex-col md:flex-row gap-6 animate-in slide-in-from-top-4 duration-300 shadow-2xl ring-1 ring-purple-500/20">
                <div className="flex-1 space-y-2">
                  <label className="text-[9px] font-black text-purple-400 uppercase tracking-widest">One-Off Description</label>
                  <input
                    type="text"
                    placeholder="e.g. Travel Surcharge or Custom Branding"
                    value={customDesc}
                    onChange={(e) => setCustomDesc(e.target.value)}
                    className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:ring-1 focus:ring-purple-500 outline-none"
                  />
                </div>
                <div className="w-full md:w-48 space-y-2">
                  <label className="text-[9px] font-black text-purple-400 uppercase tracking-widest">Rate (LKR)</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={customRate}
                    onChange={(e) => setCustomRate(e.target.value)}
                    className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:ring-1 focus:ring-purple-500 outline-none"
                  />
                </div>
                <div className="flex items-end gap-2">
                  <button
                    onClick={addCustomLineItem}
                    className="p-4 bg-purple-600 text-white rounded-xl shadow-lg shadow-purple-600/20 active:scale-95 transition-all"
                  >
                    <Check className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setIsAddingCustomLine(false)}
                    className="p-4 bg-zinc-800 text-zinc-400 rounded-xl hover:text-white transition-all active:scale-95"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {items.length > 0 ? (
              items.map((item) => (
                <div key={item.id} className="group p-6 bg-zinc-950/40 border border-zinc-800/50 rounded-[2rem] flex items-center gap-6 hover:border-purple-500/20 transition-all shadow-xl hover:bg-zinc-900/40 animate-in slide-in-from-left-2">
                  <div className="hidden md:block text-zinc-800 group-hover:text-purple-600/50 transition-colors"><GripVertical className="w-5 h-5" /></div>
                  <div className="flex-1">
                    <p className="text-base font-bold text-white tracking-tight leading-none mb-1 uppercase">{item.description}</p>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Rate: LKR {item.rate.toLocaleString()}</p>
                  </div>
                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    <div className="flex items-center bg-black border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-3 hover:bg-zinc-900 text-zinc-400"><Minus className="w-4 h-4" /></button>
                      <span className="w-12 text-center text-sm font-black text-white">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-3 hover:bg-zinc-900 text-zinc-400"><Plus className="w-4 h-4" /></button>
                    </div>
                    <div className="w-24 text-right">
                      <p className="text-lg font-bold text-white font-syncopate leading-none">{(item.quantity * item.rate).toLocaleString()}</p>
                    </div>
                    <button onClick={() => removeItem(item.id)} className="p-3.5 bg-zinc-900/50 hover:bg-red-500/10 text-zinc-700 hover:text-red-500 rounded-2xl transition-all"><Trash2 className="w-5 h-5" /></button>
                  </div>
                </div>
              ))
            ) : !isAddingCustomLine && (
              <div className="flex flex-col items-center justify-center py-32 border-2 border-dashed border-zinc-800 rounded-[3rem] bg-zinc-950/20 group">
                <Layers className="w-16 h-16 text-zinc-800 mb-6 group-hover:scale-110 transition-transform duration-500" />
                <h3 className="text-sm font-black text-zinc-600 uppercase tracking-widest mb-1">Quote Items Empty</h3>
                <p className="text-[10px] text-zinc-700 font-medium">Select gear from inventory or add a one-off fee</p>
              </div>
            )}
          </div>

          {/* Footer Summary */}
          <div className="mt-12 pt-10 border-t border-zinc-800/50 flex flex-col lg:flex-row justify-between gap-10">
            <div className="space-y-4 max-w-sm">
              <div className={`p-6 border transition-all rounded-[2rem] space-y-4 ${includeArtistFee ? 'bg-purple-600/10 border-purple-500/30 shadow-[0_0_20px_rgba(139,92,246,0.1)]' : 'bg-zinc-950 border-zinc-800/50 opacity-60'}`}>
                <div className="flex items-center justify-between">
                  <p className={`text-[9px] font-black uppercase tracking-[0.2em] flex items-center gap-2 ${includeArtistFee ? 'text-purple-400' : 'text-zinc-600'}`}>
                    <Zap className="w-3.5 h-3.5" /> Performance Lock
                  </p>
                  <button
                    onClick={() => {
                      const newVal = !includeArtistFee;
                      setIncludeArtistFee(newVal);
                      if (newVal && overrideArtistFee === null && selectedGig) {
                        setOverrideArtistFee(selectedGig.fee);
                      }
                    }}
                    className={`p-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${includeArtistFee ? 'bg-purple-600 text-white shadow-lg' : 'bg-zinc-800 text-zinc-400 hover:text-white'
                      }`}
                  >
                    {includeArtistFee ? 'Included' : 'Add Talent Fee'}
                  </button>
                </div>
                <div className="flex justify-between items-center gap-4">
                  <div className="flex flex-col">
                    <span className={`text-xs font-bold uppercase shrink-0 ${includeArtistFee ? 'text-zinc-300' : 'text-zinc-700'}`}>Artist Rate</span>
                    {overrideArtistFee !== (selectedGig?.fee ?? 0) && (
                      <button
                        onClick={() => setOverrideArtistFee(selectedGig?.fee ?? 0)}
                        className="text-[8px] font-black text-purple-400 uppercase tracking-widest text-left hover:text-white transition-colors"
                      >
                        Reset to Default
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-black uppercase ${includeArtistFee ? 'text-purple-400' : 'text-zinc-800'}`}>LKR</span>
                    <input
                      type="text"
                      value={overrideArtistFee?.toLocaleString() ?? selectedGig?.fee?.toLocaleString() ?? '0'}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^0-9]/g, '');
                        setOverrideArtistFee(val ? Number(val) : 0);
                      }}
                      onFocus={(e) => {
                        // Select all on focus for easier editing
                        e.target.select();
                      }}
                      disabled={!includeArtistFee}
                      className={`w-36 bg-transparent text-2xl font-black font-syncopate text-right outline-none border-b transition-all ${includeArtistFee ? 'text-white border-purple-500/30 focus:border-purple-500' : 'text-zinc-800 border-transparent'
                        }`}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-96 space-y-6">
              <div className="space-y-3 px-2">
                <div className="flex justify-between text-zinc-500 text-[10px] font-black uppercase tracking-widest">
                  <span>Production Total</span>
                  <span>LKR {equipmentTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-zinc-500 text-[10px] font-black uppercase tracking-widest">
                  <span>Artist Engagement</span>
                  <span>LKR {artistFee.toLocaleString()}</span>
                </div>
                <div className="p-8 bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-[2.5rem] shadow-2xl border border-zinc-700/50 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform"><Check className="w-12 h-12 text-white" /></div>
                  <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-2">Quote Net Value</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xs font-black text-purple-500 uppercase tracking-widest">LKR</span>
                    <span className="text-4xl font-black text-white font-syncopate tracking-tighter">
                      {totalQuoteAmount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsPreviewOpen(true)}
                disabled={items.length === 0 && !includeArtistFee}
                className="w-full py-6 bg-purple-600 hover:bg-purple-500 text-white rounded-[1.75rem] text-[11px] font-black uppercase tracking-[0.2em] transition-all shadow-xl active:scale-95 disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center gap-3"
              >
                {initialDoc ? <Save className="w-5 h-5" /> : null}
                {initialDoc ? 'UPDATE QUOTATION RECORD' : 'GENERATE PDF DOCUMENT'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL: Add New Item to Master Inventory */}
      {isAddingToInventory && (
        <div className="fixed inset-0 z-[210] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-md rounded-[3rem] p-10 space-y-8 shadow-[0_50px_100px_rgba(0,0,0,0.8)]">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-black text-white font-syncopate uppercase tracking-tighter flex items-center gap-3">
                <PlusCircle className="text-purple-500" /> Library Sync
              </h3>
              <button onClick={() => setIsAddingToInventory(false)} className="p-2 hover:bg-zinc-800 rounded-xl text-zinc-500"><X className="w-6 h-6" /></button>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Asset Name</label>
                <input
                  type="text"
                  value={newInvName}
                  onChange={(e) => setNewInvName(e.target.value)}
                  placeholder="e.g. Pioneer CDJ-3000"
                  className="w-full bg-black border border-zinc-800 rounded-2xl px-6 py-4 text-sm text-white focus:ring-1 focus:ring-purple-500 outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Category</label>
                <select
                  value={newInvCategory}
                  onChange={(e) => setNewInvCategory(e.target.value as any)}
                  className="w-full bg-black border border-zinc-800 rounded-2xl px-6 py-4 text-sm text-white focus:ring-1 focus:ring-purple-500 outline-none appearance-none"
                >
                  <option value="DJ">DJ Gear</option>
                  <option value="Audio">Audio / Speakers</option>
                  <option value="Lighting">Lighting</option>
                  <option value="Backline">Backline</option>
                  <option value="Stage">Staging</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Daily Rate (LKR)</label>
                <input
                  type="number"
                  value={newInvRate}
                  onChange={(e) => setNewInvRate(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-black border border-zinc-800 rounded-2xl px-6 py-4 text-sm text-white focus:ring-1 focus:ring-purple-500 outline-none"
                />
              </div>
            </div>

            <button
              onClick={addToMasterInventory}
              disabled={!newInvName || !newInvRate}
              className="w-full py-5 bg-purple-600 hover:bg-purple-700 text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest shadow-2xl transition-all active:scale-95 disabled:opacity-50"
            >
              REGISTER NEW ASSET
            </button>
          </div>
        </div>
      )}

      {/* PDF Generation Modal */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-2xl p-4 md:p-10">
          <div className="bg-white text-black w-full max-w-5xl rounded-[3.5rem] overflow-hidden shadow-2xl flex flex-col max-h-[92dvh] animate-in zoom-in-95 duration-500">
            <div className="p-8 md:p-12 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/80">
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 rounded-2xl bg-black flex items-center justify-center shadow-xl shadow-black/20"><FileText className="w-7 h-7 text-white" /></div>
                <div>
                  <h3 className="text-2xl md:text-3xl font-black font-syncopate uppercase tracking-tighter leading-none">{initialDoc ? 'Modified Quote' : 'Document Preview'}</h3>
                  <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mt-1">Ref: {initialDoc?.fileName.split('_')[0] || 'QTN-' + Math.floor(1000 + Math.random() * 9000)}</p>
                </div>
              </div>
              <button onClick={() => setIsPreviewOpen(false)} className="p-4 bg-zinc-200/50 hover:bg-zinc-200 rounded-full transition-all text-zinc-500 active:scale-90"><X className="w-6 h-6" /></button>
            </div>

            <div ref={pdfRef} className="flex-1 overflow-y-auto p-12 md:p-24 space-y-16 font-serif bg-white text-zinc-900 custom-scrollbar">
              <div className="flex justify-between items-start border-b pb-12 border-zinc-100">
                <div className="space-y-4">
                  <h2 className="text-4xl font-black uppercase font-syncopate">BLACK BEAUTY</h2>
                  <div className="text-xs text-zinc-500 space-y-1">
                    <p>Global Talent & Production Agency</p>
                    <p>Tower 12, Financial District, Colombo</p>
                  </div>
                </div>
                <div className="text-right space-y-4">
                  <div className="bg-zinc-50 p-6 rounded-2xl border border-zinc-100 inline-block text-left min-w-[240px]">
                    <p className="text-[9px] font-black uppercase text-zinc-300 tracking-[0.3em] mb-4">Bill To Recipient</p>
                    {selectedClient ? (
                      <div className="space-y-1">
                        <p className="text-sm font-black">{selectedClient.name}</p>
                        <p className="text-xs font-bold text-purple-600 uppercase tracking-widest">{selectedClient.company}</p>
                        <p className="text-[10px] text-zinc-500">{selectedClient.email}</p>
                        <p className="text-[10px] text-zinc-500">{selectedClient.phone}</p>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <p className="text-sm font-black">{selectedGig?.venue}</p>
                        <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">{selectedGig?.city}</p>
                      </div>
                    )}
                  </div>
                  <div className="pt-4">
                    <p className="text-[9px] font-black text-zinc-300 uppercase tracking-widest">Document Date</p>
                    <p className="text-sm font-bold">{new Date().toLocaleDateString('en-US', { dateStyle: 'full' })}</p>
                  </div>
                </div>
              </div>

              <table className="w-full">
                <thead>
                  <tr className="text-[10px] font-black uppercase text-zinc-400 border-b border-zinc-100 text-left">
                    <th className="pb-6 w-3/5">Description of Service</th>
                    <th className="pb-6 text-center">Qty</th>
                    <th className="pb-6 text-right">Unit Rate</th>
                    <th className="pb-6 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50">
                  {includeArtistFee && selectedGig && (
                    <tr className="text-sm">
                      <td className="py-8">
                        <p className="font-black text-lg text-black uppercase tracking-tight">Performance Fee: Black Beauty</p>
                        <p className="text-xs text-zinc-400 mt-1 uppercase font-black">Engagement at {selectedGig.venue}</p>
                      </td>
                      <td className="py-8 text-center font-bold">1</td>
                      <td className="py-8 text-right font-medium">{artistFee.toLocaleString()}</td>
                      <td className="py-8 text-right font-black">{artistFee.toLocaleString()}</td>
                    </tr>
                  )}
                  {items.map(item => (
                    <tr key={item.id} className="text-sm">
                      <td className="py-8">
                        <p className="text-base font-bold text-zinc-800 uppercase tracking-tight">{item.description}</p>
                        <p className="text-[10px] text-zinc-400 mt-1 uppercase font-black">Production Service</p>
                      </td>
                      <td className="py-8 text-center font-bold">{item.quantity}</td>
                      <td className="py-8 text-right font-medium">{item.rate.toLocaleString()}</td>
                      <td className="py-8 text-right font-black">{(item.quantity * item.rate).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="flex flex-col md:flex-row justify-between pt-16 border-t border-zinc-100 gap-12">
                <div className="flex-1 max-w-sm p-8 bg-zinc-50 rounded-[2rem] border border-zinc-100">
                  <h4 className="text-[9px] font-black uppercase text-zinc-400 tracking-widest mb-4">Terms & Logistics</h4>
                  <ul className="text-[10px] space-y-2 text-zinc-500 font-medium">
                    <li>• Quote valid for 14 days from issue date.</li>
                    <li>• 50% technical deposit required for equipment booking.</li>
                    <li>• Rider specifications must be met by venue management.</li>
                  </ul>
                </div>
                <div className="w-full md:w-80 space-y-6">
                  <div className="flex justify-between items-center text-xs font-bold text-zinc-400 uppercase tracking-widest">
                    <span>Subtotal</span>
                    <span>LKR {totalQuoteAmount.toLocaleString()}</span>
                  </div>
                  <div className="pt-6 border-t border-black flex flex-col gap-2">
                    <span className="font-black text-[10px] uppercase tracking-[0.4em] text-zinc-300">Net Payable Amount</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-xs font-black uppercase tracking-widest">LKR</span>
                      <span className="text-5xl font-black font-syncopate tracking-tighter">{totalQuoteAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 md:p-12 bg-zinc-50/80 border-t border-zinc-100 flex flex-col sm:flex-row gap-6">
              <button
                onClick={handleSave}
                className="flex-1 py-6 bg-black text-white rounded-[2rem] text-xs font-black uppercase tracking-[0.2em] flex items-center justify-center gap-4 shadow-2xl hover:scale-[1.01] active:scale-95 transition-all"
              >
                <Save className="w-5 h-5" /> SYNC TO VAULT
              </button>
              <button onClick={() => window.print()} className="p-6 bg-zinc-200 rounded-[2rem] hover:bg-zinc-300 transition-all text-zinc-600 active:scale-90"><Printer className="w-6 h-6" /></button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuotationBuilder;
