"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Label } from "./ui/label"

interface NotificationSetting {
  id: string
  label: string
  description: string
  enabled: boolean
  type: "email" | "sms" | "push"
}

export function NotificationSettings() {
  const [settings, setSettings] = useState<NotificationSetting[]>([
    {
      id: "fraud-alerts",
      label: "Fraud Alerts",
      description: "Get notified immediately when suspicious activity is detected",
      enabled: true,
      type: "push",
    },
    {
      id: "weekly-reports",
      label: "Weekly Security Reports",
      description: "Receive weekly summaries of your account security status",
      enabled: true,
      type: "email",
    },
    {
      id: "learning-reminders",
      label: "Learning Reminders",
      description: "Reminders to complete fraud prevention training modules",
      enabled: false,
      type: "push",
    },
    {
      id: "community-updates",
      label: "Community Updates",
      description: "Updates about new fraud patterns and community alerts",
      enabled: true,
      type: "email",
    },
    {
      id: "emergency-alerts",
      label: "Emergency Alerts",
      description: "Critical security alerts via SMS",
      enabled: true,
      type: "sms",
    },
  ])

  const toggleSetting = (id: string) => {
    setSettings(settings.map((setting) => (setting.id === id ? { ...setting, enabled: !setting.enabled } : setting)))
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "email":
        return "📧"
      case "sms":
        return "📱"
      case "push":
        return "🔔"
      default:
        return "📢"
    }
  }

  return (
    <Card className="bg-card/95 backdrop-blur-sm border border-border luxury-transition">
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {settings.map((setting) => (
          <div key={setting.id} className="flex items-start space-x-3 p-4 rounded-lg bg-muted/30 border border-border">
            <div className="text-xl">{getTypeIcon(setting.type)}</div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <Label htmlFor={setting.id} className="font-medium cursor-pointer">
                  {setting.label}
                </Label>
                <button
                  id={setting.id}
                  onClick={() => toggleSetting(setting.id)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full luxury-transition ${
                    setting.enabled ? "bg-primary" : "bg-muted"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white luxury-transition ${
                      setting.enabled ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
              <p className="text-sm text-muted-foreground">{setting.description}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
