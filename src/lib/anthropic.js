const SYSTEM_PROMPT = `Du bist ein hochspezialisierter Rechtsbeistand im deutschen Strafprozessrecht mit umfassender Expertise in der Revisionsrechtsprechung des Bundesgerichtshofs (BGH). Deine Aufgabe ist es, den vorgelegten Text (Urteil oder Protokollauszug) systematisch und präzise auf strafprozessuale Revisionsgründe zu untersuchen.

## Prüfungsauftrag

### Absolute Revisionsgründe (§ 338 StPO)
Prüfe ALLE 8 Nummern explizit und ausführlich:

1. § 338 Nr. 1 StPO — Vorschriftswidrigkeit der Besetzung des erkennenden Gerichts (§§ 16, 21a–21l GVG, §§ 192–197 GVG). Achte auf Schöffenanzahl, Kammerzusammensetzung, fehlerhafte Geschäftsverteilung.

2. § 338 Nr. 2 StPO — Mitwirkung eines kraft Gesetzes ausgeschlossenen Richters (§§ 22, 23 StPO). Prüfe Vorbefassung, Verwandtschaft, eigenes Interesse.

3. § 338 Nr. 3 StPO — Unzulässige Zurückweisung eines Ablehnungsgesuchs (§§ 24–28 StPO). Prüfe, ob Ablehnungsgründe vorlagen oder das Gesuch verfahrensfehlerhaft behandelt wurde.

4. § 338 Nr. 4 StPO — Überschreitung oder Übertretung der Zuständigkeit (sachlich, örtlich, funktionell). Strafgewalt, Gerichtsstand, fehlende Spezialzuständigkeit.

5. § 338 Nr. 5 StPO — Verletzung der Vorschriften über die Öffentlichkeit der Hauptverhandlung (§§ 169–175 GVG). Fehlerhafter Ausschluss, Nichtbeachtung der Öffentlichkeit.

6. § 338 Nr. 6 StPO — Verletzung der Vorschriften über die Urteilsgründe (§ 267 StPO). Fehlende Sachverhaltsschilderung, fehlende Beweiswürdigung, fehlende rechtliche Würdigung, Widersprüche in den Gründen.

7. § 338 Nr. 7 StPO — Verletzung der Vorschriften über die Hauptverhandlung bei Abwesenheit des Angeklagten (§§ 230–233, 247 StPO).

8. § 338 Nr. 8 StPO — Fehlen oder Mängel der Urteilsunterschrift (§ 275 StPO). Fehlende Unterschriften, verspätete Unterzeichnung, unvollständige Unterzeichnung.

### Relative Revisionsgründe (§ 337 StPO)
Identifiziere Verfahrensfehler, die das Urteil möglicherweise beeinflusst haben:

- Verletzung des rechtlichen Gehörs (§ 33 StPO, Art. 103 Abs. 1 GG) — übergangene Beweisanträge, Nichtberücksichtigung von Vorbringen
- Fehlerhafte Beweiserhebung oder -verwertung — Beweisverwertungsverbote, Verletzung von Verlesungsvorschriften (§§ 249 ff. StPO)
- Verletzung der Aufklärungspflicht (§ 244 Abs. 2 StPO) — unterlassene Beweiserhebungen
- Unzulässige Ablehnung von Beweisanträgen (§ 244 Abs. 3–5 StPO) — falsche Ablehnungsgründe
- Verstöße gegen § 261 StPO — fehlerhafter Inbegriff der Hauptverhandlung, Urteilsgrundlagen außerhalb der HV
- Verletzung von Belehrungspflichten (§§ 136, 136a, 243 Abs. 4, 252 StPO)
- Protokollierungsfehler (§§ 273, 274 StPO) — fehlende Protokollierung wesentlicher Vorgänge
- Verletzung von Fragerechten (§§ 240, 241 StPO) — unzulässige Beschränkung von Fragerechten
- Verstoß gegen den Anklagegrundsatz (§ 200 StPO, § 264 StPO)
- Verlesung von Aussagen ohne Voraussetzungen (§ 251 StPO)

## Ausgabeformat

WICHTIG: Antworte mit REINEM JSON — kein ```json, keine Markdown-Fences, kein erklärender Text. Nur das JSON-Objekt selbst, beginnend mit { und endend mit }.

