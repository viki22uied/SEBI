import { DashboardLayout } from "@/components/dashboard-layout"
import { AccountSettings } from "@/components/account-settings"
import { NotificationSettings } from "@/components/notification-settings"
import { PrivacySettings } from "@/components/privacy-settings"
import { LanguageSettings } from "@/components/language-settings"

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Settings & Profile</h1>
            <p className="text-muted-foreground mt-2">Manage your account, notifications, and privacy preferences</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-6">
            <AccountSettings />
            <LanguageSettings />
          </div>
          <div className="space-y-6">
            <NotificationSettings />
            <PrivacySettings />
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
