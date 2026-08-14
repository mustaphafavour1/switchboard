export type ProviderStatus = 'operational' | 'degraded' | 'outage'

export type Capability =
  | 'text-generation'
  | 'vision'
  | 'function-calling'
  | 'embeddings'
  | 'code'
  | 'long-context'
  | 'fine-tuning'
  | 'audio'

export type Environment = 'production' | 'staging' | 'development'

export interface Model {
  id: string
  providerId: string
  name: string
  contextWindow: number // tokens
  priceIn: number // $ per 1M input tokens
  priceOut: number // $ per 1M output tokens
  rateLimitRpm: number
  modalities: string[]
  capabilities: Capability[]
  status: ProviderStatus
}

export interface Provider {
  id: string
  name: string
  initials: string
  description: string
  capabilities: Capability[]
  environments: Environment[]
  status: ProviderStatus
  uptimePercent: number
  avgLatencyMs: number
  monthlySpend: number
  modelIds: string[]
}

export type RouteStrategy = 'cost' | 'latency' | 'capability'

export interface RoutingRule {
  productId: string
  primaryProviderId: string
  primaryModelId: string
  fallbackChain: { providerId: string; modelId: string }[]
  routeBy: RouteStrategy
  monthlyBudget: number
}

export interface Product {
  id: string
  name: string
  owner: string
  description: string
  routing: RoutingRule
  actualSpend: number
}

export type UserRole = 'Product Admin' | 'Lead Developer' | 'Super Admin' | 'Product Developer'

export interface Person {
  id: string
  name: string
  email: string
  role: UserRole
  products: string[] // product ids
  lastActiveIso: string
  status: 'active' | 'invited' | 'suspended'
}

export interface AuditLogEntry {
  id: string
  actorId: string
  action: string
  target: string
  detail: string
  timestampIso: string
}

export type ChangeType = 'new-model' | 'deprecation' | 'price-change' | 'outage' | 'capability'

export interface ChangeFeedItem {
  id: string
  providerId: string
  type: ChangeType
  summary: string
  timestampIso: string
  severity: 'info' | 'warning' | 'critical'
  affectsProducts: string[]
}

export interface CostPoint {
  date: string
  spend: number
  tokensM: number
}

export interface SeedData {
  providers: Provider[]
  models: Model[]
  products: Product[]
  people: Person[]
  auditLog: AuditLogEntry[]
  changeFeed: ChangeFeedItem[]
  costSeries: CostPoint[]
  kpi: {
    activeProviders: number
    monthlySpend: number
    monthlySpendDelta: number
    avgLatencyMs: number
    avgLatencyDelta: number
    fleetUptime: number
    fleetUptimeDelta: number
  }
}
