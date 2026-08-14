import { useEffect, useState } from 'react'
import { Check, DollarSign, Gauge, Layers as LayersIcon } from 'lucide-react'
import { PageHeader } from '../components/ui/PageHeader'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Field, Select } from '../components/ui/Input'
import { ProviderChip } from '../components/ui/Chip'
import { cn, formatCurrency } from '../lib/utils'
import { useSeed } from '../context/SeedContext'
import type { RouteStrategy } from '../types'

const ROUTE_OPTIONS: { key: RouteStrategy; label: string; icon: typeof DollarSign; hint: string }[] = [
  { key: 'cost', label: 'Cost', icon: DollarSign, hint: 'Route to the cheapest available model' },
  { key: 'latency', label: 'Latency', icon: Gauge, hint: 'Route to the fastest responding model' },
  { key: 'capability', label: 'Capability', icon: LayersIcon, hint: 'Route to the most capable match' },
]

interface DraftRouting {
  primaryModelId: string
  fallback1: string
  fallback2: string
  routeBy: RouteStrategy
  monthlyBudget: number
}

export default function ProductsRouting() {
  const { data } = useSeed()
  const [selectedId, setSelectedId] = useState(data.products[0].id)
  const [drafts, setDrafts] = useState<Record<string, DraftRouting>>({})
  const [savedFlash, setSavedFlash] = useState(false)

  const product = data.products.find((p) => p.id === selectedId)!
  const providerById = new Map(data.providers.map((p) => [p.id, p]))
  const modelById = new Map(data.models.map((m) => [m.id, m]))

  function draftFor(productId: string): DraftRouting {
    const p = data.products.find((x) => x.id === productId)!
    return (
      drafts[productId] ?? {
        primaryModelId: p.routing.primaryModelId,
        fallback1: p.routing.fallbackChain[0]?.modelId ?? '',
        fallback2: p.routing.fallbackChain[1]?.modelId ?? '',
        routeBy: p.routing.routeBy,
        monthlyBudget: p.routing.monthlyBudget,
      }
    )
  }

  const draft = draftFor(selectedId)

  useEffect(() => {
    setSavedFlash(false)
  }, [selectedId])

  function updateDraft(patch: Partial<DraftRouting>) {
    setDrafts((prev) => ({ ...prev, [selectedId]: { ...draft, ...patch } }))
    setSavedFlash(false)
  }

  const chainModelIds = [draft.primaryModelId, draft.fallback1, draft.fallback2].filter(Boolean)
  const chainProviders = chainModelIds.map((id) => {
    const m = modelById.get(id)!
    return providerById.get(m.providerId)!
  })

  const isOverridden = Boolean(drafts[selectedId])

  return (
    <div>
      <PageHeader
        title="Products & Routing"
        description="Configure which provider each product uses, its fallback chain, and how routing decisions get made."
      />

      <div className="grid grid-cols-[260px_1fr] gap-4">
        <Card className="h-fit p-2">
          <div className="flex flex-col gap-0.5">
            {data.products.map((p) => {
              const active = p.id === selectedId
              const primaryProvider = providerById.get(p.routing.primaryProviderId)!
              return (
                <button
                  key={p.id}
                  onClick={() => setSelectedId(p.id)}
                  className={cn(
                    'flex flex-col items-start gap-0.5 rounded-lg px-3 py-2.5 text-left transition-colors',
                    active ? 'bg-primary-50' : 'hover:bg-neutral-50',
                  )}
                >
                  <span className={cn('text-[12px] font-medium', active ? 'text-primary-700' : 'text-ink-strong')}>
                    {p.name}
                  </span>
                  <span className="text-[10px] text-ink-soft">{primaryProvider.name}</span>
                </button>
              )
            })}
          </div>
        </Card>

        <div className="flex flex-col gap-4">
          <Card>
            <div className="mb-1 flex items-start justify-between">
              <div>
                <div className="type-subheading">{product.name}</div>
                <p className="type-meta mt-0.5">{product.description}</p>
              </div>
              <span className="text-[11px] text-ink-soft">Owner · {product.owner}</span>
            </div>

            <div className="mt-4 border-t border-hairline-soft pt-4">
              <div className="type-eyebrow mb-2">Active chain</div>
              <div className="flex flex-wrap items-center gap-1.5">
                {chainProviders.map((p, i) => (
                  <span key={p.id + i} className="flex items-center gap-1.5">
                    {i > 0 && <span className="text-ink-faint">→</span>}
                    <ProviderChip initials={p.initials} name={`${p.name} · ${modelById.get(chainModelIds[i])!.name}`} active={i === 0} />
                  </span>
                ))}
              </div>
            </div>
          </Card>

          <Card>
            <div className="mb-4 flex items-center justify-between">
              <span className="type-subheading">Routing rules</span>
              {isOverridden && <span className="text-[10px] font-medium text-primary-600">Edited this session</span>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Primary provider & model">
                <Select
                  value={draft.primaryModelId}
                  onChange={(e) => updateDraft({ primaryModelId: e.target.value })}
                >
                  {data.models.map((m) => (
                    <option key={m.id} value={m.id}>
                      {providerById.get(m.providerId)!.name} · {m.name}
                    </option>
                  ))}
                </Select>
              </Field>

              <Field label="Monthly budget">
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[13px] text-ink-soft">$</span>
                  <input
                    type="number"
                    value={draft.monthlyBudget}
                    onChange={(e) => updateDraft({ monthlyBudget: Number(e.target.value) })}
                    className="h-9 w-full rounded-md border border-border bg-white pl-6 pr-3 text-[13px] text-ink-strong focus:outline-none focus:ring-4 focus:ring-primary-500/15 focus:border-primary-300"
                  />
                </div>
              </Field>

              <Field label="Fallback 1">
                <Select value={draft.fallback1} onChange={(e) => updateDraft({ fallback1: e.target.value })}>
                  <option value="">— None —</option>
                  {data.models
                    .filter((m) => m.id !== draft.primaryModelId)
                    .map((m) => (
                      <option key={m.id} value={m.id}>
                        {providerById.get(m.providerId)!.name} · {m.name}
                      </option>
                    ))}
                </Select>
              </Field>

              <Field label="Fallback 2">
                <Select value={draft.fallback2} onChange={(e) => updateDraft({ fallback2: e.target.value })}>
                  <option value="">— None —</option>
                  {data.models
                    .filter((m) => m.id !== draft.primaryModelId && m.id !== draft.fallback1)
                    .map((m) => (
                      <option key={m.id} value={m.id}>
                        {providerById.get(m.providerId)!.name} · {m.name}
                      </option>
                    ))}
                </Select>
              </Field>
            </div>

            <div className="mt-5">
              <span className="mb-2 block text-[12px] font-medium text-ink-strong">Route by</span>
              <div className="grid grid-cols-3 gap-2.5">
                {ROUTE_OPTIONS.map((opt) => {
                  const active = draft.routeBy === opt.key
                  return (
                    <button
                      key={opt.key}
                      onClick={() => updateDraft({ routeBy: opt.key })}
                      className={cn(
                        'flex flex-col items-start gap-1.5 rounded-md border p-3 text-left transition-colors',
                        active ? 'border-primary-300 bg-primary-25' : 'border-border hover:bg-neutral-50',
                      )}
                    >
                      <div className="flex w-full items-center justify-between">
                        <opt.icon size={14} className={active ? 'text-primary-600' : 'text-ink-soft'} />
                        {active && <Check size={12} className="text-primary-600" />}
                      </div>
                      <span className={cn('text-[12px] font-medium', active ? 'text-primary-700' : 'text-ink-strong')}>
                        {opt.label}
                      </span>
                      <span className="text-[10px] leading-snug text-ink-soft">{opt.hint}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between border-t border-hairline pt-4">
              <span className="text-[11px] text-ink-muted">
                Budget: <span className="font-mono text-ink-strong">{formatCurrency(draft.monthlyBudget)}</span> / mo
              </span>
              <div className="flex items-center gap-2">
                {savedFlash && <span className="text-[11px] font-medium text-emerald-600">Saved</span>}
                <Button size="sm" variant="outline" onClick={() => {
                  const next = { ...drafts }
                  delete next[selectedId]
                  setDrafts(next)
                }}>
                  Reset
                </Button>
                <Button size="sm" onClick={() => setSavedFlash(true)}>
                  Save changes
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
