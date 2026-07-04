// Moteur de calcul du programme — toutes les formules du plan 6 semaines.
// Tout est dérivé des 3 maxes de référence ; changer un max recalcule tout.

export interface Maxes {
  tractions: number
  pompes: number
  abdos: number
}

export const DEFAULT_MAXES: Maxes = { tractions: 12, pompes: 45, abdos: 50 }

export const WEEKS = [1, 2, 3, 4, 5, 6] as const
export type Week = (typeof WEEKS)[number]

export interface Phase {
  name: string
  ceBonus: number
  emomBonus: number
}

export function getPhase(week: number): Phase {
  if (week <= 2) return { name: 'Installation', ceBonus: 0, emomBonus: 0 }
  if (week <= 4) return { name: 'Montée en charge', ceBonus: 1, emomBonus: 1 }
  if (week === 5) return { name: 'Pic', ceBonus: 2, emomBonus: 2 }
  return { name: 'Affûtage', ceBonus: 1, emomBonus: -1 }
}

// Chiffre d'entraînement J4 (CE) = floor(maxTractions × 0.5), min 2, + modulation hebdo
export function getBaseCE(maxes: Maxes): number {
  return Math.max(2, Math.floor(maxes.tractions * 0.5))
}
export function getCE(maxes: Maxes, week: number): number {
  return getBaseCE(maxes) + getPhase(week).ceBonus
}

// EMOM pompes : reps/minute = round(maxPompes2min × 0.12), min 4, + modulation hebdo
export function getBaseEmom(maxes: Maxes): number {
  return Math.max(4, Math.round(maxes.pompes * 0.12))
}
export function getEmomReps(maxes: Maxes, week: number): number {
  return Math.max(1, getBaseEmom(maxes) + getPhase(week).emomBonus)
}

// Sit-ups par tour = round(maxAbdos2min × 0.35), min 10
export function getSitups(maxes: Maxes): number {
  return Math.max(10, Math.round(maxes.abdos * 0.35))
}

// WOD 1 : pompes par minute = 10 % du max 2 minutes
export function getWod1Pompes(maxes: Maxes): number {
  return Math.max(1, Math.round(maxes.pompes * 0.1))
}

// Planche : 45-60 s selon la semaine (60 s imposées en S5 « Pic »)
export function getPlankSeconds(week: number): number {
  if (week <= 2) return 45
  if (week <= 4) return 50
  if (week === 5) return 60
  return 45
}

export interface SimTargets {
  tractions: number
  pompes: number
  abdos: number
}

// Simulations S4-S6 : tractions = max + (semaine − 3) ; pompes/abdos = max × (1 + 0,03 × (semaine − 3))
export function getSimTargets(maxes: Maxes, week: number): SimTargets {
  const n = week - 3
  return {
    tractions: maxes.tractions + n,
    pompes: Math.round(maxes.pompes * (1 + 0.03 * n)),
    abdos: Math.round(maxes.abdos * (1 + 0.03 * n)),
  }
}

// Objectif final = cibles de la simulation S6, le niveau attendu le jour du test
export function getFinalTargets(maxes: Maxes): SimTargets {
  return getSimTargets(maxes, 6)
}

export interface Block {
  tag: string // AM, PM, ARMSTRONG, WOD 1…
  title: string
  lines: string[]
  note?: string
}

export interface Day {
  index: number // 0 = lundi
  name: string
  focus: string
  isJ4?: boolean
  ce?: number
  rest?: boolean
  simulation?: SimTargets
  blocks: Block[]
  warnings: string[]
}

const DAY_NAMES = ['LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI', 'SAMEDI', 'DIMANCHE']

