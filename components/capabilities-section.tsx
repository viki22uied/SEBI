import { Card } from "@/components/ui/card"
import { Fingerprint, Network, Shield, Brain, Zap } from "lucide-react"

const capabilities = [
  {
    icon: Fingerprint,
    title: "Behavioral DNA Fingerprinting",
    description: "Unique behavioral signatures identify fraudulent patterns",
  },
  {
    icon: Network,
    title: "Social Contagion Mapping",
    description: "Track fraud propagation across networks and communities",
  },
  {
    icon: Shield,
    title: "Deepfake Reality Verification",
    description: "Advanced AI detection of manipulated content",
  },
  {
    icon: Brain,
    title: "Emotional Manipulation Detection",
    description: "Identify psychological pressure tactics and exploitation",
  },
  {
    icon: Zap,
    title: "Preventive Intervention Engine",
    description: "Real-time alerts with automatic protection measures",
  },
]

export function CapabilitiesSection() {
  return (
    <section className="py-20 px-6 md:px-20">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Core Capabilities</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Swiss precision engineering meets AI innovation
          </p>
        </div>

        {/* Capabilities grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {capabilities.map((capability, index) => (
            <Card
              key={index}
              className="luxury-transition group p-8 bg-card/30 backdrop-blur-sm border-border/50 hover:bg-card/50"
            >
              <div className="space-y-6">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 luxury-transition">
                  <capability.icon className="w-6 h-6 text-primary" />
                </div>

                <div className="space-y-3">
                  <h3 className="text-xl font-semibold leading-tight">{capability.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{capability.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
