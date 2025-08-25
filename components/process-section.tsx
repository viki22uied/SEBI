import { Search, BarChart3, AlertTriangle, Bell, ShieldCheck } from "lucide-react"

const steps = [
  { icon: Search, label: "Monitor", description: "Continuous surveillance" },
  { icon: BarChart3, label: "Analyze", description: "Pattern recognition" },
  { icon: AlertTriangle, label: "Assess", description: "Risk evaluation" },
  { icon: Bell, label: "Alert", description: "Instant notification" },
  { icon: ShieldCheck, label: "Protect", description: "Automated intervention" },
]

export function ProcessSection() {
  return (
    <section className="py-20 px-6 md:px-20 bg-secondary/20">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">How Guardian AI Works</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Five-step precision process for fraud prevention
          </p>
        </div>

        {/* Process timeline */}
        <div className="relative">
          {/* Desktop horizontal layout */}
          <div className="hidden md:flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col items-center space-y-4 relative">
                {/* Connection line */}
                {index < steps.length - 1 && (
                  <div
                    className="absolute top-6 left-full w-full h-px bg-border z-0"
                    style={{ width: "calc(100vw / 5 - 2rem)" }}
                  />
                )}

                {/* Step circle */}
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center relative z-10 luxury-transition luxury-hover">
                  <step.icon className="w-6 h-6 text-primary-foreground" />
                </div>

                {/* Step content */}
                <div className="text-center space-y-2 max-w-32">
                  <h3 className="font-semibold text-lg">{step.label}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile vertical layout */}
          <div className="md:hidden space-y-8">
            {steps.map((step, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                  <step.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">{step.label}</h3>
                  <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
