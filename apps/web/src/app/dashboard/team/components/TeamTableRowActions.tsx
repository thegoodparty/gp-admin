'use client'

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  IconButton,
  MoreHorizontalIcon,
} from '@/shared/components/ui'
import { ROLE_OPTIONS, Role, ROLES } from '@/shared/lib/roles'
import { TeamMember } from './teamTableTypes'

interface TeamTableRowActionsProps {
  member: TeamMember
  currentUserId: string
  resendingId: string | null
  onChangeRole: (member: TeamMember, role: Role) => void
  onRemove: (member: TeamMember) => void
  onResendInvite: (member: TeamMember) => void
  onRevokeInvite: (member: TeamMember) => void
}

export function TeamTableRowActions({
  member,
  currentUserId,
  resendingId,
  onChangeRole,
  onRemove,
  onResendInvite,
  onRevokeInvite,
}: TeamTableRowActionsProps) {
  const isUser = member.type === 'user'
  const isSelf = isUser && member.id === currentUserId

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <IconButton variant="ghost" aria-label="Open actions menu">
          <MoreHorizontalIcon size={16} />
        </IconButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {isUser ? (
          <>
            <DropdownMenuLabel>Change Role</DropdownMenuLabel>
            {ROLE_OPTIONS.map((option) => (
              <DropdownMenuItem
                key={option.value}
                disabled={
                  member.role === option.value ||
                  (isSelf && option.value !== ROLES.ADMIN)
                }
                onClick={() => onChangeRole(member, option.value)}
              >
                {option.label}
                {member.role === option.value && ' (current)'}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onClick={() => onRemove(member)}
              disabled={isSelf}
            >
              Remove User
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuItem
              onClick={() => onResendInvite(member)}
              disabled={resendingId === member.id}
            >
              {resendingId === member.id ? 'Resending...' : 'Resend Invitation'}
            </DropdownMenuItem>
            <DropdownMenuItem
              variant="destructive"
              onClick={() => onRevokeInvite(member)}
              disabled={resendingId === member.id}
            >
              Revoke Invitation
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
