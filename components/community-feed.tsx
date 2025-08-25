"use client"

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"

interface CommunityPost {
  id: string
  type: "alert" | "tip" | "success"
  title: string
  content: string
  author: string
  timestamp: Date
  likes: number
  category: string
}

export function CommunityFeed() {
  const posts: CommunityPost[] = [
    {
      id: "1",
      type: "alert",
      title: "New Phishing Campaign Targeting Investors",
      content:
        "Be aware of emails claiming to be from SEBI asking for immediate KYC verification. Always verify through official channels.",
      author: "SEBI Guardian Team",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      likes: 24,
      category: "Security Alert",
    },
    {
      id: "2",
      type: "tip",
      title: "How to Verify Investment Advisors",
      content:
        "Always check the SEBI registered investment advisor database before trusting anyone with your money. Look for registration numbers and verify them online.",
      author: "Priya S.",
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      likes: 18,
      category: "Investment Tips",
    },
    {
      id: "3",
      type: "success",
      title: "Avoided a ₹2 Lakh Scam Thanks to SEBI Guardian",
      content:
        "The behavioral analysis detected unusual patterns when I was about to invest in a fake trading platform. Thank you for saving my money!",
      author: "Rajesh K.",
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
      likes: 42,
      category: "Success Story",
    },
    {
      id: "4",
      type: "tip",
      title: "Red Flags in Investment Opportunities",
      content:
        "Guaranteed returns, pressure to invest immediately, and unregistered entities are major red flags. Always take time to research.",
      author: "Financial Advisor",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      likes: 31,
      category: "Education",
    },
  ]

  const getPostIcon = (type: string) => {
    switch (type) {
      case "alert":
        return (
          <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
        )
      case "success":
        return (
          <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )
      default:
        return (
          <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        )
    }
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    return `${Math.floor(diffInHours / 24)}d ago`
  }

  return (
    <Card className="bg-card/95 backdrop-blur-sm border border-border luxury-transition">
      <CardHeader>
        <CardTitle>Community Feed</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {posts.map((post) => (
          <div
            key={post.id}
            className="p-4 rounded-lg bg-muted/30 border border-border luxury-transition hover:bg-muted/40"
          >
            <div className="flex items-start space-x-3">
              {getPostIcon(post.type)}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-sm">{post.title}</h3>
                  <Badge variant="secondary" className="text-xs">
                    {post.category}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{post.content}</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center space-x-3">
                    <span>By {post.author}</span>
                    <span>•</span>
                    <span>{formatTimeAgo(post.timestamp)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                    <span>{post.likes}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
