'use client'

import { useState } from 'react'
import { Button, PlusIcon } from 'goodparty-styleguide'
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
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    )
  }

  if (!hasAccess) {
    return null
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Team Management</h1>
          <p className="text-muted-foreground">
            Manage team members and send invitations
          </p>
        </div>
        <Button onClick={handleOpenInviteDialog}>
          <div className="flex items-center gap-2 p-2 pr-4">
            <PlusIcon className="size-4" />
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
