"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageCircle, Instagram, Play, Edit2, Save, X, Home, User, Settings, BarChart3, DollarSign, Users, TrendingUp } from "lucide-react"
import { useI18n } from "@/lib/i18n"
import { useRouter } from "next/navigation"
import { ThemeToggle } from "@/components/theme-toggle"
import { NotificationsPanel } from "@/components/notifications-panel"

interface BloggerProfile {
  userId: number
  email: string
  username: string
  audience: number
  price: number
  categories: string[]
  targetAudiences: string[]
  socials: string[]
  regions: string[]
  avatar?: string
  updatedAt: string
}

const socialIcons: Record<string, { icon: typeof MessageCircle; color: string }> = {
  Telegram: { icon: MessageCircle, color: "text-blue-500" },
  Instagram: { icon: Instagram, color: "text-pink-500" },
  TikTok: { icon: Play, color: "text-foreground" },
}

export default function BloggerDashboard() {
  const { tr } = useI18n()
  const router = useRouter()
  const [profile, setProfile] = useState<BloggerProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const [editForm, setEditForm] = useState({
    username: "",
    audience: "",
    price: "",
    categories: [""],
    targetAudiences: [""],
    socials: "",
    regions: [] as string[]
  })

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async (setLoadingState = true) => {
    try {
      if (setLoadingState) setLoading(true)
      const res = await fetch("/api/blogger/profile", { credentials: "include" })
      if (!res.ok) {
        throw new Error("Profile not found")
      }
      const data = await res.json()
      const profileData = data.profile
      setProfile(profileData)
      setEditForm({
        username: profileData?.username || "",
        audience: profileData?.audience?.toString() || "",
        price: profileData?.price?.toString() || "",
        categories: profileData?.categories || [""],
        targetAudiences: profileData?.targetAudiences || [""],
        socials: profileData?.socials?.join("\n") || "",
        regions: profileData?.regions || []
      })
    } catch (err) {
      console.error("Failed to fetch profile:", err)
      setError(tr("blogger_dashboard.error.load_profile"))
    } finally {
      if (setLoadingState) setLoading(false)
    }
  }

  const handleEdit = () => {
    setEditing(true)
    setSaved(false)
  }

  const handleCancel = () => {
    setEditing(false)
    if (profile) {
      setEditForm({
        username: profile.username || "",
        audience: profile.audience?.toString() || "",
        price: profile.price?.toString() || "",
        categories: profile.categories || [""],
        targetAudiences: profile.targetAudiences || [""],
        socials: profile.socials?.join("\n") || "",
        regions: profile.regions || []
      })
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setError(null)

    try {
      const updatedProfile = {
        username: editForm.username,
        audience: editForm.audience ? parseInt(editForm.audience) : null,
        price: editForm.price ? parseInt(editForm.price) : null,
        categories: editForm.categories,
        targetAudiences: editForm.targetAudiences,
        socials: editForm.socials.split("\n").map(s => s.trim()).filter(Boolean),
      }

      const res = await fetch("/api/blogger/profile", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(updatedProfile),
        credentials: "include",
      })

      if (!res.ok) {
        const data = await res.json().catch(() => null)
        throw new Error(data?.error || tr("common.save_failed"))
      }

      const data = await res.json()
      await fetchProfile(false) // Fetch updated profile after save without loading state
      setEditing(false)
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch (err) {
      setError(err instanceof Error ? err.message : tr("common.save_failed"))
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-pulse text-center">
            <div className="h-8 w-48 bg-gray-200 rounded mx-auto mb-4"></div>
            <div className="h-64 w-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  const initials = profile?.username?.slice(0, 2).toUpperCase() || "BL"

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-64 bg-background border-border hidden lg:block">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <Avatar className="size-10">
              {profile?.avatar && profile.avatar.startsWith('data:') ? (
                <img 
                  src={profile.avatar} 
                  alt="Avatar" 
                  className="size-full object-cover rounded-full"
                  onError={(e) => {
                    console.error("Dashboard avatar failed to load:", e);
                    e.currentTarget.style.display = 'none';
                  }}
                  onLoad={() => {
                    console.log("Dashboard avatar loaded successfully");
                  }}
                />
              ) : (
                <AvatarFallback className="bg-blue-50 text-blue-600 font-bold dark:bg-blue-900 dark:text-blue-300">
                  {initials}
                </AvatarFallback>
              )}
            </Avatar>
            <div>
              <h2 className="font-semibold text-foreground">{profile?.username || tr("blogger_dashboard.blogger_fallback")}</h2>
            </div>
          </div>

          <nav className="space-y-1">
            <Button variant="ghost" className="w-full justify-start gap-3 bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800">
              <Home className="size-4" />
              {tr("blogger_dashboard.nav.dashboard")}
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start gap-3 text-muted-foreground hover:bg-muted"
              onClick={() => router.push('/blogger/profile')}
            >
              <User className="size-4" />
              {tr("blogger_dashboard.nav.profile")}
            </Button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Header */}
        <div className="lg:hidden bg-background border-border p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="size-8">
                {profile?.avatar && profile.avatar.startsWith('data:') ? (
                  <img 
                    src={profile.avatar} 
                    alt="Avatar" 
                    className="size-full object-cover rounded-full"
                  />
                ) : (
                  <AvatarFallback className="bg-blue-50 text-blue-600 text-sm font-bold dark:bg-blue-900 dark:text-blue-300">
                    {initials}
                  </AvatarFallback>
                )}
              </Avatar>
              <div>
                <h2 className="font-semibold text-foreground text-sm">{profile?.username || tr("blogger_dashboard.blogger_fallback")}</h2>
              </div>
            </div>
            <nav className="flex gap-2">
              <Button 
                variant="ghost" 
                size="sm"
                className="bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center gap-1 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800"
              >
                <Home className="size-4" />
                <span className="text-xs hidden sm:inline">{tr("blogger_dashboard.nav.dashboard")}</span>
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                className="text-muted-foreground hover:bg-muted flex items-center gap-1"
                onClick={() => router.push('/blogger/profile')}
              >
                <User className="size-4" />
                <span className="text-xs hidden sm:inline">{tr("blogger_dashboard.nav.profile")}</span>
              </Button>
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 lg:p-8 overflow-y-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">{tr("blogger_dashboard.title")}</h1>
            <p className="text-muted-foreground mt-2">{tr("blogger_dashboard.subtitle")}</p>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertTitle>{tr("common.error_title")}</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {saved && (
            <Alert className="mb-6">
              <AlertTitle>{tr("common.saved_title")}</AlertTitle>
              <AlertDescription>{tr("blogger_dashboard.profile_saved_desc")}</AlertDescription>
            </Alert>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{tr("blogger_dashboard.stats.audience")}</p>
                    <p className="text-2xl font-bold text-foreground">
                      {profile?.audience?.toLocaleString() || "0"}
                    </p>
                  </div>
                  <Users className="size-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{tr("blogger_dashboard.stats.price")}</p>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {profile?.price?.toLocaleString("uz-UZ") || "0"}
                    </p>
                  </div>
                  <DollarSign className="size-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{tr("blogger_dashboard.stats.categories")}</p>
                    <p className="text-lg font-bold text-foreground">
                      {profile?.categories?.filter(c => c !== "").join(", ") || tr("common.not_specified")}
                    </p>
                  </div>
                  <TrendingUp className="size-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{tr("blogger_dashboard.stats.target_audiences")}</p>
                    <p className="text-lg font-bold text-foreground">
                      {profile?.targetAudiences?.filter(a => a !== "").join(", ") || tr("common.not_specified")}
                    </p>
                  </div>
                  <Users className="size-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profile Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{tr("blogger_dashboard.profile_card.title")}</CardTitle>
                  <p className="text-muted-foreground mt-1">{tr("blogger_dashboard.profile_card.subtitle")}</p>
                </div>
                <div className="flex gap-2">
                  {editing ? (
                    <>
                      <Button onClick={handleSave} disabled={saving} className="bg-green-600 hover:bg-green-700">
                        <Save className="mr-2 h-4 w-4" />
                        {saving ? tr("common.saving") : tr("common.save")}
                      </Button>
                      <Button onClick={handleCancel} variant="outline">
                        <X className="mr-2 h-4 w-4" />
                        {tr("common.cancel")}
                      </Button>
                    </>
                  ) : (
                    <Button onClick={handleEdit} className="bg-blue-600 hover:bg-blue-700">
                      <Edit2 className="mr-2 h-4 w-4" />
                      {tr("common.edit")}
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">{tr("blogger_dashboard.fields.username")}</Label>
                  {editing ? (
                    <Input
                      value={editForm.username}
                      onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                      className="mt-1"
                      placeholder={tr("blogger_dashboard.fields.username_placeholder")}
                    />
                  ) : (
                    <p className="mt-1 text-lg font-semibold text-foreground">{profile?.username || tr("common.not_set")}</p>
                  )}
                </div>

                <div>
                  <Label className="text-sm font-medium text-muted-foreground">{tr("blogger_dashboard.fields.email")}</Label>
                  <p className="mt-1 text-lg text-foreground">{profile?.email || tr("common.not_set")}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">{tr("blogger_dashboard.fields.audience")}</Label>
                  {editing ? (
                    <Input
                      type="number"
                      value={editForm.audience}
                      onChange={(e) => setEditForm({ ...editForm, audience: e.target.value })}
                      className="mt-1"
                      placeholder={tr("blogger_dashboard.fields.audience_placeholder")}
                    />
                  ) : (
                    <p className="mt-1 text-lg font-semibold text-foreground">
                      {profile?.audience?.toLocaleString() || "0"}
                    </p>
                  )}
                </div>

                <div>
                  <Label className="text-sm font-medium text-muted-foreground">{tr("blogger_dashboard.fields.price")}</Label>
                  {editing ? (
                    <Input
                      type="number"
                      value={editForm.price}
                      onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                      className="mt-1"
                      placeholder={tr("blogger_dashboard.fields.price_placeholder")}
                    />
                  ) : (
                    <p className="mt-1 text-lg font-semibold text-green-600 dark:text-green-400">
                      {profile?.price?.toLocaleString("uz-UZ") || "0"}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-muted-foreground">{tr("blogger_dashboard.fields.content_categories")}</Label>
                {editing ? (
                  <div className="mt-1 space-y-2">
                    {editForm.categories.map((category, index) => (
                      <Input
                        key={index}
                        value={category}
                        onChange={(e) => {
                          const newCategories = [...editForm.categories]
                          newCategories[index] = e.target.value
                          setEditForm({ ...editForm, categories: newCategories })
                        }}
                        placeholder={tr("blogger_dashboard.fields.content_category_placeholder")}
                      />
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setEditForm({ ...editForm, categories: [...editForm.categories, ""] })}
                      className="w-full"
                    >
                      <span className="mr-2">+</span> {tr("blogger_dashboard.actions.add_category")}
                    </Button>
                  </div>
                ) : (
                  <p className="mt-1 text-lg text-foreground">
                    {profile?.categories?.filter(c => c !== "").map(c => {
                      const key = `blogger_profile.categories.${c.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '')}`
                      const translated = tr(key)
                      return translated !== key ? translated : c
                    }).join(", ") || tr("common.not_specified")}
                  </p>
                )}
              </div>

              <div>
                <Label className="text-sm font-medium text-muted-foreground">{tr("blogger_dashboard.fields.target_audiences")}</Label>
                {editing ? (
                  <div className="mt-1 space-y-2">
                    {editForm.targetAudiences.map((audience, index) => (
                      <Input
                        key={index}
                        value={audience}
                        onChange={(e) => {
                          const newAudiences = [...editForm.targetAudiences]
                          newAudiences[index] = e.target.value
                          setEditForm({ ...editForm, targetAudiences: newAudiences })
                        }}
                        placeholder={tr("blogger_dashboard.fields.target_audience_placeholder")}
                      />
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setEditForm({ ...editForm, targetAudiences: [...editForm.targetAudiences, ""] })}
                      className="w-full"
                    >
                      <span className="mr-2">+</span> {tr("blogger_dashboard.actions.add_target_audience")}
                    </Button>
                  </div>
                ) : (
                  <p className="mt-1 text-lg text-foreground">
                    {profile?.targetAudiences?.filter(a => a !== "").map(a => {
                      const key = `blogger_profile.audiences.${a.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '')}`
                      const translated = tr(key)
                      return translated !== key ? translated : a
                    }).join(", ") || tr("common.not_specified")}
                  </p>
                )}
              </div>

              <div>
                <Label className="text-sm font-medium text-muted-foreground">{tr("blogger_dashboard.fields.socials")}</Label>
                {editing ? (
                  <Textarea
                    value={editForm.socials}
                    onChange={(e) => setEditForm({ ...editForm, socials: e.target.value })}
                    className="mt-1"
                    placeholder={tr("blogger_dashboard.fields.socials_placeholder")}
                    rows={3}
                  />
                ) : (
                  <div className="mt-3 flex flex-wrap gap-3">
                    {profile?.socials?.map((social) => {
                      const [platform, handle] = social.split(":")
                      const normalizedPlatform = platform?.trim().toLowerCase()
                      const iconKey = normalizedPlatform.charAt(0).toUpperCase() + normalizedPlatform.slice(1)
                      const icon = socialIcons[iconKey]
                      if (!icon) return null
                      return (
                        <div
                          key={social}
                          className="flex items-center gap-2 rounded-lg border border-border bg-muted px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
                        >
                          <icon.icon className={`size-5 ${icon.color}`} />
                          <span className="font-medium text-foreground">{handle?.trim()}</span>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

              <div>
                <Label className="text-sm font-medium text-muted-foreground">{tr("blogger_dashboard.fields.selected_regions")}</Label>
                {editing ? (
                  <div className="mt-3">
                    <p className="text-xs text-muted-foreground">{tr("blogger_dashboard.fields.selected_regions_hint")}</p>
                  </div>
                ) : (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {profile?.regions?.map((region) => (
                      <Badge key={region} variant="secondary" className="bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                        {region}
                      </Badge>
                    ))}
                    {(!profile?.regions || profile.regions.length === 0) && (
                      <p className="text-sm text-muted-foreground">{tr("blogger_dashboard.fields.no_regions")}</p>
                    )}
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  {tr("blogger_dashboard.last_updated")}: {profile?.updatedAt ? new Date(profile.updatedAt).toLocaleDateString() : tr("common.unknown")}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Notifications Panel */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="size-5" />
                {tr("blogger_dashboard.orders")}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <NotificationsPanel bloggerId={profile?.userId || 0} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
