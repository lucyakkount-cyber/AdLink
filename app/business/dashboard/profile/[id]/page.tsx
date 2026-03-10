"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, MessageCircle, Instagram, Play, Mail, Users, DollarSign, Calendar } from "lucide-react"
import { useI18n } from "@/lib/i18n"
import { OrderBlogger } from "@/components/order-blogger"
import { ThemeToggle } from "@/components/theme-toggle"

interface BloggerProfile {
  userId: number
  email: string
  username: string
  audience: number | null
  price: number | null
  categories: string[]
  targetAudiences: string[]
  socials: string[]
  avatar?: string
  updatedAt: string
}

const socialIcons: Record<string, { icon: typeof MessageCircle; color: string }> = {
  Telegram: { icon: MessageCircle, color: "text-blue-500" },
  Instagram: { icon: Instagram, color: "text-pink-500" },
  TikTok: { icon: Play, color: "text-foreground" },
}

export default function BloggerProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { tr } = useI18n()
  const router = useRouter()
  const resolvedParams = React.use(params)
  const { id } = resolvedParams
  const [profile, setProfile] = useState<BloggerProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (id) {
      fetchProfile(id as string)
    }
  }, [id])

  const fetchProfile = async (bloggerId: string) => {
    console.log("Fetching profile for bloggerId:", bloggerId)
    try {
      // First, get all bloggers and find the one with matching userId
      const res = await fetch("/api/bloggers", { credentials: "include" })
      console.log("API response status:", res.status)
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        console.error("API error response:", errorData)
        throw new Error(errorData.error || "Failed to fetch bloggers")
      }
      
      const data = await res.json()
      console.log("API response data:", data)
      
      // Find blogger with matching userId
      const blogger = data.bloggers?.find((b: any) => b.userId === parseInt(bloggerId))
      console.log("Found blogger:", blogger)
      
      if (!blogger) {
        throw new Error("Blogger not found")
      }
      
      setProfile(blogger)
    } catch (err) {
      console.error("Fetch profile error:", err)
      setError(err instanceof Error ? err.message : "Failed to load profile")
    } finally {
      setLoading(false)
    }
  }

  const formatAudience = (n: number | null) => {
    if (typeof n !== "number") return "Noma'lum"
    if (n >= 1_000_000) return `${Math.round(n / 100_000) / 10}M`
    if (n >= 1000) return `${Math.round(n / 100) / 10}K`
    return String(n)
  }

  const formatPrice = (n: number | null) => {
    if (typeof n !== "number") return "Noma'lum"
    // Manual formatting to ensure spaces instead of commas
    return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + " so'm"
  }

  const initials = profile?.username?.slice(0, 2).toUpperCase() || "BL"

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="mx-auto max-w-4xl">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-6"></div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
              <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{tr("profile.not_found")}</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">{error || tr("profile.not_found_desc")}</p>
          <Button onClick={() => router.back()}>
            <ArrowLeft className="size-4 mr-2" />
            {tr("profile.back")}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="mx-auto max-w-4xl">
        {/* Back button and theme toggle */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          >
            <ArrowLeft className="size-4 mr-2" />
            {tr("profile.back")}
          </Button>
          <ThemeToggle />
        </div>

        {/* Profile Header */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-start gap-6">
              <Avatar className="size-24 border-4 border-white dark:border-gray-800 shadow-lg">
                {profile.avatar && profile.avatar.startsWith('data:') ? (
                  <img 
                    src={profile.avatar} 
                    alt={`${profile.username} avatar`} 
                    className="size-full object-cover rounded-full"
                    onError={(e) => {
                      console.error(`Failed to load avatar for ${profile.username}:`, e);
                      e.currentTarget.style.display = 'none';
                    }}
                    onLoad={() => {
                      console.log(`Avatar loaded successfully for ${profile.username}`);
                    }}
                  />
                ) : (
                  <AvatarFallback className="bg-blue-50 text-xl font-bold text-blue-600">
                    {initials}
                  </AvatarFallback>
                )}
              </Avatar>
              
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {profile.username || "Bloger"}
                </h1>
                <div className="flex items-center gap-2 text-gray-600 mb-4">
                  <Mail className="size-4" />
                  <span>{profile.email}</span>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  <Badge className="bg-blue-50 text-blue-600 border-blue-100">
                    <Users className="size-3 mr-1" />
                    {formatAudience(profile.audience)} {tr("profile.audience_count")}
                  </Badge>
                  <Badge className="bg-green-50 text-green-600 border-green-100">
                    <DollarSign className="size-3 mr-1" />
                    {formatPrice(profile.price)}
                  </Badge>
                  <Badge variant="outline">
                    {profile.categories?.length > 0 ? profile.categories.join(", ") : tr("profile.no_categories")}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Details */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Social Links */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="size-5" />
                {tr("profile.social_media")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {profile.socials.length > 0 ? (
                <div className="space-y-3">
                  {profile.socials.map((social, index) => {
                    const [platform, handle] = social.split(':')
                    const Icon = socialIcons[platform]?.icon || MessageCircle
                    const color = socialIcons[platform]?.color || "text-gray-500"
                    
                    return (
                      <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <Icon className={`size-5 ${color}`} />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{platform}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">{handle}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">{tr("profile.no_social_media")}</p>
              )}
            </CardContent>
          </Card>

          {/* Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="size-5" />
                {tr("profile.statistics")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <span className="text-gray-600 dark:text-gray-300">{tr("profile.audience_count")}</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {formatAudience(profile.audience)}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <span className="text-gray-600 dark:text-gray-300">{tr("profile.price_label")}</span>
                  <span className="font-semibold text-green-600 dark:text-green-400">
                    {formatPrice(profile.price)}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <span className="text-gray-600 dark:text-gray-300">{tr("profile.category_label")}</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {profile.categories?.length > 0 ? profile.categories.join(", ") : tr("profile.no_categories")}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <span className="text-gray-600 dark:text-gray-300">{tr("profile.updated_label")}</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {new Date(profile.updatedAt).toLocaleDateString("uz-UZ")}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Form */}
        <div className="mt-6">
          <OrderBlogger 
            blogger={{
              userId: profile.userId,
              username: profile.username,
              email: profile.email,
              audience: profile.audience || 0,
              price: profile.price || 0,
              categories: profile.categories || [],
              targetAudiences: profile.targetAudiences || [],
              socials: profile.socials
            }}
            onOrderSent={() => {
              // Optional: refresh or navigate after order
              console.log('Order sent successfully')
            }}
          />
        </div>
      </div>
    </div>
  )
}
