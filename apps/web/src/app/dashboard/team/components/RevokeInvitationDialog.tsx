'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Button,
} from '@/shared/components/ui'
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
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Revoke Invitation</DialogTitle>
          <DialogDescription>
            Are you sure you want to revoke the invitation for{' '}
            <strong>{invitation.email}</strong>? They will no longer be able to
            join using this invitation link.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div
            style={{
              padding: '12px',
              fontSize: '14px',
              color: '#ef4444',
              backgroundColor: '#fef2f2',
              borderRadius: '6px',
            }}
          >
            {error}
          </div>
        )}

        <DialogFooter>
          <Button variant="secondary" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            loading={isLoading}
          >
            Revoke Invitation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
