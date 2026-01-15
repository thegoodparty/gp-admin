'use client'

import { useMemo, useState } from 'react'
import { Flex, Text } from '@radix-ui/themes'
import { DataTable } from '@/shared/components/ui'
import { TeamUser, TeamInvitation } from '../types'
import { useCurrentUser } from '@/shared/hooks'
import { Role } from '@/shared/lib/roles'
import { RoleChangeDialog } from './RoleChangeDialog'
import { RemoveUserDialog } from './RemoveUserDialog'
import { RevokeInvitationDialog } from './RevokeInvitationDialog'
import { TeamTableFilters } from './TeamTableFilters'
import { buildTeamTableColumns } from './teamTableColumns'
import { TeamMember } from './teamTableTypes'

interface TeamTableProps {
  users: TeamUser[]
  invitations: TeamInvitation[]
  onRefresh: () => void
}

export function TeamTable({ users, invitations, onRefresh }: TeamTableProps) {
  const { id: currentUserId } = useCurrentUser()
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [roleFilter, setRoleFilter] = useState<string>('all')
  const [selectedUser, setSelectedUser] = useState<TeamMember | null>(null)
  const [roleChangeDialogOpen, setRoleChangeDialogOpen] = useState(false)
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false)
  const [revokeDialogOpen, setRevokeDialogOpen] = useState(false)
  const [pendingNewRole, setPendingNewRole] = useState<Role | null>(null)
  const [resendingId, setResendingId] = useState<string | null>(null)
  const [resendError, setResendError] = useState<string | null>(null)

  const data: TeamMember[] = useMemo(() => {
    const userMembers: TeamMember[] = users.map((user) => ({
      id: user.id,
      type: 'user' as const,
      email: user.email,
      name: user.fullName || user.email,
      imageUrl: user.imageUrl,
      role: user.role,
      status: 'active' as const,
      lastSignInAt: user.lastSignInAt,
      invitedBy: user.invitedBy,
      invitedAt: user.invitedAt,
      createdAt: user.createdAt,
    }))

    const invitationMembers: TeamMember[] = invitations.map((inv) => ({
      id: inv.id,
      type: 'invitation' as const,
      email: inv.emailAddress,
      name: inv.emailAddress,
      imageUrl: undefined,
      role: inv.role,
      status: 'pending' as const,
      lastSignInAt: null,
      invitedBy: inv.invitedBy,
      invitedAt: inv.invitedAt,
      createdAt: inv.createdAt,
    }))

    let combined = [...userMembers, ...invitationMembers]

    if (statusFilter !== 'all') {
      combined = combined.filter((m) => m.status === statusFilter)
    }

    if (roleFilter !== 'all') {
      combined = combined.filter((m) => m.role === roleFilter)
    }

    return combined
  }, [users, invitations, statusFilter, roleFilter])

  const handleChangeRole = (member: TeamMember, newRole: Role) => {
    setSelectedUser(member)
    setPendingNewRole(newRole)
    setRoleChangeDialogOpen(true)
  }

  const handleRemove = (member: TeamMember) => {
    setSelectedUser(member)
    setRemoveDialogOpen(true)
  }

  const handleResendInvite = async (member: TeamMember) => {
    if (!member.role) return

    setResendingId(member.id)
    setResendError(null)
    try {
      const { revokeInvitation, inviteUser } = await import('../actions')
      await revokeInvitation(member.id)
      await inviteUser(member.email, member.role)
      onRefresh()
    } catch (err) {
      setResendError(
        err instanceof Error ? err.message : 'Failed to resend invitation'
      )
    } finally {
      setResendingId(null)
    }
  }

  const handleRevokeInvite = (member: TeamMember) => {
    setSelectedUser(member)
    setRevokeDialogOpen(true)
  }

  const columns = buildTeamTableColumns({
    currentUserId,
    resendingId,
    onChangeRole: handleChangeRole,
    onRemove: handleRemove,
    onResendInvite: handleResendInvite,
    onRevokeInvite: handleRevokeInvite,
  })

  return (
    <Flex direction="column" gap="4">
      <TeamTableFilters
        statusFilter={statusFilter}
        roleFilter={roleFilter}
        onStatusChange={setStatusFilter}
        onRoleChange={setRoleFilter}
      />

      <div>
        {resendError && (
          <Flex mb="3" p="3" className="rounded-md bg-red-50">
            <Text size="2" color="red">
              {resendError}
            </Text>
          </Flex>
        )}
        <DataTable
          columns={columns}
          data={data}
          searchKey="name"
          searchPlaceholder="Search by name or email..."
          pagination={false}
          columnVisibilityControls={false}
        />
      </div>

      {selectedUser && pendingNewRole && (
        <RoleChangeDialog
          open={roleChangeDialogOpen}
          onClose={() => {
            setRoleChangeDialogOpen(false)
            setSelectedUser(null)
            setPendingNewRole(null)
          }}
          onSuccess={() => {
            setRoleChangeDialogOpen(false)
            setSelectedUser(null)
            setPendingNewRole(null)
            onRefresh()
          }}
          user={selectedUser}
          newRole={pendingNewRole}
        />
      )}

      {selectedUser && (
        <RemoveUserDialog
          open={removeDialogOpen}
          onClose={() => {
            setRemoveDialogOpen(false)
            setSelectedUser(null)
          }}
          onSuccess={() => {
            setRemoveDialogOpen(false)
            setSelectedUser(null)
            onRefresh()
          }}
          user={selectedUser}
        />
      )}

      {selectedUser && (
        <RevokeInvitationDialog
          open={revokeDialogOpen}
          onClose={() => {
            setRevokeDialogOpen(false)
            setSelectedUser(null)
          }}
          onSuccess={() => {
            setRevokeDialogOpen(false)
            setSelectedUser(null)
            onRefresh()
          }}
          invitation={{
            id: selectedUser.id,
            email: selectedUser.email,
          }}
        />
      )}
    </Flex>
  )
}
