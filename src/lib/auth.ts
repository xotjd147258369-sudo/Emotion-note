import type { SupabaseClient, User } from "@supabase/supabase-js"
import { createClient } from "@supabase/supabase-js"
import { redirect } from "next/navigation"
import { cache } from "react"

import type { Database } from "@/lib/database.types"
import { getSupabaseEnv } from "@/lib/env"
import { createSupabaseServerClient } from "@/lib/supabase/server"

type AppSupabaseClient = SupabaseClient<Database>
type Profile = Database["public"]["Tables"]["profiles"]["Row"]

function createSupabaseUserClient(accessToken: string) {
  const { url, anonKey, isConfigured } = getSupabaseEnv()

  if (!isConfigured || !url || !anonKey) {
    return null
  }

  return createClient<Database>(url, anonKey, {
    accessToken: async () => accessToken,
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  })
}

export async function ensureProfile(
  supabase: AppSupabaseClient,
  user: User
): Promise<Profile | null> {
  const { data: existingProfile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle()

  if (existingProfile) {
    return existingProfile
  }

  const metadata = user.user_metadata ?? {}
  const displayName =
    typeof metadata.full_name === "string"
      ? metadata.full_name
      : typeof metadata.name === "string"
        ? metadata.name
        : user.email?.split("@")[0] ?? "감정 노트 사용자"

  const avatarUrl =
    typeof metadata.avatar_url === "string" ? metadata.avatar_url : null

  const { data: insertedProfile } = await supabase
    .from("profiles")
    .insert({
      id: user.id,
      display_name: displayName,
      avatar_url: avatarUrl,
      timezone: "Asia/Seoul",
      updated_at: new Date().toISOString(),
    })
    .select("*")
    .maybeSingle()

  if (insertedProfile) {
    return insertedProfile
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle()

  return profile
}

export const getAuthContext = cache(async function getAuthContext() {
  const supabase = await createSupabaseServerClient()

  if (!supabase) {
    return {
      missingConfig: true as const,
      supabase: null,
      user: null,
    }
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()
  const {
    data: { session },
  } = await supabase.auth.getSession()
  const userSupabase = session?.access_token
    ? createSupabaseUserClient(session.access_token)
    : null
  const dataSupabase = userSupabase ?? supabase

  const profile = user ? await ensureProfile(dataSupabase, user) : null

  return {
    missingConfig: false as const,
    supabase: dataSupabase,
    authSupabase: supabase,
    user,
    profile,
  }
})

export async function requireAuth() {
  const context = await getAuthContext()

  if (context.missingConfig) {
    throw new Error("Supabase environment variables are not configured.")
  }

  if (!context.user) {
    redirect("/login")
  }

  return {
    supabase: context.supabase,
    authSupabase: context.authSupabase,
    user: context.user,
    profile: context.profile,
  }
}
