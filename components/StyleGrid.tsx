
import React from 'react';
import { GeneratedVariation } from '../types';
import { STYLE_VARIATIONS } from '../constants';

interface Props {
  variations: GeneratedVariation[];
  onSelect?: (id: number) => void;
  color: string;
}

const StyleGrid: React.FC<Props> = ({ variations, onSelect, color }) => {
  const downloadImage = (url: string, name: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `${name}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-8">
      {variations.map((v, idx) => {
        const style = STYLE_VARIATIONS.find(s => s.id === v.styleId);
        const fileName = (idx + 1).toString().padStart(2, '0');
        const displayUrl = v.highResUrl || v.imageUrl;
        const isUpgraded = !!v.highResUrl;
        const isProcessing = v.status === 'processing' || v.status === 'pending' || v.status === 'upgrading';
        
        return (
          <div 
            key={v.styleId} 
            onClick={() => onSelect && onSelect(v.styleId)}
            className={`group relative flex flex-col bg-white rounded-[2.5rem] p-3 border-4 transition-all duration-300 ${onSelect ? 'cursor-pointer hover:shadow-2xl' : ''} ${v.selected ? 'border-blue-500 scale-[1.05] shadow-xl z-10' : 'border-white shadow-sm'}`}
          >
            {/* Stage 2 Selection indicator */}
            {onSelect && (
               <div className={`absolute top-5 right-5 z-20 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all shadow-lg ${v.selected ? 'bg-blue-500 border-blue-500 text-white scale-110' : 'bg-white/90 border-gray-100'}`}>
                 {v.selected && <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>}
               </div>
            )}
            
            <div className="aspect-square relative rounded-[2rem] overflow-hidden bg-gray-50 mb-4 flex items-center justify-center border border-black/5 shadow-inner">
              {v.status === 'completed' ? (
                <>
                  <img src={displayUrl} alt={style?.name} className="w-full h-full object-contain transition-transform group-hover:scale-110 duration-500" />
                  
                  {/* Visual indication of resolution level */}
                  <div className="absolute top-3 left-3 flex gap-2">
                    {isUpgraded ? (
                      <div className="bg-green-500 text-white text-[9px] px-2.5 py-1 rounded-full font-black shadow-lg animate-in zoom-in duration-500">4K ULTRA</div>
                    ) : (
                      <div className="bg-gray-400 text-white text-[9px] px-2.5 py-1 rounded-full font-black backdrop-blur-sm bg-gray-400/80">1K PREVIEW</div>
                    )}
                  </div>

                  {/* ONLY show individual high-res download for upgraded items */}
                  {isUpgraded && (
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                      <button 
                        onClick={(e) => { e.stopPropagation(); downloadImage(displayUrl, fileName); }}
                        className="p-4 bg-white rounded-full text-black shadow-2xl hover:scale-110 active:scale-90 transition-all"
                      >
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                      </button>
                    </div>
                  )}
                </>
              ) : isProcessing ? (
                <div className="flex flex-col items-center gap-4">
                  <div className="relative">
                    <div className="w-12 h-12 border-4 border-gray-100 rounded-full"></div>
                    <div className="absolute top-0 w-12 h-12 border-4 border-transparent border-t-blue-500 rounded-full animate-spin"></div>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                    {v.status === 'upgrading' ? 'Upgrading 4K' : 'Stage 1'}
                  </span>
                </div>
              ) : (
                <div className="text-red-500 flex flex-col items-center gap-2">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                  <span className="text-[9px] font-black">Error</span>
                </div>
              )}
            </div>

            <div className="px-3 pb-1">
               <h4 className="text-[12px] font-display font-bold text-gray-900 truncate mb-1 leading-none">{style?.name}</h4>
               <div className="flex items-center justify-between text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                 <span>{fileName}.png</span>
                 {isUpgraded && <span className="text-green-600">Export Ready</span>}
               </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StyleGrid;
