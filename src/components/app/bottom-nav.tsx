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
  { href: "/home", label: "홈", icon: Home, color: "text-orange-600" },
  { href: "/journal", label: "감정", icon: BookOpenText, color: "text-rose-600" },
  { href: "/gratitude", label: "감사", icon: HeartHandshake, color: "text-emerald-600" },
  { href: "/cards", label: "카드", icon: Sparkles, color: "text-amber-600" },
  { href: "/settings", label: "설정", icon: Settings, color: "text-sky-600" },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-white/70 bg-white/75 px-2 pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-2 shadow-[0_-16px_50px_-35px_oklch(0.35_0.08_35)] backdrop-blur supports-backdrop-filter:bg-white/65 md:hidden">
      <div className="mx-auto grid max-w-md grid-cols-5 gap-1">
        {items.map((item) => {
          const active = pathname === item.href
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex h-12 min-w-0 flex-col items-center justify-center gap-1 rounded-lg text-[0.72rem] font-semibold text-muted-foreground transition-colors",
                active && "bg-white text-foreground shadow-sm ring-1 ring-rose-100"
              )}
              aria-current={active ? "page" : undefined}
            >
              <Icon className={cn("size-4", active && item.color)} />
              <span className="truncate">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
