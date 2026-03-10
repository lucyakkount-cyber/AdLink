"use client"

import { useI18n, type Locale } from "@/lib/i18n"
import { cn } from "@/lib/utils"

const locales: { code: Locale; label: string }[] = [
  { code: "uz", label: "UZ" },
  { code: "ru", label: "RU" },
]

export function LanguageSwitcher() {
  const { locale, setLocale } = useI18n()

  return (
    <div className="flex items-center rounded-lg border border-border bg-secondary/50 p-0.5">
      {locales.map((l) => (
        <button
          key={l.code}
          onClick={() => setLocale(l.code)}
          className={cn(
            "rounded-md px-2.5 py-1 text-xs font-semibold transition-all",
            locale === l.code
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {l.label}
        </button>
      ))}
    </div>
  )
}
