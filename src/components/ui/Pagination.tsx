import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, ChevronUp, ChevronDown } from 'lucide-react'
import { cn } from '../../lib/utils'

const PAGE_SIZES = [10, 20, 50]

export function usePagination<T>(items: T[], initialPageSize = 10) {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(initialPageSize)

  const pageCount = Math.max(1, Math.ceil(items.length / pageSize))
  const safePage = Math.min(page, pageCount)
  const from = items.length === 0 ? 0 : (safePage - 1) * pageSize + 1
  const to = Math.min(safePage * pageSize, items.length)

  const pageItems = useMemo(
    () => items.slice((safePage - 1) * pageSize, safePage * pageSize),
    [items, safePage, pageSize],
  )

  return {
    page: safePage,
    setPage,
    pageSize,
    setPageSize,
    pageCount,
    from,
    to,
    total: items.length,
    pageItems,
  }
}

export function Pagination({
  page,
  setPage,
  pageSize,
  setPageSize,
  pageCount,
  from,
  to,
  total,
  noun,
}: {
  page: number
  setPage: (p: number) => void
  pageSize: number
  setPageSize: (n: number) => void
  pageCount: number
  from: number
  to: number
  total: number
  noun: string
}) {
  if (total === 0) return null

  const sizeIndex = PAGE_SIZES.indexOf(pageSize)
  const stepSize = (dir: 1 | -1) => {
    const idx = sizeIndex === -1 ? 0 : sizeIndex
    const next = PAGE_SIZES[Math.min(Math.max(idx + dir, 0), PAGE_SIZES.length - 1)]
    setPageSize(next)
    setPage(1)
  }

  return (
    <div className="flex items-center justify-between border-t border-hairline pt-3">
      <div className="text-[11px] text-ink-muted">
        Showing {from}–{to} of {total} {noun}
      </div>
      <div className="flex items-center gap-2">
        <div className="flex items-center overflow-hidden rounded-md border border-border">
          <span className="px-2 text-[11px] text-ink-strong">{pageSize}</span>
          <div className="flex flex-col border-l border-border">
            <button
              onClick={() => stepSize(-1)}
              className="flex h-[13px] w-5 items-center justify-center text-ink-soft hover:text-ink-strong"
              aria-label="Fewer per page"
            >
              <ChevronUp size={8} />
            </button>
            <button
              onClick={() => stepSize(1)}
              className="flex h-[13px] w-5 items-center justify-center border-t border-border text-ink-soft hover:text-ink-strong"
              aria-label="More per page"
            >
              <ChevronDown size={8} />
            </button>
          </div>
        </div>
        <span className="text-[11px] text-ink-muted">per page</span>

        <button
          onClick={() => setPage(Math.max(1, page - 1))}
          disabled={page <= 1}
          className="flex h-6 w-6 items-center justify-center rounded-md border border-border text-ink-soft hover:text-ink-strong disabled:opacity-40"
          aria-label="Previous page"
        >
          <ChevronLeft size={13} />
        </button>
        <span
          className={cn(
            'flex h-6 min-w-6 items-center justify-center rounded-md border border-primary-200 bg-primary-50 px-1.5 text-[11px] font-medium text-primary-700',
          )}
        >
          {page}
        </span>
        <span className="text-[11px] text-ink-muted">of {pageCount}</span>
        <button
          onClick={() => setPage(Math.min(pageCount, page + 1))}
          disabled={page >= pageCount}
          className="flex h-6 w-6 items-center justify-center rounded-md border border-border text-ink-soft hover:text-ink-strong disabled:opacity-40"
          aria-label="Next page"
        >
          <ChevronRight size={13} />
        </button>
      </div>
    </div>
  )
}
