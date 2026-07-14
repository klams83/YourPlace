import { useState } from 'react'
import { useAppState } from '../lib/AppStateContext'
import { niveauDepuisMax } from '../lib/store'
import { Button, Card, PageTitle, Badge } from '../components/ui'

const NIVEAU_LABEL: Record<number, string> = {
  1: 'Niveau 1 — 0 à 3 tractions',
  2: 'Niveau 2 — 4 à 8 tractions',
  3: 'Niveau 3 — 8 et plus',
}

export function TestScreen({ onTermine }: { onTermine?: () => void }) {
  const { state, setState } = useAppState()
  const [max, setMax] = useState<string>('')
  const [valide, setValide] = useState(false)

  const maxNum = Number(max)
  const niveauCalcule = max !== '' && !Number.isNaN(maxNum) ? niveauDepuisMax(maxNum) : null

  function enregistrer() {
    if (niveauCalcule === null) return
    const date = new Date().toISOString()
    setState((prev) => ({
      ...prev,
      profil: { niveau: niveauCalcule, maxActuel: maxNum, dateTest: date },
      cycle: { totalSeancesCycle: 0, variableProgressionParSemaine: [null, null, null, null] },
      tests: [...prev.tests, { date, max: maxNum }],
    }))
    setValide(true)
  }

  if (valide) {
    return (
      <div className="p-4 max-w-md mx-auto">
        <PageTitle sub="Test enregistré">Résultat</PageTitle>
        <Card className="text-center">
          <p className="text-ink-muted text-sm mb-1">Max one shot</p>
          <p className="font-mono text-5xl text-amber mb-3">{maxNum}</p>
          <Badge tone="amber">{NIVEAU_LABEL[niveauCalcule!]}</Badge>
        </Card>
        <p className="text-ink-soft text-sm mt-4">
          Le cycle démarre aujourd'hui. Re-test conseillé dans 4 semaines, ou à tout moment depuis Réglages.
        </p>
        {onTermine && (
          <div className="mt-6">
            <Button onClick={onTermine}>Commencer</Button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <PageTitle sub="Max de tractions pronation, enchaînées, sans pause en bas">Test initial</PageTitle>

      <Card className="mb-4">
        <p className="text-ink-soft text-sm leading-relaxed">
          Fais un maximum de tractions <strong className="text-ink">pronation</strong>, en une seule série,
          sans t'arrêter en bas de la traction. Note le nombre de répétitions réussies.
        </p>
      </Card>

      <label className="block text-ink-muted text-sm mb-2">Répétitions réalisées</label>
      <input
        inputMode="numeric"
        pattern="[0-9]*"
        value={max}
        onChange={(e) => setMax(e.target.value.replace(/[^0-9]/g, ''))}
        placeholder="0"
        className="w-full text-center font-mono text-6xl bg-panel border border-line rounded-lg py-6 mb-4 text-amber focus:outline-none focus:border-amber"
      />

      {niveauCalcule !== null && (
        <Card className="mb-4 text-center">
          <Badge tone="amber">{NIVEAU_LABEL[niveauCalcule]}</Badge>
        </Card>
      )}

      <Button onClick={enregistrer} disabled={max === ''}>
        Valider le test
      </Button>

      {state.profil && (
        <p className="text-ink-muted text-xs mt-4 text-center">
          Dernier test : {state.profil.maxActuel} tractions le{' '}
          {new Date(state.profil.dateTest).toLocaleDateString('fr-FR')}
        </p>
      )}
    </div>
  )
}
