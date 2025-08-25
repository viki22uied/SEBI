"use client"

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"

interface Badge {
  id: string
  name: string
  description: string
  icon: string
  earned: boolean
  earnedDate?: Date
  category: string
  rarity: "common" | "rare" | "epic" | "legendary"
}

export function BadgeCollection() {
  const badges: Badge[] = [
    {
      id: "first-quiz",
      name: "First Steps",
      description: "Complete your first fraud awareness quiz",
      icon: "🎯",
      earned: true,
      earnedDate: new Date("2024-01-15"),
      category: "Achievement",
      rarity: "common",
    },
    {
      id: "phishing-expert",
      name: "Phishing Expert",
      description: "Score 100% on the phishing detection quiz",
      icon: "🎣",
      earned: true,
      earnedDate: new Date("2024-01-20"),
      category: "Expertise",
      rarity: "rare",
    },
    {
      id: "streak-7",
      name: "Week Warrior",
      description: "Complete learning activities for 7 consecutive days",
      icon: "🔥",
      earned: false,
      category: "Consistency",
      rarity: "epic",
    },
    {
      id: "fraud-hunter",
      name: "Fraud Hunter",
      description: "Successfully report 5 fraudulent activities",
      icon: "🕵️",
      earned: false,
      category: "Community",
      rarity: "rare",
    },
    {
      id: "master-learner",
      name: "Master Learner",
      description: "Complete all learning modules with 90%+ scores",
      icon: "🏆",
      earned: false,
      category: "Mastery",
      rarity: "legendary",
    },
    {
      id: "social-guardian",
      name: "Social Guardian",
      description: "Help 10 friends join the fraud prevention community",
      icon: "🛡️",
      earned: false,
      category: "Community",
      rarity: "epic",
    },
  ]

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "border-gray-500 bg-gray-500/20"
      case "rare":
        return "border-blue-500 bg-blue-500/20"
      case "epic":
        return "border-purple-500 bg-purple-500/20"
      case "legendary":
        return "border-yellow-500 bg-yellow-500/20"
      default:
        return "border-gray-500 bg-gray-500/20"
    }
  }

  const getRarityGlow = (rarity: string) => {
    switch (rarity) {
      case "rare":
        return "shadow-blue-500/50"
      case "epic":
        return "shadow-purple-500/50"
      case "legendary":
        return "shadow-yellow-500/50"
      default:
        return ""
    }
  }

  const earnedBadges = badges.filter((badge) => badge.earned)
  const totalBadges = badges.length

  return (
    <Card className="bg-card/95 backdrop-blur-sm border border-border luxury-transition">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Badge Collection</span>
          <div className="text-sm text-muted-foreground">
            {earnedBadges.length}/{totalBadges} Earned
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className={`relative p-4 rounded-lg border-2 luxury-transition ${
                badge.earned
                  ? `${getRarityColor(badge.rarity)} ${getRarityGlow(badge.rarity)} shadow-lg`
                  : "border-border bg-muted/20 opacity-50"
              }`}
            >
              {badge.earned && badge.rarity !== "common" && (
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-xs">✨</span>
                </div>
              )}

              <div className="text-center space-y-2">
                <div className="text-3xl">{badge.icon}</div>
                <div>
                  <h3 className="font-semibold text-sm">{badge.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{badge.description}</p>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className={`px-2 py-1 rounded-full ${getRarityColor(badge.rarity)} capitalize`}>
                    {badge.rarity}
                  </span>
                  {badge.earned && badge.earnedDate && (
                    <span className="text-muted-foreground">{badge.earnedDate.toLocaleDateString()}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <h4 className="font-semibold">Recent Achievements</h4>
          {earnedBadges.slice(0, 2).map((badge) => (
            <div key={badge.id} className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30">
              <div className="text-2xl">{badge.icon}</div>
              <div className="flex-1">
                <div className="font-medium">{badge.name}</div>
                <div className="text-sm text-muted-foreground">{badge.description}</div>
              </div>
              <div className="text-xs text-muted-foreground">{badge.earnedDate?.toLocaleDateString()}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
