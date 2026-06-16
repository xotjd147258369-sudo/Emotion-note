import { Skeleton } from "@/components/ui/skeleton"

export default function AppLoading() {
  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-white/70 bg-white/45 px-5 py-5 shadow-sm backdrop-blur">
        <Skeleton className="h-4 w-28 bg-rose-100" />
        <Skeleton className="mt-3 h-8 w-56 bg-amber-100" />
      </section>

      <section className="grid gap-3 md:grid-cols-3">
        <Skeleton className="h-32 rounded-lg bg-rose-100/80" />
        <Skeleton className="h-32 rounded-lg bg-emerald-100/80" />
        <Skeleton className="h-32 rounded-lg bg-amber-100/80" />
      </section>

      <Skeleton className="h-48 rounded-lg bg-sky-100/75" />
    </div>
  )
}
