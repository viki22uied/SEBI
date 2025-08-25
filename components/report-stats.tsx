"use client"

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"

export function ReportStats() {
  const stats = [
    {
      label: "Reports Submitted",
      value: "1,247",
      change: "+12%",
      color: "text-primary",
      icon: "📊",
    },
    {
      label: "Frauds Prevented",
      value: "892",
      change: "+8%",
      color: "text-green-400",
      icon: "🛡️",
    },
    {
      label: "Money Saved",
      value: "₹2.4Cr",
      change: "+15%",
      color: "text-accent",
      icon: "💰",
    },
    {
      label: "Active Users",
      value: "15,432",
      change: "+23%",
      color: "text-yellow-400",
      icon: "👥",
    },
  ]

  return (
    <Card className="bg-card/95 backdrop-blur-sm border border-border luxury-transition">
      <CardHeader>
        <CardTitle>Community Impact</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {stats.map((stat, index) => (
          <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30">
            <div className="text-2xl">{stat.icon}</div>
            <div className="flex-1">
              <div className="text-sm text-muted-foreground">{stat.label}</div>
              <div className="flex items-center space-x-2">
                <span className={`text-xl font-bold ${stat.color}`}>{stat.value}</span>
                <span className="text-xs text-green-400">{stat.change}</span>
              </div>
            </div>
          </div>
        ))}

        <div className="pt-4 border-t border-border">
          <div className="text-center space-y-2">
            <div className="text-sm text-muted-foreground">Your Contribution</div>
            <div className="text-2xl font-bold text-primary">2 Reports</div>
            <div className="text-xs text-muted-foreground">Helping protect the community</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
