import { z } from 'zod'

export const ALLOWED_EMAIL_DOMAIN = '@goodparty.org'

export const inviteEmailSchema = z
  .string()
  .min(1, { message: 'Email is required' })
  .email({ message: 'Invalid email format' })
  .refine((email) => email.toLowerCase().endsWith(ALLOWED_EMAIL_DOMAIN), {
    message: `Email must be a ${ALLOWED_EMAIL_DOMAIN} address`,
  })

export interface ValidationResult {
  valid: boolean
  error?: string
}

export function isValidEmailDomain(email: string): boolean {
  if (!email) return false
  return email.toLowerCase().trim().endsWith(ALLOWED_EMAIL_DOMAIN)
}

export function validateInviteEmail(email: string): ValidationResult {
  const result = inviteEmailSchema.safeParse(email?.trim() ?? '')

  if (!result.success) {
    return {
      valid: false,
      error: result.error.issues[0]?.message,
    }
  }

  return { valid: true }
}

export function normalizeEmail(email: string): string {
  return email?.toLowerCase().trim() ?? ''
}
