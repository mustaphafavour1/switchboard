import { Link } from 'react-router-dom'
import { AlertTriangle, ArrowRight, Radio, Sparkles, TrendingUp, Zap } from 'lucide-react'
import { PageHeader } from '../components/ui/PageHeader'
import { StatCard } from '../components/ui/StatCard'
import { Card } from '../components/ui/Card'
import { MiniAreaChart } from '../components/charts/MiniAreaChart'
import { ProviderChip } from '../components/ui/Chip'
import { AiNote } from '../components/ai/AiNote'
import { useSeed } from '../context/SeedContext'
import { changeDigest, providerSuggestion } from '../lib/ai'
import { formatCurrency, relativeTime } from '../lib/utils'

const SEVERITY_ICON = {
  info: Sparkles,
  warning: AlertTriangle,
  critical: Zap,
} as const

const SEVERITY_COLOR = {
  info: 'text-primary-500',
  warning: 'text-amber-500',
  critical: 'text-rose-500',
} as const

export default function Overview() {
  const { data } = useSeed()
  const { kpi, providers, products, changeFeed } = data

  const providerById = new Map(providers.map((p) => [p.id, p]))

  const spendSpark = data.costSeries.slice(-30).map((p) => ({ x: p.date, y: p.spend }))
  const tokensSpark = data.costSeries.slice(-30).map((p) => ({ x: p.date, y: p.tokensM }))

  const degraded = providers.filter((p) => p.status !== 'operational').length
  const suggestion = providerSuggestion(data)

  return (
    <div>
      <PageHeader
        title="Overview"
        description="Fleet health, spend, and routing across every connected AI provider."
      />

      <div className="grid grid-cols-4 gap-3.5">
        <StatCard
          label="Active Providers"
          value={kpi.activeProviders}
          suffix={`/ ${providers.length}`}
          delta={degraded === 0 ? 'All operational' : `${degraded} need attention`}
          deltaDirection={degraded === 0 ? 'up' : 'down'}
          deltaGood={degraded === 0}
        />
        <StatCard
          label="Monthly Spend"
          value={formatCurrency(kpi.monthlySpend, { compact: true })}
          delta={`${kpi.monthlySpendDelta >= 0 ? '+' : ''}${kpi.monthlySpendDelta.toFixed(1)}% vs last week`}
          deltaDirection={kpi.monthlySpendDelta >= 0 ? 'up' : 'down'}
          deltaGood={kpi.monthlySpendDelta <= 0}
        />
        <StatCard
          label="Avg Latency"
          value={kpi.avgLatencyMs}
          suffix="ms"
          delta={`${kpi.avgLatencyDelta >= 0 ? '+' : ''}${kpi.avgLatencyDelta.toFixed(1)}% vs last week`}
          deltaDirection={kpi.avgLatencyDelta >= 0 ? 'up' : 'down'}
          deltaGood={kpi.avgLatencyDelta <= 0}
        />
        <StatCard
          label="Fleet Uptime"
          value={kpi.fleetUptime.toFixed(2)}
          suffix="%"
          delta={`${kpi.fleetUptimeDelta >= 0 ? '+' : ''}${kpi.fleetUptimeDelta.toFixed(2)}pp vs last week`}
          deltaDirection={kpi.fleetUptimeDelta >= 0 ? 'up' : 'down'}
          deltaGood={kpi.fleetUptimeDelta >= 0}
        />
      </div>

      {suggestion && (
        <AiNote label="Provider Suggestion" className="mt-3.5">
          <span className="font-medium">{suggestion.headline}.</span> {suggestion.detail}
        </AiNote>
      )}

      <div className="mt-5 grid grid-cols-2 items-start gap-3.5">
        <Card>
          <div className="mb-1 flex items-center justify-between">
            <span className="type-subheading">Spend trend</span>
            <span className="flex items-center gap-1 text-[11px] text-ink-muted">
              <TrendingUp size={12} className="text-primary-500" /> Last 30 days
            </span>
          </div>
          <MiniAreaChart data={spendSpark} color="#6366F1" formatY={(v) => formatCurrency(v, { compact: true })} />
        </Card>
        <Card>
          <div className="mb-1 flex items-center justify-between">
            <span className="type-subheading">Token usage trend</span>
            <span className="flex items-center gap-1 text-[11px] text-ink-muted">
              <TrendingUp size={12} className="text-cyan-500" /> Last 30 days
            </span>
          </div>
          <MiniAreaChart data={tokensSpark} color="#22D3EE" formatY={(v) => `${v.toFixed(1)}M`} />
        </Card>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3.5">
        <Card className="col-span-2">
          <div className="mb-3.5 flex items-center justify-between">
            <span className="type-subheading">Routing snapshot</span>
            <Link
              to="/products/routing"
              className="flex items-center gap-1 text-[11px] font-medium text-primary-600 hover:text-primary-700"
            >
              Manage routing <ArrowRight size={11} />
            </Link>
          </div>
          <div className="flex flex-col divide-y divide-hairline-soft">
            {products.slice(0, 6).map((product) => {
              const primaryProvider = providerById.get(product.routing.primaryProviderId)!
              return (
                <div key={product.id} className="flex items-center justify-between gap-4 py-2.5 first:pt-0 last:pb-0">
                  <div className="w-36 shrink-0">
                    <div className="truncate text-[12px] font-medium text-ink-strong">{product.name}</div>
                    <div className="truncate text-[10px] text-ink-soft">{product.owner}</div>
                  </div>
                  <div className="flex flex-1 flex-wrap items-center gap-1.5">
                    <ProviderChip initials={primaryProvider.initials} name={primaryProvider.name} active />
                    {product.routing.fallbackChain.map((f, i) => {
                      const p = providerById.get(f.providerId)!
                      return (
                        <span key={f.providerId + i} className="flex items-center gap-1.5">
                          <span className="text-ink-faint">→</span>
                          <ProviderChip initials={p.initials} name={p.name} />
                        </span>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </Card>

        <Card>
          <div className="mb-3 flex items-center justify-between">
            <span className="type-subheading">Recent provider changes</span>
            <Link
              to="/providers/change-feed"
              className="flex items-center gap-1 text-[11px] font-medium text-primary-600 hover:text-primary-700"
            >
              <Radio size={11} /> Feed
            </Link>
          </div>
          <AiNote label="Change Digest" className="mb-3">
            {changeDigest(data)}
          </AiNote>
          <div className="flex flex-col divide-y divide-hairline-soft">
            {changeFeed.slice(0, 5).map((c) => {
              const provider = providerById.get(c.providerId)!
              const Icon = SEVERITY_ICON[c.severity]
              return (
                <div key={c.id} className="flex items-start gap-2 py-2 first:pt-0 last:pb-0">
                  <Icon size={12} className={`mt-[2px] shrink-0 ${SEVERITY_COLOR[c.severity]}`} />
                  <div className="min-w-0">
                    <p className="text-[11px] leading-snug text-ink-strong">{c.summary}</p>
                    <div className="mt-0.5 flex items-center gap-1.5 text-[10px] text-ink-faint">
                      <span>{provider.name}</span>
                      <span>·</span>
                      <span>{relativeTime(c.timestampIso)}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      </div>
    </div>
  )
}
