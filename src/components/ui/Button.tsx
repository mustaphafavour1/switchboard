import type { ButtonHTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost'
type Size = 'default' | 'sm'

const variantClasses: Record<Variant, string> = {
  primary: 'bg-primary-500 text-white hover:bg-primary-600',
  secondary: 'bg-neutral-100 text-ink-strong hover:bg-neutral-200',
  outline: 'border border-border bg-white text-ink-strong hover:bg-neutral-50',
  ghost: 'text-ink-strong hover:bg-neutral-50',
}

const sizeClasses: Record<Size, string> = {
  default: 'h-9 px-3.5 text-[13px]',
  sm: 'h-8 px-3 text-[12px]',
}

export function Button({
  className,
  variant = 'primary',
  size = 'default',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size }) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-1.5 rounded-md font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50',
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...props}
    />
  )
}
