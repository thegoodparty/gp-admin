# Tasks: User Invitation and Team Management System

## Relevant Files

### Shared Library Files

- `apps/web/src/shared/lib/roles.ts` - Role constants, types, and labels
- `apps/web/src/shared/lib/permissions.ts` - Permission checking utility functions
- `apps/web/src/shared/lib/validation.ts` - Email domain validation utilities

### Shared Hooks

- `apps/web/src/shared/hooks/useCurrentUser.ts` - Hook to access current user and role from Clerk
- `apps/web/src/shared/hooks/useRequireRole.ts` - Hook to check/require specific roles with redirect
- `apps/web/src/shared/hooks/index.ts` - Barrel export for hooks

### Shared Components

- `apps/web/src/shared/components/RequireRole.tsx` - Component wrapper for role-gated content
- `apps/web/src/shared/components/index.ts` - Barrel export for components

### Layout Files

- `apps/web/src/shared/layout/Sidebar.tsx` - Sidebar navigation (add Team nav item)

### Auth Pages

- `apps/web/src/app/auth/sign-up/[[...sign-up]]/page.tsx` - Custom sign-up page (invitation only)

### Team Feature Files

- `apps/web/src/app/dashboard/team/page.tsx` - Team management page
- `apps/web/src/app/dashboard/team/actions.ts` - Server actions for Clerk operations
- `apps/web/src/app/dashboard/team/components/TeamTable.tsx` - Data table for team members
- `apps/web/src/app/dashboard/team/components/InviteDialog.tsx` - Invite user modal dialog
- `apps/web/src/app/dashboard/team/components/RoleChangeDialog.tsx` - Role change confirmation dialog
- `apps/web/src/app/dashboard/team/components/RemoveUserDialog.tsx` - Remove user confirmation dialog
- `apps/web/src/app/dashboard/team/components/index.ts` - Barrel export for team components

### Test Files

- `e2e/team-management.spec.ts` - E2E tests for team management flow

### Notes

- make sure to follow our cursor rules!
- Use `npx playwright test` to run E2E tests
- All Clerk operations go through Server Actions - no custom API routes needed
- Use components from radix-ui when possible

## Instructions for Completing Tasks

**IMPORTANT:** As you complete each task, you must check it off in this markdown file by changing `- [ ]` to `- [x]`. This helps track progress and ensures you don't skip any steps.

Example:

- `- [ ] 1.1 Read file` → `- [x] 1.1 Read file` (after completing)

Update the file after completing each sub-task, not just after completing an entire parent task.

## Tasks

- [x] 1.0 Create shared library files for roles and permissions
  - [x] 1.1 Create `apps/web/src/shared/lib/` directory if it doesn't exist
  - [x] 1.2 Create `roles.ts` with `ROLES` constant object (`admin`, `sales`, `readOnly`)
  - [x] 1.3 Add `Role` type definition exported from roles
  - [x] 1.4 Add `ROLE_LABELS` record mapping role values to display labels
  - [x] 1.5 Add `ROLE_OPTIONS` array for dropdown select options
  - [x] 1.6 Create `permissions.ts` with `canManageTeam()` function (returns true if role is admin)
  - [x] 1.7 Add `canInviteUsers()` function to permissions
  - [x] 1.8 Add `canEditData()` function to permissions (admin or sales)
  - [x] 1.9 Export `PERMISSIONS` object with all permission functions

- [x] 2.0 Create email validation utilities
  - [x] 2.1 Create `validation.ts` in shared/lib
  - [x] 2.2 Add `ALLOWED_EMAIL_DOMAIN` constant (`@goodparty.org`)
  - [x] 2.3 Implement `isValidEmailDomain()` function
  - [x] 2.4 Implement `validateInviteEmail()` function returning `{ valid: boolean, error?: string }`
  - [x] 2.5 Handle edge cases: empty string, invalid format, wrong domain

- [x] 3.0 Create user hooks for accessing current user and role
  - [x] 3.1 Create `useCurrentUser.ts` hook in shared/hooks
  - [x] 3.2 Import and use `useUser` from `@clerk/nextjs`
  - [x] 3.3 Define `CurrentUser` interface with id, email, firstName, lastName, fullName, role, imageUrl, isLoaded, isSignedIn
  - [x] 3.4 Implement the hook to extract role from `user.publicMetadata.role`
  - [x] 3.5 Create `useRequireRole.ts` hook
  - [x] 3.6 Implement redirect logic when user lacks required role
  - [x] 3.7 Add `useRequireAdmin()` convenience function
  - [x] 3.8 Create `index.ts` barrel export for all hooks

