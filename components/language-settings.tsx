"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Label } from "./ui/label"

export function LanguageSettings() {
  const [selectedLanguage, setSelectedLanguage] = useState("en")
  const [autoTranslate, setAutoTranslate] = useState(true)

  const languages = [
    { code: "en", name: "English", native: "English" },
    { code: "hi", name: "Hindi", native: "हिन्दी" },
    { code: "bn", name: "Bengali", native: "বাংলা" },
    { code: "te", name: "Telugu", native: "తెలుగు" },
    { code: "mr", name: "Marathi", native: "मराठी" },
    { code: "ta", name: "Tamil", native: "தமிழ்" },
    { code: "gu", name: "Gujarati", native: "ગુજરાતી" },
    { code: "kn", name: "Kannada", native: "ಕನ್ನಡ" },
  ]

  const handleLanguageChange = (languageCode: string) => {
    setSelectedLanguage(languageCode)
    // Here you would typically integrate with Google Translate API
    console.log(`Language changed to: ${languageCode}`)
  }

  return (
    <Card className="bg-card/95 backdrop-blur-sm border border-border luxury-transition">
      <CardHeader>
        <CardTitle>Language & Localization</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Label>Select Language</Label>
          <div className="grid gap-2">
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => handleLanguageChange(language.code)}
                className={`flex items-center justify-between p-3 rounded-lg border luxury-transition ${
                  selectedLanguage === language.code
                    ? "border-primary bg-primary/20 text-primary"
                    : "border-border bg-muted/30 hover:bg-muted/50"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="font-medium">{language.native}</span>
                  <span className="text-sm text-muted-foreground">({language.name})</span>
                </div>
                {selectedLanguage === language.code && (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border">
          <div className="flex-1">
            <Label className="font-medium">Auto-translate Content</Label>
            <p className="text-sm text-muted-foreground mt-1">
              Automatically translate fraud alerts and community content to your preferred language
            </p>
          </div>
          <button
            onClick={() => setAutoTranslate(!autoTranslate)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full luxury-transition ${
              autoTranslate ? "bg-primary" : "bg-muted"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white luxury-transition ${
                autoTranslate ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
          <div className="flex items-center space-x-2 mb-2">
            <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="font-medium text-accent">Translation Powered by Google</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Language translation is provided by Google Translate API to ensure accurate communication across all
            supported languages.
          </p>
        </div>

        <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground luxury-transition">
          Apply Language Settings
        </Button>
      </CardContent>
    </Card>
  )
}
