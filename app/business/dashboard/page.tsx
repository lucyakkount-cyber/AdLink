"use client"

import { useState } from "react"
import Link from "next/link"
import { SearchForm } from "@/components/business/search-form"
import { BookOpen } from "lucide-react"
import { BloggerCard } from "@/components/business/blogger-card"
import { BloggerSkeleton } from "@/components/business/blogger-skeleton"
import { Search, Brain, Package } from "lucide-react"
import { useI18n } from "@/lib/i18n"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

type BloggerApiRow = {
  id: number
  userId: number
  email: string
  username: string
  audience: number | null
  price: number | null
  category: string
  socials: string[]
  avatar?: string
  updatedAt: string | null
}

type BloggerCardModel = {
  name: string
  initials: string
  audience: string
  price: string
  socials: string[]
  aiText: string
  avatar?: string
  userId?: number
}

function initialsOf(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  const first = parts[0]?.[0] ?? "?"
  const second = parts[1]?.[0] ?? ""
  return (first + second).toUpperCase()
}

function formatAudience(n: number | null) {
  if (typeof n !== "number") return ""
  if (n >= 1_000_000) return `${Math.round(n / 100_000) / 10}M`
  if (n >= 1000) return `${Math.round(n / 100) / 10}K`
  return String(n)
}

function formatPrice(n: number | null) {
  if (typeof n !== "number") return ""
  return `${n.toLocaleString("ru-RU")} so’m`
}

