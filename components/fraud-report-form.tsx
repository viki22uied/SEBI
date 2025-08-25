"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"

interface FraudReport {
  type: string
  description: string
  amount: string
  contact: string
  evidence: File[]
  urgency: "low" | "medium" | "high"
}

export function FraudReportForm() {
  const [report, setReport] = useState<FraudReport>({
    type: "",
    description: "",
    amount: "",
    contact: "",
    evidence: [],
    urgency: "medium",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const fraudTypes = [
    "Phishing Email",
    "Investment Scam",
    "Ponzi Scheme",
    "Fake Trading Platform",
    "Social Media Fraud",
    "Phone Scam",
    "Identity Theft",
    "Other",
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsSubmitting(false)
    setSubmitted(true)

    // Reset form after 3 seconds
    setTimeout(() => {
      setSubmitted(false)
      setReport({
        type: "",
        description: "",
        amount: "",
        contact: "",
        evidence: [],
        urgency: "medium",
      })
    }, 3000)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setReport({ ...report, evidence: Array.from(e.target.files) })
    }
  }

  if (submitted) {
    return (
      <Card className="bg-card/95 backdrop-blur-sm border border-border luxury-transition">
        <CardContent className="p-8 text-center space-y-4">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-green-400">Report Submitted Successfully</h3>
          <p className="text-muted-foreground">
            Thank you for helping protect the community. Your report has been forwarded to the appropriate authorities.
          </p>
          <div className="text-sm text-muted-foreground">
            Report ID: <span className="font-mono text-primary">FR-{Date.now().toString().slice(-6)}</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-card/95 backdrop-blur-sm border border-border luxury-transition">
      <CardHeader>
        <CardTitle>Report Fraudulent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="fraud-type">Type of Fraud</Label>
              <select
                id="fraud-type"
                value={report.type}
                onChange={(e) => setReport({ ...report, type: e.target.value })}
                className="w-full px-3 py-2 bg-input border border-border rounded-md luxury-transition focus:ring-2 focus:ring-accent"
                required
              >
                <option value="">Select fraud type</option>
                {fraudTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="urgency">Urgency Level</Label>
              <select
                id="urgency"
                value={report.urgency}
                onChange={(e) => setReport({ ...report, urgency: e.target.value as "low" | "medium" | "high" })}
                className="w-full px-3 py-2 bg-input border border-border rounded-md luxury-transition focus:ring-2 focus:ring-accent"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe the fraudulent activity in detail..."
              value={report.description}
              onChange={(e) => setReport({ ...report, description: e.target.value })}
              rows={4}
              className="luxury-transition focus:ring-2 focus:ring-accent resize-none"
              required
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount Involved (if applicable)</Label>
              <Input
                id="amount"
                type="text"
                placeholder="₹ 0.00"
                value={report.amount}
                onChange={(e) => setReport({ ...report, amount: e.target.value })}
                className="luxury-transition focus:ring-2 focus:ring-accent"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact">Contact Information</Label>
              <Input
                id="contact"
                type="text"
                placeholder="Phone/Email of fraudster (if known)"
                value={report.contact}
                onChange={(e) => setReport({ ...report, contact: e.target.value })}
                className="luxury-transition focus:ring-2 focus:ring-accent"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="evidence">Evidence (Screenshots, Documents)</Label>
            <input
              id="evidence"
              type="file"
              multiple
              accept="image/*,.pdf,.doc,.docx"
              onChange={handleFileUpload}
              className="w-full px-3 py-2 bg-input border border-border rounded-md luxury-transition focus:ring-2 focus:ring-accent file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
            />
            {report.evidence.length > 0 && (
              <div className="text-sm text-muted-foreground">{report.evidence.length} file(s) selected</div>
            )}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-red-500 hover:bg-red-600 text-white luxury-transition"
          >
            {isSubmitting ? "Submitting Report..." : "Submit Fraud Report"}
          </Button>

          <div className="text-xs text-muted-foreground text-center">
            Your report will be forwarded to SEBI and relevant authorities. All information is kept confidential.
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
