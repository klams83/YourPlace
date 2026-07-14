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

export const CHALLENGES_DEFS: { nom: string; unite: ChallengeUnite }[] = [
  { nom: 'Max one shot', unite: 'reps' },
  { nom: '50 tractions chrono', unite: 'secondes' },
  { nom: 'Échelle 1→10', unite: 'reps' },
  { nom: 'Hold menton — temps max', unite: 'secondes' },
  { nom: 'Dead hang — temps max', unite: 'secondes' },
]
