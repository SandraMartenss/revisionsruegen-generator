const STEPS = [
  'Strukturanalyse des Textes …',
  'Prüfung absoluter Revisionsgründe (§ 338 StPO) …',
  'Identifikation relativer Revisionsgründe (§ 337 StPO) …',
  'Formulierung der Rügetexte …',
  'Bewertung der Erfolgsaussichten …',
];

export default function AnalyzingSection({ step = 0 }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 space-y-8">
      <div className="scales-animate text-6xl select-none">⚖</div>

      <div className="text-center space-y-2">
        <h2 className="font-playfair text-2xl text-cream">Analyse läuft</h2>
        <p className="text-cream/50 text-sm font-mono">
          {STEPS[Math.min(step, STEPS.length - 1)]}
        </p>
      </div>

      <div className="w-64 h-1 bg-navy-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-gold-500 rounded-full transition-all duration-1000"
          style={{ width: `${Math.min(((step + 1) / STEPS.length) * 100, 95)}%` }}
        />
      </div>

      <p className="text-xs text-cream/30 text-center max-w-xs">
        Claude analysiert den Text auf alle 8 Nummern des § 338 StPO sowie einschlägige relative Revisionsgründe.
      </p>
    </div>
  );
}
