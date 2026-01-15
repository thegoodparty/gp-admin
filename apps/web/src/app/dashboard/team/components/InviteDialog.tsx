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
import { Role, ROLE_OPTIONS, ROLES } from '@/shared/lib/roles'
import {
  validateInviteEmail,
  ALLOWED_EMAIL_DOMAIN,
} from '@/shared/lib/validation'
import { inviteUser } from '../actions'

interface InviteDialogProps {
  open: boolean
  onClose: () => void
  onSuccess: () => void
}

export function InviteDialog({ open, onClose, onSuccess }: InviteDialogProps) {
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<Role>(ROLES.READ_ONLY)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [validationError, setValidationError] = useState<string | null>(null)

  const resetForm = () => {
    setEmail('')
    setRole(ROLES.READ_ONLY)
    setError(null)
    setValidationError(null)
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setEmail(value)
    if (validationError) {
      setValidationError(null)
    }
  }

  const handleEmailBlur = () => {
    if (email.trim()) {
      const result = validateInviteEmail(email)
      if (!result.valid) {
        setValidationError(result.error ?? 'Invalid email')
      }
    }
  }

  const handleSubmit = async () => {
    setError(null)
    setValidationError(null)

    const validation = validateInviteEmail(email)
    if (!validation.valid) {
      setValidationError(validation.error ?? 'Invalid email')
      return
    }

    setIsLoading(true)

    try {
      await inviteUser(email, role)
      resetForm()
      onSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send invitation')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite Team Member</DialogTitle>
          <DialogDescription>
            Send an invitation to join the team. The user will receive an email
            with a link to create their account.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder={`user${ALLOWED_EMAIL_DOMAIN}`}
              value={email}
              onChange={handleEmailChange}
              onBlur={handleEmailBlur}
              disabled={isLoading}
              autoComplete="off"
              className={[
                'w-full rounded-md border bg-white px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-zinc-400',
                validationError ? 'border-red-500' : 'border-zinc-200',
              ]
                .filter(Boolean)
                .join(' ')}
            />
            {validationError && (
              <p className="text-sm text-red-500">{validationError}</p>
            )}
            <p className="text-xs text-zinc-400">
              Only {ALLOWED_EMAIL_DOMAIN} email addresses are allowed
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="role" className="text-sm font-medium">
              Role
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value as Role)}
              disabled={isLoading}
              className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-zinc-400"
            >
              {ROLE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {error && (
          <div className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-500">
            {error}
          </div>
        )}

        <DialogFooter>
          <Button
            variant="secondary"
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} loading={isLoading}>
            Send Invitation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
