"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"

export default function SetupPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    jobRole: "",
    experience: "",
    skills: "",
    resume: null as File | null,
  })

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData((prev) => ({ ...prev, resume: file }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Store user data in localStorage for demo
    localStorage.setItem(
      "interviewData",
      JSON.stringify({
        ...formData,
        resumeUploaded: !!formData.resume,
      }),
    )

    router.push("/interview")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Interview Setup</CardTitle>
            <CardDescription>Please provide your information to customize your interview experience</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>
              </div>

              {/* Job Role */}
              <div>
                <Label htmlFor="jobRole">Desired Job Role</Label>
                <Select onValueChange={(value) => setFormData((prev) => ({ ...prev, jobRole: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your target role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="frontend">Frontend Developer</SelectItem>
                    <SelectItem value="backend">Backend Developer</SelectItem>
                    <SelectItem value="fullstack">Full Stack Developer</SelectItem>
                    <SelectItem value="mobile">Mobile Developer</SelectItem>
                    <SelectItem value="devops">DevOps Engineer</SelectItem>
                    <SelectItem value="data">Data Scientist</SelectItem>
                    <SelectItem value="product">Product Manager</SelectItem>
                    <SelectItem value="design">UI/UX Designer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Experience */}
              <div>
                <Label htmlFor="experience">Years of Experience</Label>
                <Select onValueChange={(value) => setFormData((prev) => ({ ...prev, experience: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your experience level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0-1">0-1 years (Entry Level)</SelectItem>
                    <SelectItem value="2-3">2-3 years (Junior)</SelectItem>
                    <SelectItem value="4-6">4-6 years (Mid Level)</SelectItem>
                    <SelectItem value="7-10">7-10 years (Senior)</SelectItem>
                    <SelectItem value="10+">10+ years (Expert)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Skills */}
              <div>
                <Label htmlFor="skills">Key Skills</Label>
                <Textarea
                  id="skills"
                  placeholder="e.g., React, Node.js, Python, AWS, etc."
                  value={formData.skills}
                  onChange={(e) => setFormData((prev) => ({ ...prev, skills: e.target.value }))}
                  rows={3}
                />
              </div>

              {/* Resume Upload */}
              <div>
                <Label htmlFor="resume">Resume Upload (Optional)</Label>
                <div className="mt-2">
                  <Input
                    id="resume"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileUpload}
                    className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  {formData.resume && <p className="text-sm text-green-600 mt-2">✓ {formData.resume.name} uploaded</p>}
                </div>
              </div>

              <Button type="submit" className="w-full" size="lg">
                Start Interview
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
