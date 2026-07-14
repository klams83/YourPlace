import { useState } from 'react'
import { AppStateProvider, useAppState } from './lib/AppStateContext'
import { TestScreen } from './screens/TestScreen'
import { SeanceDuJourScreen } from './screens/SeanceDuJourScreen'
import { SemaineScreen } from './screens/SemaineScreen'
import { ProgressionScreen } from './screens/ProgressionScreen'
import { ChallengesScreen } from './screens/ChallengesScreen'
import { MouvementsScreen } from './screens/MouvementsScreen'
import { ReglagesScreen } from './screens/ReglagesScreen'

type Vue = 'seance' | 'semaine' | 'progression' | 'challenges' | 'mouvements' | 'reglages'

const ONGLETS: { vue: Vue; label: string }[] = [
  { vue: 'seance', label: 'Séance' },
  { vue: 'semaine', label: 'Semaine' },
  { vue: 'progression', label: 'Progrès' },
  { vue: 'challenges', label: 'Défis' },
  { vue: 'mouvements', label: 'Mouv.' },
  { vue: 'reglages', label: 'Réglages' },
]

function AppInterne() {
  const { state } = useAppState()
  const [vue, setVue] = useState<Vue>('seance')
  // Initialisé une seule fois au premier lancement (profil absent) ; ne dépend plus
  // du profil ensuite pour ne pas démonter l'écran de résultat dès que le test est enregistré.
  const [afficherTest, setAfficherTest] = useState(() => state.profil === null)

  if (afficherTest) {
    return (
      <TestScreen
        onTermine={() => {
          setAfficherTest(false)
          setVue('seance')
        }}
      />
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 pb-24">
        {vue === 'seance' && <SeanceDuJourScreen />}
        {vue === 'semaine' && <SemaineScreen onDemarrerRetest={() => setAfficherTest(true)} />}
        {vue === 'progression' && <ProgressionScreen />}
        {vue === 'challenges' && <ChallengesScreen />}
        {vue === 'mouvements' && <MouvementsScreen />}
        {vue === 'reglages' && <ReglagesScreen onRetest={() => setAfficherTest(true)} />}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-panel border-t border-line grid grid-cols-6 z-40">
        {ONGLETS.map((o) => (
          <button
            key={o.vue}
            onClick={() => setVue(o.vue)}
            className={`btn-tap flex items-center justify-center font-display text-xs tracking-wide py-2 ${
              vue === o.vue ? 'text-amber' : 'text-ink-muted'
            }`}
          >
            {o.label}
          </button>
        ))}
      </nav>
    </div>
  )
}

export default function App() {
  return (
    <AppStateProvider>
      <AppInterne />
    </AppStateProvider>
  )
}
