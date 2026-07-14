import { useMemo, useState } from 'react'
import { CHALLENGES_DEFS } from '../lib/types'
import { useAppState } from '../lib/AppStateContext'
import { Button, Card, PageTitle, Badge } from '../components/ui'
import { useStopwatch } from '../lib/useStopwatch'

function formatChrono(ms: number): string {
  const totalCentiemes = Math.floor(ms / 10)
  const s = Math.floor(totalCentiemes / 100)
  const c = totalCentiemes % 100
  const mm = Math.floor(s / 60)
  const ss = s % 60
  return `${String(mm).padStart(2, '0')}:${String(ss).padStart(2, '0')}.${String(c).padStart(2, '0')}`
}

export function ChallengesScreen() {
  const { state, setState } = useAppState()
  const [ouvert, setOuvert] = useState<number | null>(null)
  const [score, setScore] = useState('')
  const chrono = useStopwatch()

  const meilleurs = useMemo(() => {
    const map = new Map<string, number>()
    for (const c of state.challenges) {
      const actuel = map.get(c.nom)
      if (actuel === undefined || c.score > actuel) map.set(c.nom, c.score)
    }
    return map
  }, [state.challenges])

  function ouvrirChallenge(i: number) {
    setOuvert(i)
    setScore('')
    chrono.reset()
  }

  function enregistrer() {
    if (ouvert === null || score === '') return
    const def = CHALLENGES_DEFS[ouvert]
    setState((prev) => ({
      ...prev,
      challenges: [...prev.challenges, { nom: def.nom, date: new Date().toISOString(), score: Number(score), unite: def.unite }],
    }))
    setOuvert(null)
  }

  if (ouvert !== null) {
    const def = CHALLENGES_DEFS[ouvert]
    return (
      <div className="p-4 max-w-md mx-auto">
        <PageTitle sub={def.unite === 'secondes' ? 'Résultat en secondes' : 'Résultat en répétitions'}>{def.nom}</PageTitle>

        <Card className="mb-4 text-center">
          <p className="font-mono text-5xl text-amber tabular-nums mb-4">{formatChrono(chrono.elapsedMs)}</p>
          <div className="flex gap-3">
            {!chrono.running ? (
              <Button onClick={chrono.start}>{chrono.elapsedMs > 0 ? 'Reprendre' : 'Démarrer'}</Button>
            ) : (
              <Button variant="secondary" onClick={chrono.stop}>
                Stop
              </Button>
            )}
            <Button variant="ghost" onClick={chrono.reset}>
              Réinitialiser
            </Button>
          </div>
          {def.unite === 'secondes' && (
            <button
              className="text-amber text-sm mt-3 underline"
              onClick={() => setScore(String(Math.round(chrono.elapsedMs / 1000)))}
            >
              Utiliser ce temps comme résultat
            </button>
          )}
        </Card>

        <label className="block text-ink-muted text-sm mb-2">
          Résultat ({def.unite === 'secondes' ? 'secondes' : 'répétitions'})
        </label>
        <input
          inputMode="numeric"
          pattern="[0-9]*"
          value={score}
          onChange={(e) => setScore(e.target.value.replace(/[^0-9]/g, ''))}
          className="w-full text-center font-mono text-4xl bg-panel border border-line rounded-lg py-4 mb-4 text-ink focus:outline-none focus:border-amber"
        />

        <div className="space-y-2">
          <Button onClick={enregistrer} disabled={score === ''}>
            Enregistrer
          </Button>
          <Button variant="ghost" onClick={() => setOuvert(null)}>
            Annuler
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <PageTitle>Challenges</PageTitle>
      <div className="space-y-3">
        {CHALLENGES_DEFS.map((def, i) => (
          <Card key={def.nom}>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-display text-xl text-ink">{def.nom}</h2>
              {meilleurs.has(def.nom) ? (
                <Badge tone="amber">
                  Best {meilleurs.get(def.nom)} {def.unite === 'secondes' ? 's' : 'reps'}
                </Badge>
              ) : (
                <Badge tone="olive">Pas encore fait</Badge>
              )}
            </div>
            <Button variant="secondary" onClick={() => ouvrirChallenge(i)}>
              Lancer
            </Button>
          </Card>
        ))}
      </div>
    </div>
  )
}
