import { useMemo, useState, type ReactNode } from 'react'
import { Check, Image, Mic, Type } from 'lucide-react'
import { PageHeader } from '../components/ui/PageHeader'
import { Card } from '../components/ui/Card'
import { CompactSelect } from '../components/ui/Input'
import { AiNote } from '../components/ai/AiNote'
import { useSeed } from '../context/SeedContext'
import { comparisonHighlight } from '../lib/ai'
import { cn, formatNumber } from '../lib/utils'
import type { Capability } from '../types'

const MODALITY_ICON: Record<string, typeof Type> = { text: Type, image: Image, audio: Mic }

const CAPABILITY_LABEL: Record<Capability, string> = {
  'text-generation': 'Text generation',
  vision: 'Vision',
  'function-calling': 'Function calling',
  embeddings: 'Embeddings',
  code: 'Code',
  'long-context': 'Long context',
  'fine-tuning': 'Fine-tuning',
  audio: 'Audio',
}

export default function Comparison() {
  const { data } = useSeed()
  const [selected, setSelected] = useState<string[]>(['nova-pro', 'meridian-3-turbo', 'arcform-delta-mini'])

  const providerById = new Map(data.providers.map((p) => [p.id, p]))
  const modelById = new Map(data.models.map((m) => [m.id, m]))

  const models = selected.map((id) => modelById.get(id)).filter((m): m is NonNullable<typeof m> => Boolean(m))
  const providers = models.map((m) => providerById.get(m.providerId)!)

  const blended = (priceIn: number, priceOut: number) => priceIn * 0.6 + priceOut * 0.4

  const bestPriceId = useMemo(() => {
    if (!models.length) return null
    return [...models].sort((a, b) => blended(a.priceIn, a.priceOut) - blended(b.priceIn, b.priceOut))[0].id
  }, [models])

  const bestLatencyProviderId = useMemo(() => {
    if (!providers.length) return null
    return [...providers].sort((a, b) => a.avgLatencyMs - b.avgLatencyMs)[0].id
  }, [providers])

  const bestContextId = useMemo(() => {
    if (!models.length) return null
    return [...models].sort((a, b) => b.contextWindow - a.contextWindow)[0].id
  }, [models])

  const bestUptimeProviderId = useMemo(() => {
    if (!providers.length) return null
    return [...providers].sort((a, b) => b.uptimePercent - a.uptimePercent)[0].id
  }, [providers])

  const highlight = comparisonHighlight(models, data.providers)

  return (
    <div>
      <PageHeader
        title="Comparison"
        description="Line up two or three models side by side to see where each one wins."
      />

      <div className="mb-4 grid grid-cols-3 gap-3.5">
        {[0, 1, 2].map((i) => (
          <CompactSelect
            key={i}
            value={selected[i] ?? ''}
            className="h-9"
            onChange={(e) => {
              const next = [...selected]
              next[i] = e.target.value
              setSelected(next)
            }}
          >
            <option value="">— Select a model —</option>
            {data.models.map((m) => (
              <option key={m.id} value={m.id}>
                {providerById.get(m.providerId)!.name} · {m.name}
              </option>
            ))}
          </CompactSelect>
        ))}
      </div>

      {highlight && (
        <AiNote label="Comparison Highlights" className="mb-5">
          {highlight}
        </AiNote>
      )}

      <div className="grid grid-cols-3 gap-3.5">
        {models.map((model, i) => {
          const provider = providers[i]
          return (
            <Card key={model.id} className="flex flex-col p-0">
              <div className="border-b border-hairline p-5">
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50 font-mono text-[12px] font-semibold text-primary-700">
                  {provider.initials}
                </div>
                <div className="type-subheading">{model.name}</div>
                <div className="text-[11px] text-ink-soft">{provider.name}</div>
              </div>

              <div className="flex flex-col divide-y divide-hairline-soft px-5">
                <Row label="Price / 1M tokens" best={model.id === bestPriceId}>
                  <span className="font-mono">
                    ${model.priceIn.toFixed(2)} in · ${model.priceOut.toFixed(2)} out
                  </span>
                </Row>
                <Row label="Avg latency" best={provider.id === bestLatencyProviderId}>
                  <span className="font-mono">{provider.avgLatencyMs}ms</span>
                </Row>
                <Row label="Context window" best={model.id === bestContextId}>
                  <span className="font-mono">{formatNumber(model.contextWindow, { compact: true })} tokens</span>
                </Row>
                <Row label="Uptime" best={provider.id === bestUptimeProviderId}>
                  <span className="font-mono">{provider.uptimePercent.toFixed(2)}%</span>
                </Row>
                <Row label="Modalities">
                  <div className="flex items-center gap-1.5">
                    {model.modalities.map((mo) => {
                      const Icon = MODALITY_ICON[mo] ?? Type
                      return (
                        <span
                          key={mo}
                          className="flex h-5 w-5 items-center justify-center rounded-full bg-neutral-100 text-ink-muted"
                          title={mo}
                        >
                          <Icon size={11} />
                        </span>
                      )
                    })}
                  </div>
                </Row>
                <Row label="Features covered" align="top">
                  <div className="flex flex-wrap justify-end gap-1">
                    {model.capabilities.map((c) => (
                      <span
                        key={c}
                        className="rounded-full border border-hairline bg-neutral-50 px-1.5 py-[1px] text-[9px] text-ink-muted"
                      >
                        {CAPABILITY_LABEL[c]}
                      </span>
                    ))}
                  </div>
                </Row>
              </div>

              <div className="p-5 pt-4 text-[10px] text-ink-faint">Rate limit · {formatNumber(model.rateLimitRpm, { compact: true })} rpm</div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

function Row({
  label,
  children,
  best,
  align = 'center',
}: {
  label: string
  children: ReactNode
  best?: boolean
  align?: 'center' | 'top'
}) {
  return (
    <div className={cn('flex justify-between gap-3 py-3', align === 'top' ? 'items-start' : 'items-center')}>
      <span className="shrink-0 type-label">{label}</span>
      <span
        className={cn(
          'flex items-center gap-1 text-right text-[12px]',
          best ? 'font-semibold text-ink-em' : 'text-ink-strong',
        )}
      >
        {best && <Check size={12} className="text-primary-500" />}
        {children}
      </span>
    </div>
  )
}
