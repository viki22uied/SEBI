"use client"

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"

export function LearningStats() {
  const stats = [
    {
      label: "Learning Streak",
      value: "12",
      unit: "days",
      color: "text-primary",
      icon: "🔥",
    },
    {
      label: "Modules Completed",
      value: "3",
      unit: "of 8",
      color: "text-accent",
      icon: "📚",
    },
    {
      label: "Quiz Average",
      value: "87",
      unit: "%",
      color: "text-green-400",
      icon: "🎯",
    },
    {
      label: "Badges Earned",
      value: "2",
      unit: "of 6",
      color: "text-yellow-400",
      icon: "🏆",
    },
  ]

  return (
    <Card className="bg-card/95 backdrop-blur-sm border border-border luxury-transition">
      <CardHeader>
        <CardTitle>Learning Statistics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {stats.map((stat, index) => (
          <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30">
            <div className="text-2xl">{stat.icon}</div>
            <div className="flex-1">
              <div className="text-sm text-muted-foreground">{stat.label}</div>
              <div className="flex items-baseline space-x-1">
                <span className={`text-2xl font-bold ${stat.color}`}>{stat.value}</span>
                <span className="text-sm text-muted-foreground">{stat.unit}</span>
              </div>
            </div>
          </div>
        ))}

        <div className="pt-4 border-t border-border">
          <div className="text-center space-y-2">
            <div className="text-sm text-muted-foreground">Fraud Immunity Level</div>
            <div className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Intermediate
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div className="bg-gradient-to-r from-primary to-accent h-2 rounded-full" style={{ width: "65%" }}></div>
            </div>
            <div className="text-xs text-muted-foreground">65% to Advanced level</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
