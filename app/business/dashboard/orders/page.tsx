"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, Calendar, DollarSign, User, Home } from "lucide-react"
import { useI18n } from "@/lib/i18n"
import { cn } from "@/lib/utils"
import Link from "next/link"

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

export default function BusinessDashboard() {
  const { tr } = useI18n()
  const [orders, setOrders] = useState<OrderNotification[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchOrders = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true)
      const response = await fetch('/api/notifications', { credentials: "include" })
      if (!response.ok) {
        throw new Error('Failed to fetch orders')
      }
      const data = await response.json()
      setOrders(data.notifications || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      if (showLoading) setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders(true)
    
    // Auto-refresh orders every 30 seconds (without loading indicator)
    const interval = setInterval(() => fetchOrders(false), 30000)
    return () => clearInterval(interval)
  }, [])

  const pendingOrders = orders.filter(order => order.status === 'pending')
  const acceptedOrders = orders.filter(order => order.status === 'accepted')
  const rejectedOrders = orders.filter(order => order.status === 'rejected')

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="mx-auto max-w-4xl">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
            <div className="bg-white rounded-xl p-6">
              <div className="h-32 bg-gray-200 rounded mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Link href="/business/dashboard">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Home className="size-4" />
                {tr("orders.back_to_dashboard")}
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{tr("orders.my_orders")}</h1>
            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>{tr("orders.auto_refresh")}</span>
            </div>
          </div>
        </div>

        <div className="grid gap-6">
          {/* Orders Section - Full Width */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="size-5" />
                {tr("orders.title")}
              </CardTitle>
              <div className="flex gap-2">
                {pendingOrders.length > 0 && (
                  <Badge variant="destructive" className="animate-pulse">
                    {pendingOrders.length} {tr("orders.pending")}
                  </Badge>
                )}
                {acceptedOrders.length > 0 && (
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    {acceptedOrders.length} {tr("orders.accepted")}
                  </Badge>
                )}
                {rejectedOrders.length > 0 && (
                  <Badge variant="secondary" className="dark:bg-gray-700 dark:text-gray-300">
                    {rejectedOrders.length} {tr("orders.rejected")}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {orders.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="size-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{tr("orders.no_orders")}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{tr("orders.no_orders_desc")}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <Card key={order.id} className={cn(
                      "border-l-4 transition-all hover:shadow-md",
                      order.status === 'pending' && "border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/20",
                      order.status === 'accepted' && "border-l-green-500 bg-green-50 dark:bg-green-900/20",
                      order.status === 'rejected' && "border-l-red-500 bg-red-50 dark:bg-red-900/20"
                    )}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <User className="size-4 text-blue-600" />
                            <span className="font-semibold text-gray-900 dark:text-white">{order.bloggerUsername}</span>
                          </div>
                          <Badge 
                            variant={order.status === 'pending' ? 'destructive' : order.status === 'accepted' ? 'default' : 'secondary'}
                            className={cn(
                              "text-xs",
                              order.status === 'pending' && "animate-pulse bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-200 dark:border-yellow-700",
                              order.status === 'accepted' && "bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-700",
                              order.status === 'rejected' && "bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-200 dark:border-red-700"
                            )}
                          >
                            {order.status === 'pending' && tr("orders.pending")}
                            {order.status === 'accepted' && tr("orders.accepted")}
                            {order.status === 'rejected' && tr("orders.rejected")}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                            <Package className="size-3" />
                            <span>{order.productCategory}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                            <DollarSign className="size-3" />
                            <span>{order.budget.toLocaleString("uz-UZ")} so'm</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                            <Calendar className="size-3" />
                            <span>{new Date(order.createdAt).toLocaleDateString("uz-UZ")}</span>
                          </div>
                        </div>

                        {order.status === 'pending' && (
                          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{order.message}</p>
                            <div className="mt-2 flex items-center gap-1">
                              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                              <p className="text-xs text-yellow-600 dark:text-yellow-400 font-medium">{tr("orders.waiting_response")}</p>
                            </div>
                          </div>
                        )}

                        {order.status === 'accepted' && (
                          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                            <p className="text-sm text-green-600 dark:text-green-400 font-medium">✅ {tr("orders.order_accepted")}</p>
                            <p className="text-xs text-green-500 dark:text-green-600 mt-1">
                              {order.updatedAt ? `${tr("orders.accepted_at")}: ${new Date(order.updatedAt).toLocaleString("uz-UZ")}` : tr("orders.recently_accepted")}
                            </p>
                          </div>
                        )}

                        {order.status === 'rejected' && (
                          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                            <p className="text-sm text-red-600 dark:text-red-400 font-medium">❌ {tr("orders.order_rejected")}</p>
                            <p className="text-xs text-red-500 dark:text-red-600 mt-1">
                              {order.updatedAt ? `${tr("orders.rejected_at")}: ${new Date(order.updatedAt).toLocaleString("uz-UZ")}` : tr("orders.recently_rejected")}
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
