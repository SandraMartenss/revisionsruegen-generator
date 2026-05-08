import { useState } from 'react';

export default function SettingsModal({ apiKey, onSave, onClose }) {
  const [value, setValue] = useState(apiKey || '');
  const [show, setShow] = useState(false);

  function handleSave() {
    onSave(value.trim());
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-navy-950/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative card w-full max-w-md p-6 shadow-2xl border-navy-600">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-playfair text-xl font-semibold text-cream">Einstellungen</h2>
          <button onClick={onClose} className="text-cream/40 hover:text-cream transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-cream/60 mb-1.5 font-mono">
              Anthropic API-Schlüssel
            </label>
            <div className="relative">
              <input
                type={show ? 'text' : 'password'}
                value={value}
                onChange={e => setValue(e.target.value)}
                placeholder="sk-ant-..."
                className="w-full bg-navy-900 border border-navy-600 focus:border-gold-500 rounded px-3 py-2.5 text-sm font-mono text-cream outline-none transition-colors pr-10"
                onKeyDown={e => e.key === 'Enter' && handleSave()}
              />
              <button
                type="button"
                onClick={() => setShow(s => !s)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-cream/40 hover:text-cream transition-colors"
              >
                {show ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            <p className="mt-2 text-xs text-cream/40">
              Gespeichert nur in Ihrem Browser (localStorage). Der Schlüssel verlässt Ihr Gerät nur für direkte API-Aufrufe an Anthropic.
            </p>
          </div>

          <div className="flex gap-3 pt-1">
            <button onClick={handleSave} className="btn-primary flex-1">
              Speichern
            </button>
            <button onClick={onClose} className="btn-secondary">
              Abbrechen
            </button>
          </div>

          {apiKey && (
            <button
              onClick={() => { onSave(''); onClose(); }}
              className="text-xs text-red-400/60 hover:text-red-400 transition-colors w-full text-center"
            >
              API-Schlüssel entfernen
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
