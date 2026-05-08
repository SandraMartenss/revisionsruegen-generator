import { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import InputSection from './components/InputSection';
import AnalyzingSection from './components/AnalyzingSection';
import ResultsSection from './components/ResultsSection';
import SettingsModal from './components/SettingsModal';
import { analyzeText } from './lib/anthropic';

const API_KEY_STORAGE = 'rrg_api_key';

const VIEW = { INPUT: 'input', ANALYZING: 'analyzing', RESULTS: 'results' };

export default function App() {
  const [view, setView] = useState(VIEW.INPUT);
  const [inputText, setInputText] = useState('');
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem(API_KEY_STORAGE) || '');
  const [analyzeStep, setAnalyzeStep] = useState(0);
  const stepTimerRef = useRef(null);

  useEffect(() => {
    if (!apiKey) setShowSettings(true);
  }, []);

  function saveApiKey(key) {
    setApiKey(key);
    if (key) localStorage.setItem(API_KEY_STORAGE, key);
    else localStorage.removeItem(API_KEY_STORAGE);
  }

  function startStepTimer() {
    setAnalyzeStep(0);
    let step = 0;
    stepTimerRef.current = setInterval(() => {
      step = Math.min(step + 1, 4);
      setAnalyzeStep(step);
    }, 3000);
  }

  function stopStepTimer() {
    if (stepTimerRef.current) {
      clearInterval(stepTimerRef.current);
      stepTimerRef.current = null;
    }
  }

  async function handleAnalyze() {
    if (!inputText.trim() || !apiKey) return;
    setError('');
    setView(VIEW.ANALYZING);
    startStepTimer();

    try {
      const data = await analyzeText(inputText, apiKey);
      stopStepTimer();
      setResults(data);
      setView(VIEW.RESULTS);
    } catch (err) {
      stopStepTimer();
      setError(err.message || 'Unbekannter Fehler');
      setView(VIEW.INPUT);
    }
  }

  function handleReset() {
    setView(VIEW.INPUT);
    setResults(null);
    setError('');
  }

  return (
    <div className="min-h-screen bg-navy-900 flex flex-col">
      <Header onOpenSettings={() => setShowSettings(true)} />

      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-10">
        {/* Error banner */}
        {error && (
          <div className="mb-6 bg-red-900/30 border border-red-700/40 rounded-lg px-4 py-3 text-sm text-red-300 flex items-start gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span><strong>Fehler:</strong> {error}</span>
          </div>
        )}

        {view === VIEW.INPUT && (
          <InputSection
            text={inputText}
            onChange={setInputText}
            onAnalyze={handleAnalyze}
            hasApiKey={!!apiKey}
            loading={false}
          />
        )}

        {view === VIEW.ANALYZING && (
          <AnalyzingSection step={analyzeStep} />
        )}

        {view === VIEW.RESULTS && results && (
          <ResultsSection results={results} onReset={handleReset} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-navy-800 px-6 py-4 text-center text-xs text-cream/25 font-mono">
        Hinweis: Dieses Tool ersetzt keine anwaltliche Beratung. Alle generierten Rügen sind auf Plausibilität zu prüfen. · §§ 337, 338 StPO
      </footer>

      {showSettings && (
        <SettingsModal
          apiKey={apiKey}
          onSave={saveApiKey}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}
