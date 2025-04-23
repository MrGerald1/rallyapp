import { SiteHeader } from "@/components/site-header"
import { Logo } from "@/components/logo"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  Calendar,
  Star,
  Trophy,
  Heart,
  Users,
  Sparkles,
  ArrowRight,
  MessageCircle,
  Flame,
  Award,
  BarChart3,
} from "lucide-react"

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="container mx-auto max-w-4xl px-4 py-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="mb-4 flex justify-center">
            <Logo />
          </div>
          <h1 className="mb-4 text-4xl font-bold">How Rally Works</h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Rally helps you step outside your comfort zone with daily challenges, build streaks, and connect with a
            community of like-minded individuals.
          </p>
        </div>

        {/* Daily Challenges Section */}
        <section className="mb-16">
          <div className="mb-6 flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-2xl font-bold">Daily Challenges</h2>
          </div>

          <Card className="mb-6 overflow-hidden">
            <div className="h-2 bg-primary"></div>
            <CardContent className="p-6">
              <div className="space-y-4">
                <p>
                  Every day at <strong>9:00 AM</strong>, a new challenge is released. Each challenge is designed to help
                  you try something new and step outside your comfort zone.
                </p>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-lg bg-primary/5 p-4">
                    <h3 className="mb-2 font-semibold">Challenge Categories</h3>
                    <ul className="space-y-1 text-sm">
                      <li className="flex items-center">
                        <ArrowRight className="mr-2 h-3 w-3 text-primary" />
                        <span>Wellness</span>
                      </li>
                      <li className="flex items-center">
                        <ArrowRight className="mr-2 h-3 w-3 text-primary" />
                        <span>Mindfulness</span>
                      </li>
                      <li className="flex items-center">
                        <ArrowRight className="mr-2 h-3 w-3 text-primary" />
                        <span>Creativity</span>
                      </li>
                      <li className="flex items-center">
                        <ArrowRight className="mr-2 h-3 w-3 text-primary" />
                        <span>Adventure</span>
                      </li>
                      <li className="flex items-center">
                        <ArrowRight className="mr-2 h-3 w-3 text-primary" />
                        <span>Social</span>
                      </li>
                      <li className="flex items-center">
                        <ArrowRight className="mr-2 h-3 w-3 text-primary" />
                        <span>Learning</span>
                      </li>
                    </ul>
                  </div>

                  <div className="rounded-lg bg-primary/5 p-4">
                    <h3 className="mb-2 font-semibold">Challenge Difficulty</h3>
                    <p className="mb-2 text-sm">
                      Challenges come in different difficulty levels to accommodate everyone:
                    </p>
                    <ul className="space-y-1 text-sm">
                      <li className="flex items-center">
                        <ArrowRight className="mr-2 h-3 w-3 text-primary" />
                        <span>Easy - Quick activities that take 5-15 minutes</span>
                      </li>
                      <li className="flex items-center">
                        <ArrowRight className="mr-2 h-3 w-3 text-primary" />
                        <span>Medium - Activities that take 15-30 minutes</span>
                      </li>
                      <li className="flex items-center">
                        <ArrowRight className="mr-2 h-3 w-3 text-primary" />
                        <span>Hard - More involved activities that may take 30+ minutes</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="rounded-lg bg-yellow-50 p-4">
                  <h3 className="mb-2 font-semibold flex items-center">
                    <Sparkles className="mr-2 h-4 w-4 text-primary" />
                    Challenge Deadline
                  </h3>
                  <p className="text-sm">
                    You have until <strong>9:00 PM</strong> each day to complete the challenge. After that, a new
                    challenge will be available the next morning.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Streaks Section */}
        <section className="mb-16">
          <div className="mb-6 flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <Flame className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-2xl font-bold">Building Streaks</h2>
          </div>

          <Card className="mb-6 overflow-hidden">
            <div className="h-2 bg-primary"></div>
            <CardContent className="p-6">
              <div className="space-y-4">
                <p>
                  Streaks are at the heart of Rally. Each time you complete a daily challenge, you extend your streak.
                  Miss a day, and your streak resets to zero.
                </p>

                <div className="rounded-lg bg-primary/5 p-4">
                  <h3 className="mb-2 font-semibold">How Streaks Work</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <div className="mr-3 flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-primary">
                        1
                      </div>
                      <div>
                        <p className="font-medium">Complete daily challenges</p>
                        <p className="text-muted-foreground">Each completed challenge adds a day to your streak</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="mr-3 flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-primary">
                        2
                      </div>
                      <div>
                        <p className="font-medium">Maintain consistency</p>
                        <p className="text-muted-foreground">Complete challenges every day to keep your streak going</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="mr-3 flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-primary">
                        3
                      </div>
                      <div>
                        <p className="font-medium">Earn streak bonuses</p>
                        <p className="text-muted-foreground">
                          Longer streaks earn you bonus points and special recognition
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-lg bg-[#EAF8DD] p-4">
                    <h3 className="mb-2 font-semibold flex items-center">
                      <Star className="mr-2 h-4 w-4 text-primary" />
                      Streak Milestones
                    </h3>
                    <ul className="space-y-1 text-sm">
                      <li className="flex items-center justify-between">
                        <span>3-day streak</span>
                        <span className="font-medium">+3 bonus points</span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span>7-day streak</span>
                        <span className="font-medium">+10 bonus points</span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span>30-day streak</span>
                        <span className="font-medium">+15 bonus points</span>
                      </li>
                    </ul>
                  </div>

                  <div className="rounded-lg bg-[#FFF9D3] p-4">
                    <h3 className="mb-2 font-semibold flex items-center">
                      <Award className="mr-2 h-4 w-4 text-primary" />
                      Streak Benefits
                    </h3>
                    <ul className="space-y-1 text-sm">
                      <li className="flex items-center">
                        <ArrowRight className="mr-2 h-3 w-3 text-primary" />
                        <span>Higher leaderboard ranking</span>
                      </li>
                      <li className="flex items-center">
                        <ArrowRight className="mr-2 h-3 w-3 text-primary" />
                        <span>Special recognition in the community</span>
                      </li>
                      <li className="flex items-center">
                        <ArrowRight className="mr-2 h-3 w-3 text-primary" />
                        <span>Personal growth and habit formation</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Points & Leaderboard Section */}
        <section className="mb-16">
          <div className="mb-6 flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <Trophy className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-2xl font-bold">Points & Leaderboard</h2>
          </div>

          <Card className="mb-6 overflow-hidden">
            <div className="h-2 bg-primary"></div>
            <CardContent className="p-6">
              <div className="space-y-4">
                <p>
                  Rally uses a point system to track your progress and rank you on the leaderboard. Earn points through
                  various activities and climb the ranks!
                </p>

                <div className="rounded-lg bg-primary/5 p-4">
                  <h3 className="mb-2 font-semibold flex items-center">
                    <BarChart3 className="mr-2 h-4 w-4 text-primary" />
                    Points System
                  </h3>
                  <ul className="space-y-1 text-sm">
                    <li className="flex items-center justify-between">
                      <span>Completing a daily challenge</span>
                      <span className="font-medium">+5 points</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span>Starting within 3 hrs of challenge drop</span>
                      <span className="font-medium">+2 points</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span>3-day streak bonus</span>
                      <span className="font-medium">+3 points</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span>7-day streak bonus</span>
                      <span className="font-medium">+10 points</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span>30-day streak bonus</span>
                      <span className="font-medium">+15 points</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span>Giving compliments (max 3/day)</span>
                      <span className="font-medium">+1 point each</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span>Receiving compliments (max 5/day)</span>
                      <span className="font-medium">+2 points each</span>
                    </li>
                  </ul>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-lg bg-[#E2F1EB] p-4">
                    <h3 className="mb-2 font-semibold">Weekly Leaderboard</h3>
                    <p className="text-sm">
                      The leaderboard resets weekly, giving everyone a fresh chance to climb to the top. Top performers
                      are featured prominently in the community.
                    </p>
                  </div>

                  <div className="rounded-lg bg-[#E2F1EB] p-4">
                    <h3 className="mb-2 font-semibold">Leaderboard Ranking</h3>
                    <p className="text-sm">
                      Your position on the leaderboard is determined by your total points for the week. Consistent
                      participation and longer streaks will help you climb higher!
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Community & Compliments Section */}
        <section className="mb-16">
          <div className="mb-6 flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <Heart className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-2xl font-bold">Community & Compliments</h2>
          </div>

          <Card className="mb-6 overflow-hidden">
            <div className="h-2 bg-primary"></div>
            <CardContent className="p-6">
              <div className="space-y-4">
                <p>
                  Rally is more than just challenges—it's a community of people supporting each other. Give and receive
                  compliments to encourage others and earn points.
                </p>

                <div className="rounded-lg bg-[#FF8882]/10 p-4">
                  <h3 className="mb-2 font-semibold flex items-center">
                    <MessageCircle className="mr-2 h-4 w-4 text-[#FF8882]" />
                    How Compliments Work
                  </h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <div className="mr-3 flex h-6 w-6 items-center justify-center rounded-full bg-[#FF8882]/20 text-[#FF8882]">
                        1
                      </div>
                      <div>
                        <p className="font-medium">View others' submissions</p>
                        <p className="text-muted-foreground">
                          See how others have completed the same challenges as you
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="mr-3 flex h-6 w-6 items-center justify-center rounded-full bg-[#FF8882]/20 text-[#FF8882]">
                        2
                      </div>
                      <div>
                        <p className="font-medium">Send encouraging compliments</p>
                        <p className="text-muted-foreground">
                          Write a positive message to someone who completed a challenge
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="mr-3 flex h-6 w-6 items-center justify-center rounded-full bg-[#FF8882]/20 text-[#FF8882]">
                        3
                      </div>
                      <div>
                        <p className="font-medium">Earn points and build community</p>
                        <p className="text-muted-foreground">
                          Each compliment you give earns you points and helps build a supportive community
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-lg bg-primary/5 p-4">
                    <h3 className="mb-2 font-semibold">Giving Compliments</h3>
                    <ul className="space-y-1 text-sm">
                      <li className="flex items-center justify-between">
                        <span>Each compliment you give</span>
                        <span className="font-medium">+1 point</span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span>Daily maximum</span>
                        <span className="font-medium">3 compliments</span>
                      </li>
                    </ul>
                  </div>

                  <div className="rounded-lg bg-primary/5 p-4">
                    <h3 className="mb-2 font-semibold">Receiving Compliments</h3>
                    <ul className="space-y-1 text-sm">
                      <li className="flex items-center justify-between">
                        <span>Each compliment you receive</span>
                        <span className="font-medium">+2 points</span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span>Daily maximum</span>
                        <span className="font-medium">5 compliments</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="rounded-lg bg-yellow-50 p-4">
                  <h3 className="mb-2 font-semibold flex items-center">
                    <Users className="mr-2 h-4 w-4 text-primary" />
                    Join the Community
                  </h3>
                  <p className="text-sm mb-3">
                    Connect with other Rally users in our WhatsApp group to share experiences, get inspired, and make
                    new friends!
                  </p>
                  <Button variant="outline" size="sm" className="w-full sm:w-auto" asChild>
                    <a
                      href="https://chat.whatsapp.com/HsIgtz1Ge0MFryTkAVjnIy"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Users className="mr-2 h-4 w-4" />
                      Join WhatsApp Group
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Get Started Section */}
        <section className="mb-8">
          <Card className="overflow-hidden bg-black text-white">
            <CardContent className="p-6 sm:p-8">
              <div className="space-y-6">
                <h2 className="text-2xl font-bold sm:text-3xl">Ready to Start Your Journey?</h2>
                <p className="text-gray-300">
                  Join Rally today and start building your streak of new experiences. What will you discover about
                  yourself?
                </p>
                <div className="flex flex-col space-y-3 sm:flex-row sm:space-x-3 sm:space-y-0">
                  <Button asChild size="lg" className="bg-primary text-white hover:bg-primary/90">
                    <Link href="/">
                      Try Today's Challenge <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                    <Link href="/why">Learn More About Rally</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
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
