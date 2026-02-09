
import React, { useRef, useState } from 'react';
import { GeneratedVariation } from '../types';
import { STYLE_VARIATIONS } from '../constants';

interface Props {
  variations: GeneratedVariation[];
  color: string;
  bgColor: string;
}

const PosterPreview: React.FC<Props> = ({ variations, color, bgColor }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isGeneratingPoster, setIsGeneratingPoster] = useState(false);

  const generatePoster = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    setIsGeneratingPoster(true);
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Dimensions for an 8 column x 7 row high-quality grid
    const columns = 8;
    const rows = 7;
    const cellSize = 1024; // High res per variation in the poster
    const padding = 100;
    const margin = 400;
    const headerHeight = 800;
    const footerHeight = 400;
    
    const width = (cellSize * columns) + (padding * (columns - 1)) + (margin * 2);
    const height = (cellSize * rows) + (padding * (rows - 1)) + (margin * 2) + headerHeight + footerHeight;

    canvas.width = width;
    canvas.height = height;

    // 1. Fill Canvas
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);

    // 2. Title Header
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.font = 'bold 300px Space Grotesk, sans-serif';
    ctx.fillText('STYLE EXPEDITION', width / 2, margin + 250);
    
    ctx.font = '500 100px Inter, sans-serif';
    ctx.letterSpacing = '15px';
    ctx.fillText('56 MONOCHROME VARIATIONS • 8 × 7 MATRIX • STAGE 1 PREVIEW', width / 2, margin + 440);

    // 3. Grid rendering
    ctx.textAlign = 'left';
    ctx.letterSpacing = '0px';
    
    for (let i = 0; i < variations.length; i++) {
      const v = variations[i];
      if (!v.imageUrl) continue;

      const col = i % columns;
      const row = Math.floor(i / columns);
      
      const x = margin + col * (cellSize + padding);
      const y = margin + headerHeight + row * (cellSize + padding);

      // Draw white base
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.roundRect(x, y, cellSize, cellSize, 30);
      ctx.fill();

      // Load image
      const img = new Image();
      img.src = v.highResUrl || v.imageUrl;
      await new Promise(res => { img.onload = res; });
      
      const internalPadding = 80;
      ctx.drawImage(img, x + internalPadding, y + internalPadding, cellSize - internalPadding*2, cellSize - internalPadding*2);
      
      // Label the ID
      ctx.fillStyle = color;
      ctx.font = 'bold 44px Inter, sans-serif';
      const label = (i + 1).toString().padStart(2, '0');
      ctx.fillText(label, x + 40, y + 80);
      
      const style = STYLE_VARIATIONS.find(s => s.id === v.styleId);
      if (style) {
        ctx.font = '600 34px Inter, sans-serif';
        ctx.globalAlpha = 0.4;
        ctx.fillText(style.name.toUpperCase(), x + 40, y + cellSize - 50);
        ctx.globalAlpha = 1.0;
      }
    }

    // 4. Footer Branding
    ctx.fillStyle = color;
    ctx.fillRect(margin, height - margin - 350, width - (margin * 2), 8);
    
    ctx.textAlign = 'left';
    ctx.font = 'bold 80px Inter, sans-serif';
    ctx.fillText('COBALT ARCHIVE LAB', margin, height - margin - 180);
    
    ctx.textAlign = 'right';
    ctx.font = '500 60px Inter, sans-serif';
    ctx.fillText('GENERATED VIA GEMINI 3 PRO • HIGH DEFINITION PREVIEW GRID', width - margin, height - margin - 180);

    // 5. Trigger download
    const dataUrl = canvas.toDataURL('image/png', 1.0);
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `Style_Archive_Matrix_Poster.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setIsGeneratingPoster(false);
  };

  const isReady = variations.filter(v => v.imageUrl).length >= 56;

  return (
    <>
      <canvas ref={canvasRef} className="hidden" />
      <button
        onClick={generatePoster}
        disabled={isGeneratingPoster || !isReady}
        className="px-10 py-5 bg-black text-white rounded-full font-bold shadow-2xl transition-all hover:bg-gray-800 disabled:opacity-20 flex items-center gap-3 active:scale-95 group"
      >
        {isGeneratingPoster ? (
          <>
            <div className="w-5 h-5 border-3 border-white/30 border-t-white animate-spin rounded-full"></div>
            Merging Poster...
          </>
        ) : (
          <>
            <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            Download Full Grid Poster
          </>
        )}
      </button>
    </>
  );
};

export default PosterPreview;
