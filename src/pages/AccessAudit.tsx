import { UserPlus } from 'lucide-react'
import { PageHeader } from '../components/ui/PageHeader'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { TableTotalCount } from '../components/ui/TableTotalCount'
import { Pagination, usePagination } from '../components/ui/Pagination'
import { DataGrid, type DataGridColumn } from '../components/ui/DataGrid'
import { useSeed } from '../context/SeedContext'
import { useRole } from '../context/RoleContext'
import { formatDateTime, relativeTime } from '../lib/utils'
import type { AuditLogEntry, Person } from '../types'

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

  const peopleColumns: DataGridColumn<Person>[] = [
    {
      key: 'name',
      label: 'Name',
      render: (p) => {
        const initials = p.name.split(' ').map((n) => n[0]).slice(0, 2).join('')
        return (
          <div className="flex items-center gap-2.5">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-50 font-mono text-[9px] font-semibold text-primary-700">
              {initials}
            </span>
            <div>
              <div className="cell-name">{p.name}</div>
              <div className="text-[10px] text-ink-faint">{p.email}</div>
            </div>
          </div>
        )
      },
    },
    {
      key: 'role',
      label: 'Role',
      render: (p) => <Badge tone={ROLE_TONE[p.role] ?? 'neutral'}>{p.role}</Badge>,
    },
    {
      key: 'products',
      label: 'Products',
      render: (p) => (
        <div className="flex flex-wrap gap-1">
          {p.products.slice(0, 2).map((pid) => (
            <span
              key={pid}
              className="rounded-full border border-hairline bg-neutral-50 px-1.5 py-[1px] text-[9px] text-ink-muted"
            >
              {productById.get(pid)?.name}
            </span>
          ))}
          {p.products.length > 2 && <span className="text-[9px] text-ink-faint">+{p.products.length - 2}</span>}
        </div>
      ),
    },
    {
      key: 'lastActive',
      label: 'Last Active',
      cellClassName: 'cell-mono',
      render: (p) => relativeTime(p.lastActiveIso),
    },
    {
      key: 'status',
      label: 'Status',
      render: (p) => (
        <Badge tone={p.status === 'active' ? 'success' : p.status === 'invited' ? 'warning' : 'danger'} dot>
          <span className="capitalize">{p.status}</span>
        </Badge>
      ),
    },
  ]

  const auditColumns: DataGridColumn<AuditLogEntry>[] = [
    {
      key: 'actor',
      label: 'Actor',
      cellClassName: 'cell-name',
      render: (entry) => peopleById.get(entry.actorId)?.name ?? 'Unknown',
    },
    { key: 'action', label: 'Action', render: (entry) => entry.action },
    { key: 'target', label: 'Target', cellClassName: 'cell-id', render: (entry) => entry.target },
    { key: 'detail', label: 'Detail', cellClassName: 'cell-faint', render: (entry) => entry.detail },
    {
      key: 'timestamp',
      label: 'Timestamp',
      cellClassName: 'cell-mono',
      render: (entry) => formatDateTime(entry.timestampIso),
    },
  ]

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
          <DataGrid columns={peopleColumns} rows={people.pageItems} rowKey={(p) => p.id} />
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
          <DataGrid columns={auditColumns} rows={audit.pageItems} rowKey={(entry) => entry.id} />
        </div>
        <div className="p-5 pt-3">
          <Pagination {...audit} noun="audit events" />
        </div>
      </Card>
    </div>
  )
}
