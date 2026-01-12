# PRD: User Invitation and Team Management System

## Overview

### Problem Statement

The GP Admin application currently lacks a user management system. There is no way to invite new team members, control who has access to the application, or manage user permissions. As the team grows, we need a structured way to onboard new users with appropriate access levels while ensuring only authorized `@goodparty.org` email addresses can join.

### Goals

1. Enable admins to invite new users to the application with assigned roles
2. Restrict access to only `@goodparty.org` email addresses
3. Provide a centralized interface for managing team members
4. Implement role-based access control with three distinct permission levels
5. Allow admins to modify user roles or remove access as needed

### Non-Goals

- Implementing granular feature-level permissions (beyond role-based)
- Self-service role change requests
- Integration with external identity providers beyond Clerk
- Multi-organization support

---

## User Roles & Permissions

| Role         | Description          | Permissions                                                                |
| ------------ | -------------------- | -------------------------------------------------------------------------- |
| **Admin**    | Full system access   | Invite users, manage team, access all features, change roles, remove users |
| **Sales**    | Sales-focused access | Access sales-related features (specific features TBD in future PRDs)       |
| **ReadOnly** | View-only access     | Can view data but cannot make any modifications                            |

> **Note:** Only Admins can access the Team Management section and invite/manage users.

---

## Functional Requirements

### FR-1: User Invitation Flow

#### FR-1.1: Invite Form

- **Location:** "Team" section in the sidebar (Admin only)
- **Fields:**
  - Email address (required, must end with `@goodparty.org`)
  - Role selection dropdown (Admin, Sales, ReadOnly)
- **Validation:**
  - Email must be valid format
  - Email domain must be exactly `@goodparty.org`
  - Cannot invite an email that already exists in the system
  - Cannot invite an email with a pending invitation

#### FR-1.2: Invitation Process

1. Admin fills out the invite form
2. System validates email domain restriction
3. Clerk sends invitation email with unique link
4. Invitation includes assigned role in `publicMetadata`
5. System stores: inviter ID, invite timestamp, assigned role

#### FR-1.3: Invitation Acceptance

1. Invitee clicks link in email
2. Redirected to custom sign-up page (`/auth/sign-up`) with email pre-verified
3. Upon successful sign-up, role from invitation metadata is applied
4. User gains access to application with assigned permissions

#### FR-1.4: Sign-Up Restrictions

- **Restricted Sign-up Mode:** Configure Clerk to only allow sign-ups via invitation
- No public sign-up available - only invited users can create accounts
- Direct visits to sign-up page without valid invitation token should show error/redirect

#### FR-1.5: Invitation Expiration

- Invitations expire after 30 days (Clerk default)
- Expired invitations are marked as such in the pending list
- Admins can resend expired invitations

---

### FR-2: Team Management Page

#### FR-2.1: User List Table

Display all users with the following columns:

| Column      | Description                                 |
| ----------- | ------------------------------------------- |
| Name        | User's full name                            |
| Email       | User's email address                        |
| Role        | Current role (Admin/Sales/ReadOnly)         |
| Status      | Active or Pending (for pending invitations) |
| Last Login  | Date/time of most recent login              |
| Invited By  | Name of admin who sent invitation           |
| Invite Date | When the invitation was created             |

#### FR-2.2: Table Features

- Sortable columns
- Search/filter by name or email
- Filter by role
- Filter by status (Active/Pending)
- Pagination (if >20 users)

#### FR-2.3: User Actions

For each user row, admins can:

- **Change Role:** Dropdown to select new role
- **Remove Access:** Button to completely remove user from system

#### FR-2.4: Pending Invitations

- Show pending invitations in the same table with "Pending" status
- Additional actions for pending invitations:
  - **Resend Invitation**
  - **Revoke Invitation**

---

### FR-3: Role Management

#### FR-3.1: Change User Role

1. Admin selects new role from dropdown
2. Confirmation dialog: "Change [User Name]'s role from [Current] to [New]?"
3. Upon confirmation:
   - Update role in Clerk user metadata
   - Send email notification to user about role change (via Clerk)
4. Changes take effect immediately

#### FR-3.2: Remove User Access

1. Admin clicks "Remove" action
2. Confirmation dialog: "Are you sure you want to remove [User Name]? This action cannot be undone."
3. Upon confirmation:
   - Delete user from Clerk
   - User immediately loses access to application

---

### FR-4: Email Notifications

