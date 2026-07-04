// Moteur de calcul du programme — toutes les formules du plan 6 semaines.
// Tout est dérivé des 3 maxes de référence ; changer un max recalcule tout.
//
// Programmation v2 « prépa élite », inspirée des standards du marché :
// - Frankton Tactical : efforts longs + phases intenses, volume calibré,
//   matériel minimum, « épreuves » hebdomadaires à valider
// - Prépa type Invictus / Forces Spéciales Coaching : exigence, autorégulation,
//   récupération traquée, spécificité des tests enchaînés
// - Calisthénics (Flo Marrec) : tempo, excentriques, isométrie, densité, grip
// - Hybride Hyrox / La Forge : moteur sous fatigue, travail « compromis »
// La colonne vertébrale reste le programme Armstrong tractions, 5 j/semaine.

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
  theme: string
  ceBonus: number
  emomBonus: number
}

export function getPhase(week: number): Phase {
  if (week <= 2)
    return {
      name: 'Installation',
      theme: 'Accumulation : volume, technique stricte, tempo. RPE cible 7.',
      ceBonus: 0,
      emomBonus: 0,
    }
  if (week <= 4)
    return {
      name: 'Montée en charge',
      theme: 'Intensification : densité, formats rallongés, première simulation. RPE cible 8.',
      ceBonus: 1,
      emomBonus: 1,
    }
  if (week === 5)
    return {
      name: 'Pic',
      theme: 'Semaine la plus dure du bloc : standards élite, efforts maximaux. RPE 8-9.',
      ceBonus: 2,
      emomBonus: 2,
    }
  return {
    name: 'Affûtage',
    theme: 'Volume −40 %, intensité conservée, fraîcheur maximale pour le test. RPE ≤ 7.',
    ceBonus: 1,
    emomBonus: -1,
  }
}

// Chiffre d'entraînement J4 (CE) = floor(maxTractions × 0.5), min 2, + modulation hebdo
export function getBaseCE(maxes: Maxes): number {
  return Math.max(2, Math.floor(maxes.tractions * 0.5))
}

// Autorégulation Armstrong : chaque J4 précédent validé à 9 séries ou plus
// débloque +1 au CE (cumulable, plafonné à +3)
export function getCarryBonus(j4Series: Record<number, number>, week: number): number {
  let carry = 0
  for (let w = 1; w < week; w++) {
    if ((j4Series[w] ?? 0) >= 9) carry++
  }
  return Math.min(carry, 3)
}

