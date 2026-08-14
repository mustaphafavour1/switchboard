import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from 'react'
import { ChevronDown, Search } from 'lucide-react'
import { cn } from '../../lib/utils'

export function Field({
  label,
  children,
  hint,
}: {
  label: string
  children: ReactNode
  hint?: string
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[12px] font-medium text-ink-strong">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-[11px] text-ink-muted">{hint}</span>}
    </label>
  )
}

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'h-9 w-full rounded-md border border-border bg-white px-3 text-[13px] text-ink-strong placeholder:text-ink-faint',
        'focus:outline-none focus:ring-4 focus:ring-primary-500/15 focus:border-primary-300',
        className,
      )}
      {...props}
    />
  )
}

export function Select({ className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="relative">
      <select
        className={cn(
          'h-9 w-full appearance-none rounded-md border border-border bg-white px-3 pr-8 text-[13px] text-ink-strong',
          'focus:outline-none focus:ring-4 focus:ring-primary-500/15 focus:border-primary-300',
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown size={13} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-soft" />
    </div>
  )
}

export function SearchInput({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className={cn('flex h-8 items-center gap-2 rounded-md border border-border bg-white px-2.5', className)}>
      <Search size={12} className="shrink-0 text-ink-soft" />
      <input
        className="h-full w-full bg-transparent text-[11px] text-ink placeholder:text-ink-faint focus:outline-none"
        {...props}
      />
    </div>
  )
}

export function CompactSelect({ className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className={cn('relative', className)}>
      <select
        className="h-8 w-full appearance-none rounded-md border border-border bg-white pl-2.5 pr-7 text-[11px] text-ink-strong focus:outline-none focus:ring-4 focus:ring-primary-500/15"
        {...props}
      >
        {children}
      </select>
      <ChevronDown size={11} className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-ink-soft" />
    </div>
  )
}
