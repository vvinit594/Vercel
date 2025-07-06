import { type NextRequest, NextResponse } from "next/server"

const DEEPSEEK_API_KEY = "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"
const ELEVENLABS_API_KEY = "ap2_8c9180b7-fbf3-4f8f-b1ff-1d56c8a1500b"

export async function POST(request: NextRequest) {
  try {
    const { userProfile, questionNumber, previousResponse } = await request.json()

    // Generate interview question using DeepSeek
    const prompt = `You are an AI interviewer conducting a ${userProfile.jobRole} interview. 
    Candidate details:
    - Name: ${userProfile.name}
    - Experience: ${userProfile.experience}
    - Skills: ${userProfile.skills}
    - Previous response: ${previousResponse || "None"}
    
    Generate question ${questionNumber} of 10. Make it relevant to their role and experience level.
    Keep it conversational and professional. Return only the question.`

    const aiResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-chat",
        messages: [
          { role: "system", content: "You are a professional AI interviewer." },
          { role: "user", content: prompt },
        ],
        max_tokens: 200,
        temperature: 0.7,
      }),
    })

    const aiData = await aiResponse.json()
    const question = aiData.choices[0].message.content

    // Generate audio using ElevenLabs
    const ttsResponse = await fetch("https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM", {
      method: "POST",
      headers: {
        Accept: "audio/mpeg",
        "Content-Type": "application/json",
        "xi-api-key": ELEVENLABS_API_KEY,
      },
      body: JSON.stringify({
        text: question,
        model_id: "eleven_monolingual_v1",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.5,
        },
      }),
    })

    const audioBuffer = await ttsResponse.arrayBuffer()
    const audioBase64 = Buffer.from(audioBuffer).toString("base64")

    return NextResponse.json({
      question,
      audio: audioBase64,
    })
  } catch (error) {
    console.error("Error generating interview question:", error)
    return NextResponse.json({ error: "Failed to generate question" }, { status: 500 })
  }
}
