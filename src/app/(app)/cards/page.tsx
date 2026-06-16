import { Sparkles, Star } from "lucide-react"

import { EmptyState } from "@/components/app/empty-state"
import { RandomCard } from "@/components/app/random-card"
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
  createMotivationCard,
  deleteMotivationCard,
  toggleFavoriteCard,
  updateMotivationCard,
} from "@/lib/actions"
import { formatKoreanDateTime } from "@/lib/dates"
import { requireAuth } from "@/lib/auth"
import { cn } from "@/lib/utils"

export const dynamic = "force-dynamic"

const themeClass = {
  sage: "border-emerald-200 bg-emerald-50/85",
  rose: "border-rose-200 bg-rose-50/85",
  amber: "border-amber-200 bg-amber-50/90",
  sky: "border-sky-200 bg-sky-50/85",
}

const selectClass =
  "h-9 w-full rounded-lg border border-input bg-white/70 px-3 text-sm shadow-inner shadow-amber-950/5 outline-none focus-visible:border-ring focus-visible:bg-white focus-visible:ring-3 focus-visible:ring-ring/25"

export default async function CardsPage() {
  const { supabase } = await requireAuth()
  const { data: cards } = await supabase
    .from("motivation_cards")
    .select("*")
    .order("is_favorite", { ascending: false })
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-6">
      <section>
        <p className="text-sm text-muted-foreground">동기부여 카드</p>
        <h2 className="mt-1 text-2xl font-semibold tracking-tight">
          다시 보고 싶은 문장 모으기
        </h2>
      </section>

      {cards && cards.length > 0 && <RandomCard cards={cards} />}

      <Card className="border-amber-200/80 bg-amber-50/75">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="size-4" /> 새 카드
          </CardTitle>
          <CardDescription>직접 쓴 문장만 저장합니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={createMotivationCard} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="text">문장</Label>
              <Textarea
                id="text"
                name="text"
                className="min-h-28"
                placeholder="오늘의 나에게 건네고 싶은 말"
                required
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="tags">태그</Label>
                <Input id="tags" name="tags" placeholder="용기, 회복, 집중" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="theme">테마</Label>
                <select id="theme" name="theme" className={selectClass}>
                  <option value="sage">차분한 초록</option>
                  <option value="rose">따뜻한 장미</option>
                  <option value="amber">부드러운 노랑</option>
                  <option value="sky">맑은 하늘</option>
                </select>
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input
                name="is_favorite"
                type="checkbox"
                className="size-4 rounded border-input"
              />
              즐겨찾기
            </label>
            <Button type="submit" className="w-full md:w-auto">
              카드 저장
            </Button>
          </form>
        </CardContent>
      </Card>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold">카드 보관함</h3>
          <Badge variant="secondary">{cards?.length ?? 0}개</Badge>
        </div>

        {cards && cards.length > 0 ? (
          <div className="grid gap-3 md:grid-cols-2">
            {cards.map((card) => (
              <article
                key={card.id}
                className={cn(
                  "rounded-lg border p-4 text-sm shadow-[0_18px_60px_-42px_oklch(0.35_0.08_35)]",
                  themeClass[card.theme]
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="whitespace-pre-wrap text-base font-medium leading-7">
                    {card.text}
                  </p>
                  <form action={toggleFavoriteCard}>
                    <input type="hidden" name="id" value={card.id} />
                    <input
                      type="hidden"
                      name="is_favorite"
                      value={String(card.is_favorite)}
                    />
                    <Button
                      type="submit"
                      variant="outline"
                      size="icon"
                      className="bg-white/70"
                      aria-label="즐겨찾기 전환"
                    >
                      <Star
                        className={cn(
                          "size-4",
                          card.is_favorite && "fill-amber-400 text-amber-500"
                        )}
                      />
                    </Button>
                  </form>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {card.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="bg-white/50">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <p className="mt-4 text-xs text-muted-foreground">
                  {formatKoreanDateTime(card.created_at)}
                </p>

                <details className="mt-4 rounded-lg border bg-white/55 p-3">
                  <summary className="cursor-pointer text-sm font-medium">
                    수정
                  </summary>
                  <Separator className="my-3" />
                  <form action={updateMotivationCard} className="space-y-3">
                    <input type="hidden" name="id" value={card.id} />
                    <Textarea
                      name="text"
                      className="min-h-24 bg-white/70"
                      defaultValue={card.text}
                      required
                    />
                    <Input
                      name="tags"
                      className="bg-white/70"
                      defaultValue={card.tags.join(", ")}
                    />
                    <select
                      name="theme"
                      className={cn(selectClass, "bg-white/70")}
                      defaultValue={card.theme}
                    >
                      <option value="sage">차분한 초록</option>
                      <option value="rose">따뜻한 장미</option>
                      <option value="amber">부드러운 노랑</option>
                      <option value="sky">맑은 하늘</option>
                    </select>
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        name="is_favorite"
                        type="checkbox"
                        className="size-4 rounded border-input"
                        defaultChecked={card.is_favorite}
                      />
                      즐겨찾기
                    </label>
                    <Button type="submit" className="w-full sm:w-auto">
                      수정 저장
                    </Button>
                  </form>
                  <form action={deleteMotivationCard} className="mt-2">
                    <input type="hidden" name="id" value={card.id} />
                    <Button
                      type="submit"
                      variant="destructive"
                      className="w-full sm:w-auto"
                    >
                      삭제
                    </Button>
                  </form>
                </details>
              </article>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<Sparkles className="size-5" />}
            title="저장된 카드가 없습니다"
            description="나중에 다시 보고 싶은 문장을 카드로 남겨보세요."
          />
        )}
      </section>
    </div>
  )
}
