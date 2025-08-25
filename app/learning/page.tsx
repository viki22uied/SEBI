import { DashboardLayout } from "@/components/dashboard-layout"
import { LearningProgress } from "@/components/learning-progress"
import { QuizModules } from "@/components/quiz-modules"
import { BadgeCollection } from "@/components/badge-collection"
import { LearningStats } from "@/components/learning-stats"

export default function LearningPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Preventive Learning Hub</h1>
            <p className="text-muted-foreground mt-2">Build your fraud immunity through gamified learning modules</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <LearningProgress />
          </div>
          <div>
            <LearningStats />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <QuizModules />
          <BadgeCollection />
        </div>
      </div>
    </DashboardLayout>
  )
}
