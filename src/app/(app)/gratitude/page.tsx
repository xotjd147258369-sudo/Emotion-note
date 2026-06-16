import { HeartHandshake, Plus } from "lucide-react"

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
  createGratitudeNote,
  deleteGratitudeNote,
  updateGratitudeNote,
} from "@/lib/actions"
import { formatKoreanDate, todayInSeoul } from "@/lib/dates"
import { requireAuth } from "@/lib/auth"

export const dynamic = "force-dynamic"

export default async function GratitudePage() {
  const { supabase } = await requireAuth()
  const { data: notes } = await supabase
    .from("gratitude_notes")
    .select("*")
    .order("note_date", { ascending: false })
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-6">
      <section>
        <p className="text-sm text-muted-foreground">감사노트</p>
        <h2 className="mt-1 text-2xl font-semibold tracking-tight">
          오늘 고마웠던 것을 남기기
        </h2>
      </section>

      <Card className="border-emerald-200/80 bg-emerald-50/75">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="size-4" /> 새 감사노트
          </CardTitle>
          <CardDescription>하루에 하나만 적어도 충분합니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={createGratitudeNote} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="note_date">날짜</Label>
              <Input
                id="note_date"
                name="note_date"
                type="date"
                defaultValue={todayInSeoul()}
              />
            </div>
            <div className="grid gap-3">
              <div className="space-y-2">
                <Label htmlFor="item_1">감사 1</Label>
                <Input id="item_1" name="item_1" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="item_2">감사 2</Label>
                <Input id="item_2" name="item_2" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="item_3">감사 3</Label>
                <Input id="item_3" name="item_3" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="note">메모</Label>
              <Textarea
                id="note"
                name="note"
                className="min-h-24"
                placeholder="조금 더 남기고 싶은 마음"
              />
            </div>
            <Button type="submit" className="w-full md:w-auto">
              감사노트 저장
            </Button>
          </form>
        </CardContent>
      </Card>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold">감사 목록</h3>
          <Badge variant="secondary">{notes?.length ?? 0}개</Badge>
        </div>

        {notes && notes.length > 0 ? (
          <div className="space-y-3">
            {notes.map((note) => (
              <Card key={note.id} className="border-emerald-100/90 bg-white/70">
                <CardHeader>
                  <CardDescription>
                    {formatKoreanDate(note.note_date)}
                  </CardDescription>
                  <CardTitle>{note.items[0]}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2 text-sm leading-6">
                    {note.items.map((item) => (
                      <li key={item} className="rounded-lg bg-emerald-50/80 px-3 py-2">
                        {item}
                      </li>
                    ))}
                  </ul>
                  {note.note && (
                    <p className="whitespace-pre-wrap text-sm leading-7 text-muted-foreground">
                      {note.note}
                    </p>
                  )}

                  <details className="rounded-lg border border-emerald-100 bg-white/55 p-3">
                    <summary className="cursor-pointer text-sm font-medium">
                      수정
                    </summary>
                    <Separator className="my-3" />
                    <form action={updateGratitudeNote} className="space-y-3">
                      <input type="hidden" name="id" value={note.id} />
                      <Input
                        name="note_date"
                        type="date"
                        defaultValue={note.note_date}
                      />
                      <Input
                        name="item_1"
                        defaultValue={note.items[0] ?? ""}
                        required
                      />
                      <Input name="item_2" defaultValue={note.items[1] ?? ""} />
                      <Input name="item_3" defaultValue={note.items[2] ?? ""} />
                      <Textarea
                        name="note"
                        className="min-h-24"
                        defaultValue={note.note ?? ""}
                      />
                      <Button type="submit" className="w-full sm:w-auto">
                        수정 저장
                      </Button>
                    </form>
                    <form action={deleteGratitudeNote} className="mt-2">
                      <input type="hidden" name="id" value={note.id} />
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
            icon={<HeartHandshake className="size-5" />}
            title="감사노트가 없습니다"
            description="고마웠던 장면을 남기면 이곳에 차곡차곡 쌓입니다."
          />
        )}
      </section>
    </div>
  )
}
