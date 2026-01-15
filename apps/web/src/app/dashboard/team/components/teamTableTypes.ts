import { Role } from '@/shared/lib/roles'

export type TeamMember = {
  id: string
  type: 'user' | 'invitation'
  email: string
  name: string
  imageUrl?: string
  role: Role | undefined
  status: 'active' | 'pending'
  lastSignInAt: number | null
  invitedBy: string | undefined
  invitedAt: string | undefined
  createdAt: number
}
