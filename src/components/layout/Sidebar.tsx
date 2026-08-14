import { NavLink } from 'react-router-dom'
import { NAV } from '../../lib/nav'
import { useRole } from '../../context/RoleContext'
import { cn } from '../../lib/utils'

export function Sidebar() {
  const { role, currentPerson } = useRole()
  const initials = currentPerson.name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')

  return (
    <div className="flex h-full flex-col">
      <nav className="sidebar-scroll flex-1 overflow-y-auto px-3 py-4">
        {NAV.map((group) => (
          <div key={group.label} className="mb-5">
            <div className="type-eyebrow px-3 pb-1.5">{group.label}</div>
            <div className="flex flex-col gap-0.5">
              {group.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/'}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-[13px] transition-colors',
                      isActive
                        ? 'bg-primary-50 font-semibold text-primary-700'
                        : 'text-ink-strong hover:bg-neutral-50',
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <item.icon size={16} className={isActive ? 'text-primary-600' : 'text-ink-soft'} />
                      <span className="truncate">{item.label}</span>
                      {!item.built && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-neutral-200" />}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>
      <div className="border-t border-hairline p-3">
        <div className="flex items-center gap-2.5 rounded-lg px-2 py-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-100 font-display text-[11px] font-semibold text-primary-700">
            {initials}
          </div>
          <div className="min-w-0">
            <div className="truncate text-[12px] font-medium text-ink-strong">{currentPerson.name}</div>
            <div className="truncate text-[10px] text-ink-soft">{role}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
