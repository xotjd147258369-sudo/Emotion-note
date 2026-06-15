import { redirect } from "next/navigation"

import { getAuthContext } from "@/lib/auth"

export const dynamic = "force-dynamic"

export default async function IndexPage() {
  const { user } = await getAuthContext()

  if (user) {
    redirect("/home")
  }

  redirect("/login")
}
