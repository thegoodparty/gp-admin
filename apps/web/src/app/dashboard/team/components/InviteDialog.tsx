'use client'

import { useState } from 'react'
import { Dialog, Button, Flex, Text } from '@radix-ui/themes'
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
    <Dialog.Root
      open={open}
      onOpenChange={(isOpen) => !isOpen && handleClose()}
    >
      <Dialog.Content maxWidth="425px">
        <Dialog.Title>Invite Team Member</Dialog.Title>
        <Dialog.Description size="2" mb="4">
          Send an invitation to join the team. The user will receive an email
          with a link to create their account.
        </Dialog.Description>

        <Flex direction="column" gap="4">
          <Flex direction="column" gap="2">
            <Text as="label" size="2" weight="medium" htmlFor="email">
              Email Address
            </Text>
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
                'w-full rounded-md border bg-white px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-blue-400',
                validationError ? 'border-red-500' : 'border-gray-200',
              ]
                .filter(Boolean)
                .join(' ')}
            />
            {validationError && (
              <Text size="2" color="red">
                {validationError}
              </Text>
            )}
            <Text size="1" color="gray">
              Only {ALLOWED_EMAIL_DOMAIN} email addresses are allowed
            </Text>
          </Flex>

          <Flex direction="column" gap="2">
            <Text as="label" size="2" weight="medium" htmlFor="role">
              Role
            </Text>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value as Role)}
              disabled={isLoading}
              className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
            >
              {ROLE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </Flex>
        </Flex>

        {error && (
          <Flex mt="4" p="3" className="rounded-md bg-red-50">
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
          <Button onClick={handleSubmit} loading={isLoading}>
            Send Invitation
          </Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  )
}
