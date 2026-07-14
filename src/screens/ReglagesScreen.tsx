import { useRef, useState } from 'react'
import { useAppState } from '../lib/AppStateContext'
import { defaultState, exportStateJson, importStateJson } from '../lib/store'
import type { Niveau } from '../lib/types'
import { Button, Card, PageTitle, Badge } from '../components/ui'

const NIVEAUX: { valeur: Niveau; label: string }[] = [
  { valeur: 1, label: 'Niveau 1 — 0 à 3 tractions' },
  { valeur: 2, label: 'Niveau 2 — 4 à 8 tractions' },
  { valeur: 3, label: 'Niveau 3 — 8 et plus' },
]

export function ReglagesScreen({ onRetest }: { onRetest: () => void }) {
  const { state, setState } = useAppState()
  const [confirmationReset, setConfirmationReset] = useState(false)
  const [messageImport, setMessageImport] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  function changerNiveau(niveau: Niveau) {
    setState((prev) => (prev.profil ? { ...prev, profil: { ...prev.profil, niveau } } : prev))
  }

  function exporter() {
    const json = exportStateJson(state)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `tractions-0-max-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  function importer(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const nouveauState = importStateJson(String(reader.result))
        setState(nouveauState)
        setMessageImport('Import réussi.')
      } catch {
        setMessageImport('Fichier invalide.')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  function reset() {
    setState(defaultState())
    setConfirmationReset(false)
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <PageTitle>Réglages</PageTitle>

      <Card className="mb-4">
        <p className="text-ink-muted text-sm mb-2">Profil actuel</p>
        {state.profil ? (
          <div className="flex items-center justify-between mb-3">
            <Badge tone="amber">Niveau {state.profil.niveau}</Badge>
            <span className="text-ink-muted text-xs font-mono">
              Test du {new Date(state.profil.dateTest).toLocaleDateString('fr-FR')}
            </span>
          </div>
        ) : (
          <p className="text-ink-muted text-sm mb-3">Aucun test enregistré.</p>
        )}
        <Button onClick={onRetest}>Refaire le test (re-test)</Button>
      </Card>

      <Card className="mb-4">
        <p className="text-ink-muted text-sm mb-3">Changer de niveau manuellement</p>
        <div className="space-y-2">
          {NIVEAUX.map((n) => (
            <button
              key={n.valeur}
              onClick={() => changerNiveau(n.valeur)}
              className={`btn-tap w-full text-left rounded-md border px-3 py-3 text-sm ${
                state.profil?.niveau === n.valeur ? 'bg-amber/15 border-amber text-ink' : 'bg-panel-raised border-line text-ink-soft'
              }`}
              disabled={!state.profil}
            >
              {n.label}
            </button>
          ))}
        </div>
      </Card>

      <Card className="mb-4">
        <p className="text-ink-muted text-sm mb-3">Données</p>
        <div className="space-y-2">
          <Button variant="secondary" onClick={exporter}>
            Exporter (JSON)
          </Button>
          <Button variant="secondary" onClick={() => fileInputRef.current?.click()}>
            Importer (JSON)
          </Button>
          <input ref={fileInputRef} type="file" accept="application/json" className="hidden" onChange={importer} />
          {messageImport && <p className="text-ink-muted text-xs text-center">{messageImport}</p>}
        </div>
      </Card>

      <Card>
        <p className="text-ink-muted text-sm mb-3">Zone de danger</p>
        {!confirmationReset ? (
          <Button variant="danger" onClick={() => setConfirmationReset(true)}>
            Réinitialiser toutes les données
          </Button>
        ) : (
          <div className="space-y-2">
            <p className="text-danger text-sm">Cette action efface définitivement toutes les données locales. Confirmer ?</p>
            <Button variant="danger" onClick={reset}>
              Oui, tout effacer
            </Button>
            <Button variant="ghost" onClick={() => setConfirmationReset(false)}>
              Annuler
            </Button>
          </div>
        )}
      </Card>
    </div>
  )
}