| Event           | Recipient | Content                                          | Service     |
| --------------- | --------- | ------------------------------------------------ | ----------- |
| Invitation Sent | Invitee   | Invitation link (handled by Clerk)               | Clerk Email |
| Role Changed    | User      | "Your role has been changed from [Old] to [New]" | Clerk Email |

> **Note:** Access revocation does NOT send an email notification (user is being removed, not transitioned)

---

## Technical Implementation

### Clerk Configuration

#### Dashboard Setup (One-time)

1. **First Admin User:** Create manually via Clerk Dashboard
   - Navigate to Users → Create User
   - Set `publicMetadata.role = "admin"`
2. **Restricted Sign-up Mode:** Enable in Clerk Dashboard
   - Settings → User & Authentication → Restrictions
   - Set sign-up mode to "Restricted" (invitation-only)
3. **Email Templates:** Use Clerk's built-in email service for all notifications

#### Using Clerk's Built-in Features

1. **Invitations API:** Use `clerkClient.invitations.createInvitation()` for sending invites
2. **User Metadata:** Store role in `publicMetadata.role`
3. **Audit Logging:** Rely on Clerk's built-in logs (accessible via Clerk Dashboard)

#### Public Metadata Structure

```typescript
interface UserPublicMetadata {
  role: 'admin' | 'sales' | 'readOnly'
  invitedBy?: string // Clerk user ID of inviter
  invitedAt?: string // ISO timestamp
}
```

---

### Shared Providers & Utilities (DRY Architecture)

To keep code clean and maintainable, create shared providers and utility functions.

#### File Structure

```
apps/web/src/
├── app/
│   └── dashboard/
│       └── team/
│           ├── page.tsx          # Team management page
│           └── actions.ts        # Server actions (Clerk operations)
├── shared/
│   ├── providers/
│   │   ├── UserProvider.tsx      # User context with role info
│   │   └── index.ts
│   ├── hooks/
│   │   ├── useCurrentUser.ts     # Hook to access current user & role
│   │   ├── useRequireRole.ts     # Hook to check/require specific roles
│   │   ├── useTeamMembers.ts     # Hook for fetching team data
│   │   └── index.ts
│   ├── lib/
│   │   ├── roles.ts              # Role constants and type definitions
│   │   ├── permissions.ts        # Permission checking utilities
│   │   └── validation.ts         # Email domain validation
│   └── components/
│       ├── RequireRole.tsx       # Component wrapper for role-gated content
│       └── index.ts
```

#### Role Constants & Types (`shared/lib/roles.ts`)

```typescript
export const ROLES = {
  ADMIN: 'admin',
  SALES: 'sales',
  READ_ONLY: 'readOnly',
} as const

export type Role = (typeof ROLES)[keyof typeof ROLES]

export const ROLE_LABELS: Record<Role, string> = {
  admin: 'Admin',
  sales: 'Sales',
  readOnly: 'Read Only',
}

export const ROLE_OPTIONS = [
  { value: ROLES.ADMIN, label: 'Admin' },
  { value: ROLES.SALES, label: 'Sales' },
  { value: ROLES.READ_ONLY, label: 'Read Only' },
]
```

#### Permission Utilities (`shared/lib/permissions.ts`)

```typescript
import { Role, ROLES } from './roles'

export function canManageTeam(role: Role | undefined): boolean {
  return role === ROLES.ADMIN
}

export function canInviteUsers(role: Role | undefined): boolean {
  return role === ROLES.ADMIN
}

export function canEditData(role: Role | undefined): boolean {
  return role === ROLES.ADMIN || role === ROLES.SALES
}

// Extensible for future permission checks
export const PERMISSIONS = {
  MANAGE_TEAM: canManageTeam,
  INVITE_USERS: canInviteUsers,
  EDIT_DATA: canEditData,
}
```

#### Email Validation (`shared/lib/validation.ts`)

```typescript
export const ALLOWED_EMAIL_DOMAIN = '@goodparty.org'

export function isValidEmailDomain(email: string): boolean {
  return email.toLowerCase().trim().endsWith(ALLOWED_EMAIL_DOMAIN)
}

export function validateInviteEmail(email: string): {
  valid: boolean
  error?: string
} {
  if (!email || !email.trim()) {
    return { valid: false, error: 'Email is required' }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return { valid: false, error: 'Invalid email format' }
  }

  if (!isValidEmailDomain(email)) {
    return {
      valid: false,
      error: `Email must be a ${ALLOWED_EMAIL_DOMAIN} address`,
    }
  }

  return { valid: true }
}
```

