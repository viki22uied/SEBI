"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"

export function AccountSettings() {
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john.doe@email.com",
    phone: "+91 98765 43210",
    occupation: "Software Engineer",
  })
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSaving(false)
    setIsEditing(false)
  }

  return (
    <Card className="bg-card/95 backdrop-blur-sm border border-border luxury-transition">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Account Information</span>
          <Button
            size="sm"
            variant={isEditing ? "outline" : "default"}
            onClick={() => (isEditing ? setIsEditing(false) : setIsEditing(true))}
            className="luxury-transition"
          >
            {isEditing ? "Cancel" : "Edit"}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              disabled={!isEditing}
              className="luxury-transition focus:ring-2 focus:ring-accent"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="occupation">Occupation</Label>
            <Input
              id="occupation"
              value={profile.occupation}
              onChange={(e) => setProfile({ ...profile, occupation: e.target.value })}
              disabled={!isEditing}
              className="luxury-transition focus:ring-2 focus:ring-accent"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            value={profile.email}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            disabled={!isEditing}
            className="luxury-transition focus:ring-2 focus:ring-accent"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            value={profile.phone}
            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
            disabled={!isEditing}
            className="luxury-transition focus:ring-2 focus:ring-accent"
          />
        </div>

        {isEditing && (
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground luxury-transition"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
