import { useState } from 'react'
import { useAppState } from '../lib/AppStateContext'
import { niveauDepuisMax } from '../lib/store'
import { NIVEAU_INFO } from '../lib/types'
import { Button, Card, PageTitle, Badge } from '../components/ui'
import { useRecoveryTimer } from '../lib/useRecoveryTimer'

const REPOS_PALIER = 30

type Etape = 'intro' | 'palier' | 'resultat'

export function TestScreen({ onTermine }: { onTermine?: () => void }) {
  const { state, setState } = useAppState()
  const [etape, setEtape] = useState<Etape>('intro')
  const [palier, setPalier] = useState(1)
  const [dernierPalierReussi, setDernierPalierReussi] = useState(0)
  const [valide, setValide] = useState(false)
  const timer = useRecoveryTimer()

  const niveauResultat = niveauDepuisMax(dernierPalierReussi)

  function commencer() {
    setPalier(1)
    setDernierPalierReussi(0)
    setEtape('palier')
  }

  function palierReussi() {
    setDernierPalierReussi(palier)
    timer.start(REPOS_PALIER)
  }

  function passerRepos() {
    timer.stop()
    setPalier((p) => p + 1)
  }

  function echec() {
    timer.stop()
    setEtape('resultat')
  }

  function enregistrer() {
    const date = new Date().toISOString()
    setState((prev) => ({
      ...prev,
      profil: { niveau: niveauResultat, maxActuel: dernierPalierReussi, dateTest: date },
      cycle: { totalSeancesCycle: 0, variableProgressionParSemaine: [null, null, null, null] },
      tests: [...prev.tests, { date, max: dernierPalierReussi }],
    }))
    setValide(true)
  }

  if (timer.isRunning) {
    return (
      <div className="fixed inset-0 bg-bg flex flex-col items-center justify-center p-6 z-50">
        <p className="text-ink-muted uppercase tracking-widest text-sm mb-2">Repos avant palier {palier + 1}</p>
        <p className="font-mono text-8xl text-amber tabular-nums mb-8">0:{String(timer.remaining).padStart(2, '0')}</p>
        <div className="w-full max-w-xs">
          <Button variant="ghost" onClick={passerRepos}>
            Passer
          </Button>
        </div>
      </div>
    )
  }

  if (etape === 'intro') {
    return (
      <div className="p-4 max-w-md mx-auto">
        <PageTitle sub="Workout test">Test initial</PageTitle>
        <Card className="mb-4">
          <p className="text-ink-soft text-sm leading-relaxed mb-3">
            Prise <strong className="text-ink">pronation obligatoire</strong>, menton au-dessus de la barre à chaque répétition,
            relâchement complet des omoplates et des bras en bas.
          </p>
          <p className="text-ink-soft text-sm leading-relaxed">
            Fais 1 traction, repose-toi 30 secondes, fais 2 tractions, repose-toi 30 secondes, fais 3 tractions... Continue en
            augmentant d'une répétition à chaque palier jusqu'à l'échec. Ton score est le dernier palier réussi.
          </p>
        </Card>
        <Button onClick={commencer}>Commencer le test</Button>
        {state.profil && (
          <p className="text-ink-muted text-xs mt-4 text-center">
            Dernier test : {state.profil.maxActuel} au {new Date(state.profil.dateTest).toLocaleDateString('fr-FR')}
          </p>
        )}
      </div>
    )
  }

  if (etape === 'palier') {
    return (
      <div className="p-4 max-w-md mx-auto">
        <PageTitle sub={`Repos de ${REPOS_PALIER} s entre chaque palier`}>Palier {palier}</PageTitle>
        <Card className="mb-6 text-center">
          <p className="text-ink-muted text-sm mb-2">Répétitions à réaliser</p>
          <p className="font-mono text-7xl text-amber">{palier}</p>
        </Card>
        <div className="space-y-3">
          <Button onClick={palierReussi}>Palier réussi</Button>
          <Button variant="danger" onClick={echec}>
            Échec
          </Button>
        </div>
      </div>
    )
  }

  if (valide) {
    return (
      <div className="p-4 max-w-md mx-auto">
        <PageTitle sub="Test enregistré">Résultat</PageTitle>
        <Card className="text-center">
          <p className="text-ink-muted text-sm mb-1">Dernier palier réussi</p>
          <p className="font-mono text-5xl text-amber mb-3">{dernierPalierReussi}</p>
          <Badge tone="amber">
            {NIVEAU_INFO[niveauResultat - 1].nom} — {NIVEAU_INFO[niveauResultat - 1].plage}
          </Badge>
        </Card>
        <p className="text-ink-soft text-sm mt-4">
          Le cycle démarre aujourd'hui. À la fin du cycle de 4 semaines, refais le test : en cas de passage de niveau, tu
          passeras au programme suivant ; sinon, repars sur un nouveau cycle de 4 semaines.
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
      <PageTitle sub="Test terminé">Résultat</PageTitle>
      <Card className="mb-4 text-center">
        <p className="text-ink-muted text-sm mb-1">Dernier palier réussi</p>
        <p className="font-mono text-5xl text-amber mb-3">{dernierPalierReussi}</p>
        <Badge tone="amber">
          {NIVEAU_INFO[niveauResultat - 1].nom} — {NIVEAU_INFO[niveauResultat - 1].plage}
        </Badge>
      </Card>
      <Button onClick={enregistrer}>Valider le résultat</Button>
    </div>
  )
}