#### User Hook (`shared/hooks/useCurrentUser.ts`)

```typescript
import { useUser } from '@clerk/nextjs'
import { Role } from '../lib/roles'

export interface CurrentUser {
  id: string
  email: string
  firstName: string | null
  lastName: string | null
  fullName: string
  role: Role | undefined
  imageUrl: string
  isLoaded: boolean
  isSignedIn: boolean
}

export function useCurrentUser(): CurrentUser {
  const { user, isLoaded, isSignedIn } = useUser()

  return {
    id: user?.id ?? '',
    email: user?.primaryEmailAddress?.emailAddress ?? '',
    firstName: user?.firstName ?? null,
    lastName: user?.lastName ?? null,
    fullName: user?.fullName ?? '',
    role: user?.publicMetadata?.role as Role | undefined,
    imageUrl: user?.imageUrl ?? '',
    isLoaded,
    isSignedIn: isSignedIn ?? false,
  }
}
```

#### Role Requirement Hook (`shared/hooks/useRequireRole.ts`)

```typescript
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useCurrentUser } from './useCurrentUser'
import { Role, ROLES } from '../lib/roles'

export function useRequireRole(requiredRole: Role | Role[]) {
  const router = useRouter()
  const { role, isLoaded, isSignedIn } = useCurrentUser()

  const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole]
  const hasAccess = role && roles.includes(role)

  useEffect(() => {
    if (isLoaded && isSignedIn && !hasAccess) {
      router.push('/dashboard') // Redirect to dashboard if no access
    }
  }, [isLoaded, isSignedIn, hasAccess, router])

  return { hasAccess, isLoading: !isLoaded }
}

export function useRequireAdmin() {
  return useRequireRole(ROLES.ADMIN)
}
```

#### RequireRole Component (`shared/components/RequireRole.tsx`)

```typescript
'use client'

import { ReactNode } from 'react'
import { useCurrentUser } from '../hooks/useCurrentUser'
import { Role } from '../lib/roles'

interface RequireRoleProps {
  role: Role | Role[]
  children: ReactNode
  fallback?: ReactNode
}

export function RequireRole({ role, children, fallback = null }: RequireRoleProps) {
  const { role: userRole, isLoaded } = useCurrentUser()

  if (!isLoaded) return null

  const roles = Array.isArray(role) ? role : [role]
  const hasAccess = userRole && roles.includes(userRole)

  return hasAccess ? <>{children}</> : <>{fallback}</>
}
```

---

### Server Actions (Clerk Direct Integration)

All team management operations use **Next.js Server Actions** calling **Clerk's Backend SDK directly**. No custom API routes required.

#### Server Actions File Structure

```
apps/web/src/
├── app/
│   └── dashboard/
│       └── team/
│           └── actions.ts    # Server actions for team management
```

#### Server Actions (`app/dashboard/team/actions.ts`)

```typescript
'use server'

import { auth, clerkClient } from '@clerk/nextjs/server'
import { ROLES, Role } from '@/shared/lib/roles'
import { validateInviteEmail } from '@/shared/lib/validation'

// Helper to verify admin access
async function requireAdmin() {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  const client = await clerkClient()
  const user = await client.users.getUser(userId)

  if (user.publicMetadata?.role !== ROLES.ADMIN) {
    throw new Error('Forbidden: Admin access required')
  }

  return { userId, client }
}

// Send invitation
export async function inviteUser(email: string, role: Role) {
  const { userId, client } = await requireAdmin()

  const validation = validateInviteEmail(email)
  if (!validation.valid) throw new Error(validation.error)

  const invitation = await client.invitations.createInvitation({
    emailAddress: email,
    publicMetadata: {
      role,
      invitedBy: userId,
      invitedAt: new Date().toISOString(),
    },
    redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/auth/sign-up`,
  })

  return invitation
}

// List all users
export async function listUsers() {
  const { client } = await requireAdmin()
  const users = await client.users.getUserList({ limit: 100 })
  return users.data
}

// List pending invitations
export async function listInvitations() {
  const { client } = await requireAdmin()
  const invitations = await client.invitations.getInvitationList({
    status: ['pending'],
  })
  return invitations.data
}

