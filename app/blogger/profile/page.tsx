"use client"

import { useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
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
import { ThemeToggle } from "@/components/theme-toggle"

interface BloggerProfile {
  userId: number
  email: string
  username: string
  audience: number | null
  price: number | null
  category: string
  targetAudience: string
  socials: string[]
  avatar: string
  regions?: string[] // Add regions field
  updatedAt: string
}

const socialIcons: Record<string, { icon: typeof MessageCircle; color: string }> = {
  Telegram: { icon: MessageCircle, color: "text-blue-500" },  
  Instagram: { icon: Instagram, color: "text-pink-500" },
  TikTok: { icon: Play, color: "text-foreground" },
}

// Social Media Input Component
const SocialMediaInput = ({ platform, icon: Icon, color, blogger, setBlogger }: {
  platform: string
  icon: any
  color: string
  blogger: any
  setBlogger: any
}) => {
  const { tr } = useI18n()
  const [inputVisible, setInputVisible] = useState(false)
  const existingSocial = blogger.socials.find((s: string) => s.startsWith(platform))
  const [_, value] = existingSocial ? existingSocial.split(':') : ['', '']
  const [inputValue, setInputValue] = useState(value.trim())

  useEffect(() => {
    const existingSocial = blogger.socials.find((s: string) => s.startsWith(platform))
    const [_, newValue] = existingSocial ? existingSocial.split(':') : ['', '']
    setInputValue(newValue.trim())
  }, [blogger.socials, platform])

  const handleSave = () => {
    const newValue = inputValue.trim()
    if (newValue) {
      const newSocials = blogger.socials.filter((s: string) => !s.startsWith(platform))
      newSocials.push(`${platform}: ${newValue}`)
      setBlogger((p: any) => ({ ...p, socials: newSocials }))
      
      // Show success message
      const successMessage = document.createElement('div')
      successMessage.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50'
      successMessage.textContent = tr("blogger_profile.social_added", { platform: platform.charAt(0).toUpperCase() + platform.slice(1) })
      document.body.appendChild(successMessage)
      
      setTimeout(() => {
        successMessage.remove()
      }, 3000)
      
      // Auto-save profile after adding social media
      setTimeout(() => {
        const saveButton = document.querySelector('[data-save-profile]') as HTMLButtonElement
        if (saveButton) {
          saveButton.click()
        }
      }, 500)
    } else {
      setBlogger((p: any) => ({ 
        ...p, 
        socials: p.socials.filter((s: string) => !s.startsWith(platform))
      }))
      
      // Show removal message
      const removeMessage = document.createElement('div')
      removeMessage.className = 'fixed top-4 right-4 bg-orange-500 text-white px-4 py-2 rounded-lg shadow-lg z-50'
      removeMessage.textContent = tr("blogger_profile.social_removed", { platform: platform.charAt(0).toUpperCase() + platform.slice(1) })
      document.body.appendChild(removeMessage)
      
      setTimeout(() => {
        removeMessage.remove()
      }, 2000)
    }
    setInputVisible(false)
  }

  return (
    <div className="flex-1">
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="flex items-center gap-2 w-full"
        onClick={() => setInputVisible(!inputVisible)}
      >
        <Icon className={`size-4 ${color}`} />
        {platform.charAt(0).toUpperCase() + platform.slice(1)}
      </Button>
      {inputVisible && (
        <div className="mt-2 space-y-1">
          <Label className="text-xs font-medium text-muted-foreground">
            {tr("blogger_profile.social_input_label", { platform: platform.charAt(0).toUpperCase() + platform.slice(1) })}
          </Label>
          <div className="flex gap-1">
            <Input
              placeholder={tr("blogger_profile.social_input_placeholder")}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="flex-1"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleSave}
            >
              <Save className="size-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setInputVisible(false)}
            >
              <X className="size-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function ProfilePage() {
  const { tr } = useI18n()
  const router = useRouter()
  const [auth, setAuth] = useState({ authenticated: false, role: null as string | null })
  const [profile, setProfile] = useState<BloggerProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  // Format number with thousands separator for Uzbekistan
  const formatNumber = (value: string) => {
    const cleanValue = value.replace(/\s/g, '').replace(/,/g, '')
    if (!cleanValue) return ''
    
    // Convert to number and format manually to ensure spaces
    const num = Number(cleanValue)
    if (isNaN(num)) return value
    
    // Manual formatting to ensure spaces instead of commas
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
  }

  // Handle input formatting for numbers
  const handleNumberChange = (setter: (value: string) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s/g, '').replace(/,/g, '')
    if (!value || /^\d+$/.test(value)) {
      e.target.value = formatNumber(value)
      setter(e.target.value)
    }
  }

  const [blogger, setBlogger] = useState({
    username: "",
    audience: null as number | null,
    price: null as number | null,
    categories: ["Barchasi"],
    targetAudiences: ["Barchasi"],
    socials: [] as string[],
    avatar: "",
    regions: [] as string[], // New field for regions
  })

  const [avatarPreview, setAvatarPreview] = useState<string>("")

  const [socialInputs, setSocialInputs] = useState({
    telegram: "",
    instagram: "",
    tiktok: ""
  })

  useEffect(() => {
    fetchAuth()
  }, [])

  const fetchAuth = async () => {
    try {
      const res = await fetch("/api/auth/me", { credentials: "include" })
      const data = await res.json()
      setAuth({ authenticated: Boolean(data?.authenticated), role: data?.role ?? null })
      
      if (data?.role === "blogger") {
        await fetchProfile()
      } else {
        setLoading(false)
      }
    } catch (err) {
      setLoading(false)
    }
  }

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/blogger/profile", { credentials: "include" })
      if (!res.ok) {
        throw new Error("Profile not found")
      }
      const data = await res.json()
      const profileData = data.profile
      console.log("Fetched profile data:", profileData)
      setProfile(profileData)
      setBlogger({
        username: profileData?.username || "",
        audience: profileData?.audience ?? null,
        price: profileData?.price ?? null,
        categories: profileData?.categories || ["Barchasi"],
        targetAudiences: profileData?.targetAudiences || ["Barchasi"],
        socials: profileData?.socials ?? [],
        avatar: profileData?.avatar || "",
        regions: profileData?.regions ?? [], 
      })
      console.log("Setting avatar preview to:", profileData?.avatar || "")
      setAvatarPreview(profileData?.avatar || "")
    } catch (err) {
      setError(err instanceof Error ? err.message : tr("blogger_profile.error.load_profile"))
    } finally {
      setLoading(false)
    }
  }

  const onSave = async () => {
    if (auth.role !== "blogger") return

    setSaving(true)
    setError(null)

    try {
      const res = await fetch("/api/blogger/profile", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(blogger),
        credentials: "include",
      })
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null
        throw new Error(data?.error || "Save failed")
      }

      const data = await res.json()
      setProfile(data.profile)
      setSaved(true)
      setTimeout(() => {
        setSaved(false)
        // Redirect to dashboard after save
        if (auth.role === "blogger") {
          router.push("/blogger/dashboard")
        } else if (auth.role === "business") {
          router.push("/business/dashboard")
        }
      }, 1000)
    } catch (e) {
      setError(e instanceof Error ? e.message : tr("common.save_failed"))
    } finally {
      setSaving(false)
    }
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        setAvatarPreview(result)
        setBlogger(prev => ({ ...prev, avatar: result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const toNullableNumber = (s: string): number | null => {
    const n = Number(s.trim())
    return Number.isNaN(n) || n <= 0 ? null : n
  }

  const addCategory = () => {
    setBlogger(prev => ({
      ...prev,
      categories: [...prev.categories, ""]
    }))
  }

  const removeCategory = (index: number) => {
    setBlogger(prev => ({
      ...prev,
      categories: prev.categories.filter((_, i) => i !== index)
    }))
  }

  const updateCategory = (index: number, value: string) => {
    setBlogger(prev => ({
      ...prev,
      categories: prev.categories.map((cat, i) => i === index ? value : cat)
    }))
  }

  const addTargetAudience = () => {
    setBlogger(prev => ({
      ...prev,
      targetAudiences: [...prev.targetAudiences, ""]
    }))
  }

  const removeTargetAudience = (index: number) => {
    setBlogger(prev => ({
      ...prev,
      targetAudiences: prev.targetAudiences.filter((_, i) => i !== index)
    }))
  }

  const updateTargetAudience = (index: number, value: string) => {
    setBlogger(prev => ({
      ...prev,
      targetAudiences: prev.targetAudiences.map((aud, i) => i === index ? value : aud)
    }))
  }

  const toggleAllRegions = () => {
    const allRegions = [
      "Toshkent shahri",
      "Toshkent viloyati", 
      "Farg'ona",
      "Andijon",
      "Namangan",
      "Samarqand",
      "Buxoro",
      "Xiva",
      "Qashqadaryo",
      "Surxondaryo",
      "Jizzax",
      "Sirdaryo",
      "Qoraqalpog'iston"
    ]
    
    if (blogger.regions.length === allRegions.length) {
      // If all regions are selected, deselect all
      setBlogger(prev => ({ ...prev, regions: [] }))
    } else {
      // If not all regions are selected, select all
      setBlogger(prev => ({ ...prev, regions: allRegions }))
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

  if (!auth.authenticated) {
    return (
      <div className="flex h-screen bg-gray-50">
        <div className="flex-1 flex items-center justify-center">
          <Alert>
            <AlertTitle>{tr("auth.account_required.title")}</AlertTitle>
            <AlertDescription>{tr("auth.auth_required.desc")}</AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  if (auth.role !== "blogger") {
    return (
      <div className="flex h-screen bg-gray-50">
        <div className="flex-1 flex items-center justify-center">
          <Alert>
            <AlertTitle>{tr("common.not_allowed_title")}</AlertTitle>
            <AlertDescription>{tr("blogger_profile.only_bloggers")}</AlertDescription>
          </Alert>
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
              {avatarPreview && avatarPreview.startsWith('data:') ? (
                <img 
                  src={avatarPreview} 
                  alt="Avatar" 
                  className="size-full object-cover rounded-full"
                  onError={(e) => {
                    console.error("Avatar image failed to load:", e);
                    e.currentTarget.style.display = 'none';
                  }}
                  onLoad={() => {
                    console.log("Avatar image loaded successfully");
                  }}
                />
              ) : (
                <AvatarFallback className="bg-blue-50 text-blue-600 font-bold dark:bg-blue-900 dark:text-blue-300">
                  {initials}
                </AvatarFallback>
              )}
            </Avatar>
            <div>
              <h2 className="font-semibold text-foreground">{profile?.username || tr("blogger_profile.blogger_fallback")}</h2>
            </div>
          </div>

          <nav className="space-y-1">
            <Button 
              variant="ghost" 
              className="w-full justify-start gap-3 text-muted-foreground hover:bg-muted"
              onClick={() => router.push('/blogger/dashboard')}
            >
              <Home className="size-4" />
              {tr("blogger_dashboard.nav.dashboard")}
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-3 bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800">
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
                {avatarPreview && avatarPreview.startsWith('data:') ? (
                  <img 
                    src={avatarPreview} 
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
                <h2 className="font-semibold text-foreground">{profile?.username || tr("blogger_profile.blogger_fallback")}</h2>
              </div>
            </div>
            <nav className="flex gap-2">
              <Button 
                variant="ghost" 
                size="sm"
                className="text-muted-foreground hover:bg-muted flex items-center gap-1"
                onClick={() => router.push('/blogger/dashboard')}
              >
                <Home className="size-4" />
                <span className="text-xs hidden sm:inline">{tr("blogger_dashboard.nav.dashboard")}</span>
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                className="bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center gap-1 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800"
              >
                <User className="size-4" />
                <span className="text-xs hidden sm:inline">{tr("blogger_dashboard.nav.profile")}</span>
              </Button>
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 lg:p-8 overflow-y-auto scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gradient-to-r scrollbar-thumb-from-purple-500 scrollbar-thumb-to-pink-500 hover:scrollbar-thumb-from-purple-600 hover:scrollbar-thumb-to-pink-600">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">{tr("blogger_profile.title")}</h1>
            <p className="text-muted-foreground mt-2">{tr("blogger_profile.subtitle")}</p>
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
              <AlertDescription>{tr("blogger_profile.profile_saved_desc")}</AlertDescription>
            </Alert>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{tr("blogger_dashboard.stats.audience")}</p>
                    <p className="text-2xl font-bold text-foreground">
                      {blogger.audience ? formatNumber(blogger.audience.toString()) : "0"}
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
                      {blogger.price ? formatNumber(blogger.price.toString()) : "0"}
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
                      {blogger.categories.filter(c => c !== "").map(c => tr(`blogger_profile.categories.${c.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '')}`) || c).join(", ") || tr("common.not_specified")}
                    </p>
                  </div>
                  <TrendingUp className="size-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profile Form Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{tr("blogger_profile.form.title")}</CardTitle>
                  <p className="text-muted-foreground mt-1">{tr("blogger_profile.form.subtitle")}</p>
                </div>
                <Button
                  onClick={onSave}
                  disabled={saving}
                  data-save-profile
                  className="bg-blue-600 font-semibold text-white shadow-sm transition-all hover:bg-blue-700"
                >
                  {saving ? tr("common.saving") : tr("common.save")}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">{tr("blogger_profile.fields.avatar")}</Label>
                <div className="mt-2 flex items-center gap-4">
                  <Avatar className="size-20">
                    {avatarPreview && avatarPreview.startsWith('data:') ? (
                      <img 
                        src={avatarPreview} 
                        alt="Avatar" 
                        className="size-full object-cover rounded-full"
                        onError={(e) => {
                          console.error("Profile form avatar failed to load:", e);
                          e.currentTarget.style.display = 'none';
                        }}
                        onLoad={() => {
                          console.log("Profile form avatar loaded successfully");
                        }}
                      />
                    ) : (
                      <AvatarFallback className="bg-blue-50 text-blue-600 text-xl font-bold dark:bg-blue-900 dark:text-blue-300">
                        {initials}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    <p className="text-xs text-muted-foreground mt-1">{tr("blogger_profile.fields.avatar_hint")}</p>
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-muted-foreground">{tr("blogger_dashboard.fields.username")}</Label>
                <Input
                  value={blogger.username}
                  onChange={(e) => setBlogger((p) => ({ ...p, username: e.target.value }))}
                  className="mt-1"
                  placeholder={tr("blogger_dashboard.fields.username_placeholder")}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">{tr("blogger_dashboard.fields.audience")}</Label>
                  <Input
                    inputMode="numeric"
                    type="text"
                    value={blogger.audience ? formatNumber(blogger.audience.toString()) : ""}
                    onChange={handleNumberChange((value) => 
                      setBlogger((p) => ({ ...p, audience: value ? Number(value.replace(/\s/g, '').replace(/,/g, '')) : null }))
                    )}
                    className="mt-1"
                    placeholder={tr("blogger_profile.fields.audience_placeholder")}
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium text-muted-foreground">{tr("blogger_dashboard.fields.price")}</Label>
                  <Input
                    inputMode="numeric"
                    type="text"
                    value={blogger.price ? formatNumber(blogger.price.toString()) : ""}
                    onChange={handleNumberChange((value) => 
                      setBlogger((p) => ({ ...p, price: value ? Number(value.replace(/\s/g, '').replace(/,/g, '')) : null }))
                    )}
                    className="mt-1"
                    placeholder={tr("blogger_profile.fields.price_placeholder")}
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">{tr("blogger_dashboard.fields.content_categories")}</Label>
                  <div className="mt-2 space-y-2">
                    {blogger.categories.map((category, index) => (
                      <div key={index} className="flex gap-2">
                        <div className="flex-1">
                          <select
                            value={category}
                            onChange={(e) => updateCategory(index, e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="">{tr("blogger_profile.categories.placeholder")}</option>
                            <option value="Barchasi">{tr("common.all")}</option>
                            <option value="Texnologiya va gadjetlar">{tr("blogger_profile.categories.tech_gadgets")}</option>
                            <option value="Moda va go'zallik">{tr("blogger_profile.categories.fashion_beauty")}</option>
                            <option value="Oziq-ovqat va ichimliklar">{tr("blogger_profile.categories.food_drinks")}</option>
                            <option value="Ta'lim va rivojlanish">{tr("blogger_profile.categories.education")}</option>
                            <option value="Sog'liq va sport">{tr("blogger_profile.categories.health_sport")}</option>
                            <option value="Uy va qurilish">{tr("blogger_profile.categories.home_building")}</option>
                            <option value="Avtomobil va transport">{tr("blogger_profile.categories.auto_transport")}</option>
                            <option value="Sayohat va turizm">{tr("blogger_profile.categories.travel")}</option>
                            <option value="Bozor va savdo">{tr("blogger_profile.categories.market_trade")}</option>
                            <option value="Xizmatlar va konsalting">{tr("blogger_profile.categories.services_consulting")}</option>
                            <option value="O'yinchoqlar va bolalar mahsulotlari">{tr("blogger_profile.categories.kids_toys")}</option>
                            <option value="Kiyim-kechak va aksessuarlar">{tr("blogger_profile.categories.clothing_accessories")}</option>
                            <option value="Go'zallik va parfyumeriya">{tr("blogger_profile.categories.perfume")}</option>
                            <option value="Elektronika va jihozlar">{tr("blogger_profile.categories.electronics")}</option>
                          </select>
                        </div>
                        {blogger.categories.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeCategory(index)}
                            className="px-3 py-2"
                          >
                            <X className="size-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addCategory}
                      className="w-full"
                    >
                      <span className="mr-2">+</span> {tr("blogger_dashboard.actions.add_category")}
                    </Button>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-muted-foreground">{tr("blogger_dashboard.fields.target_audiences")}</Label>
                  <div className="mt-2 space-y-2">
                    {blogger.targetAudiences.map((audience, index) => (
                      <div key={index} className="flex gap-2">
                        <div className="flex-1">
                          <select
                            value={audience}
                            onChange={(e) => updateTargetAudience(index, e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="">{tr("blogger_profile.audiences.placeholder")}</option>
                            <option value="Barchasi">{tr("common.all")}</option>
                            <option value="18-25 yoshdagi yoshlar">{tr("blogger_profile.audiences.youth_18_25")}</option>
                            <option value="25-35 yoshdagi faol ayollar">{tr("blogger_profile.audiences.women_25_35")}</option>
                            <option value="Talabalar va yosh mutaxassislar">{tr("blogger_profile.audiences.students_young_pros")}</option>
                            <option value="Ishchi va biznesmenlar">{tr("blogger_profile.audiences.workers_business")}</option>
                            <option value="30-45 yoshdagi oilaviy kishilar">{tr("blogger_profile.audiences.family_30_45")}</option>
                            <option value="16-22 yoshdagi talabalar">{tr("blogger_profile.audiences.students_16_22")}</option>
                            <option value="20-30 yoshdagi faol yigitlar">{tr("blogger_profile.audiences.men_20_30")}</option>
                            <option value="Barcha yoshdagi internet foydalanuvchilar">{tr("blogger_profile.audiences.all_internet")}</option>
                            <option value="25-40 yoshdagi karyera quruvchilar">{tr("blogger_profile.audiences.career_25_40")}</option>
                            <option value="18-30 yoshdagi fashion ixlosmandlari">{tr("blogger_profile.audiences.fashion_18_30")}</option>
                            <option value="20-35 yoshdagi texnologiya sevuvchilar">{tr("blogger_profile.audiences.tech_20_35")}</option>
                          </select>
                        </div>
                        {blogger.targetAudiences.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeTargetAudience(index)}
                            className="px-3 py-2"
                          >
                            <X className="size-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addTargetAudience}
                      className="w-full"
                    >
                      <span className="mr-2">+</span> {tr("blogger_dashboard.actions.add_target_audience")}
                    </Button>
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-muted-foreground">{tr("blogger_dashboard.fields.socials")}</Label>
                <div className="mt-2">
                  <div className="flex gap-2">
                    <SocialMediaInput 
                      platform="telegram" 
                      icon={MessageCircle} 
                      color="text-blue-500" 
                      blogger={blogger} 
                      setBlogger={setBlogger} 
                    />
                    <SocialMediaInput 
                      platform="instagram" 
                      icon={Instagram} 
                      color="text-pink-500" 
                      blogger={blogger} 
                      setBlogger={setBlogger} 
                    />
                    <SocialMediaInput 
                      platform="tiktok" 
                      icon={Play} 
                      color="text-foreground" 
                      blogger={blogger} 
                      setBlogger={setBlogger} 
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-muted-foreground">{tr("profile.regions")}</Label>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="barchasi"
                      checked={blogger.regions.length === 13}
                      onChange={toggleAllRegions}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <Label htmlFor="barchasi" className="text-sm font-medium">
                      {tr("common.all")}
                    </Label>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {[
                      "Toshkent shahri",
                      "Toshkent viloyati",
                      "Farg'ona",
                      "Andijon",
                      "Namangan",
                      "Samarqand",
                      "Buxoro",
                      "Xiva",
                      "Qashqadaryo",
                      "Surxondaryo",
                      "Jizzax",
                      "Sirdaryo",
                      "Qoraqalpog'iston",
                    ].map((region) => (
                      <div key={region} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={region}
                          checked={blogger.regions.includes(region)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setBlogger((p) => ({
                                ...p,
                                regions: [...p.regions, region],
                              }))
                            } else {
                              setBlogger((p) => ({
                                ...p,
                                regions: p.regions.filter((r) => r !== region),
                              }))
                            }
                          }}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <Label htmlFor={region} className="text-sm">
                          {region}
                        </Label>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {tr("profile.regions_placeholder")}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  {tr("blogger_dashboard.last_updated")}: {profile?.updatedAt ? new Date(profile.updatedAt).toLocaleDateString() : tr("common.unknown")}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
