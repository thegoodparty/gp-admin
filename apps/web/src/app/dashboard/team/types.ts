import { Role } from '@/shared/lib/roles'

/**
 * Serializable team user type for passing from Server to Client Components.
 * Maps from Clerk's User class to a plain object.
 */
export interface TeamUser {
  id: string
  email: string
  firstName: string | null
  lastName: string | null
  fullName: string | null
  imageUrl: string
  role: Role | undefined
  invitedBy: string | undefined
  invitedAt: string | undefined
  lastSignInAt: number | null
  createdAt: number
}

/**
 * Serializable team invitation type for passing from Server to Client Components.
 * Maps from Clerk's Invitation class to a plain object.
 */
export interface TeamInvitation {
  id: string
  emailAddress: string
  status: string
  role: Role | undefined
  invitedBy: string | undefined
  invitedAt: string | undefined
  createdAt: number
}
