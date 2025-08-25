"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"

interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

interface Quiz {
  id: string
  title: string
  description: string
  questions: QuizQuestion[]
  difficulty: "easy" | "medium" | "hard"
  points: number
  timeLimit: number
}

export function QuizModules() {
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [quizCompleted, setQuizCompleted] = useState(false)

  const quizzes: Quiz[] = [
    {
      id: "phishing-quiz",
      title: "Phishing Detection Challenge",
      description: "Test your ability to spot phishing attempts",
      difficulty: "easy",
      points: 100,
      timeLimit: 300,
      questions: [
        {
          id: "q1",
          question: "Which of these email characteristics is a red flag for phishing?",
          options: [
            "Professional company logo",
            "Urgent language demanding immediate action",
            "Personalized greeting with your name",
            "Clear contact information",
          ],
          correctAnswer: 1,
          explanation: "Urgent language creating pressure is a common phishing tactic to bypass critical thinking.",
        },
        {
          id: "q2",
          question: "What should you do if you receive a suspicious investment opportunity email?",
          options: [
            "Click the link to learn more",
            "Reply asking for more details",
            "Forward it to friends",
            "Report it as spam and delete",
          ],
          correctAnswer: 3,
          explanation: "Always report suspicious emails and never engage with potential phishing attempts.",
        },
        {
          id: "q3",
          question: "Which URL is most likely to be legitimate?",
          options: [
            "https://sebi-india.com/verify",
            "https://www.sebi.gov.in/verify",
            "https://sebi-verification.net",
            "https://sebi.co.in/check",
          ],
          correctAnswer: 1,
          explanation: "Official government websites use .gov.in domain. Be wary of similar-looking domains.",
        },
      ],
    },
    {
      id: "investment-quiz",
      title: "Investment Fraud Awareness",
      description: "Identify common investment scam tactics",
      difficulty: "medium",
      points: 150,
      timeLimit: 450,
      questions: [
        {
          id: "q1",
          question: "What is a major red flag in investment opportunities?",
          options: [
            "Detailed risk disclosures",
            "Guaranteed high returns with no risk",
            "Registered with regulatory authorities",
            "Transparent fee structure",
          ],
          correctAnswer: 1,
          explanation: "No legitimate investment can guarantee high returns without risk. This is always a scam.",
        },
      ],
    },
  ]

  const startQuiz = (quiz: Quiz) => {
    setActiveQuiz(quiz)
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setScore(0)
    setShowResult(false)
    setQuizCompleted(false)
  }

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex)
  }

  const handleNextQuestion = () => {
    if (selectedAnswer === null || !activeQuiz) return

    const isCorrect = selectedAnswer === activeQuiz.questions[currentQuestion].correctAnswer
    if (isCorrect) {
      setScore(score + 1)
    }

    setShowResult(true)

    setTimeout(() => {
      if (currentQuestion < activeQuiz.questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
        setSelectedAnswer(null)
        setShowResult(false)
      } else {
        setQuizCompleted(true)
      }
    }, 2000)
  }

  const resetQuiz = () => {
    setActiveQuiz(null)
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setScore(0)
    setShowResult(false)
    setQuizCompleted(false)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-500/20 text-green-400"
      case "medium":
        return "bg-yellow-500/20 text-yellow-400"
      case "hard":
        return "bg-red-500/20 text-red-400"
      default:
        return "bg-gray-500/20 text-gray-400"
    }
  }

  if (activeQuiz && !quizCompleted) {
    const currentQ = activeQuiz.questions[currentQuestion]
    const isCorrect = selectedAnswer === currentQ.correctAnswer

    return (
      <Card className="bg-card/95 backdrop-blur-sm border border-border luxury-transition">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{activeQuiz.title}</CardTitle>
            <Button variant="ghost" size="sm" onClick={resetQuiz}>
              Exit Quiz
            </Button>
          </div>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              Question {currentQuestion + 1} of {activeQuiz.questions.length}
            </span>
            <span>
              Score: {score}/{currentQuestion + (showResult && isCorrect ? 1 : 0)}
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">{currentQ.question}</h3>

            <div className="space-y-3">
              {currentQ.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={showResult}
                  className={`w-full p-4 text-left rounded-lg border luxury-transition ${
                    selectedAnswer === index
                      ? showResult
                        ? index === currentQ.correctAnswer
                          ? "border-green-500 bg-green-500/20 text-green-400"
                          : "border-red-500 bg-red-500/20 text-red-400"
                        : "border-primary bg-primary/20 text-primary"
                      : showResult && index === currentQ.correctAnswer
                        ? "border-green-500 bg-green-500/20 text-green-400"
                        : "border-border bg-muted/30 hover:bg-muted/50"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>

            {showResult && (
              <div className={`p-4 rounded-lg ${isCorrect ? "bg-green-500/20" : "bg-red-500/20"}`}>
                <div className="flex items-center space-x-2 mb-2">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      isCorrect ? "bg-green-500" : "bg-red-500"
                    }`}
                  >
                    {isCorrect ? "✓" : "✗"}
                  </div>
                  <span className="font-medium">{isCorrect ? "Correct!" : "Incorrect"}</span>
                </div>
                <p className="text-sm text-muted-foreground">{currentQ.explanation}</p>
              </div>
            )}
          </div>

          <Button
            onClick={handleNextQuestion}
            disabled={selectedAnswer === null}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground luxury-transition"
          >
            {currentQuestion < activeQuiz.questions.length - 1 ? "Next Question" : "Finish Quiz"}
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (quizCompleted && activeQuiz) {
    const percentage = Math.round((score / activeQuiz.questions.length) * 100)
    const passed = percentage >= 70

    return (
      <Card className="bg-card/95 backdrop-blur-sm border border-border luxury-transition">
        <CardHeader>
          <CardTitle>Quiz Complete!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-center">
          <div className="space-y-4">
            <div className={`text-6xl font-bold ${passed ? "text-green-400" : "text-yellow-400"}`}>{percentage}%</div>
            <div>
              <h3 className="text-xl font-semibold mb-2">{passed ? "Congratulations!" : "Good Effort!"}</h3>
              <p className="text-muted-foreground">
                You scored {score} out of {activeQuiz.questions.length} questions correctly.
              </p>
            </div>

            {passed && (
              <div className="p-4 rounded-lg bg-primary/20 border border-primary/30">
                <div className="text-primary font-semibold mb-1">Badge Earned!</div>
                <div className="text-sm text-muted-foreground">Fraud Detection Specialist</div>
              </div>
            )}
          </div>

          <div className="flex space-x-3">
            <Button onClick={resetQuiz} className="flex-1 luxury-transition">
              Back to Quizzes
            </Button>
            <Button onClick={() => startQuiz(activeQuiz)} variant="outline" className="flex-1 luxury-transition">
              Retake Quiz
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-card/95 backdrop-blur-sm border border-border luxury-transition">
      <CardHeader>
        <CardTitle>Fraud Immunization Quizzes</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {quizzes.map((quiz) => (
          <div
            key={quiz.id}
            className="p-4 rounded-lg bg-muted/30 border border-border luxury-transition hover:bg-muted/50"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="font-semibold">{quiz.title}</h3>
                  <Badge className={getDifficultyColor(quiz.difficulty)}>{quiz.difficulty}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{quiz.description}</p>
                <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                  <span>{quiz.questions.length} questions</span>
                  <span>•</span>
                  <span>{Math.floor(quiz.timeLimit / 60)} minutes</span>
                  <span>•</span>
                  <span>{quiz.points} points</span>
                </div>
              </div>
            </div>

            <Button
              onClick={() => startQuiz(quiz)}
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground luxury-transition"
            >
              Start Quiz
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
