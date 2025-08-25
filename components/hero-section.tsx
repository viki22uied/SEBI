import { Button } from "@/components/ui/button"
import { ArrowRight, Shield } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 md:px-20">
      {/* Premium gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-secondary to-background" />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-12">
        {/* Logo/Brand */}
        <div className="flex items-center justify-center space-x-3 mb-8">
          <Shield className="w-8 h-8 text-primary" />
          <span className="text-2xl font-bold tracking-tight">SEBI Guardian AI</span>
        </div>

        {/* Hero headline */}
        <div className="space-y-6">
          <h1 className="text-5xl md:text-7xl font-bold leading-tight tracking-tight">
            Protecting Investors
            <br />
            <span className="text-primary">Before Fraud Happens</span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            AI-powered fraud prevention for India's financial ecosystem
          </p>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
          <Button size="lg" className="luxury-transition luxury-hover h-12 px-8 text-lg font-medium">
            Experience Guardian AI
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="luxury-transition luxury-hover h-12 px-8 text-lg font-medium border-border hover:bg-card bg-transparent"
          >
            View Capabilities
          </Button>
        </div>
      </div>

      {/* Subtle decorative elements */}
      <div className="absolute top-1/4 left-10 w-2 h-2 bg-accent rounded-full opacity-60 animate-pulse" />
      <div
        className="absolute bottom-1/3 right-16 w-1 h-1 bg-primary rounded-full opacity-40 animate-pulse"
        style={{ animationDelay: "1s" }}
      />
    </section>
  )
}
