import { useEffect, useRef, useState } from 'react'
import ReactECharts from 'echarts-for-react'
import type { Product, Provider } from '../../types'
import { formatCurrency } from '../../lib/utils'

const NODE_COLORS = ['#6366F1', '#818CF8', '#22D3EE', '#7C3AED', '#A5B4FC', '#67E8F9']

export function SpendSankey({
  providers,
  products,
  height = 420,
}: {
  providers: Provider[]
  products: Product[]
  height?: number
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(0)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const observer = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width
      if (w) setWidth(Math.floor(w))
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const providerNodes = providers.filter((p) => p.monthlySpend > 0).map((p) => ({ name: p.name }))
  const productNodes = products.map((p) => ({ name: p.name }))
  const nodes = [{ name: 'Total spend' }, ...providerNodes, ...productNodes]

  const links: { source: string; target: string; value: number }[] = []

  for (const provider of providers) {
    if (provider.monthlySpend > 0) {
      links.push({ source: 'Total spend', target: provider.name, value: Math.round(provider.monthlySpend) })
    }
  }

  for (const product of products) {
    const chain = [product.routing.primaryProviderId, ...product.routing.fallbackChain.map((f) => f.providerId)]
    const weights = chain.map((_, i) => (i === 0 ? 0.78 : 0.22 / Math.max(1, chain.length - 1)))
    chain.forEach((providerId, i) => {
      const provider = providers.find((p) => p.id === providerId)
      if (!provider) return
      links.push({
        source: provider.name,
        target: product.name,
        value: Math.round(product.actualSpend * weights[i]),
      })
    })
  }

  const option = {
    color: NODE_COLORS,
    tooltip: {
      trigger: 'item',
      triggerOn: 'mousemove',
      textStyle: { fontSize: 11 },
      formatter: (params: { dataType: string; name?: string; data?: { source: string; target: string; value: number } }) => {
        if (params.dataType === 'edge' && params.data) {
          return `${params.data.source} → ${params.data.target}<br/><strong>${formatCurrency(params.data.value)}</strong>`
        }
        return params.name ?? ''
      },
    },
    series: [
      {
        type: 'sankey',
        data: nodes,
        links,
        emphasis: { focus: 'adjacency' },
        nodeWidth: 12,
        nodeGap: 8,
        layoutIterations: 32,
        label: {
          fontSize: 10,
          fontFamily: 'Inter',
          color: '#475569',
        },
        lineStyle: { color: 'source', opacity: 0.22, curveness: 0.5 },
        itemStyle: { borderWidth: 0 },
      },
    ],
  }

  return (
    <div ref={containerRef} style={{ width: '100%', height }}>
      {width > 0 && (
        <ReactECharts
          option={option}
          opts={{ renderer: 'svg', width, height }}
          style={{ height, width }}
          notMerge
          lazyUpdate
        />
      )}
    </div>
  )
}
