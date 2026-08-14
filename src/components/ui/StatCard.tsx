import type { ReactNode } from 'react'
import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { cn } from '../../lib/utils'

export function StatCard({
  label,
  value,
  delta,
  deltaDirection,
  deltaGood,
  suffix,
  className,
}: {
  label: string
  value: ReactNode
  /** formatted delta text, e.g. "-10.4% vs last week" */
  delta?: string
  /** which way the underlying number actually moved */
  deltaDirection?: 'up' | 'down'
  /** whether that direction counts as good (controls colour only) */
  deltaGood?: boolean
  suffix?: string
  className?: string
}) {
  return (
    <div className={cn('rounded-lg border border-hairline bg-white p-4', className)}>
      <div className="type-label mb-2">{label}</div>
      <div className="flex items-baseline gap-1.5">
        <span className="type-display">{value}</span>
        {suffix && <span className="text-[12px] font-medium text-ink-soft">{suffix}</span>}
      </div>
      {delta ? (
        <div
          className={cn(
            'mt-2 flex items-center gap-1 text-[11px] font-medium',
            deltaGood === undefined ? 'text-ink-muted' : deltaGood ? 'text-emerald-600' : 'text-rose-600',
          )}
        >
          {deltaDirection &&
            (deltaDirection === 'up' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />)}
          <span>{delta}</span>
        </div>
      ) : (
        <div className="mt-2 h-[15px]" />
      )}
    </div>
  )
}
