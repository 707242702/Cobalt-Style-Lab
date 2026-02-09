
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="py-8 sticky top-0 z-[60] backdrop-blur-xl bg-white/50 border-b border-black/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 bg-black rounded-2xl rotate-6 absolute inset-0 blur-lg opacity-20"></div>
            <div className="w-12 h-12 bg-black rounded-2xl rotate-6 flex items-center justify-center relative shadow-2xl border border-white/10">
               <div className="w-6 h-6 border-2 border-white rounded-full flex items-center justify-center">
                 <div className="w-1 h-1 bg-white rounded-full"></div>
               </div>
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold tracking-tighter text-black">
              STYLE<span className="text-gray-400 font-light ml-1">EXPEDITION</span>
            </h1>
            <div className="flex items-center gap-2">
              <span className="block h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Experimental Lab v1.0.4</span>
            </div>
          </div>
        </div>
        
        <div className="hidden lg:flex items-center gap-10">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Batch Matrix</span>
            <span className="text-sm font-display font-bold text-black">8 × 7 GRID</span>
          </div>
          <div className="h-6 w-px bg-black/10"></div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Resolution Mode</span>
            <span className="text-sm font-display font-bold text-black">DUAL-STAGE 4K</span>
          </div>
          <div className="h-6 w-px bg-black/10"></div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Output Method</span>
            <span className="text-sm font-display font-bold text-black">MONOCHROME RISO</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
