import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

import type { Database } from "@/lib/database.types"
import { getSupabaseEnv } from "@/lib/env"

export async function updateSession(request: NextRequest) {
  const { url, anonKey, isConfigured } = getSupabaseEnv()
  let response = NextResponse.next({ request })

  if (!isConfigured || !url || !anonKey) {
    return response
  }

  const supabase = createServerClient<Database>(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value)
        })
        response = NextResponse.next({ request })
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options)
        })
      },
    },
  })

  await supabase.auth.getClaims()

  return response
}
