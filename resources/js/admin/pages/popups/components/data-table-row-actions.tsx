"use client"

import { Row } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"
import FetchWrapper from '@/hooks/FetchWrapper';
// import { labels } from "../data/data"
// import { taskSchema } from "../data/schema"
import { Link } from "react-router-dom"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import * as React from "react"

import { DeleteDialog } from "./delete-dialog"

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [isDeleting, setIsDeleting] = React.useState(false)

  const handleDelete = async (id: number) => {
    try {
      setIsDeleting(true);
      const api = new FetchWrapper(chatizy.pluginApiUrl, chatizy.nonce);
      
      api.delete(`/agent/delete/${id}`)
        .then(data => {
          if (data.status === 'success') {
            setIsOpen(false);
            toast.success(data.message, {
              duration: 1000,
              onAutoClose: () => {
                window.location.href = '/wp-admin/admin.php?page=chatizy#/agents';
              }
            });
          }
        })
        .catch(error => {
          toast.error('Failed to delete Agent', {
            description: error.message || 'An unexpected error occurred'
          });
        })
        .finally(() => {
          setIsDeleting(false);
        });

    } catch (error) {
      setIsDeleting(false);
      toast.error('Failed to delete Agent');
    }
  }

  return (
    <div className="relative">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex h-8 w-8 p-0 data-[state=open]:bg-muted">
            <MoreHorizontal />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem asChild>
            <Link to={`/agents/edit/${row.getValue("id")}`}>Edit</Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            onSelect={(e) => {
              e.preventDefault()
              setIsOpen(true)
            }}
          >
            Delete
            <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteDialog 
        isOpen={isOpen}
        isDeleting={isDeleting}
        onClose={() => setIsOpen(false)}
        onDelete={() => handleDelete(row.getValue("id"))}
      />
    </div>
  )
}
