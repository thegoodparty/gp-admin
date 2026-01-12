export const ROLES = {
  ADMIN: 'admin',
  SALES: 'sales',
  READ_ONLY: 'readOnly',
} as const

export type Role = (typeof ROLES)[keyof typeof ROLES]

export const ROLE_LABELS: Record<Role, string> = {
  [ROLES.ADMIN]: 'Admin',
  [ROLES.SALES]: 'Sales',
  [ROLES.READ_ONLY]: 'Read Only',
}

export const ROLE_OPTIONS: { value: Role; label: string }[] = [
  { value: ROLES.ADMIN, label: ROLE_LABELS[ROLES.ADMIN] },
  { value: ROLES.SALES, label: ROLE_LABELS[ROLES.SALES] },
  { value: ROLES.READ_ONLY, label: ROLE_LABELS[ROLES.READ_ONLY] },
]

export function isValidRole(value: unknown): value is Role {
  return (
    typeof value === 'string' &&
    Object.values(ROLES).includes(value as Role)
  )
}

export function getRoleLabel(role: Role | undefined): string {
  if (!role) return 'Unknown'
  return ROLE_LABELS[role] ?? 'Unknown'
}
