"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"

interface AnalysisResult {
  id: string
  type: "text" | "video" | "audio"
  content: string
  realityScore: number
  confidence: number
  flags: string[]
  timestamp: Date
}

export function DeepfakeChecker() {
  const [url, setUrl] = useState("")
  const [textContent, setTextContent] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [results, setResults] = useState<AnalysisResult[]>([])
  const [dragActive, setDragActive] = useState(false)

  const analyzeContent = useCallback(async (content: string, type: "text" | "video" | "audio") => {
    setIsAnalyzing(true)

    // Simulate AI analysis
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const mockResult: AnalysisResult = {
      id: Date.now().toString(),
      type,
      content: content.substring(0, 100) + (content.length > 100 ? "..." : ""),
      realityScore: Math.random() * 40 + 60, // 60-100 range for realistic content
      confidence: Math.random() * 20 + 80, // 80-100 confidence
      flags: ["Natural language patterns detected", "Consistent metadata", "No manipulation artifacts found"],
      timestamp: new Date(),
    }

    setResults((prev) => [mockResult, ...prev.slice(0, 4)])
    setIsAnalyzing(false)
  }, [])

  const handleUrlAnalysis = async () => {
    if (!url.trim()) return

    const type = url.includes("youtube") || url.includes("video") ? "video" : "text"
    await analyzeContent(url, type)
    setUrl("")
  }

  const handleTextAnalysis = async () => {
    if (!textContent.trim()) return

    await analyzeContent(textContent, "text")
    setTextContent("")
  }

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setDragActive(false)

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        const file = e.dataTransfer.files[0]
        const type = file.type.startsWith("video/") ? "video" : file.type.startsWith("audio/") ? "audio" : "text"

        await analyzeContent(file.name, type)
      }
    },
    [analyzeContent],
  )

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-400"
    if (score >= 60) return "text-yellow-400"
    return "text-red-400"
  }

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Likely Authentic"
    if (score >= 60) return "Possibly Manipulated"
    return "Likely Deepfake"
  }

  return (
    <Card className="bg-card/95 backdrop-blur-sm border border-border luxury-transition">
      <CardHeader>
        <CardTitle>Deepfake Reality Score Checker</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="space-y-6">
            {/* URL Input */}
            <div className="space-y-3">
              <Label htmlFor="url-input">Analyze URL</Label>
              <div className="flex space-x-2">
                <Input
                  id="url-input"
                  placeholder="Enter video/article URL..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="luxury-transition focus:ring-2 focus:ring-accent"
                />
                <Button
                  onClick={handleUrlAnalysis}
                  disabled={!url.trim() || isAnalyzing}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground luxury-transition"
                >
                  Analyze
                </Button>
              </div>
            </div>

            {/* Text Input */}
            <div className="space-y-3">
              <Label htmlFor="text-input">Analyze Text Content</Label>
              <div className="space-y-2">
                <textarea
                  id="text-input"
                  placeholder="Paste text content to analyze for AI generation..."
                  value={textContent}
                  onChange={(e) => setTextContent(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 bg-input border border-border rounded-md luxury-transition focus:ring-2 focus:ring-accent resize-none"
                />
                <Button
                  onClick={handleTextAnalysis}
                  disabled={!textContent.trim() || isAnalyzing}
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground luxury-transition"
                >
                  Analyze Text
                </Button>
              </div>
            </div>

            {/* Drag & Drop Area */}
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center luxury-transition ${
                dragActive ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="space-y-2">
                <svg
                  className="w-12 h-12 mx-auto text-muted-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                <p className="text-sm text-muted-foreground">Drag & drop files here to analyze</p>
                <p className="text-xs text-muted-foreground">Supports video, audio, and text files</p>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-4">
            <h3 className="font-semibold">Analysis Results</h3>

            {isAnalyzing && (
              <div className="p-4 rounded-lg bg-muted/30 border border-border">
                <div className="flex items-center space-x-3">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                  <span className="text-sm">Analyzing content...</span>
                </div>
              </div>
            )}

            {results.length === 0 && !isAnalyzing && (
              <div className="p-8 text-center text-muted-foreground">
                <p>No analysis results yet.</p>
                <p className="text-sm mt-1">Submit content above to get started.</p>
              </div>
            )}

            {results.map((result) => (
              <div
                key={result.id}
                className="p-4 rounded-lg bg-muted/30 border border-border luxury-transition hover:bg-muted/40"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          result.type === "video"
                            ? "bg-red-400"
                            : result.type === "audio"
                              ? "bg-blue-400"
                              : "bg-green-400"
                        }`}
                      ></div>
                      <span className="text-sm font-medium capitalize">{result.type}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{result.timestamp.toLocaleTimeString()}</span>
                  </div>

                  <div className="text-sm text-muted-foreground truncate">{result.content}</div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Reality Score:</span>
                      <span className={`font-bold ${getScoreColor(result.realityScore)}`}>
                        {result.realityScore.toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Confidence:</span>
                      <span className="font-medium">{result.confidence.toFixed(1)}%</span>
                    </div>
                    <div className={`text-sm font-medium ${getScoreColor(result.realityScore)}`}>
                      {getScoreLabel(result.realityScore)}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground">Analysis Flags:</span>
                    {result.flags.map((flag, index) => (
                      <div key={index} className="text-xs bg-muted/50 px-2 py-1 rounded">
                        {flag}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
