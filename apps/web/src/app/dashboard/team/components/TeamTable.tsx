'use client'

import { useMemo, useState } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import {
  DataTable,
  DataTableColumnHeader,
  Avatar,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  IconButton,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  MoreHorizontalIcon,
} from 'goodparty-styleguide'
import { TeamUser, TeamInvitation } from '../types'
import { ROLE_LABELS, ROLE_OPTIONS, Role } from '@/shared/lib/roles'
import { RoleChangeDialog } from './RoleChangeDialog'
import { RemoveUserDialog } from './RemoveUserDialog'

type TeamMember = {
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

interface TeamTableProps {
  users: TeamUser[]
  invitations: TeamInvitation[]
  onRefresh: () => void
}

function formatDate(timestamp: number | string | null | undefined): string {
  if (!timestamp) return '—'
  const date =
    typeof timestamp === 'string' ? new Date(timestamp) : new Date(timestamp)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function formatRelativeTime(timestamp: number | null): string {
  if (!timestamp) return '—'
  const now = Date.now()
  const diff = now - timestamp
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  return formatDate(timestamp)
}

export function TeamTable({ users, invitations, onRefresh }: TeamTableProps) {
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [roleFilter, setRoleFilter] = useState<string>('all')
  const [selectedUser, setSelectedUser] = useState<TeamMember | null>(null)
  const [roleChangeDialogOpen, setRoleChangeDialogOpen] = useState(false)
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false)
  const [pendingNewRole, setPendingNewRole] = useState<Role | null>(null)

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
    const { revokeInvitation, inviteUser } = await import('../actions')
    await revokeInvitation(member.id)
    if (member.role) {
      await inviteUser(member.email, member.role)
    }
    onRefresh()
  }

  const handleRevokeInvite = async (member: TeamMember) => {
    const { revokeInvitation } = await import('../actions')
    await revokeInvitation(member.id)
    onRefresh()
  }

  const columns: ColumnDef<TeamMember>[] = [
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
            <div className="size-16 relative rounded-full">
              <Avatar size="xSmall">
                {member.imageUrl ? (
                  <Avatar.Image
                    src={member.imageUrl}
                    alt={member.name}
                    className="object-cover"
                  />
                ) : (
                  <Avatar.Fallback>{initials || '?'}</Avatar.Fallback>
                )}
              </Avatar>
            </div>
            <div className="flex flex-col">
              <span className="font-medium">{member.name}</span>
              <span className="text-sm text-muted-foreground">
                {member.email}
              </span>
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
        return (
          <div
            className={`py-1 px-4 inline-block rounded-lg text-white ${status === 'active' ? 'bg-green-500 ' : 'bg-gray-500 text-secondary-foreground'}`}
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
      cell: ({ row }) => {
        const member = row.original
        const isUser = member.type === 'user'

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <IconButton
                variant="ghost"
                size="small"
                aria-label="Open actions menu"
              >
                <MoreHorizontalIcon className="size-4" />
              </IconButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="p-1 bg-white">
              {isUser ? (
                <>
                  <DropdownMenuLabel className="p-1">
                    Change Role
                  </DropdownMenuLabel>
                  {ROLE_OPTIONS.map((option) => (
                    <DropdownMenuItem
                      key={option.value}
                      disabled={member.role === option.value}
                      onClick={() => handleChangeRole(member, option.value)}
                      className="p-1 focus:outline-none"
                    >
                      {option.label}
                      {member.role === option.value && ' (current)'}
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={() => handleRemove(member)}
                    className="p-1 focus:outline-none"
                  >
                    Remove User
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem onClick={() => handleResendInvite(member)}>
                    Resend Invitation
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={() => handleRevokeInvite(member)}
                  >
                    Revoke Invitation
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 p-1">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="p-1">
            <SelectItem value="all" className="p-1 focus:outline-none">
              All Status
            </SelectItem>
            <SelectItem value="active" className="p-1 focus:outline-none">
              Active
            </SelectItem>
            <SelectItem value="pending" className="p-1 focus:outline-none">
              Pending
            </SelectItem>
          </SelectContent>
        </Select>

        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent className="p-1">
            <SelectItem value="all" className="p-1 focus:outline-none">
              All Roles
            </SelectItem>
            {ROLE_OPTIONS.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                className="p-1 focus:outline-none"
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="[&>div>div:first-child]:pb-4 [&>div>div:nth-child(2)]:mb-4">
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
    </div>
  )
}
