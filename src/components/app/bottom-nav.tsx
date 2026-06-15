"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BookOpenText,
  HeartHandshake,
  Home,
  Settings,
  Sparkles,
} from "lucide-react"

import { cn } from "@/lib/utils"

const items = [
  { href: "/home", label: "홈", icon: Home },
  { href: "/journal", label: "감정", icon: BookOpenText },
  { href: "/gratitude", label: "감사", icon: HeartHandshake },
  { href: "/cards", label: "카드", icon: Sparkles },
  { href: "/settings", label: "설정", icon: Settings },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 px-2 pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-2 backdrop-blur supports-backdrop-filter:bg-background/80 md:hidden">
      <div className="mx-auto grid max-w-md grid-cols-5 gap-1">
        {items.map((item) => {
          const active = pathname === item.href
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex h-12 min-w-0 flex-col items-center justify-center gap-1 rounded-lg text-[0.72rem] font-medium text-muted-foreground transition-colors",
                active && "bg-secondary text-foreground"
              )}
              aria-current={active ? "page" : undefined}
            >
              <Icon className="size-4" />
              <span className="truncate">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
