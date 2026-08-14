import { mulberry32, pick, randInt, randRange, weightedStatus, type Rng } from '../lib/prng'
import type {
  AuditLogEntry,
  ChangeFeedItem,
  CostPoint,
  Model,
  Person,
  Product,
  Provider,
  SeedData,
} from '../types'
import { MODELS, PEOPLE, PRODUCTS, PROVIDERS } from './catalog'

const AUDIT_ACTIONS = [
  { action: 'Updated routing rule', detail: 'Changed route-by strategy' },
  { action: 'Rotated API key', detail: 'Credential rotated for compliance' },
  { action: 'Changed primary provider', detail: 'Switched primary model for product' },
  { action: 'Adjusted monthly budget', detail: 'Budget threshold updated' },
  { action: 'Added fallback provider', detail: 'New fallback appended to chain' },
  { action: 'Connected new provider', detail: 'Provider onboarded to catalog' },
  { action: 'Disabled provider', detail: 'Provider paused in an environment' },
  { action: 'Updated rate limit', detail: 'Per-minute request cap changed' },
  { action: 'Invited teammate', detail: 'New user granted product access' },
  { action: 'Changed user role', detail: 'Role permissions updated' },
]

function buildChangeFeed(rng: Rng, providers: Provider[], products: Product[]): ChangeFeedItem[] {
  const templates: { type: ChangeFeedItem['type']; severity: ChangeFeedItem['severity']; summary: (p: string) => string }[] = [
    { type: 'new-model', severity: 'info', summary: (p) => `${p} released a new model with expanded context window` },
    { type: 'deprecation', severity: 'warning', summary: (p) => `${p} announced deprecation of a legacy model in 30 days` },
    { type: 'price-change', severity: 'warning', summary: (p) => `${p} adjusted per-token pricing on its flagship model` },
    { type: 'outage', severity: 'critical', summary: (p) => `${p} reported a partial outage affecting completions` },
    { type: 'capability', severity: 'info', summary: (p) => `${p} added function-calling support to its base tier` },
  ]
  const items: ChangeFeedItem[] = []
  for (let i = 0; i < 18; i++) {
    const provider = pick(rng, providers)
    const template = pick(rng, templates)
    const hoursAgo = randInt(rng, 1, 24 * 21)
    const affected = products.filter(() => rng() < 0.35).map((p) => p.id)
    items.push({
      id: `chg-${i}`,
      providerId: provider.id,
      type: template.type,
      summary: template.summary(provider.name),
      severity: template.severity,
      timestampIso: new Date(Date.now() - hoursAgo * 3600_000).toISOString(),
      affectsProducts: affected.length ? affected : [pick(rng, products).id],
    })
  }
  return items.sort((a, b) => +new Date(b.timestampIso) - +new Date(a.timestampIso))
}

function buildAuditLog(rng: Rng, people: Person[], products: Product[], providers: Provider[]): AuditLogEntry[] {
  const items: AuditLogEntry[] = []
  for (let i = 0; i < 42; i++) {
    const actor = pick(rng, people)
    const tmpl = pick(rng, AUDIT_ACTIONS)
    const targetPool = rng() < 0.5 ? products.map((p) => p.name) : providers.map((p) => p.name)
    const target = pick(rng, targetPool)
    const hoursAgo = randInt(rng, 1, 24 * 45)
    items.push({
      id: `audit-${i}`,
      actorId: actor.id,
      action: tmpl.action,
      target,
      detail: tmpl.detail,
      timestampIso: new Date(Date.now() - hoursAgo * 3600_000).toISOString(),
    })
  }
  return items.sort((a, b) => +new Date(b.timestampIso) - +new Date(a.timestampIso))
}

function buildCostSeries(rng: Rng, baseDaily: number): CostPoint[] {
  const points: CostPoint[] = []
  const days = 90
  // inject one clear anomaly spike so Cost Anomaly AI insight always has something to point at
  const anomalyDay = randInt(rng, days - 20, days - 4)
  for (let i = days; i >= 0; i--) {
    const date = new Date(Date.now() - i * 24 * 3600_000)
    const dayIndex = days - i
    const trend = 1 + dayIndex * 0.0025 // gentle upward drift
    const weekday = date.getDay()
    const weekendDip = weekday === 0 || weekday === 6 ? 0.72 : 1
    const noise = randRange(rng, 0.88, 1.12)
    let multiplier = trend * weekendDip * noise
    if (dayIndex === anomalyDay) multiplier *= 1.85
    const spend = baseDaily * multiplier
    points.push({
      date: date.toISOString().slice(0, 10),
      spend: Math.round(spend),
      tokensM: Math.round((spend / 6) * 10) / 10,
    })
  }
  return points
}

