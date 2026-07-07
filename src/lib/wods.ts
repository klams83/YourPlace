// Bibliothèque de WOD CrossFit « benchmarks », le type de séance qu'on retrouve
// dans la plupart des prépas tactiques (Frankton Tactical, boxes CrossFit
// affiliées gendarmerie/pompiers) pour tester puissance répétée et rusticité
// sous fatigue. Reps scalées sur les 3 maxes quand c'est pertinent ; les
// formats AMRAP/intervalles gardent leurs reps classiques (le score, c'est le
// nombre de tours — comparable d'une semaine à l'autre).

import type { Maxes } from './program'

export interface Wod {
  id: string
  name: string
  origin: string
  format: string
  lines: string[]
  scoring: string
}

function scale(base: number, factor: number, min: number): number {
  return Math.max(min, Math.round(base * factor))
}

export function getCindy(minutes: number): Wod {
  return {
    id: 'cindy',
    name: 'CINDY',
    origin: 'Benchmark CrossFit « Girls » (2005) — le format d’endurance sous fatigue le plus utilisé en prépa tactique.',
    format: `AMRAP ${minutes}'`,
    lines: ['5 tractions', '10 pompes', '15 squats', 'Un tour = les 3 mouvements enchaînés, sans repos imposé'],
    scoring: 'Score = nombre de tours complets (+ reps du tour entamé). Note-le et bats-le la prochaine fois.',
  }
}

export function getChief(): Wod {
  return {
    id: 'chief',
    name: 'CHIEF',
    origin: 'Benchmark CrossFit à intervalles — très utilisé en prépa forces spéciales pour la puissance répétée.',
    format: "5 × (3' AMRAP + 1' repos)",
    lines: [
      '3 tractions, 6 pompes, 9 squats — répéter le cycle jusqu’à la fin des 3 minutes',
      '1 minute de repos strict, puis relancer un nouveau 3\'',
      '5 intervalles au total',
    ],
    scoring: 'Score = total de tours cumulés sur les 5 intervalles.',
  }
}

export function getBarbara(maxes: Maxes): Wod {
  const pullups = scale(maxes.tractions, 0.45, 4)
  const pushups = scale(maxes.pompes, 0.35, 8)
  const situps = scale(maxes.abdos, 0.4, 10)
  const squats = scale(maxes.abdos, 0.5, 12)
  return {
    id: 'barbara',
    name: 'BARBARA',
    origin: 'Benchmark CrossFit « Girls » — 5 rounds à haute densité, classique des prépas gendarmerie/pompiers pour la rusticité.',
    format: "5 rounds, 3' de repos strict entre chaque",
    lines: [`${pullups} tractions`, `${pushups} pompes`, `${situps} abdos`, `${squats} squats`],
    scoring: 'Chronomètre chaque round séparément : vise un temps stable sur les 5, pas un premier round trop rapide.',
  }
}

export function getAngie(maxes: Maxes): Wod {
  const pullups = scale(maxes.tractions, 5, 25)
  const pushups = scale(maxes.pompes, 1.5, 40)
  const situps = scale(maxes.abdos, 1.5, 40)
  const squats = scale(maxes.abdos, 2, 50)
  return {
    id: 'angie',
    name: 'ANGIE',
    origin: 'Benchmark CrossFit « Girls » — la référence du volume calisthénique pur, testée « for time ».',
    format: 'For time',
    lines: [
      `${pullups} tractions`,
      `${pushups} pompes`,
      `${situps} abdos`,
      `${squats} squats`,
      'Chaque mouvement terminé avant de passer au suivant',
    ],
    scoring: 'Score = temps total. Fractionne large dès le début : ne jamais aller à l’échec avant le dernier mouvement.',
  }
}

export function getAnnie(): Wod {
  return {
    id: 'annie',
    name: 'ANNIE',
    origin: 'Benchmark CrossFit « Girls » — échelle descendante, référence du gainage sous fatigue cardio.',
    format: 'For time',
    lines: [
      '50-40-30-20-10 : double-unders puis abdos (dans cet ordre, à chaque palier)',
      'Sans corde à sauter : remplacer les double-unders par 2× squat jumps par rep',
    ],
    scoring: 'Score = temps total.',
  }
}

