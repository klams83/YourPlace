import { useEffect, useState } from 'react'
import { DEFAULT_MAXES, type Maxes } from './program'

export interface SimResult {
  id: string
  date: string // ISO
  week: number
  tractions: number
  pompes: number
  abdos: number
}

export interface AppState {
  maxes: Maxes
  currentWeek: number
  validated: Record<string, boolean> // clé "S1-0" = semaine 1, lundi
  j4Series: Record<number, number> // séries au CE réussies au J4, par semaine
  history: SimResult[]
}

const STORAGE_KEY = 'prepa-test-militaire-v1'

const DEFAULT_STATE: AppState = {
  maxes: DEFAULT_MAXES,
  currentWeek: 1,
  validated: {},
  j4Series: {},
  history: [],
}

function load(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_STATE
    const parsed = JSON.parse(raw)
    return {
      ...DEFAULT_STATE,
      ...parsed,
      maxes: { ...DEFAULT_MAXES, ...parsed.maxes },
    }
  } catch {
    return DEFAULT_STATE
  }
}

export function useAppState() {
  const [state, setState] = useState<AppState>(load)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  return [state, setState] as const
}

export function dayKey(week: number, dayIndex: number): string {
  return `S${week}-${dayIndex}`
}
