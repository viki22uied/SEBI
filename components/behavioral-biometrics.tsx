"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"

interface BiometricData {
  timestamp: number
  keystrokeSpeed: number
  mouseVelocity: number
  typingRhythm: number
}

export function BehavioralBiometrics() {
  const [isRecording, setIsRecording] = useState(false)
  const [biometricData, setBiometricData] = useState<BiometricData[]>([])
  const [riskScore, setRiskScore] = useState(0)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()

  useEffect(() => {
    if (isRecording) {
      const interval = setInterval(() => {
        const newData: BiometricData = {
          timestamp: Date.now(),
          keystrokeSpeed: Math.random() * 100 + 50,
          mouseVelocity: Math.random() * 80 + 20,
          typingRhythm: Math.random() * 60 + 40,
        }
        setBiometricData((prev) => [...prev.slice(-19), newData])

        // Calculate risk score based on patterns
        const avgSpeed = newData.keystrokeSpeed
        const normalizedScore = Math.min(100, Math.max(0, 100 - Math.abs(avgSpeed - 75) * 2))
        setRiskScore(normalizedScore)
      }, 200)

      return () => clearInterval(interval)
    }
  }, [isRecording])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || biometricData.length === 0) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw grid
      ctx.strokeStyle = "rgba(255, 255, 255, 0.1)"
      ctx.lineWidth = 1
      for (let i = 0; i < canvas.width; i += 40) {
        ctx.beginPath()
        ctx.moveTo(i, 0)
        ctx.lineTo(i, canvas.height)
        ctx.stroke()
      }
      for (let i = 0; i < canvas.height; i += 30) {
        ctx.beginPath()
        ctx.moveTo(0, i)
        ctx.lineTo(canvas.width, i)
        ctx.stroke()
      }

      // Draw keystroke speed line
      ctx.strokeStyle = "#FFD700"
      ctx.lineWidth = 2
      ctx.beginPath()
      biometricData.forEach((data, index) => {
        const x = (index / (biometricData.length - 1)) * canvas.width
        const y = canvas.height - (data.keystrokeSpeed / 150) * canvas.height
        if (index === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      })
      ctx.stroke()

      // Draw mouse velocity line
      ctx.strokeStyle = "#00F5FF"
      ctx.lineWidth = 2
      ctx.beginPath()
      biometricData.forEach((data, index) => {
        const x = (index / (biometricData.length - 1)) * canvas.width
        const y = canvas.height - (data.mouseVelocity / 100) * canvas.height
        if (index === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      })
      ctx.stroke()

      // Draw typing rhythm line
      ctx.strokeStyle = "rgba(255, 255, 255, 0.6)"
      ctx.lineWidth = 1
      ctx.beginPath()
      biometricData.forEach((data, index) => {
        const x = (index / (biometricData.length - 1)) * canvas.width
        const y = canvas.height - (data.typingRhythm / 100) * canvas.height
        if (index === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      })
      ctx.stroke()

      if (isRecording) {
        animationRef.current = requestAnimationFrame(animate)
      }
    }

    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [biometricData, isRecording])

  const startRecording = () => {
    setIsRecording(true)
    setBiometricData([])
    setRiskScore(0)
  }

  const stopRecording = () => {
    setIsRecording(false)
  }

  return (
    <Card className="bg-card/95 backdrop-blur-sm border border-border luxury-transition">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Behavioral Biometrics Analysis</span>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-muted-foreground">
              Risk Score: <span className="text-primary font-bold">{riskScore.toFixed(0)}%</span>
            </div>
            <Button
              onClick={isRecording ? stopRecording : startRecording}
              className={`luxury-transition ${
                isRecording
                  ? "bg-red-500 hover:bg-red-600 text-white"
                  : "bg-primary hover:bg-primary/90 text-primary-foreground"
              }`}
            >
              {isRecording ? "Stop Analysis" : "Start Analysis"}
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="relative bg-black/20 rounded-lg p-4 border border-border">
              <canvas ref={canvasRef} width={600} height={300} className="w-full h-auto" />
              <div className="absolute top-4 right-4 space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-primary rounded-full"></div>
                  <span>Keystroke Speed</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-accent rounded-full"></div>
                  <span>Mouse Velocity</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-white/60 rounded-full"></div>
                  <span>Typing Rhythm</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-muted/30 border border-border">
              <h4 className="font-semibold mb-2">Current Metrics</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Keystroke Speed:</span>
                  <span className="text-primary font-medium">
                    {biometricData.length > 0
                      ? biometricData[biometricData.length - 1]?.keystrokeSpeed.toFixed(0)
                      : "0"}{" "}
                    WPM
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Mouse Velocity:</span>
                  <span className="text-accent font-medium">
                    {biometricData.length > 0 ? biometricData[biometricData.length - 1]?.mouseVelocity.toFixed(0) : "0"}{" "}
                    px/s
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Typing Rhythm:</span>
                  <span className="text-white/60 font-medium">
                    {biometricData.length > 0 ? biometricData[biometricData.length - 1]?.typingRhythm.toFixed(0) : "0"}{" "}
                    ms
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-muted/30 border border-border">
              <h4 className="font-semibold mb-2">Analysis Status</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${isRecording ? "bg-green-400" : "bg-gray-400"}`}></div>
                  <span>{isRecording ? "Recording" : "Idle"}</span>
                </div>
                <div className="text-muted-foreground">Data Points: {biometricData.length}</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
