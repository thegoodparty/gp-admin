'use client'

import { ReactNode } from 'react'
import { useCurrentUser } from '../hooks/useCurrentUser'
import { Role } from '../lib/roles'

interface RequireRoleProps {
  role: Role | Role[]
  children: ReactNode
  fallback?: ReactNode
  loadingFallback?: ReactNode
}

export function RequireRole({
  role,
  children,
  fallback = null,
  loadingFallback = null,
}: RequireRoleProps) {
  const { role: userRole, isLoaded } = useCurrentUser()

  if (!isLoaded) return <>{loadingFallback}</>

  const roles = Array.isArray(role) ? role : [role]
  const hasAccess = userRole && roles.includes(userRole)

  if (!hasAccess) return <>{fallback}</>

  return <>{children}</>
}
