import { DashboardLayout } from "@/components/dashboard-layout"
import { BehavioralBiometrics } from "@/components/behavioral-biometrics"
import { SocialContagionMap } from "@/components/social-contagion-map"
import { DeepfakeChecker } from "@/components/deepfake-checker"

export default function FraudDetectionPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Fraud Detection Tools</h1>
            <p className="text-muted-foreground mt-2">
              Advanced AI-powered tools to detect and prevent investment fraud
            </p>
          </div>
        </div>

        <div className="space-y-8">
          <BehavioralBiometrics />
          <SocialContagionMap />
          <DeepfakeChecker />
        </div>
      </div>
    </DashboardLayout>
  )
}
