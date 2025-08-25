import { Badge } from "@/components/ui/badge"

export function TrustSection() {
  return (
    <section className="py-20 px-6 md:px-20">
      <div className="max-w-4xl mx-auto text-center space-y-12">
        {/* Main content */}
        <div className="space-y-6">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Built in SEBI Regulatory Sandbox</h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Developed under regulatory oversight with the highest compliance standards
          </p>
        </div>

        {/* Trust indicators */}
        <div className="flex flex-wrap items-center justify-center gap-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <span className="text-primary font-bold text-lg">SEBI</span>
            </div>
            <span className="text-muted-foreground">Regulatory Sandbox</span>
          </div>

          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
              <span className="text-accent font-bold text-lg">RBI</span>
            </div>
            <span className="text-muted-foreground">Compliance Ready</span>
          </div>

          <Badge variant="outline" className="px-4 py-2 text-sm">
            Open Source Available
          </Badge>
        </div>
      </div>
    </section>
  )
}