// Update user role
export async function updateUserRole(userId: string, newRole: Role) {
  const { client } = await requireAdmin()

  await client.users.updateUserMetadata(userId, {
    publicMetadata: { role: newRole },
  })
}

// Remove user
export async function removeUser(userId: string) {
  const { client } = await requireAdmin()
  await client.users.deleteUser(userId)
}

// Revoke invitation
export async function revokeInvitation(invitationId: string) {
  const { client } = await requireAdmin()
  await client.invitations.revokeInvitation(invitationId)
}
```

#### Available Operations (All via Clerk)

| Operation         | Clerk Method                             | Auth       |
| ----------------- | ---------------------------------------- | ---------- |
| Send invitation   | `client.invitations.createInvitation()`  | Admin only |
| List users        | `client.users.getUserList()`             | Admin only |
| List invitations  | `client.invitations.getInvitationList()` | Admin only |
| Update user role  | `client.users.updateUserMetadata()`      | Admin only |
| Remove user       | `client.users.deleteUser()`              | Admin only |
| Revoke invitation | `client.invitations.revokeInvitation()`  | Admin only |

> **Note:** No custom API routes needed. All operations go directly through Clerk's Backend SDK.

---

### Frontend Routes

| Route             | Component  | Description                           |
| ----------------- | ---------- | ------------------------------------- |
| `/dashboard/team` | TeamPage   | Main team management page             |
| `/auth/sign-up`   | SignUpPage | Custom sign-up page (invitation only) |

---

## UI Components (GoodParty Styleguide)

Use components from [`goodparty-styleguide`](https://github.com/thegoodparty/styleguide) ([style.goodparty.org](https://style.goodparty.org/)) for consistent UI.

### Required Components from Styleguide

| Component      | Usage                                        |
| -------------- | -------------------------------------------- |
| `Button`       | Primary actions, cancel, destructive actions |
| `DataTable`    | Team members table with sorting/filtering    |
| `Input`        | Email input field                            |
| `Select`       | Role dropdown selection                      |
| `Dialog`       | Confirmation modals for role change/removal  |
| `Badge`        | Status indicators (Active/Pending)           |
| `Avatar`       | User avatars in the table                    |
| `DropdownMenu` | Actions menu for each table row              |

### Component Mapping

```tsx
// Example usage in TeamPage
import {
  Button,
  DataTable,
  DataTableColumnHeader,
  Input,
  Select,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Badge,
  Avatar,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from 'goodparty-styleguide'
```

### Button Variants to Use

- `default` - Primary actions (Send Invitation, Save)
- `secondary` - Cancel actions
- `destructive` - Remove user, Revoke invitation
- `ghost` - Table row actions trigger

---

## Implementation Phases

### Phase 1: Core Setup & Providers

- [ ] Create `shared/lib/roles.ts` - Role constants and types
- [ ] Create `shared/lib/permissions.ts` - Permission utilities
- [ ] Create `shared/lib/validation.ts` - Email validation
- [ ] Create `shared/hooks/useCurrentUser.ts` - User context hook
- [ ] Create `shared/hooks/useRequireRole.ts` - Role requirement hook
- [ ] Create `shared/components/RequireRole.tsx` - Role gate component
- [ ] Configure Clerk Dashboard: Set up restricted sign-up mode
- [ ] Configure Clerk Dashboard: Create first admin user manually

### Phase 2: Custom Sign-Up Page

- [ ] Create `/auth/sign-up` page with Clerk `<SignUp />` component
- [ ] Configure redirect URL for invitations to point to custom page
- [ ] Add invitation-only check (redirect if no valid invitation token)

### Phase 3: Team Page UI

- [ ] Add "Team" item to sidebar (admin only, using `RequireRole`)
- [ ] Create `/dashboard/team` page layout
- [ ] Build team members table using `DataTable` from styleguide
- [ ] Implement search and filter UI

### Phase 4: Server Actions & Invitation Flow

- [ ] Create `app/dashboard/team/actions.ts` with server actions
- [ ] Implement `inviteUser()` server action using Clerk
- [ ] Implement `listUsers()` and `listInvitations()` server actions
- [ ] Create invite modal/dialog using styleguide components
- [ ] Wire up invite form to server action

### Phase 5: User Management

- [ ] Implement `updateUserRole()` server action
- [ ] Implement `removeUser()` server action
- [ ] Implement role change functionality in UI
- [ ] Implement user removal functionality in UI
- [ ] Add confirmation dialogs for destructive actions

### Phase 6: Pending Invitations

- [ ] Implement `revokeInvitation()` server action
- [ ] Add resend/revoke actions to pending invitation rows

### Phase 7: Email Notifications

- [ ] Configure Clerk email templates for role change notification

---

## Backend Dependencies & TODOs

> **Architecture Note:** This project uses a **NestJS backend** located at `apps/api/`. The team management feature does NOT require the backend - everything is handled via Clerk directly using Next.js Server Actions.

### Clerk-Only Implementation (No Backend Required) ✅

All team management operations use Clerk's Backend SDK directly via Server Actions:

| Feature                     | Status   | Implementation                    |
| --------------------------- | -------- | --------------------------------- |
| Create invitations          | ✅ Ready | Server Action → Clerk Backend SDK |
| List users                  | ✅ Ready | Server Action → Clerk Backend SDK |
| Update user metadata (role) | ✅ Ready | Server Action → Clerk Backend SDK |
| Delete users                | ✅ Ready | Server Action → Clerk Backend SDK |
| List pending invitations    | ✅ Ready | Server Action → Clerk Backend SDK |
| Revoke invitations          | ✅ Ready | Server Action → Clerk Backend SDK |
| Resend invitations          | ✅ Ready | Server Action → Clerk Backend SDK |
| Email notifications         | ✅ Ready | Clerk's built-in email service    |

### Future Backend Integration (NestJS - `apps/api/`)

> ⚠️ **Items flagged below would require NestJS backend implementation if needed in the future.**

| Feature                          | Status  | Notes                                                             |
| -------------------------------- | ------- | ----------------------------------------------------------------- |
| Persist audit logs to database   | 🚫 TODO | Currently using Clerk's built-in logs only                        |
| Custom role change email content | 🚫 TODO | May need Clerk webhook to trigger custom email via backend        |
| Sync user data to local DB       | 🚫 TODO | Webhook listener needed to sync Clerk users to local database     |
| Activity tracking                | 🚫 TODO | Backend needed to track and store user activity beyond Clerk logs |

> **Note:** If backend integration is needed later, implement webhook handlers in `apps/api/` to listen for Clerk events.

---

## Security Considerations

1. **Email Domain Restriction:** Enforced both client-side and in server actions
2. **Admin-Only Access:** All server actions verify admin role before executing
3. **Restricted Sign-up:** Clerk configured to only allow invited users (invitation-only mode)
4. **Audit Trail:** Clerk's built-in logs for all user actions
5. **Clerk Security:** Leverage Clerk's built-in security features (rate limiting, JWT validation)

---

## Dependencies

| Dependency           | Purpose                          | Status                |
| -------------------- | -------------------------------- | --------------------- |
| Clerk                | Authentication & User Management | ✅ Already integrated |
| Clerk Backend SDK    | Server-side user operations      | ✅ Available          |
| goodparty-styleguide | UI Components                    | ✅ Already in use     |
| Clerk Email Service  | Notifications                    | ✅ Built-in           |

---

## Decisions Made

| Question                   | Decision                                                        |
| -------------------------- | --------------------------------------------------------------- |
| First Admin Setup          | Manual via Clerk Dashboard                                      |
| Role Change Email Template | Use Clerk's built-in email service                              |
| Invitation Redirect        | Custom sign-up page (`/auth/sign-up`), invitation-only access   |
| Audit Logging              | Use Clerk's logs (backend not available yet)                    |
| API Architecture           | Use Clerk directly via Server Actions (no custom API routes)    |
| Backend Integration        | Not required - NestJS backend (`apps/api/`) not needed for this |

---

## Appendix

### Clerk Documentation References

- [Invite Users to Your Application](https://clerk.com/docs/guides/users/inviting)
- [User Metadata](https://clerk.com/docs/guides/users/extending)
- [Restricted Sign-up Mode](https://clerk.com/docs/guides/secure/restricting-access#sign-up-modes)
- [Backend API - Invitations](https://clerk.com/docs/reference/backend-api/tag/invitations)

### GoodParty Styleguide References

- [Styleguide Site](https://style.goodparty.org/)
- [GitHub Repository](https://github.com/thegoodparty/styleguide)
- [DataTable Component](https://github.com/thegoodparty/styleguide#datatable)

### Related PRDs

- TBD: Role-specific feature access (Sales features, ReadOnly restrictions)
