import { LogOut, ShieldCheck, UserRound } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signOutAction, updateProfileAction } from "@/lib/actions"
import { requireAuth } from "@/lib/auth"

export const dynamic = "force-dynamic"

export default async function SettingsPage() {
  const { supabase, user, profile } = await requireAuth()

  const [emotionCount, gratitudeCount, cardCount] = await Promise.all([
    supabase
      .from("emotion_entries")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id),
    supabase
      .from("gratitude_notes")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id),
    supabase
      .from("motivation_cards")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id),
  ])

  const provider = user.app_metadata.provider ?? "social"

  return (
    <div className="space-y-6">
      <section>
        <p className="text-sm text-muted-foreground">설정</p>
        <h2 className="mt-1 text-2xl font-semibold tracking-tight">
          계정과 기록 관리
        </h2>
      </section>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserRound className="size-4" /> 프로필
          </CardTitle>
          <CardDescription>앱 안에서 표시되는 이름입니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={updateProfileAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="display_name">표시 이름</Label>
              <Input
                id="display_name"
                name="display_name"
                defaultValue={profile?.display_name ?? ""}
                placeholder="감정 노트 사용자"
              />
            </div>
            <Button type="submit">저장</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="size-4" /> 로그인
          </CardTitle>
          <CardDescription>Google 또는 Kakao 소셜 로그인만 사용합니다.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border px-4 py-3 text-sm">
            <span>연결된 제공자</span>
            <Badge variant="secondary">{provider}</Badge>
          </div>
          <form action={signOutAction}>
            <Button type="submit" variant="outline" className="w-full md:w-auto">
              <LogOut className="size-4" /> 로그아웃
            </Button>
          </form>
        </CardContent>
      </Card>

      <section className="space-y-3">
        <h3 className="text-base font-semibold">기록 수</h3>
        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-lg border bg-card px-4 py-3">
            <p className="text-sm text-muted-foreground">감정 일기</p>
            <p className="mt-2 text-2xl font-semibold">
              {emotionCount.count ?? 0}
            </p>
          </div>
          <div className="rounded-lg border bg-card px-4 py-3">
            <p className="text-sm text-muted-foreground">감사노트</p>
            <p className="mt-2 text-2xl font-semibold">
              {gratitudeCount.count ?? 0}
            </p>
          </div>
          <div className="rounded-lg border bg-card px-4 py-3">
            <p className="text-sm text-muted-foreground">문장 카드</p>
            <p className="mt-2 text-2xl font-semibold">{cardCount.count ?? 0}</p>
          </div>
        </div>
      </section>

    </div>
  )
}
