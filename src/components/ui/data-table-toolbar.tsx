
"use client"

import { type Table } from "@tanstack/react-table"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  children: React.ReactNode
}

export function DataTableToolbar<TData>({
  table,
  children,
}: DataTableToolbarProps<TData>) {

  return (
    <div className="flex items-center justify-between">
        {children}
    </div>
  )
}
