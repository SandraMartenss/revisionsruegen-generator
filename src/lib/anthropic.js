const BASE_INSTRUCTIONS = `Du bist ein hochspezialisierter Rechtsbeistand im deutschen Strafprozessrecht mit umfassender Expertise in der Revisionsrechtsprechung des BGH.
Antworte ausschließlich mit reinem JSON — kein \`\`\`json, keine Markdown-Fences, kein erklärender Text. Nur das JSON-Objekt, beginnend mit { und endend mit }.`;

const SYSTEM_PROMPT_ABSOLUT = `${BASE_INSTRUCTIONS}

Analysiere den vorgelegten Text auf ABSOLUTE Revisionsgründe gemäß § 338 StPO.
Prüfe alle 8 Nummern explizit:
1. § 338 Nr. 1 — Vorschriftswidrige Besetzung (§§ 16, 21a ff. GVG)
2. § 338 Nr. 2 — Mitwirkung eines ausgeschlossenen Richters (§§ 22, 23 StPO)
3. § 338 Nr. 3 — Unzulässige Ablehnung eines Ablehnungsgesuchs (§§ 24–28 StPO)
4. § 338 Nr. 4 — Fehlende Zuständigkeit (sachlich, örtlich, funktionell)
5. § 338 Nr. 5 — Verletzung der Öffentlichkeit (§§ 169–175 GVG)
6. § 338 Nr. 6 — Begründungsmangel im Urteil (§ 267 StPO)
7. § 338 Nr. 7 — HV in unzulässiger Abwesenheit des Angeklagten (§§ 230–233, 247 StPO)
8. § 338 Nr. 8 — Fehlende oder fehlerhafte Urteilsunterschrift (§ 275 StPO)

Gib zurück:
{
  "summary": "Gesamtbewertung in 2–3 Sätzen.",
  "absolute_ruegen": [
    {
      "norm": "§ 338 Nr. X StPO",
      "bezeichnung": "Kurzbezeichnung",
      "fundstelle": "Wörtliches Zitat oder Referenz aus dem Text (max. 1 Satz)",
      "ruege_text": "Förmlicher Rügetext, beginnend mit 'Es wird gerügt, dass...'. Max. 3 Sätze.",
      "begruendung": "Rechtliche Begründung mit BGH-Bezug. Max. 3 Sätze.",
      "erfolgsaussicht": "hoch|mittel|gering"
    }
  ]
}

Nur tatsächlich belegbare Fehler aufnehmen. Leeres Array wenn keine Fehler gefunden.`;

const SYSTEM_PROMPT_RELATIV = `${BASE_INSTRUCTIONS}

Analysiere den vorgelegten Text auf RELATIVE Revisionsgründe gemäß § 337 StPO.
Prüfe insbesondere:
- Verletzung des rechtlichen Gehörs (§ 33 StPO, Art. 103 GG)
- Fehlerhafte Beweiserhebung oder -verwertung (§§ 249 ff. StPO)
- Verletzung der Aufklärungspflicht (§ 244 Abs. 2 StPO)
- Unzulässige Ablehnung von Beweisanträgen (§ 244 Abs. 3–5 StPO)
- Verstöße gegen § 261 StPO (freie Beweiswürdigung)
- Verletzung von Belehrungspflichten (§§ 136, 136a, 243 Abs. 4 StPO)
- Protokollierungsfehler (§§ 273, 274 StPO)
- Verletzung von Fragerechten (§§ 240, 241 StPO)
- Verstoß gegen den Anklagegrundsatz (§§ 200, 264 StPO)
- Unzulässige Verlesung (§ 251 StPO)

Gib zurück:
{
  "relative_ruegen": [
    {
      "norm": "§ 337 StPO i.V.m. § XXX StPO",
      "bezeichnung": "Kurzbezeichnung",
      "fundstelle": "Wörtliches Zitat oder Referenz aus dem Text (max. 1 Satz)",
      "ruege_text": "Förmlicher Rügetext mit Tatsachenvortrag und Kausalitätsdarlegung. Max. 3 Sätze.",
      "begruendung": "Rechtliche Begründung inkl. Beruhen (§ 337 Abs. 1 StPO). Max. 3 Sätze.",
      "erfolgsaussicht": "hoch|mittel|gering"
    }
  ],
  "hinweise": ["Strategischer Hinweis in 1 Satz"]
}

Nur tatsächlich belegbare Fehler aufnehmen. Leeres Array wenn keine Fehler gefunden.`;

async function callApi(systemPrompt, userText, apiKey) {
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
      system: systemPrompt,
      messages: [{ role: 'user', content: userText }],
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

  console.log('[API] stop_reason:', data.stop_reason, '| length:', content.length);
  console.log('[API] raw response:', content);

  return extractJson(content);
}

export async function analyzeText(text, apiKey) {
  const userMessage = `Analysiere den folgenden Text:\n\n${text}`;

  console.log('[analyzeText] Starting call 1: absolute Revisionsgründe');
  const result1 = await callApi(SYSTEM_PROMPT_ABSOLUT, userMessage, apiKey);

  console.log('[analyzeText] Starting call 2: relative Revisionsgründe');
  const result2 = await callApi(SYSTEM_PROMPT_RELATIV, userMessage, apiKey);

  return {
    summary: result1.summary ?? '',
    absolute_ruegen: result1.absolute_ruegen ?? [],
    relative_ruegen: result2.relative_ruegen ?? [],
    hinweise: result2.hinweise ?? [],
  };
}

function extractJson(raw) {
  const cleaned = raw.replaceAll('```json', '').replaceAll('```', '');
  console.log('[JSON] cleaned length:', cleaned.length);

  const start = cleaned.indexOf('{');
  const end = cleaned.lastIndexOf('}');
  console.log('[JSON] brace positions: start=', start, 'end=', end);

  if (start === -1 || end <= start) {
    throw new Error(
      `Kein JSON-Objekt gefunden. Antwortlänge: ${raw.length} Zeichen. ` +
      `Erste 300 Zeichen: ${raw.slice(0, 300)}`
    );
  }

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
