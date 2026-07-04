import type { Day } from '../lib/program'

interface Props {
  day: Day
  validated: boolean
  onToggle: () => void
  j4Done?: number
  onJ4SeriesChange?: (n: number) => void
}

export default function DayCard({ day, validated, onToggle, j4Done, onJ4SeriesChange }: Props) {
  return (
    <article
      className={`border bg-white/70 shadow-sm ${
        day.isJ4 ? 'border-stamp border-2' : 'border-line'
      } ${validated ? 'opacity-80' : ''}`}
    >
      <header
        className={`flex items-center justify-between px-3 py-2 ${
          day.isJ4 ? 'bg-stamp text-white' : day.rest ? 'bg-paper-dark text-ink-soft' : 'bg-navy text-white'
        }`}
      >
        <div>
          <h3 className="font-display text-lg font-semibold uppercase tracking-wide leading-tight">
            {day.name}
          </h3>
          <p className={`text-xs ${day.isJ4 ? 'text-white/90' : day.rest ? 'text-ink-muted' : 'text-white/80'}`}>
            {day.focus}
            {day.duration && <span className="opacity-75"> · {day.duration}</span>}
          </p>
        </div>
        {!day.rest && (
          <label className="flex cursor-pointer select-none items-center gap-2 text-xs font-semibold uppercase">
            <input
              type="checkbox"
              checked={validated}
              onChange={onToggle}
              className="size-5 accent-white"
              aria-label={`Séance ${day.name} validée`}
            />
            {validated ? 'Validée ✓' : 'Valider'}
          </label>
        )}
      </header>

      {/* Chiffre J4 mis en avant : tampon rouge central */}
      {day.isJ4 && day.ce !== undefined && (
        <div className="flex flex-col items-center gap-1 py-4">
          <div className="stamp flex size-24 flex-col items-center justify-center rounded-full bg-white/60">
            <span className="font-display text-4xl font-bold leading-none">{day.ce}</span>
            <span className="text-[10px] font-bold uppercase tracking-widest">reps / série</span>
          </div>
          <p className="text-xs font-semibold uppercase tracking-wider text-stamp">
            Chiffre d’entraînement (CE)
          </p>
          {onJ4SeriesChange && (
            <div className="mt-2 flex flex-col items-center gap-1">
              <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-ink-soft">
                Séries au CE réussies
                <input
                  type="number"
                  inputMode="numeric"
                  min={0}
                  max={15}
                  value={j4Done || ''}
                  placeholder="0"
                  onChange={(e) =>
                    onJ4SeriesChange(Math.max(0, Math.min(15, Number(e.target.value) || 0)))
                  }
                  className="w-16 border border-line bg-paper px-1 py-1 text-center font-display text-lg font-bold text-navy focus:border-navy focus:outline-none"
                />
              </label>
              {(j4Done ?? 0) >= 9 ? (
                <p className="text-xs font-semibold text-chart-abdos">
                  ✓ Objectif 9 séries atteint → +1 au CE la semaine prochaine
                </p>
              ) : (
                <p className="text-xs text-ink-muted">9 séries = +1 au CE la semaine suivante</p>
              )}
            </div>
          )}
        </div>
      )}

      <div className="divide-y divide-line/60 px-3">
        {day.blocks.map((block) => (
          <section key={block.tag + block.title} className="py-3">
            <div className="mb-1 flex items-baseline gap-2">
              <span className="bg-navy px-1.5 py-0.5 font-display text-[11px] font-semibold uppercase tracking-wider text-white">
                {block.tag}
              </span>
              <h4 className="font-display text-sm font-semibold uppercase tracking-wide">{block.title}</h4>
            </div>
            <ul className="ml-1 space-y-0.5 text-[15px] leading-snug">
              {block.lines.map((line) => (
                <li key={line} className="flex gap-2">
                  <span className="text-ink-muted" aria-hidden>
                    ▸
                  </span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
            {block.note && <p className="mt-1.5 text-xs italic text-ink-soft">{block.note}</p>}
          </section>
        ))}
      </div>

      {day.warnings.length > 0 && (
        <footer className="border-t border-dashed border-stamp/50 bg-stamp/5 px-3 py-2">
          {day.warnings.map((w) => (
            <p key={w} className="text-xs font-medium text-stamp">
              ⚠ {w}
            </p>
          ))}
        </footer>
      )}
    </article>
  )
}
