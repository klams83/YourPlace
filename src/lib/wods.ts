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

// Rotation hebdomadaire : un bonus après le WOD 1 du mardi (comparable d'une
// semaine à l'autre pour mesurer la progression), un benchmark le samedi les
// semaines sans simulation (S1-S3).
export function getTuesdayBonusWod(week: number, maxes: Maxes): Wod {
  if (week === 1) return getCindy(12)
  if (week === 2) return getCindy(15)
  if (week === 3) return getChief()
  if (week === 4) return getChief()
  if (week === 5) return getMurphNoRun(maxes)
  return getCindy(10) // S6 affûtage : retest court, à comparer à S1-S2
}

export function getSaturdayBenchmarkWod(week: number, maxes: Maxes): Wod | undefined {
  if (week === 1) return getBarbara(maxes)
  if (week === 2) return getAngie(maxes)
  if (week === 3) return getAnnie()
  return undefined // S4-S6 : samedi = simulation test
}
