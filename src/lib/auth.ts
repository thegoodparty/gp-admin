import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import type { Permission } from '@/lib/permissions'

const DEFAULT_REDIRECT = '/dashboard/users'

export async function canAccess(
  permission: Permission,
  redirectTo = DEFAULT_REDIRECT
) {
  const session = await auth()
  const { has, orgId } = session

  if (!has?.({ permission }) || !orgId) {
    redirect(redirectTo)
  }

  return session
}
