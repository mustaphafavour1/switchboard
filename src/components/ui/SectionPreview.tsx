import type { LucideIcon } from 'lucide-react'
import { Sparkles } from 'lucide-react'
import { PageHeader } from './PageHeader'

export function SectionPreview({
  title,
  description,
  icon: Icon = Sparkles,
}: {
  title: string
  description: string
  icon?: LucideIcon
}) {
  return (
    <div>
      <PageHeader title={title} description={description} />
      <div className="flex min-h-[420px] flex-col items-center justify-center rounded-lg border border-dashed border-hairline bg-white p-10 text-center">
        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-primary-25 text-primary-500">
          <Icon size={18} />
        </div>
        <p className="type-subheading mb-1.5">This section is on the roadmap</p>
        <p className="max-w-sm text-[11px] leading-relaxed text-ink-muted">
          {title} isn&apos;t built out in this preview yet. It&apos;s part of Switchboard&apos;s full scope and
          will follow the same patterns as the rest of the console.
        </p>
      </div>
    </div>
  )
}
