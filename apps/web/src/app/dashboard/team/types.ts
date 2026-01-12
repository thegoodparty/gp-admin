import { Role } from '@/shared/lib/roles'

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

export interface TeamInvitation {
  id: string
  emailAddress: string
  status: string
  role: Role | undefined
  invitedBy: string | undefined
  invitedAt: string | undefined
  createdAt: number
}
