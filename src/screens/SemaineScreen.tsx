import programmeData from '../data/programme.json'
import type { Programme, VariableProgression } from '../lib/types'
import { useAppState } from '../lib/AppStateContext'
import { semaineDuCycle, cycleTermine, proposerVariableProgression } from '../lib/store'
import { Card, PageTitle, Badge, Button } from '../components/ui'

const programme = programmeData as Programme

const LABELS_VARIABLE: Record<VariableProgression, string> = {
  reps: '+1 à +2 répétitions par série',
  recup: '−15 s de récupération',
  tempo: 'Tempo excentrique plus lent',
  lest: "Ajout de lest",
}

export function SemaineScreen({ onDemarrerRetest }: { onDemarrerRetest?: () => void }) {
  const { state, setState } = useAppState()
  const profil = state.profil!
  const niveauKey = `niveau${profil.niveau}` as keyof Programme
  const dataNiveau = programme[niveauKey]
  const total = state.cycle.totalSeancesCycle
  const semaine = semaineDuCycle(total)
  const faitesCetteSemaine = Math.min(3, Math.max(0, total - (semaine - 1) * 3))
  const termine = cycleTermine(total)

  const variableChoisie = state.cycle.variableProgressionParSemaine[semaine - 1] ?? proposerVariableProgression(semaine, profil.niveau)

  function choisirVariable(v: VariableProgression) {
    setState((prev) => {
      const rotation = [...prev.cycle.variableProgressionParSemaine]
      rotation[semaine - 1] = v
      return { ...prev, cycle: { ...prev.cycle, variableProgressionParSemaine: rotation } }
    })
  }

  const variablesDisponibles: VariableProgression[] = profil.niveau > 1 ? ['reps', 'recup', 'tempo', 'lest'] : ['reps', 'recup', 'tempo']

  return (
    <div className="p-4 max-w-md mx-auto">
      <PageTitle sub={dataNiveau.focus}>
        Semaine {semaine}/4
      </PageTitle>

      {termine && (
        <Card className="mb-4 border-amber">
          <p className="text-amber font-display text-lg mb-2">Cycle terminé</p>
          <p className="text-ink-soft text-sm mb-3">4 semaines complètes. Il est temps de re-tester ton max.</p>
          {onDemarrerRetest && <Button onClick={onDemarrerRetest}>Lancer le re-test</Button>}
        </Card>
      )}

      <Card className="mb-4">
        <p className="text-ink-muted text-sm mb-3">Séances de la semaine</p>
        <ul className="space-y-2">
          {dataNiveau.seances.map((s, i) => (
            <li key={i} className="flex items-center justify-between rounded-md border border-line px-3 py-2">
              <span className="text-ink text-sm">{s.nom}</span>
              <Badge tone={i < faitesCetteSemaine ? 'ok' : 'olive'}>{i < faitesCetteSemaine ? 'Faite' : 'À faire'}</Badge>
            </li>
          ))}
        </ul>
      </Card>

      <Card>
        <p className="text-ink-muted text-sm mb-3">Variable de progression cette semaine</p>
        <p className="text-ink-soft text-xs mb-3">Une seule variable peut être modifiée par semaine.</p>
        <div className="space-y-2">
          {variablesDisponibles.map((v) => (
            <button
              key={v}
              onClick={() => choisirVariable(v)}
              className={`btn-tap w-full text-left rounded-md border px-3 py-3 text-sm ${
                variableChoisie === v ? 'bg-amber/15 border-amber text-ink' : 'bg-panel-raised border-line text-ink-soft'
              }`}
            >
              {LABELS_VARIABLE[v]}
            </button>
          ))}
        </div>
      </Card>
    </div>
  )
}
