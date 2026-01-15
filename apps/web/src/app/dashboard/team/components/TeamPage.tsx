'use client'

import { useState } from 'react'
import { Button, Flex, Text, Heading } from '@radix-ui/themes'
import { Plus } from 'lucide-react'
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
      <Flex height="256px" align="center" justify="center">
        <Text color="gray">Loading...</Text>
      </Flex>
    )
  }

  if (!hasAccess) {
    return null
  }

  return (
    <Flex direction="column" gap="6">
      <Flex wrap="wrap" align="center" justify="between" gap="4">
        <div>
          <Heading size="6" as="h1">
            Team Management
          </Heading>
          <Text size="2" color="gray" mt="1">
            Manage team members and send invitations
          </Text>
        </div>
        <Button onClick={handleOpenInviteDialog}>
          <Plus size={16} />
          Invite User
        </Button>
      </Flex>

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
    </Flex>
  )
}
