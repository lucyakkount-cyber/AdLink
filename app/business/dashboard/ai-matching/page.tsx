"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { 
  Brain, 
  Search, 
  Users, 
  DollarSign, 
  Target, 
  MessageCircle, 
  Instagram, 
  Play,
  Star,
  TrendingUp,
  AlertCircle,
  ArrowLeft
} from "lucide-react"
import { useI18n } from "@/lib/i18n"
import Link from "next/link"

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

interface AIMatchResult {
  blogger: BloggerProfile
  matchScore: number
  reasons: string[]
  estimatedReach: number
  estimatedCost: number
}

interface AIMatchResponse {
  matches: AIMatchResult[]
  totalFound: number
  searchCriteria: {
    productCategory: string
    targetAudience: string
    budget: { min: number; max: number }
    description: string
    platforms: string[]
  }
}

const socialIcons: Record<string, { icon: typeof MessageCircle; color: string }> = {
  Telegram: { icon: MessageCircle, color: "text-blue-500" },
  Instagram: { icon: Instagram, color: "text-pink-500" },
  TikTok: { icon: Play, color: "text-foreground" },
}

export default function AIMatchingPage() {
  const { tr } = useI18n()
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<AIMatchResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [aiStatus, setAiStatus] = useState<'idle' | 'working' | 'success' | 'error'>('idle')

  const [formData, setFormData] = useState({
    productCategory: "",
    targetAudience: "",
    budgetMin: "",
    budgetMax: "",
    description: "",
    platforms: [] as string[],
    region: "random" // Set Random as default
  })

  const formatNumber = (value: string) => {
    const cleanValue = value.replace(/\s/g, '').replace(/,/g, '')
    if (!cleanValue) return ''
    const num = Number(cleanValue)
    if (Number.isNaN(num)) return value
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
  }

  const handleBudgetChange = (field: "budgetMin" | "budgetMax") => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s/g, '').replace(/,/g, '')
    if (!value || /^\d+$/.test(value)) {
      const formatted = formatNumber(value)
      setFormData(prev => ({ ...prev, [field]: formatted }))
    }
  }

  const handlePlatformToggle = (platform: string) => {
    setFormData(prev => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter(p => p !== platform)
        : [...prev.platforms, platform]
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResults(null)
    setAiStatus('working')

    try {
      const response = await fetch("/api/ai/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          productCategory: formData.productCategory,
          targetAudience: formData.targetAudience,
          budget: {
            min: parseInt(formData.budgetMin.replace(/\s/g, '').replace(/,/g, '')) || 0,
            max: parseInt(formData.budgetMax.replace(/\s/g, '').replace(/,/g, '')) || 10000000
          },
          description: formData.description,
          platforms: formData.platforms,
          region: formData.region // Add region to request
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || "AI matching failed")
      }

      const data: AIMatchResponse = await response.json()
      setResults(data)
      setAiStatus('success')
      
      // Show success notification
      if (data.totalFound > 0) {
        console.log(`✅ AI muvaffaqiyatli ishladi! ${data.totalFound} ta blogger topildi`)
      } else {
        console.log("⚠️ AI ishladi, lekin hech qanday blogger topilmadi")
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred"
      const friendly = errorMessage.toLowerCase().includes("missing required fields")
        ? tr("ai_matching.fill_fields")
        : errorMessage
      setError(friendly)
      setAiStatus('error')
      console.log("❌ AI xatolik:", errorMessage)
    } finally {
      setLoading(false)
      // Reset status after 3 seconds
      setTimeout(() => {
        if (aiStatus === 'success' || aiStatus === 'error') {
          setAiStatus('idle')
        }
      }, 3000)
    }
  }

  const formatAudience = (n: number | null) => {
    if (typeof n !== "number") return "Noma'lum"
    if (n >= 1_000_000) return `${Math.round(n / 100_000) / 10}M`
    if (n >= 1000) return `${Math.round(n / 100) / 10}K`
    return String(n)
  }

  const getMatchScoreColor = (score: number) => {
    if (score >= 85) return "bg-green-500"    // Increased from 80
    if (score >= 70) return "bg-blue-500"     // Increased from 60
    if (score >= 50) return "bg-yellow-500"    // Increased from 40
    if (score >= 30) return "bg-orange-500"    // Increased from 20
    return "bg-red-500"
  }

  const getMatchScoreText = (score: number) => {
    if (score >= 85) return "A'lo mos"        // Increased from 80
    if (score >= 70) return "Yaxshi mos"       // Increased from 60
    if (score >= 50) return "Qoniqarli"       // Increased from 40
    if (score >= 30) return "O'rtacha"         // Increased from 20
    return "Kam mos"
  }

  const formatPrice = (n: number | null) => {
    if (typeof n !== "number") return "Noma'lum"
    return `${n.toLocaleString("uz-UZ")} so'm`
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 py-10 lg:px-6 lg:py-16">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Link href="/business/dashboard">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <ArrowLeft className="size-4" />
                {tr("nav.back")}
              </Button>
            </Link>
          </div>
          <div className="flex items-center justify-center gap-3 mb-4">
            <Brain className="size-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-foreground">{tr("ai_matching.title")}</h1>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {tr("ai_matching.subtitle")}
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[400px_1fr]">
          {/* Search Form - Sidebar */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <Card className="border-border bg-background shadow-sm">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Brain className="size-5 text-blue-600" />
                  {tr("ai_matching.title")}
                </CardTitle>
                <p className="text-muted-foreground mt-2">
                  {tr("search.subtitle")}
                </p>
              </CardHeader>
              <CardContent className="pt-0">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="productCategory">{tr("ai_matching.product_category")}</Label>
                    <div className="mt-2">
                      <select
                        id="productCategory"
                        value={formData.productCategory}
                        onChange={(e) => setFormData(prev => ({ ...prev, productCategory: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="" disabled>
                          Mahsulot kategoriyasi
                        </option>
                        <option value="Barchasi">Barchasi</option>
                        <option value="Texnologiya va gadjetlar">Texnologiya va gadjetlar</option>
                        <option value="Moda va go'zallik">Moda va go'zallik</option>
                        <option value="Oziq-ovqat va ichimliklar">Oziq-ovqat va ichimliklar</option>
                        <option value="Ta'lim va rivojlanish">Ta'lim va rivojlanish</option>
                        <option value="Sog'liq va sport">Sog'liq va sport</option>
                        <option value="Uy va qurilish">Uy va qurilish</option>
                        <option value="Avtomobil va transport">Avtomobil va transport</option>
                        <option value="Sayohat va turizm">Sayohat va turizm</option>
                        <option value="Bozor va savdo">Bozor va savdo</option>
                        <option value="Xizmatlar va konsalting">Xizmatlar va konsalting</option>
                        <option value="O'yinchoqlar va bolalar mahsulotlari">O'yinchoqlar va bolalar mahsulotlari</option>
                        <option value="Kiyim-kechak va aksessuarlar">Kiyim-kechak va aksessuarlar</option>
                        <option value="Go'zallik va parfyumeriya">Go'zallik va parfyumeriya</option>
                        <option value="Elektronika va jihozlar">Elektronika va jihozlar</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="targetAudience">{tr("ai_matching.target_audience")}</Label>
                    <div className="mt-2">
                      <select
                        id="targetAudience"
                        value={formData.targetAudience}
                        onChange={(e) => setFormData(prev => ({ ...prev, targetAudience: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Auditoriyani tanlang</option>
                        <option value="Barchasi">Barchasi</option>
                        <option value="18-25 yoshdagi yoshlar">18-25 yoshdagi yoshlar</option>
                        <option value="25-35 yoshdagi faol ayollar">25-35 yoshdagi faol ayollar</option>
                        <option value="Talabalar va yosh mutaxassislar">Talabalar va yosh mutaxassislar</option>
                        <option value="Ishchi va biznesmenlar">Ishchi va biznesmenlar</option>
                        <option value="30-45 yoshdagi oilaviy kishilar">30-45 yoshdagi oilaviy kishilar</option>
                        <option value="16-22 yoshdagi talabalar">16-22 yoshdagi talabalar</option>
                        <option value="20-30 yoshdagi faol yigitlar">20-30 yoshdagi faol yigitlar</option>
                        <option value="Barcha yoshdagi internet foydalanuvchilar">Barcha yoshdagi internet foydalanuvchilar</option>
                        <option value="25-40 yoshdagi karyera quruvchilar">25-40 yoshdagi karyera quruvchilar</option>
                        <option value="18-30 yoshdagi fashion ixlosmandlari">18-30 yoshdagi fashion ixlosmandlari</option>
                        <option value="20-35 yoshdagi texnologiya sevuvchilar">20-35 yoshdagi texnologiya sevuvchilar</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="budgetMin">{tr("ai_matching.budget_min")}</Label>
                      <div className="mt-2 space-y-2">
                        <Input
                          id="budgetMin"
                          type="text"
                          inputMode="numeric"
                          placeholder="500 000"
                          value={formData.budgetMin}
                          onChange={handleBudgetChange("budgetMin")}
                          className="mt-2"
                        />
                        {formData.description && (
                          <div className="flex flex-wrap gap-1">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => setFormData(prev => ({ 
                                ...prev, 
                                budgetMin: formatNumber("100000"),
                                budgetMax: formatNumber("300000")
                              }))}
                              className="text-xs h-6"
                            >
                              Minimal (100K-300K)
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => setFormData(prev => ({ 
                                ...prev, 
                                budgetMin: formatNumber("300000"),
                                budgetMax: formatNumber("700000")
                              }))}
                              className="text-xs h-6"
                            >
                              O'rta (300K-700K)
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => setFormData(prev => ({ 
                                ...prev, 
                                budgetMin: formatNumber("700000"),
                                budgetMax: formatNumber("1500000")
                              }))}
                              className="text-xs h-6"
                            >
                              Premium (700K-1.5M)
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => setFormData(prev => ({ 
                                ...prev, 
                                budgetMin: formatNumber("1500000"),
                                budgetMax: formatNumber("3000000")
                              }))}
                              className="text-xs h-6"
                            >
                              Business (1.5M-3M)
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => setFormData(prev => ({ 
                                ...prev, 
                                budgetMin: formatNumber("3000000"),
                                budgetMax: formatNumber("10000000")
                              }))}
                              className="text-xs h-6"
                            >
                              Corporate (3M-10M)
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="budgetMax">{tr("ai_matching.budget_max")}</Label>
                      <Input
                        id="budgetMax"
                        type="text"
                        inputMode="numeric"
                        placeholder="5 000 000"
                        value={formData.budgetMax}
                        onChange={handleBudgetChange("budgetMax")}
                        className="mt-2"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">{tr("ai_matching.description")}</Label>
                    <Textarea
                      id="description"
                      placeholder={tr("search.description_placeholder")}
                      className="min-h-[100px] mt-2"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    />
                  </div>

                  <div>
                    <Label>{tr("ai_matching.platforms")}</Label>
                    <div className="mt-2 space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(socialIcons).map(([platform, { icon: Icon, color }]) => (
                          <Button
                            key={platform}
                            type="button"
                            variant={formData.platforms.includes(platform) ? "default" : "outline"}
                            size="sm"
                            className="text-xs"
                            onClick={() => handlePlatformToggle(platform)}
                          >
                            <Icon className={`size-4 mr-1 ${formData.platforms.includes(platform) ? 'text-white' : color}`} />
                            {platform}
                          </Button>
                        ))}
                      </div>
                      {formData.targetAudience && (
                        <div className="flex flex-wrap gap-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setFormData(prev => ({ 
                              ...prev, 
                              platforms: ["Instagram", "TikTok"]
                            }))}
                            className="text-xs h-6"
                          >
                            <Target className="size-3 mr-1" />
                            Yoshlar uchun
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setFormData(prev => ({ 
                              ...prev, 
                              platforms: ["Telegram", "Instagram"]
                            }))}
                            className="text-xs h-6"
                          >
                            <Users className="size-3 mr-1" />
                            Keng auditoriya
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setFormData(prev => ({ 
                              ...prev, 
                              platforms: ["TikTok"]
                            }))}
                            className="text-xs h-6"
                          >
                            <TrendingUp className="size-3 mr-1" />
                            Trendy
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="region" className="text-sm font-medium text-foreground">{tr("ai_matching.region")}</Label>
                    <select
                      id="region"
                      value={formData.region}
                      onChange={(e) => setFormData(prev => ({ ...prev, region: e.target.value }))}
                      className="mt-2 w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="random">Random (ixtiyoriy)</option>
                      <option value="Toshkent shahri">Toshkent shahri</option>
                      <option value="Toshkent viloyati">Toshkent viloyati</option>
                      <option value="Farg'ona">Farg'ona</option>
                      <option value="Andijon">Andijon</option>
                      <option value="Namangan">Namangan</option>
                      <option value="Samarqand">Samarqand</option>
                      <option value="Buxoro">Buxoro</option>
                      <option value="Xiva">Xiva</option>
                      <option value="Qashqadaryo">Qashqadaryo</option>
                      <option value="Surxondaryo">Surxondaryo</option>
                      <option value="Jizzax">Jizzax</option>
                      <option value="Sirdaryo">Sirdaryo</option>
                      <option value="Qoraqalpog'iston">Qoraqalpog'iston</option>
                    </select>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-blue-600 hover:bg-blue-700 mt-6" 
                    disabled={loading}
                  >
                    <Brain className="size-4 mr-2" />
                    {loading ? tr("ai_matching.loading") : tr("ai_matching.button")}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Results */}
          <div>
            {/* Empty State */}
            {!results && !error && !loading && (
              <div className="text-center py-12 border-2 border-dashed border-border rounded-lg bg-muted">
                <div className="mb-4">
                  <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                    <Search className="size-8 text-muted-foreground" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {tr("ai_matching.empty.title")}
                </h3>
                <p className="text-muted-foreground">
                  {tr("ai_matching.empty.desc")}
                </p>
              </div>
            )}

            {error && (
              <Card className="mb-6 border-red-200 bg-red-50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 text-red-700">
                    <AlertCircle className="size-4" />
                    <span>{error}</span>
                  </div>
                </CardContent>
              </Card>
            )}

            {results && (
              <div className="space-y-6">
                {/* Results Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">
                      {tr("ai_matching.results.title")}
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      {tr("ai_matching.results.subtitle").replace("{count}", results.matches.length.toString())}
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setResults(null)
                      setError(null)
                    }}
                  >
                    {tr("ai_matching.new_search")}
                  </Button>
                </div>

                {/* Results Summary */}
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Target className="size-5 text-blue-600" />
                        <span className="font-semibold text-foreground">
                          {results.totalFound} ta mos blogger topildi
                        </span>
                      </div>
                      <Badge variant="outline">
                        {results.searchCriteria.productCategory}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* Blogger Cards */}
                <div className="space-y-4">
                  {results.matches.map((match, index) => (
                    <Card key={match.blogger.userId} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          {/* Avatar */}
                          <Avatar className="size-16 border-2 border-white shadow-lg">
                            {match.blogger.avatar && match.blogger.avatar.startsWith('data:') ? (
                              <img 
                                src={match.blogger.avatar} 
                                alt={`${match.blogger.username} avatar`} 
                                className="size-full object-cover rounded-full"
                                onError={(e) => { e.currentTarget.style.display = 'none'; }}
                              />
                            ) : (
                              <AvatarFallback className="bg-blue-50 text-lg font-bold text-blue-600 dark:bg-blue-900 dark:text-blue-300">
                                {match.blogger.username?.slice(0, 2).toUpperCase() || "BL"}
                              </AvatarFallback>
                            )}
                          </Avatar>

                          {/* Content */}
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h3 className="text-lg font-semibold text-foreground mb-1">
                                  {match.blogger.username}
                                </h3>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                  <div className="flex items-center gap-1">
                                    <Users className="size-4" />
                                    {formatAudience(match.blogger.audience)}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <DollarSign className="size-4" />
                                    {match.blogger.price?.toLocaleString("uz-UZ")} so'm
                                  </div>
                                </div>
                              </div>
                              
                              {/* Match Score */}
                              <div className="text-right">
                                <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-white text-sm font-medium ${getMatchScoreColor(match.matchScore)}`}>
                                  <Star className="size-3" />
                                  {match.matchScore}%
                                </div>
                                <div className="text-xs text-muted-foreground mt-1">
                                  {getMatchScoreText(match.matchScore)}
                                </div>
                              </div>
                            </div>

                            {/* Match Reasons */}
                            <div className="mb-3">
                              <div className="flex items-center gap-2 mb-2">
                                <TrendingUp className="size-4 text-green-600" />
                                <span className="text-sm font-medium text-foreground">Moslik sabablari:</span>
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {match.reasons.map((reason, i) => (
                                  <Badge key={i} variant="secondary" className="text-xs">
                                    {reason}
                                  </Badge>
                                ))}
                              </div>
                            </div>

                            {/* Social Platforms */}
                            <div className="flex items-center gap-2 mb-3">
                              {match.blogger.socials.map((social, i) => {
                                const [platform] = social.split(':')
                                const Icon = socialIcons[platform]?.icon || MessageCircle
                                const color = socialIcons[platform]?.color || "text-gray-500"
                                
                                return (
                                  <div key={i} className={`flex items-center gap-1 text-sm ${color}`}>
                                    <Icon className="size-4" />
                                    <span>{platform}</span>
                                  </div>
                                )
                              })}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-3">
                              <Link 
                                href={`/business/dashboard/profile/${match.blogger.userId}`}
                                className="flex-1"
                              >
                                <Button variant="outline" className="w-full">
                                  Profilni ko'rish
                                </Button>
                              </Link>
                              <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                                <MessageCircle className="size-4 mr-2" />
                                  Buyurtma berish
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {results.matches.length === 0 && (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <Search className="size-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        Mos blogger topilmadi
                      </h3>
                      <p className="text-muted-foreground">
                        Qidirish parametrlarini o'zgartirib ko'ring
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
