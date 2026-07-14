export type Niveau = 1 | 2 | 3
export type VariableProgression = 'reps' | 'recup' | 'tempo' | 'lest'

export interface Exercice {
  nom: string
  series: number
  reps: string
  recup: number
}

export interface Seance {
  nom: string
  exercices: Exercice[]
}

export interface NiveauProgramme {
  plage: string
  focus: string
  seances: Seance[]
}

export interface Programme {
  niveau1: NiveauProgramme
  niveau2: NiveauProgramme
  niveau3: NiveauProgramme
}

export interface Profil {
  niveau: Niveau
  maxActuel: number
  dateTest: string
}

export interface Cycle {
  totalSeancesCycle: number
  variableProgressionParSemaine: (VariableProgression | null)[]
}

export interface ExerciceFait {
  nom: string
  repsFaites: number[]
}

export interface SeanceHistorique {
  date: string
  seanceNom: string
  niveau: Niveau
  exercices: ExerciceFait[]
  rpe: number | null
  note: string
}

export interface TestEntry {
  date: string
  max: number
}

export type ChallengeUnite = 'reps' | 'secondes'

export interface ChallengeEntry {
  nom: string
  date: string
  score: number
  unite: ChallengeUnite
}

export interface AppState {
  profil: Profil | null
  cycle: Cycle
  historique: SeanceHistorique[]
  tests: TestEntry[]
  challenges: ChallengeEntry[]
}

export const CHALLENGES_DEFS: { nom: string; unite: ChallengeUnite; description: string }[] = [
  {
    nom: 'Demi-BBR',
    unite: 'secondes',
    description: '3 muscle-up, 25 dips, 15 tractions, 30 pompes, 3 muscle-up — le plus vite possible.',
  },
  {
    nom: 'On the bar',
    unite: 'reps',
    description: "1 traction, 10' iso bras tendus, 1 traction, 10' iso bras tendus... jusqu'à l'échec. Score = dernier palier réussi.",
  },
  {
    nom: 'The 100',
    unite: 'secondes',
    description: '100 dips, 100 tractions, 100 pompes — le plus vite possible.',
  },
  {
    nom: 'Pharaon',
    unite: 'reps',
    description: "1 pompe/1 muscle-up/1 dip, 2/2/2, 3/3/3... jusqu'à l'échec. Score = dernier palier réussi.",
  },
]

export const NIVEAU_INFO: { valeur: Niveau; nom: string; plage: string }[] = [
  { valeur: 1, nom: 'Débutant', plage: '≤ 3 tractions' },
  { valeur: 2, nom: 'Intermédiaire', plage: '4 à 10 tractions' },
  { valeur: 3, nom: 'Avancé', plage: '11 tractions et plus' },
]
