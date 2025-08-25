import { DashboardLayout } from "@/components/dashboard-layout"
import { FraudReportForm } from "@/components/fraud-report-form"
import { TrustedContacts } from "@/components/trusted-contacts"
import { CommunityFeed } from "@/components/community-feed"
import { ReportStats } from "@/components/report-stats"

export default function CommunityPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Community & Support</h1>
            <p className="text-muted-foreground mt-2">
              Report fraud, connect with trusted contacts, and help protect the community
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <FraudReportForm />
          </div>
          <div>
            <ReportStats />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <TrustedContacts />
          <CommunityFeed />
        </div>
      </div>
    </DashboardLayout>
  )
}
