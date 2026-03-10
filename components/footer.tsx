"use client"

import Link from "next/link"
import { useI18n } from "@/lib/i18n"

export function Footer() {
  const { tr } = useI18n()

  return (
    <footer className="border-t border-border bg-secondary/50 dark:bg-gray-900/50">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-6 sm:flex-row lg:px-6">
        <div className="flex items-center gap-2">
          <div className="flex size-6 items-center justify-center rounded-md bg-blue-600 dark:bg-blue-500">
            <span className="text-xs font-bold text-white">A</span>
          </div>
          <p className="text-sm text-muted-foreground">{tr("footer.copy")}</p>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/business/dashboard"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            {tr("nav.business")}
          </Link>
          <Link
            href="/blogger/dashboard"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            {tr("nav.blogger")}
          </Link>
        </div>
      </div>
    </footer>
  )
}
