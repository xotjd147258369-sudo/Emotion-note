import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

import type { Database } from "@/lib/database.types"
import { getSupabaseEnv } from "@/lib/env"

export async function createSupabaseServerClient() {
  const { url, anonKey, isConfigured } = getSupabaseEnv()

  if (!isConfigured || !url || !anonKey) {
    return null
  }

  const cookieStore = await cookies()

  return createServerClient<Database>(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options)
          })
        } catch {
          // Server Components cannot set cookies; Route Handlers and Actions can.
        }
      },
    },
  })
}
