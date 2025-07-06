"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, Mic, User, BrainCircuit } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">AI Interview Platform</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Practice interviews with our AI-powered interviewer. Get real-time feedback and improve your skills.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <Card className="text-center">
            <CardHeader>
              <BrainCircuit className="w-12 h-12 mx-auto text-blue-600 mb-4" />
              <CardTitle>AI-Powered Interviews</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Dynamic questions adapted to your experience and role</CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Mic className="w-12 h-12 mx-auto text-green-600 mb-4" />
              <CardTitle>Voice Interaction</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Natural conversation with speech-to-text and text-to-speech</CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <User className="w-12 h-12 mx-auto text-purple-600 mb-4" />
              <CardTitle>3D Avatar</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Lifelike AI interviewer with realistic expressions</CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Ready to Start?</CardTitle>
              <CardDescription>Upload your resume and begin your AI interview experience</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/setup">
                <Button size="lg" className="w-full">
                  <Upload className="w-5 h-5 mr-2" />
                  Start Interview Setup
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
