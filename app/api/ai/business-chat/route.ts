import { NextResponse } from "next/server"
import { callGroqChat } from "@/lib/groq"

export const runtime = "nodejs"

function detectLanguage(text: string): "ru" | "uz" | "en" {
  const t = text || ""
  // Cyrillic characters -> Russian
  if (/[\u0400-\u04FF]/.test(t)) return "ru"
  // Default to Uzbek for this product; if user uses plain English words, treat as EN
  if (/[a-z]/i.test(t) && !/[ʻ’‘]/.test(t)) return "en"
  return "uz"
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userBudget, userProduct, userCategory, question, lang } = body

    if (!question) {
      return NextResponse.json(
        { error: "Savol kiritish shart" },
        { status: 400 }
      )
    }

    const context = `
Foydalanuvchi ma'lumotlari:
${userBudget ? `• Byudjet: ${userBudget} so'm` : ""}
${userProduct ? `• Mahsulot: ${userProduct}` : ""}
${userCategory ? `• Kategoriya: ${userCategory}` : ""}

Platforma statistikasi:
• 1250+ faol blogger
• O'rtacha auditoriya: 45K
• O'rtacha narx: 500K so'm
• Platformalar: Telegram, Instagram, TikTok
• Top kategoriyalar: Lifestyle, Tech, Food, Fashion

Savol: ${question}

Iltimos, bu savolga professional business maslahati bering. Bloggerlar statistikasi, marketing strategiyasi, brending va sotuvlarni oshirish bo'yicha tavsiyalar bering. Raqamlar va aniq misollar bilan ishlang.
`

    const resolvedLang: "ru" | "uz" | "en" =
      lang === "ru" || lang === "uz" || lang === "en" ? lang : detectLanguage(question)
    const languageInstruction =
      resolvedLang === "ru"
        ? "Отвечай строго на русском языке."
        : resolvedLang === "en"
          ? "Reply strictly in English."
          : "Javobni faqat o'zbek tilida yozing."

    const aiResponse = await callGroqChat({
      prompt: context,
      system:
        `Siz AdLink platformasi uchun business AI yordamchisisiz. O'zbekiston bloggerlari va marketing strategiyalari haqida maslahat berasiz. Har doim professional va foydali javoblar bering. Siz ruscha, o'zbekcha va inglizcha savollarni tushunasiz. ${languageInstruction}`,
    })

    return NextResponse.json({
      success: true,
      response: aiResponse
    })

  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error"
    console.error("Business AI Chat error:", error)

    const friendly = message.toLowerCase().includes("groq_api_key") || message.toLowerCase().includes("groq_api_key is not set")
      ? "GROQ_API_KEY yo'q. .env.local ga GROQ_API_KEY=... qo'shing va serverni qayta ishga tushiring."
      : message

    return NextResponse.json(
      {
        success: false,
        error: friendly,
        fallback:
          "AI hozircha mavjud emas. Iltimos, keyinroq urinib ko'ring.",
      },
      { status: 500 }
    )
  }
}