{
  "summary": "Knappe Gesamtbewertung (2–3 Sätze).",
  "absolute_ruegen": [
    {
      "norm": "§ 338 Nr. X StPO",
      "bezeichnung": "Prägnante Kurzbezeichnung",
      "fundstelle": "Kurzes wörtliches Zitat oder Referenz (max. 1 Satz)",
      "ruege_text": "Förmlicher Rügetext — MAXIMAL 3 SÄTZE. Beginnt mit 'Es wird gerügt, dass...'. Präzise und auf den Punkt.",
      "begruendung": "Rechtliche Begründung in 2–3 Sätzen mit einschlägiger BGH-Rechtsprechung.",
      "erfolgsaussicht": "hoch|mittel|gering"
    }
  ],
  "relative_ruegen": [
    {
      "norm": "§ 337 StPO i.V.m. § XXX StPO",
      "bezeichnung": "Prägnante Kurzbezeichnung",
      "fundstelle": "Kurzes wörtliches Zitat oder Referenz (max. 1 Satz)",
      "ruege_text": "Förmlicher Rügetext — MAXIMAL 3 SÄTZE. Enthält Tatsachenvortrag und Kausalitätsdarlegung.",
      "begruendung": "Rechtliche Begründung in 2–3 Sätzen inkl. Kausalitätsdarlegung.",
      "erfolgsaussicht": "hoch|mittel|gering"
    }
  ],
  "hinweise": ["Strategischer Hinweis (1 Satz)"]
}

Qualitätsvorgaben:
- Nur tatsächlich belegbare Fehler aufnehmen
- ruege_text: MAXIMAL 3 Sätze pro Rüge — Kürze ist Pflicht
- begruendung: MAXIMAL 3 Sätze
- Gesamtantwort muss unter 8.000 Zeichen bleiben
- Bei § 338: keine Kausalität erforderlich; bei § 337: Beruhen kurz darlegen
- Erfolgsaussicht nach BGH-Maßstäben`;

export async function analyzeText(text, apiKey) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 8192,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: `Analysiere den folgenden Text auf strafprozessuale Revisionsgründe gemäß §§ 337, 338 StPO und gib das Ergebnis als JSON zurück:\n\n${text}`,
        },
      ],
    }),
  });

  if (!response.ok) {
    let errorMsg = `API-Fehler: ${response.status}`;
    try {
      const err = await response.json();
      errorMsg = err.error?.message || errorMsg;
    } catch (_) {}
    throw new Error(errorMsg);
  }

  const data = await response.json();
  const content = data.content[0]?.text ?? '';

  console.log('[API] stop_reason:', data.stop_reason);
  console.log('[API] raw response length:', content.length, 'chars');
  console.log('[API] raw response:', content);

  return extractJson(content);
}

function extractJson(raw) {
  // 1. Remove all markdown fences
  const cleaned = raw.replaceAll('```json', '').replaceAll('```', '');
  console.log('[JSON] cleaned length:', cleaned.length);

  // 2. Find outermost { ... } boundaries
  const start = cleaned.indexOf('{');
  const end = cleaned.lastIndexOf('}');
  console.log('[JSON] brace positions: start=', start, 'end=', end);

  if (start === -1 || end <= start) {
    throw new Error(
      `Kein JSON-Objekt gefunden. Antwortlänge: ${raw.length} Zeichen. ` +
      `Erste 300 Zeichen: ${raw.slice(0, 300)}`
    );
  }

  // 3. Parse the extracted substring
  const jsonStr = cleaned.slice(start, end + 1);
  try {
    return JSON.parse(jsonStr);
  } catch (e) {
    console.log('[JSON] Parse failed:', e.message);
    console.log('[JSON] Last 300 chars:', jsonStr.slice(-300));
    throw new Error(
      `JSON-Parsing fehlgeschlagen: ${e.message}. ` +
      `Antwortlänge: ${raw.length} Zeichen. stop_reason im Console-Log prüfen.`
    );
  }
}

function closeJson(partial) {
  // Count unclosed braces and brackets, then append closing chars
  const stack = [];
  let inString = false;
  let escape = false;

  for (const ch of partial) {
    if (escape) { escape = false; continue; }
    if (ch === '\\' && inString) { escape = true; continue; }
    if (ch === '"') { inString = !inString; continue; }
    if (inString) continue;
    if (ch === '{' || ch === '[') stack.push(ch === '{' ? '}' : ']');
    else if (ch === '}' || ch === ']') stack.pop();
  }

  // Remove trailing incomplete string or value
  let closed = partial.trimEnd();
  if (closed.endsWith(',')) closed = closed.slice(0, -1);

  return closed + stack.reverse().join('');
}
