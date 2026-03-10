"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { useI18n } from "@/lib/i18n"

export function CtaSection() {
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

  const getButtonProps = useMemo(() => {
    if (!auth.authenticated) {
      return {
        href: "/signup",
        text: "Boshlash",
        showArrow: true,
      }
    }
    if (auth.role === "business") {
      return {
        href: "/business/dashboard",
        text: "Dashboardga o'tish",
        showArrow: true,
      }
    }
    if (auth.role === "blogger") {
      return {
        href: "/blogger/dashboard",
        text: "Profilni tahrirlash",
        showArrow: false,
      }
    }
    return {
      href: "/",
      text: "Boshlash",
      showArrow: true,
    }
  }, [auth.authenticated, auth.role])

  const buttonProps = getButtonProps

  return (
    <section className="px-4 py-16 lg:px-6 lg:py-24">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-balance text-2xl font-bold text-foreground sm:text-3xl">
          {tr("cta.title")}
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-pretty text-muted-foreground">
          {tr("cta.description")}
        </p>
        <div className="mt-8">
          <Button
            asChild
            size="lg"
            className="bg-blue-600 dark:bg-blue-500 font-semibold text-white shadow-lg shadow-blue-600/20 dark:shadow-blue-500/20 transition-all hover:bg-blue-700 dark:hover:bg-blue-600 gap-2"
          >
            <Link href={buttonProps.href}>
              {buttonProps.text}
              {buttonProps.showArrow && <ArrowRight className="size-4" />}
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
