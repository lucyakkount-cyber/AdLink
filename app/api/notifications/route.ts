import { NextRequest, NextResponse } from "next/server"
import { withDb } from "@/lib/jsondb"
import { getAuthContext } from "@/lib/server/auth"

interface OrderNotificationRow {
  id: string
  businessId: number
  businessName: string
  businessEmail: string
  bloggerId: number
  bloggerUsername: string
  bloggerEmail: string
  message: string
  budget: number | null
  productCategory: string
  description: string
  createdAt: string
  status: "pending" | "accepted" | "rejected"
  updatedAt?: string
}

// Telegram bot function
async function sendTelegramNotification(
  telegramChatId: string,
  message: string,
  botToken: string
) {
  const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`
  
  try {
    const response = await fetch(telegramUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: telegramChatId,
        text: message,
        parse_mode: 'HTML',
        disable_web_page_preview: false
      })
    })

    if (!response.ok) {
      console.error('Telegram API error:', response.statusText)
      return false
    }

    const data = await response.json()
    return data.ok
  } catch (error) {
    console.error('Error sending Telegram notification:', error)
    return false
  }
}

export async function POST(request: NextRequest) {
  const { authenticated, role, userId } = await getAuthContext()
  
  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  
  if (!userId) {
    return NextResponse.json({ error: "User ID not found" }, { status: 401 })
  }
  
  if (role !== "business") {
    return NextResponse.json({ error: "Forbidden - Only businesses can send orders" }, { status: 403 })
  }

  try {
    const body = await request.json()
    const { bloggerId, message, budget, productCategory, description } = body

    if (!bloggerId || !message || !productCategory) {
      return NextResponse.json({ 
        error: "Missing required fields: bloggerId, message, productCategory" 
      }, { status: 400 })
    }

    // Get business and blogger information
    const [businessProfile, bloggerProfile, businessUser, bloggerUser] = await withDb((db) => {
      const business = db.businessProfiles[String(userId)]
      const blogger = db.bloggerProfiles[String(bloggerId)]
      const businessUserData = db.users.find(u => u.id === userId)
      const bloggerUserData = db.users.find(u => u.id === bloggerId)
      
      return [business, blogger, businessUserData, bloggerUserData]
    })

    // More specific error messages
    if (!businessProfile) {
      return NextResponse.json({ 
        error: "Biznes profili topilmadi. Iltimos, avval biznes profilingizni yarating.",
        needsProfile: true,
        profileType: "business"
      }, { status: 404 })
    }
    if (!bloggerProfile) {
      return NextResponse.json({ error: "Blogger profili topilmadi. Iltimos, blogger profilining mavjudligigini tekshiring." }, { status: 404 })
    }
    if (!businessUser) {
      return NextResponse.json({ error: "Biznes foydalanuvchisi topilmadi. Iltimos, tizimga qayta kiring." }, { status: 404 })
    }
    if (!bloggerUser) {
      return NextResponse.json({ error: "Blogger foydalanuvchisi topilmadi. Iltimos, blogger ro'yxatiga qayta kiring." }, { status: 404 })
    }

    // Create order notification
    const notification: OrderNotificationRow = {
      id: Date.now().toString(),
      businessId: userId,
      businessName: businessProfile.companyName || businessUser.email,
      businessEmail: businessUser.email,
      bloggerId: bloggerId,
      bloggerUsername: bloggerProfile.username,
      bloggerEmail: bloggerUser.email,
      message,
      budget: budget || 0,
      productCategory,
      description: description || "",
      createdAt: new Date().toISOString(),
      status: "pending"
    }

    // Save notification to database
    await withDb((db) => {
      if (!db.orderNotifications) {
        db.orderNotifications = {}
      }
      db.orderNotifications[notification.id] = notification
    })

    // Send Telegram notification to blogger
    const telegramMessage = `
🔔 <b>YANGI BUYURTMA!</b>

📦 <b>Mahsulot:</b> ${productCategory}
💰 <b>Byudjet:</b> ${budget.toLocaleString("uz-UZ")} so'm
🏢 <b>Biznes:</b> ${businessProfile.companyName || businessUser.email}
📧 <b>Email:</b> ${businessUser.email}

💬 <b>Xabar:</b>
${message}

${description ? `\n📝 <b>Tavsif:</b> ${description}` : ''}

⏰ <b>Vaqt:</b> ${new Date().toLocaleString("uz-UZ")}

🤖 <i>Bu xabar AdLink platformasi orqali yuborildi. Buyurtmani qabul qilish uchun platformaga kiring.</i>
    `.trim()

    const botToken = "8701849113:AAGcB1gVksI9KXRB9Cdi_cVwBetzOQF_TCI"
    
    // For demo purposes, we'll use a default chat ID. In production, this should come from blogger's profile
    const bloggerTelegramChatId = "YOUR_DEFAULT_CHAT_ID" // This should be stored in blogger profile
    
    const telegramSent = await sendTelegramNotification(bloggerTelegramChatId, telegramMessage, botToken)

    return NextResponse.json({
      success: true,
      notification: {
        id: notification.id,
        businessName: businessProfile.companyName || businessUser.email,
        bloggerUsername: bloggerProfile.username,
        budget,
        productCategory,
        status: notification.status,
        createdAt: notification.createdAt
      },
      telegramNotificationSent: telegramSent
    })

  } catch (error) {
    console.error('Error sending order notification:', error)
    return NextResponse.json({ 
      error: "Internal server error" 
    }, { status: 500 })
  }
}

// Get notifications for blogger
export async function GET(request: NextRequest) {
  const { authenticated, role, userId } = await getAuthContext()
  
  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const notifications = await withDb((db) => {
      if (!db.orderNotifications) {
        return []
      }

      return Object.values(db.orderNotifications).filter((notification): notification is OrderNotificationRow => {
        if (role === "business") {
          return notification.businessId === userId
        } else if (role === "blogger") {
          return notification.bloggerId === userId
        }
        return false
      }).map((notification): OrderNotificationRow => notification)
    })

    return NextResponse.json({
      notifications: notifications.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    })

  } catch (error) {
    console.error('Error fetching notifications:', error)
    return NextResponse.json({ 
      error: "Internal server error" 
    }, { status: 500 })
  }
}

// Update notification status
export async function PUT(request: NextRequest) {
  const { authenticated, role, userId } = await getAuthContext()
  
  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  
  if (role !== "blogger") {
    return NextResponse.json({ error: "Forbidden - Only bloggers can update status" }, { status: 403 })
  }

  try {
    const body = await request.json()
    const { notificationId, status } = body

    if (!notificationId || !status || !["accepted", "rejected"].includes(status)) {
      return NextResponse.json({ 
        error: "Missing required fields: notificationId, status (must be 'accepted' or 'rejected')" 
      }, { status: 400 })
    }

    const updatedNotification = await withDb((db): OrderNotificationRow | null => {
      if (!db.orderNotifications || !db.orderNotifications[notificationId]) {
        return null
      }
      
      const notification = db.orderNotifications[notificationId]
      
      // Check if this notification belongs to the current blogger
      if (notification.bloggerId !== userId) {
        return null
      }
      
      // Update status
      notification.status = status
      notification.updatedAt = new Date().toISOString()
      return notification
    })

    if (!updatedNotification) {
      return NextResponse.json({ error: "Notification not found or access denied" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      notification: updatedNotification
    })

  } catch (error) {
    console.error('Error updating notification:', error)
    return NextResponse.json({ 
      error: "Internal server error" 
    }, { status: 500 })
  }
}
