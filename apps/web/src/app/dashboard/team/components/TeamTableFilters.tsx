'use client'

import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/shared/components/ui'
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
    <div className="flex items-center gap-4 p-1">
      <Select value={statusFilter} onValueChange={onStatusChange}>
        <SelectTrigger className="w-[150px]" aria-label="Status filter">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
        </SelectContent>
      </Select>

      <Select value={roleFilter} onValueChange={onRoleChange}>
        <SelectTrigger className="w-[150px]" aria-label="Role filter">
          <SelectValue placeholder="Role" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Roles</SelectItem>
          {ROLE_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
