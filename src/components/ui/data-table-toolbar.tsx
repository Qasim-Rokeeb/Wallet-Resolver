
"use client"

import { type Table } from "@tanstack/react-table"
import { cn } from "@/lib/utils"

interface DataTableToolbarProps<TData> extends React.HTMLAttributes<HTMLDivElement> {
  table: Table<TData>
  children: React.ReactNode
}

export function DataTableToolbar<TData>({
  table,
  children,
  className,
  ...props
}: DataTableToolbarProps<TData>) {

  return (
    <div className={cn("flex items-center justify-between", className)} {...props}>
        {children}
    </div>
  )
}
