"use client"

import { useState } from "react"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { createSupabaseBrowserClient } from "@/lib/supabase/client"

type Provider = "google" | "kakao"

export function LoginButtons() {
  const [pendingProvider, setPendingProvider] = useState<Provider | null>(null)
  const [error, setError] = useState("")
  const supabase = createSupabaseBrowserClient()

  async function signIn(provider: Provider) {
    setError("")

    if (!supabase) {
      setError("Supabase 환경변수가 설정되지 않았습니다.")
      return
    }

    setPendingProvider(provider)

    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (oauthError) {
      setError(oauthError.message)
      setPendingProvider(null)
    }
  }

  return (
    <div className="space-y-3">
      <Button
        className="h-11 w-full"
        type="button"
        onClick={() => signIn("google")}
        disabled={Boolean(pendingProvider)}
      >
        {pendingProvider === "google" && <Loader2 className="animate-spin" />}
        Google로 계속하기
      </Button>
      <Button
        className="h-11 w-full bg-[#FEE500] text-[#181600] hover:bg-[#F7D900]"
        type="button"
        onClick={() => signIn("kakao")}
        disabled={Boolean(pendingProvider)}
      >
        {pendingProvider === "kakao" && <Loader2 className="animate-spin" />}
        Kakao로 계속하기
      </Button>
      {error && (
        <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}
