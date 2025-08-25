"use client"

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"

const alerts = [
  {
    id: 1,
    type: "warning",
    title: "Unusual Login Pattern",
    description: "Login detected from new device in Mumbai",
    time: "2 minutes ago",
    severity: "medium",
  },
  {
    id: 2,
    type: "info",
    title: "Market Volatility Alert",
    description: "High volatility detected in your portfolio stocks",
    time: "15 minutes ago",
    severity: "low",
  },
  {
    id: 3,
    type: "success",
    title: "Fraud Attempt Blocked",
    description: "Suspicious transaction automatically prevented",
    time: "1 hour ago",
    severity: "high",
  },
]

export function AlertsPanel() {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      case "medium":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "low":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "warning":
        return (
          <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        )
      case "success":
        return (
          <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        )
      default:
        return (
          <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        )
    }
  }

  return (
    <Card className="bg-card/95 backdrop-blur-sm border border-border luxury-transition">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between">
          <span>Security Alerts</span>
          <Badge variant="secondary" className="bg-accent/20 text-accent">
            {alerts.length} Active
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className="flex items-start space-x-3 p-4 rounded-lg bg-muted/30 border border-border luxury-transition hover:bg-muted/50"
          >
            <div className="flex-shrink-0 mt-0.5">{getIcon(alert.type)}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-sm font-medium truncate">{alert.title}</h4>
                <Badge className={`text-xs ${getSeverityColor(alert.severity)}`}>{alert.severity}</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-2">{alert.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{alert.time}</span>
                <Button variant="ghost" size="sm" className="text-xs h-6 px-2">
                  View Details
                </Button>
              </div>
            </div>
          </div>
        ))}

        <Button variant="outline" className="w-full mt-4 luxury-transition bg-transparent">
          View All Alerts
        </Button>
      </CardContent>
    </Card>
  )
}
