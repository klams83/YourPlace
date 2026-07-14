import { useMemo } from 'react'
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useAppState } from '../lib/AppStateContext'
import { Card, PageTitle, Badge } from '../components/ui'
import { palette } from '../lib/palette'

function lundiDeLaSemaine(d: Date): Date {
  const date = new Date(d)
  const jour = date.getDay()
  const diff = (jour === 0 ? -6 : 1) - jour
  date.setDate(date.getDate() + diff)
  date.setHours(0, 0, 0, 0)
  return date
}

export function ProgressionScreen() {
  const { state } = useAppState()

  const dataTests = useMemo(
    () =>
      state.tests
        .slice()
        .sort((a, b) => a.date.localeCompare(b.date))
        .map((t) => ({ date: new Date(t.date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }), max: t.max })),
    [state.tests],
  )

  const dataVolume = useMemo(() => {
    const parSemaine = new Map<string, number>()
    for (const s of state.historique) {
      const cle = lundiDeLaSemaine(new Date(s.date)).toISOString()
      const total = s.exercices.reduce((acc, ex) => acc + ex.repsFaites.reduce((a, b) => a + b, 0), 0)
      parSemaine.set(cle, (parSemaine.get(cle) ?? 0) + total)
    }
    return Array.from(parSemaine.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([cle, total]) => ({ semaine: new Date(cle).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }), total }))
  }, [state.historique])

  const historiqueTrie = useMemo(() => state.historique.slice().sort((a, b) => b.date.localeCompare(a.date)), [state.historique])

  return (
    <div className="p-4 max-w-md mx-auto">
      <PageTitle>Progression</PageTitle>

      <Card className="mb-4">
        <p className="text-ink-muted text-sm mb-3">Max au fil des tests</p>
        {dataTests.length > 0 ? (
          <div className="h-48 -ml-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dataTests}>
                <CartesianGrid stroke={palette.line} strokeDasharray="3 3" />
                <XAxis dataKey="date" stroke={palette.inkMuted} fontSize={11} />
                <YAxis stroke={palette.inkMuted} fontSize={11} allowDecimals={false} />
                <Tooltip contentStyle={{ background: palette.panelRaised, border: `1px solid ${palette.line}`, color: palette.ink }} />
                <Line type="monotone" dataKey="max" stroke={palette.amber} strokeWidth={2} dot={{ r: 4, fill: palette.amber }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="text-ink-muted text-sm">Aucun test enregistré pour l'instant.</p>
        )}
      </Card>

      <Card className="mb-4">
        <p className="text-ink-muted text-sm mb-3">Volume hebdomadaire (reps totales)</p>
        {dataVolume.length > 0 ? (
          <div className="h-48 -ml-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dataVolume}>
                <CartesianGrid stroke={palette.line} strokeDasharray="3 3" />
                <XAxis dataKey="semaine" stroke={palette.inkMuted} fontSize={11} />
                <YAxis stroke={palette.inkMuted} fontSize={11} allowDecimals={false} />
                <Tooltip contentStyle={{ background: palette.panelRaised, border: `1px solid ${palette.line}`, color: palette.ink }} />
                <Bar dataKey="total" fill={palette.olive} radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="text-ink-muted text-sm">Aucune séance enregistrée pour l'instant.</p>
        )}
      </Card>

      <Card>
        <p className="text-ink-muted text-sm mb-3">Historique des séances</p>
        {historiqueTrie.length === 0 && <p className="text-ink-muted text-sm">Rien pour l'instant.</p>}
        <ul className="space-y-2">
          {historiqueTrie.map((s, i) => {
            const total = s.exercices.reduce((acc, ex) => acc + ex.repsFaites.reduce((a, b) => a + b, 0), 0)
            return (
              <li key={i} className="rounded-md border border-line px-3 py-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-ink text-sm">{s.seanceNom}</span>
                  <span className="text-ink-muted text-xs font-mono">{new Date(s.date).toLocaleDateString('fr-FR')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge tone="olive">{total} reps</Badge>
                  {s.rpe !== null && <Badge tone="amber">RPE {s.rpe}</Badge>}
                </div>
              </li>
            )
          })}
        </ul>
      </Card>
    </div>
  )
}
