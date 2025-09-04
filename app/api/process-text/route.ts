import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { text, action, style } = await request.json()

    if (!text || !action) {
      return NextResponse.json({ error: "Text and action are required" }, { status: 400 })
    }

    // Read configuration from environment
    const apiKey = process.env.GEMINI_API_KEY
    const apiUrl = process.env.GEMINI_API_URL

    if (!apiKey || !apiUrl) {
      return NextResponse.json(
        { error: "Server misconfiguration: missing GEMINI_API_KEY or GEMINI_API_URL" },
        { status: 500 },
      )
    }

    let prompt = ""

    switch (action) {
      case "translate":
        prompt = `Detect the language of this text and translate it to English if it's not already in English. If it's already in English, just return it as is. Format your response with proper markdown formatting including headers, bullet points, and emphasis where appropriate. Text: "${text}"`
        break
      case "paraphrase":
        prompt = `Paraphrase the following text in a ${style} style while preserving the original meaning. Format the response with proper markdown formatting including headers and emphasis where appropriate: "${text}"`
        break
      case "summarize":
        prompt = `Provide a well-organized summary of the following text. Use markdown formatting with headers (## Key Points), bullet points for main ideas, and **bold** for important terms. Text: "${text}"`
        break
      case "grammar":
        prompt = `Correct the grammar, spelling, and improve the fluency of this text. Present the corrected version with proper markdown formatting and highlight key improvements with **bold** text: "${text}"`
        break
      case "tone":
        prompt = `Rewrite this text with a professional tone while preserving the core message. Format the response with proper markdown including headers and emphasis for key points: "${text}"`
        break
      case "keywords":
        prompt = `Extract and organize the key terms and important concepts from this text. Format as markdown with:
## Key Terms
- List important keywords with **bold** emphasis
## Main Concepts  
- List core concepts and themes
## Topics
- List relevant topics and categories

Text: "${text}"`
        break
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      }),
    })

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`)
    }

    const data = await response.json()
    const result = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response generated"

    return NextResponse.json({
      result,
      detectedLanguage: action === "translate" ? "Auto-detected" : null,
    })
  } catch (error) {
    console.error("Error processing text:", error)
    return NextResponse.json({ error: "Failed to process text" }, { status: 500 })
  }
}
