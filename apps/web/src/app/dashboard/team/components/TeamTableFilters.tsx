'use client'

import { Select, Flex } from '@radix-ui/themes'
import { ROLE_OPTIONS } from '@/shared/lib/roles'

interface TeamTableFiltersProps {
  statusFilter: string
  roleFilter: string
  onStatusChange: (value: string) => void
  onRoleChange: (value: string) => void
}

export function TeamTableFilters({
  statusFilter,
  roleFilter,
  onStatusChange,
  onRoleChange,
}: TeamTableFiltersProps) {
  return (
    <Flex align="center" gap="4" p="1">
      <Select.Root value={statusFilter} onValueChange={onStatusChange}>
        <Select.Trigger placeholder="Status" aria-label="Status filter" />
        <Select.Content>
          <Select.Item value="all">All Status</Select.Item>
          <Select.Item value="active">Active</Select.Item>
          <Select.Item value="pending">Pending</Select.Item>
        </Select.Content>
      </Select.Root>

      <Select.Root value={roleFilter} onValueChange={onRoleChange}>
        <Select.Trigger placeholder="Role" aria-label="Role filter" />
        <Select.Content>
          <Select.Item value="all">All Roles</Select.Item>
          {ROLE_OPTIONS.map((option) => (
            <Select.Item key={option.value} value={option.value}>
              {option.label}
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Root>
    </Flex>
  )
}
