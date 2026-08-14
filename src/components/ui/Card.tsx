import type { HTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('rounded-[0.7rem] border border-hairline bg-white p-5 shadow-soft', className)}
      {...props}
    />
  )
}
