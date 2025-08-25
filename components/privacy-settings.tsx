"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Label } from "./ui/label"

export function PrivacySettings() {
  const [settings, setSettings] = useState({
    dataSharing: false,
    analyticsTracking: true,
    marketingEmails: false,
    profileVisibility: "private",
    dataRetention: "2years",
  })

  const toggleSetting = (key: string) => {
    setSettings({ ...settings, [key]: !settings[key as keyof typeof settings] })
  }

  const handleSelectChange = (key: string, value: string) => {
    setSettings({ ...settings, [key]: value })
  }

  return (
    <Card className="bg-card/95 backdrop-blur-sm border border-border luxury-transition">
      <CardHeader>
        <CardTitle>Privacy & Data Controls</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border">
            <div className="flex-1">
              <Label className="font-medium">Data Sharing with Partners</Label>
              <p className="text-sm text-muted-foreground mt-1">
                Allow sharing anonymized data with security partners to improve fraud detection
              </p>
            </div>
            <button
              onClick={() => toggleSetting("dataSharing")}
              className={`relative inline-flex h-6 w-11 items-center rounded-full luxury-transition ${
                settings.dataSharing ? "bg-primary" : "bg-muted"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white luxury-transition ${
                  settings.dataSharing ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border">
            <div className="flex-1">
              <Label className="font-medium">Analytics Tracking</Label>
              <p className="text-sm text-muted-foreground mt-1">Help us improve the platform with usage analytics</p>
            </div>
            <button
              onClick={() => toggleSetting("analyticsTracking")}
              className={`relative inline-flex h-6 w-11 items-center rounded-full luxury-transition ${
                settings.analyticsTracking ? "bg-primary" : "bg-muted"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white luxury-transition ${
                  settings.analyticsTracking ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border">
            <div className="flex-1">
              <Label className="font-medium">Marketing Communications</Label>
              <p className="text-sm text-muted-foreground mt-1">Receive updates about new features and services</p>
            </div>
            <button
              onClick={() => toggleSetting("marketingEmails")}
              className={`relative inline-flex h-6 w-11 items-center rounded-full luxury-transition ${
                settings.marketingEmails ? "bg-primary" : "bg-muted"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white luxury-transition ${
                  settings.marketingEmails ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Profile Visibility</Label>
            <select
              value={settings.profileVisibility}
              onChange={(e) => handleSelectChange("profileVisibility", e.target.value)}
              className="w-full px-3 py-2 bg-input border border-border rounded-md luxury-transition focus:ring-2 focus:ring-accent"
            >
              <option value="private">Private</option>
              <option value="community">Community Only</option>
              <option value="public">Public</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label>Data Retention Period</Label>
            <select
              value={settings.dataRetention}
              onChange={(e) => handleSelectChange("dataRetention", e.target.value)}
              className="w-full px-3 py-2 bg-input border border-border rounded-md luxury-transition focus:ring-2 focus:ring-accent"
            >
              <option value="1year">1 Year</option>
              <option value="2years">2 Years</option>
              <option value="5years">5 Years</option>
              <option value="indefinite">Indefinite</option>
            </select>
          </div>
        </div>

        <div className="pt-4 border-t border-border space-y-3">
          <Button variant="outline" className="w-full luxury-transition bg-transparent">
            Download My Data
          </Button>
          <Button variant="destructive" className="w-full luxury-transition">
            Delete Account
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
