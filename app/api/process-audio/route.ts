import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const audioFile = formData.get("audio") as File

    if (!audioFile) {
      return NextResponse.json({ error: "No audio file provided" }, { status: 400 })
    }

    // Convert audio to buffer
    const audioBuffer = await audioFile.arrayBuffer()

    // Send to AssemblyAI for transcription
    const transcriptionResponse = await fetch("https://api.assemblyai.com/v2/transcript", {
      method: "POST",
      headers: {
        Authorization: "dc66f4588d5c4c72a72f79ef2d0eea23",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        audio_data: Buffer.from(audioBuffer).toString("base64"),
        language_code: "en",
      }),
    })

    const transcriptionData = await transcriptionResponse.json()

    // For demo purposes, return a mock transcript
    // In production, you'd wait for the actual transcription
    const mockTranscript =
      "Thank you for the question. I have experience with React and Node.js, and I've worked on several full-stack projects including an e-commerce platform and a task management application."

    return NextResponse.json({
      transcript: mockTranscript,
      confidence: 0.95,
    })
  } catch (error) {
    console.error("Error processing audio:", error)
    return NextResponse.json({ error: "Failed to process audio" }, { status: 500 })
  }
}