export function getWeekDays(week: number, maxes: Maxes): Day[] {
  const ce = getCE(maxes, week)
  const emom = getEmomReps(maxes, week)
  const situps = getSitups(maxes)
  const wod1Pompes = getWod1Pompes(maxes)
  const plank = getPlankSeconds(week)
  const isSimWeek = week >= 4
  const sim = isSimWeek ? getSimTargets(maxes, week) : undefined

  const days: Day[] = [
    {
      index: 0,
      name: DAY_NAMES[0],
      focus: 'EMOM pompes + Armstrong J1',
      blocks: [
        {
          tag: 'AM',
          title: "EMOM 10' POMPES",
          lines: [`${emom} pompes chaque minute, pendant 10 minutes (${emom * 10} pompes au total)`],
          note: 'Départ de chaque minute au top. Le reste de la minute = récupération.',
        },
        {
          tag: 'PM',
          title: 'ARMSTRONG J1',
          lines: ['5 séries de tractions au max', 'Repos 90 s entre les séries'],
          note: 'Chaque série à l’échec technique, sans triche.',
        },
      ],
      warnings: [],
    },
    {
      index: 1,
      name: DAY_NAMES[1],
      focus: 'Armstrong J2 pyramide + WOD 1',
      blocks: [
        {
          tag: 'ARMSTRONG',
          title: 'J2 — PYRAMIDE',
          lines: ['1, 2, 3… reps en montant jusqu’à l’échec', '+ 1 série max pour finir'],
          note: 'Repos = 10 s par rep effectuée à la série précédente.',
        },
        {
          tag: 'WOD 1',
          title: "ENDURANCE DE FORCE — EMOM 12'",
          lines: [
            `Minute 1 : ${wod1Pompes} pompes (10 % du max 2')`,
            'Minute 2 : 20 sit-ups',
            'Minute 3 : 20 squats',
            '× 4 tours',
          ],
        },
      ],
      warnings: ['Pas de VMA / course intense demain soir : le J4 arrive jeudi.'],
    },
    {
      index: 2,
      name: DAY_NAMES[2],
      focus: 'Armstrong J3 prises + abdos',
      blocks: [
        {
          tag: 'ARMSTRONG',
          title: 'J3 — TROIS PRISES',
          lines: ['3 × 3 pronation', '3 × 3 supination', '3 × 3 prise serrée', 'Repos 60 s entre les séries'],
        },
        {
          tag: 'ABDOS',
          title: 'CIRCUIT GAINAGE',
          lines: [`3 tours : planche ${plank} s`, `+ ${situps} sit-ups`, '+ 15 leg raises'],
        },
      ],
      warnings: [
        'Pas de corde à grimper legless aujourd’hui (prise serrée déjà au programme).',
        'Veille du J4 : pas de VMA ni de séance de course intense.',
      ],
    },
    {
      index: 3,
      name: DAY_NAMES[3],
      focus: 'Armstrong J4 — LE jour clé',
      isJ4: true,
      ce,
      blocks: [
        {
          tag: 'ARMSTRONG',
          title: 'J4 — SÉRIES AU CHIFFRE',
          lines: [
            `Séries de ${ce} tractions, repos 60 s`,
            'Stop dès que le chiffre n’est plus atteint',
            'Objectif : 9 séries → +1 au CE la semaine suivante',
          ],
        },
      ],
      warnings: ['RIEN D’AUTRE aujourd’hui — pas de WOD, pas de course intense.', 'Pas de VMA la veille.'],
    },
    {
      index: 4,
      name: DAY_NAMES[4],
      focus: 'Armstrong J5 + WOD 3',
      blocks: [
        {
          tag: 'ARMSTRONG',
          title: 'J5 — LE JOUR LE PLUS DUR',
          lines: ['Refaire le jour Armstrong le plus difficile de la semaine (J1, J2 ou J3)'],
        },
        {
          tag: 'WOD 3',
          title: "CAP MENTALE — AMRAP 12'",
          lines: ['10 burpees', '20 mountain climbers', '30 s de gainage', 'Max de tours en 12 minutes'],
        },
      ],
      warnings: [],
    },
    {
      index: 5,
      name: DAY_NAMES[5],
      focus: isSimWeek ? 'SIMULATION TEST' : 'WOD 2 mixte',
      simulation: sim,
      blocks: isSimWeek
        ? [
            {
              tag: 'SIMULATION',
              title: 'TEST COMPLET — ORDRE RÉEL',
              lines: [
                `1. Tractions max — objectif : ${sim!.tractions}`,
                '— 5 min de repos —',
                `2. Pompes 2 min — objectif : ${sim!.pompes}`,
                '— 5 min de repos —',
                `3. Abdos 2 min — objectif : ${sim!.abdos}`,
              ],
              note: 'Note tes résultats dans l’onglet Historique après la séance.',
            },
          ]
        : [
            {
              tag: 'WOD 2',
              title: 'MIXTE — 4 ROUNDS',
              lines: ['15 pompes', '20 abdos', '15 squats', '10 burpees'],
            },
          ],
      warnings: isSimWeek ? ['Jour de simulation : pas de course intense aujourd’hui ni la veille.'] : [],
    },
    {
      index: 6,
      name: DAY_NAMES[6],
      focus: 'Repos complet',
      rest: true,
      blocks: [
        {
          tag: 'REPOS',
          title: 'RÉCUPÉRATION',
          lines: ['Repos complet — pas d’entraînement', 'Sommeil, hydratation, mobilité légère si besoin'],
        },
      ],
      warnings: [],
    },
  ]
  return days
}

export const GUARD_RAILS = [
  'DELOAD : perf en baisse 2 séances de suite OU douleur face interne du coude > 48 h → sauter le J3 de la semaine.',
  'Corde à grimper legless : jamais le même jour que le J3 (prise serrée).',
  'WOD avec tirage (sled, rowing) : à éviter la veille du J1 et du J4.',
  'La course à pied est gérée par un autre plan : garde seulement les jours signalés sans séance intense.',
]
