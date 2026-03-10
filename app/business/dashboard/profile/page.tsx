"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Building, ArrowLeft, Save } from "lucide-react"
import { useI18n } from "@/lib/i18n"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface BusinessProfile {
  companyName: string
  niche: string
  budgetMin: number
  budgetMax: number
  description: string
  email: string
  updatedAt: string
}

export default function BusinessProfilePage() {
  const { tr } = useI18n()
  const router = useRouter()
  const [profile, setProfile] = useState<BusinessProfile | null>(null)
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

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

  // Handle budget input formatting
  const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s/g, '').replace(/,/g, '')
    if (!value || /^\d+$/.test(value)) {
      e.target.value = formatNumber(value)
    }
  }

  const [formData, setFormData] = useState({
    companyName: "",
    niche: "",
    budgetMin: "",
    budgetMax: "",
    description: "",
    email: ""
  })

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/business/profile', { credentials: "include" })
      if (response.ok) {
        const data = await response.json()
        setProfile(data)
        setFormData({
          companyName: data.companyName || "",
          niche: data.niche || "",
          budgetMin: data.budgetMin?.toString() || "",
          budgetMax: data.budgetMax?.toString() || "",
          description: data.description || "",
          email: data.email || ""
        })
      }
    } catch (err) {
      setError("Profilni yuklashda xatolik yuz berdi")
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setError(null)
    setSuccess(false)

    try {
      const response = await fetch('/api/business/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          companyName: formData.companyName,
          niche: formData.niche,
          budgetMin: Number(formData.budgetMin.replace(/\s/g, '').replace(/,/g, '')) || 100000,
          budgetMax: Number(formData.budgetMax.replace(/\s/g, '').replace(/,/g, '')) || 1000000,
          description: formData.description,
          email: formData.email
        }),
        credentials: "include"
      })

      if (response.ok) {
        const data = await response.json()
        setProfile(data)
        setEditing(false)
        setSuccess(true)
        setTimeout(() => setSuccess(false), 3000)
      } else {
        throw new Error("Profilni saqlashda xatolik yuz berdi")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Xatolik yuz berdi")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
            <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/business/dashboard">
            <Button variant="outline" size="sm">
              <ArrowLeft className="size-4 mr-2" />
              Asosiy sahifa
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Biznes Profili</h1>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Building className="size-5" />
                Biznes Profili
              </CardTitle>
              {!editing && (
                <Button onClick={() => setEditing(true)} variant="outline">
                  Tahrirlash
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                <p className="text-green-600 text-sm">Profil muvaffaqiyatli saqlandi!</p>
              </div>
            )}

            {editing ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="companyName">Kompaniya nomi *</Label>
                    <Input
                      id="companyName"
                      value={formData.companyName}
                      onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                      placeholder="Kompaniya nomi"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="email@example.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="niche">Nisha</Label>
                  <Input
                    id="niche"
                    value={formData.niche}
                    onChange={(e) => setFormData({...formData, niche: e.target.value})}
                    placeholder="Masalan: Texnologiya, Moda, Oziq-ovqat"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="budgetMin">Minimal byudjet (so'm)</Label>
                    <Input
                      id="budgetMin"
                      type="text"
                      value={formData.budgetMin}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\s/g, '').replace(/,/g, '')
                        if (!value || /^\d+$/.test(value)) {
                          const formattedValue = value ? formatNumber(value) : ''
                          setFormData({...formData, budgetMin: formattedValue})
                        }
                      }}
                      placeholder="100 000"
                      inputMode="numeric"
                    />
                  </div>
                  <div>
                    <Label htmlFor="budgetMax">Maksimal byudjet (so'm)</Label>
                    <Input
                      id="budgetMax"
                      type="text"
                      value={formData.budgetMax}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\s/g, '').replace(/,/g, '')
                        if (!value || /^\d+$/.test(value)) {
                          const formattedValue = value ? formatNumber(value) : ''
                          setFormData({...formData, budgetMax: formattedValue})
                        }
                      }}
                      placeholder="1 000 000"
                      inputMode="numeric"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Tavsif</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Biznesingiz haqida qisqacha ma'lumot..."
                    rows={4}
                  />
                </div>

                <div className="flex gap-2">
                  <Button 
                    onClick={handleSave} 
                    disabled={saving || !formData.companyName || !formData.email}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {saving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Saqlanmoqda...
                      </>
                    ) : (
                      <>
                        <Save className="size-4 mr-2" />
                        Saqlash
                      </>
                    )}
                  </Button>
                  <Button 
                    onClick={() => setEditing(false)} 
                    variant="outline"
                  >
                    Bekor qilish
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {profile ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-gray-600 dark:text-gray-400">Kompaniya nomi</Label>
                        <p className="font-medium text-gray-900 dark:text-white">{profile.companyName}</p>
                      </div>
                      <div>
                        <Label className="text-gray-600 dark:text-gray-400">Email</Label>
                        <p className="font-medium text-gray-900 dark:text-white">{profile.email}</p>
                      </div>
                    </div>

                    <div>
                      <Label className="text-gray-600 dark:text-gray-400">Nisha</Label>
                      <p className="font-medium text-gray-900 dark:text-white">{profile.niche || "Kiritilmagan"}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-gray-600 dark:text-gray-400">Minimal byudjet</Label>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {profile.budgetMin ? profile.budgetMin.toLocaleString("uz-UZ") + " so'm" : "Kiritilmagan"}
                        </p>
                      </div>
                      <div>
                        <Label className="text-gray-600 dark:text-gray-400">Maksimal byudjet</Label>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {profile.budgetMax ? profile.budgetMax.toLocaleString("uz-UZ") + " so'm" : "Kiritilmagan"}
                        </p>
                      </div>
                    </div>

                    <div>
                      <Label className="text-gray-600 dark:text-gray-400">Tavsif</Label>
                      <p className="font-medium text-gray-900 dark:text-white whitespace-pre-wrap">
                        {profile.description || "Kiritilmagan"}
                      </p>
                    </div>

                    <div className="text-sm text-gray-500 dark:text-gray-400 pt-4 border-t">
                      Oxirgi yangilangan: {new Date(profile.updatedAt).toLocaleString("uz-UZ")}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <Building className="size-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      Biznes profili mavjud emas
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Buyurtma yuborish uchun avval biznes profilingizni yarating
                    </p>
                    <Button onClick={() => setEditing(true)} className="bg-blue-600 hover:bg-blue-700">
                      Profilni yaratish
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