export function getCE(maxes: Maxes, week: number, j4Series: Record<number, number> = {}): number {
  return getBaseCE(maxes) + getPhase(week).ceBonus + getCarryBonus(j4Series, week)
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

// Pompes tempo (30X0 : 3 s de descente, explosif en montée) = 15 % du max
export function getTempoPompes(maxes: Maxes): number {
  return Math.max(5, Math.round(maxes.pompes * 0.15))
}

// Variantes de pompes (diamant, archer, déficit) = 20 % du max
export function getVariantPompes(maxes: Maxes): number {
  return Math.max(6, Math.round(maxes.pompes * 0.2))
}

// V-ups / hollow rocks = 20 % du max abdos
export function getVups(maxes: Maxes): number {
  return Math.max(8, Math.round(maxes.abdos * 0.2))
}

// Planche : 45-60 s selon la semaine (60 s imposées en S5 « Pic »)
export function getPlankSeconds(week: number): number {
  if (week <= 2) return 45
  if (week <= 4) return 50
  if (week === 5) return 60
  return 45
}

// Suspension à la barre (grip = premier facteur d'échec aux tests type corde/agrès)
const DEAD_HANG: Record<number, number> = { 1: 30, 2: 35, 3: 40, 4: 45, 5: 50, 6: 40 }
export function getDeadHangSeconds(week: number): number {
  return DEAD_HANG[week] ?? 30
}

// Hollow hold : 20 s + 5 s par semaine, plafonné, allégé en affûtage
export function getHollowSeconds(week: number): number {
  if (week === 6) return 25
  return Math.min(40, 20 + 5 * (week - 1))
}

// Durée de l'AMRAP cap mentale du vendredi : rallongé au fil du bloc
export function getAmrapMinutes(week: number): number {
  if (week <= 2) return 12
  if (week <= 4) return 16
  if (week === 5) return 20
  return 10
}

// Nombre de tours du WOD 1 endurance de force du mardi
export function getWod1Rounds(week: number): number {
  if (week <= 2) return 4
  if (week <= 4) return 5
  if (week === 5) return 6
  return 3
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

// Épreuve hebdo du samedi (S1-S3), à la Frankton : un standard chiffré à valider
export interface Challenge {
  name: string
  lines: string[]
  standard: string
}
export function getChallenge(maxes: Maxes, week: number): Challenge {
  const plank = getPlankSeconds(week)
  if (week === 1)
    return {
      name: 'Rusticité',
      lines: ['50 burpees, départ au top', 'Rythme régulier, pas de sprint de départ'],
      standard: 'Standard à valider : moins de 5 minutes',
    }
  if (week === 2)
    return {
      name: 'Gainage sous fatigue',
      lines: [
        `Planche cumulée : ${Math.round((4 * plank) / 60)} min ${(4 * plank) % 60 ? `${(4 * plank) % 60} s` : ''} au total (4 × ${plank} s minimum par tenue)`,
        'Chaque pause = 10 V-ups de pénalité',
      ],
      standard: 'Standard à valider : 3 pauses maximum',
    }
  return {
    name: 'Standard élite pompes',
    lines: [
      `${maxes.pompes * 2} pompes au total, format libre`,
      'Inspiré du standard opérationnel type GIGN (≈ 100 pompes)',
    ],
    standard: 'Standard à valider : moins de 10 minutes',
  }
}

export interface Block {
  tag: string // PRÉPA, AM, PM, ARMSTRONG, WOD 1, FINISHER…
  title: string
  lines: string[]
  note?: string
}

export interface Day {
  index: number // 0 = lundi
  name: string
  focus: string
  duration?: string
  isJ4?: boolean
  ce?: number
  rest?: boolean
  simulation?: SimTargets
  blocks: Block[]
  warnings: string[]
}

const DAY_NAMES = ['LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI', 'SAMEDI', 'DIMANCHE']

const WARMUP_PULL: Block = {
  tag: 'PRÉPA',
  title: 'ACTIVATION (8-10 min)',
  lines: [
    '2 min de mobilité épaules/poignets/coudes',
    '2 × 10 scap pulls (suspension bras tendus, hausser/abaisser les épaules)',
    '2 × 15 s de suspension active',
    '1 série de tractions à 50 % du max, propre et explosive',
  ],
}

const WARMUP_PUSH: Block = {
  tag: 'PRÉPA',
  title: 'ACTIVATION (5-8 min)',
  lines: [
    '2 min de mobilité poignets et thoracique',
    '2 × 10 pompes lentes incomplètes (mise en tension)',
    '20 mountain climbers lents + 20 s de planche',
  ],
}

export function getWeekDays(
  week: number,
  maxes: Maxes,
  j4Series: Record<number, number> = {},
): Day[] {
  const ce = getCE(maxes, week, j4Series)
  const emom = getEmomReps(maxes, week)
  const situps = getSitups(maxes)
  const wod1Pompes = getWod1Pompes(maxes)
  const wod1Rounds = getWod1Rounds(week)
  const tempoPompes = getTempoPompes(maxes)
  const variantPompes = getVariantPompes(maxes)
  const vups = getVups(maxes)
  const plank = getPlankSeconds(week)
  const deadHang = getDeadHangSeconds(week)
  const hollow = getHollowSeconds(week)
  const amrap = getAmrapMinutes(week)
  const isSimWeek = week >= 4
  const sim = isSimWeek ? getSimTargets(maxes, week) : undefined
  const challenge = !isSimWeek ? getChallenge(maxes, week) : undefined
  const taper = week === 6

  const days: Day[] = [
    {
      index: 0,
      name: DAY_NAMES[0],
      focus: 'Moteur pompes + Armstrong J1',
      duration: 'AM ~25 min · PM ~35 min',
      blocks: [
        { ...WARMUP_PUSH, title: 'ACTIVATION AM (5-8 min)' },
        {
          tag: 'AM',
          title: "EMOM 10' POMPES",
          lines: [
            `${emom} pompes chaque minute, pendant 10 minutes (${emom * 10} pompes au total)`,
            'Cadence constante, poitrine au sol, verrouillage complet en haut',
          ],
          note: 'Départ de chaque minute au top. Si une minute casse, finir la séance à −1 rep/min.',
        },
        {
          tag: 'AM+',
          title: 'POMPES TEMPO 30X0',
          lines: [
            `3 × ${tempoPompes} pompes tempo : 3 s de descente, explosif en montée`,
            'Repos 90 s — qualité avant quantité',
          ],
          note: 'Le tempo construit le contrôle et blinde les coudes/épaules (méthode calisthénics).',
        },
        { ...WARMUP_PULL, title: 'ACTIVATION PM (8-10 min)' },
        {
          tag: 'PM',
          title: 'ARMSTRONG J1',
          lines: ['5 séries de tractions au max, repos 90 s', 'Chaque série à l’échec technique, zéro triche'],
          note: 'Note mentalement tes totaux : le J5 refera le jour le plus dur de la semaine.',
        },
        {
          tag: 'FINISHER',
          title: 'GRIP + TRONC',
          lines: [
            `2 × ${deadHang} s de suspension bras tendus (dead hang)`,
            `2 × ${hollow} s de hollow hold`,
            'Repos 60 s entre les tenues',
          ],
          note: 'Le grip est le premier facteur d’échec aux agrès/corde : on le travaille chaque semaine.',
        },
      ],
      warnings: ['WOD avec tirage (sled, rowing) interdit aujourd’hui : J1 le soir, J4 jeudi.'],
    },
    {
      index: 1,
      name: DAY_NAMES[1],
      focus: 'Armstrong J2 pyramide + endurance de force',
      duration: '~50 min',
      blocks: [
        WARMUP_PULL,
        {
          tag: 'ARMSTRONG',
          title: 'J2 — PYRAMIDE',
          lines: [
            '1, 2, 3… reps en montant jusqu’à l’échec',
            '+ 1 série max pour finir',
            'Repos = 10 s par rep effectuée à la série précédente',
          ],
        },
        {
          tag: 'WOD 1',
          title: `ENDURANCE DE FORCE — EMOM ${wod1Rounds * 3}'`,
          lines: [
            `Minute 1 : ${wod1Pompes} pompes (10 % du max 2')`,
            'Minute 2 : 20 sit-ups',
            'Minute 3 : 20 squats',
            `× ${wod1Rounds} tours`,
          ],
          note: 'Efforts longs à intensité contrôlée : la base « fort et résistant » des prépas tactiques.',
        },
        {
          tag: 'ACCESSOIRE',
          title: 'POUSSÉE VARIÉE + TRONC LATÉRAL',
          lines: [
            `3 × ${variantPompes} pompes diamant (S1-S2) / archer (S3+)`,
            '2 × 30 s de planche latérale par côté',
          ],
        },
      ],
      warnings: ['Pas de VMA / course intense demain soir : le J4 arrive jeudi.'],
    },
    {
      index: 2,
      name: DAY_NAMES[2],
      focus: 'Armstrong J3 prises + tronc complet + prehab',
      duration: '~45 min',
      blocks: [
        WARMUP_PULL,
        {
          tag: 'ARMSTRONG',
          title: 'J3 — TROIS PRISES',
          lines: [
            '3 × 3 pronation',
            '3 × 3 supination',
            '3 × 3 prise serrée',
            'Repos 60 s entre les séries',
          ],
          note: 'Si les 3 × 3 passent facile : ajouter 1 s de pause menton au-dessus de la barre.',
        },
        {
          tag: 'TRONC',
          title: 'CIRCUIT GAINAGE — 3 TOURS',
          lines: [
            `Planche ${plank} s`,
            `${situps} sit-ups`,
            '15 leg raises suspendus à la barre (au sol si le grip lâche)',
            `${vups} V-ups`,
          ],
          note: 'Les leg raises suspendus travaillent le grip et le tronc en même temps.',
        },
        {
          tag: 'PREHAB',
          title: 'COUDES + ÉPAULES (10 min, non négociable)',
          lines: [
            '2 × 20 extensions de poignets au sol (doigts vers les genoux)',
            '2 × 10 rotations complètes des poignets en appui',
            '2 × 15 s de suspension passive relâchée',
            '10 relevés en Y-T-W au sol, lents',
          ],
          note: 'Protection de la face interne du coude — le point faible n°1 sur Armstrong.',
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
      duration: '~30 min, rien d’autre',
      isJ4: true,
      ce,
      blocks: [
        WARMUP_PULL,
        {
          tag: 'ARMSTRONG',
          title: 'J4 — SÉRIES AU CHIFFRE',
          lines: [
            `Séries de ${ce} tractions, repos 60 s strict (chrono)`,
            'Stop dès que le chiffre n’est plus atteint',
            'Objectif : 9 séries → +1 au CE la semaine suivante (log ci-dessus)',
          ],
          note: 'C’est la séance qui fait progresser le max. Fraîcheur maximale exigée : sommeil, repas, zéro fatigue parasite.',
        },
        {
          tag: 'RETOUR',
          title: 'DÉCRASSAGE (5 min)',
          lines: ['2 × 15 s de suspension passive', '5 min de respiration nasale lente (4 s inspire / 6 s expire)'],
        },
      ],
      warnings: ['RIEN D’AUTRE aujourd’hui — pas de WOD, pas de course intense.', 'Pas de VMA la veille.'],
    },
    {
      index: 4,
      name: DAY_NAMES[4],
      focus: 'Armstrong J5 + cap mentale',
      duration: '~55 min',
      blocks: [
        WARMUP_PULL,
        {
          tag: 'ARMSTRONG',
          title: 'J5 — LE JOUR LE PLUS DUR',
          lines: ['Refaire le jour Armstrong le plus difficile de la semaine (J1, J2 ou J3)'],
        },
        {
          tag: 'WOD 3',
          title: `CAP MENTALE — AMRAP ${amrap}'`,
          lines: [
            '10 burpees',
            '20 mountain climbers',
            '30 s de gainage',
            `Max de tours en ${amrap} minutes — noter le score, le battre la semaine suivante`,
          ],
          note: taper
            ? 'Affûtage : AMRAP raccourci, on entretient sans creuser la fatigue.'
            : 'Format long à la Frankton : c’est ici que se construit la rusticité mentale.',
        },
        {
          tag: 'FINISHER',
          title: 'GRIP AVANCÉ',
          lines: [
            `2 × ${deadHang} s de suspension, dont 10 s en prise serrée`,
            '1 × max de flexed-arm hang (menton au-dessus de la barre, tenir)',
            'Option si accès corde : 2-3 montées de corde AVEC les jambes (legless interdit cette semaine si douleur coude)',
          ],
        },
      ],
      warnings: isSimWeek ? ['Simulation demain : garder de la réserve, RPE ≤ 8 sur le WOD.'] : [],
    },
    {
      index: 5,
      name: DAY_NAMES[5],
      focus: isSimWeek ? 'SIMULATION TEST' : `WOD mixte + épreuve « ${challenge!.name} »`,
      duration: isSimWeek ? '~40 min' : '~45 min',
      simulation: sim,
      blocks: isSimWeek
        ? [
            {
              tag: 'PRÉPA',
              title: 'PROTOCOLE PRÉ-TEST (15 min)',
              lines: [
                'Échauffement complet : mobilité + scap pulls + 2 séries légères de chaque épreuve',
                'Monter progressivement à 60-70 % d’intensité, puis 5 min de repos complet',
                'Se mettre en condition réelle : chrono visible, zéro distraction',
              ],
            },
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
              note: 'Note tes résultats dans l’onglet Historique. Analyse : quelle épreuve a cédé en premier ? C’est elle qu’on soigne la semaine suivante.',
            },
            {
              tag: 'RETOUR',
              title: 'RETOUR AU CALME',
              lines: ['10 min de marche + mobilité légère', 'Repas complet dans les 2 h'],
            },
          ]
        : [
            WARMUP_PUSH,
            {
              tag: 'WOD 2',
              title: 'MIXTE — 4 ROUNDS',
              lines: ['15 pompes', '20 abdos', '15 squats', '10 burpees', 'Repos 60 s entre les rounds'],
              note: 'Sous fatigue, garder des standards parfaits : c’est du travail « compromis » type Hyrox.',
            },
            {
              tag: 'ÉPREUVE',
              title: `« ${challenge!.name.toUpperCase()} »`,
              lines: [...challenge!.lines, challenge!.standard],
              note: 'Épreuve à valider, à la Frankton : si le standard tombe, elle est acquise. Sinon, on la retente la semaine suivante.',
            },
          ],
      warnings: isSimWeek ? ['Jour de simulation : pas de course intense aujourd’hui ni la veille.'] : [],
    },
    {
      index: 6,
      name: DAY_NAMES[6],
      focus: 'Récupération active',
      rest: true,
      blocks: [
        {
          tag: 'REPOS',
          title: 'RÉCUPÉRATION ACTIVE',
          lines: [
            '30-45 min de marche facile (ou vélo très souple)',
            '15 min de mobilité : épaules, poignets, hanches, thoracique',
            '5 min de respiration box (4 s inspire / 4 s bloque / 4 s expire / 4 s bloque)',
          ],
          note: 'Pas d’entraînement. La progression se fait ici : viser 7 h 30 de sommeil minimum et manger à hauteur de l’effort.',
        },
      ],
      warnings: [],
    },
  ]
  return days
}

// Option quotidienne « grease the groove » (calisthénics) affichée sur la semaine
export function getGtgTip(maxes: Maxes, week: number, j4Series: Record<number, number> = {}): string {
  const ce = getCE(maxes, week, j4Series)
  const gtg = Math.max(1, Math.round(ce * 0.5))
  return (
    `Option grease-the-groove : 3-4 mini-séries de ${gtg} tractions faciles réparties dans la journée, ` +
    'jamais à l’échec. Pas le mercredi soir ni le jeudi (fraîcheur J4).'
  )
}

export const GUARD_RAILS = [
  'DELOAD : perf en baisse 2 séances de suite OU douleur face interne du coude > 48 h → sauter le J3 de la semaine.',
  'Corde à grimper legless : jamais le même jour que le J3 (prise serrée).',
  'WOD avec tirage (sled, rowing) : à éviter la veille du J1 et du J4.',
  'La course à pied est gérée par un autre plan : garde seulement les jours signalés sans séance intense.',
  'Récupération = partie du programme : 7 h 30 de sommeil minimum, hydratation, repas complet après chaque séance.',
  'Si le RPE réel dépasse la cible de la phase 2 jours de suite : retirer une série de chaque bloc accessoire.',
]
