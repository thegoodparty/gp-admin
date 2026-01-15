'use client'

import { DropdownMenu, IconButton } from '@radix-ui/themes'
import { MoreHorizontal } from 'lucide-react'
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
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <IconButton variant="ghost" aria-label="Open actions menu">
          <MoreHorizontal size={16} />
        </IconButton>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="end">
        {isUser ? (
          <>
            <DropdownMenu.Label>Change Role</DropdownMenu.Label>
            {ROLE_OPTIONS.map((option) => (
              <DropdownMenu.Item
                key={option.value}
                disabled={
                  member.role === option.value ||
                  (isSelf && option.value !== ROLES.ADMIN)
                }
                onSelect={() => onChangeRole(member, option.value)}
              >
                {option.label}
                {member.role === option.value && ' (current)'}
              </DropdownMenu.Item>
            ))}
            <DropdownMenu.Separator />
            <DropdownMenu.Item
              color="red"
              onSelect={() => onRemove(member)}
              disabled={isSelf}
            >
              Remove User
            </DropdownMenu.Item>
          </>
        ) : (
          <>
            <DropdownMenu.Item
              onSelect={() => onResendInvite(member)}
              disabled={resendingId === member.id}
            >
              {resendingId === member.id ? 'Resending...' : 'Resend Invitation'}
            </DropdownMenu.Item>
            <DropdownMenu.Item
              color="red"
              onSelect={() => onRevokeInvite(member)}
              disabled={resendingId === member.id}
            >
              Revoke Invitation
            </DropdownMenu.Item>
          </>
        )}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}
