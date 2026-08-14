export function TableTotalCount({ count, noun }: { count: number; noun: string }) {
  return (
    <div className="mb-3 type-count">
      {count.toLocaleString()} <span className="font-medium text-ink-muted">{noun}</span>
    </div>
  )
}
