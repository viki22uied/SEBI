"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Progress } from "./ui/progress"
import { Button } from "./ui/button"

interface LearningModule {
  id: string
  title: string
  description: string
  progress: number
  totalLessons: number
  completedLessons: number
  difficulty: "beginner" | "intermediate" | "advanced"
  category: string
  estimatedTime: string
}

export function LearningProgress() {
  const [modules, setModules] = useState<LearningModule[]>([])
  const [selectedModule, setSelectedModule] = useState<LearningModule | null>(null)

  useEffect(() => {
    const learningModules: LearningModule[] = [
      {
        id: "phishing-basics",
        title: "Phishing Attack Recognition",
        description: "Learn to identify and avoid phishing attempts targeting investors",
        progress: 75,
        totalLessons: 8,
        completedLessons: 6,
        difficulty: "beginner",
        category: "Email Security",
        estimatedTime: "25 min",
      },
      {
        id: "ponzi-schemes",
        title: "Ponzi Scheme Detection",
        description: "Understand the warning signs of Ponzi schemes and pyramid scams",
        progress: 50,
        totalLessons: 10,
        completedLessons: 5,
        difficulty: "intermediate",
        category: "Investment Fraud",
        estimatedTime: "40 min",
      },
      {
        id: "social-engineering",
        title: "Social Engineering Tactics",
        description: "Recognize manipulation techniques used by fraudsters",
        progress: 25,
        totalLessons: 12,
        completedLessons: 3,
        difficulty: "advanced",
        category: "Psychology",
        estimatedTime: "60 min",
      },
      {
        id: "crypto-scams",
        title: "Cryptocurrency Scams",
        description: "Navigate the crypto world safely and avoid common traps",
        progress: 0,
        totalLessons: 15,
        completedLessons: 0,
        difficulty: "intermediate",
        category: "Cryptocurrency",
        estimatedTime: "45 min",
      },
    ]
    setModules(learningModules)
    setSelectedModule(learningModules[0])
  }, [])

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-500/20 text-green-400"
      case "intermediate":
        return "bg-yellow-500/20 text-yellow-400"
      case "advanced":
        return "bg-red-500/20 text-red-400"
      default:
        return "bg-gray-500/20 text-gray-400"
    }
  }

  const getProgressColor = (progress: number) => {
    if (progress === 100) return "bg-green-500"
    if (progress >= 50) return "bg-primary"
    return "bg-accent"
  }

  return (
    <Card className="bg-card/95 backdrop-blur-sm border border-border luxury-transition">
      <CardHeader>
        <CardTitle>Learning Modules</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4">
          {modules.map((module) => (
            <div
              key={module.id}
              className={`p-4 rounded-lg border luxury-transition cursor-pointer ${
                selectedModule?.id === module.id
                  ? "border-primary bg-primary/10"
                  : "border-border bg-muted/30 hover:bg-muted/50"
              }`}
              onClick={() => setSelectedModule(module)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="font-semibold">{module.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs ${getDifficultyColor(module.difficulty)}`}>
                      {module.difficulty}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{module.description}</p>
                  <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                    <span>{module.category}</span>
                    <span>•</span>
                    <span>{module.estimatedTime}</span>
                    <span>•</span>
                    <span>
                      {module.completedLessons}/{module.totalLessons} lessons
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary mb-1">{module.progress}%</div>
                  <div className="text-xs text-muted-foreground">Complete</div>
                </div>
              </div>

              <div className="space-y-2">
                <Progress value={module.progress} className="h-2" />
                <div className="flex justify-between">
                  <Button size="sm" variant={module.progress > 0 ? "default" : "outline"} className="luxury-transition">
                    {module.progress > 0 ? "Continue" : "Start"} Learning
                  </Button>
                  {module.progress > 0 && (
                    <Button size="sm" variant="ghost" className="text-accent hover:text-accent/80">
                      View Progress
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {selectedModule && (
          <div className="p-6 rounded-lg bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20">
            <h3 className="font-semibold mb-2">Continue Learning: {selectedModule.title}</h3>
            <p className="text-sm text-muted-foreground mb-4">
              You're {selectedModule.progress}% through this module. Keep going to earn your next badge!
            </p>
            <div className="flex space-x-3">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground luxury-transition">
                Resume Module
              </Button>
              <Button variant="outline" className="luxury-transition bg-transparent">
                Take Quiz
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
