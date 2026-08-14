import { useEffect, useState } from 'react'
import { Search, Calendar } from 'lucide-react'
import { useRole } from '../../context/RoleContext'

function useClock() {
  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30_000)
    return () => clearInterval(id)
  }, [])
  return now
}

function greetingFor(hour: number) {
  if (hour < 12) return 'Good Morning'
  if (hour < 18) return 'Good Afternoon'
  return 'Good Evening'
}

export function TopBar() {
  const { currentPerson } = useRole()
  const now = useClock()
  const firstName = currentPerson.name.split(' ')[0]

  const dateStr = new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric' }).format(now)
  const timeStr = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' }).format(now)

  return (
    <div className="flex h-full items-center justify-between gap-4 px-6">
      <div className="min-w-0 shrink-0">
        <span className="text-[13px] font-medium text-ink-strong">
          {greetingFor(now.getHours())}, {firstName}
        </span>
      </div>

      <div className="flex w-full max-w-md items-center gap-2 rounded-md border border-border bg-neutral-50 px-3 h-8">
        <Search size={13} className="text-ink-soft" />
        <input
          type="text"
          placeholder="Search providers, models, products…"
          className="h-full w-full bg-transparent text-[11px] text-ink placeholder:text-ink-faint focus:outline-none"
        />
      </div>

      <div className="flex shrink-0 items-center gap-1.5 rounded-full border border-border bg-white px-3 py-1.5 text-[11px] text-ink-muted">
        <Calendar size={12} className="text-ink-soft" />
        <span>{dateStr}</span>
        <span className="text-ink-faint">·</span>
        <span className="font-mono">{timeStr}</span>
      </div>
    </div>
  )
}
