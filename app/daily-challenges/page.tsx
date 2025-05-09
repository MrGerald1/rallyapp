import { SiteHeader } from "@/components/site-header"
import { CountdownTimer } from "@/components/countdown-timer"
import { ChallengeCard } from "@/components/challenge-card"
import { ComebackReminder } from "@/components/comeback-reminder"
import { StreakTracker } from "@/components/streak-tracker"
import { HowItWorks } from "@/components/how-it-works"
import { CommunityTabs } from "@/components/community-tabs"
import { SiteFooter } from "@/components/site-footer"

export default function DailyChallengesPage() {
  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />

      <main className="container mx-auto max-w-3xl px-4 py-6 sm:py-8">
        <h1 className="font-heading text-3xl font-bold text-center mb-6">Today's Challenge</h1>

        <div className="mb-4 rounded-lg bg-secondary/30 p-3 text-center backdrop-blur-sm">
          <CountdownTimer />
        </div>

        {/* Challenge Card - Prominent position */}
        <div className="mb-6">
          <ChallengeCard />
        </div>

        {/* Streak tracker */}
        <StreakTracker />

        {/* How It Works section - Not auto-expanded */}
        {/* <div className="mb-6">
          <HowItWorks defaultExpanded={false} />
        </div> */}

        {/* Single column layout for remaining content */}
        <div className="space-y-8">
          {/* Community Tabs - Submissions and Leaderboard */}
          <CommunityTabs />

          {/* Reminder to come back tomorrow */}
          <ComebackReminder />
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
