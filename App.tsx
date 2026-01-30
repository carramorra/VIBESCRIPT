import React, { useState, useCallback, useEffect } from 'react';
import { Mood, RewriteResult } from './types';
import MoodSelector from './components/MoodSelector';
import DiffViewer from './components/DiffViewer';
import { rewriteText } from './services/rewriteService';

const App: React.FC = () => {
  const [inputText, setInputText] = useState('I wanted to let you know that the meeting today was productive. We covered all the points on the agenda and decided on the next steps.');
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [result, setResult] = useState<(RewriteResult & { isAI: boolean }) | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [intensity, setIntensity] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const handleRewrite = useCallback(async (mood: Mood) => {
    if (!inputText.trim()) return;
    
    setIsLoading(true);
    setSelectedMood(mood);
    setError(null);
    
    try {
      const response = await rewriteText(inputText, mood, intensity);
      setResult({
        original: inputText,
        modified: response.modified,
        mood,
        explanations: response.explanations,
        isAI: response.isAI
      });
    } catch (err: any) {
      console.error(err);
      setError("Transformation failed.");
    } finally {
      setIsLoading(false);
    }
  }, [inputText, intensity]);

  useEffect(() => {
    if (selectedMood && !isLoading) handleRewrite(selectedMood);
  }, [intensity]);

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <header className="mb-10 text-center">
          <div className="inline-block px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-bold uppercase tracking-wider mb-4">
            Explainable NLP Engine
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            Mood <span className="text-indigo-600">→</span> Text
          </h1>
        </header>

        <div className="space-y-6">
          <section className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste text to reshape..."
              className="w-full h-28 p-2 text-lg text-slate-800 border-0 focus:ring-0 resize-none outline-none"
            />
          </section>

          <section className="space-y-4">
            <div className="flex justify-between items-center px-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Select Target Tone</span>
              <div className="flex items-center gap-2">
                 <span className="text-[10px] font-bold text-slate-400 uppercase">Strength</span>
                 <input type="range" min="0" max="2" value={intensity} onChange={(e) => setIntensity(parseInt(e.target.value))} className="w-16 h-1 accent-indigo-600" />
              </div>
            </div>
            <MoodSelector selectedMood={selectedMood} onSelect={handleRewrite} isLoading={isLoading} />
          </section>

          {(result || isLoading) && (
            <section className="space-y-4 pt-4 border-t border-slate-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xs font-bold text-slate-400 uppercase">Live Linguistic Diff</h2>
                {result && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${result.isAI ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                    {result.isAI ? 'AI ENHANCED' : 'LOCAL RULES'}
                  </span>
                )}
              </div>
              
              <div className={isLoading ? 'opacity-40 pointer-events-none' : ''}>
                {result && <DiffViewer original={result.original} modified={result.modified} />}
              </div>

              {result && !isLoading && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-xl border border-slate-200">
                    <h3 className="text-[10px] font-bold text-slate-400 uppercase mb-2">Mechanism</h3>
                    <ul className="space-y-1">
                      {result.explanations.map((e, i) => (
                        <li key={i} className="text-xs text-slate-600">• {e}</li>
                      ))}
                    </ul>
                  </div>
                  <button 
                    onClick={() => navigator.clipboard.writeText(result.modified)}
                    className="h-full bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-black transition-all"
                  >
                    Copy Output
                  </button>
                </div>
              )}
            </section>
          )}
        </div>

        <footer className="mt-16 text-center text-slate-300 text-[10px] font-bold uppercase tracking-widest">
          No magic. Just patterns.
        </footer>
      </div>
    </div>
  );
};

export default App;
