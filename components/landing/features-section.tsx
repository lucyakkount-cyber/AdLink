"use client"

import { Sparkles, FileText, Globe, BarChart3 } from "lucide-react"
import { useI18n } from "@/lib/i18n"

export function FeaturesSection() {
  const { tr } = useI18n()

  const features = [
    {
      icon: Sparkles,
      titleKey: "features.ai.title",
      descKey: "features.ai.desc",
    },
    {
      icon: FileText,
      titleKey: "features.text.title",
      descKey: "features.text.desc",
    },
    {
      icon: Globe,
      titleKey: "features.platforms.title",
      descKey: "features.platforms.desc",
    },
    {
      icon: BarChart3,
      titleKey: "features.analytics.title",
      descKey: "features.analytics.desc",
    },
  ]

  return (
    <section className="px-4 py-16 lg:px-6 lg:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <span className="inline-block rounded-full bg-blue-50 dark:bg-blue-900/20 px-3 py-1 text-xs font-medium text-blue-600 dark:text-blue-400">
            {tr("features.label")}
          </span>
          <h2 className="mt-4 text-balance text-2xl font-bold text-foreground sm:text-3xl">
            {tr("features.title")}
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {features.map((feature) => (
            <div
              key={feature.titleKey}
              className="group rounded-2xl border border-border bg-background p-6 transition-all duration-300 hover:border-blue-200 dark:hover:border-blue-800 hover:shadow-lg hover:shadow-blue-600/5"
            >
              <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-900/20">
                <feature.icon className="size-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">
                {tr(feature.titleKey)}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {tr(feature.descKey)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