export function getMurphNoRun(maxes: Maxes): Wod {
  const rounds = scale(maxes.tractions, 1.5, 6)
  return {
    id: 'murph',
    name: 'MURPH — VERSION SANS COURSE',
    origin:
      'Hommage militaire le plus connu du CrossFit (Lt Michael Murphy, Navy SEAL, Medal of Honor). Course retirée : gérée par ton autre plan.',
    format: `${rounds} rounds de Cindy, pour le temps`,
    lines: [
      `${rounds} × (5 tractions, 10 pompes, 15 squats)`,
      'Partitionnement classique du Murph : la façon la plus courante de le tenir sur la durée',
    ],
    scoring: 'Score = temps total. Vise la régularité : même rythme du 1er au dernier round.',
  }
}

export function getTabataSomethingElse(): Wod {
  return {
    id: 'tabata-something-else',
    name: 'TABATA SOMETHING ELSE',
    origin:
      'Format Tabata (20 s effort / 10 s repos) enchaîné sur 4 mouvements — un classique des préparations tactiques pour la puissance sous fatigue express.',
    format: "4 × 8 rounds de 20''/10'' (tractions puis pompes puis abdos puis squats)",
    lines: [
      '8 rounds de tractions (20\'\'/10\'\')',
      '8 rounds de pompes (20\'\'/10\'\')',
      '8 rounds d’abdos (20\'\'/10\'\')',
      '8 rounds de squats (20\'\'/10\'\')',
    ],
    scoring: 'Score = le round le plus faible de chaque mouvement, additionné (le « score Tabata »).',
  }
}

export function getDeathByBurpees(): Wod {
  return {
    id: 'death-by-burpees',
    name: 'DEATH BY BURPEES',
    origin: 'Format EMOM progressif jusqu’à l’échec — très utilisé en conditioning tactique pour tester le seuil.',
    format: 'EMOM progressif jusqu’à l’échec',
    lines: [
      'Minute 1 : 1 burpee',
      'Minute 2 : 2 burpees',
      'Minute 3 : 3 burpees',
      '… +1 burpee chaque minute, jusqu’à ne plus tenir le temps imparti',
    ],
    scoring: 'Score = dernière minute complétée dans le temps imparti.',
  }
}

// Rotation hebdomadaire — un WOD bonus par séance (optionnel : à faire si le
// temps/l'envie le permet, ça n'entame jamais la fraîcheur de la colonne
// Armstrong). Jamais sur le J4 (jeudi, « rien d'autre ») ni le dimanche
// (repos complet) : ces deux garde-fous restent non négociables.
export function getMondayBonusWod(week: number, maxes: Maxes): Wod {
  if (week === 1) return getTabataSomethingElse()
  if (week === 2) return getDeathByBurpees()
  if (week === 3) return getChief()
  if (week === 4) return getBarbara(maxes)
  if (week === 5) return getChief()
  return getCindy(10) // S6 affûtage
}

export function getTuesdayBonusWod(week: number, maxes: Maxes): Wod {
  if (week === 1) return getCindy(12)
  if (week === 2) return getCindy(15)
  if (week === 3) return getChief()
  if (week === 4) return getChief()
  if (week === 5) return getMurphNoRun(maxes)
  return getCindy(10) // S6 affûtage : retest court, à comparer à S1-S2
}

export function getWednesdayBonusWod(week: number, maxes: Maxes): Wod {
  if (week === 1) return getDeathByBurpees()
  if (week === 2) return getTabataSomethingElse()
  if (week === 3) return getCindy(15)
  if (week === 4) return getDeathByBurpees()
  if (week === 5) return getAngie(maxes)
  return getTabataSomethingElse() // S6 affûtage
}

export function getFridayBonusWod(week: number, maxes: Maxes): Wod {
  if (week === 1) return getCindy(10)
  if (week === 2) return getChief()
  if (week === 3) return getAngie(maxes)
  if (week === 4) return getCindy(12)
  if (week === 5) return getDeathByBurpees()
  return getCindy(8) // S6 affûtage : retest court
}

export function getSaturdayBenchmarkWod(week: number, maxes: Maxes): Wod | undefined {
  if (week === 1) return getBarbara(maxes)
  if (week === 2) return getAngie(maxes)
  if (week === 3) return getAnnie()
  return undefined // S4-S6 : samedi = simulation test
}
