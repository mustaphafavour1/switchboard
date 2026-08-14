import type { ReactNode } from 'react'
import { cn } from '../../lib/utils'

export function Chip({
  children,
  active = false,
  muted = false,
  className,
}: {
  children: ReactNode
  active?: boolean
  muted?: boolean
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium whitespace-nowrap',
        active
          ? 'border-primary-200 bg-primary-50 text-primary-700'
          : muted
            ? 'border-hairline bg-neutral-50 text-ink-faint'
            : 'border-border bg-white text-ink-strong',
        className,
      )}
    >
      {children}
    </span>
  )
}

export function ProviderChip({ initials, name, active }: { initials: string; name: string; active?: boolean }) {
  return (
    <Chip active={active}>
      <span
        className={cn(
          'flex h-4 w-4 items-center justify-center rounded-full font-mono text-[8px] font-semibold',
          active ? 'bg-primary-500 text-white' : 'bg-neutral-200 text-ink-muted',
        )}
      >
        {initials}
      </span>
      {name}
    </Chip>
  )
}
