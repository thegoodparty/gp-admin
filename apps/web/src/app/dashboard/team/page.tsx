import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { auth, clerkClient } from '@clerk/nextjs/server'
import { listUsers, listInvitations } from './actions'
import { TeamPage } from './components/TeamPage'
import { Role, ROLES } from '@/shared/lib/roles'

export const metadata: Metadata = {
  title: 'Team Management | GP Admin',
  description: 'Manage team members and invitations',
}

export default async function Page() {
  const { userId } = await auth()

  if (!userId) {
    return redirect('/auth/sign-in')
  }

  const client = await clerkClient()
  const user = await client.users.getUser(userId)
  const role = user.publicMetadata?.role as Role | undefined

  if (role !== ROLES.ADMIN) {
    return redirect('/dashboard')
  }

  const [users, invitations] = await Promise.all([
    listUsers(),
    listInvitations(),
  ])

  const childProps = {
    initialUsers: users,
    initialInvitations: invitations,
  }

  return <TeamPage {...childProps} />
}
