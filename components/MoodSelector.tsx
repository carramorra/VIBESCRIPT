import React from 'react';
import { Mood, MoodConfig } from '../types';
import { MOODS } from '../constants';

interface MoodSelectorProps {
  selectedMood: Mood | null;
  onSelect: (mood: Mood) => void;
  isLoading: boolean;
}

const MoodSelector: React.FC<MoodSelectorProps> = ({ selectedMood, onSelect, isLoading }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {MOODS.map((mood: MoodConfig) => {
        const isActive = selectedMood === mood.id;
        return (
          <button
            key={mood.id}
            onClick={() => onSelect(mood.id)}
            disabled={isLoading}
            className={`
              flex flex-col items-center justify-center p-4 rounded-xl transition-all border-2
              ${isActive 
                ? `${mood.color} text-white border-transparent scale-105 shadow-lg` 
                : 'bg-white text-slate-700 border-slate-100 hover:border-slate-300 hover:bg-slate-50'
              }
              ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            <span className="text-2xl mb-1">{mood.icon}</span>
            <span className="font-semibold text-sm">{mood.label}</span>
            <span className={`text-[10px] mt-1 ${isActive ? 'text-white/80' : 'text-slate-400'}`}>
              {mood.description}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default MoodSelector;
