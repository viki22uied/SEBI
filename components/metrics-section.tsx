"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"

const metrics = [
  { value: 11000, suffix: "+ Crore", label: "Annual fraud prevented", prefix: "₹" },
  { value: 99.7, suffix: "% Accuracy", label: "AI detection precision" },
  { value: 0.3, suffix: "s Response", label: "Real-time intervention", prefix: "<" },
  { value: 2000000, suffix: "+ Protected", label: "Investors safeguarded" },
]

function AnimatedCounter({ value, duration = 2000 }: { value: number; duration?: number }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let startTime: number
    let animationFrame: number

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)

      setCount(Math.floor(progress * value))

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)

    return () => cancelAnimationFrame(animationFrame)
  }, [value, duration])

  return <span>{count.toLocaleString()}</span>
}

export function MetricsSection() {
  return (
    <section className="py-20 px-6 md:px-20">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, index) => (
            <Card
              key={index}
              className="luxury-transition luxury-card-hover p-8 bg-card/50 backdrop-blur-sm border-border/50 text-center"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="space-y-3">
                <div className="text-3xl md:text-4xl font-bold text-foreground">
                  {metric.prefix}
                  <AnimatedCounter value={metric.value} />
                  {metric.suffix}
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">{metric.label}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
