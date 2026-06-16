import Link from "next/link"
import type { User } from "@supabase/supabase-js"
import {
  BookOpenText,
  HeartHandshake,
  Home,
  Settings,
  Sparkles,
} from "lucide-react"

import { BottomNav } from "@/components/app/bottom-nav"
import { Separator } from "@/components/ui/separator"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/home", label: "홈", icon: Home, color: "text-orange-600" },
  { href: "/journal", label: "감정 일기", icon: BookOpenText, color: "text-rose-600" },
  { href: "/gratitude", label: "감사노트", icon: HeartHandshake, color: "text-emerald-600" },
  { href: "/cards", label: "문장 카드", icon: Sparkles, color: "text-amber-600" },
  { href: "/settings", label: "설정", icon: Settings, color: "text-sky-600" },
]

type AppShellProps = {
  user: User
  profileDisplayName?: string | null
  children: React.ReactNode
}

export function AppShell({ user, profileDisplayName, children }: AppShellProps) {
  const fallbackName =
    typeof user.user_metadata?.full_name === "string"
      ? user.user_metadata.full_name
      : typeof user.user_metadata?.name === "string"
        ? user.user_metadata.name
        : "오늘의 나"
  const name = profileDisplayName?.trim() || fallbackName

  return (
    <div className="min-h-dvh text-foreground">
      <div className="mx-auto grid min-h-dvh w-full max-w-6xl grid-cols-1 md:grid-cols-[220px_1fr]">
        <aside className="hidden border-r border-white/60 bg-white/45 px-4 py-5 shadow-[24px_0_80px_-70px_oklch(0.45_0.12_30)] backdrop-blur md:block">
          <Link href="/home" className="block rounded-lg bg-white/60 px-3 py-3 ring-1 ring-white/70">
            <p className="text-lg font-bold tracking-tight text-rose-900">감정 노트</p>
            <p className="mt-1 text-xs text-muted-foreground">따뜻한 마음 기록장</p>
          </Link>
          <Separator className="my-5" />
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "lg" }),
                    "w-full justify-start rounded-lg px-3 text-foreground/80 hover:bg-white/65"
                  )}
                >
                  <Icon className={cn("size-4", item.color)} />
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </aside>

        <div className="flex min-w-0 flex-col">
          <header className="sticky top-0 z-30 border-b border-white/60 bg-white/55 px-5 py-3 backdrop-blur supports-backdrop-filter:bg-white/45 md:px-8">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">감정 노트</p>
                <h1 className="truncate text-base font-bold tracking-tight">
                  {name}
                </h1>
              </div>
              <Link
                href="/settings"
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                  "hidden md:inline-flex"
                )}
              >
                <Settings className="size-4" />
                설정
              </Link>
            </div>
          </header>
          <main className="flex-1 px-5 py-6 pb-24 md:px-8 md:pb-10">
            {children}
          </main>
        </div>
      </div>
      <BottomNav />
    </div>
  )
}
