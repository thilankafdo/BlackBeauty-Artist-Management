
import React, { useState } from 'react';
import { Music, ShieldCheck, ArrowRight, User, Lock } from 'lucide-react';
import { AuthRole } from '../types';

interface AuthProps {
  onLogin: (role: AuthRole) => void;
  background: string;
}

const Auth: React.FC<AuthProps> = ({ onLogin, background }) => {
  const [selectedRole, setSelectedRole] = useState<AuthRole>('Artist');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = () => {
    setIsLoggingIn(true);
    setTimeout(() => {
      onLogin(selectedRole);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black flex overflow-hidden">
      {/* Left Content Side */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 relative">
        {/* Background Decorative Elements */}
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none"></div>
        
        <div className="w-full max-w-xl space-y-10 relative z-10 animate-in fade-in zoom-in-95 duration-700 flex flex-col items-center">
          {/* Logo Section */}
          <div className="text-center w-full flex flex-col items-center">
            <div className="relative">
               <h1 className="font-logo text-8xl md:text-[10rem] text-white neon-logo-glow leading-[0.8] whitespace-nowrap px-4">
                 Black Beauty
               </h1>
            </div>
            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.5em] mt-10 opacity-60">Management Portal v2.0</p>
          </div>

          {/* Role Selection Container */}
          <div className="w-full max-w-md space-y-8 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setSelectedRole('Artist')}
                className={`relative p-8 rounded-[2.5rem] border transition-all duration-500 flex flex-col items-center gap-4 ${
                  selectedRole === 'Artist' 
                    ? 'bg-zinc-900 border-purple-500/50 shadow-[0_20px_40px_rgba(168,85,247,0.15)] ring-1 ring-purple-500/20' 
                    : 'bg-zinc-950 border-zinc-900 text-zinc-700 grayscale'
                }`}
              >
                <User className={`w-8 h-8 transition-colors ${selectedRole === 'Artist' ? 'text-purple-500' : 'text-zinc-800'}`} />
                <span className="text-[10px] font-black uppercase tracking-widest">Artist</span>
                {selectedRole === 'Artist' && <div className="absolute top-4 right-4 w-2 h-2 bg-purple-500 rounded-full shadow-[0_0_10px_#a855f7]"></div>}
              </button>
              <button 
                onClick={() => setSelectedRole('Manager')}
                className={`relative p-8 rounded-[2.5rem] border transition-all duration-500 flex flex-col items-center gap-4 ${
                  selectedRole === 'Manager' 
                    ? 'bg-zinc-900 border-purple-500/50 shadow-[0_20px_40px_rgba(168,85,247,0.15)] ring-1 ring-purple-500/20' 
                    : 'bg-zinc-950 border-zinc-900 text-zinc-700 grayscale'
                }`}
              >
                <ShieldCheck className={`w-8 h-8 transition-colors ${selectedRole === 'Manager' ? 'text-purple-500' : 'text-zinc-800'}`} />
                <span className="text-[10px] font-black uppercase tracking-widest">Manager</span>
                {selectedRole === 'Manager' && <div className="absolute top-4 right-4 w-2 h-2 bg-purple-500 rounded-full shadow-[0_0_10px_#a855f7]"></div>}
              </button>
            </div>

            <div className="space-y-4">
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-700 group-focus-within:text-purple-400 transition-colors" />
                <input 
                  type="password" 
                  placeholder="Access Code"
                  defaultValue="••••••••"
                  className="w-full bg-zinc-900/40 border border-zinc-800/50 rounded-2xl py-5 pl-14 pr-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-purple-500/50 transition-all placeholder:text-zinc-800 shadow-inner"
                />
              </div>
              <button 
                onClick={handleLogin}
                disabled={isLoggingIn}
                className="w-full py-5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-purple-600/30 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {isLoggingIn ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                    Verifying Gateway...
                  </>
                ) : (
                  <>
                    Unlock Session <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <footer className="absolute bottom-10 text-center w-full">
          <p className="text-[8px] text-zinc-800 font-black uppercase tracking-[0.6em] opacity-40">Encrypted Management Session • All Rights Reserved</p>
        </footer>
      </div>

      {/* Right Image Side (Dynamic) */}
      <div className="hidden lg:block w-[40%] h-full relative">
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/20 to-transparent z-10"></div>
        <img 
          src={background} 
          alt="Artist Portrait" 
          className="w-full h-full object-cover grayscale-[0.2] contrast-[1.1]"
        />
        <div className="absolute bottom-12 left-12 z-20 space-y-1">
          <p className="text-white text-xs font-black uppercase tracking-widest bg-black/40 backdrop-blur-md px-3 py-1 inline-block">Artist Spotlight</p>
          <h2 className="text-3xl font-syncopate font-black text-white leading-none uppercase tracking-tighter">Edition 01</h2>
        </div>
      </div>
    </div>
  );
};

export default Auth;
