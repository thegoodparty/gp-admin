'use client'

import { useState } from 'react'
import { Dialog, Button, Flex, Text } from '@radix-ui/themes'
import { removeUser } from '../actions'

interface RemoveUserDialogProps {
  open: boolean
  onClose: () => void
  onSuccess: () => void
  user: {
    id: string
    name: string
    email: string
  }
}

export function RemoveUserDialog({
  open,
  onClose,
  onSuccess,
  user,
}: RemoveUserDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleConfirm = async () => {
    setIsLoading(true)
    setError(null)

    try {
      await removeUser(user.id)
      onSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove user')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <Dialog.Content maxWidth="425px">
        <Dialog.Title>Remove User</Dialog.Title>
        <Dialog.Description size="2" mb="4">
          Are you sure you want to remove <Text weight="bold">{user.name}</Text>{' '}
          ({user.email})? This action cannot be undone.
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
          <Button color="red" onClick={handleConfirm} loading={isLoading}>
            Remove User
          </Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  )
}
