export const VERB_LIBRARY = {
  Management_Leadership: [
    'orchestrated', 'spearheaded', 'championed', 'mobilized', 'governed', 'steered',
    'consolidated', 'revitalized', 'delegated', 'enforced', 'prioritized', 'standardized',
    'institutionalized', 'realigned', 'restructured', 'galvanized'
  ],
  Communication_People: [
    'negotiated', 'facilitated', 'moderated', 'briefed', 'clarified', 'advocated',
    'cultivated', 'strengthened', 'aligned', 'influenced', 'mediated', 'persuaded',
    'presented', 'articulated', 'publicized'
  ],
  Research_Analysis: [
    'diagnosed', 'dissected', 'benchmarked', 'triangulated', 'interrogated', 'audited',
    'modeled', 'simulated', 'validated', 'synthesized', 'profiled', 'segmented',
    'prioritized', 'stress‑tested', 'decomposed'
  ],
  Technical_Engineering: [
    'architected', 'prototyped', 'containerized', 'instrumented', 'hardened', 'refactored',
    'automated', 'parameterized', 'virtualized', 'deployed', 'calibrated', 'optimized',
    'configured', 'integrated', 'upgraded'
  ],
  Teaching_Coaching: [
    'mentored', 'coached', 'upskilled', 'onboarded', 'socialized', 'standardized',
    'streamlined', 'enabled', 'evangelized', 'instilled', 'trained', 'facilitated',
    'oriented', 'guided', 'empowered'
  ],
  Financial_Data: [
    'forecasted', 'budgeted', 'reconciled', 'amortized', 'hedged', 'capitalized',
    'underwrote', 'valued', 'indexed', 'costed', 'benchmarking', 'stress‑tested',
    'variance‑analyzed', 'rightsized', 'monetized'
  ],
  Creative_Innovation: [
    'conceived', 'devised', 'incubated', 'pioneered', 'reimagined', 'reframed',
    'productized', 'storyboarded', 'brand‑positioned', 'ideated', 'packaged',
    'revamped', 'piloted', 'A/B‑tested', 'scaled'
  ],
  Helping_Service: [
    'expedited', 'resolved', 'rehabilitated', 'advocated', 'counseled', 'supported',
    'simplified', 'de‑risked', 'assured', 'safeguarded', 'enabled', 'facilitated',
    'coordinated', 'assisted', 'stabilized'
  ],
  Organization_Detail: [
    'systematized', 'streamlined', 'operationalized', 'codified', 'cataloged', 'sequenced',
    'consolidated', 'tracked', 'monitored', 'scheduled', 'curated', 'standardized',
    'documented', 'optimized', 'governed'
  ],
  Accomplishment: [
    'accelerated', 'elevated', 'amplified', 'boosted', 'reduced', 'cut', 'curbed',
    'surpassed', 'outperformed', 'improved', 'maximized', 'shortened', 'raised',
    'increased', 'delivered'
  ]
} as const;

export type VerbLibrary = typeof VERB_LIBRARY;

// Sample a small set of openers across categories, excluding already-used verbs
export function sampleOpeners(usedLower: Set<string>, k = 10): string[] {
  const categories = Object.keys(VERB_LIBRARY) as Array<keyof typeof VERB_LIBRARY>;
  const bag: string[] = [];
  let i = 0;
  while (bag.length < k && i < 200) {
    const cat = categories[i % categories.length];
    const pool = VERB_LIBRARY[cat].filter((v) => !usedLower.has(v.toLowerCase()));
    if (pool.length > 0) {
      const pick = pool[Math.floor(Math.random() * pool.length)];
      bag.push(pick);
    }
    i++;
  }
  return Array.from(new Set(bag)).slice(0, k);
}

