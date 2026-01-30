import { GoogleGenAI, Type } from "@google/genai";
import { Mood } from "../types";

/**
 * LOCAL RULE-BASED ENGINE (The "Core" logic)
 * This allows the app to work offline or without an API Key.
 */
const localRules: Record<Mood, { 
  prefix?: string; 
  suffix?: string; 
  replacements: [RegExp, string][];
  transform?: (text: string) => string;
}> = {
  [Mood.FORMAL]: {
    replacements: [
      [/\b(I|i)'m\b/g, 'I am'],
      [/\bcan't\b/g, 'cannot'],
      [/\bdon't\b/g, 'do not'],
      [/\bthanks\b/gi, 'thank you'],
      [/\b(it|that)'s\b/g, '$1 is'],
      [/\bget\b/gi, 'obtain'],
      [/\b(so|very)\b/gi, 'exceedingly']
    ]
  },
  [Mood.FRIENDLY]: {
    prefix: "Hi! Just wanted to share that ",
    suffix: " Best wishes!",
    replacements: [
      [/\bthank you\b/gi, 'thanks so much!'],
      [/\b(hello|hi)\b/gi, 'hey there!']
    ]
  },
  [Mood.CONCISE]: {
    replacements: [
      [/\bI wanted to let you know that\b/gi, ''],
      [/\bbasically\b/gi, ''],
      [/\bactually\b/gi, ''],
      [/\bI think that\b/gi, ''],
      [/\bin order to\b/gi, 'to'],
      [/\b(very|really)\b/gi, '']
    ]
  },
  [Mood.ANGRY]: {
    prefix: "Listen, ",
    suffix: " This needs to be addressed immediately.",
    replacements: [
      [/\./g, '!'],
      [/\bplease\b/gi, ''],
      [/\bkindly\b/gi, '']
    ]
  },
  [Mood.POLITE]: {
    prefix: "I was wondering if ",
    suffix: " if that's alright with you?",
    replacements: [
      [/\bdo this\b/gi, 'possibly assist with this'],
      [/\bi want\b/gi, 'I would appreciate']
    ]
  },
  [Mood.GEN_Z]: {
    suffix: " fr fr 💀",
    replacements: [
      [/\b(very|really)\b/gi, 'lowkey'],
      [/\bgood\b/gi, 'slay'],
      [/\btrue\b/gi, 'no cap'],
      [/\bfriend\b/gi, 'bestie']
    ]
  },
  [Mood.BOOMER]: {
    transform: (t) => t.toUpperCase(),
    suffix: "... GOD BLESS... SENT FROM MY IPAD",
    replacements: [
      [/\./g, '...'],
      [/\,/g, ',,,']
    ]
  },
  [Mood.MILLENNIAL]: {
    prefix: "Obsessed with the fact that ",
    suffix: " ✨ adulting is hard lol",
    replacements: [
      [/\b(good|great)\b/gi, 'iconic'],
      [/\b(is|am|are)\b/gi, 'is giving']
    ]
  }
};

const applyLocalRules = (text: string, mood: Mood): { modified: string; explanations: string[] } => {
  const rules = localRules[mood];
  let modified = text;
  
  rules.replacements.forEach(([regex, replacement]) => {
    modified = modified.replace(regex, replacement);
  });

  if (rules.transform) modified = rules.transform(modified);
  if (rules.prefix) modified = rules.prefix + modified;
  if (rules.suffix) modified = modified + rules.suffix;

  return {
    modified: modified.trim(),
    explanations: [
      `Applied ${mood} vocabulary mappings.`,
      "Modified sentence structure via templates.",
      "Linguistic tone shifting (local engine)."
    ]
  };
};

/**
 * MAIN SERVICE EXPORT
 */
export const rewriteText = async (text: string, mood: Mood, intensity: number = 1): Promise<{ modified: string; explanations: string[]; isAI: boolean }> => {
  const apiKey = (window as any).process?.env?.API_KEY;

  // FALLBACK TO LOCAL RULES IF NO API KEY
  if (!apiKey || apiKey === '') {
    return { ...applyLocalRules(text, mood), isAI: false };
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const intensityMap = ['lightly', 'moderately', 'strongly'];
    const currentIntensity = intensityMap[intensity] || 'moderately';

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Rewrite the following text into a ${mood} tone. 
      Intensity: ${currentIntensity}.
      
      Rules:
      - Preserve core meaning. Do not hallucinate.
      - Return JSON format only.
      
      Text: "${text}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            modified: { type: Type.STRING },
            explanations: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ['modified', 'explanations'],
        },
      },
    });

    const result = JSON.parse(response.text);
    return {
      modified: result.modified,
      explanations: result.explanations || [],
      isAI: true
    };
  } catch (err) {
    console.warn("Gemini failed, falling back to local rules:", err);
    return { ...applyLocalRules(text, mood), isAI: false };
  }
};
