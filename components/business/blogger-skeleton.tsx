import { Skeleton } from "@/components/ui/skeleton"

export function BloggerSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-background p-5">
      <div className="flex items-start gap-4">
        <Skeleton className="size-12 rounded-full" />
        <div className="flex-1">
          <Skeleton className="h-5 w-32" />
          <div className="mt-2 flex gap-2">
            <Skeleton className="h-5 w-24 rounded-full" />
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
        </div>
      </div>
      <div className="mt-4 flex gap-3">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-20" />
      </div>
      <Skeleton className="mt-4 h-10 w-full rounded-lg" />
    </div>
  )
}