export function generateSeedData(seed: number): SeedData {
  const rng = mulberry32(seed)

  const providerStatus = new Map(PROVIDERS.map((p) => [p.id, weightedStatus(rng)]))

  const models: Model[] = MODELS.map((m) => ({
    ...m,
    status: providerStatus.get(m.providerId) ?? 'operational',
  }))
  const modelById = new Map(models.map((m) => [m.id, m]))

  const products: Product[] = PRODUCTS.map((p) => ({
    id: p.id,
    name: p.name,
    owner: p.owner,
    description: p.description,
    routing: {
      productId: p.id,
      primaryProviderId: modelById.get(p.primaryModelId)!.providerId,
      primaryModelId: p.primaryModelId,
      fallbackChain: p.fallbackModelIds.map((id) => ({ providerId: modelById.get(id)!.providerId, modelId: id })),
      routeBy: p.routeBy,
      monthlyBudget: p.monthlyBudget,
    },
    actualSpend: Math.round(p.monthlyBudget * randRange(rng, 0.55, 1.18)),
  }))

  // Allocate each product's actual spend across its primary + fallback providers so
  // spend-by-provider and the Sankey flow stay consistent with one another.
  const providerSpend = new Map<string, number>()
  for (const product of products) {
    const chain = [product.routing.primaryProviderId, ...product.routing.fallbackChain.map((f) => f.providerId)]
    const weights = chain.map((_, i) => (i === 0 ? 0.78 : 0.22 / Math.max(1, chain.length - 1)))
    chain.forEach((providerId, i) => {
      const prev = providerSpend.get(providerId) ?? 0
      providerSpend.set(providerId, prev + product.actualSpend * weights[i])
    })
  }

  const providers: Provider[] = PROVIDERS.map((p) => {
    const status = providerStatus.get(p.id)!
    const modelIds = MODELS.filter((m) => m.providerId === p.id).map((m) => m.id)
    return {
      ...p,
      status,
      uptimePercent: status === 'operational' ? randRange(rng, 99.4, 99.99) : status === 'degraded' ? randRange(rng, 97.5, 99.3) : randRange(rng, 92, 97),
      avgLatencyMs: Math.round(randRange(rng, 210, 1400)),
      monthlySpend: Math.round(providerSpend.get(p.id) ?? randRange(rng, 1500, 4000)),
      modelIds,
    }
  })

  const people: Person[] = PEOPLE.map((p) => ({
    ...p,
    status: 'active',
    lastActiveIso: new Date(Date.now() - randInt(rng, 5, 60 * 24 * 10) * 60_000).toISOString(),
  }))

  const auditLog = buildAuditLog(rng, people, products, providers)
  const changeFeed = buildChangeFeed(rng, providers, products)

  const baseDaily = providers.reduce((sum, p) => sum + p.monthlySpend, 0) / 30
  const costSeries = buildCostSeries(rng, baseDaily)

  const last7 = costSeries.slice(-7)
  const prev7 = costSeries.slice(-14, -7)
  const last7Sum = last7.reduce((s, p) => s + p.spend, 0)
  const prev7Sum = prev7.reduce((s, p) => s + p.spend, 0)
  const monthlySpend = Math.round(costSeries.slice(-30).reduce((s, p) => s + p.spend, 0))
  const avgLatencyMs = Math.round(providers.reduce((s, p) => s + p.avgLatencyMs, 0) / providers.length)
  const fleetUptime = providers.reduce((s, p) => s + p.uptimePercent, 0) / providers.length

  return {
    providers,
    models,
    products,
    people,
    auditLog,
    changeFeed,
    costSeries,
    kpi: {
      activeProviders: providers.filter((p) => p.status !== 'outage').length,
      monthlySpend,
      monthlySpendDelta: prev7Sum ? ((last7Sum - prev7Sum) / prev7Sum) * 100 : 0,
      avgLatencyMs,
      avgLatencyDelta: randRange(rng, -8, 6),
      fleetUptime,
      fleetUptimeDelta: randRange(rng, -0.15, 0.1),
    },
  }
}
