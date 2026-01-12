'use client'

import { useUser } from '@clerk/nextjs'
import { Role } from '../lib/roles'

export interface CurrentUser {
  id: string
  email: string
  firstName: string | null
  lastName: string | null
  fullName: string
  role: Role | undefined
  imageUrl: string
  isLoaded: boolean
  isSignedIn: boolean
}

export function useCurrentUser(): CurrentUser {
  const { user, isLoaded, isSignedIn } = useUser()

  return {
    id: user?.id ?? '',
    email: user?.primaryEmailAddress?.emailAddress ?? '',
    firstName: user?.firstName ?? null,
    lastName: user?.lastName ?? null,
    fullName: user?.fullName ?? '',
    role: user?.publicMetadata?.role as Role | undefined,
    imageUrl: user?.imageUrl ?? '',
    isLoaded,
    isSignedIn: isSignedIn ?? false,
  }
}
