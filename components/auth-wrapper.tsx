"use client"

import { useState } from "react"
import { LoginForm } from "./login-form"
import { SignupForm } from "./signup-form"
import { Button } from "./ui/button"
import { Card } from "./ui/card"

export function AuthWrapper() {
  const [isLogin, setIsLogin] = useState(true)

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-accent/5">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left side - Illustration/Branding */}
        <div className="hidden lg:flex flex-col justify-center space-y-8 p-8">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              SEBI Guardian AI
            </h1>
            <p className="text-xl text-muted-foreground">
              Advanced AI-powered fraud detection and prevention platform for investors
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-center space-x-4 p-4 rounded-lg bg-card/50 backdrop-blur-sm border border-border luxury-transition luxury-hover">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold">Real-time Fraud Detection</h3>
                <p className="text-sm text-muted-foreground">AI-powered behavioral analysis</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-4 rounded-lg bg-card/50 backdrop-blur-sm border border-border luxury-transition luxury-hover">
              <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold">Instant Alerts</h3>
                <p className="text-sm text-muted-foreground">Get notified of suspicious activity</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-4 rounded-lg bg-card/50 backdrop-blur-sm border border-border luxury-transition luxury-hover">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold">Secure & Private</h3>
                <p className="text-sm text-muted-foreground">Bank-grade security standards</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Auth Form */}
        <div className="flex flex-col justify-center">
          <Card className="p-8 bg-card/95 backdrop-blur-sm border border-border luxury-transition">
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold">{isLogin ? "Welcome Back" : "Create Account"}</h2>
                <p className="text-muted-foreground">
                  {isLogin
                    ? "Sign in to access your fraud protection dashboard"
                    : "Join thousands of protected investors"}
                </p>
              </div>

              {isLogin ? <LoginForm /> : <SignupForm />}

              <div className="text-center">
                <Button
                  variant="ghost"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-sm text-muted-foreground hover:text-foreground luxury-transition"
                >
                  {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
