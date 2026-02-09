
import React, { useState, useCallback, useEffect } from 'react';
import { 
  AppStep, 
  GenerationState, 
  GeneratedVariation 
} from './types';
import { 
  STYLE_VARIATIONS, 
  THEME_COLORS
} from './constants';
import { GeminiService } from './GeminiService';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import StyleGrid from './components/StyleGrid';
import ProgressTracker from './components/ProgressTracker';
import PosterPreview from './components/PosterPreview';

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>(AppStep.INITIAL);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('gemini_api_key') || '');
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [hasApiKey, setHasApiKey] = useState(() => !!localStorage.getItem('gemini_api_key'));
  const [baseImage, setBaseImage] = useState<string | null>(null);
  const [themeIndex, setThemeIndex] = useState(0);
  const [genState, setGenState] = useState<GenerationState>({
    isGenerating: false,
    currentIndex: 0,
    variations: [],
  });

  const [highResQueue, setHighResQueue] = useState<number[]>([]);
  const [highResIndex, setHighResIndex] = useState(0);

  const handleSaveApiKey = () => {
    const key = apiKeyInput.trim();
    if (!key) return;
    localStorage.setItem('gemini_api_key', key);
    setApiKey(key);
    setHasApiKey(true);
  };

  const handleClearApiKey = () => {
    localStorage.removeItem('gemini_api_key');
    setApiKey('');
    setApiKeyInput('');
    setHasApiKey(false);
  };

  const onImageUpload = (base64: string) => {
    setBaseImage(base64);
    setStep(AppStep.UPLOAD);
  };

  const startStageOne = async () => {
    if (!baseImage) return;
    setStep(AppStep.GENERATING_PREVIEWS);
    setGenState({
      isGenerating: true,
      currentIndex: 0,
      variations: STYLE_VARIATIONS.map(s => ({
        styleId: s.id,
        imageUrl: '',
        status: 'pending'
      })),
    });
  };

  const processNextPreview = useCallback(async () => {
    if (step !== AppStep.GENERATING_PREVIEWS || genState.currentIndex >= STYLE_VARIATIONS.length) {
      if (genState.currentIndex >= STYLE_VARIATIONS.length && step === AppStep.GENERATING_PREVIEWS) {
        setStep(AppStep.REVIEW);
      }
      return;
    }

    const currentStyle = STYLE_VARIATIONS[genState.currentIndex];
    const service = new GeminiService(apiKey);

    try {
      const url = await service.generateStyleVariation(baseImage!, currentStyle.prompt, themeIndex, "1K");
      setGenState(prev => {
        const newVariations = [...prev.variations];
        newVariations[prev.currentIndex] = { 
          ...newVariations[prev.currentIndex], 
          imageUrl: url, 
          status: 'completed' 
        };
        return { ...prev, currentIndex: prev.currentIndex + 1, variations: newVariations };
      });
    } catch (err: any) {
      console.error(err);
      setGenState(prev => {
        const newVariations = [...prev.variations];
        newVariations[prev.currentIndex] = { 
          ...newVariations[prev.currentIndex], 
          status: 'error', 
          error: err.message 
        };
        return { ...prev, currentIndex: prev.currentIndex + 1, variations: newVariations };
      });
    }
  }, [step, genState.currentIndex, baseImage, themeIndex, apiKey]);

  useEffect(() => {
    if (step === AppStep.GENERATING_PREVIEWS) {
      processNextPreview();
    }
  }, [step, genState.currentIndex, processNextPreview]);

  const toggleSelection = (styleId: number) => {
    setGenState(prev => ({
      ...prev,
      variations: prev.variations.map(v => 
        v.styleId === styleId ? { ...v, selected: !v.selected } : v
      )
    }));
  };

  const startStageTwo = () => {
    const selected = genState.variations
      .filter(v => v.selected && v.status === 'completed')
      .map(v => v.styleId);
    
    if (selected.length === 0) return;
    
    setHighResQueue(selected);
    setHighResIndex(0);
    setStep(AppStep.GENERATING_HIGHRES);
  };

  const processNextHighRes = useCallback(async () => {
    if (step !== AppStep.GENERATING_HIGHRES || highResIndex >= highResQueue.length) {
      if (highResIndex >= highResQueue.length && highResQueue.length > 0) {
        setStep(AppStep.COMPLETE);
      }
      return;
    }

    const styleId = highResQueue[highResIndex];
    const style = STYLE_VARIATIONS.find(s => s.id === styleId);
    const service = new GeminiService(apiKey);

    try {
      setGenState(prev => ({
        ...prev,
        variations: prev.variations.map(v => v.styleId === styleId ? { ...v, status: 'upgrading' } : v)
      }));

      const url = await service.generateStyleVariation(baseImage!, style!.prompt, themeIndex, "4K");
      
      setGenState(prev => ({
        ...prev,
        variations: prev.variations.map(v => v.styleId === styleId ? { ...v, highResUrl: url, status: 'completed' } : v)
      }));
      setHighResIndex(prev => prev + 1);
    } catch (err) {
      console.error(err);
      setHighResIndex(prev => prev + 1);
    }
  }, [step, highResIndex, highResQueue, baseImage, themeIndex, apiKey]);

  useEffect(() => {
    if (step === AppStep.GENERATING_HIGHRES) {
      processNextHighRes();
    }
  }, [step, highResIndex, processNextHighRes]);

  const reset = () => {
    setStep(AppStep.INITIAL);
    setBaseImage(null);
    setGenState({ isGenerating: false, currentIndex: 0, variations: [] });
    setHighResQueue([]);
    setHighResIndex(0);
  };

  const theme = THEME_COLORS[themeIndex];
  const selectedCount = genState.variations.filter(v => v.selected).length;

  return (
    <div className="min-h-screen pb-20 transition-colors duration-700" style={{ backgroundColor: theme.bg }}>
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {!hasApiKey && (
          <div className="bg-white p-12 rounded-[2.5rem] shadow-2xl border border-gray-100 text-center animate-in zoom-in duration-300 max-w-xl mx-auto">
            <h2 className="text-3xl font-display font-bold mb-4">Enter Your Gemini API Key</h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto leading-relaxed">
              This app uses Google Gemini to generate style variations. You need your own API key to use it.
              <br />
              <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline hover:text-blue-700">Get a free API key here</a>
            </p>
            <div className="flex gap-3 max-w-md mx-auto">
              <input
                type="password"
                value={apiKeyInput}
                onChange={e => setApiKeyInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSaveApiKey()}
                placeholder="Paste your Gemini API Key..."
                className="flex-1 px-6 py-4 border-2 border-gray-200 rounded-full text-center focus:outline-none focus:border-black transition-colors"
              />
              <button
                onClick={handleSaveApiKey}
                className="px-10 py-4 bg-black text-white rounded-full font-bold shadow-xl active:scale-95 transition-all hover:bg-gray-800"
              >
                Start
              </button>
            </div>
            <p className="text-gray-400 text-xs mt-4">Your key is stored locally in your browser only.</p>
          </div>
        )}

        {hasApiKey && (
          <>
            {step === AppStep.INITIAL && (
              <div className="text-center py-12 animate-in fade-in duration-700">
                <div className="mb-14 text-center">
                   <h2 className="text-6xl font-display font-bold text-gray-900 mb-6 tracking-tight">Stage 1: Preview Grid</h2>
                   <p className="text-gray-500 text-lg max-w-2xl mx-auto">Generate a complete set of 56 style variations. Once done, download the full poster or select items for 4K upgrade.</p>
                </div>

                <div className="flex flex-wrap justify-center gap-8 mb-20">
                   {THEME_COLORS.map((t, idx) => (
                     <button key={idx} onClick={() => setThemeIndex(idx)} className="flex flex-col items-center gap-3 group">
                       <div 
                         className={`w-18 h-18 rounded-[2rem] border-4 transition-all flex items-center justify-center ${themeIndex === idx ? 'scale-110 shadow-2xl border-white ring-4 ring-black/5' : 'border-transparent opacity-40 hover:opacity-100'}`} 
                         style={{ backgroundColor: t.hex }}
                       >
                         {themeIndex === idx && <div className="w-3 h-3 bg-white rounded-full animate-pulse shadow-inner"></div>}
                       </div>
                       <span className={`text-[12px] font-black uppercase tracking-[0.2em] ${themeIndex === idx ? 'text-black' : 'text-gray-400'}`}>{t.name}</span>
                     </button>
                   ))}
                </div>
                
                <ImageUploader onUpload={onImageUpload} />
              </div>
            )}

            {step === AppStep.UPLOAD && baseImage && (
              <div className="flex flex-col items-center animate-in fade-in slide-in-from-bottom-8 duration-600">
                <div className="p-8 bg-white rounded-[3rem] shadow-2xl mb-12 border-4 border-white ring-1 ring-black/5">
                  <img src={baseImage} className="w-72 h-72 object-contain rounded-3xl" />
                  <div className="mt-6 text-center">
                    <span className="px-4 py-1.5 bg-gray-50 rounded-full text-[11px] font-black text-gray-400 uppercase tracking-widest">Reference Locked</span>
                  </div>
                </div>
                
                <div className="flex flex-col items-center gap-6">
                  <button
                    onClick={startStageOne}
                    className="group relative overflow-hidden px-16 py-6 text-white rounded-full text-2xl font-display font-bold transition-all shadow-2xl hover:scale-105 active:scale-95"
                    style={{ backgroundColor: theme.hex }}
                  >
                    Generate Full Matrix
                  </button>
                  <button onClick={reset} className="text-gray-400 hover:text-black font-bold uppercase text-[11px] tracking-[0.4em]">Cancel</button>
                </div>
              </div>
            )}

            {(step === AppStep.GENERATING_PREVIEWS || step === AppStep.REVIEW || step === AppStep.GENERATING_HIGHRES || step === AppStep.COMPLETE) && (
              <div className="space-y-16">
                <ProgressTracker 
                  current={step === AppStep.GENERATING_HIGHRES ? highResIndex : genState.currentIndex} 
                  total={step === AppStep.GENERATING_HIGHRES ? highResQueue.length : STYLE_VARIATIONS.length} 
                  isComplete={step === AppStep.REVIEW || step === AppStep.COMPLETE}
                  title={step === AppStep.GENERATING_HIGHRES ? "Stage 2: 4K High-Res Processing" : "Stage 1: Rendering All Previews"}
                  color={theme.hex}
                />
                
                {(step === AppStep.REVIEW || step === AppStep.COMPLETE) && (
                  <div className="sticky top-24 z-50 animate-in slide-in-from-top-6 duration-600">
                    <div className="bg-white/80 backdrop-blur-3xl p-10 rounded-[3.5rem] shadow-2xl border border-white flex flex-col lg:flex-row items-center justify-between gap-10">
                      <div className="text-left flex items-center gap-8">
                        <div className="w-24 h-24 bg-gray-50 rounded-[2rem] p-3 border border-black/5 shadow-inner shrink-0">
                          <img src={baseImage || ''} className="w-full h-full object-contain rounded-xl" />
                        </div>
                        <div>
                          <h3 className="text-3xl font-display font-bold text-gray-900 leading-tight mb-2">Matrix Ready</h3>
                          <p className="text-gray-500 max-w-sm">Download the <b>Full Grid Poster</b> or select individual items to upgrade to <b>Stage 2 (4K resolution)</b>.</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap items-center justify-center gap-8">
                        <PosterPreview variations={genState.variations} color={theme.hex} bgColor={theme.bg} />
                        
                        <div className="w-px h-16 bg-black/10 hidden lg:block" />
                        
                        <button 
                          onClick={startStageTwo}
                          className="px-14 py-5 text-white rounded-full font-bold shadow-2xl hover:scale-105 active:scale-95 transition-all disabled:opacity-20 flex items-center gap-4 text-lg"
                          style={{ backgroundColor: theme.hex }}
                          disabled={selectedCount === 0 || step === AppStep.GENERATING_HIGHRES}
                        >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                          Upgrade Selection ({selectedCount})
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="bg-white/40 p-14 rounded-[4.5rem] shadow-inner border border-white/60 backdrop-blur-sm">
                  <div className="flex flex-col md:flex-row items-center justify-between mb-16 px-8 gap-6 text-center md:text-left">
                     <h4 className="text-4xl font-display font-bold text-gray-900">Archive Grid <span className="text-gray-300 font-light ml-4">8×7</span></h4>
                     <div className="flex flex-wrap items-center justify-center gap-8 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">
                        <span className="flex items-center gap-2.5 px-4 py-2 bg-white/50 rounded-full border border-white/80"><div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-sm"></div> Select for 4K</span>
                        <span className="flex items-center gap-2.5 px-4 py-2 bg-white/50 rounded-full border border-white/80"><div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-sm"></div> High-Res Ready</span>
                     </div>
                  </div>
                  <StyleGrid 
                    variations={genState.variations} 
                    onSelect={(step === AppStep.REVIEW || step === AppStep.COMPLETE) ? toggleSelection : undefined} 
                    color={theme.hex}
                  />
                </div>
                
                {(step === AppStep.REVIEW || step === AppStep.COMPLETE) && (
                  <div className="flex justify-center pt-12">
                     <button onClick={reset} className="px-12 py-4 border-2 border-black/10 text-gray-400 hover:text-black hover:border-black/30 rounded-full font-bold uppercase text-[11px] tracking-[0.4em] transition-all flex items-center gap-4">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                        Restart Experiment
                     </button>
                  </div>
                )}
              </div>
            )}
          </>
        )}
        {hasApiKey && (
          <div className="text-center mt-16">
            <button onClick={handleClearApiKey} className="text-gray-400 hover:text-gray-600 text-xs underline transition-colors">
              Change API Key
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
