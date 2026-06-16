"use client"

import { useMemo, useState } from "react"
import { Shuffle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type MotivationCard = {
  id: string
  text: string
  tags: string[]
  theme: "sage" | "rose" | "amber" | "sky"
  is_favorite: boolean
}

const themeClass = {
  sage: "border-emerald-200 bg-emerald-50/85 text-emerald-950",
  rose: "border-rose-200 bg-rose-50/85 text-rose-950",
  amber: "border-amber-200 bg-amber-50/90 text-amber-950",
  sky: "border-sky-200 bg-sky-50/85 text-sky-950",
}

export function RandomCard({ cards }: { cards: MotivationCard[] }) {
  const [index, setIndex] = useState(0)
  const favoriteFirst = useMemo(
    () => [...cards].sort((a, b) => Number(b.is_favorite) - Number(a.is_favorite)),
    [cards]
  )
  const card = favoriteFirst[index]

  if (!card) return null

  return (
    <section
      className={cn(
        "rounded-lg border p-5 shadow-[0_18px_60px_-42px_oklch(0.35_0.08_35)]",
        themeClass[card.theme]
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <p className="text-base font-medium leading-7">{card.text}</p>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="bg-white/75"
          onClick={() => setIndex((value) => (value + 1) % favoriteFirst.length)}
          aria-label="다른 카드 보기"
        >
          <Shuffle className="size-4" />
        </Button>
      </div>
      {card.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          {card.tags.map((tag) => (
            <span key={tag} className="rounded-md bg-white/60 px-2 py-1">
              #{tag}
            </span>
          ))}
        </div>
      )}
    </section>
  )
}
