import { useState } from 'react'
import { Check, ChevronDown, RefreshCcw, ShieldCheck, UserCircle2 } from 'lucide-react'
import { PageHeader } from '../components/ui/PageHeader'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { useRole, ALL_ROLES, BUILT_ROLES } from '../context/RoleContext'
import { useSeed } from '../context/SeedContext'
import { cn } from '../lib/utils'
import type { UserRole } from '../types'

const ROLE_DESCRIPTION: Record<UserRole, string> = {
  'Product Admin': 'Configures routing, budgets, and provider connections without touching code.',
  'Lead Developer': 'Owns provider catalog depth, comparisons, and technical integration details.',
  'Super Admin': 'Full workspace control across billing, roles, and every product.',
  'Product Developer': 'Implements against routed models inside a single product.',
}

export default function Settings() {
  const { role, setRole, currentPerson } = useRole()
  const { seed, reseed } = useSeed()
  const [open, setOpen] = useState(false)

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="Settings" description="Workspace preferences, role, and demo data controls." />

      <div className="flex flex-col gap-4">
        <Card>
          <div className="mb-4 flex items-center gap-2">
            <UserCircle2 size={15} className="text-ink-soft" />
            <span className="type-subheading">Role &amp; access</span>
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 font-display text-[13px] font-semibold text-primary-700">
                {currentPerson.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
              </div>
              <div>
                <div className="text-[13px] font-medium text-ink-strong">{currentPerson.name}</div>
                <div className="text-[11px] text-ink-soft">{currentPerson.email}</div>
              </div>
            </div>

            <div className="relative">
              <button
                onClick={() => setOpen((v) => !v)}
                className="flex h-9 items-center gap-2 rounded-md border border-border bg-white px-3 text-[13px] font-medium text-ink-strong hover:bg-neutral-50"
              >
                {role}
                <ChevronDown size={14} className="text-ink-soft" />
              </button>

              {open && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
                  <div className="absolute right-0 top-10 z-20 w-72 rounded-lg border border-hairline bg-white p-1.5 shadow-lg">
                    {ALL_ROLES.map((r) => {
                      const active = r === role
                      const built = BUILT_ROLES.includes(r)
                      return (
                        <button
                          key={r}
                          onClick={() => {
                            setRole(r)
                            setOpen(false)
                          }}
                          className={cn(
                            'flex w-full items-start gap-2 rounded-md px-2.5 py-2 text-left transition-colors',
                            active ? 'bg-primary-50' : 'hover:bg-neutral-50',
                          )}
                        >
                          <div className="mt-[3px] flex h-3.5 w-3.5 shrink-0 items-center justify-center">
                            {active && <Check size={13} className="text-primary-600" />}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className={cn('text-[12px] font-medium', active ? 'text-primary-700' : 'text-ink-strong')}>
                                {r}
                              </span>
                              {!built && (
                                <span className="rounded-full border border-hairline bg-neutral-50 px-1.5 py-[1px] text-[9px] text-ink-faint">
                                  not built
                                </span>
                              )}
                            </div>
                            <p className="mt-0.5 text-[10px] leading-snug text-ink-soft">{ROLE_DESCRIPTION[r]}</p>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </>
              )}
            </div>
          </div>
        </Card>

        <Card>
          <div className="mb-3 flex items-center gap-2">
            <RefreshCcw size={15} className="text-ink-soft" />
            <span className="type-subheading">Demo data</span>
          </div>
          <p className="mb-4 text-[11px] leading-relaxed text-ink-muted">
            Switchboard runs on seeded synthetic data. Reseeding regenerates spend, latency, uptime, and SwitchAI
            insights across the whole console — useful for showing a different demo scenario.
          </p>
          <div className="flex items-center justify-between rounded-md border border-hairline-soft bg-neutral-50 px-3 py-2.5">
            <span className="text-[11px] text-ink-muted">
              Current seed · <span className="font-mono text-ink-strong">{seed}</span>
            </span>
            <Button size="sm" variant="outline" onClick={reseed}>
              <RefreshCcw size={12} /> Reseed demo data
            </Button>
          </div>
        </Card>

        <Card>
          <div className="mb-3 flex items-center gap-2">
            <ShieldCheck size={15} className="text-ink-soft" />
            <span className="type-subheading">Workspace</span>
          </div>
          <div className="flex flex-col divide-y divide-hairline-soft">
            {[
              { label: 'Workspace name', value: 'Acme Corp' },
              { label: 'Timezone', value: 'America/New_York' },
              { label: 'Plan', value: 'Enterprise' },
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between py-2.5 text-[12px]">
                <span className="text-ink-muted">{row.label}</span>
                <span className="font-medium text-ink-strong">{row.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
