import RuegeCard from './RuegeCard';
import { downloadRuegen } from '../lib/export';

export default function ResultsSection({ results, onReset }) {
  const absolutCount = results.absolute_ruegen?.length ?? 0;
  const relativeCount = results.relative_ruegen?.length ?? 0;
  const total = absolutCount + relativeCount;

  return (
    <div className="space-y-8">
      {/* Summary bar */}
      <div className="card p-5 border-navy-600">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <p className="text-xs text-cream/40 font-mono uppercase tracking-wider mb-2">Analyseergebnis</p>
            <p className="text-sm text-cream/80 leading-relaxed">{results.summary}</p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="text-center">
              <p className="text-2xl font-playfair font-bold text-gradient">{total}</p>
              <p className="text-xs text-cream/40">Rügen</p>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="mt-4 pt-4 border-t border-navy-700 flex flex-wrap gap-4 text-xs font-mono">
          <span className="text-gold-400">
            {absolutCount} absolute{absolutCount !== 1 ? '' : 'r'} Rügegrund{absolutCount !== 1 ? 'e' : ''} (§ 338 StPO)
          </span>
          <span className="text-cream/40">·</span>
          <span className="text-cream/60">
            {relativeCount} relativer Rügegrund{relativeCount !== 1 ? 'e' : ''} (§ 337 StPO)
          </span>
        </div>
      </div>

      {/* Absolute Revisionsgründe */}
      {absolutCount > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-4">
            <h2 className="font-playfair text-xl font-semibold text-cream">
              Absolute Revisionsgründe
            </h2>
            <span className="norm-badge">§ 338 StPO</span>
          </div>
          <p className="text-xs text-cream/40 mb-4">
            Absolute Revisionsgründe führen stets zur Aufhebung — ein Beruhen des Urteils auf dem Fehler muss nicht nachgewiesen werden.
          </p>
          <div className="space-y-3">
            {results.absolute_ruegen.map((r, i) => (
              <RuegeCard key={i} ruege={r} index={i} type="absolut" />
            ))}
          </div>
        </section>
      )}

      {/* Relative Revisionsgründe */}
      {relativeCount > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-4">
            <h2 className="font-playfair text-xl font-semibold text-cream">
              Relative Revisionsgründe
            </h2>
            <span className="norm-badge">§ 337 StPO</span>
          </div>
          <p className="text-xs text-cream/40 mb-4">
            Relative Revisionsgründe erfordern die Darlegung, dass das Urteil auf dem Verfahrensfehler beruht (Kausalität).
          </p>
          <div className="space-y-3">
            {results.relative_ruegen.map((r, i) => (
              <RuegeCard key={i} ruege={r} index={i} type="relativ" />
            ))}
          </div>
        </section>
      )}

      {/* Hinweise */}
      {results.hinweise?.length > 0 && (
        <section>
          <h2 className="font-playfair text-xl font-semibold text-cream mb-4">
            Strategische Hinweise
          </h2>
          <ul className="space-y-2">
            {results.hinweise.map((h, i) => (
              <li key={i} className="flex gap-3 text-sm text-cream/70">
                <span className="text-gold-500 font-mono mt-0.5 flex-shrink-0">→</span>
                {h}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* No results */}
      {total === 0 && (
        <div className="text-center py-12 text-cream/40">
          <p className="text-3xl mb-3">✓</p>
          <p className="font-playfair text-lg">Keine Revisionsgründe identifiziert</p>
          <p className="text-sm mt-1">Der analysierte Text enthält keine offensichtlichen Verfahrensfehler.</p>
        </div>
      )}

      {/* Action bar */}
      <div className="section-divider" />
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => downloadRuegen(results)}
          className="btn-primary flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Alle Rügen exportieren
        </button>
        <button onClick={onReset} className="btn-secondary flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
          </svg>
          Neue Analyse
        </button>
      </div>
    </div>
  );
}
