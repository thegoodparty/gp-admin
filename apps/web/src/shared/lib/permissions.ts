import { Role, ROLES } from './roles'

export function canManageTeam(role: Role | undefined): boolean {
  if (!role) return false
  return role === ROLES.ADMIN
}

export function canInviteUsers(role: Role | undefined): boolean {
  if (!role) return false
  return role === ROLES.ADMIN
}

export function canEditData(role: Role | undefined): boolean {
  if (!role) return false
  return role === ROLES.ADMIN || role === ROLES.SALES
}

export function canViewData(role: Role | undefined): boolean {
  if (!role) return false
  return role === ROLES.ADMIN || role === ROLES.SALES || role === ROLES.READ_ONLY
}

export const PERMISSIONS = {
  MANAGE_TEAM: canManageTeam,
  INVITE_USERS: canInviteUsers,
  EDIT_DATA: canEditData,
  VIEW_DATA: canViewData,
} as const
