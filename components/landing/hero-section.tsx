"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { useI18n } from "@/lib/i18n"

export function HeroSection() {
  const { tr } = useI18n()

  const [auth, setAuth] = useState<{ authenticated: boolean; role: string | null }>(
    { authenticated: false, role: null }
  )

  useEffect(() => {
    let cancelled = false
    fetch("/api/auth/me", { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return
        setAuth({
          authenticated: Boolean(data?.authenticated),
          role: data?.role ?? null,
        })
      })
      .catch(() => {
        if (cancelled) return
        setAuth({ authenticated: false, role: null })
      })
    return () => {
      cancelled = true
    }
  }, [])

  const showButtons = useMemo(() => {
    if (!auth.authenticated) return { business: true, blogger: true }
    if (auth.role === "business") return { business: true, blogger: false }
    if (auth.role === "blogger") return { business: false, blogger: true }
    return { business: false, blogger: false }
  }, [auth.authenticated, auth.role])

  const getButtonLinks = useMemo(() => {
    if (!auth.authenticated) {
      return {
        business: "/signup/business",
        blogger: "/signup/blogger",
      }
    }
    if (auth.role === "business") {
      return {
        business: "/business/dashboard",
        blogger: "/signup/blogger",
      }
    }
    if (auth.role === "blogger") {
      return {
        business: "/signup/business",
        blogger: "/blogger/dashboard",
      }
    }
    return {
      business: "/signup/business",
      blogger: "/signup/blogger",
    }
  }, [auth.authenticated, auth.role])

  const buttonLinks = getButtonLinks

  return (
    <section className="relative overflow-hidden px-4 py-20 lg:px-6 lg:py-28">
      {/* Background decoration */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2">
        <div className="h-[500px] w-[700px] rounded-full bg-blue-100/60 dark:bg-blue-900/20 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-4xl text-center">
        <div className="animate-fade-in-up">
          <span className="mb-4 inline-block rounded-full border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 px-4 py-1.5 text-xs font-medium tracking-wide text-blue-600 dark:text-blue-400">
            {tr("hero.badge")}
          </span>
        </div>

        <h1 className="animate-fade-in-up-delay-1 text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          {tr("hero.title1")}
          <br />
          <span className="text-blue-600 dark:text-blue-400">{tr("hero.title2")}</span>
        </h1>

        <p className="animate-fade-in-up-delay-2 mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
          {tr("hero.description")}
        </p>

        <div className="animate-fade-in-up-delay-3 mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          {showButtons.business && (
            <Button
              asChild
              size="lg"
              className="bg-blue-600 font-semibold text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-700 gap-2"
            >
              <Link href={buttonLinks.business}>
                {tr("hero.cta_business")}
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          )}
          {showButtons.blogger && (
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-border text-foreground transition-all hover:bg-secondary"
            >
              <Link href={buttonLinks.blogger}>{tr("hero.cta_blogger")}</Link>
            </Button>
          )}
        </div>
      </div>
    </section>
  )
}
