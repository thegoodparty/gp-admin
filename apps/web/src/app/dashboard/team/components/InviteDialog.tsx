'use client'

interface InviteDialogProps {
  open: boolean
  onClose: () => void
  onSuccess: () => void
}

export function InviteDialog({ open, onClose, onSuccess }: InviteDialogProps) {
  // TODO: Implement full dialog in task 10
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-background rounded-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-lg font-semibold mb-4">Invite User</h2>
        <p className="text-muted-foreground mb-4">
          Invite dialog will be fully implemented in task 10
        </p>
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md border hover:bg-accent"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
