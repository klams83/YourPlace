import { useEffect, useState } from 'react'
import programmeData from '../data/programme.json'
import type { Exercice, ExerciceFait, Programme } from '../lib/types'
import { useAppState } from '../lib/AppStateContext'
import { indexSeanceDuJour, semaineDuCycle, proposerVariableProgression } from '../lib/store'
import { Button, Card, PageTitle, Badge } from '../components/ui'
import { useRecoveryTimer } from '../lib/useRecoveryTimer'

const programme = programmeData as Programme

const ECHAUFFEMENT = [
  '5 min cardio léger (corde à sauter, rameur ou footing)',
  'Mobilité épaules/coudes/poignets : rotations + élastique (dislocations, pass-through)',
  'Activation : dead hang 2×20-30 s, scapular pulls 2×8, tractions australiennes légères 2×8',
]

function repCibleParDefaut(reps: string, maxActuel: number): number {
  const r = reps.toLowerCase()
  const nombres = r.match(/\d+/g)?.map(Number) ?? []

  if (r.includes('%')) {
    const moyenne = nombres.length ? nombres.reduce((a, b) => a + b, 0) / nombres.length : 50
    return Math.max(1, Math.round((moyenne / 100) * maxActuel))
  }
  if (r.includes('max-1')) return Math.max(1, maxActuel - 1)
  if (r.includes('pyramide')) return 25
  if (r.includes('max')) return r.includes('(s)') ? 20 : Math.max(1, maxActuel)
  if (nombres.length) return nombres[0]
  return 5
}

type Etape = 'echauffement' | 'exercices' | 'bilan' | 'termine'

