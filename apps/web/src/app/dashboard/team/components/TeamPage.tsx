'use client'

import { useState } from 'react'
import { Button, PlusIcon } from '@/shared/components/ui'
import { useRequireAdmin } from '@/shared/hooks'
import { TeamUser, TeamInvitation } from '../types'
import { TeamTable } from './TeamTable'
import { InviteDialog } from './InviteDialog'

interface TeamPageProps {
  initialUsers: TeamUser[]
  initialInvitations: TeamInvitation[]
}

export function TeamPage({ initialUsers, initialInvitations }: TeamPageProps) {
  const { hasAccess, isLoading } = useRequireAdmin()
  const [users, setUsers] = useState(initialUsers)
  const [invitations, setInvitations] = useState(initialInvitations)
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false)

  const handleRefresh = async () => {
    const { listUsers, listInvitations } = await import('../actions')
    const [newUsers, newInvitations] = await Promise.all([
      listUsers(),
      listInvitations(),
    ])
    setUsers(newUsers)
    setInvitations(newInvitations)
  }

  const handleOpenInviteDialog = () => {
    setIsInviteDialogOpen(true)
  }

  const handleCloseInviteDialog = () => {
    setIsInviteDialogOpen(false)
  }

  const handleInviteSuccess = () => {
    handleCloseInviteDialog()
    handleRefresh()
  }

  if (isLoading) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '256px',
        }}
      >
        <div style={{ color: '#6b7280' }}>Loading...</div>
      </div>
    )
  }

  if (!hasAccess) {
    return null
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <h1
            style={{
              fontSize: '24px',
              fontWeight: 'bold',
              letterSpacing: '-0.025em',
              margin: 0,
            }}
          >
            Team Management
          </h1>
          <p style={{ color: '#6b7280', margin: '4px 0 0 0' }}>
            Manage team members and send invitations
          </p>
        </div>
        <Button onClick={handleOpenInviteDialog}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px 8px 8px',
            }}
          >
            <PlusIcon size={16} />
            Invite User
          </div>
        </Button>
      </div>

      <TeamTable
        users={users}
        invitations={invitations}
        onRefresh={handleRefresh}
      />

      <InviteDialog
        open={isInviteDialogOpen}
        onClose={handleCloseInviteDialog}
        onSuccess={handleInviteSuccess}
      />
    </div>
  )
}