export default function BusinessDashboard() {
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<BloggerCardModel[] | null>(null)
  const { tr } = useI18n()
  const [aiStatus, setAiStatus] = useState<'idle' | 'working' | 'success' | 'error'>('idle')

  // AI Matching form state
  const [aiFormData, setAiFormData] = useState({
    productCategory: "",
    budgetMin: "",
    budgetMax: "",
    goal: "",
    platforms: [] as string[]
  })

  const handleSearch = async (data: {
    budgetMin: string
    budgetMax: string
    description: string
    goal: string
    platforms: string[]
  }) => {
    setIsLoading(true)
    setResults(null)

    try {
      const res = await fetch("/api/bloggers", { credentials: "include" })
      const dataRes = (await res.json().catch(() => null)) as
        | { bloggers?: BloggerApiRow[]; error?: string }
        | null

      if (!res.ok) {
        throw new Error(dataRes?.error || "Failed to load bloggers")
      }

      const bloggers = Array.isArray(dataRes?.bloggers) ? dataRes.bloggers : []

      // Filter by platforms if selected
      const filteredBloggers = data.platforms.length > 0 
        ? bloggers.filter(blogger => {
            const bloggerPlatforms = blogger.socials.map(s => s.split(':')[0].toLowerCase())
            return data.platforms.some(platform => 
              bloggerPlatforms.includes(platform.toLowerCase())
            )
          })
        : bloggers

      const mapped = filteredBloggers.map((b) => {
        const name = b.username?.trim() ? b.username : b.email
        return {
          name,
          initials: initialsOf(name),
          audience: formatAudience(b.audience),
          price: formatPrice(b.price),
          socials: Array.isArray(b.socials) ? b.socials : [],
          aiText: "",
          avatar: b.avatar,
          userId: b.userId,
        } satisfies BloggerCardModel
      })

      setResults(mapped)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAIMatching = async () => {
    if (!aiFormData.productCategory.trim()) {
      alert("Iltimos, mahsulotni tasvirlab bering")
      return
    }

    setIsLoading(true)
    setResults(null)
    setAiStatus('working')

    try {
      const response = await fetch("/api/ai/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          productCategory: aiFormData.productCategory,
          targetAudience: aiFormData.goal || "Umumiy auditoriya",
          budget: {
            min: parseInt(aiFormData.budgetMin) || 500000,
            max: parseInt(aiFormData.budgetMax) || 1000000
          },
          description: aiFormData.productCategory,
          platforms: aiFormData.platforms
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || "AI matching failed")
      }

      const data = await response.json()
      // Convert AI matches to BloggerCardModel format
      const bloggers: BloggerCardModel[] = data.matches.map((match: any) => {
        const name = match.blogger.username?.trim() ? match.blogger.username : match.blogger.email
        return {
          name,
          initials: initialsOf(name),
          audience: formatAudience(match.blogger.audience),
          price: formatPrice(match.blogger.price),
          socials: Array.isArray(match.blogger.socials) ? match.blogger.socials : [],
          aiText: `AI mosligi: ${match.matchScore}%`,
          avatar: match.blogger.avatar,
          userId: match.blogger.userId,
        }
      })
      
      setResults(bloggers)
      setAiStatus('success')
      
      if (data.totalFound > 0) {
        console.log(`✅ AI muvaffaqiyatli ishladi! ${data.totalFound} ta blogger topildi`)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred"
      console.log("❌ AI xatolik:", errorMessage)
      setAiStatus('error')
      setResults([])
    } finally {
      setIsLoading(false)
      setTimeout(() => {
        if (aiStatus === 'success' || aiStatus === 'error') {
          setAiStatus('idle')
        }
      }, 3000)
    }
  }

  const togglePlatform = (platform: string) => {
    setAiFormData(prev => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter(p => p !== platform)
        : [...prev.platforms, platform]
    }))
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 lg:px-6 lg:py-16">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
              {tr("dashboard.title")}
            </h1>
            <p className="mt-1 text-muted-foreground">
              {tr("dashboard.subtitle")}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/business/dashboard/orders">
              <Button variant="outline" className="flex items-center gap-2">
                <Package className="size-4" />
                {tr("nav.orders")}
              </Button>
            </Link>
            <Link href="/business/dashboard/learn">
              <Button variant="outline" className="flex items-center gap-2">
                <BookOpen className="size-4" />
                To'liq o'rganish
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[400px_1fr]">
        {/* Search form */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <SearchForm onSubmit={handleSearch} isLoading={isLoading} />
        </div>

        {/* Results */}
        <div>
          {isLoading && (
            <div className="grid gap-4 sm:grid-cols-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <BloggerSkeleton key={i} />
              ))}
            </div>
          )}

          {results && !isLoading && (
            <div className="space-y-6">
              {/* Results Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-foreground">
                    {tr("dashboard.found_bloggers")}
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    {tr("dashboard.all_bloggers")}
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setResults(null)
                    setAiStatus('idle')
                  }}
                >
                  {tr("dashboard.new_search_btn")}
                </Button>
              </div>

              {/* Results Grid */}
              <div className="grid gap-4 sm:grid-cols-2">
                {results.map((blogger) => (
                  <Card key={blogger.name} className="relative overflow-hidden min-h-[200px]">
                    <CardContent className="p-4 h-full flex flex-col">
                      <div className="flex items-start gap-3 flex-1">
                        {/* Avatar */}
                        <div className="flex-shrink-0">
                          {blogger.avatar ? (
                            <img
                              src={blogger.avatar}
                              alt={blogger.name}
                              className="size-12 rounded-full object-cover"
                            />
                          ) : (
                            <div className="size-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                              <span className="text-blue-600 dark:text-blue-300 font-medium text-sm">
                                {blogger.initials}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Blogger Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-foreground truncate break-words">
                            {blogger.name}
                          </h3>
                          <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground flex-wrap">
                            <span className="truncate">{blogger.audience}</span>
                            <span className="truncate">{blogger.price}</span>
                          </div>

                          {/* Social Links */}
                          <div className="flex gap-2 mt-2 flex-wrap">
                            {blogger.socials.slice(0, 3).map((social, index) => {
                              const platform = social.split(':')[0]
                              const username = social.split(':')[1]
                              return (
                                <span
                                  key={index}
                                  className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${
                                    platform === 'telegram' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' :
                                    platform === 'instagram' ? 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300' :
                                    'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                                  }`}
                                >
                                  {platform}
                                </span>
                              )
                            })}
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 mt-4 flex-shrink-0">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex-1 text-xs whitespace-nowrap"
                          onClick={() => window.location.href = `/business/dashboard/profile/${blogger.userId}`}
                        >
                          {tr("dashboard.view_profile")}
                        </Button>
                        <Button 
                          size="sm" 
                          className="flex-1 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-xs whitespace-nowrap"
                          onClick={() => window.location.href = `/business/dashboard/profile/${blogger.userId}`}
                        >
                          {tr("dashboard.send_order")}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* No Results Message */}
              {results.length === 0 && (
                <div className="text-center py-12">
                  <Brain className="size-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    {tr("dashboard.no_bloggers")}
                  </h3>
                  <p className="text-muted-foreground">
                    {tr("dashboard.change_criteria")}
                  </p>
                  <div className="mt-4">
                    <Link href="/business/dashboard/ai-matching">
                      <Button className="bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600">
                        <Brain className="size-4 mr-2" />
                        {tr("dashboard.ai_search")}
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}

          {!results && !isLoading && (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-20">
              <div className="mb-4 flex size-16 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-900/20">
                <Search className="size-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                {tr("dashboard.empty.title")}
              </h3>
              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                {tr("dashboard.empty.desc")}
              </p>
              <div className="mt-6">
                <Link href="/business/dashboard/ai-matching">
                  <Button className="bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600">
                    <Brain className="size-4 mr-2" />
                    {tr("dashboard.ai_search")}
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
