"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Send, Package, DollarSign, Building, User, Check, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { useI18n } from "@/lib/i18n"

interface OrderBloggerProps {
  blogger: {
    userId: number
    username: string
    email: string
    audience: number
    price: number
    categories: string[]
    targetAudiences: string[]
    socials: string[]
  }
  onOrderSent?: () => void
}

export function OrderBlogger({ blogger, onOrderSent }: OrderBloggerProps) {
  const { tr } = useI18n()
  const [message, setMessage] = useState("")
  const [budget, setBudget] = useState("")
  const [productCategory, setProductCategory] = useState("")
  const [description, setDescription] = useState("")
  const [businessName, setBusinessName] = useState("")
  const [businessEmail, setBusinessEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [hasBusinessProfile, setHasBusinessProfile] = useState(false)
  const [orderData, setOrderData] = useState({
    message: "",
    budget: "",
    productCategory: "",
    description: "",
    businessName: "",
    businessEmail: ""
  })

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
      setBudget(e.target.value)
    }
  }

  useEffect(() => {
    // Check user role and business profile
    const checkUserRole = async () => {
      try {
        const response = await fetch('/api/auth/me', { credentials: "include" })
        if (response.ok) {
          const data = await response.json()
          setUserRole(data.role)
          
          // If user is business, check if they have a business profile
          if (data.role === 'business') {
            const profileResponse = await fetch('/api/business/profile', { credentials: "include" })
            if (profileResponse.ok) {
              const profileData = await profileResponse.json()
              setHasBusinessProfile(!!profileData && profileData.companyName)
              if (profileData?.companyName) {
                setBusinessName(profileData.companyName)
              }
              if (profileData?.email) {
                setBusinessEmail(profileData.email)
              }
            } else {
              setHasBusinessProfile(false)
            }
          }
        } else {
          setUserRole(null)
          setHasBusinessProfile(false)
        }
      } catch (err) {
        console.error('Failed to check user role:', err)
        setUserRole(null)
        setHasBusinessProfile(false)
      }
    }

    checkUserRole()
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    // Store current form data for success message
    const currentOrderData = {
      message,
      budget,
      productCategory,
      description,
      businessName,
      businessEmail
    }

    try {
      const response = await fetch('/api/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bloggerId: blogger.userId,
          message: currentOrderData.message,
          budget: Number(currentOrderData.budget.replace(/\s/g, '').replace(/,/g, '')),
          productCategory: currentOrderData.productCategory,
          description: currentOrderData.description,
          businessName: currentOrderData.businessName,
          businessEmail: currentOrderData.businessEmail
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        
        // Handle business profile missing error
        if (errorData.needsProfile && errorData.profileType === "business") {
          throw new Error(`${tr("ai_matching.business_profile_missing")} <button onclick='window.location.href=\"/business/dashboard/profile\"' style='background: #3b82f6; color: white; padding: 4px 8px; border: none; border-radius: 4px; cursor: pointer;'>${tr("ai_matching.create_profile")}</button>`)
        }
        
        throw new Error(errorData.error || 'Failed to send order')
      }

      const data = await response.json().catch(() => ({}))
      
      if (data.success) {
        setSuccess(true)
        // Store order data for display
        setOrderData(currentOrderData)
        
        // Reset form
        setMessage("")
        setBudget("")
        setProductCategory("")
        setDescription("")
        setBusinessName("")
        setBusinessEmail("")
        
        if (onOrderSent) {
          onOrderSent()
        }
      } else {
        throw new Error('Failed to send order')
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <Card className="border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20">
        <CardContent className="p-6 text-center">
          <Check className="size-12 text-green-600 dark:text-green-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-2">{tr("ai_matching.order_sent")}</h3>
          <p className="text-green-700 dark:text-green-300 mb-4">
            {tr("ai_matching.order_sent_desc", { bloggerName: blogger.username })}
          </p>
          <div className="bg-green-100 dark:bg-green-800/30 rounded-lg p-4 mb-4">
            <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">{tr("ai_matching.order_details")}</h4>
            <div className="space-y-1 text-sm text-green-700 dark:text-green-300">
              <div className="flex justify-between">
                <span>{tr("ai_matching.order_blogger", { bloggerName: blogger.username })}</span>
              </div>
              <div className="flex justify-between">
                <span>{tr("ai_matching.order_business_name")}:</span>
                <span>{orderData.businessName || "Kiritilmagan"}</span>
              </div>
              <div className="flex justify-between">
                <span>{tr("ai_matching.order_business_email")}:</span>
                <span>{orderData.businessEmail || "Kiritilmagan"}</span>
              </div>
              <div className="flex justify-between">
                <span>{tr("ai_matching.order_categories")}:</span>
                <span>{orderData.productCategory || "Kiritilmagan"}</span>
              </div>
              <div className="flex justify-between">
                <span>{tr("ai_matching.order_budget")}:</span>
                <span>{orderData.budget ? formatNumber(orderData.budget) + " so'm" : "Kiritilmagan"}</span>
              </div>
              {orderData.description && (
                <div className="mt-2 pt-2 border-t border-green-200 dark:border-green-700">
                  <span className="text-xs text-green-700 dark:text-green-300">{orderData.description}</span>
                </div>
              )}
            </div>
          </div>
          <Button onClick={() => {
    setSuccess(false)
    setOrderData({
      message: "",
      budget: "",
      productCategory: "",
      description: "",
      businessName: "",
      businessEmail: ""
    })
  }} variant="outline" className="border-green-600 dark:border-green-400 text-green-600 dark:text-green-400">
            {tr("ai_matching.new_order")}
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="size-5" />
          Buyurtma yuborish
        </CardTitle>
        <div className="text-sm text-muted-foreground">
          <p className="font-medium">{blogger.username}</p>
          <p>Auditoriya: {blogger.audience.toLocaleString()} • Narx: {blogger.price.toLocaleString("uz-UZ")} so'm</p>
          <p>Kategoriyalar: {blogger.categories?.length > 0 ? blogger.categories.join(", ") : "Kiritilmagan"}</p>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
              <p 
                className="text-red-600 dark:text-red-400 text-sm" 
                dangerouslySetInnerHTML={{ __html: error }}
              />
            </div>
          )}

          <div className={cn(
            "rounded-lg p-3",
            userRole === 'business' && hasBusinessProfile ? "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800" : 
            userRole === 'business' && !hasBusinessProfile ? "bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800" :
            "bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
          )}>
            <div className="flex items-center gap-2 mb-2">
              <Building className="size-4" />
              <span className={cn(
                "text-sm font-medium",
                userRole === 'business' && hasBusinessProfile ? "text-blue-800 dark:text-blue-200" :
                userRole === 'business' && !hasBusinessProfile ? "text-yellow-800 dark:text-yellow-200" :
                "text-gray-800 dark:text-gray-200"
              )}>
                {userRole === 'business' && hasBusinessProfile ? "Biznes profili mavjud" :
                 userRole === 'business' && !hasBusinessProfile ? "Biznes profili kerak" :
                 "Foydalanuvchi roli"}
              </span>
            </div>
            <p className={cn(
              "text-xs mt-1",
              userRole === 'business' && hasBusinessProfile ? "text-blue-600 dark:text-blue-300" :
              userRole === 'business' && !hasBusinessProfile ? "text-yellow-600 dark:text-yellow-300" :
              "text-gray-600 dark:text-gray-300"
            )}>
              {userRole === 'business' && hasBusinessProfile ? "Siz tizimga muvaffaqiyatli kirdingiz. Biznes profilingiz to'liq tayyor, buyurtma yuborishingiz mumkin." :
               userRole === 'business' && !hasBusinessProfile ? "Siz biznes foydalanuvchisiz, lekin biznes profilingiz mavjud emas. Buyurtma yuborish uchun profil yarating." :
               userRole ? `Sizning rolingiz: ${userRole}. Buyurtma yuborish uchun biznes foydalanuvchi bo'lish kerak.` : 
               "Tizimga kirmagansiz. Buyurtma yuborish uchun avval tizimga kiring."}
            </p>
            {userRole === 'business' && !hasBusinessProfile && (
              <div className="mt-3">
                <Button 
                  onClick={() => window.location.href = '/business/dashboard/profile'}
                  size="sm"
                  className="bg-yellow-600 hover:bg-yellow-700"
                >
                  <Building className="size-4 mr-2" />
                  Biznes profilini yarating
                </Button>
              </div>
            )}
            {!userRole && (
              <div className="mt-3">
                <Button 
                  onClick={() => window.location.href = '/login'}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <User className="size-4 mr-2" />
                  Tizimga kiring
                </Button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="businessName">{tr("ai_matching.form.business_name")} *</Label>
              <Input
                id="businessName"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder={tr("ai_matching.form.business_name_placeholder")}
                required
              />
            </div>

            <div>
              <Label htmlFor="productCategory">{tr("ai_matching.form.product_category")} *</Label>
              <Input
                id="productCategory"
                value={productCategory}
                onChange={(e) => setProductCategory(e.target.value)}
                placeholder={tr("ai_matching.form.product_category_placeholder")}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="budget">{tr("ai_matching.form.budget")} *</Label>
              <Input
                id="budget"
                type="text"
                value={budget}
                onChange={handleBudgetChange}
                placeholder={tr("ai_matching.form.budget_placeholder")}
                inputMode="numeric"
                required
              />
            </div>

            <div>
              <Label htmlFor="businessEmail">{tr("ai_matching.form.business_email")} *</Label>
              <Input
                id="businessEmail"
                type="email"
                value={businessEmail}
                onChange={(e) => setBusinessEmail(e.target.value)}
                placeholder={tr("ai_matching.form.business_email_placeholder")}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">{tr("ai_matching.form.description")}</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={tr("ai_matching.form.description_placeholder")}
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="message">{tr("ai_matching.form.message")} *</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={tr("ai_matching.form.message_placeholder")}
              rows={4}
              required
            />
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">{tr("ai_matching.order_summary")}</h4>
            <div className="space-y-1 text-sm">
              <div className="flex items-center gap-2">
                <User className="size-3 text-blue-600 dark:text-blue-400" />
                <span className="text-gray-700 dark:text-gray-300">{tr("ai_matching.order_blogger", { bloggerName: blogger.username })}</span>
              </div>
              <div className="flex items-center gap-2">
                <Building className="size-3 text-blue-600 dark:text-blue-400" />
                <span className="text-gray-700 dark:text-gray-300">{tr("ai_matching.order_business_name")}: {businessName || tr("ai_matching.order_not_entered")}</span>
              </div>
              <div className="flex items-center gap-2">
                <Package className="size-3 text-blue-600 dark:text-blue-400" />
                <span className="text-gray-700 dark:text-gray-300">{tr("ai_matching.order_categories")}: {productCategory || tr("ai_matching.order_not_entered")}</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="size-3 text-blue-600 dark:text-blue-400" />
                <span className="text-gray-700 dark:text-gray-300">{tr("ai_matching.order_budget")}: {budget ? formatNumber(budget) + " so'm" : tr("ai_matching.order_not_entered")}</span>
              </div>
              {description && (
                <div className="flex items-center gap-2">
                  <Package className="size-3 text-blue-600 dark:text-blue-400" />
                  <span className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{description}</span>
                </div>
              )}
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading || !message.trim() || !budget || !productCategory || !businessName || !businessEmail || userRole !== 'business' || !hasBusinessProfile}
            className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {tr("ai_matching.form.submitting")}
              </>
            ) : (
              <>
                <Send className="size-4 mr-2" />
                {tr("ai_matching.form.submit")}
              </>
            )}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            {tr("ai_matching.form.footer_note")}
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
