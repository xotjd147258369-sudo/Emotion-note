import { redirect } from "next/navigation"
import { BookOpenText, HeartHandshake, Sparkles } from "lucide-react"

import { LoginButtons } from "@/components/auth/login-buttons"
import { SetupRequired } from "@/components/app/setup-required"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getAuthContext } from "@/lib/auth"

export const dynamic = "force-dynamic"

export default async function LoginPage() {
  const context = await getAuthContext()

  if (context.missingConfig) {
    return <SetupRequired />
  }

  if (context.user) {
    redirect("/home")
  }

  return (
    <main className="min-h-dvh bg-background px-5 py-8 text-foreground">
      <div className="mx-auto flex min-h-[calc(100dvh-4rem)] w-full max-w-md flex-col justify-center">
        <div className="mb-7">
          <p className="text-sm text-muted-foreground">감정 노트</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            오늘의 마음을 조용히 남겨두세요
          </h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>시작하기</CardTitle>
          </CardHeader>
          <CardContent>
            <LoginButtons />
          </CardContent>
        </Card>

        <div className="mt-7 grid grid-cols-3 gap-2 text-center text-xs text-muted-foreground">
          <div className="rounded-lg border bg-card px-2 py-3">
            <BookOpenText className="mx-auto mb-2 size-4 text-emerald-700" />
            감정 일기
          </div>
          <div className="rounded-lg border bg-card px-2 py-3">
            <HeartHandshake className="mx-auto mb-2 size-4 text-rose-700" />
            감사노트
          </div>
          <div className="rounded-lg border bg-card px-2 py-3">
            <Sparkles className="mx-auto mb-2 size-4 text-amber-700" />
            문장 카드
          </div>
        </div>
      </div>
    </main>
  )
}
