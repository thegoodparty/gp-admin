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
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Role</DialogTitle>
          <DialogDescription>
            Are you sure you want to change {user.name}&apos;s role from{' '}
            <strong>{currentRoleLabel}</strong> to{' '}
            <strong>{newRoleLabel}</strong>?
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
          <Button onClick={handleConfirm} loading={isLoading}>
            Change Role
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
