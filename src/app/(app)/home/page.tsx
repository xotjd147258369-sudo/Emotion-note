import Link from "next/link"
import {
  BookOpenText,
  CalendarDays,
  HeartHandshake,
  Sparkles,
} from "lucide-react"

import { EmptyState } from "@/components/app/empty-state"
import { RandomCard } from "@/components/app/random-card"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { buttonVariants } from "@/components/ui/button"
import { formatKoreanDate, todayInSeoul } from "@/lib/dates"
import { requireAuth } from "@/lib/auth"
import { cn } from "@/lib/utils"

export const dynamic = "force-dynamic"

export default async function HomePage() {
  const { supabase } = await requireAuth()
  const today = todayInSeoul()

  const [emotionResult, gratitudeResult, cardsResult, recentResult] =
    await Promise.all([
      supabase
        .from("emotion_entries")
        .select("*")
        .eq("entry_date", today)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
      supabase
        .from("gratitude_notes")
        .select("*")
        .eq("note_date", today)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
      supabase
        .from("motivation_cards")
        .select("*")
        .order("is_favorite", { ascending: false })
        .order("created_at", { ascending: false })
        .limit(8),
      supabase
        .from("emotion_entries")
        .select("mood_score, entry_date")
        .order("entry_date", { ascending: false })
        .limit(7),
    ])

  const emotion = emotionResult.data
  const gratitude = gratitudeResult.data
  const cards = cardsResult.data ?? []
  const recent = recentResult.data ?? []
  const averageMood =
    recent.length > 0
      ? (
          recent.reduce((sum, entry) => sum + entry.mood_score, 0) /
          recent.length
        ).toFixed(1)
      : "-"

  return (
    <div className="space-y-6">
      <section className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarDays className="size-4" />
            {formatKoreanDate(today)}
          </div>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight">
            오늘의 기록
          </h2>
        </div>
        <Link
          href="/journal"
          className={cn(buttonVariants({ size: "lg" }), "w-full md:w-auto")}
        >
          <BookOpenText className="size-4" /> 감정 남기기
        </Link>
      </section>

      <section className="grid gap-3 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardDescription>오늘 감정</CardDescription>
            <CardTitle>{emotion ? `${emotion.mood_score} / 5` : "비어 있음"}</CardTitle>
          </CardHeader>
          <CardContent>
            {emotion ? (
              <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">
                {emotion.body}
              </p>
            ) : (
              <Link href="/journal" className="text-sm font-medium">
                기록하러 가기
              </Link>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>오늘 감사</CardDescription>
            <CardTitle>
              {gratitude ? `${gratitude.items.length}개` : "비어 있음"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {gratitude ? (
              <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">
                {gratitude.items.join(", ")}
              </p>
            ) : (
              <Link href="/gratitude" className="text-sm font-medium">
                감사 남기기
              </Link>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>최근 평균</CardDescription>
            <CardTitle>{averageMood}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-6 text-muted-foreground">
              최근 감정 일기 {recent.length}개의 평균 점수입니다.
            </p>
          </CardContent>
        </Card>
      </section>

      {cards.length > 0 ? (
        <RandomCard cards={cards} />
      ) : (
        <EmptyState
          icon={<Sparkles className="size-5" />}
          title="저장된 카드가 없습니다"
          description="문장 카드를 하나 남기면 홈에서 바로 꺼내볼 수 있습니다."
        />
      )}

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-base font-semibold">최근 감정 흐름</h3>
          <Badge variant="secondary">{recent.length}개</Badge>
        </div>
        {recent.length > 0 ? (
          <div className="space-y-2">
            {recent.map((entry) => (
              <div
                key={`${entry.entry_date}-${entry.mood_score}`}
                className="flex items-center justify-between rounded-lg border bg-card px-4 py-3 text-sm"
              >
                <span>{formatKoreanDate(entry.entry_date)}</span>
                <span className="font-medium">{entry.mood_score} / 5</span>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<HeartHandshake className="size-5" />}
            title="아직 흐름이 없습니다"
            description="감정 일기를 작성하면 최근 흐름이 여기에 쌓입니다."
          />
        )}
      </section>
    </div>
  )
}
