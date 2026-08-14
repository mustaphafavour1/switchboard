import type { ReactNode } from 'react'
import { Sparkles } from 'lucide-react'
import { cn } from '../../lib/utils'

// Shared shell for SwitchAI's pre-baked, mocked insight touches.
export function AiNote({ label = 'SwitchAI', children, className }: { label?: string; children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'flex items-start gap-2 rounded-md border border-accent-100 bg-accent-50/60 px-3 py-2',
        className,
      )}
    >
      <Sparkles size={12} className="mt-[1px] shrink-0 text-accent-500" />
      <div className="text-[11px] leading-relaxed text-ink-strong">
        <span className="mr-1 font-semibold text-accent-600">{label}</span>
        {children}
      </div>
    </div>
  )
}
