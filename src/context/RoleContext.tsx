import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { UserRole } from '../types'

export const BUILT_ROLES: UserRole[] = ['Product Admin', 'Lead Developer']
export const ALL_ROLES: UserRole[] = ['Product Admin', 'Lead Developer', 'Super Admin', 'Product Developer']

interface RoleContextValue {
  role: UserRole
  setRole: (role: UserRole) => void
  isBuiltRole: boolean
  currentPerson: { name: string; email: string }
}

const RoleContext = createContext<RoleContextValue | null>(null)

const PERSON_BY_ROLE: Record<UserRole, { name: string; email: string }> = {
  'Product Admin': { name: 'Priya Nandakumar', email: 'priya.n@company.com' },
  'Lead Developer': { name: 'Wei Zhang', email: 'wei.z@company.com' },
  'Super Admin': { name: 'Jordan Ashby', email: 'jordan.a@company.com' },
  'Product Developer': { name: 'Sam Ostrowski', email: 'sam.o@company.com' },
}

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<UserRole>('Product Admin')

  const value = useMemo<RoleContextValue>(
    () => ({
      role,
      setRole,
      isBuiltRole: BUILT_ROLES.includes(role),
      currentPerson: PERSON_BY_ROLE[role],
    }),
    [role],
  )

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>
}

export function useRole() {
  const ctx = useContext(RoleContext)
  if (!ctx) throw new Error('useRole must be used within RoleProvider')
  return ctx
}
