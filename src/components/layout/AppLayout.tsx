import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="sticky top-0 z-40 flex h-14 border-b border-hairline bg-white">
        <Link
          to="/"
          className="flex w-[210px] shrink-0 items-center gap-2 border-r border-hairline px-5"
        >
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary-500 text-[11px] font-bold text-white">
            S
          </div>
          <span className="font-display text-[14px] font-semibold text-ink-em">Switchboard</span>
        </Link>
        <div className="flex-1">
          <TopBar />
        </div>
      </header>

      <div className="flex">
        <aside className="sticky top-14 h-[calc(100vh-56px)] w-[210px] shrink-0 border-r border-hairline bg-white">
          <Sidebar />
        </aside>
        <main className="min-w-0 flex-1">
          <div className="mx-auto max-w-content px-8 pb-16 pt-[100px] md:px-10">{children}</div>
        </main>
      </div>
    </div>
  )
}
