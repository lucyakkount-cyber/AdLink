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

interface BloggerProfile {
  userId: number
  email: string
  username: string
  audience: number | null
  price: number | null
  category: string
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

export default function ProfilePage() {
  const { tr } = useI18n()
  const router = useRouter()
  const [auth, setAuth] = useState({ authenticated: false, role: null as string | null })
  const [profile, setProfile] = useState<BloggerProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const [blogger, setBlogger] = useState({
    username: "",
    audience: null as number | null,
    price: null as number | null,
    category: "",
    socials: [] as string[],
    avatar: "",
    regions: [] as string[], // New field for regions
  })

  const [avatarPreview, setAvatarPreview] = useState<string>("")

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
        category: profileData?.category || "",
        socials: profileData?.socials ?? [],
        avatar: profileData?.avatar || "",
        regions: profileData?.regions ?? [], // Add regions field
      })
      console.log("Setting avatar preview to:", profileData?.avatar || "")
      setAvatarPreview(profileData?.avatar || "")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load profile")
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
      setError(e instanceof Error ? e.message : "Save failed")
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
            <AlertTitle>Hisob talab qilinadi</AlertTitle>
            <AlertDescription>Iltimos, tizimga kiring</AlertDescription>
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
            <AlertTitle>Ruxsat berilmagan</AlertTitle>
            <AlertDescription>Bu sahifa faqat bloggerlar uchun</AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  const initials = profile?.username?.slice(0, 2).toUpperCase() || "BL"

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Global scrollbar styles */}
      <style jsx global>{`
        html {
          scrollbar-width: thin;
          scrollbar-color: #cbd5e1 #f1f5f9;
        }
        body {
          scrollbar-width: thin;
          scrollbar-color: #cbd5e1 #f1f5f9;
        }
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        ::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 4px;
          transition: all 0.3s ease;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%);
          box-shadow: 0 4px 8px rgba(0,0,0,0.15);
        }
        ::-webkit-scrollbar-corner {
          background: #f1f5f9;
        }
        ::-webkit-scrollbar-thumb:active {
          background: linear-gradient(135deg, #4c51bf 0%, #5a3d8a 100%);
        }
      `}</style>
      
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200">
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
                <AvatarFallback className="bg-blue-50 text-blue-600 font-bold">
                  {initials}
                </AvatarFallback>
              )}
            </Avatar>
            <div>
              <h2 className="font-semibold text-gray-900">{profile?.username || "Bloger"}</h2>
            </div>
          </div>

          <nav className="space-y-1">
            <Button 
              variant="ghost" 
              className="w-full justify-start gap-3 text-gray-600 hover:bg-gray-50"
              onClick={() => router.push('/blogger/dashboard')}
            >
              <Home className="size-4" />
              Dashboard
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-3 bg-blue-50 text-blue-600 hover:bg-blue-100">
              <User className="size-4" />
              Profile
            </Button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <div className="p-8 h-full overflow-y-auto scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gradient-to-r scrollbar-thumb-from-purple-500 scrollbar-thumb-to-pink-500 hover:scrollbar-thumb-from-purple-600 hover:scrollbar-thumb-to-pink-600">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Profil</h1>
            <p className="text-gray-600 mt-2">Ma'lumotlaringizni to'ldiring va tahrirlang</p>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertTitle>Xatolik</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {saved && (
            <Alert className="mb-6">
              <AlertTitle>✅ Saqlandi!</AlertTitle>
              <AlertDescription>Profil ma'lumotlari muvaffaqiyatli saqlandi</AlertDescription>
            </Alert>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Auditoriya</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {blogger.audience?.toLocaleString() || "0"}
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
                    <p className="text-sm font-medium text-gray-600">Narx (so'm)</p>
                    <p className="text-2xl font-bold text-green-600">
                      {blogger.price?.toLocaleString("uz-UZ") || "0"}
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
                    <p className="text-sm font-medium text-gray-600">Kategoriya</p>
                    <p className="text-lg font-bold text-gray-900">
                      {blogger.category || "Ko'rsatilmagan"}
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
                  <CardTitle>Bloger</CardTitle>
                  <p className="text-gray-600 mt-1">Profilni to'ldiring, shunda bizneslar sizni topa oladi</p>
                </div>
                <Button
                  onClick={onSave}
                  disabled={saving}
                  className="bg-blue-600 font-semibold text-white shadow-sm transition-all hover:bg-blue-700"
                >
                  {saving ? "Saqlanmoqda..." : "Saqlash"}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-sm font-medium text-gray-600">Profil rasmi</Label>
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
                      <AvatarFallback className="bg-blue-50 text-blue-600 text-xl font-bold">
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
                    <p className="text-xs text-gray-500 mt-1">JPG, PNG, GIF. Maksimal 5MB</p>
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-600">@username</Label>
                <Input
                  value={blogger.username}
                  onChange={(e) => setBlogger((p) => ({ ...p, username: e.target.value }))}
                  className="mt-1"
                  placeholder="@username"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Auditoriya</Label>
                  <Input
                    inputMode="numeric"
                    value={blogger.audience ?? ""}
                    onChange={(e) =>
                      setBlogger((p) => ({ ...p, audience: toNullableNumber(e.target.value) }))
                    }
                    className="mt-1"
                    placeholder="25000"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-600">Narx (so'm)</Label>
                  <Input
                    inputMode="numeric"
                    value={blogger.price ?? ""}
                    onChange={(e) =>
                      setBlogger((p) => ({ ...p, price: toNullableNumber(e.target.value) }))
                    }
                    className="mt-1"
                    placeholder="200000"
                  />
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-600">Kontent kategoriyasi</Label>
                <Input
                  value={blogger.category}
                  onChange={(e) => setBlogger((p) => ({ ...p, category: e.target.value }))}
                  className="mt-1"
                  placeholder="Kontent kategoriyasi"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-600">Ijtimoiy tarmoqlar</Label>
                <Textarea
                  value={blogger.socials.join("\n")}
                  onChange={(e) =>
                    setBlogger((p) => ({
                      ...p,
                      socials: e.target.value
                        .split("\n")
                        .map((s) => s.trim())
                        .filter(Boolean),
                    }))
                  }
                  className="mt-1"
                  placeholder="telegram: @channel\ninstagram: @username\ntiktok: @username"
                  rows={3}
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-600">{tr("profile.regions")}</Label>
                <div className="mt-2 space-y-2">
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
                        <label htmlFor={region} className="text-sm text-gray-700">
                          {region}
                        </label>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {tr("profile.regions_placeholder")}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                  Oxirgi yangilanish: {profile?.updatedAt ? new Date(profile.updatedAt).toLocaleDateString() : "Noma'lum"}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
