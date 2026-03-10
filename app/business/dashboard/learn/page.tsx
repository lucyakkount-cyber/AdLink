"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Bot, Send, DollarSign, Target, Sparkles, BarChart3, Rocket, ArrowLeft, BookOpen, Brain, Lightbulb } from "lucide-react"
import { useI18n } from "@/lib/i18n"
import Link from "next/link"

export default function LearnPage() {
  const { tr, locale } = useI18n()
  const [messages, setMessages] = useState<Array<{id: string, text: string, sender: "user" | "ai", timestamp: Date}>>([])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)

  const quickQuestions = locale === "ru"
    ? [
        "Как выбрать лучших блогеров?",
        "Какой бюджет выделить на рекламу?",
        "Какая платформа эффективнее?",
        "Как повысить ROI?",
        "Как заключать договор с блогерами?",
        "Как создавать лучший контент?",
      ]
    : [
        "Eng yaxshi bloggerlarni qanday tanlash mumkin?",
        "Reklama uchun qancha byudjet ajratish kerak?",
        "Qanday platforma samaraliroq?",
        "ROI ni qanday oshirish mumkin?",
        "Bloggerlar bilan qanday shartnoma tuzish kerak?",
        "Eng yaxshi content qanday yaratiladi?",
      ]

  useEffect(() => {
    // Welcome message
    setMessages([{
      id: "1",
      text: tr("learn.welcome_message"),
      sender: "ai",
      timestamp: new Date()
    }])
  }, [tr])

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
          question: userMessage,
          lang: locale,
          context: "learning_mode" // Learning mode context
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
          text: data?.error || data?.fallback || tr("learn.ai_unavailable"),
          sender: "ai",
          timestamp: new Date()
        }])
      }
    } catch (error) {
      console.error('Learning AI error:', error)
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        text: tr("learn.check_internet"),
        sender: "ai",
        timestamp: new Date()
      }])
    } finally {
      setIsTyping(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900">
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #3b82f6, #8b5cf6);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #2563eb, #7c3aed);
        }
        .custom-scrollbar.dark::-webkit-scrollbar-track {
          background: #1f2937;
        }
        .custom-scrollbar.dark::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #60a5fa, #a78bfa);
        }
      `}</style>
      {/* Header */}
      <div className="border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 py-4 lg:px-6 lg:py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/business/dashboard">
                <Button variant="outline" size="sm" className="bg-white/80 dark:bg-slate-800/80">
                  <ArrowLeft className="size-4 mr-2" />
                  {tr("nav.back")}
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="size-10 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                    <Brain className="size-6 text-white" />
                  </div>
                  <Sparkles className="absolute -top-1 -right-1 size-4 text-yellow-400 animate-pulse" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {tr("learn.title")}
                  </h1>
                  <p className="text-muted-foreground">{tr("learn.subtitle")}</p>
                </div>
              </div>
            </div>
            <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
              <BookOpen className="size-3 mr-1" />
              {tr("learn.mode_badge")}
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-6 lg:py-12">
        <div className="grid gap-8 lg:grid-cols-[1fr_450px]">
          {/* Learning Topics */}
          <div className="space-y-6">
            {/* Hero Card */}
            <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
              <CardContent className="pt-6">
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <Lightbulb className="size-6" />
                  {tr("learn.center_title")}
                </CardTitle>
                <p className="text-blue-100 text-lg leading-relaxed">
                  {tr("learn.center_desc")}
                </p>
                <div className="mt-6 flex gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold">1250+</div>
                    <div className="text-sm text-blue-200">{tr("learn.stats.bloggers")}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold">56M+</div>
                    <div className="text-sm text-blue-200">{tr("learn.stats.audience")}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold">24/7</div>
                    <div className="text-sm text-blue-200">{tr("learn.stats.support")}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Learning Topics Grid */}
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-white dark:bg-slate-800">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="size-12 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                      <Target className="size-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">{tr("learn.topic.blogger_marketing.title")}</h3>
                      <p className="text-muted-foreground text-sm mb-4">{tr("learn.topic.blogger_marketing.desc")}</p>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="w-full"
                        onClick={() => setInputValue(tr("learn.topic.blogger_marketing.prompt"))}
                      >
                        {tr("learn.start")}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-white dark:bg-slate-800">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="size-12 rounded-xl bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center flex-shrink-0">
                      <BarChart3 className="size-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">{tr("learn.topic.market_analytics.title")}</h3>
                      <p className="text-muted-foreground text-sm mb-4">{tr("learn.topic.market_analytics.desc")}</p>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="w-full"
                        onClick={() => setInputValue(tr("learn.topic.market_analytics.prompt"))}
                      >
                        {tr("learn.start")}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-white dark:bg-slate-800">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="size-12 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                      <Rocket className="size-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">{tr("learn.topic.content_marketing.title")}</h3>
                      <p className="text-muted-foreground text-sm mb-4">{tr("learn.topic.content_marketing.desc")}</p>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="w-full"
                        onClick={() => setInputValue(tr("learn.topic.content_marketing.prompt"))}
                      >
                        {tr("learn.start")}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-white dark:bg-slate-800">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="size-12 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center flex-shrink-0">
                      <DollarSign className="size-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">{tr("learn.topic.budget_optimization.title")}</h3>
                      <p className="text-muted-foreground text-sm mb-4">{tr("learn.topic.budget_optimization.desc")}</p>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="w-full"
                        onClick={() => setInputValue(tr("learn.topic.budget_optimization.prompt"))}
                      >
                        {tr("learn.start")}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Questions */}
            <Card className="border-0 bg-white dark:bg-slate-800">
              <CardContent className="pt-6 space-y-3">
                <CardTitle className="flex items-center gap-2">
                  <Target className="size-5" />
                  {tr("learn.quick_questions")}
                </CardTitle>
                <div className="grid gap-2">
                  {quickQuestions.map((question, index) => (
                    <div 
                      key={index}
                      className="p-3 bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-800 dark:to-blue-900/20 rounded-lg cursor-pointer hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/30 dark:hover:to-purple-900/30 transition-all duration-200 border border-blue-200 dark:border-blue-800"
                      onClick={() => setInputValue(question)}
                    >
                      <div className="flex items-center gap-2">
                        <div className="size-2 rounded-full bg-blue-500"></div>
                        <span className="text-sm font-medium">{question}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chat Interface */}
          <div className="lg:sticky lg:top-8">
            <Card className="h-[700px] flex flex-col border-0 bg-white dark:bg-slate-800 shadow-xl rounded-xl overflow-hidden">
              {/* Chat Header - Sticky */}
              <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 flex items-center gap-3 z-10">
                <div className="relative">
                  <div className="size-8 rounded-lg bg-white/20 flex items-center justify-center">
                    <Bot className="size-5 text-white" />
                  </div>
                  <Sparkles className="absolute -top-1 -right-1 size-3 text-yellow-300 animate-pulse" />
                </div>
                <div>
                  <h3 className="font-semibold">{tr("learn.chat.title")}</h3>
                  <p className="text-xs text-blue-100">{tr("learn.chat.subtitle")}</p>
                </div>
              </div>
              
              <CardContent className="flex-1 flex flex-col p-0">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 max-h-[450px] custom-scrollbar dark:custom-scrollbar">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[85%] p-4 rounded-2xl ${
                          message.sender === "user"
                            ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                            : "bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 shadow-md border border-gray-200 dark:border-gray-600"
                        }`}
                      >
                        <div className="whitespace-pre-wrap text-sm leading-relaxed">{message.text}</div>
                        <div className={`text-xs mt-2 ${message.sender === "user" ? "text-blue-100" : "text-gray-500"}`}>
                          {message.timestamp.toLocaleTimeString("uz-UZ", { hour: "2-digit", minute: "2-digit" })}
                        </div>
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-white dark:bg-slate-700 p-4 rounded-2xl shadow-md border border-gray-200 dark:border-gray-600">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Input - Fixed at bottom */}
                <div className="sticky bottom-0 p-4 bg-gradient-to-t from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex gap-2">
                    <Textarea
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder={tr("learn.input_placeholder")}
                      className="flex-1 resize-none border-gray-200 dark:border-gray-600 bg-white dark:bg-slate-700"
                      rows={3}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault()
                          handleSend()
                        }
                      }}
                    />
                    <Button 
                      onClick={handleSend} 
                      disabled={isTyping} 
                      className="self-end bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 border-0"
                    >
                      <Send className="size-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
