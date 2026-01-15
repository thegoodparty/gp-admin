'use client'

import { useState } from 'react'
import { Dialog, Button, Flex, Text } from '@radix-ui/themes'
import { revokeInvitation } from '../actions'

interface RevokeInvitationDialogProps {
  open: boolean
  onClose: () => void
  onSuccess: () => void
  invitation: {
    id: string
    email: string
  }
}

export function RevokeInvitationDialog({
  open,
  onClose,
  onSuccess,
  invitation,
}: RevokeInvitationDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleConfirm = async () => {
    setIsLoading(true)
    setError(null)

    try {
      await revokeInvitation(invitation.id)
      onSuccess()
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to revoke invitation'
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <Dialog.Content maxWidth="425px">
        <Dialog.Title>Revoke Invitation</Dialog.Title>
        <Dialog.Description size="2" mb="4">
          Are you sure you want to revoke the invitation for{' '}
          <Text weight="bold">{invitation.email}</Text>? They will no longer be
          able to join using this invitation link.
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
            Revoke Invitation
          </Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  )
}
