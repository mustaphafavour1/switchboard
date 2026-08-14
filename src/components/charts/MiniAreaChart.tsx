import { ResponsiveLine } from '@nivo/line'

interface Point {
  x: string
  y: number
}

export function MiniAreaChart({
  data,
  color = '#6366F1',
  height = 120,
  formatY,
  showAxis = false,
}: {
  data: Point[]
  color?: string
  height?: number
  formatY?: (v: number) => string
  showAxis?: boolean
}) {
  const gradientId = `mini-area-${color.replace('#', '')}`
  const desiredTicks = showAxis ? 7 : 5
  const step = Math.max(1, Math.ceil(data.length / desiredTicks))
  const tickValues = data.filter((_, i) => i % step === 0).map((d) => d.x)
  const formatTick = (v: string | number) => {
    const d = new Date(String(v))
    return Number.isNaN(d.getTime()) ? String(v) : `${d.getMonth() + 1}/${d.getDate()}`
  }

  return (
    <div style={{ height }}>
      <ResponsiveLine
        data={[{ id: 'series', data }]}
        margin={showAxis ? { top: 8, right: 16, bottom: 24, left: 44 } : { top: 8, right: 8, bottom: 20, left: 8 }}
        xScale={{ type: 'point' }}
        yScale={{ type: 'linear', min: 'auto', max: 'auto', nice: true }}
        curve="monotoneX"
        enableArea
        areaOpacity={1}
        enablePoints={false}
        enableGridX={false}
        enableGridY={true}
        gridYValues={4}
        axisLeft={
          showAxis
            ? {
                tickSize: 0,
                tickPadding: 8,
                tickValues: 4,
                format: (v) => (formatY ? formatY(Number(v)) : String(v)),
              }
            : null
        }
        axisBottom={{
          tickSize: 0,
          tickPadding: 8,
          tickValues,
          format: formatTick,
        }}
        colors={[color]}
        lineWidth={1.75}
        theme={{
          grid: { line: { stroke: '#F1F5F9', strokeWidth: 1 } },
          axis: {
            ticks: {
              text: { fontSize: 9, fill: '#94A3B8', fontFamily: 'Inter' },
            },
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
              { offset: 0, color, opacity: 0.28 },
              { offset: 100, color, opacity: 0 },
            ],
          },
        ]}
        fill={[{ match: '*', id: gradientId }]}
        useMesh
        animate={false}
        tooltip={({ point }) => (
          <div className="rounded-lg border border-hairline-soft bg-white px-2.5 py-1.5 text-[11px] shadow-soft">
            <div className="text-ink-faint">{String(point.data.x)}</div>
            <div className="font-medium text-ink-strong">
              {formatY ? formatY(Number(point.data.y)) : String(point.data.y)}
            </div>
          </div>
        )}
      />
    </div>
  )
}
