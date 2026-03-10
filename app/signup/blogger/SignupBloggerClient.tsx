"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useI18n } from "@/lib/i18n"
import { Eye, EyeOff } from "lucide-react"

export default function SignupBloggerClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { tr } = useI18n()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  const next = searchParams.get("next")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const form = new FormData(e.currentTarget)
    const email = String(form.get("email") || "")
    const password = String(form.get("password") || "")

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, password, role: "blogger" }),
        credentials: "include",
      })

      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null
        throw new Error(data?.error || "Signup failed")
      }

      const meRes = await fetch("/api/auth/me", { credentials: "include" })
      const me = await meRes.json()
      
      if (me.role === "blogger") {
        window.location.href = next || "/blogger/dashboard"
      } else {
        window.location.href = next || "/"
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-10 lg:px-6 lg:py-16">
      <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
        Bloger akkauntini yaratish
      </h1>
      <p className="mt-1 text-muted-foreground">
        Bizneslar bilan hamkorlik qiling va daromad oling
      </p>

      {error && (
        <Alert variant="destructive" className="mt-6">
          <AlertTitle>Xatolik</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="mt-6 rounded-2xl border border-border bg-background p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <Label htmlFor="email" className="text-sm font-medium text-foreground">
              Email
            </Label>
            <Input id="email" name="email" type="email" required />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="password" className="text-sm font-medium text-foreground">
              Parol
            </Label>
            <div className="relative">
              <Input 
                id="password" 
                name="password" 
                type={showPassword ? "text" : "password"} 
                required 
                className="pr-10"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            className="bg-blue-600 dark:bg-blue-500 font-semibold text-white shadow-sm transition-all hover:bg-blue-700 dark:hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? "Yaratilmoqda..." : "Bloger akkauntini yaratish"}
          </Button>

          <p className="text-sm text-muted-foreground">
            Akkauntingiz bormi? {" "}
            <Link
              className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              href={`/login/blogger${next ? `?next=${encodeURIComponent(next)}` : ""}`}
            >
              Kirish
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
