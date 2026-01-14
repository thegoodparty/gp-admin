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
} from 'goodparty-styleguide'
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
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Remove User</DialogTitle>
          <DialogDescription>
            Are you sure you want to remove <strong>{user.name}</strong> (
            {user.email})? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
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
            Remove User
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
