import {
  GUARD_RAILS,
  WEEKS,
  getCarryBonus,
  getGtgTip,
  getPhase,
  getWeekDays,
  type Maxes,
} from '../lib/program'
import { dayKey } from '../lib/store'
import DayCard from './DayCard'

interface Props {
  maxes: Maxes
  week: number
  validated: Record<string, boolean>
  j4Series: Record<number, number>
  onWeekChange: (week: number) => void
  onToggleDay: (key: string) => void
  onJ4SeriesChange: (week: number, n: number) => void
}

export default function ProgramView({
  maxes,
  week,
  validated,
  j4Series,
  onWeekChange,
  onToggleDay,
  onJ4SeriesChange,
}: Props) {
  const phase = getPhase(week)
  const carry = getCarryBonus(j4Series, week)
  const days = getWeekDays(week, maxes, j4Series)
  const doneCount = days.filter((d) => !d.rest && validated[dayKey(week, d.index)]).length
  const totalCount = days.filter((d) => !d.rest).length

  return (
    <div className="space-y-4">
      {/* Sélecteur de semaine */}
      <nav aria-label="Semaine" className="grid grid-cols-6 gap-1">
        {WEEKS.map((w) => (
          <button
            key={w}
            onClick={() => onWeekChange(w)}
            aria-pressed={w === week}
            className={`border py-2 font-display text-sm font-semibold transition-colors ${
              w === week
                ? 'border-navy bg-navy text-white'
                : 'border-line bg-white/60 text-ink-soft hover:border-navy-soft'
            }`}
          >
            S{w}
          </button>
        ))}
      </nav>

      <div className="border border-line bg-white/60 px-3 py-2">
        <div className="flex items-center justify-between">
          <p className="font-display text-lg font-semibold uppercase tracking-wide text-navy">
            Semaine {week} — {phase.name}
          </p>
          <span className="font-display text-sm font-semibold text-ink-soft">
            {doneCount}/{totalCount} séances
          </span>
        </div>
        <p className="mt-0.5 text-xs leading-snug text-ink-soft">{phase.theme}</p>
        <p className="mt-1 text-xs text-ink-muted">
          {phase.ceBonus > 0 ? `CE +${phase.ceBonus} (phase)` : 'CE base'}
          {carry > 0 ? ` +${carry} (J4 validés)` : ''}
          {phase.emomBonus !== 0
            ? ` · EMOM ${phase.emomBonus > 0 ? '+' : ''}${phase.emomBonus}`
            : ''}
          {' · '}
          {week >= 4 ? 'Simulation test samedi' : 'WOD mixte + épreuve samedi'}
        </p>
      </div>

      <p className="border border-dashed border-line bg-white/40 px-3 py-2 text-xs leading-snug text-ink-soft">
        {getGtgTip(maxes, week, j4Series)}
      </p>

      <div className="space-y-3">
        {days.map((day) => (
          <DayCard
            key={day.index}
            day={day}
            validated={!!validated[dayKey(week, day.index)]}
            onToggle={() => onToggleDay(dayKey(week, day.index))}
            j4Done={day.isJ4 ? j4Series[week] : undefined}
            onJ4SeriesChange={day.isJ4 ? (n) => onJ4SeriesChange(week, n) : undefined}
          />
        ))}
      </div>

      {/* Garde-fous permanents */}
      <section className="border border-dashed border-stamp/60 bg-white/50 p-3">
        <h3 className="mb-2 font-display text-sm font-semibold uppercase tracking-wider text-stamp">
          Garde-fous
        </h3>
        <ul className="space-y-1.5">
          {GUARD_RAILS.map((rule) => (
            <li key={rule} className="flex gap-2 text-xs leading-snug text-ink-soft">
              <span className="text-stamp" aria-hidden>
                ■
              </span>
              {rule}
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
