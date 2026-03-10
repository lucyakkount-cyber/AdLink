"use client"

import { useI18n } from "@/lib/i18n"

export function StepsSection() {
  const { tr } = useI18n()

  const steps = [
    { number: "01", key: "steps.1" },
    { number: "02", key: "steps.2" },
    { number: "03", key: "steps.3" },
    { number: "04", key: "steps.4" },
  ]

  return (
    <section className="bg-secondary/50 dark:bg-gray-900/50 px-4 py-16 lg:px-6 lg:py-24">
      <div className="mx-auto max-w-4xl">
        <div className="mb-12 text-center">
          <span className="inline-block rounded-full bg-blue-50 dark:bg-blue-900/20 px-3 py-1 text-xs font-medium text-blue-600 dark:text-blue-400">
            {tr("steps.label")}
          </span>
          <h2 className="mt-4 text-balance text-2xl font-bold text-foreground sm:text-3xl">
            {tr("steps.title")}
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <div
              key={step.number}
              className="relative rounded-2xl border border-border bg-background p-6 text-center"
            >
              <span className="mb-3 inline-block text-3xl font-bold text-blue-600 dark:text-blue-400">
                {step.number}
              </span>
              <p className="text-sm font-medium leading-relaxed text-foreground">
                {tr(step.key)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
