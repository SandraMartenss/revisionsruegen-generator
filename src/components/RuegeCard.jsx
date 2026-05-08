import { useState } from 'react';

const ERFOLG_CONFIG = {
  hoch: { label: 'Hoch', bg: 'bg-green-900/40', text: 'text-green-400', border: 'border-green-700/40', dot: 'bg-green-400' },
  mittel: { label: 'Mittel', bg: 'bg-amber-900/30', text: 'text-amber-400', border: 'border-amber-700/40', dot: 'bg-amber-400' },
  gering: { label: 'Gering', bg: 'bg-red-900/30', text: 'text-red-400', border: 'border-red-700/40', dot: 'bg-red-400' },
};

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 text-xs text-cream/40 hover:text-gold-400 transition-colors px-2 py-1 rounded hover:bg-navy-700"
    >
      {copied ? (
        <>
          <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
          Kopiert
        </>
      ) : (
        <>
          <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          Kopieren
        </>
      )}
    </button>
  );
}

export default function RuegeCard({ ruege, index, type }) {
  const [open, setOpen] = useState(false);
  const [begruendungOpen, setBegruendungOpen] = useState(false);

  const erfolg = ERFOLG_CONFIG[ruege.erfolgsaussicht?.toLowerCase()] ?? ERFOLG_CONFIG.gering;
  const isAbsolut = type === 'absolut';

  return (
    <div className="card card-enter border-l-2 border-l-gold-500/30 hover:border-l-gold-500/70 transition-all duration-200">
      {/* Header */}
      <button
        className="w-full text-left px-5 py-4 flex items-start gap-3"
        onClick={() => setOpen(o => !o)}
      >
        <span className="text-cream/30 font-mono text-xs mt-0.5 w-5 flex-shrink-0">{index + 1}.</span>
        <div className="flex-1 min-w-0 space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="norm-badge">{ruege.norm}</span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full border flex items-center gap-1.5 ${erfolg.bg} ${erfolg.text} ${erfolg.border}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${erfolg.dot}`} />
              {erfolg.label}
            </span>
            {isAbsolut && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-gold-500/10 text-gold-400 border border-gold-500/20">
                Absolut
              </span>
            )}
          </div>
          <p className="text-cream text-sm font-medium">{ruege.bezeichnung}</p>
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`w-4 h-4 text-cream/40 flex-shrink-0 mt-0.5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Expanded content */}
      {open && (
        <div className="border-t border-navy-700 px-5 py-4 space-y-4">
          {/* Fundstelle */}
          {ruege.fundstelle && (
            <div>
              <p className="text-xs text-cream/40 font-mono uppercase tracking-wider mb-1.5">Fundstelle</p>
              <blockquote className="border-l-2 border-gold-500/40 pl-3 text-sm text-cream/70 italic font-mono leading-relaxed">
                {ruege.fundstelle}
              </blockquote>
            </div>
          )}

          {/* Rügetext */}
          {ruege.ruege_text && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-xs text-cream/40 font-mono uppercase tracking-wider">Rügetext</p>
                <CopyButton text={ruege.ruege_text} />
              </div>
              <div className="ruege-block">{ruege.ruege_text}</div>
            </div>
          )}

          {/* Begründung (collapsible) */}
          {ruege.begruendung && (
            <div>
              <button
                onClick={() => setBegruendungOpen(o => !o)}
                className="flex items-center gap-2 text-xs text-cream/50 hover:text-gold-400 transition-colors font-mono uppercase tracking-wider"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`w-3.5 h-3.5 transition-transform duration-150 ${begruendungOpen ? 'rotate-90' : ''}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                Rechtliche Begründung
              </button>
              {begruendungOpen && (
                <p className="mt-2 text-sm text-cream/60 leading-relaxed pl-5 border-l border-navy-600">
                  {ruege.begruendung}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
