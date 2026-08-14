// SwitchAI — pre-baked, deterministic "insights" derived from whatever seed data is
// currently active. No API calls; every string here is computed from SeedData.
import type { Model, Product, Provider, SeedData } from '../types'
import { formatCurrency, relativeTime } from './utils'

export function changeDigest(data: SeedData): string {
  const recent = data.changeFeed.filter((c) => Date.now() - +new Date(c.timestampIso) < 7 * 24 * 3600_000)
  if (recent.length === 0) return 'No provider changes in the last 7 days — everything is steady.'

  const critical = recent.filter((c) => c.severity === 'critical')
  const warnings = recent.filter((c) => c.severity === 'warning')
  const affected = new Set(recent.flatMap((c) => c.affectsProducts))
  const productNames = data.products.filter((p) => affected.has(p.id)).slice(0, 2).map((p) => p.name)

  const parts: string[] = [`${recent.length} change${recent.length === 1 ? '' : 's'} this week`]
  if (critical.length) parts.push(`${critical.length} critical`)
  if (warnings.length) parts.push(`${warnings.length} need${warnings.length === 1 ? 's' : ''} review`)

  const tail = productNames.length
    ? ` ${productNames.join(' and ')} ${productNames.length === 1 ? 'is' : 'are'} affected.`
    : ' No routed products are affected.'

  return `${parts.join(', ')}.${tail}`
}

export function providerSuggestion(data: SeedData): {
  headline: string
  detail: string
} | null {
  const modelById = new Map(data.models.map((m) => [m.id, m]))
  const providerById = new Map(data.providers.map((p) => [p.id, p]))

  let best: { product: Product; current: Model; alt: Model; savingsPct: number } | null = null

  for (const product of data.products) {
    const current = modelById.get(product.routing.primaryModelId)
    if (!current) continue
    const currentBlended = current.priceIn * 0.6 + current.priceOut * 0.4

    for (const alt of data.models) {
      if (alt.id === current.id) continue
      const sharedCaps = alt.capabilities.filter((c) => current.capabilities.includes(c))
      if (sharedCaps.length < Math.min(2, current.capabilities.length)) continue
      const altStatus = providerById.get(alt.providerId)?.status
      if (altStatus === 'outage') continue

      const altBlended = alt.priceIn * 0.6 + alt.priceOut * 0.4
      if (altBlended >= currentBlended * 0.75) continue

      const savingsPct = (1 - altBlended / currentBlended) * 100
      if (!best || savingsPct > best.savingsPct) {
        best = { product, current, alt, savingsPct }
      }
    }
  }

  if (!best) return null

  const altProvider = providerById.get(best.alt.providerId)!
  const estMonthlySpend = data.products.length
    ? Math.round((data.kpi.monthlySpend / data.products.length) * (best.savingsPct / 100))
    : 0

  return {
    headline: `${best.product.name} could move from ${best.current.name} to ${best.alt.name} (${altProvider.name})`,
    detail: `Similar capability profile at roughly ${Math.round(best.savingsPct)}% lower blended token price — an estimated ${formatCurrency(
      estMonthlySpend,
    )}/mo saved.`,
  }
}

export function costAnomaly(data: SeedData): { headline: string; detail: string } {
  const series = data.costSeries
  const withDelta = series.map((p, i) => {
    const prev = series[i - 1]
    return { ...p, deltaPct: prev ? ((p.spend - prev.spend) / prev.spend) * 100 : 0 }
  })
  const spike = withDelta.slice(1).reduce((max, p) => (p.deltaPct > max.deltaPct ? p : max), withDelta[1])

  const topProvider = [...data.providers].sort((a, b) => b.monthlySpend - a.monthlySpend)[0]
  const date = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(new Date(spike.date))

  return {
    headline: `Spend spiked ${Math.round(spike.deltaPct)}% on ${date}`,
    detail: `Daily spend jumped to ${formatCurrency(spike.spend)}, well above the trailing average — mostly usage on ${topProvider.name}. Worth confirming this was expected traffic.`,
  }
}

export function comparisonHighlight(models: Model[], providers: Provider[]): string {
  if (models.length < 2) return ''
  const providerById = new Map(providers.map((p) => [p.id, p]))

  const cheapest = [...models].sort((a, b) => a.priceIn + a.priceOut - (b.priceIn + b.priceOut))[0]
  const mostCapable = [...models].sort((a, b) => b.capabilities.length - a.capabilities.length)[0]
  const fastestProvider = [...models].sort(
    (a, b) => (providerById.get(a.providerId)?.avgLatencyMs ?? 0) - (providerById.get(b.providerId)?.avgLatencyMs ?? 0),
  )[0]

  if (cheapest.id === mostCapable.id) {
    return `${cheapest.name} is the best all-round pick — lowest price and the widest capability set of the group.`
  }
  if (fastestProvider.id === cheapest.id) {
    return `${cheapest.name} wins on price and latency; pick ${mostCapable.name} instead if you need its broader capability set.`
  }
  return `${cheapest.name} is the cheapest of the group; ${mostCapable.name} covers the most capabilities. Best pick depends on whether this workload is cost- or capability-bound.`
}

export function lastChangeRelativeLabel(iso: string) {
  return relativeTime(iso)
}
