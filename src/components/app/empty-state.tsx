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
        "flex flex-col items-center justify-center rounded-lg border border-dashed bg-muted/30 px-5 py-8 text-center",
        className
      )}
    >
      <div className="mb-3 flex size-10 items-center justify-center rounded-lg bg-background text-muted-foreground ring-1 ring-border">
        {icon}
      </div>
      <h3 className="text-sm font-medium">{title}</h3>
      <p className="mt-1 max-w-xs text-sm leading-6 text-muted-foreground">
        {description}
      </p>
    </div>
  )
}
