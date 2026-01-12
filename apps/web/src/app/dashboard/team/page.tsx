import { Metadata } from 'next'
import { listUsers, listInvitations } from './actions'
import { TeamPage } from './components/TeamPage'

export const metadata: Metadata = {
  title: 'Team Management | GP Admin',
  description: 'Manage team members and invitations',
}

export default async function Page() {
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
