import { useState } from 'react'
import { DEFAULT_MAXES, type Maxes } from './lib/program'
import { useAppState, type SimResult } from './lib/store'
import ProgramView from './components/ProgramView'
import TestsView from './components/TestsView'
import HistoryView from './components/HistoryView'
import SettingsView from './components/SettingsView'

type Tab = 'programme' | 'tests' | 'historique' | 'reglages'

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'programme', label: 'Programme', icon: '▦' },
  { id: 'tests', label: 'Tests réf.', icon: '⏱' },
  { id: 'historique', label: 'Historique', icon: '↗' },
  { id: 'reglages', label: 'Réglages', icon: '⚙' },
]

export default function App() {
  const [state, setState] = useAppState()
  const [tab, setTab] = useState<Tab>('programme')

  const setMaxes = (maxes: Maxes) => setState((s) => ({ ...s, maxes }))
  const setWeek = (currentWeek: number) => setState((s) => ({ ...s, currentWeek }))
  const toggleDay = (key: string) =>
    setState((s) => ({ ...s, validated: { ...s.validated, [key]: !s.validated[key] } }))
  const setJ4Series = (week: number, n: number) =>
    setState((s) => ({ ...s, j4Series: { ...s.j4Series, [week]: n } }))
  const addResult = (result: Omit<SimResult, 'id'>) =>
    setState((s) => ({
      ...s,
      history: [...s.history, { ...result, id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}` }],
    }))
  const deleteResult = (id: string) =>
    setState((s) => ({ ...s, history: s.history.filter((r) => r.id !== id) }))
  const reset = () =>
    setState({ maxes: DEFAULT_MAXES, currentWeek: 1, validated: {}, j4Series: {}, history: [] })

  return (
    <div className="mx-auto flex min-h-dvh max-w-lg flex-col">
      <header className="border-b-4 border-double border-navy bg-paper px-4 pb-2 pt-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-stamp">
          Carnet de progression — 6 semaines
        </p>
        <h1 className="font-display text-2xl font-bold uppercase tracking-wide text-navy">
          Prépa Test Militaire
        </h1>
        <p className="text-xs text-ink-soft">
          Tractions · Pompes 2 min · Abdos 2 min — 100 % poids de corps
        </p>
      </header>

      <main className="flex-1 px-3 pb-24 pt-3">
        {tab === 'programme' && (
          <ProgramView
            maxes={state.maxes}
            week={state.currentWeek}
            validated={state.validated}
            j4Series={state.j4Series}
            onWeekChange={setWeek}
            onToggleDay={toggleDay}
            onJ4SeriesChange={setJ4Series}
          />
        )}
        {tab === 'tests' && <TestsView maxes={state.maxes} onGoToSettings={() => setTab('reglages')} />}
        {tab === 'historique' && (
          <HistoryView maxes={state.maxes} history={state.history} onAdd={addResult} onDelete={deleteResult} />
        )}
        {tab === 'reglages' && <SettingsView maxes={state.maxes} onChange={setMaxes} onReset={reset} />}
      </main>

      <nav
        aria-label="Navigation principale"
        className="fixed inset-x-0 bottom-0 border-t-2 border-navy bg-paper pb-[env(safe-area-inset-bottom)]"
      >
        <div className="mx-auto grid max-w-lg grid-cols-4">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              aria-current={tab === t.id ? 'page' : undefined}
              className={`flex flex-col items-center gap-0.5 py-2.5 font-display text-[11px] font-semibold uppercase tracking-wide ${
                tab === t.id ? 'bg-navy text-white' : 'text-ink-soft'
              }`}
            >
              <span aria-hidden className="text-base leading-none">
                {t.icon}
              </span>
              {t.label}
            </button>
          ))}
        </div>
      </nav>
    </div>
  )
}
