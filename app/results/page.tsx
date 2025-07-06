"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Trophy, TrendingUp, MessageSquare, Clock, Star, Download, Home, RotateCcw } from "lucide-react"
import Link from "next/link"

interface AnalysisResult {
  overallScore: number
  confidenceScore: number
  communicationScore: number
  technicalScore: number
  responseTime: number
  strengths: string[]
  improvements: string[]
  keyInsights: string[]
  detailedFeedback: {
    category: string
    score: number
    feedback: string
  }[]
}

export default function ResultsPage() {
  const [results, setResults] = useState<AnalysisResult | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API call to get results
    setTimeout(() => {
      setResults({
        overallScore: 78,
        confidenceScore: 82,
        communicationScore: 75,
        technicalScore: 80,
        responseTime: 3.2,
        strengths: [
          "Clear articulation of technical concepts",
          "Good problem-solving approach",
          "Confident delivery",
          "Relevant experience examples",
        ],
        improvements: [
          "Provide more specific examples",
          "Reduce filler words",
          "Elaborate on project challenges",
          "Ask clarifying questions",
        ],
        keyInsights: [
          "Strong technical foundation with room for communication improvement",
          "Demonstrates good understanding of core concepts",
          "Would benefit from more structured responses",
        ],
        detailedFeedback: [
          {
            category: "Technical Knowledge",
            score: 80,
            feedback: "Demonstrated solid understanding of core concepts with good examples.",
          },
          {
            category: "Communication",
            score: 75,
            feedback: "Clear speaking voice but could benefit from more structured responses.",
          },
          {
            category: "Problem Solving",
            score: 85,
            feedback: "Excellent approach to breaking down complex problems.",
          },
          {
            category: "Confidence",
            score: 82,
            feedback: "Spoke with confidence and maintained good eye contact.",
          },
        ],
      })
      setLoading(false)
    }, 2000)
  }, [])

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreBadge = (score: number) => {
    if (score >= 80) return "Excellent"
    if (score >= 60) return "Good"
    return "Needs Improvement"
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold mb-2">Analyzing Your Interview</h3>
            <p className="text-gray-600">Processing your responses and generating insights...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!results) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Interview Results</h1>
          <p className="text-gray-600">Here's your comprehensive interview analysis</p>
        </div>

        {/* Overall Score */}
        <Card className="mb-8">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="w-32 h-32 rounded-full border-8 border-gray-200 flex items-center justify-center">
                  <div className={`text-4xl font-bold ${getScoreColor(results.overallScore)}`}>
                    {results.overallScore}%
                  </div>
                </div>
                <Trophy className="absolute -top-2 -right-2 w-8 h-8 text-yellow-500" />
              </div>
            </div>
            <CardTitle className="text-2xl">Overall Performance</CardTitle>
            <CardDescription>
              <Badge variant="secondary" className="text-lg px-4 py-1">
                {getScoreBadge(results.overallScore)}
              </Badge>
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Score Breakdown */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center">
                <MessageSquare className="w-4 h-4 mr-2" />
                Communication
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-2">{results.communicationScore}%</div>
              <Progress value={results.communicationScore} className="h-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center">
                <Star className="w-4 h-4 mr-2" />
                Confidence
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-2">{results.confidenceScore}%</div>
              <Progress value={results.confidenceScore} className="h-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center">
                <TrendingUp className="w-4 h-4 mr-2" />
                Technical
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-2">{results.technicalScore}%</div>
              <Progress value={results.technicalScore} className="h-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                Response Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-2">{results.responseTime}s</div>
              <p className="text-sm text-gray-600">Average</p>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Analysis */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Strengths */}
          <Card>
            <CardHeader>
              <CardTitle className="text-green-700">Key Strengths</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {results.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-gray-700">{strength}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Improvements */}
          <Card>
            <CardHeader>
              <CardTitle className="text-orange-700">Areas for Improvement</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {results.improvements.map((improvement, index) => (
                  <li key={index} className="flex items-start">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-gray-700">{improvement}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Feedback */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Detailed Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {results.detailedFeedback.map((feedback, index) => (
                <div key={index} className="border-l-4 border-blue-500 pl-4">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold">{feedback.category}</h4>
                    <Badge variant="outline">{feedback.score}%</Badge>
                  </div>
                  <p className="text-gray-600">{feedback.feedback}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Key Insights */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Key Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {results.keyInsights.map((insight, index) => (
                <li key={index} className="flex items-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-gray-700">{insight}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-wrap gap-4 justify-center">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Download Report
          </Button>
          <Link href="/setup">
            <Button variant="outline">
              <RotateCcw className="w-4 h-4 mr-2" />
              Take Another Interview
            </Button>
          </Link>
          <Link href="/">
            <Button>
              <Home className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
