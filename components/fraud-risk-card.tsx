"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Progress } from "./ui/progress"

export function FraudRiskCard() {
  const [riskScore, setRiskScore] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  // Simulate real-time risk score (85 = low risk)
  const targetScore = 85

  useEffect(() => {
    setIsAnimating(true)
    const timer = setTimeout(() => {
      setRiskScore(targetScore)
    }, 500)

    return () => clearTimeout(timer)
  }, [targetScore])

  const getRiskLevel = (score: number) => {
    if (score >= 80) return { level: "Low Risk", color: "text-green-400", bgColor: "bg-green-400/20" }
    if (score >= 60) return { level: "Medium Risk", color: "text-yellow-400", bgColor: "bg-yellow-400/20" }
    return { level: "High Risk", color: "text-red-400", bgColor: "bg-red-400/20" }
  }

  const risk = getRiskLevel(riskScore)

  return (
    <Card className="bg-card/95 backdrop-blur-sm border border-border luxury-transition luxury-card-hover">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between">
          <span>Fraud Risk Score</span>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${risk.bgColor} ${risk.color}`}>{risk.level}</div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="text-6xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {isAnimating ? <CountUpAnimation target={riskScore} duration={2000} /> : riskScore}
            </div>
            <div className="text-sm text-muted-foreground mt-1">out of 100</div>
          </div>

          <Progress
            value={riskScore}
            className="h-3 bg-muted"
            style={{
              background: `linear-gradient(to right, 
                ${riskScore >= 80 ? "#22c55e" : riskScore >= 60 ? "#eab308" : "#ef4444"} 0%, 
                ${riskScore >= 80 ? "#22c55e" : riskScore >= 60 ? "#eab308" : "#ef4444"} ${riskScore}%, 
                hsl(var(--muted)) ${riskScore}%)`,
            }}
          />
        </div>

        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
          <div className="text-center space-y-1">
            <div className="text-2xl font-bold text-primary">24/7</div>
            <div className="text-xs text-muted-foreground">Monitoring</div>
          </div>
          <div className="text-center space-y-1">
            <div className="text-2xl font-bold text-accent">0</div>
            <div className="text-xs text-muted-foreground">Active Threats</div>
          </div>
          <div className="text-center space-y-1">
            <div className="text-2xl font-bold text-green-400">12</div>
            <div className="text-xs text-muted-foreground">Blocked Today</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function CountUpAnimation({ target, duration }: { target: number; duration: number }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let startTime: number
    let animationFrame: number

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)

      setCount(Math.floor(progress * target))

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, [target, duration])

  return <>{count}</>
}
