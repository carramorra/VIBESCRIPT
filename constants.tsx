import { Mood, MoodConfig } from './types';

export const MOODS: MoodConfig[] = [
  { 
    id: Mood.FORMAL, 
    label: 'Formal', 
    icon: '👔', 
    description: 'Professional and structured',
    color: 'bg-slate-700'
  },
  { 
    id: Mood.FRIENDLY, 
    label: 'Friendly', 
    icon: '👋', 
    description: 'Warm and approachable',
    color: 'bg-emerald-600'
  },
  { 
    id: Mood.POLITE, 
    label: 'Polite', 
    icon: '🙏', 
    description: 'Respectful and indirect',
    color: 'bg-blue-600'
  },
  { 
    id: Mood.CONCISE, 
    label: 'Concise', 
    icon: '✂️', 
    description: 'Minimalist and direct',
    color: 'bg-gray-800'
  },
  { 
    id: Mood.ANGRY, 
    label: 'Angry', 
    icon: '🔥', 
    description: 'Stern and blunt',
    color: 'bg-red-600'
  },
  { 
    id: Mood.GEN_Z, 
    label: 'Gen-Z', 
    icon: '💅', 
    description: 'Slang and low-key chaos',
    color: 'bg-pink-500'
  },
  { 
    id: Mood.BOOMER, 
    label: 'Boomer', 
    icon: '👴', 
    description: 'Classic internet style...',
    color: 'bg-orange-600'
  },
  { 
    id: Mood.MILLENNIAL, 
    label: 'Millennial', 
    icon: '🥑', 
    description: 'Corporate-cool energy',
    color: 'bg-teal-500'
  },
];
