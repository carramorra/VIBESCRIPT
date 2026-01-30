export enum Mood {
    FORMAL = 'formal',
    FRIENDLY = 'friendly',
    ANGRY = 'angry',
    CONCISE = 'concise',
    POLITE = 'polite',
    GEN_Z = 'gen-z',
    BOOMER = 'boomer',
    MILLENNIAL = 'millennial'
  }
  
  export interface RewriteResult {
    original: string;
    modified: string;
    mood: Mood;
    explanations: string[];
  }
  
  export interface DiffPart {
    value: string;
    added?: boolean;
    removed?: boolean;
  }
  
  export interface MoodConfig {
    id: Mood;
    label: string;
    icon: string;
    description: string;
    color: string;
  }
  