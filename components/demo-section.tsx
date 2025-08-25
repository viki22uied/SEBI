import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Play, ArrowRight } from "lucide-react"

export function DemoSection() {
  return (
    <section className="py-20 px-6 md:px-20 bg-secondary/10">
      <div className="max-w-4xl mx-auto">
        <Card className="luxury-transition luxury-card-hover p-12 bg-card/30 backdrop-blur-sm border-border/50 text-center">
          <div className="space-y-8">
            {/* Demo preview */}
            <div className="relative aspect-video bg-secondary/20 rounded-lg overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <Button size="lg" className="luxury-transition luxury-hover bg-primary/90 hover:bg-primary">
                  <Play className="w-6 h-6 mr-2" />
                  Watch Demo
                </Button>
              </div>

              {/* Subtle overlay pattern */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5" />
            </div>

            {/* Content */}
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight">See Guardian AI in Action</h2>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Experience real-time fraud detection and prevention capabilities
              </p>

              <Button size="lg" className="luxury-transition luxury-hover h-12 px-8 text-lg font-medium">
                Request Private Demo
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </section>
  )
}
