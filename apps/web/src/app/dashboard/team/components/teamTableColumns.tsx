'use client'

import { ColumnDef } from '@tanstack/react-table'
import { Avatar, DataTableColumnHeader } from '@/shared/components/ui'
import { ROLE_LABELS, Role } from '@/shared/lib/roles'
import { formatDate, formatRelativeTime } from '@/shared/utils'
import { TeamMember } from './teamTableTypes'
import { TeamTableRowActions } from './TeamTableRowActions'

interface TeamTableColumnOptions {
  resendingId: string | null
  onChangeRole: (member: TeamMember, role: Role) => void
  onRemove: (member: TeamMember) => void
  onResendInvite: (member: TeamMember) => void
  onRevokeInvite: (member: TeamMember) => void
}

export function buildTeamTableColumns({
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
          <div className="flex items-center gap-3 p-2">
            <Avatar size="xSmall" className="shrink-0">
              {member.imageUrl ? (
                <Avatar.Image src={member.imageUrl} alt={member.name} />
              ) : (
                <Avatar.Fallback>{initials || '?'}</Avatar.Fallback>
              )}
            </Avatar>
            <div className="flex flex-col">
              <span className="font-medium">{member.name}</span>
              <span className="text-sm text-zinc-500">{member.email}</span>
            </div>
          </div>
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
        const statusClasses =
          status === 'active'
            ? 'bg-green-500 text-white'
            : 'bg-zinc-500 text-white'
        return (
          <div
            className={`inline-block rounded-md px-4 py-1 text-sm ${statusClasses}`}
          >
            {status === 'active' ? 'Active' : 'Pending'}
          </div>
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
