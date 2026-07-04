import { useState } from 'react'
import { getFinalTargets, getSimTargets, type Maxes } from '../lib/program'
import type { SimResult } from '../lib/store'
import ProgressChart from './ProgressChart'

interface Props {
  maxes: Maxes
  history: SimResult[]
  onAdd: (result: Omit<SimResult, 'id'>) => void
  onDelete: (id: string) => void
}

export default function HistoryView({ maxes, history, onAdd, onDelete }: Props) {
  const [week, setWeek] = useState(4)
  const [tractions, setTractions] = useState('')
  const [pompes, setPompes] = useState('')
  const [abdos, setAbdos] = useState('')

  const targets = getSimTargets(maxes, week)
  const finalTargets = getFinalTargets(maxes)
  const sorted = [...history].sort((a, b) => b.date.localeCompare(a.date))

  const canSave = tractions !== '' && pompes !== '' && abdos !== ''

  const save = () => {
    if (!canSave) return
    onAdd({
      date: new Date().toISOString(),
      week,
      tractions: Math.max(0, Number(tractions)),
      pompes: Math.max(0, Number(pompes)),
      abdos: Math.max(0, Number(abdos)),
    })
    setTractions('')
    setPompes('')
    setAbdos('')
  }

  return (
    <div className="space-y-4">
      <section className="border border-line bg-white/60 p-3">
        <h2 className="font-display text-lg font-semibold uppercase tracking-wide text-navy">
          Progression vers le test
        </h2>
        <div className="mt-2">
          <ProgressChart history={history} finalTargets={finalTargets} />
        </div>
      </section>

      <section className="border border-line bg-white/60 p-3">
        <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-navy">
          Enregistrer une simulation
        </h3>
        <div className="mt-2 grid grid-cols-3 gap-1" role="group" aria-label="Semaine de la simulation">
          {[4, 5, 6].map((w) => (
            <button
              key={w}
              onClick={() => setWeek(w)}
              aria-pressed={w === week}
              className={`border py-1.5 font-display text-sm font-semibold ${
                w === week ? 'border-navy bg-navy text-white' : 'border-line bg-paper text-ink-soft'
              }`}
            >
              S{w}
            </button>
          ))}
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {(
            [
              ['Tractions', tractions, setTractions, targets.tractions],
              ['Pompes', pompes, setPompes, targets.pompes],
              ['Abdos', abdos, setAbdos, targets.abdos],
            ] as const
          ).map(([label, value, set, target]) => (
            <label key={label} className="text-center">
              <span className="block text-xs uppercase tracking-wider text-ink-muted">{label}</span>
              <input
                type="number"
                inputMode="numeric"
                min={0}
                value={value}
                onChange={(e) => set(e.target.value)}
                placeholder={String(target)}
                className="mt-1 w-full border border-line bg-paper px-1 py-2 text-center font-display text-xl font-bold text-navy placeholder:text-ink-muted/50 focus:border-navy focus:outline-none"
              />
              <span className="mt-0.5 block text-[11px] text-ink-muted">obj. {target}</span>
            </label>
          ))}
        </div>
        <button
          onClick={save}
          disabled={!canSave}
          className="mt-3 w-full border border-navy bg-navy py-2 font-display text-sm font-semibold uppercase tracking-wider text-white hover:bg-navy-soft disabled:cursor-not-allowed disabled:opacity-40"
        >
          Enregistrer
        </button>
      </section>

      {sorted.length > 0 && (
        <section className="border border-line bg-white/60 p-3">
          <h3 className="mb-2 font-display text-sm font-semibold uppercase tracking-wider text-navy">
            Simulations enregistrées
          </h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line text-left text-xs uppercase tracking-wider text-ink-muted">
                <th className="py-1 font-medium">Date</th>
                <th className="py-1 text-center font-medium">Trac.</th>
                <th className="py-1 text-center font-medium">Pompes</th>
                <th className="py-1 text-center font-medium">Abdos</th>
                <th className="py-1" />
              </tr>
            </thead>
            <tbody>
              {sorted.map((r) => {
                const t = getSimTargets(maxes, r.week)
                return (
                  <tr key={r.id} className="border-b border-line/50">
                    <td className="py-1.5">
                      <span className="font-display font-semibold">S{r.week}</span>{' '}
                      <span className="text-xs text-ink-muted">
                        {new Date(r.date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })}
                      </span>
                    </td>
                    {(
                      [
                        [r.tractions, t.tractions],
                        [r.pompes, t.pompes],
                        [r.abdos, t.abdos],
                      ] as const
                    ).map(([value, target], i) => (
                      <td
                        key={i}
                        className={`py-1.5 text-center font-semibold ${
                          value >= target ? 'text-chart-abdos' : 'text-ink'
                        }`}
                      >
                        {value}
                        <span className="font-normal text-ink-muted">/{target}</span>
                      </td>
                    ))}
                    <td className="py-1.5 text-right">
                      <button
                        onClick={() => onDelete(r.id)}
                        aria-label={`Supprimer la simulation du ${new Date(r.date).toLocaleDateString('fr-FR')}`}
                        className="px-1 text-ink-muted hover:text-stamp"
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </section>
      )}
    </div>
  )
}
