'use client'

import { TeamUser, TeamInvitation } from '../types'

interface TeamTableProps {
  users: TeamUser[]
  invitations: TeamInvitation[]
  onRefresh: () => void
}

export function TeamTable({ users, invitations, onRefresh }: TeamTableProps) {
  // TODO: Implement full table in task 9
  return (
    <div className="rounded-md border">
      <div className="p-4 text-muted-foreground text-center">
        Team table will be implemented in task 9
        <br />
        Users: {users.length} | Pending invitations: {invitations.length}
      </div>
    </div>
  )
}
