import type { ButtonHTMLAttributes, ReactNode } from 'react'

export function Button({
  variant = 'primary',
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'ghost' | 'danger' }) {
  const base = 'btn-tap w-full rounded-md font-display text-xl tracking-wide px-4 py-3 transition-colors disabled:opacity-40 disabled:pointer-events-none'
  const variants: Record<string, string> = {
    primary: 'bg-amber text-bg active:bg-amber-soft',
    secondary: 'bg-panel-raised text-ink border border-line active:bg-line-soft',
    ghost: 'bg-transparent text-ink-soft border border-line active:bg-panel-raised',
    danger: 'bg-danger text-ink active:opacity-80',
  }
  return <button className={`${base} ${variants[variant]} ${className}`} {...props} />
}

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-lg border border-line bg-panel p-4 ${className}`}>{children}</div>
}

export function PageTitle({ children, sub }: { children: ReactNode; sub?: string }) {
  return (
    <div className="mb-4">
      <h1 className="font-display text-3xl text-amber leading-none">{children}</h1>
      {sub && <p className="text-ink-muted text-sm mt-1">{sub}</p>}
    </div>
  )
}

export function Badge({ children, tone = 'olive' }: { children: ReactNode; tone?: 'olive' | 'amber' | 'ok' | 'danger' }) {
  const tones: Record<string, string> = {
    olive: 'bg-olive-soft/30 text-ink-soft border-olive',
    amber: 'bg-amber/20 text-amber border-amber',
    ok: 'bg-ok/20 text-ok border-ok',
    danger: 'bg-danger/20 text-danger border-danger',
  }
  return (
    <span className={`inline-block rounded border px-2 py-0.5 text-xs font-mono uppercase tracking-wide ${tones[tone]}`}>
      {children}
    </span>
  )
}