- [x] 4.0 Create RequireRole component for role-gated UI
  - [x] 4.1 Create `apps/web/src/shared/components/` directory
  - [x] 4.2 Create `RequireRole.tsx` as a client component (`'use client'`)
  - [x] 4.3 Accept props: `role` (single or array), `children`, `fallback` (optional)
  - [x] 4.4 Use `useCurrentUser` hook to check user's role
  - [x] 4.5 Render children if user has access, fallback otherwise
  - [x] 4.6 Handle loading state (return null while loading)
  - [x] 4.7 Create `index.ts` barrel export

- [x] 5.0 Create custom sign-up page for invited users
  - [x] 5.1 Create directory structure: `apps/web/src/app/auth/sign-up/[[...sign-up]]/`
  - [x] 5.2 Create `page.tsx` with Clerk's `<SignUp />` component
  - [x] 5.3 Add metadata (title, description)
  - [x] 5.4 Style the page consistently with sign-in page
  - [x] 5.5 **MANUAL:** Configure Clerk Dashboard: Enable "Restricted" sign-up mode (invitation-only)
  - [x] 5.6 **MANUAL:** Test that direct access to sign-up without invitation shows appropriate error

- [x] 6.0 Add Team navigation item to sidebar (admin only)
  - [x] 6.1 Open `apps/web/src/shared/layout/Sidebar.tsx`
  - [x] 6.2 Import `RequireRole` component and `ROLES` constant
  - [x] 6.3 Add Team nav item object with title "Team", href "/dashboard/team", icon (HiUserGroup or similar)
  - [x] 6.4 Wrap Team nav item with `RequireRole` component requiring admin role
  - [ ] 6.5 **MANUAL:** Test that Team item only appears for admin users

- [x] 7.0 Create server actions for Clerk operations
  - [x] 7.1 Create `apps/web/src/app/dashboard/team/actions.ts`
  - [x] 7.2 Add `'use server'` directive at top of file
  - [x] 7.3 Import `auth`, `clerkClient` from `@clerk/nextjs/server`
  - [x] 7.4 Import role types and validation utilities
  - [x] 7.5 Implement `requireAdmin()` helper function that verifies admin role
  - [x] 7.6 Implement `inviteUser(email: string, role: Role)` server action
  - [x] 7.7 Add email validation in `inviteUser` before calling Clerk
  - [x] 7.8 Set `publicMetadata` with role, invitedBy, invitedAt in invitation
  - [x] 7.9 Set `redirectUrl` to sign-up page URL
  - [x] 7.10 Implement `listUsers()` server action using `client.users.getUserList()`
  - [x] 7.11 Implement `listInvitations()` server action for pending invitations
  - [x] 7.12 Implement `updateUserRole(userId: string, newRole: Role)` server action
  - [x] 7.13 Implement `removeUser(userId: string)` server action
  - [x] 7.14 Implement `revokeInvitation(invitationId: string)` server action
  - [x] 7.15 Add proper error handling and throw descriptive errors

- [x] 8.0 Create Team management page layout
  - [x] 8.1 Create `apps/web/src/app/dashboard/team/` directory
  - [x] 8.2 Create `page.tsx` as a server component
  - [x] 8.3 Fetch initial data using server actions (listUsers, listInvitations)
  - [x] 8.4 Add page title "Team Management"
  - [x] 8.5 Add "Invite User" button in header area
  - [x] 8.6 Import and render TeamTable component with fetched data
  - [x] 8.7 Add admin-only access check using `useRequireAdmin` or server-side check

- [x] 9.0 Create TeamTable component
  - [x] 9.1 Create `apps/web/src/app/dashboard/team/components/` directory
  - [x] 9.2 Create `TeamTable.tsx` component
  - [x] 9.3 Import `DataTable`, `DataTableColumnHeader`, `Badge`, `Avatar`, `DropdownMenu` from
  - [x] 9.4 Define column definitions: Name (with Avatar), Email, Role, Status, Last Login, Invited By, Invite Date, Actions
  - [x] 9.5 Implement Status column with Badge component (Active/Pending variants)
  - [x] 9.6 Implement Role column showing role label
  - [x] 9.7 Implement Actions column with DropdownMenu (Change Role, Remove for users; Resend, Revoke for pending)
  - [x] 9.8 Add search functionality for filtering by name/email
  - [x] 9.9 Add filter dropdown for role
  - [x] 9.10 Add filter dropdown for status (Active/Pending)
  - [x] 9.11 Create `index.ts` barrel export for team components

