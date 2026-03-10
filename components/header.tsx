"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { cn } from "@/lib/utils"
import { useI18n } from "@/lib/i18n"
import { LanguageSwitcher } from "@/components/language-switcher"
import { ThemeToggle } from "@/components/theme-toggle"

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()
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

  const navLinks = useMemo(() => {
    if (!auth.authenticated) {
      return [
        { label: tr("nav.business"), href: "/business/dashboard" },
        { label: tr("nav.blogger"), href: "/blogger/dashboard" },
      ]
    }

    if (auth.role === "business") {
      return [{ label: tr("nav.business"), href: "/business/dashboard" }]
    }

    if (auth.role === "blogger") {
      return [{ label: tr("nav.blogger"), href: "/blogger/dashboard" }]
    }

    return []
  }, [auth.authenticated, auth.role, tr])

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" })
    // Force page reload to clear header auth state immediately
    window.location.reload()
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 lg:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-lg bg-blue-600 dark:bg-blue-500">
            <span className="text-sm font-bold text-white">A</span>
          </div>
          <span className="text-xl font-bold text-foreground">AdLink</span>
          <span className="hidden rounded-full bg-secondary dark:bg-gray-800 px-2 py-0.5 text-[10px] font-medium text-muted-foreground sm:inline-block">
            MVP
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                pathname === link.href
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
          <div className="ml-3 flex items-center gap-3">
            <ThemeToggle />
            <LanguageSwitcher />

            {!auth.authenticated ? (
              <Link
                href="/signup"
                className="inline-flex items-center rounded-lg bg-blue-600 dark:bg-blue-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 dark:hover:bg-blue-600"
              >
                {tr("nav.start")}
              </Link>
            ) : (
              <>
                {auth.role === "business" ? (
                  <Link
                    href="/business/dashboard"
                    className="inline-flex items-center rounded-lg bg-blue-600 dark:bg-blue-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 dark:hover:bg-blue-600"
                  >
                    {tr("nav.business")}
                  </Link>
                ) : auth.role === "blogger" ? (
                  <Link
                    href="/blogger/dashboard"
                    className="inline-flex items-center rounded-lg bg-blue-600 dark:bg-blue-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 dark:hover:bg-blue-600"
                  >
                    {tr("nav.profile")}
                  </Link>
                ) : null}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex items-center rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
                >
                  {tr("nav.logout")}
                </button>
              </>
            )}
          </div>
        </nav>

        {/* Mobile toggle */}
        <div className="flex items-center gap-3 md:hidden">
          <LanguageSwitcher />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="text-foreground"
            aria-label={tr("nav.menu")}
          >
            {mobileOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <nav className="flex flex-col gap-1 border-t border-border bg-background px-4 py-4 md:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                pathname === link.href
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-4 pt-4 border-t border-border">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Theme</span>
              <ThemeToggle />
            </div>
          </div>
          {!auth.authenticated ? (
            <Link
              href="/signup"
              onClick={() => setMobileOpen(false)}
              className="mt-2 inline-flex items-center justify-center rounded-lg bg-blue-600 dark:bg-blue-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 dark:hover:bg-blue-600"
            >
              {tr("nav.start")}
            </Link>
          ) : (
            <>
              {auth.role === "business" ? (
                <Link
                  href="/business/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="mt-2 inline-flex items-center justify-center rounded-lg bg-blue-600 dark:bg-blue-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 dark:hover:bg-blue-600"
                >
                  {tr("nav.business")}
                </Link>
              ) : auth.role === "blogger" ? (
                <Link
                  href="/blogger/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="mt-2 inline-flex items-center justify-center rounded-lg bg-blue-600 dark:bg-blue-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 dark:hover:bg-blue-600"
                >
                  {tr("nav.profile")}
                </Link>
              ) : null}
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false)
                  void handleLogout()
                }}
                className="mt-2 inline-flex items-center justify-center rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
              >
                {tr("nav.logout")}
              </button>
            </>
          )}
        </nav>
      )}
    </header>
  )
}
