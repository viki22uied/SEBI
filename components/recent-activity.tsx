"use client"

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"

const activities = [
  {
    id: 1,
    type: "scan",
    title: "Portfolio Scan Completed",
    description: "All investments verified as legitimate",
    time: "10 minutes ago",
    status: "success",
  },
  {
    id: 2,
    type: "alert",
    title: "New Phishing Attempt Detected",
    description: "Fake SEBI email blocked automatically",
    time: "1 hour ago",
    status: "blocked",
  },
  {
    id: 3,
    type: "update",
    title: "Risk Profile Updated",
    description: "Your risk score improved to 85/100",
    time: "3 hours ago",
    status: "info",
  },
  {
    id: 4,
    type: "verification",
    title: "Advisor Credentials Verified",
    description: "Investment advisor license confirmed",
    time: "1 day ago",
    status: "verified",
  },
]

export function RecentActivity() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-500/20 text-green-400"
      case "blocked":
        return "bg-red-500/20 text-red-400"
      case "verified":
        return "bg-blue-500/20 text-blue-400"
      default:
        return "bg-gray-500/20 text-gray-400"
    }
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "scan":
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        )
      case "alert":
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        )
      case "verification":
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/30 luxury-transition"
          >
            <div
              className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${getStatusColor(activity.status)}`}
            >
              {getIcon(activity.type)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-sm font-medium truncate">{activity.title}</h4>
                <span className="text-xs text-muted-foreground">{activity.time}</span>
              </div>
              <p className="text-sm text-muted-foreground">{activity.description}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
