import { UserPlus } from 'lucide-react'
import { PageHeader } from '../components/ui/PageHeader'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { TableTotalCount } from '../components/ui/TableTotalCount'
import { Pagination, usePagination } from '../components/ui/Pagination'
import { useSeed } from '../context/SeedContext'
import { useRole } from '../context/RoleContext'
import { formatDateTime, relativeTime } from '../lib/utils'

const ROLE_TONE: Record<string, 'primary' | 'neutral'> = {
  'Product Admin': 'primary',
  'Lead Developer': 'neutral',
}

export default function AccessAudit() {
  const { data } = useSeed()
  const { role } = useRole()
  const canInvite = role === 'Product Admin'

  const productById = new Map(data.products.map((p) => [p.id, p]))

  const people = usePagination(data.people, 8)
  const audit = usePagination(data.auditLog, 8)

  const peopleById = new Map(data.people.map((p) => [p.id, p]))

  return (
    <div>
      <PageHeader
        title="Access & Audit"
        description="Who has access to what, and a running log of every configuration change."
        actions={
          canInvite ? (
            <Button size="sm">
              <UserPlus size={13} /> Invite teammate
            </Button>
          ) : (
            <span className="text-[11px] text-ink-faint">Only Product Admins can invite teammates</span>
          )
        }
      />

      <Card className="p-0">
        <div className="p-5 pb-0">
          <TableTotalCount count={data.people.length} noun="team members" />
        </div>
        <div className="overflow-x-auto px-5">
          <table className="data-grid">
            <thead>
              <tr>
                <th>Name</th>
                <th>Role</th>
                <th>Products</th>
                <th>Last Active</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {people.pageItems.map((p) => {
                const initials = p.name.split(' ').map((n) => n[0]).slice(0, 2).join('')
                return (
                  <tr key={p.id}>
                    <td>
                      <div className="flex items-center gap-2.5">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-50 font-mono text-[9px] font-semibold text-primary-700">
                          {initials}
                        </span>
                        <div>
                          <div className="cell-name">{p.name}</div>
                          <div className="text-[10px] text-ink-faint">{p.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <Badge tone={ROLE_TONE[p.role] ?? 'neutral'}>{p.role}</Badge>
                    </td>
                    <td>
                      <div className="flex flex-wrap gap-1">
                        {p.products.slice(0, 2).map((pid) => (
                          <span
                            key={pid}
                            className="rounded-full border border-hairline bg-neutral-50 px-1.5 py-[1px] text-[9px] text-ink-muted"
                          >
                            {productById.get(pid)?.name}
                          </span>
                        ))}
                        {p.products.length > 2 && (
                          <span className="text-[9px] text-ink-faint">+{p.products.length - 2}</span>
                        )}
                      </div>
                    </td>
                    <td className="cell-mono">{relativeTime(p.lastActiveIso)}</td>
                    <td>
                      <Badge tone={p.status === 'active' ? 'success' : p.status === 'invited' ? 'warning' : 'danger'} dot>
                        <span className="capitalize">{p.status}</span>
                      </Badge>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <div className="p-5 pt-3">
          <Pagination {...people} noun="team members" />
        </div>
      </Card>

      <Card className="mt-4 p-0">
        <div className="p-5 pb-0">
          <TableTotalCount count={data.auditLog.length} noun="audit events" />
        </div>
        <div className="overflow-x-auto px-5">
          <table className="data-grid">
            <thead>
              <tr>
                <th>Actor</th>
                <th>Action</th>
                <th>Target</th>
                <th>Detail</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {audit.pageItems.map((entry) => {
                const actor = peopleById.get(entry.actorId)
                return (
                  <tr key={entry.id}>
                    <td className="cell-name">{actor?.name ?? 'Unknown'}</td>
                    <td>{entry.action}</td>
                    <td className="cell-id">{entry.target}</td>
                    <td className="cell-faint">{entry.detail}</td>
                    <td className="cell-mono">{formatDateTime(entry.timestampIso)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <div className="p-5 pt-3">
          <Pagination {...audit} noun="audit events" />
        </div>
      </Card>
    </div>
  )
}
