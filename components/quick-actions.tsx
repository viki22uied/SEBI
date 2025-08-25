"use client"

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"

const actions = [
  {
    title: "Report Fraud",
    description: "Report suspicious activity",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
        />
      </svg>
    ),
    color: "bg-red-500/20 text-red-400 hover:bg-red-500/30",
  },
  {
    title: "Verify Advice",
    description: "Check investment advice",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    color: "bg-primary/20 text-primary hover:bg-primary/30",
  },
  {
    title: "Check Source",
    description: "Verify information source",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    ),
    color: "bg-accent/20 text-accent hover:bg-accent/30",
  },
]

export function QuickActions() {
  return (
    <Card className="bg-card/95 backdrop-blur-sm border border-border luxury-transition">
      <CardHeader className="pb-4">
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {actions.map((action, index) => (
          <Button
            key={index}
            variant="ghost"
            className={`w-full justify-start h-auto p-4 ${action.color} luxury-transition luxury-hover`}
          >
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">{action.icon}</div>
              <div className="text-left">
                <div className="font-medium">{action.title}</div>
                <div className="text-sm opacity-80">{action.description}</div>
              </div>
            </div>
          </Button>
        ))}

        <div className="pt-4 border-t border-border">
          <Button variant="outline" className="w-full luxury-transition bg-transparent">
            Emergency Contact
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
