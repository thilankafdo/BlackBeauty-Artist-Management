
import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  ImageIcon,
  Music,
  Video,
  FileText,
  ExternalLink,
  Save,
  Wand2
} from 'lucide-react';
import { geminiService } from '../services/geminiService';

const ARTIST_PHOTOS = [
  "/assets/images/img-1.png", // Main black dress
  "/assets/images/img-5.png", // Headphones
  "/assets/images/img-3.jpg", // Blue sheer dress close
  "/assets/images/img-2.png", // Blue sheer dress full
];

const EPKBuilder: React.FC = () => {
  const [bio, setBio] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [bioPrompt, setBioPrompt] = useState('');

  const handleGenerateBio = async () => {
    if (!bioPrompt) return;
    setIsGenerating(true);
    try {
      const generated = await geminiService.generateBio(bioPrompt);
      if (generated) setBio(generated);
    } catch (error) {
      console.error("Failed to generate bio", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-in fade-in duration-500">
      {/* Editor Side */}
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-black text-white font-syncopate uppercase tracking-tighter mb-2">EPK Designer</h2>
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Global industry assets management</p>
        </div>

        {/* Bio Section */}
        <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-[2.5rem] space-y-6 shadow-2xl">
          <div className="flex items-center justify-between">
            <h3 className="font-bold flex items-center gap-3 text-white uppercase tracking-tight">
              <FileText className="w-5 h-5 text-purple-500" />
              Artist Biography
            </h3>
            <button
              onClick={() => handleGenerateBio()}
              disabled={isGenerating}
              className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2 px-4 py-2 bg-purple-600/10 text-purple-400 rounded-xl hover:bg-purple-600/20 transition-colors disabled:opacity-50 border border-purple-600/20"
            >
              <Wand2 className="w-3 h-3" />
              {isGenerating ? 'Drafting...' : 'AI Synchronize'}
            </button>
          </div>

          <div className="space-y-2">
            <p className="text-[9px] text-zinc-600 uppercase tracking-widest font-black">AI Contextual Guidance</p>
            <input
              type="text"
              placeholder="E.g. Sri Lankan heritage, dark techno vibes, EDC 2024 highlight..."
              className="w-full bg-black border border-zinc-800 rounded-2xl p-4 text-xs focus:ring-1 focus:ring-purple-500 outline-none text-zinc-300 shadow-inner"
              value={bioPrompt}
              onChange={(e) => setBioPrompt(e.target.value)}
            />
          </div>

          <textarea
            className="w-full h-48 bg-black border border-zinc-800 rounded-2xl p-5 text-sm text-zinc-400 focus:ring-1 focus:ring-purple-500 outline-none resize-none shadow-inner leading-relaxed"
            placeholder="Artist biography content..."
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
        </div>

        {/* Assets Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-[2.5rem] space-y-6 shadow-2xl">
            <h3 className="font-bold flex items-center gap-3 text-white uppercase tracking-tight">
              <ImageIcon className="w-5 h-5 text-blue-500" /> Gallery Hub
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {ARTIST_PHOTOS.slice(0, 3).map((photo, i) => (
                <div key={i} className="aspect-square bg-zinc-800 rounded-2xl overflow-hidden border border-zinc-800 group relative cursor-pointer">
                  <img src={photo} className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all" alt="Press" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <Save className="w-5 h-5 text-white" />
                  </div>
                </div>
              ))}
              <div className="aspect-square bg-black rounded-2xl flex items-center justify-center border-2 border-dashed border-zinc-800 hover:border-purple-500/50 cursor-pointer transition-all group">
                <Plus className="w-6 h-6 text-zinc-800 group-hover:text-purple-500" />
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-[2.5rem] space-y-6 shadow-2xl">
            <h3 className="font-bold flex items-center gap-3 text-white uppercase tracking-tight">
              <Music className="w-5 h-5 text-pink-500" /> Key Catalog
            </h3>
            <div className="space-y-3">
              <div className="p-4 bg-black rounded-2xl flex items-center justify-between group border border-zinc-800">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-pink-500 shadow-[0_0_10px_rgba(236,72,153,0.5)]"></div>
                  <span className="text-xs font-bold text-zinc-300">Monolith Set (Live)</span>
                </div>
                <Trash2 className="w-4 h-4 text-zinc-800 group-hover:text-red-500 cursor-pointer transition-colors" />
              </div>
              <button className="w-full py-4 bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 border-dashed rounded-2xl text-[10px] font-black uppercase tracking-widest text-zinc-600 hover:text-purple-400 transition-all">
                + LINK DIGITAL ASSET
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Side */}
      <div className="bg-[#f8f8f8] rounded-[3.5rem] shadow-[0_50px_100px_rgba(0,0,0,0.4)] overflow-hidden text-black h-[850px] sticky top-8 flex flex-col border border-white/10">
        <div className="h-[450px] relative">
          <img src={ARTIST_PHOTOS[1]} className="w-full h-full object-cover" alt="Hero" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
          <div className="absolute bottom-10 left-10">
            <h1 className="text-5xl font-black text-white font-syncopate tracking-tighter leading-none mb-2">BLACK BEAUTY</h1>
            <div className="flex gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-white/60 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full">Techno</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-white/60 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full">Industrial</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-white/60 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full">Melodic</span>
            </div>
          </div>
        </div>

        <div className="p-12 flex-1 overflow-y-auto space-y-12 custom-scrollbar-light">
          <div className="space-y-6">
            <h4 className="text-[11px] uppercase tracking-[0.4em] font-black text-zinc-300">Executive Narrative</h4>
            <p className="text-sm leading-relaxed text-zinc-800 font-medium whitespace-pre-wrap font-serif">
              {bio || "Craft your narrative using the AI rewriting tool to the left. High-energy, professional storytelling is recommended for agency eyes."}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="text-[11px] uppercase tracking-[0.4em] font-black text-zinc-300">Representation</h4>
              <div className="space-y-1">
                <p className="text-xs font-black uppercase">Sarah Jenkins</p>
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Global Management</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-10 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">LIVE MASTER PREVIEW</span>
          </div>
          <button className="bg-black text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 hover:bg-zinc-800 transition-all active:scale-95 shadow-2xl">
            <Save className="w-4 h-4" /> LOCK & DEPLOY EPK
          </button>
        </div>
      </div>
    </div>
  );
};

export default EPKBuilder;
