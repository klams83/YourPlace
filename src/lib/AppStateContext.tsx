import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { AppState } from './types'
import { loadState, saveState } from './store'

interface Ctx {
  state: AppState
  setState: (updater: AppState | ((prev: AppState) => AppState)) => void
}

const AppStateContext = createContext<Ctx | null>(null)

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [state, setStateRaw] = useState<AppState>(() => loadState())

  useEffect(() => {
    saveState(state)
  }, [state])

  function setState(updater: AppState | ((prev: AppState) => AppState)) {
    setStateRaw((prev) => (typeof updater === 'function' ? (updater as (p: AppState) => AppState)(prev) : updater))
  }

  return <AppStateContext.Provider value={{ state, setState }}>{children}</AppStateContext.Provider>
}

export function useAppState() {
  const ctx = useContext(AppStateContext)
  if (!ctx) throw new Error('useAppState doit être utilisé dans AppStateProvider')
  return ctx
}
