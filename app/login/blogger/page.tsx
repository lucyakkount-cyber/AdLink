"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Eye, EyeOff } from "lucide-react"

export default function BloggerLoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

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
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      })

      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null
        if (data?.error === "User not found or password incorrect") {
          throw new Error("Bloger akkaunti topilmadi. Iltimos, avval ro'yxatdan o'ting.")
        }
        throw new Error(data?.error || "Login failed")
      }

      // Get user role after login and verify it's blogger
      const meRes = await fetch("/api/auth/me", { credentials: "include" })
      const me = await meRes.json()
      
      if (me.role !== "blogger") {
        // Clear the invalid session
        await fetch("/api/auth/logout", { method: "POST", credentials: "include" })
        throw new Error("Bu email bloger akkauntiga tegishli emas. Biznes akkaunti uchun boshqa login sahifasidan foydalaning.")
      }
      
      window.location.href = next || "/blogger/dashboard"
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-10 lg:px-6 lg:py-16">
      <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
        Bloger akkauntiga kirish
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
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
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
            className="bg-blue-600 font-semibold text-white shadow-sm transition-all hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? "Kirilmoqda..." : "Bloger akkauntiga kirish"}
          </Button>

          <p className="text-sm text-muted-foreground">
            Akkauntingiz yo'qmi? {" "}
            <Link
              className="font-medium text-blue-600 hover:underline"
              href="/signup/blogger"
            >
              Bloger akkauntini yaratish
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
