"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Mic, MicOff, ArrowRight } from "lucide-react"
import { Avatar3D } from "@/components/avatar-3d"
import { useRouter } from "next/navigation"
import io from "socket.io-client"

interface Message {
  id: string
  type: "ai" | "user"
  content: string
  timestamp: Date
}

export default function InterviewPage() {
  const router = useRouter()
  const [isRecording, setIsRecording] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [currentQuestion, setCurrentQuestion] = useState("")
  const [interviewStarted, setInterviewStarted] = useState(false)
  const [questionCount, setQuestionCount] = useState(0)
  const [userProfile, setUserProfile] = useState<any>(null)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const socketRef = useRef<any>(null)

  useEffect(() => {
    // Load user profile
    const profileData = localStorage.getItem("interviewData")
    if (profileData) {
      setUserProfile(JSON.parse(profileData))
    }

    // Initialize socket connection
    socketRef.current = io("http://localhost:3001")

    socketRef.current.on("ai-response", (data: { question: string; audio?: string }) => {
      setCurrentQuestion(data.question)
      addMessage("ai", data.question)

      if (data.audio) {
        playAudioResponse(data.audio)
      }
    })

    socketRef.current.on("interview-complete", () => {
      router.push("/results")
    })

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect()
      }
    }
  }, [router])

  const addMessage = (type: "ai" | "user", content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, newMessage])
  }

  const startInterview = async () => {
    setInterviewStarted(true)

    // Send user profile to backend for personalized questions
    if (socketRef.current && userProfile) {
      socketRef.current.emit("start-interview", userProfile)
    }
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)

      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data)
      }

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" })
        await sendAudioToServer(audioBlob)
      }

      mediaRecorder.start()
      setIsRecording(true)
    } catch (error) {
      console.error("Error starting recording:", error)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)

      // Stop all tracks
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop())
    }
  }

  const sendAudioToServer = async (audioBlob: Blob) => {
    const formData = new FormData()
    formData.append("audio", audioBlob, "recording.wav")

    try {
      const response = await fetch("/api/process-audio", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()
      if (data.transcript) {
        addMessage("user", data.transcript)

        // Send transcript to AI for next question
        if (socketRef.current) {
          socketRef.current.emit("user-response", {
            transcript: data.transcript,
            questionNumber: questionCount + 1,
          })
          setQuestionCount((prev) => prev + 1)
        }
      }
    } catch (error) {
      console.error("Error processing audio:", error)
    }
  }

  const playAudioResponse = (audioBase64: string) => {
    setIsSpeaking(true)
    const audio = new Audio(`data:audio/mp3;base64,${audioBase64}`)

    audio.onended = () => {
      setIsSpeaking(false)
    }

    audio.play().catch(console.error)
  }

  const endInterview = () => {
    if (socketRef.current) {
      socketRef.current.emit("end-interview")
    }
    router.push("/results")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8 h-screen">
          {/* Avatar Section */}
          <div className="lg:col-span-2">
            <Card className="h-full bg-slate-800/50 border-slate-700">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-white">AI Interviewer</CardTitle>
                  <div className="flex gap-2">
                    <Badge variant={isSpeaking ? "default" : "secondary"}>
                      {isSpeaking ? "Speaking" : "Listening"}
                    </Badge>
                    <Badge variant="outline" className="text-white border-white">
                      Question {questionCount}/10
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="h-full flex flex-col">
                <div className="flex-1 flex items-center justify-center">
                  <Avatar3D isListening={isRecording} isSpeaking={isSpeaking} />
                </div>

                {/* Current Question Display */}
                {currentQuestion && (
                  <div className="mt-4 p-4 bg-slate-700/50 rounded-lg">
                    <p className="text-lg text-white">{currentQuestion}</p>
                  </div>
                )}

                {/* Controls */}
                <div className="flex justify-center gap-4 mt-6">
                  {!interviewStarted ? (
                    <Button onClick={startInterview} size="lg" className="bg-blue-600 hover:bg-blue-700">
                      Start Interview
                    </Button>
                  ) : (
                    <>
                      <Button
                        onClick={isRecording ? stopRecording : startRecording}
                        size="lg"
                        variant={isRecording ? "destructive" : "default"}
                        className={isRecording ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}
                      >
                        {isRecording ? <MicOff className="w-5 h-5 mr-2" /> : <Mic className="w-5 h-5 mr-2" />}
                        {isRecording ? "Stop Recording" : "Start Recording"}
                      </Button>

                      {questionCount >= 5 && (
                        <Button
                          onClick={endInterview}
                          variant="outline"
                          className="border-white text-white hover:bg-white hover:text-black bg-transparent"
                        >
                          End Interview
                          <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chat History */}
          <div className="lg:col-span-1">
            <Card className="h-full bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Conversation</CardTitle>
              </CardHeader>
              <CardContent className="h-full overflow-y-auto">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`p-3 rounded-lg ${
                        message.type === "ai"
                          ? "bg-blue-600/20 border-l-4 border-blue-500"
                          : "bg-green-600/20 border-l-4 border-green-500"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <Badge variant={message.type === "ai" ? "default" : "secondary"}>
                          {message.type === "ai" ? "AI Interviewer" : "You"}
                        </Badge>
                        <span className="text-xs text-slate-400">{message.timestamp.toLocaleTimeString()}</span>
                      </div>
                      <p className="text-white text-sm">{message.content}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