- [x] 10.0 Create InviteDialog component
  - [x] 10.1 Create `InviteDialog.tsx` component
  - [x] 10.2 Import `Dialog`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogFooter`, `Input`, `Select`, `Button`
  - [x] 10.3 Create controlled form state for email and role
  - [x] 10.4 Add email input field with placeholder showing domain requirement
  - [x] 10.5 Add role select dropdown populated from `ROLE_OPTIONS`
  - [x] 10.6 Implement client-side validation using `validateInviteEmail()`
  - [x] 10.7 Display validation error message below email field
  - [x] 10.8 Add Cancel button (secondary variant)
  - [x] 10.9 Add Send Invitation button (default variant)
  - [x] 10.10 Wire up form submission to `inviteUser` server action
  - [x] 10.11 Add loading state during submission
  - [x] 10.12 Handle success: close dialog, show toast, refresh data
  - [x] 10.13 Handle error: show error toast with message

- [x] 11.0 Create RoleChangeDialog component
  - [x] 11.1 Create `RoleChangeDialog.tsx` component
  - [x] 11.2 Accept props: user info, current role, new role, onConfirm, onCancel
  - [x] 11.3 Display confirmation message: "Change [Name]'s role from [Current] to [New]?"
  - [x] 11.4 Add Cancel button (secondary variant)
  - [x] 11.5 Add Confirm button (default variant)
  - [x] 11.6 Wire up to `updateUserRole` server action
  - [x] 11.7 Add loading state during update
  - [x] 11.8 Handle success and error with appropriate toasts

- [x] 12.0 Create RemoveUserDialog component
  - [x] 12.1 Create `RemoveUserDialog.tsx` component
  - [x] 12.2 Accept props: user info, onConfirm, onCancel
  - [x] 12.3 Display warning message: "Are you sure you want to remove [Name]? This action cannot be undone."
  - [x] 12.4 Add Cancel button (secondary variant)
  - [x] 12.5 Add Remove button (destructive variant)
  - [x] 12.6 Wire up to `removeUser` server action
  - [x] 12.7 Add loading state during removal
  - [x] 12.8 Handle success and error with appropriate toasts

- [x] 13.0 Implement pending invitation actions
  - [x] 13.1 Add "Resend Invitation" option to pending invitation row actions
  - [x] 13.2 Implement resend by calling `inviteUser` with same email/role (Clerk creates new invitation)
  - [x] 13.3 Add "Revoke Invitation" option to pending invitation row actions
  - [x] 13.4 Create confirmation dialog for revoking invitation
  - [x] 13.5 Wire up to `revokeInvitation` server action
  - [x] 13.6 Refresh table data after resend/revoke actions

- [ ] 14.0 Configure Clerk email templates
  - [ ] 14.1 Access Clerk Dashboard → Customization → Emails
  - [ ] 14.2 Customize invitation email template with GoodParty branding
  - [ ] 14.3 Verify role change notification email is enabled (if available in Clerk)
  - [ ] 14.4 Test invitation email flow end-to-end

- [ ] 15.0 Manual Clerk Dashboard setup (one-time)
  - [ ] 15.1 Create first admin user manually in Clerk Dashboard
  - [ ] 15.2 Set `publicMetadata.role = "admin"` for first admin user
  - [ ] 15.3 Enable "Restricted" sign-up mode in Clerk Dashboard (Settings → Restrictions)
  - [ ] 15.4 Document setup steps in README or internal docs

- [ ] 16.0 Write E2E tests for team management
  - [ ] 16.1 Create `e2e/team-management.spec.ts`
  - [ ] 16.2 Write test: Admin can see Team in sidebar
  - [ ] 16.3 Write test: Non-admin cannot see Team in sidebar
  - [ ] 16.4 Write test: Admin can open invite dialog
  - [ ] 16.5 Write test: Invalid email domain shows error
  - [ ] 16.6 Write test: Valid invitation flow (mock or test Clerk)
  - [ ] 16.7 Write test: Role change confirmation dialog appears
  - [ ] 16.8 Write test: Remove user confirmation dialog appears

- [ ] 17.0 Final testing and polish
  - [ ] 17.1 Test complete invitation flow with real @goodparty.org email
  - [ ] 17.2 Test role change flow
  - [ ] 17.3 Test user removal flow
  - [ ] 17.4 Test pending invitation resend/revoke
  - [ ] 17.5 Verify all loading states work correctly
  - [ ] 17.6 Verify all error states display properly
  - [ ] 17.7 Test responsive design on mobile viewports
  - [ ] 17.9 Run all E2E tests and fix any failures
  - [ ] 17.10 Code review and cleanup
