'use client'

import { useState } from 'react'
import { Dialog, Button, Flex, Text } from '@radix-ui/themes'
import { Role, ROLE_LABELS } from '@/shared/lib/roles'
import { updateUserRole } from '../actions'

interface RoleChangeDialogProps {
  open: boolean
  onClose: () => void
  onSuccess: () => void
  user: {
    id: string
    name: string
    role: Role | undefined
  }
  newRole: Role
}

export function RoleChangeDialog({
  open,
  onClose,
  onSuccess,
  user,
  newRole,
}: RoleChangeDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleConfirm = async () => {
    setIsLoading(true)
    setError(null)

    try {
      await updateUserRole(user.id, newRole)
      onSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update role')
    } finally {
      setIsLoading(false)
    }
  }

  const currentRoleLabel = user.role ? ROLE_LABELS[user.role] : 'Unknown'
  const newRoleLabel = ROLE_LABELS[newRole]

  return (
    <Dialog.Root open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <Dialog.Content maxWidth="425px">
        <Dialog.Title>Change Role</Dialog.Title>
        <Dialog.Description size="2" mb="4">
          Are you sure you want to change {user.name}&apos;s role from{' '}
          <Text weight="bold">{currentRoleLabel}</Text> to{' '}
          <Text weight="bold">{newRoleLabel}</Text>?
        </Dialog.Description>

        {error && (
          <Flex p="3" className="rounded-md bg-red-50">
            <Text size="2" color="red">
              {error}
            </Text>
          </Flex>
        )}

        <Flex gap="3" mt="4" justify="end">
          <Dialog.Close>
            <Button variant="soft" color="gray" disabled={isLoading}>
              Cancel
            </Button>
          </Dialog.Close>
          <Button onClick={handleConfirm} loading={isLoading}>
            Change Role
          </Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  )
}
