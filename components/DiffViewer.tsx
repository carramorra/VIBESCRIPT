
import React, { useMemo } from 'react';
import { diffWords } from '../utils/diff';

interface DiffViewerProps {
  original: string;
  modified: string;
}

const DiffViewer: React.FC<DiffViewerProps> = ({ original, modified }) => {
  const diffParts = useMemo(() => diffWords(original, modified), [original, modified]);

  return (
    <div className="p-6 bg-white rounded-xl border border-slate-200 min-h-[150px] leading-relaxed text-lg">
      <div className="flex flex-wrap gap-y-1">
        {diffParts.map((part, index) => {
          if (part.added) {
            return (
              <span 
                key={index} 
                className="bg-emerald-100 text-emerald-800 px-1 rounded mx-0.5 border-b-2 border-emerald-300 animate-in fade-in zoom-in duration-300"
              >
                {part.value}
              </span>
            );
          }
          if (part.removed) {
            return (
              <span 
                key={index} 
                className="bg-red-50 text-red-400 line-through px-1 rounded mx-0.5 decoration-red-300"
              >
                {part.value}
              </span>
            );
          }
          return <span key={index} className="text-slate-700">{part.value}</span>;
        })}
      </div>
    </div>
  );
};

export default DiffViewer;
