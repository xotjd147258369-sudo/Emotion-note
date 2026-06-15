import { redirect } from "next/navigation"

import { AppShell } from "@/components/app/app-shell"
import { SetupRequired } from "@/components/app/setup-required"
import { getAuthContext } from "@/lib/auth"

export const dynamic = "force-dynamic"

export default async function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const context = await getAuthContext()

  if (context.missingConfig) {
    return <SetupRequired />
  }

  if (!context.user) {
    redirect("/login")
  }

  return <AppShell user={context.user}>{children}</AppShell>
}
