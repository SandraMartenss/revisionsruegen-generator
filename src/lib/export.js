export function buildExportText(results) {
  const line = (char, len = 60) => char.repeat(len);

  let out = '';
  out += 'REVISIONSRÜGEN\n';
  out += line('═') + '\n';
  out += `Erstellt: ${new Date().toLocaleString('de-DE')}\n\n`;

  if (results.summary) {
    out += 'ZUSAMMENFASSUNG\n' + line('─', 40) + '\n';
    out += results.summary + '\n\n';
  }

  if (results.absolute_ruegen?.length > 0) {
    out += '\nABSOLUTE REVISIONSGRÜNDE (§ 338 StPO)\n';
    out += line('═') + '\n\n';
    results.absolute_ruegen.forEach((r, i) => {
      out += `${i + 1}. ${r.norm} — ${r.bezeichnung}\n`;
      out += `Erfolgsaussicht: ${r.erfolgsaussicht?.toUpperCase()}\n`;
      out += line('─', 40) + '\n\n';
      out += r.ruege_text + '\n\n';
      if (r.begruendung) {
        out += 'Begründung:\n' + r.begruendung + '\n\n';
      }
    });
  }

  if (results.relative_ruegen?.length > 0) {
    out += '\nRELATIVE REVISIONSGRÜNDE (§ 337 StPO)\n';
    out += line('═') + '\n\n';
    results.relative_ruegen.forEach((r, i) => {
      out += `${i + 1}. ${r.norm} — ${r.bezeichnung}\n`;
      out += `Erfolgsaussicht: ${r.erfolgsaussicht?.toUpperCase()}\n`;
      out += line('─', 40) + '\n\n';
      out += r.ruege_text + '\n\n';
      if (r.begruendung) {
        out += 'Begründung:\n' + r.begruendung + '\n\n';
      }
    });
  }

  if (results.hinweise?.length > 0) {
    out += '\nSTRATEGISCHE HINWEISE\n' + line('─', 40) + '\n';
    results.hinweise.forEach((h, i) => {
      out += `${i + 1}. ${h}\n`;
    });
    out += '\n';
  }

  return out;
}

export function downloadRuegen(results) {
  const text = buildExportText(results);
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `revisionsruegen_${new Date().toISOString().slice(0, 10)}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
