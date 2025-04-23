import { SiteHeader } from "@/components/site-header"
import { CountdownTimer } from "@/components/countdown-timer"
import { ChallengeCard } from "@/components/challenge-card"
import { Logo } from "@/components/logo"
import { ComebackReminder } from "@/components/comeback-reminder"
import { StreakTracker } from "@/components/streak-tracker"
import { HowItWorks } from "@/components/how-it-works"
import { CommunityTabs } from "@/components/community-tabs"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="container mx-auto max-w-3xl px-4 py-6 sm:py-8">
        <div className="mb-4 text-center sm:mb-6">
          <div className="mb-2 flex justify-center sm:mb-4">
            <Logo />
          </div>
          <h1 className="mb-1 text-3xl font-bold text-foreground sm:text-4xl md:text-5xl">Rally</h1>
          <p className="mb-2 text-lg font-medium text-foreground/80 sm:text-xl md:text-2xl">
            Stop waiting for change. Rally gives you a fun nudge every day to try something new.
          </p>
        </div>

        {/* Countdown Timer - Overlaid on the challenge card */}
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
        <div className="mb-6">
          <HowItWorks defaultExpanded={false} />
        </div>

        {/* Single column layout for remaining content */}
        <div className="space-y-8">
          {/* Community Tabs - Submissions and Leaderboard */}
          <CommunityTabs />

          {/* Reminder to come back tomorrow */}
          <ComebackReminder />
        </div>
      </main>

      <footer className="mt-12 bg-foreground px-4 py-6 text-white sm:mt-16 sm:py-8">
        <div className="container mx-auto max-w-3xl text-center">
          <p className="mb-3 sm:mb-4">© 2025 Rally. Made with ❤️ in Nigeria.</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <a href="/why" className="hover:underline">
              Why Rally?
            </a>
            <a href="/how-it-works" className="hover:underline">
              How It Works
            </a>
            <a href="/complements" className="hover:underline">
              Compliments
            </a>
            <a href="/partner" className="hover:underline">
              Partner with Us
            </a>
            <a href="https://forms.gle/Fn2bPEwHnRerrg7h9" className="hover:underline">
              Give Feedback
            </a>
            <a
              href="https://chat.whatsapp.com/HsIgtz1Ge0MFryTkAVjnIy"
              target="_blank"
              className="hover:underline"
              rel="noreferrer"
            >
              Join Community
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
