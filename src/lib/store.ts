import type { AppState, Niveau, VariableProgression } from './types'

const STORAGE_KEY = 'tractions0max:v1'

export function niveauDepuisMax(max: number): Niveau {
  if (max <= 3) return 1
  if (max <= 8) return 2
  return 3
}

export function defaultState(): AppState {
  return {
    profil: null,
    cycle: { totalSeancesCycle: 0, variableProgressionParSemaine: [null, null, null, null] },
    historique: [],
    tests: [],
    challenges: [],
  }
}

export function loadState(): AppState {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return defaultState()
  try {
    const parsed = JSON.parse(raw)
    return { ...defaultState(), ...parsed }
  } catch {
    return defaultState()
  }
}

export function saveState(state: AppState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export function exportStateJson(state: AppState): string {
  return JSON.stringify(state, null, 2)
}

export function importStateJson(json: string): AppState {
  const parsed = JSON.parse(json)
  return { ...defaultState(), ...parsed }
}

/** Numéro de semaine dans le cycle courant (1 à 4). */
export function semaineDuCycle(totalSeancesCycle: number): number {
  return Math.min(4, Math.floor(totalSeancesCycle / 3) + 1)
}

/** Index de la séance du jour (0, 1 ou 2) dans la rotation des 3 séances hebdo. */
export function indexSeanceDuJour(totalSeancesCycle: number): number {
  return totalSeancesCycle % 3
}

export function cycleTermine(totalSeancesCycle: number): boolean {
  return totalSeancesCycle >= 12
}

const ROTATION_PAR_DEFAUT: VariableProgression[] = ['reps', 'recup', 'tempo', 'lest']

/** Propose une variable de progression pour la semaine donnée (1-4), en excluant le lest si niveau 1. */
export function proposerVariableProgression(semaine: number, niveau: Niveau): VariableProgression {
  const choix = ROTATION_PAR_DEFAUT.filter((v) => niveau > 1 || v !== 'lest')
  return choix[(semaine - 1) % choix.length]
}
