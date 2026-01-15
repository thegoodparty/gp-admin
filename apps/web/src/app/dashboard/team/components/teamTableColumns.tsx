'use client'

import { ColumnDef } from '@tanstack/react-table'
import { Avatar, Flex, Text, Badge } from '@radix-ui/themes'
import { DataTableColumnHeader } from '@/shared/components/ui'
import { ROLE_LABELS, Role } from '@/shared/lib/roles'
import { formatDate, formatRelativeTime } from '@/shared/utils'
import { TeamMember } from './teamTableTypes'
import { TeamTableRowActions } from './TeamTableRowActions'

interface TeamTableColumnOptions {
  currentUserId: string
  resendingId: string | null
  onChangeRole: (member: TeamMember, role: Role) => void
  onRemove: (member: TeamMember) => void
  onResendInvite: (member: TeamMember) => void
  onRevokeInvite: (member: TeamMember) => void
}

export function buildTeamTableColumns({
  currentUserId,
  resendingId,
  onChangeRole,
  onRemove,
  onResendInvite,
  onRevokeInvite,
}: TeamTableColumnOptions): ColumnDef<TeamMember>[] {
  return [
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
      cell: ({ row }) => {
        const member = row.original
        const initials = member.name
          .split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase()
          .slice(0, 2)

        return (
          <Flex align="center" gap="3" p="2">
            <Avatar
              size="2"
              src={member.imageUrl}
              fallback={initials || '?'}
              radius="full"
            />
            <Flex direction="column">
              <Text weight="medium">{member.name}</Text>
              <Text size="2" color="gray">
                {member.email}
              </Text>
            </Flex>
          </Flex>
        )
      },
    },
    {
      accessorKey: 'role',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Role" />
      ),
      cell: ({ row }) => {
        const role = row.original.role
        return role ? ROLE_LABELS[role] : '—'
      },
    },
    {
      accessorKey: 'status',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => {
        const status = row.original.status
        return (
          <Badge color={status === 'active' ? 'green' : 'gray'}>
            {status === 'active' ? 'Active' : 'Pending'}
          </Badge>
        )
      },
    },
    {
      accessorKey: 'lastSignInAt',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Last Login" />
      ),
      cell: ({ row }) => formatRelativeTime(row.original.lastSignInAt),
    },
    {
      accessorKey: 'invitedAt',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Invited" />
      ),
      cell: ({ row }) => formatDate(row.original.invitedAt),
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <TeamTableRowActions
          member={row.original}
          currentUserId={currentUserId}
          resendingId={resendingId}
          onChangeRole={onChangeRole}
          onRemove={onRemove}
          onResendInvite={onResendInvite}
          onRevokeInvite={onRevokeInvite}
        />
      ),
    },
  ]
}
