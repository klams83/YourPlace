import {
  getBaseCE,
  getBaseEmom,
  getSitups,
  getTempoPompes,
  getVariantPompes,
  getVups,
  getWod1Pompes,
  type Maxes,
} from '../lib/program'

interface Props {
  maxes: Maxes
  onChange: (maxes: Maxes) => void
  onReset: () => void
}

const FIELDS: { key: keyof Maxes; label: string; hint: string }[] = [
  { key: 'tractions', label: 'Max tractions', hint: 'max strict, 1 série' },
  { key: 'pompes', label: 'Max pompes 2 min', hint: 'test 2 minutes' },
  { key: 'abdos', label: 'Max abdos 2 min', hint: 'test 2 minutes' },
]

export default function SettingsView({ maxes, onChange, onReset }: Props) {
  const setField = (key: keyof Maxes, raw: string) => {
    const value = Math.max(0, Math.min(200, Number(raw) || 0))
    onChange({ ...maxes, [key]: value })
  }

  return (
    <div className="space-y-4">
      <section className="border border-line bg-white/60 p-3">
        <h2 className="font-display text-lg font-semibold uppercase tracking-wide text-navy">
          Maxes de référence
        </h2>
        <p className="mt-1 text-xs text-ink-soft">
          Modifiable à tout moment — tout le programme se recalcule automatiquement.
        </p>
        <div className="mt-3 space-y-3">
          {FIELDS.map(({ key, label, hint }) => (
            <label key={key} className="flex items-center justify-between gap-3">
              <span>
                <span className="block font-display text-sm font-semibold uppercase tracking-wide">
                  {label}
                </span>
                <span className="text-xs text-ink-muted">{hint}</span>
              </span>
              <input
                type="number"
                inputMode="numeric"
                min={0}
                max={200}
                value={maxes[key]}
                onChange={(e) => setField(key, e.target.value)}
                className="w-24 border border-line bg-paper px-2 py-2 text-center font-display text-2xl font-bold text-navy focus:border-navy focus:outline-none"
              />
            </label>
          ))}
        </div>
      </section>

      <section className="border border-line bg-white/60 p-3 text-sm leading-relaxed">
        <h3 className="mb-2 font-display text-sm font-semibold uppercase tracking-wider text-navy">
          Comment les chiffres sont calculés
        </h3>
        <ul className="space-y-2 text-ink-soft">
          <li>
            <strong className="text-ink">Chiffre J4 (CE)</strong> = la moitié de ton max tractions,
            arrondie en dessous (minimum 2). Avec {maxes.tractions} tractions →{' '}
            <strong className="text-stamp">{getBaseCE(maxes)}</strong> reps par série.
          </li>
          <li>
            <strong className="text-ink">EMOM pompes</strong> = 12 % de ton max 2 min, par minute
            (minimum 4). Avec {maxes.pompes} pompes → <strong>{getBaseEmom(maxes)}</strong> reps/minute.
          </li>
          <li>
            <strong className="text-ink">Sit-ups par tour</strong> = 35 % de ton max 2 min (minimum 10).
            Avec {maxes.abdos} abdos → <strong>{getSitups(maxes)}</strong> reps par tour.
          </li>
          <li>
            <strong className="text-ink">Pompes du WOD 1</strong> = 10 % du max 2 min →{' '}
            <strong>{getWod1Pompes(maxes)}</strong> reps par minute.
          </li>
          <li>
            <strong className="text-ink">Pompes tempo</strong> = 15 % du max →{' '}
            <strong>{getTempoPompes(maxes)}</strong> reps par série · <strong className="text-ink">variantes</strong>{' '}
            (diamant/archer) = 20 % → <strong>{getVariantPompes(maxes)}</strong> reps ·{' '}
            <strong className="text-ink">V-ups</strong> = 20 % du max abdos →{' '}
            <strong>{getVups(maxes)}</strong> reps.
          </li>
          <li>
            <strong className="text-ink">Modulation hebdo</strong> : S1-S2 base (« Installation ») ·
            S3-S4 CE +1 et EMOM +1 (« Montée en charge ») · S5 CE +2, EMOM +2, planche 60 s (« Pic ») ·
            S6 CE +1, EMOM −1 (« Affûtage »). Les WOD s’allongent aussi avec les phases (AMRAP 12'
            → 20', EMOM 12' → 18') puis raccourcissent en affûtage.
          </li>
          <li>
            <strong className="text-ink">Autorégulation J4</strong> : chaque J4 validé à 9 séries ou
            plus débloque +1 au CE pour les semaines suivantes (cumulable, plafonné à +3). Log
            directement sur la carte du jeudi.
          </li>
          <li>
            <strong className="text-ink">Grip</strong> : suspension 30 s (S1) → 50 s (S5), 40 s en
            affûtage — travaillé lundi et vendredi, plus les leg raises suspendus du mercredi.
          </li>
          <li>
            <strong className="text-ink">Benchmarks CrossFit</strong> : Cindy, Chief, Barbara, Angie,
            Annie, Tabata Something Else, Death By Burpees et une version « Murph sans course » —
            les mêmes formats utilisés dans les prépas gendarmerie/pompiers/forces spéciales, avec des
            reps calculées sur tes maxes quand c’est pertinent.
          </li>
          <li>
            <strong className="text-ink">Un bonus par séance</strong> : lundi, mardi, mercredi et
            vendredi ont chacun un WOD bonus <em>optionnel</em> — à faire seulement si l’envie et le
            temps le permettent, ça n’entame jamais l’Armstrong. Le samedi (S1-S3), le benchmark
            remplace le WOD générique et fait partie de la séance normale. Le jeudi (J4) et le
            dimanche restent volontairement sans bonus : ce sont les deux jours protégés du
            programme.
          </li>
          <li>
            <strong className="text-ink">Simulations S4-S6</strong> : objectif tractions = max + (semaine
            − 3) ; pompes et abdos = max × (1 + 3 % × (semaine − 3)).
          </li>
        </ul>
      </section>

      <button
        onClick={() => {
          if (confirm('Remettre l’application à zéro ? Maxes, séances validées et historique seront effacés.')) {
            onReset()
          }
        }}
        className="w-full border border-stamp py-2 font-display text-sm font-semibold uppercase tracking-wider text-stamp hover:bg-stamp/10"
      >
        Réinitialiser l’application
      </button>
    </div>
  )
}