export function SeanceDuJourScreen() {
  const { state, setState } = useAppState()
  const profil = state.profil!
  const niveauKey = `niveau${profil.niveau}` as keyof Programme
  const dataNiveau = programme[niveauKey]
  const semaine = semaineDuCycle(state.cycle.totalSeancesCycle)
  const seanceIdx = indexSeanceDuJour(state.cycle.totalSeancesCycle)
  const seance = dataNiveau.seances[seanceIdx]

  const [etape, setEtape] = useState<Etape>('echauffement')
  const [coches, setCoches] = useState<boolean[]>([false, false, false])
  const [exerciceIdx, setExerciceIdx] = useState(0)
  const [serieIdx, setSerieIdx] = useState(0)
  const [repsFaites, setRepsFaites] = useState<number[][]>(() => seance.exercices.map((ex) => Array(ex.series).fill(0)))
  const [repsCourantes, setRepsCourantes] = useState(0)
  const [rpe, setRpe] = useState<number | null>(null)
  const [note, setNote] = useState('')

  const timer = useRecoveryTimer()

  const exerciceCourant: Exercice | undefined = seance.exercices[exerciceIdx]

  useEffect(() => {
    if (exerciceCourant) setRepsCourantes(repCibleParDefaut(exerciceCourant.reps, profil.maxActuel))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exerciceIdx])

  function estDerniereSerieDeLaSeance() {
    return exerciceIdx === seance.exercices.length - 1 && serieIdx === (exerciceCourant?.series ?? 1) - 1
  }

  function validerSerie() {
    if (!exerciceCourant) return
    const copie = repsFaites.map((arr) => [...arr])
    copie[exerciceIdx][serieIdx] = repsCourantes
    setRepsFaites(copie)

    if (estDerniereSerieDeLaSeance()) {
      setEtape('bilan')
      return
    }

    if (exerciceCourant.recup > 0) {
      timer.start(exerciceCourant.recup)
    } else {
      avancerSerie()
    }
  }

  function avancerSerie() {
    if (!exerciceCourant) return
    if (serieIdx + 1 < exerciceCourant.series) {
      setSerieIdx(serieIdx + 1)
    } else {
      setExerciceIdx(exerciceIdx + 1)
      setSerieIdx(0)
    }
  }

  function passerRecup() {
    timer.stop()
    avancerSerie()
  }

  function terminerSeance() {
    const exercices: ExerciceFait[] = seance.exercices.map((ex, i) => ({ nom: ex.nom, repsFaites: repsFaites[i] }))
    setState((prev) => {
      const nouveauTotal = prev.cycle.totalSeancesCycle + 1
      const sem = semaineDuCycle(prev.cycle.totalSeancesCycle)
      const rotation = [...prev.cycle.variableProgressionParSemaine]
      if (!rotation[sem - 1]) rotation[sem - 1] = proposerVariableProgression(sem, prev.profil!.niveau)
      return {
        ...prev,
        historique: [
          ...prev.historique,
          { date: new Date().toISOString(), seanceNom: seance.nom, niveau: prev.profil!.niveau, exercices, rpe, note },
        ],
        cycle: { totalSeancesCycle: nouveauTotal, variableProgressionParSemaine: rotation },
      }
    })
    setEtape('termine')
  }

  if (timer.isRunning) {
    return (
      <div className="fixed inset-0 bg-bg flex flex-col items-center justify-center p-6 z-50">
        <p className="text-ink-muted uppercase tracking-widest text-sm mb-2">Récupération</p>
        <p className="font-mono text-8xl text-amber tabular-nums mb-8">
          {Math.floor(timer.remaining / 60)}:{String(timer.remaining % 60).padStart(2, '0')}
        </p>
        <div className="w-full max-w-xs space-y-3">
          <Button variant="secondary" onClick={() => timer.addSeconds(15)}>
            +15 s
          </Button>
          <Button variant="ghost" onClick={passerRecup}>
            Passer
          </Button>
        </div>
      </div>
    )
  }

  if (etape === 'echauffement') {
    return (
      <div className="p-4 max-w-md mx-auto">
        <PageTitle sub={`Semaine ${semaine}/4 · ${seance.nom}`}>Échauffement</PageTitle>
        <Card className="mb-4">
          <ul className="space-y-3">
            {ECHAUFFEMENT.map((item, i) => (
              <li key={i}>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={coches[i]}
                    onChange={() => setCoches(coches.map((c, j) => (j === i ? !c : c)))}
                    className="mt-1 w-5 h-5 accent-amber shrink-0"
                  />
                  <span className="text-ink-soft text-sm leading-snug">{item}</span>
                </label>
              </li>
            ))}
          </ul>
        </Card>
        <Button onClick={() => setEtape('exercices')} disabled={!coches.every(Boolean)}>
          Démarrer la séance
        </Button>
      </div>
    )
  }

  if (etape === 'exercices' && exerciceCourant) {
    return (
      <div className="p-4 max-w-md mx-auto">
        <PageTitle sub={seance.nom}>
          Exercice {exerciceIdx + 1}/{seance.exercices.length}
        </PageTitle>
        <Card className="mb-4">
          <h2 className="font-display text-2xl text-ink mb-1">{exerciceCourant.nom}</h2>
          <p className="text-ink-muted text-sm">
            Série {serieIdx + 1}/{exerciceCourant.series} · cible : {exerciceCourant.reps}
          </p>
        </Card>

        <div className="flex items-center justify-center gap-6 mb-6">
          <button
            className="btn-tap w-14 h-14 rounded-full bg-panel-raised border border-line text-2xl text-ink"
            onClick={() => setRepsCourantes((n) => Math.max(0, n - 1))}
          >
            −
          </button>
          <span className="font-mono text-6xl text-amber w-24 text-center tabular-nums">{repsCourantes}</span>
          <button
            className="btn-tap w-14 h-14 rounded-full bg-panel-raised border border-line text-2xl text-ink"
            onClick={() => setRepsCourantes((n) => n + 1)}
          >
            +
          </button>
        </div>

        <Button onClick={validerSerie}>Série validée</Button>
      </div>
    )
  }

  if (etape === 'bilan') {
    return (
      <div className="p-4 max-w-md mx-auto">
        <PageTitle sub={seance.nom}>Bilan de séance</PageTitle>
        <Card className="mb-4">
          <p className="text-ink-muted text-sm mb-2">RPE (effort perçu, 1 à 10)</p>
          <div className="grid grid-cols-5 gap-2">
            {Array.from({ length: 10 }, (_, i) => i + 1).map((v) => (
              <button
                key={v}
                onClick={() => setRpe(v)}
                className={`btn-tap rounded-md font-mono text-lg border ${
                  rpe === v ? 'bg-amber text-bg border-amber' : 'bg-panel-raised text-ink border-line'
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </Card>
        <Card className="mb-4">
          <p className="text-ink-muted text-sm mb-2">Note libre</p>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            className="w-full bg-panel-raised border border-line rounded-md p-2 text-ink text-sm focus:outline-none focus:border-amber"
            placeholder="Sensations, douleurs, condition physique..."
          />
        </Card>
        <Button onClick={terminerSeance} disabled={rpe === null}>
          Enregistrer la séance
        </Button>
      </div>
    )
  }

  return (
    <div className="p-4 max-w-md mx-auto text-center">
      <PageTitle>Séance enregistrée</PageTitle>
      <Card>
        <p className="text-ink-soft text-sm mb-3">Bien joué. Récupère bien avant la prochaine séance.</p>
        <Badge tone="ok">Séance {seanceIdx + 1}/3 · Semaine {semaine}/4</Badge>
      </Card>
    </div>
  )
}
