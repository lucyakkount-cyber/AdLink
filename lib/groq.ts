export interface GroqChatCompletionResponse {
  id: string
  object: string
  created: number
  model: string
  choices: Array<{
    index: number
    message: {
      role: string
      content: string
    }
    finish_reason: string
  }>
  usage?: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

export async function callGroqChat(params: {
  prompt: string
  system?: string
  model?: string
}): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) {
    throw new Error("GROQ_API_KEY is not set. Add it to .env.local and restart dev server.")
  }

  const preferredModel = (params.model || process.env.GROQ_MODEL || "").trim() || undefined
  // Keep fallbacks aligned with models visible in Groq Console "Base Models" list.
  const fallbackModels = [
    "groq/compound-mini",
    "groq/compound",
    "llama-3.3-70b-versatile",
    "meta-llama/llama-4-scout-17b-16e-instruct",
    "qwen/qwen3-32b",
    "moonshotai/kimi-k2-instruct",
  ]
  // If user explicitly chose a model, don't try others (org may block them).
  const modelsToTry = preferredModel
    ? [preferredModel]
    : fallbackModels

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 20_000)

  try {
    const errors: string[] = []

    for (const model of modelsToTry) {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          messages: [
            ...(params.system ? [{ role: "system", content: params.system }] : []),
            { role: "user", content: params.prompt },
          ],
          temperature: 0.7,
          max_tokens: 1000,
        }),
        signal: controller.signal,
      })

      const rawText = await response.text()

      if (!response.ok) {
        console.error("Groq API error", {
          model,
          status: response.status,
          statusText: response.statusText,
          body: rawText,
        })
        errors.push(
          `Model: ${model} -> ${response.status} ${response.statusText}. Body: ${rawText || "<empty>"}`
        )
        continue
      }

      const data: GroqChatCompletionResponse = JSON.parse(rawText)
      const content = data.choices?.[0]?.message?.content
      if (!content) {
        console.error("Groq API: empty content", { model, body: rawText })
        errors.push(`Model: ${model} -> empty content`) 
        continue
      }

      return content
    }

    throw new Error(
      `Groq API failed. ${preferredModel ? "Tried model" : "Tried models"}: ${modelsToTry.join(", ")}. Errors: ${errors.join(" | ")}`
    )
  } catch (error) {
    console.error("Groq API fetch failed:", error)
    throw error
  } finally {
    clearTimeout(timeoutId)
  }
}
