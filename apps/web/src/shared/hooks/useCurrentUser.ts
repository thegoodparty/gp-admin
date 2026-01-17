'use client'

import { useUser } from '@clerk/nextjs'

/**
 * Hook to access the current user with typed publicMetadata.
 *
 * This hook wraps Clerk's useUser() and provides convenient access to
 * commonly used properties. The publicMetadata fields (role, invitedBy, invitedAt)
 * are typed via global augmentation in src/types/clerk.d.ts.
 *
 * For full access to the Clerk user object, use useUser() directly.
 */
export function useCurrentUser() {
  const { user, isLoaded, isSignedIn } = useUser()

  return {
    id: user?.id ?? '',
    email: user?.primaryEmailAddress?.emailAddress ?? '',
    firstName: user?.firstName ?? null,
    lastName: user?.lastName ?? null,
    fullName: user?.fullName ?? '',
    role: user?.publicMetadata?.role,
    imageUrl: user?.imageUrl ?? '',
    isLoaded,
    isSignedIn: isSignedIn ?? false,
  }
}
