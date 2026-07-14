import { useState } from 'react'
import mouvements from '../data/mouvements.json'
import { Card, PageTitle } from '../components/ui'

export function MouvementsScreen() {
  const [ouvert, setOuvert] = useState<string | null>(null)

  return (
    <div className="p-4 max-w-md mx-auto">
      <PageTitle sub="Glossaire des mouvements">Mouvements</PageTitle>
      <div className="space-y-2">
        {mouvements.map((m) => {
          const estOuvert = ouvert === m.nom
          return (
            <Card key={m.nom} className="p-0 overflow-hidden">
              <button
                className="btn-tap w-full text-left px-4 py-3 flex items-center justify-between"
                onClick={() => setOuvert(estOuvert ? null : m.nom)}
              >
                <span className="font-display text-lg text-ink">{m.nom}</span>
                <span className="text-amber text-xl leading-none">{estOuvert ? '−' : '+'}</span>
              </button>
              {estOuvert && (
                <div className="px-4 pb-4 border-t border-line pt-3">
                  <p className="text-ink-soft text-sm mb-2">{m.definition}</p>
                  <p className="text-ink-muted text-xs uppercase tracking-wide mb-1">Consignes</p>
                  <p className="text-ink-soft text-sm">{m.consignes}</p>
                </div>
              )}
            </Card>
          )
        })}
      </div>
    </div>
  )
}
