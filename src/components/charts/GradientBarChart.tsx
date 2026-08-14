import { ResponsiveBar } from '@nivo/bar'

interface BarDatum {
  label: string
  value: number
  [key: string]: string | number
}

export function GradientBarChart({
  data,
  color = '#6366F1',
  height = 260,
  valueFormat,
}: {
  data: BarDatum[]
  color?: string
  height?: number
  valueFormat?: (v: number) => string
}) {
  const gradientId = `bar-gradient-${color.replace('#', '')}`
  return (
    <div style={{ height }}>
      <ResponsiveBar
        data={data}
        keys={['value']}
        indexBy="label"
        layout="horizontal"
        margin={{ top: 4, right: 24, bottom: 24, left: 100 }}
        padding={0.35}
        valueScale={{ type: 'linear' }}
        colors={[color]}
        borderRadius={3}
        enableGridY={false}
        enableGridX
        gridXValues={4}
        axisTop={null}
        axisRight={null}
        axisLeft={{ tickSize: 0, tickPadding: 8 }}
        axisBottom={{ tickSize: 0, tickPadding: 6, tickValues: 4 }}
        enableLabel={false}
        theme={{
          grid: { line: { stroke: '#F1F5F9', strokeWidth: 1 } },
          axis: {
            ticks: { text: { fontSize: 9, fill: '#94A3B8', fontFamily: 'Inter' } },
          },
          tooltip: {
            container: {
              fontSize: 11,
              borderRadius: 8,
              border: '1px solid #F1F5F9',
              boxShadow: '0 4px 12px rgb(15 23 42 / 0.08)',
            },
          },
        }}
        defs={[
          {
            id: gradientId,
            type: 'linearGradient',
            colors: [
              { offset: 0, color, opacity: 0.35 },
              { offset: 100, color, opacity: 1 },
            ],
          },
        ]}
        fill={[{ match: '*', id: gradientId }]}
        tooltip={({ indexValue, value }) => (
          <div className="rounded-lg border border-hairline-soft bg-white px-2.5 py-1.5 text-[11px] shadow-soft">
            <div className="text-ink-faint">{String(indexValue)}</div>
            <div className="font-medium text-ink-strong">{valueFormat ? valueFormat(value) : value}</div>
          </div>
        )}
        animate={false}
      />
    </div>
  )
}
