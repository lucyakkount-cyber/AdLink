"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Bell, Check, X, MessageSquare, Calendar, DollarSign, Package, Building } from "lucide-react"
import { cn } from "@/lib/utils"

interface OrderNotification {
  id: string
  businessId: number
  businessName: string
  businessEmail: string
  bloggerId: number
  bloggerUsername: string
  bloggerEmail: string
  message: string
  budget: number
  productCategory: string
  description: string
  createdAt: string
  status: "pending" | "accepted" | "rejected"
  updatedAt?: string
}

interface NotificationsPanelProps {
  bloggerId: number
}

export function NotificationsPanel({ bloggerId }: NotificationsPanelProps) {
  const [notifications, setNotifications] = useState<OrderNotification[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedNotification, setSelectedNotification] = useState<OrderNotification | null>(null)

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/notifications')
      if (!response.ok) {
        throw new Error('Failed to fetch notifications')
      }
      const data = await response.json()
      setNotifications(data.notifications || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const updateNotificationStatus = async (notificationId: string, status: 'accepted' | 'rejected') => {
    try {
      const response = await fetch('/api/notifications', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notificationId, status }),
      })

      if (!response.ok) {
        throw new Error('Failed to update notification')
      }

      const data = await response.json()
      
      // Update local state
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, status, updatedAt: new Date().toISOString() }
            : notification
        )
      )

      // Close detail view if it was the updated notification
      if (selectedNotification?.id === notificationId) {
        setSelectedNotification(null)
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update notification')
    }
  }

  useEffect(() => {
    fetchNotifications()
    
    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000)
    return () => clearInterval(interval)
  }, [])

  const pendingNotifications = notifications.filter(n => n.status === 'pending')
  const hasNotifications = notifications.length > 0

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">Xatolik: {error}</p>
          <Button onClick={fetchNotifications} className="mt-2" size="sm">
            Qayta urinish
          </Button>
        </div>
      </div>
    )
  }

  if (!hasNotifications) {
    return (
      <div className="p-6 text-center">
        <Bell className="size-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Yangi xabarlar yo'q</h3>
        <p className="text-gray-600">Sizga hali hech qanday buyurtma kelmagan</p>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Buyurtmalar</h3>
        {pendingNotifications.length > 0 && (
          <Badge variant="destructive" className="animate-pulse">
            {pendingNotifications.length} yangi
          </Badge>
        )}
      </div>

      {/* Always show all orders by default */}
      <div className="space-y-4">
        {notifications.map((notification) => (
          <Card 
            key={notification.id} 
            className={cn(
              "cursor-pointer transition-all hover:shadow-md",
              notification.status === 'pending' && "border-blue-200 bg-blue-50"
            )}
            onClick={() => setSelectedNotification(notification)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Building className="size-4 text-blue-600" />
                  <span className="font-semibold text-gray-900">{notification.businessName}</span>
                </div>
                <Badge 
                  variant={notification.status === 'pending' ? 'destructive' : 'secondary'}
                  className="text-xs"
                >
                  {notification.status === 'pending' && 'Yangi'}
                  {notification.status === 'accepted' && 'Qabul qilingan'}
                  {notification.status === 'rejected' && 'Rad etilgan'}
                </Badge>
              </div>
              
              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Package className="size-3" />
                  <span>{notification.productCategory}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <DollarSign className="size-3" />
                  <span>{notification.budget.toLocaleString("uz-UZ")} so'm</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="size-3" />
                  <span>{new Date(notification.createdAt).toLocaleDateString("uz-UZ")}</span>
                </div>
              </div>

              {notification.status === 'pending' && (
                <div className="mt-3 pt-3 border-t">
                  <p className="text-xs text-gray-500 line-clamp-2">{notification.message}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detail View Modal */}
      {selectedNotification && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Buyurtma tafsilotlari</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedNotification(null)}
                >
                  <X className="size-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Business Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Building className="size-4 text-blue-600" />
                  <span className="font-semibold text-gray-900">Biznes ma'lumotlari</span>
                </div>
                <p className="text-gray-700"><strong>Nomi:</strong> {selectedNotification.businessName}</p>
                <p className="text-gray-700"><strong>Email:</strong> {selectedNotification.businessEmail}</p>
              </div>

              {/* Product Info */}
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Package className="size-4 text-blue-600" />
                  <span className="font-semibold text-gray-900">Mahsulot ma'lumotlari</span>
                </div>
                <p className="text-gray-700"><strong>Kategoriya:</strong> {selectedNotification.productCategory}</p>
                <p className="text-gray-700"><strong>Byudjet:</strong> {selectedNotification.budget.toLocaleString("uz-UZ")} so'm</p>
                {selectedNotification.description && (
                  <p className="text-gray-700 mt-2"><strong>Tavsif:</strong> {selectedNotification.description}</p>
                )}
              </div>

              {/* Message */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare className="size-4 text-blue-600" />
                  <span className="font-semibold text-gray-900">Xabar</span>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedNotification.message}</p>
                </div>
              </div>

              {/* Timestamp */}
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="size-4" />
                <span>
                  {new Date(selectedNotification.createdAt).toLocaleString("uz-UZ", {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>

              {/* Action Buttons */}
              {selectedNotification.status === 'pending' && (
                <div className="flex gap-3 pt-4 border-t">
                  <Button
                    onClick={() => updateNotificationStatus(selectedNotification.id, 'accepted')}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    <Check className="size-4 mr-2" />
                    Qabul qilish
                  </Button>
                  <Button
                    onClick={() => updateNotificationStatus(selectedNotification.id, 'rejected')}
                    variant="destructive"
                    className="flex-1"
                  >
                    <X className="size-4 mr-2" />
                    Rad etish
                  </Button>
                </div>
              )}

              {selectedNotification.status === 'accepted' && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-700 font-medium">✅ Buyurtma qabul qilindi</p>
                </div>
              )}

              {selectedNotification.status === 'rejected' && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-700 font-medium">❌ Buyurtma rad etildi</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
