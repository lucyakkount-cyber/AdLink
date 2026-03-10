"use client"

import { X, Check } from "lucide-react"
import { useI18n } from "@/lib/i18n"

export function ProblemSection() {
  const { tr } = useI18n()

  const problems = [
    tr("problem.1"),
    tr("problem.2"),
    tr("problem.3"),
    tr("problem.4"),
  ]

  const solutions = [
    tr("solution.1"),
    tr("solution.2"),
    tr("solution.3"),
    tr("solution.4"),
  ]

  return (
    <section className="bg-secondary/50 dark:bg-gray-900/50 px-4 py-16 lg:px-6 lg:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Problem */}
          <div className="rounded-2xl border border-border bg-background p-8">
            <div className="mb-6">
              <span className="inline-block rounded-full bg-red-50 dark:bg-red-900/20 px-3 py-1 text-xs font-medium text-red-600 dark:text-red-400">
                {tr("problem.label")}
              </span>
              <h2 className="mt-3 text-balance text-2xl font-bold text-foreground sm:text-3xl">
                {tr("problem.title")}
              </h2>
            </div>
            <div className="flex flex-col gap-4">
              {problems.map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <div className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-red-50 dark:bg-red-900/20">
                    <X className="size-3.5 text-red-500 dark:text-red-400" />
                  </div>
                  <p className="text-muted-foreground">{item}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Solution */}
          <div className="rounded-2xl border border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-900/20 p-8">
            <div className="mb-6">
              <span className="inline-block rounded-full bg-blue-100 dark:bg-blue-900/30 px-3 py-1 text-xs font-medium text-blue-700 dark:text-blue-300">
                {tr("solution.label")}
              </span>
              <h2 className="mt-3 text-balance text-2xl font-bold text-foreground sm:text-3xl">
                {tr("solution.title")}
              </h2>
            </div>
            <div className="flex flex-col gap-4">
              {solutions.map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <div className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                    <Check className="size-3.5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <p className="text-foreground">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
