import { KeyRound } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function SetupRequired() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-background px-5 py-10">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-amber-100 text-amber-800">
            <KeyRound className="size-5" />
          </div>
          <CardTitle>Supabase 설정이 필요합니다</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm leading-6 text-muted-foreground">
          <p>
            `.env.local`에 `NEXT_PUBLIC_SUPABASE_URL`과
            `NEXT_PUBLIC_SUPABASE_ANON_KEY`를 추가하면 앱을 실행할 수 있습니다.
          </p>
          <p>
            Google과 Kakao OAuth Redirect URL은
            `http://localhost:3000/auth/callback`으로 설정하세요.
          </p>
        </CardContent>
      </Card>
    </main>
  )
}
