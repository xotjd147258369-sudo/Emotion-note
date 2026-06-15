import { BookOpenText, Plus } from "lucide-react"

import { EmptyState } from "@/components/app/empty-state"
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
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import {
  createEmotionEntry,
  deleteEmotionEntry,
  updateEmotionEntry,
} from "@/lib/actions"
import { formatKoreanDate, todayInSeoul } from "@/lib/dates"
import { requireAuth } from "@/lib/auth"

export const dynamic = "force-dynamic"

export default async function JournalPage() {
  const { supabase } = await requireAuth()
  const { data: entries } = await supabase
    .from("emotion_entries")
    .select("*")
    .order("entry_date", { ascending: false })
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-6">
      <section>
        <p className="text-sm text-muted-foreground">감정 일기</p>
        <h2 className="mt-1 text-2xl font-semibold tracking-tight">
          마음을 한 문단으로 정리하기
        </h2>
      </section>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="size-4" /> 새 기록
          </CardTitle>
          <CardDescription>점수와 태그는 나중에 흐름을 볼 때 쓰입니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={createEmotionEntry} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-[140px_1fr]">
              <div className="space-y-2">
                <Label htmlFor="entry_date">날짜</Label>
                <Input
                  id="entry_date"
                  name="entry_date"
                  type="date"
                  defaultValue={todayInSeoul()}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mood_score">감정 점수</Label>
                <Input
                  id="mood_score"
                  name="mood_score"
                  type="number"
                  min={1}
                  max={5}
                  defaultValue={3}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="emotion_tags">감정 태그</Label>
              <Input
                id="emotion_tags"
                name="emotion_tags"
                placeholder="불안, 평온, 기대"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="situation">상황</Label>
              <Input
                id="situation"
                name="situation"
                placeholder="오늘 마음이 움직였던 장면"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="body">본문</Label>
              <Textarea
                id="body"
                name="body"
                className="min-h-32"
                placeholder="지금 마음에 남아 있는 것을 적어보세요."
                required
              />
            </div>

            <Button type="submit" className="w-full md:w-auto">
              감정 일기 저장
            </Button>
          </form>
        </CardContent>
      </Card>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold">기록 목록</h3>
          <Badge variant="secondary">{entries?.length ?? 0}개</Badge>
        </div>

        {entries && entries.length > 0 ? (
          <div className="space-y-3">
            {entries.map((entry) => (
              <Card key={entry.id}>
                <CardHeader>
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <CardDescription>
                        {formatKoreanDate(entry.entry_date)}
                      </CardDescription>
                      <CardTitle>감정 점수 {entry.mood_score} / 5</CardTitle>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {entry.emotion_tags.map((tag) => (
                        <Badge key={tag} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {entry.situation && (
                    <p className="rounded-lg bg-muted/50 px-3 py-2 text-sm text-muted-foreground">
                      {entry.situation}
                    </p>
                  )}
                  <p className="whitespace-pre-wrap text-sm leading-7">
                    {entry.body}
                  </p>

                  <details className="group rounded-lg border bg-muted/20 p-3">
                    <summary className="cursor-pointer text-sm font-medium">
                      수정
                    </summary>
                    <Separator className="my-3" />
                    <form action={updateEmotionEntry} className="space-y-3">
                      <input type="hidden" name="id" value={entry.id} />
                      <div className="grid gap-3 md:grid-cols-[140px_1fr]">
                        <Input
                          name="entry_date"
                          type="date"
                          defaultValue={entry.entry_date}
                        />
                        <Input
                          name="mood_score"
                          type="number"
                          min={1}
                          max={5}
                          defaultValue={entry.mood_score}
                        />
                      </div>
                      <Input
                        name="emotion_tags"
                        defaultValue={entry.emotion_tags.join(", ")}
                      />
                      <Input
                        name="situation"
                        defaultValue={entry.situation ?? ""}
                      />
                      <Textarea
                        name="body"
                        className="min-h-28"
                        defaultValue={entry.body}
                        required
                      />
                      <Button type="submit" className="w-full sm:w-auto">
                        수정 저장
                      </Button>
                    </form>
                    <form action={deleteEmotionEntry} className="mt-2">
                      <input type="hidden" name="id" value={entry.id} />
                      <Button
                        type="submit"
                        variant="destructive"
                        className="w-full sm:w-auto"
                      >
                        삭제
                      </Button>
                    </form>
                  </details>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<BookOpenText className="size-5" />}
            title="감정 일기가 없습니다"
            description="첫 기록을 남기면 이곳에 날짜순으로 정리됩니다."
          />
        )}
      </section>
    </div>
  )
}
