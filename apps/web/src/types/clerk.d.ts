/**
 * Augment Clerk's global types to include our custom publicMetadata fields.
 * This provides type safety when accessing user.publicMetadata.role, etc.
 *
 * UserPublicMetadata is the standard Clerk interface for user metadata
 * and is recognized by Clerk's SDK for global augmentation.
 *
 * Role type is inlined here to avoid import issues with .d.ts files in Next.js.
 *
 * @see https://clerk.com/docs/reference/javascript/types/overview
 */

type Role = 'admin' | 'sales' | 'readOnly'

declare global {
  interface UserPublicMetadata {
    role?: Role
    invitedBy?: string
    invitedAt?: string
  }
}

/**
 * Our custom public metadata shape used in both users and invitations.
 * Use this type when working with publicMetadata from either source.
 *
 * Note: Clerk's Invitation type uses `Record<string, unknown>` for publicMetadata,
 * so we need to cast it when accessing. Users get proper typing via global augmentation.
 */
export interface AppPublicMetadata {
  role?: Role
  invitedBy?: string
  invitedAt?: string
}
