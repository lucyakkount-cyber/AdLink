"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  MessageCircle,
  Send,
  X,
  Bot,
  Sparkles,
  User,
  Image
} from "lucide-react"
import { useI18n } from "@/lib/i18n"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  text: string
  sender: "user" | "ai"
  timestamp: Date
  image?: string
}

export function ChatWidget() {
  const { tr, locale } = useI18n()
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: tr("chat.welcome_message"),
      sender: "ai",
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Update welcome message when locale changes
  useEffect(() => {
    setMessages(prev => prev.map(msg =>
      msg.id === "1"
        ? { ...msg, text: tr("chat.welcome_message") }
        : msg
    ))
  }, [locale, tr])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const generateAIResponse = (userMessage: string, hasImage: boolean): string => {
    const message = userMessage.toLowerCase()

    // Agar rasm yuborilgan bo'lsa
    if (hasImage) {
      return tr("chat.image_response")
    }

    // Sayt haqida savollar
    if (message.includes("sayt") || message.includes("platforma") || message.includes("nima qilasiz")) {
      return "AdLink - bu O'zbekiston bizneslari va bloggerlarini bog'laydigan AI platforma. Biz bizneslarga mahsulotlari uchun eng mos blogerlarni topamiz va avtomatik reklama postlari yaratamiz. Bloggerlar esa bizneslardan buyurtmalar olishlari mumkin."
    }

    // Blogger topish haqida
    if (message.includes("blogger") || message.includes("topish") || message.includes("qanday topaman")) {
      return "Blogger topish uchun: 1) Biznes akkauntingizga kiring 2) 'AI Blogger Matching' bo'limiga o'ting 3) Mahsulotingizni tasvirlab, byudjetni kiriting 4) AI siz uchun eng mos 15 ta blogerni tanlaydi 5) Har bir blogger uchun reklama posti yaratadi. Butun jarayon atigi 30 soniyada!"
    }

    // Biznes topish haqida
    if (message.includes("biznes") || message.includes("klient") || message.includes("buyurtma")) {
      return "Biznes topish uchun: 1) Blogger profilini to'liq to'ldiring 2) Auditoriya, narx, kategoriya va ijtimoiy tarmoqlarni kiriting 3) Qaysi viloyatlarda ishlashingizni belgilang 4) Profilni saqlang. Bizneslar sizni AI orqali topishadi va to'g'ridan-to'g'ri bog'lanishadi."
    }

    // Narx haqida
    if (message.includes("narx") || message.includes("pul") || message.includes("to'lov")) {
      return "AdLink hozircha bepul! Bloggerlar va bizneslar platformadan to'liq foydalanishlari mumkin. Kelajakda Pro tariflari bo'ladi: Bloggerlar uchun - oyiga 29,000 so'm, Bizneslar uchun - oyiga 49,000 so'm. Pro tariflarda ko'proq imkoniyatlar bo'ladi."
    }

    // Reklama haqida
    if (message.includes("reklama") || message.includes("post") || message.includes("matn")) {
      return "AI har bir blogger uchun shaxsiy reklama posti yaratadi: 1) Blogger uslubini o'rganadi 2) Mahsulot tavsifini tahlil qiladi 3) O'zbek yoki rus tilida jalb qiluvchi matn yozadi 4) Blogger ovoziga mos hashtaglar qo'shadi. Barcha postlar noyob va samarali!"
    }

    // Viloyatlar haqida
    if (message.includes("viloyat") || message.includes("hudud") || message.includes("joy")) {
      return "Biz butun O'zbekiston bo'ylab blogerlarni qo'llab-quvvatlaymiz: Toshkent shahri/viloyati, Farg'ona vodiysi (Farg'ona, Andijon, Namangan), Samarqand, Buxoro, Xiva, Qashqadaryo, Surxondaryo, Jizzax, Sirdaryo, Qoraqalpog'iston. AI sizga tanlangan hududdagi blogerlarni topadi."
    }

    // Platformalar haqida
    if (message.includes("platforma") || message.includes("telegram") || message.includes("instagram")) {
      return "Biz Telegram, Instagram va TikTok platformalaridagi bloggerlarni qo'llab-quvvatlaymiz. Har bir bloggerning o'z platformasi haqida ma'lumot bor. AI sizga kerakli platformadagi blogerlarni tanlaydi."
    }

    // Ro'yxatdan o'tish haqida
    if (message.includes("ro'yxat") || message.includes("registratsiya") || message.includes("akaunt")) {
      return "Ro'yxatdan o'tish juda oson: 1) /signup sahifasiga o'ting 2) 'Biznes' yoki 'Blogger' ni tanlang 3) Email va parol kiriting 4) Tasdiqlash emailini kuting. Butun jarayon 2 daqiqa! Bloggerlar darhol profilni to'ldirishlari mumkin."
    }

    // Xavfsizlik haqida
    if (message.includes("xavfsizlik") || message.includes("ma'lumot") || message.includes("shaxsiy")) {
      return "Barcha ma'lumotlaringiz xavfsaz saqlanadi: 1) Parollar xeshlanadi 2) Ma'lumotlar mahfiy serverda saqlanadi 3) Bizneslar faqat bloggerlarning ochiq ma'lumotlarini ko'radi 4) Shaxsiy ma'lumotlar hech kimga berilmaydi. Platforma GDPR va O'zbekiston qonunlariga rioya qiladi."
    }

    // Standart javoblar
    if (message.includes("salom") || message.includes("assalom")) {
      return tr("chat.greeting_response")
    }

    if (message.includes("rahmat") || message.includes("tashakkur")) {
      return "Arzimangiz! AdLink platformasidan foydalanganingiz uchun tashakkur. Boshqa savollaringiz bo'lsa, so'rang! 😊"
    }

    if (message.includes("qayt") || message.includes("chiq")) {
      return "Xo'sh! AdLink platformasida yana ko'rishguncha! 🚀"
    }

    // Umumiy javob
    return tr("chat.default_response")
  }

  const handleSend = () => {
    if (!inputValue.trim() && !selectedImage) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
      image: selectedImage || undefined
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue("")
    setSelectedImage(null)
    setIsTyping(true)

    // AI javobini kechiktirish
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateAIResponse(inputValue, !!selectedImage),
        sender: "ai",
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiResponse])
      setIsTyping(false)
    }, 1000 + Math.random() * 1000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      {/* Chat Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          size="lg"
          className="rounded-full w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg transition-all duration-300 hover:scale-110 border-2 border-white"
        >
          {isOpen ? (
            <X className="size-6" />
          ) : (
            <MessageCircle className="size-6" />
          )}
        </Button>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-96 h-[600px] bg-background border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden backdrop-blur-sm">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Bot className="size-6" />
                <Sparkles className="absolute -top-1 -right-1 size-3 text-yellow-300 animate-pulse" />
              </div>
              <div>
                <h3 className="font-semibold">{tr("chat.ai_name")}</h3>
                <p className="text-xs text-blue-100">{tr("chat.ai_status")}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20"
            >
              <X className="size-4" />
            </Button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex gap-3 max-w-[85%]",
                  message.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                )}
              >
                {message.sender === "ai" && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center flex-shrink-0">
                    <Bot className="size-4 text-white" />
                  </div>
                )}
                <div
                  className={cn(
                    "rounded-2xl p-3 text-sm shadow-sm",
                    message.sender === "user"
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                      : "bg-muted text-foreground border border-border"
                  )}
                >
                  {message.image && (
                    <div className="mb-2">
                      <img
                        src={message.image}
                        alt="User uploaded"
                        className="rounded-lg max-w-full h-auto max-h-40 object-cover"
                      />
                    </div>
                  )}
                  <p className="whitespace-pre-line">{message.text}</p>
                  <p className="text-xs mt-1 opacity-70">
                    {message.timestamp.toLocaleTimeString("uz-UZ", {
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </p>
                </div>
                {message.sender === "user" && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center flex-shrink-0">
                    <User className="size-4 text-white" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3 mr-auto">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                  <Bot className="size-4 text-white" />
                </div>
                <div className="bg-muted rounded-2xl p-3 border border-border">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-border p-4 bg-background/95 backdrop-blur-sm">
            {selectedImage && (
              <div className="mb-3 relative inline-block">
                <img
                  src={selectedImage}
                  alt="Selected"
                  className="rounded-lg max-w-full h-auto max-h-32 object-cover"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedImage(null)}
                  className="absolute -top-2 -right-2 rounded-full bg-red-500 hover:bg-red-600 text-white p-1"
                >
                  <X className="size-3" />
                </Button>
              </div>
            )}
            <div className="flex gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="px-3"
              >
                <Image className="size-4" />
              </Button>
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={tr("chat.input_placeholder")}
                className="flex-1"
                disabled={isTyping}
              />
              <Button
                onClick={handleSend}
                size="sm"
                disabled={(!inputValue.trim() && !selectedImage) || isTyping}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Send className="size-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              {tr("chat.footer_text")}
            </p>
          </div>
        </div>
      )}
    </>
  )
}
