import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

type EmptyStateProps = {
  icon: ReactNode
  title: string
  description: string
  className?: string
}

export function EmptyState({
  icon,
  title,
  description,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-lg border border-dashed border-rose-200/80 bg-white/55 px-5 py-8 text-center shadow-sm",
        className
      )}
    >
      <div className="mb-3 flex size-10 items-center justify-center rounded-lg bg-rose-100 text-rose-700 ring-1 ring-rose-200">
        {icon}
      </div>
      <h3 className="text-sm font-medium">{title}</h3>
      <p className="mt-1 max-w-xs text-sm leading-6 text-muted-foreground">
        {description}
      </p>
    </div>
  )
}
