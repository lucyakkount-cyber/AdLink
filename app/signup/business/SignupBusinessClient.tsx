"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useI18n } from "@/lib/i18n"
import { Eye, EyeOff, Building } from "lucide-react"

export default function SignupBusinessClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { tr } = useI18n()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  const next = searchParams.get("next")

  const formatNumber = (value: string) => {
    const cleanValue = value.replace(/\s/g, '').replace(/,/g, '')
    if (!cleanValue) return ''
    const num = Number(cleanValue)
    if (isNaN(num)) return value
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
  }

  const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s/g, '').replace(/,/g, '')
    if (!value || /^\d+$/.test(value)) {
      e.target.value = formatNumber(value)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const form = new FormData(e.currentTarget)
    const email = String(form.get("email") || "")
    const password = String(form.get("password") || "")
    const companyName = String(form.get("companyName") || "")
    const niche = String(form.get("niche") || "")
    const budgetMin = String(form.get("budgetMin") || "").replace(/\s/g, '').replace(/,/g, '')
    const budgetMax = String(form.get("budgetMax") || "").replace(/\s/g, '').replace(/,/g, '')
    const description = String(form.get("description") || "")

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, password, role: "business" }),
        credentials: "include",
      })

      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null
        throw new Error(data?.error || "Signup failed")
      }

      const profileRes = await fetch("/api/business/profile", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          companyName,
          email,
          niche,
          budgetMin: Number(budgetMin) || 100000,
          budgetMax: Number(budgetMax) || 1000000,
          description
        }),
        credentials: "include",
      })

      if (!profileRes.ok) {
        throw new Error("Biznes profilini yaratishda xatolik yuz berdi")
      }

      const meRes = await fetch("/api/auth/me", { credentials: "include" })
      const me = await meRes.json()
      
      if (me.role === "business") {
        window.location.href = next || "/business/dashboard"
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
      <div className="flex items-center gap-2 mb-2">
        <Building className="size-6 text-blue-600 dark:text-blue-400" />
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
          Biznes akkauntini ochish
        </h1>
      </div>
      <p className="mt-1 text-muted-foreground">
        Biznes profilingizni yarating va blogerlarni toping
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
              Email *
            </Label>
            <Input id="email" name="email" type="email" required />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="password" className="text-sm font-medium text-foreground">
              Parol *
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

          <div className="border-t pt-4">
            <h3 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
              <Building className="size-4" />
              Biznes profili
            </h3>
            
            <div className="flex flex-col gap-2">
              <Label htmlFor="companyName" className="text-sm font-medium text-foreground">
                Kompaniya nomi *
              </Label>
              <Input id="companyName" name="companyName" placeholder="Kompaniya nomi" required />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="niche" className="text-sm font-medium text-foreground">
                Nisha
              </Label>
              <Input id="niche" name="niche" placeholder="Masalan: Texnologiya, Moda, Oziq-ovqat" />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="budgetMin" className="text-sm font-medium text-foreground">
                  Min. byudjet (so'm)
                </Label>
                <Input 
                  id="budgetMin" 
                  name="budgetMin" 
                  type="text" 
                  placeholder="100 000"
                  onChange={handleBudgetChange}
                  inputMode="numeric"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="budgetMax" className="text-sm font-medium text-foreground">
                  Maks. byudjet (so'm)
                </Label>
                <Input 
                  id="budgetMax" 
                  name="budgetMax" 
                  type="text" 
                  placeholder="1 000 000"
                  onChange={handleBudgetChange}
                  inputMode="numeric"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="description" className="text-sm font-medium text-foreground">
                Tavsif
              </Label>
              <Textarea id="description" name="description" placeholder="Biznesingiz haqida qisqacha ma'lumot..." rows={3} />
            </div>
          </div>

          <Button
            type="submit"
            className="bg-blue-600 dark:bg-blue-500 font-semibold text-white shadow-sm transition-all hover:bg-blue-700 dark:hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? "Yaratilmoqda..." : "Biznes akkauntini yaratish"}
          </Button>

          <p className="text-sm text-muted-foreground">
            Akkauntingiz bormi? {" "}
            <Link
              className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              href={`/login/business${next ? `?next=${encodeURIComponent(next)}` : ""}`}
            >
              Kirish
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
