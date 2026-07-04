import { useRef, useState } from 'react'
import type { SimTargets } from '../lib/program'
import type { SimResult } from '../lib/store'

interface Props {
  history: SimResult[]
  finalTargets: SimTargets
}

const SERIES = [
  { key: 'tractions', label: 'Tractions', color: 'var(--color-chart-tractions)' },
  { key: 'pompes', label: 'Pompes', color: 'var(--color-chart-pompes)' },
  { key: 'abdos', label: 'Abdos', color: 'var(--color-chart-abdos)' },
] as const

const W = 360
const H = 220
const PAD = { top: 16, right: 60, bottom: 28, left: 34 }

function fmtDate(iso: string): string {
  const d = new Date(iso)
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`
}

// Marqueurs distincts par série (encodage secondaire en plus de la couleur)
function Marker({ shape, x, y, color }: { shape: number; x: number; y: number; color: string }) {
  if (shape === 0) return <circle cx={x} cy={y} r={4} fill={color} stroke="var(--color-paper)" strokeWidth={2} />
  if (shape === 1)
    return <rect x={x - 4} y={y - 4} width={8} height={8} fill={color} stroke="var(--color-paper)" strokeWidth={2} />
  return (
    <polygon
      points={`${x},${y - 5} ${x + 4.5},${y + 3.5} ${x - 4.5},${y + 3.5}`}
      fill={color}
      stroke="var(--color-paper)"
      strokeWidth={2}
    />
  )
}

export default function ProgressChart({ history, finalTargets }: Props) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [hover, setHover] = useState<number | null>(null)

  const sorted = [...history].sort((a, b) => a.date.localeCompare(b.date))
  if (sorted.length === 0) {
    return (
      <p className="border border-dashed border-line bg-white/40 p-4 text-center text-sm text-ink-muted">
        Le graphe apparaîtra dès ta première simulation enregistrée (samedi, à partir de la S4).
      </p>
    )
  }

  // % de l'objectif final (cibles S6) — une seule échelle pour les 3 épreuves
  const pct = (r: SimResult) => ({
    tractions: (r.tractions / finalTargets.tractions) * 100,
    pompes: (r.pompes / finalTargets.pompes) * 100,
    abdos: (r.abdos / finalTargets.abdos) * 100,
  })
  const points = sorted.map(pct)
  const maxY = Math.max(110, ...points.flatMap((p) => [p.tractions, p.pompes, p.abdos])) * 1.05

  const plotW = W - PAD.left - PAD.right
  const plotH = H - PAD.top - PAD.bottom
  const x = (i: number) => PAD.left + (sorted.length === 1 ? plotW / 2 : (i / (sorted.length - 1)) * plotW)
  const y = (v: number) => PAD.top + plotH - (v / maxY) * plotH

  const gridValues = [0, 25, 50, 75, 100].filter((v) => v <= maxY)

  const onMove = (e: React.PointerEvent) => {
    const svg = svgRef.current
    if (!svg) return
    const rect = svg.getBoundingClientRect()
    const px = ((e.clientX - rect.left) / rect.width) * W
    let best = 0
    let bestDist = Infinity
    sorted.forEach((_, i) => {
      const d = Math.abs(x(i) - px)
      if (d < bestDist) {
        bestDist = d
        best = i
      }
    })
    setHover(best)
  }

  const hoverEntry = hover !== null ? sorted[hover] : null
  const tooltipLeftHalf = hover !== null && x(hover) < W / 2

  return (
    <div className="relative">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        className="w-full touch-none select-none"
        role="img"
        aria-label="Progression des simulations en pourcentage de l'objectif du test"
        onPointerMove={onMove}
        onPointerLeave={() => setHover(null)}
      >
        {/* grille discrète + axe % */}
        {gridValues.map((v) => (
          <g key={v}>
            <line
              x1={PAD.left}
              x2={W - PAD.right}
              y1={y(v)}
              y2={y(v)}
              stroke={v === 100 ? 'var(--color-ink-muted)' : 'var(--color-line)'}
              strokeWidth={1}
              strokeDasharray={v === 100 ? '5 3' : undefined}
            />
            <text x={PAD.left - 6} y={y(v) + 3.5} textAnchor="end" fontSize={10} fill="var(--color-ink-muted)">
              {v}%
            </text>
          </g>
        ))}
        {gridValues.includes(100) && (
          <text x={W - PAD.right} y={y(100) - 4} textAnchor="end" fontSize={9} fill="var(--color-ink-soft)">
            objectif test
          </text>
        )}

        {/* dates en abscisse */}
        {sorted.map((r, i) => (
          <text key={r.id} x={x(i)} y={H - 8} textAnchor="middle" fontSize={9.5} fill="var(--color-ink-muted)">
            S{r.week} · {fmtDate(r.date)}
          </text>
        ))}

        {/* réticule de survol */}
        {hover !== null && (
          <line
            x1={x(hover)}
            x2={x(hover)}
            y1={PAD.top}
            y2={H - PAD.bottom}
            stroke="var(--color-ink-muted)"
            strokeWidth={1}
            strokeDasharray="3 3"
          />
        )}

        {(() => {
          // Étiquettes de bout de ligne : écartées d'au moins 11 px pour éviter les collisions
          const last = points[points.length - 1]
          const labels = SERIES.map((s, si) => ({ si, y: y(last[s.key]) + 3.5 })).sort((a, b) => a.y - b.y)
          for (let i = 1; i < labels.length; i++) {
            if (labels[i].y - labels[i - 1].y < 11) labels[i].y = labels[i - 1].y + 11
          }
          const labelY = new Map(labels.map((l) => [l.si, l.y]))

          return SERIES.map((s, si) => {
            const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${x(i)},${y(p[s.key])}`).join(' ')
            return (
              <g key={s.key}>
                {points.length > 1 && <path d={path} fill="none" stroke={s.color} strokeWidth={2} />}
                {points.map((p, i) => (
                  <Marker key={i} shape={si} x={x(i)} y={y(p[s.key])} color={s.color} />
                ))}
                {/* étiquette directe en bout de ligne */}
                <text
                  x={W - PAD.right + 8}
                  y={labelY.get(si)}
                  fontSize={9.5}
                  fontWeight={600}
                  fill="var(--color-ink-soft)"
                >
                  {s.label}
                </text>
              </g>
            )
          })
        })()}
      </svg>

      {hoverEntry && (
        <div
          className={`pointer-events-none absolute top-1 border border-line bg-white/95 px-2.5 py-1.5 text-xs shadow ${
            tooltipLeftHalf ? 'right-2' : 'left-2'
          }`}
        >
          <p className="font-display font-semibold uppercase tracking-wide">
            Simulation S{hoverEntry.week} — {fmtDate(hoverEntry.date)}
          </p>
          <p>
            Tractions {hoverEntry.tractions}/{finalTargets.tractions} · Pompes {hoverEntry.pompes}/
            {finalTargets.pompes} · Abdos {hoverEntry.abdos}/{finalTargets.abdos}
          </p>
        </div>
      )}

      {/* légende */}
      <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-soft">
        {SERIES.map((s, si) => (
          <span key={s.key} className="flex items-center gap-1.5">
            <svg width={14} height={12} aria-hidden>
              <Marker shape={si} x={7} y={6} color={s.color} />
            </svg>
            {s.label}
          </span>
        ))}
        <span className="text-ink-muted">— en % de l’objectif du test</span>
      </div>
    </div>
  )
}
