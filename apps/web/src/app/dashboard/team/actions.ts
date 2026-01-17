'use server'

/**
 * Team Management Server Actions
 *
 * These server actions call Clerk's Backend SDK directly from Next.js.
 *
 * Architecture Decision:
 * - Keep in Next.js Server Actions (not NestJS) because:
 *   1. Operations are Clerk-only (no local database needed)
 *   2. Simple CRUD with no complex business logic
 *   3. Reduces latency (no extra network hop to NestJS)
 *
 * - Move to NestJS (apps/api/) when:
 *   1. You need to sync Clerk users to your local database
 *   2. You need webhooks (Clerk → your API)
 *   3. Complex business logic combining Clerk + your data
 *   4. Multiple clients need the same API (mobile app, etc.)
 *
 * Types:
 * - Uses Clerk's built-in User and Invitation types from @clerk/backend
 * - Custom publicMetadata fields (role, invitedBy, invitedAt) are typed via
 *   global type augmentation in src/types/clerk.d.ts
 */

import { auth, clerkClient } from '@clerk/nextjs/server'
import { Role, ROLES } from '@/shared/lib/roles'
import { validateInviteEmail } from '@/shared/lib/validation'
import { TeamUser, TeamInvitation } from './types'

async function requireAdmin() {
  const { userId } = await auth()
  if (!userId) {
    throw new Error('Unauthorized: You must be signed in')
  }

  const client = await clerkClient()
  const user = await client.users.getUser(userId)

  if (user.publicMetadata?.role !== ROLES.ADMIN) {
    throw new Error('Forbidden: Admin access required')
  }

  return { userId, client }
}

export async function inviteUser(email: string, role: Role) {
  const { userId, client } = await requireAdmin()

  const validation = validateInviteEmail(email)
  if (!validation.valid) {
    throw new Error(validation.error ?? 'Invalid email')
  }

  if (!Object.values(ROLES).includes(role)) {
    throw new Error('Invalid role')
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3500'

  const invitation = await client.invitations.createInvitation({
    emailAddress: email.toLowerCase().trim(),
    publicMetadata: {
      role,
      invitedBy: userId,
      invitedAt: new Date().toISOString(),
    },
    redirectUrl: `${baseUrl}/auth/sign-up`,
  })

  return {
    id: invitation.id,
    emailAddress: invitation.emailAddress,
    status: invitation.status,
  }
}

export async function listUsers(): Promise<TeamUser[]> {
  const { client } = await requireAdmin()

  const usersResponse = await client.users.getUserList({ limit: 100 })

  // Map Clerk User objects to plain objects for serialization
  return usersResponse.data.map((user) => ({
    id: user.id,
    email: user.primaryEmailAddress?.emailAddress ?? '',
    firstName: user.firstName,
    lastName: user.lastName,
    fullName: user.fullName,
    imageUrl: user.imageUrl,
    role: user.publicMetadata?.role as Role | undefined,
    invitedBy: user.publicMetadata?.invitedBy as string | undefined,
    invitedAt: user.publicMetadata?.invitedAt as string | undefined,
    lastSignInAt: user.lastSignInAt,
    createdAt: user.createdAt,
  }))
}

export async function listInvitations(): Promise<TeamInvitation[]> {
  const { client } = await requireAdmin()

  const invitationsResponse = await client.invitations.getInvitationList({
    status: 'pending',
  })

  // Map Clerk Invitation objects to plain objects for serialization
  return invitationsResponse.data.map((invitation) => ({
    id: invitation.id,
    emailAddress: invitation.emailAddress,
    status: invitation.status,
    role: invitation.publicMetadata?.role as Role | undefined,
    invitedBy: invitation.publicMetadata?.invitedBy as string | undefined,
    invitedAt: invitation.publicMetadata?.invitedAt as string | undefined,
    createdAt: invitation.createdAt,
  }))
}

export async function updateUserRole(userId: string, newRole: Role) {
  const { userId: adminUserId, client } = await requireAdmin()

  if (!userId) {
    throw new Error('User ID is required')
  }

  if (!Object.values(ROLES).includes(newRole)) {
    throw new Error('Invalid role')
  }

  if (userId === adminUserId && newRole !== ROLES.ADMIN) {
    throw new Error('You cannot change your own role')
  }

  await client.users.updateUserMetadata(userId, {
    publicMetadata: { role: newRole },
  })

  return { success: true }
}

export async function removeUser(userId: string) {
  const { userId: adminUserId, client } = await requireAdmin()

  if (!userId) {
    throw new Error('User ID is required')
  }

  if (userId === adminUserId) {
    throw new Error('You cannot remove yourself')
  }

  await client.users.deleteUser(userId)

  return { success: true }
}

export async function revokeInvitation(invitationId: string) {
  const { client } = await requireAdmin()

  if (!invitationId) {
    throw new Error('Invitation ID is required')
  }

  await client.invitations.revokeInvitation(invitationId)

  return { success: true }
}
