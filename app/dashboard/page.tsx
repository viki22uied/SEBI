import { DashboardLayout } from "@/components/dashboard-layout"
import { FraudRiskCard } from "@/components/fraud-risk-card"
import { AlertsPanel } from "@/components/alerts-panel"
import { QuickActions } from "@/components/quick-actions"
import { RecentActivity } from "@/components/recent-activity"

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Investor Dashboard</h1>
          <div className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleString()}</div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <FraudRiskCard />
          </div>
          <div>
            <QuickActions />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <AlertsPanel />
          <RecentActivity />
        </div>
      </div>
    </DashboardLayout>
  )
}
