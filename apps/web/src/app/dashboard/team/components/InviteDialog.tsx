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

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label
              htmlFor="email"
              style={{ fontSize: '14px', fontWeight: 500 }}
            >
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
              style={{
                width: '100%',
                padding: '8px 12px',
                fontSize: '14px',
                border: `1px solid ${validationError ? '#ef4444' : '#e4e4e7'}`,
                borderRadius: '6px',
                outline: 'none',
              }}
            />
            {validationError && (
              <p style={{ fontSize: '14px', color: '#ef4444', margin: 0 }}>
                {validationError}
              </p>
            )}
            <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>
              Only {ALLOWED_EMAIL_DOMAIN} email addresses are allowed
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label htmlFor="role" style={{ fontSize: '14px', fontWeight: 500 }}>
              Role
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value as Role)}
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '8px 12px',
                fontSize: '14px',
                border: '1px solid #e4e4e7',
                borderRadius: '6px',
                outline: 'none',
                backgroundColor: 'white',
              }}
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
          <div
            style={{
              marginTop: '16px',
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
