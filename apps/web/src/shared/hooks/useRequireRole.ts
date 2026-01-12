'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useCurrentUser } from './useCurrentUser'
import { Role, ROLES } from '../lib/roles'

interface UseRequireRoleResult {
  hasAccess: boolean
  isLoading: boolean
}

export function useRequireRole(
  requiredRole: Role | Role[],
  redirectTo = '/dashboard'
): UseRequireRoleResult {
  const router = useRouter()
  const { role, isLoaded, isSignedIn } = useCurrentUser()

  const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole]
  const hasAccess = Boolean(role && roles.includes(role))
  const isLoading = !isLoaded

  useEffect(() => {
    if (!isLoaded) return
    if (!isSignedIn) return
    if (hasAccess) return

    router.push(redirectTo)
  }, [isLoaded, isSignedIn, hasAccess, router, redirectTo])

  return { hasAccess, isLoading }
}

export function useRequireAdmin(redirectTo = '/dashboard'): UseRequireRoleResult {
  return useRequireRole(ROLES.ADMIN, redirectTo)
}
