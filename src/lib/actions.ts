"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import { todayInSeoul } from "@/lib/dates"
import { requireAuth } from "@/lib/auth"

function readText(formData: FormData, key: string) {
  const value = formData.get(key)
  return typeof value === "string" ? value.trim() : ""
}

function readTags(formData: FormData, key: string) {
  return readText(formData, key)
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean)
    .slice(0, 8)
}

function readId(formData: FormData) {
  const id = readText(formData, "id")
  if (!id) {
    throw new Error("Missing record id.")
  }
  return id
}

function readMoodScore(formData: FormData) {
  const score = Number(readText(formData, "mood_score"))
  if (!Number.isFinite(score)) return 3
  return Math.min(5, Math.max(1, Math.round(score)))
}

function readTheme(formData: FormData) {
  const theme = readText(formData, "theme")
  if (theme === "rose" || theme === "amber" || theme === "sky") {
    return theme
  }
  return "sage"
}

function readGratitudeItems(formData: FormData) {
  return ["item_1", "item_2", "item_3"]
    .map((key) => readText(formData, key))
    .filter(Boolean)
}

export async function createEmotionEntry(formData: FormData) {
  const { supabase } = await requireAuth()
  const body = readText(formData, "body")

  if (!body) {
    throw new Error("감정 일기 본문을 입력해 주세요.")
  }

  const { error } = await supabase.from("emotion_entries").insert({
    mood_score: readMoodScore(formData),
    emotion_tags: readTags(formData, "emotion_tags"),
    situation: readText(formData, "situation") || null,
    body,
    entry_date: readText(formData, "entry_date") || todayInSeoul(),
  })

  if (error) throw new Error(error.message)

  revalidatePath("/home")
  revalidatePath("/journal")
}

export async function updateEmotionEntry(formData: FormData) {
  const { supabase, user } = await requireAuth()
  const id = readId(formData)
  const body = readText(formData, "body")

  if (!body) {
    throw new Error("감정 일기 본문을 입력해 주세요.")
  }

  const { error } = await supabase
    .from("emotion_entries")
    .update({
      mood_score: readMoodScore(formData),
      emotion_tags: readTags(formData, "emotion_tags"),
      situation: readText(formData, "situation") || null,
      body,
      entry_date: readText(formData, "entry_date") || todayInSeoul(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("user_id", user.id)

  if (error) throw new Error(error.message)

  revalidatePath("/home")
  revalidatePath("/journal")
}

export async function deleteEmotionEntry(formData: FormData) {
  const { supabase, user } = await requireAuth()
  const { error } = await supabase
    .from("emotion_entries")
    .delete()
    .eq("id", readId(formData))
    .eq("user_id", user.id)

  if (error) throw new Error(error.message)

  revalidatePath("/home")
  revalidatePath("/journal")
}

export async function createGratitudeNote(formData: FormData) {
  const { supabase } = await requireAuth()
  const items = readGratitudeItems(formData)

  if (items.length === 0) {
    throw new Error("감사 항목을 하나 이상 입력해 주세요.")
  }

  const { error } = await supabase.from("gratitude_notes").insert({
    items,
    note: readText(formData, "note") || null,
    note_date: readText(formData, "note_date") || todayInSeoul(),
  })

  if (error) throw new Error(error.message)

  revalidatePath("/home")
  revalidatePath("/gratitude")
}

export async function updateGratitudeNote(formData: FormData) {
  const { supabase, user } = await requireAuth()
  const items = readGratitudeItems(formData)

  if (items.length === 0) {
    throw new Error("감사 항목을 하나 이상 입력해 주세요.")
  }

  const { error } = await supabase
    .from("gratitude_notes")
    .update({
      items,
      note: readText(formData, "note") || null,
      note_date: readText(formData, "note_date") || todayInSeoul(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", readId(formData))
    .eq("user_id", user.id)

  if (error) throw new Error(error.message)

  revalidatePath("/home")
  revalidatePath("/gratitude")
}

export async function deleteGratitudeNote(formData: FormData) {
  const { supabase, user } = await requireAuth()
  const { error } = await supabase
    .from("gratitude_notes")
    .delete()
    .eq("id", readId(formData))
    .eq("user_id", user.id)

  if (error) throw new Error(error.message)

  revalidatePath("/home")
  revalidatePath("/gratitude")
}

export async function createMotivationCard(formData: FormData) {
  const { supabase } = await requireAuth()
  const text = readText(formData, "text")

  if (!text) {
    throw new Error("카드 문장을 입력해 주세요.")
  }

  const { error } = await supabase.from("motivation_cards").insert({
    text,
    tags: readTags(formData, "tags"),
    theme: readTheme(formData),
    is_favorite: formData.get("is_favorite") === "on",
  })

  if (error) throw new Error(error.message)

  revalidatePath("/home")
  revalidatePath("/cards")
}

export async function updateMotivationCard(formData: FormData) {
  const { supabase, user } = await requireAuth()
  const text = readText(formData, "text")

  if (!text) {
    throw new Error("카드 문장을 입력해 주세요.")
  }

  const { error } = await supabase
    .from("motivation_cards")
    .update({
      text,
      tags: readTags(formData, "tags"),
      theme: readTheme(formData),
      is_favorite: formData.get("is_favorite") === "on",
      updated_at: new Date().toISOString(),
    })
    .eq("id", readId(formData))
    .eq("user_id", user.id)

  if (error) throw new Error(error.message)

  revalidatePath("/home")
  revalidatePath("/cards")
}

export async function toggleFavoriteCard(formData: FormData) {
  const { supabase, user } = await requireAuth()
  const current = readText(formData, "is_favorite") === "true"

  const { error } = await supabase
    .from("motivation_cards")
    .update({
      is_favorite: !current,
      updated_at: new Date().toISOString(),
    })
    .eq("id", readId(formData))
    .eq("user_id", user.id)

  if (error) throw new Error(error.message)

  revalidatePath("/home")
  revalidatePath("/cards")
}

export async function deleteMotivationCard(formData: FormData) {
  const { supabase, user } = await requireAuth()
  const { error } = await supabase
    .from("motivation_cards")
    .delete()
    .eq("id", readId(formData))
    .eq("user_id", user.id)

  if (error) throw new Error(error.message)

  revalidatePath("/home")
  revalidatePath("/cards")
}

export async function updateProfileAction(formData: FormData) {
  const { supabase, user } = await requireAuth()
  const displayName = readText(formData, "display_name")

  const { error } = await supabase
    .from("profiles")
    .upsert({
      id: user.id,
      display_name: displayName || "감정 노트 사용자",
      timezone: "Asia/Seoul",
      updated_at: new Date().toISOString(),
    }, {
      onConflict: "id",
    })

  if (error) throw new Error(error.message)

  revalidatePath("/", "layout")
  revalidatePath("/settings")
  revalidatePath("/home")
  redirect("/settings")
}

export async function signOutAction() {
  const { authSupabase } = await requireAuth()
  await authSupabase.auth.signOut()
  redirect("/login")
}
