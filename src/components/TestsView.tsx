import { type Maxes } from '../lib/program'

interface Props {
  maxes: Maxes
  onGoToSettings: () => void
}

const STEPS = [
  {
    num: 1,
    title: 'Tractions — max strict',
    detail:
      'Une seule série, prise pronation, départ bras tendus, menton au-dessus de la barre à chaque rep. Pas de kipping. Le total = maxTractions.',
  },
  {
    num: 2,
    title: 'Pompes — 2 minutes',
    detail:
      'Après 5 min de repos. Corps gainé, poitrine qui frôle le sol, bras tendus en haut. Pauses autorisées en haut. Le total = maxPompes2min.',
  },
  {
    num: 3,
    title: 'Abdos — 2 minutes',
    detail:
      'Après 5 min de repos. Sit-ups complets, pieds bloqués, mains derrière la tête. Rythme régulier, pauses autorisées. Le total = maxAbdos2min.',
  },
]

export default function TestsView({ maxes, onGoToSettings }: Props) {
  return (
    <div className="space-y-4">
      <section className="border border-line bg-white/60 p-3">
        <h2 className="font-display text-lg font-semibold uppercase tracking-wide text-navy">
          Tests de référence
        </h2>
        <p className="mt-1 text-sm leading-snug text-ink-soft">
          Les 3 maxes pilotent tout le programme. Refais ces tests à jeun de fatigue (48 h sans séance
          intense), <strong>dans l’ordre du test réel, enchaînés avec 5 minutes de repos entre chaque</strong>.
          Mets ensuite les résultats à jour dans les réglages : toutes les séances se recalculent.
        </p>
      </section>

      <ol className="space-y-3">
        {STEPS.map((step) => (
          <li key={step.num} className="flex gap-3 border border-line bg-white/60 p-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-navy font-display text-lg font-bold text-white">
              {step.num}
            </span>
            <div>
              <h3 className="font-display text-sm font-semibold uppercase tracking-wide">{step.title}</h3>
              <p className="mt-0.5 text-sm leading-snug text-ink-soft">{step.detail}</p>
            </div>
          </li>
        ))}
      </ol>

      <section className="border border-line bg-white/60 p-3">
        <h3 className="mb-2 font-display text-sm font-semibold uppercase tracking-wider text-navy">
          Maxes actuels
        </h3>
        <div className="grid grid-cols-3 gap-2 text-center">
          {(
            [
              ['Tractions', maxes.tractions],
              ["Pompes 2'", maxes.pompes],
              ["Abdos 2'", maxes.abdos],
            ] as const
          ).map(([label, value]) => (
            <div key={label} className="border border-line bg-paper px-2 py-3">
              <p className="font-display text-3xl font-bold text-navy">{value}</p>
              <p className="text-xs uppercase tracking-wider text-ink-muted">{label}</p>
            </div>
          ))}
        </div>
        <button
          onClick={onGoToSettings}
          className="mt-3 w-full border border-navy bg-navy py-2 font-display text-sm font-semibold uppercase tracking-wider text-white hover:bg-navy-soft"
        >
          Mettre à jour les maxes
        </button>
      </section>
    </div>
  )
}
