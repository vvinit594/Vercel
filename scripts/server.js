const express = require("express")
const http = require("http")
const socketIo = require("socket.io")
const cors = require("cors")

const app = express()
const server = http.createServer(app)
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
})

app.use(cors())
app.use(express.json())

// Store interview sessions
const interviewSessions = new Map()

io.on("connection", (socket) => {
  console.log("User connected:", socket.id)

  socket.on("start-interview", async (userProfile) => {
    console.log("Starting interview for:", userProfile.name)

    // Initialize interview session
    interviewSessions.set(socket.id, {
      userProfile,
      questionCount: 0,
      responses: [],
    })

    // Send first question
    const firstQuestion = `Hello ${userProfile.name}! I'm excited to interview you for the ${userProfile.jobRole} position. Let's start with a simple question: Can you tell me a bit about yourself and what interests you about this role?`

    socket.emit("ai-response", {
      question: firstQuestion,
    })
  })

  socket.on("user-response", async (data) => {
    const session = interviewSessions.get(socket.id)
    if (!session) return

    // Store user response
    session.responses.push({
      question: session.questionCount,
      response: data.transcript,
      timestamp: new Date(),
    })

    session.questionCount++

    // Generate next question or end interview
    if (session.questionCount >= 10) {
      socket.emit("interview-complete")
      return
    }

    // Generate contextual follow-up question
    const questions = [
      "That's interesting! Can you walk me through a challenging project you've worked on?",
      "How do you approach problem-solving when you encounter a technical challenge?",
      "What technologies are you most excited about learning or working with?",
      "Can you describe a time when you had to work with a difficult team member?",
      "How do you stay updated with the latest trends in your field?",
      "What's your approach to code review and ensuring code quality?",
      "Can you explain a complex technical concept to someone non-technical?",
      "How do you handle tight deadlines and pressure?",
      "What questions do you have about our company or this role?",
    ]

    const nextQuestion =
      questions[session.questionCount - 1] || "Thank you for your responses. Do you have any final questions for me?"

    socket.emit("ai-response", {
      question: nextQuestion,
    })
  })

  socket.on("end-interview", () => {
    console.log("Interview ended for:", socket.id)
    interviewSessions.delete(socket.id)
  })

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id)
    interviewSessions.delete(socket.id)
  })
})

const PORT = process.env.PORT || 3001
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
