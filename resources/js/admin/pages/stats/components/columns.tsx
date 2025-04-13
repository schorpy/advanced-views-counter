"use client"

import { ColumnDef } from "@tanstack/react-table"

import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"

import { labels, priorities, statuses } from "../data/data"
import { Task } from "../data/schema"
import { DataTableColumnHeader } from "./data-table-column-header"
import { DataTableRowActions } from "./data-table-row-actions"
import { cn,copyToClipboard } from "@/lib/utils";
import { Link } from "react-router-dom"

const handleCopyToClipboard = (linkString: string) => {
  copyToClipboard(linkString, "Link copied to clipboard!");
};
export const columns: ColumnDef<Task>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("id")}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("id")}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "slug",  //accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Link" />
    ),
    enableSorting: false,
    cell: ({ row }) => {
      return (
        <div
                    className={cn(
                            `group/cell relative flex w-full items-center gap-x-4 overflow-hidden truncate rounded-sm px-3 py-1.5 text-center text-secondary-foreground transition-all group-hover/row:ring-1 group-hover/row:ring-gray-400 group-hover/row:dark:ring-gray-100 md:py-1`,
                               
                                "bg-secondary hover:bg-emerald-700 hover:dark:bg-emerald-200",
                              )}
                            >
                             

                              <div className="flex w-full whitespace-nowrap text-sm group-hover/cell:opacity-0">
                              {row.getValue("slug")}
                              </div>

                             
                                <button
                                  className="absolute bottom-0 left-0 right-0 top-0 z-10 hidden w-full whitespace-nowrap text-center text-xs group-hover/cell:block group-hover/cell:text-primary-foreground sm:text-sm"
                                  onClick={() =>
                                    handleCopyToClipboard(
                                      `${window.location.origin}/go/${row.getValue("slug")}`
                                    )
                                  }
                                  title="Copy to clipboard"
                                >
                                  Copy to Clipboard
                                </button>
                            
                            </div>
      )
      // const label = labels.find((label) => label.value === row.original.label)

      // return (
      //   <div className="flex space-x-2">
      //     {label && <Badge variant="outline">{label.label}</Badge>}
      //     <span className="max-w-[500px] truncate font-medium">
      //       {row.getValue("slug")}
      //     </span>
      //   </div>
      // )
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = statuses.find(
        (status) => status.value === row.getValue("status")
      )

      if (!status) {
        return null
      }

      return (
        <div className="flex w-[100px] items-center">
          {status.icon && (
            <status.icon className="mr-2 h-4 w-4 text-muted-foreground" />
          )}
          <span>{status.label}</span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "priority",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Stats" />
    ),
    cell: ({ row }) => {
      const priority = priorities.find(
        (priority) => priority.value === row.getValue("priority")
      )

      // if (!priority) {
      //   return null
      // }

      return (
        <div className="flex items-center">
          <Link to={`/stats/${row.getValue("id")}`}>Stats</Link>
          {/* <span>{priority.label}</span> */}
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    id: "actions",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Actions" />
    ),
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
