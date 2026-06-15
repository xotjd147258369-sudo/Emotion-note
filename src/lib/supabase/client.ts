"use client"

import { createBrowserClient } from "@supabase/ssr"
import type { SupabaseClient } from "@supabase/supabase-js"

import type { Database } from "@/lib/database.types"

let client: SupabaseClient<Database> | null = null

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export function createSupabaseBrowserClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    return null
  }

  if (!client) {
    client = createBrowserClient<Database>(supabaseUrl, supabaseAnonKey)
  }

  return client
}
