'use client'

import { useState } from 'react'
import { Button, PlusIcon } from '@/shared/components/ui'
import { useRequireAdmin } from '@/shared/hooks'
import { TeamUser, TeamInvitation } from '../types'
import { listInvitations, listUsers } from '../actions'
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
      <div className="flex h-64 items-center justify-center">
        <div className="text-zinc-500">Loading...</div>
      </div>
    )
  }

  if (!hasAccess) {
    return null
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Team Management</h1>
          <p className="mt-1 text-zinc-500">
            Manage team members and send invitations
          </p>
        </div>
        <Button onClick={handleOpenInviteDialog}>
          <div className="flex items-center gap-2 px-2 py-1">
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
