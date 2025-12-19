export const USER_ROLES = {
  ADMIN: 'admin',
  SALES: 'sales',
  READ_ONLY: 'read-only',
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export const ROLE_LABELS: Record<UserRole, string> = {
  [USER_ROLES.ADMIN]: 'Admin',
  [USER_ROLES.SALES]: 'Sales',
  [USER_ROLES.READ_ONLY]: 'Read Only',
};

export const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  [USER_ROLES.ADMIN]: 'Full access to all features and settings',
  [USER_ROLES.SALES]: 'Access to sales features and customer management',
  [USER_ROLES.READ_ONLY]: 'View-only access to data and reports',
};

export const ROLE_PERMISSIONS = {
  [USER_ROLES.ADMIN]: [
    'users.view',
    'users.create',
    'users.edit',
    'users.delete',
    'users.invite',
    'settings.view',
    'settings.edit',
    'data.view',
    'data.edit',
    'data.delete',
  ],
  [USER_ROLES.SALES]: [
    'users.view',
    'data.view',
    'data.edit',
  ],
  [USER_ROLES.READ_ONLY]: [
    'users.view',
    'data.view',
  ],
} as const;

export type Permission = (typeof ROLE_PERMISSIONS)[UserRole][number];

export function hasPermission(role: UserRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role].includes(permission as any);
}

export function canInviteUsers(role: UserRole): boolean {
  return hasPermission(role, 'users.invite');
}

export function canManageUsers(role: UserRole): boolean {
  return hasPermission(role, 'users.edit');
}
