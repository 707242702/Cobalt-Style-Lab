
import React from 'react';

interface Props {
  current: number;
  total: number;
  isComplete: boolean;
  title?: string;
  color?: string;
}

const ProgressTracker: React.FC<Props> = ({ current, total, isComplete, title, color }) => {
  const percent = total === 0 ? 0 : Math.min(100, (current / total) * 100);

  return (
    <div className="rounded-[2rem] p-10 text-white shadow-2xl overflow-hidden relative transition-colors duration-500" style={{ backgroundColor: color || '#0047AB' }}>
      <div className="absolute top-0 right-0 p-8 opacity-10">
         <svg className="w-48 h-48" fill="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
      </div>
      
      <div className="relative z-10">
        <div className="flex justify-between items-end mb-4">
          <div>
            <h2 className="text-3xl font-display font-bold mb-1">
              {isComplete ? "Process Complete" : (title || "Generating...")}
            </h2>
            <p className="opacity-80">
              {isComplete 
                ? "All actions finished. You can now download or upgrade variations." 
                : `Batch processing: ${current + 1} of ${total}`}
            </p>
          </div>
          <div className="text-right">
             <span className="text-5xl font-display font-bold">{Math.round(percent)}%</span>
          </div>
        </div>

        <div className="h-4 w-full bg-black/10 rounded-full overflow-hidden border border-white/20">
          <div 
            className="h-full bg-white rounded-full transition-all duration-700 ease-out shadow-[0_0_15px_rgba(255,255,255,0.4)]"
            style={{ width: `${percent}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default ProgressTracker;
