import { useMemo, useState } from 'react'
import { PageHeader } from '../components/ui/PageHeader'
import { TableTotalCount } from '../components/ui/TableTotalCount'
import { Pagination, usePagination } from '../components/ui/Pagination'
import { StatusBadge } from '../components/ui/Badge'
import { SearchInput, CompactSelect } from '../components/ui/Input'
import { Card } from '../components/ui/Card'
import { AiNote } from '../components/ai/AiNote'
import { useSeed } from '../context/SeedContext'
import { providerSuggestion } from '../lib/ai'
import { formatNumber } from '../lib/utils'
import type { Capability } from '../types'

const CAPABILITY_LABEL: Record<Capability, string> = {
  'text-generation': 'Text',
  vision: 'Vision',
  'function-calling': 'Tools',
  embeddings: 'Embeddings',
  code: 'Code',
  'long-context': 'Long context',
  'fine-tuning': 'Fine-tuning',
  audio: 'Audio',
}

interface Row {
  key: string
  providerId: string
  providerName: string
  initials: string
  modelName: string
  capabilities: Capability[]
  contextWindow: number
  priceIn: number
  priceOut: number
  rateLimitRpm: number
  status: string
}

export default function ProviderCatalog() {
  const { data } = useSeed()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [capabilityFilter, setCapabilityFilter] = useState('all')

  const providerById = new Map(data.providers.map((p) => [p.id, p]))

  const rows: Row[] = useMemo(
    () =>
      data.models.map((m) => {
        const provider = providerById.get(m.providerId)!
        return {
          key: m.id,
          providerId: provider.id,
          providerName: provider.name,
          initials: provider.initials,
          modelName: m.name,
          capabilities: m.capabilities,
          contextWindow: m.contextWindow,
          priceIn: m.priceIn,
          priceOut: m.priceOut,
          rateLimitRpm: m.rateLimitRpm,
          status: m.status,
        }
      }),
    [data],
  )

  const filtered = rows.filter((r) => {
    const matchesSearch =
      !search ||
      r.providerName.toLowerCase().includes(search.toLowerCase()) ||
      r.modelName.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter
    const matchesCapability = capabilityFilter === 'all' || r.capabilities.includes(capabilityFilter as Capability)
    return matchesSearch && matchesStatus && matchesCapability
  })

  const { page, setPage, pageSize, setPageSize, pageCount, from, to, total, pageItems } = usePagination(filtered, 10)

  const suggestion = providerSuggestion(data)

  return (
    <div>
      <PageHeader
        title="Provider Catalog"
        description="Every connected provider and model, with pricing, limits, and live status."
      />

      {suggestion && (
        <AiNote label="Provider Suggestion" className="mb-4">
          <span className="font-medium">{suggestion.headline}.</span> {suggestion.detail}
        </AiNote>
      )}

      <Card className="p-0">
        <div className="p-5 pb-0">
          <TableTotalCount count={total} noun="models across 8 providers" />
          <div className="mb-4 flex items-center gap-2">
            <SearchInput
              placeholder="Search provider or model…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-64"
            />
            <CompactSelect
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value)
                setPage(1)
              }}
              className="w-36"
            >
              <option value="all">All statuses</option>
              <option value="operational">Operational</option>
              <option value="degraded">Degraded</option>
              <option value="outage">Outage</option>
            </CompactSelect>
            <CompactSelect
              value={capabilityFilter}
              onChange={(e) => {
                setCapabilityFilter(e.target.value)
                setPage(1)
              }}
              className="w-40"
            >
              <option value="all">All capabilities</option>
              {Object.entries(CAPABILITY_LABEL).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </CompactSelect>
          </div>
        </div>

        <div className="overflow-x-auto px-5">
          <table className="data-grid">
            <thead>
              <tr>
                <th>Provider</th>
                <th>Model</th>
                <th>Capabilities</th>
                <th className="cell-num">Context</th>
                <th className="cell-num">Price in / out (1M)</th>
                <th className="cell-num">Rate limit</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {pageItems.map((r) => (
                <tr key={r.key}>
                  <td>
                    <div className="flex items-center gap-2">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary-50 font-mono text-[8px] font-semibold text-primary-700">
                        {r.initials}
                      </span>
                      <span className="cell-name">{r.providerName}</span>
                    </div>
                  </td>
                  <td className="cell-id cell-mono">{r.modelName}</td>
                  <td>
                    <div className="flex flex-wrap gap-1">
                      {r.capabilities.slice(0, 3).map((c) => (
                        <span
                          key={c}
                          className="rounded-full border border-hairline bg-neutral-50 px-1.5 py-[1px] text-[9px] text-ink-muted"
                        >
                          {CAPABILITY_LABEL[c]}
                        </span>
                      ))}
                      {r.capabilities.length > 3 && (
                        <span className="text-[9px] text-ink-faint">+{r.capabilities.length - 3}</span>
                      )}
                    </div>
                  </td>
                  <td className="cell-num cell-mono">{formatNumber(r.contextWindow, { compact: true })}</td>
                  <td className="cell-num cell-mono cell-amount">
                    ${r.priceIn.toFixed(2)} / ${r.priceOut.toFixed(2)}
                  </td>
                  <td className="cell-num cell-mono">{formatNumber(r.rateLimitRpm, { compact: true })} rpm</td>
                  <td>
                    <StatusBadge status={r.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-5 pt-3">
          <Pagination
            page={page}
            setPage={setPage}
            pageSize={pageSize}
            setPageSize={setPageSize}
            pageCount={pageCount}
            from={from}
            to={to}
            total={total}
            noun="models"
          />
        </div>
      </Card>
    </div>
  )
}
