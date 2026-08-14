import type { ReactNode } from 'react'
import { cn } from '../../lib/utils'

export type BadgeTone = 'success' | 'warning' | 'danger' | 'neutral' | 'primary'

const toneClasses: Record<BadgeTone, string> = {
  success: 'bg-success-bg text-success-text border-success-border',
  warning: 'bg-warning-bg text-warning-text border-warning-border',
  danger: 'bg-danger-bg text-danger-text border-danger-border',
  neutral: 'bg-neutral-100 text-ink-muted border-neutral-200',
  primary: 'bg-primary-50 text-primary-700 border-primary-200',
}

export function Badge({
  tone = 'neutral',
  children,
  className,
  dot = false,
}: {
  tone?: BadgeTone
  children: ReactNode
  className?: string
  dot?: boolean
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2 py-[1px] text-[10px] font-medium',
        toneClasses[tone],
        className,
      )}
    >
      {dot && <span className={cn('h-1.5 w-1.5 rounded-full', dotColor(tone))} />}
      {children}
    </span>
  )
}

function dotColor(tone: BadgeTone) {
  switch (tone) {
    case 'success':
      return 'bg-emerald-500'
    case 'warning':
      return 'bg-amber-500'
    case 'danger':
      return 'bg-rose-500'
    case 'primary':
      return 'bg-primary-500'
    default:
      return 'bg-neutral-400'
  }
}

const STATUS_TONE: Record<string, BadgeTone> = {
  operational: 'success',
  degraded: 'warning',
  outage: 'danger',
  active: 'success',
  invited: 'warning',
  suspended: 'danger',
}

export function StatusBadge({ status }: { status: string }) {
  const tone = STATUS_TONE[status] ?? 'neutral'
  return (
    <Badge tone={tone} dot>
      <span className="capitalize">{status}</span>
    </Badge>
  )
}
