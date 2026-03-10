"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Bot, Send, TrendingUp, Users, DollarSign, Target, Sparkles, BarChart3, Rocket, MessageCircle } from "lucide-react"
import { useI18n } from "@/lib/i18n"

interface BusinessAIChatProps {
  userBudget?: number
  userProduct?: string
  userCategory?: string
  userRole?: string // "business" yoki "blogger"
}

export function BusinessAIChat({ userBudget, userProduct, userCategory, userRole = "business" }: BusinessAIChatProps) {
  const { tr } = useI18n()
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Array<{id: string, text: string, sender: "user" | "ai", timestamp: Date}>>([])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Welcome message - faqat biznesmenlar uchun
      if (userRole === "business") {
        setMessages([{
          id: "1",
          text: `👋 Assalomu alaykum, biznesmen! Men AdLink AI marketing yordamchisiz.

📊 **Platforma statistikasi:**
• 1250+ faol blogger
• O'rtacha auditoriya: 45K
• O'rtacha narx: 500K so'm
• Jami auditoriya: 56M+

${userBudget ? `💰 Sizning byudjetingiz: ${(userBudget / 1000).toFixed(0)}K so'm` : ''}
${userProduct ? `📦 Mahsulotingiz: ${userProduct}` : ''}
${userCategory ? `🎯 Kategoriya: ${userCategory}` : ''}

🤖 Men AI yordamchi sifatida sizga quyidagilarda yordam beraman:
• Bloggerlar statistikasi va tanlash
• Marketing strategiyalari
• Brending va reklama maslahatlari
• Sotuvlarni oshirish usullari
• Byudjet optimizatsiyasi

Savolingizni yuboring!`,
          sender: "ai",
          timestamp: new Date()
        }])
      }
    }
  }, [isOpen, userBudget, userProduct, userCategory, userRole])

  const handleSend = async () => {
    if (!inputValue.trim()) return

    const userMessage = inputValue.trim()
    setInputValue("")
    setIsTyping(true)

    // Add user message
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      text: userMessage,
      sender: "user",
      timestamp: new Date()
    }])

    try {
      // Call AI API
      const response = await fetch('/api/ai/business-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userBudget,
          userProduct,
          userCategory,
          question: userMessage
        })
      })

      const raw = await response.text()
      const data = (() => {
        try {
          return raw ? JSON.parse(raw) : null
        } catch {
          return null
        }
      })()
      
      if (data?.success) {
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          text: data.response,
          sender: "ai",
          timestamp: new Date()
        }])
      } else {
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          text: data?.error || data?.fallback || "AI hozircha mavjud emas. Iltimos, keyinroq urinib ko'ring.",
          sender: "ai",
          timestamp: new Date()
        }])
      }
    } catch (error) {
      console.error('AI Chat error:', error)
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        text: "Internet aloqasini tekshiring. AI hozircha mavjud emas.",
        sender: "ai",
        timestamp: new Date()
      }])
    } finally {
      setIsTyping(false)
    }
  }

  // Faqat biznesmenlar ko'radi
  if (userRole !== "business") {
    return null
  }

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 relative bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 z-50"
        size="lg"
      >
        <Bot className="size-6" />
        <Sparkles className="absolute -top-1 -right-1 size-3 text-yellow-300 animate-pulse" />
      </Button>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-96 h-[600px] bg-background border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden backdrop-blur-sm">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Bot className="size-6" />
            <Sparkles className="absolute -top-1 -right-1 size-3 text-yellow-300 animate-pulse" />
          </div>
          <div>
            <h3 className="font-semibold">AdLink Business AI</h3>
            <p className="text-xs text-blue-100">AI Assistant</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(false)}
          className="text-white hover:bg-white/20"
        >
          ×
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.sender === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              }`}
            >
              <div className="whitespace-pre-wrap text-sm">{message.text}</div>
              <div className="text-xs opacity-70 mt-1">
                {message.timestamp.toLocaleTimeString("uz-UZ", { hour: "2-digit", minute: "2-digit" })}
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-border p-4">
        <div className="flex gap-2">
          <Textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Savolingizni yuboring..."
            className="flex-1 resize-none"
            rows={2}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
          />
          <Button onClick={handleSend} disabled={isTyping}>
            <Send className="size-4" />
          </Button>
        </div>
        <div className="flex gap-2 mt-2">
          <Badge variant="outline" className="text-xs">
            <BarChart3 className="size-3 mr-1" />
            Analytics
          </Badge>
          <Badge variant="outline" className="text-xs">
            <Target className="size-3 mr-1" />
            Strategy
          </Badge>
          <Badge variant="outline" className="text-xs">
            <Rocket className="size-3 mr-1" />
            Growth
          </Badge>
        </div>
      </div>
    </div>
  )
}
