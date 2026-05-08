const MAX_CHARS = 10000;

export default function InputSection({ text, onChange, onAnalyze, hasApiKey, loading }) {
  const chars = text.length;
  const overLimit = chars > MAX_CHARS;

  return (
    <div className="space-y-5">
      <div>
        <label className="block font-playfair text-lg text-cream mb-1">
          Urteil oder Protokollauszug
        </label>
        <p className="text-sm text-cream/50 mb-4">
          Fügen Sie den Volltext oder relevante Auszüge ein. Die Analyse prüft systematisch auf absolute und relative Revisionsgründe.
        </p>
        <div className="relative">
          <textarea
            value={text}
            onChange={e => onChange(e.target.value)}
            placeholder="In der Strafsache gegen … hat das Landgericht … in der Sitzung vom … für Recht erkannt:&#10;&#10;[Urteilstext oder Protokollauszug hier einfügen]"
            rows={16}
            className={`w-full bg-navy-800 border rounded-lg px-4 py-3 text-sm font-mono text-cream leading-relaxed resize-y outline-none transition-colors placeholder:text-cream/25 ${
              overLimit
                ? 'border-red-500/60 focus:border-red-400'
                : 'border-navy-600 focus:border-gold-500/60'
            }`}
          />
          <div
            className={`absolute bottom-3 right-3 text-xs font-mono ${
              overLimit ? 'text-red-400' : chars > MAX_CHARS * 0.85 ? 'text-gold-500' : 'text-cream/30'
            }`}
          >
            {chars.toLocaleString('de-DE')} / {MAX_CHARS.toLocaleString('de-DE')}
          </div>
        </div>
        {overLimit && (
          <p className="text-xs text-red-400 mt-1.5">
            Zeichenlimit überschritten. Bitte kürzen Sie den Text auf max. {MAX_CHARS.toLocaleString('de-DE')} Zeichen.
          </p>
        )}
      </div>

      <div className="flex items-center justify-between gap-4">
        <div>
          {!hasApiKey && (
            <p className="text-xs text-gold-500/70">
              ⚠ Kein API-Schlüssel hinterlegt — bitte über das ⚙-Symbol konfigurieren.
            </p>
          )}
        </div>
        <button
          onClick={onAnalyze}
          disabled={!text.trim() || overLimit || !hasApiKey || loading}
          className="btn-primary flex items-center gap-2 whitespace-nowrap"
        >
          {loading ? (
            <>
              <svg className="w-4 h-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Analysiere…
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 15.803a7.5 7.5 0 0 0 10.607 0Z" />
              </svg>
              Revisionsgründe analysieren
            </>
          )}
        </button>
      </div>
    </div>
  );
}
