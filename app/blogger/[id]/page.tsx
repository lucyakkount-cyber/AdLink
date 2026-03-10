"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MessageCircle, Instagram, Play, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface BloggerProfile {
  userId: number
  username: string
  audience: number
  price: number
  category: string
  socials: string[]
  updatedAt: string
}

const socialIcons: Record<string, { icon: typeof MessageCircle; color: string }> = {
  Telegram: { icon: MessageCircle, color: "text-blue-500" },
  Instagram: { icon: Instagram, color: "text-pink-500" },
  TikTok: { icon: Play, color: "text-foreground" },
}

export default function BloggerProfilePage() {
  const params = useParams()
  const [profile, setProfile] = useState<BloggerProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`/api/bloggers/${params.id}`, { credentials: "include" })
        if (!res.ok) {
          throw new Error("Profile not found")
        }
        const data = await res.json()
        setProfile(data.profile)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load profile")
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchProfile()
    }
  }, [params.id])

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10 lg:px-6 lg:py-16">
        <div className="animate-pulse">
          <div className="h-8 w-32 rounded bg-gray-200"></div>
          <div className="mt-8 h-64 rounded-2xl bg-gray-200"></div>
        </div>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10 lg:px-6 lg:py-16">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground">Profile not found</h1>
          <p className="mt-2 text-muted-foreground">{error}</p>
          <Link href="/business/dashboard">
            <Button className="mt-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const initials = profile.username.slice(0, 2).toUpperCase()

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 lg:px-6 lg:py-16">
      <Link href="/business/dashboard">
        <Button variant="ghost" className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
      </Link>

      <div className="rounded-2xl border border-border bg-background p-8 shadow-lg">
        <div className="flex flex-col gap-8 md:flex-row md:items-start">
          {/* Avatar and basic info */}
          <div className="flex flex-col items-center gap-4 md:items-start">
            <Avatar className="size-24 border-4 border-blue-100">
              <AvatarFallback className="bg-blue-50 text-2xl font-bold text-blue-600">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold text-foreground">{profile.username}</h1>
              <p className="mt-1 text-lg text-muted-foreground">{profile.category}</p>
            </div>
          </div>

          {/* Stats and details */}
          <div className="flex-1">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Audience</h3>
                <p className="mt-1 text-2xl font-bold text-foreground">
                  {profile.audience.toLocaleString()}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Price per post</h3>
                <p className="mt-1 text-2xl font-bold text-green-600">
                  {profile.price.toLocaleString("uz-UZ")} so'm
                </p>
              </div>
            </div>

            {/* Social media */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-foreground">Social Media</h3>
              <div className="mt-3 flex flex-wrap gap-3">
                {profile.socials.map((social) => {
                  const s = socialIcons[social]
                  if (!s) return null
                  return (
                    <div
                      key={social}
                      className="flex items-center gap-2 rounded-lg border border-border bg-secondary/50 px-3 py-2"
                    >
                      <s.icon className={`size-5 ${s.color}`} />
                      <span className="font-medium text-foreground">{social}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Contact button */}
            <div className="mt-8">
              <Button size="lg" className="w-full bg-blue-600 hover:bg-blue-700">
                Contact Blogger
              </Button>
            </div>
          </div>
        </div>

        {/* Last updated */}
        <div className="mt-8 border-t border-border pt-6">
          <p className="text-sm text-muted-foreground">
            Last updated: {new Date(profile.updatedAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  )
}
