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
  { href: "/home", label: "홈", icon: Home },
  { href: "/journal", label: "감정 일기", icon: BookOpenText },
  { href: "/gratitude", label: "감사노트", icon: HeartHandshake },
  { href: "/cards", label: "문장 카드", icon: Sparkles },
  { href: "/settings", label: "설정", icon: Settings },
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
    <div className="min-h-dvh bg-background text-foreground">
      <div className="mx-auto grid min-h-dvh w-full max-w-6xl grid-cols-1 md:grid-cols-[220px_1fr]">
        <aside className="hidden border-r bg-muted/20 px-4 py-5 md:block">
          <Link href="/home" className="block px-2">
            <p className="text-lg font-semibold">감정 노트</p>
            <p className="mt-1 text-xs text-muted-foreground">차분한 기록장</p>
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
                    "w-full justify-start"
                  )}
                >
                  <Icon className="size-4" />
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </aside>

        <div className="flex min-w-0 flex-col">
          <header className="sticky top-0 z-30 border-b bg-background/95 px-5 py-3 backdrop-blur supports-backdrop-filter:bg-background/80 md:px-8">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">감정 노트</p>
                <h1 className="truncate text-base font-semibold">{name}</h1>
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
