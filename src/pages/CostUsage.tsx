import { useMemo, useState } from 'react'
import { PageHeader } from '../components/ui/PageHeader'
import { StatCard } from '../components/ui/StatCard'
import { Card } from '../components/ui/Card'
import { CompactSelect } from '../components/ui/Input'
import { MiniAreaChart } from '../components/charts/MiniAreaChart'
import { GradientBarChart } from '../components/charts/GradientBarChart'
import { SpendSankey } from '../components/charts/SpendSankey'
import { AiNote } from '../components/ai/AiNote'
import { useSeed } from '../context/SeedContext'
import { costAnomaly } from '../lib/ai'
import { cn, formatCurrency } from '../lib/utils'

export default function CostUsage() {
  const { data } = useSeed()
  const [rangeDays, setRangeDays] = useState(30)
  const [breakdownBy, setBreakdownBy] = useState<'provider' | 'product'>('provider')

  const series = data.costSeries.slice(-rangeDays)
  const spendSeries = series.map((p) => ({ x: p.date, y: p.spend }))
  const tokenSeries = series.map((p) => ({ x: p.date, y: p.tokensM }))

  const totalSpend = series.reduce((s, p) => s + p.spend, 0)
  const totalTokens = series.reduce((s, p) => s + p.tokensM, 0)

  const totalBudget = data.products.reduce((s, p) => s + p.routing.monthlyBudget, 0)
  const totalActual = data.products.reduce((s, p) => s + p.actualSpend, 0)
  const utilization = (totalActual / totalBudget) * 100

  const providerBars = useMemo(
    () =>
      [...data.providers]
        .sort((a, b) => b.monthlySpend - a.monthlySpend)
        .map((p) => ({ label: p.name, value: Math.round(p.monthlySpend) })),
    [data.providers],
  )

  const productBars = useMemo(
    () =>
      [...data.products]
        .sort((a, b) => b.actualSpend - a.actualSpend)
        .map((p) => ({ label: p.name, value: p.actualSpend })),
    [data.products],
  )

  const anomaly = costAnomaly(data)

  return (
    <div>
      <PageHeader
        title="Cost & Usage"
        description="Spend and token consumption across providers and products."
        actions={
          <CompactSelect
            className="w-36"
            value={rangeDays}
            onChange={(e) => setRangeDays(Number(e.target.value))}
          >
            <option value={30}>Last 30 days</option>
            <option value={60}>Last 60 days</option>
            <option value={90}>Last 90 days</option>
          </CompactSelect>
        }
      />

      <div className="grid grid-cols-4 gap-3.5">
        <StatCard label="Total Spend" value={formatCurrency(totalSpend, { compact: true })} />
        <StatCard
          label="Total Tokens"
          value={totalTokens >= 1000 ? (totalTokens / 1000).toFixed(1) : totalTokens.toFixed(0)}
          suffix={totalTokens >= 1000 ? 'B tokens' : 'M tokens'}
        />
        <StatCard
          label="Budget Utilization"
          value={utilization.toFixed(0)}
          suffix="%"
          delta={utilization > 100 ? 'Over budget' : 'Within budget'}
          deltaDirection={utilization > 100 ? 'up' : 'down'}
          deltaGood={utilization <= 100}
        />
        <StatCard label="Products Tracked" value={data.products.length} suffix={`· ${data.providers.length} providers`} />
      </div>

      <AiNote label="Cost Anomaly" className="mt-3.5">
        <span className="font-medium">{anomaly.headline}.</span> {anomaly.detail}
      </AiNote>

      <div className="mt-5 grid grid-cols-2 items-start gap-3.5">
        <Card>
          <span className="type-subheading">Spend trend</span>
          <div className="mt-2">
            <MiniAreaChart
              data={spendSeries}
              color="#6366F1"
              height={240}
              showAxis
              formatY={(v) => formatCurrency(v, { compact: true })}
            />
          </div>
        </Card>
        <Card>
          <span className="type-subheading">Token usage trend</span>
          <div className="mt-2">
            <MiniAreaChart
              data={tokenSeries}
              color="#22D3EE"
              height={240}
              showAxis
              formatY={(v) => `${v.toFixed(1)}M`}
            />
          </div>
        </Card>
      </div>

      <div className="mt-3.5 grid grid-cols-2 items-start gap-3.5">
        <Card>
          <div className="mb-3 flex items-center justify-between">
            <span className="type-subheading">Spend breakdown</span>
            <div className="flex rounded-md border border-border p-0.5">
              {(['provider', 'product'] as const).map((key) => (
                <button
                  key={key}
                  onClick={() => setBreakdownBy(key)}
                  className={cn(
                    'rounded-[5px] px-2.5 py-1 text-[11px] font-medium capitalize transition-colors',
                    breakdownBy === key ? 'bg-primary-50 text-primary-700' : 'text-ink-muted hover:text-ink-strong',
                  )}
                >
                  {key}
                </button>
              ))}
            </div>
          </div>
          <GradientBarChart
            data={breakdownBy === 'provider' ? providerBars : productBars}
            color={breakdownBy === 'provider' ? '#6366F1' : '#7C3AED'}
            valueFormat={(v) => formatCurrency(v as number, { compact: true })}
          />
        </Card>

        <Card>
          <span className="type-subheading">Budget vs actual (by product)</span>
          <div className="mt-3.5 flex flex-col gap-3">
            {data.products.map((p) => {
              const pct = Math.min(100, (p.actualSpend / p.routing.monthlyBudget) * 100)
              const over = p.actualSpend > p.routing.monthlyBudget
              return (
                <div key={p.id}>
                  <div className="mb-1 flex items-center justify-between text-[11px]">
                    <span className="font-medium text-ink-strong">{p.name}</span>
                    <span className={cn('font-mono', over ? 'text-rose-600' : 'text-ink-muted')}>
                      {formatCurrency(p.actualSpend, { compact: true })} / {formatCurrency(p.routing.monthlyBudget, { compact: true })}
                    </span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-neutral-100">
                    <div
                      className={cn('h-full rounded-full', over ? 'bg-rose-400' : 'bg-primary-500')}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      </div>

      <Card className="mt-3.5">
        <span className="type-subheading">Spend flow — provider to product</span>
        <p className="type-meta mt-0.5">How company spend moves from total, through providers, to the products routing to them.</p>
        <div className="mt-2">
          <SpendSankey providers={data.providers} products={data.products} />
        </div>
      </Card>
    </div>
  )
}
