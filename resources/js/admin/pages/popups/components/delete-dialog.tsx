import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface DeleteDialogProps {
  isOpen: boolean
  isDeleting: boolean
  onClose: () => void
  onDelete: () => void
}

export function DeleteDialog({ isOpen, isDeleting, onClose, onDelete }: DeleteDialogProps) {
  const initialFocusRef = React.useRef<HTMLButtonElement>(null)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        onOpenAutoFocus={(e) => {
          e.preventDefault()
          initialFocusRef.current?.focus()
        }}
      >
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the marketing.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button 
            ref={initialFocusRef}
            variant="outline" 
            onClick={onClose} 
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button 
            variant="destructive" 
            onClick={onDelete}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}