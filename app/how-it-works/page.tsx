import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CheckCircle } from "lucide-react"

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main>
        {/* Hero Section */}
        <section className="bg-black py-16 text-white">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="mb-4 inline-block rounded-full bg-[#EF6C36]/20 px-4 py-1 text-sm font-bold uppercase tracking-wider text-[#EF6C36]">
              HOW RALLY WORKS
            </div>
            <h1 className="font-heading mb-6 text-4xl font-black uppercase tracking-tight md:text-6xl">
              YOUR DAILY <span className="text-[#EF6C36]">ADVENTURE</span> AWAITS
            </h1>
            <p className="mb-8 max-w-2xl text-lg text-gray-300">
              Rally is designed to help you step outside your comfort zone, try new things, and connect with a community
              of like-minded adventurers.
            </p>
          </div>
        </section>

        {/* Step by Step Process */}
        <section className="py-16">
          <div className="container mx-auto max-w-6xl px-4">
            <h2 className="mb-12 text-center font-heading text-3xl font-bold">The Rally Process</h2>

            <div className="space-y-16">
              {/* Step 1 */}
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 items-center">
                <div>
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#EF6C36] text-white text-2xl font-bold">
                    1
                  </div>
                  <h3 className="mb-4 text-2xl font-bold">Get Your Challenge</h3>
                  <p className="mb-4 text-gray-600">
                    Each morning at 9 AM, a new challenge is released. These challenges are designed to push your
                    boundaries in different ways - from creativity to wellness to social interactions.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <CheckCircle className="mr-2 h-5 w-5 text-[#EF6C36]" />
                      <span>Different challenge categories each day</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="mr-2 h-5 w-5 text-[#EF6C36]" />
                      <span>Varying difficulty levels to match your comfort</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="mr-2 h-5 w-5 text-[#EF6C36]" />
                      <span>Designed for personal growth and discovery</span>
                    </li>
                  </ul>
                </div>
                <div className="rounded-xl bg-gray-100 p-8">
                  <div className="rounded-lg bg-white p-6 shadow-md">
                    <h4 className="mb-2 font-bold">Today's Challenge</h4>
                    <p className="mb-4 text-gray-600">Write a short poem about something that made you smile today.</p>
                    <div className="text-sm text-gray-500">
                      <p>Category: Creative</p>
                      <p>Difficulty: Easy</p>
                      <p>Time: 10-15 minutes</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 items-center">
                <div className="order-2 md:order-1 rounded-xl bg-gray-100 p-8">
                  <div className="rounded-lg bg-white p-6 shadow-md">
                    <h4 className="mb-2 font-bold">Challenge Completion</h4>
                    <p className="mb-4 text-gray-600">
                      I wrote a poem about the butterfly I saw in my garden this morning. It reminded me to appreciate
                      the small moments of beauty in everyday life.
                    </p>
                    <div className="text-sm text-gray-500">
                      <p>Completed at: 2:30 PM</p>
                      <p>Time spent: 12 minutes</p>
                    </div>
                  </div>
                </div>
                <div className="order-1 md:order-2">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#EF6C36] text-white text-2xl font-bold">
                    2
                  </div>
                  <h3 className="mb-4 text-2xl font-bold">Complete It</h3>
                  <p className="mb-4 text-gray-600">
                    Step outside your comfort zone and complete the challenge before 9 PM. The challenges are designed
                    to be doable within your day, typically taking between 10-30 minutes.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <CheckCircle className="mr-2 h-5 w-5 text-[#EF6C36]" />
                      <span>Clear instructions and examples</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="mr-2 h-5 w-5 text-[#EF6C36]" />
                      <span>Flexible completion - adapt to your situation</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="mr-2 h-5 w-5 text-[#EF6C36]" />
                      <span>Submit your experience through the app</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Step 3 */}
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 items-center">
                <div>
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#EF6C36] text-white text-2xl font-bold">
                    3
                  </div>
                  <h3 className="mb-4 text-2xl font-bold">Share & Connect</h3>
                  <p className="mb-4 text-gray-600">
                    Share your experience and see how others completed the same challenge. This creates a sense of
                    community and allows you to learn from others' perspectives.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <CheckCircle className="mr-2 h-5 w-5 text-[#EF6C36]" />
                      <span>View community submissions</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="mr-2 h-5 w-5 text-[#EF6C36]" />
                      <span>Give and receive compliments</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="mr-2 h-5 w-5 text-[#EF6C36]" />
                      <span>Connect with like-minded individuals</span>
                    </li>
                  </ul>
                </div>
                <div className="rounded-xl bg-gray-100 p-8">
                  <div className="rounded-lg bg-white p-6 shadow-md">
                    <h4 className="mb-2 font-bold">Community Engagement</h4>
                    <div className="mb-4 space-y-3">
                      <div className="rounded border p-2 text-sm">
                        <p className="font-medium">Ade K.</p>
                        <p className="text-gray-600">I love how your poem captures that fleeting moment of joy!</p>
                      </div>
                      <div className="rounded border p-2 text-sm">
                        <p className="font-medium">Ngozi M.</p>
                        <p className="text-gray-600">
                          Your poem inspired me to look for beauty in my surroundings today.
                        </p>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      <p>2 compliments received</p>
                      <p>12 people completed this challenge</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 4 */}
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 items-center">
                <div className="order-2 md:order-1 rounded-xl bg-gray-100 p-8">
                  <div className="rounded-lg bg-white p-6 shadow-md">
                    <h4 className="mb-2 font-bold">Your Progress</h4>
                    <div className="mb-4">
                      <div className="mb-2 flex justify-between text-sm">
                        <span>Current Streak</span>
                        <span className="font-bold">7 days</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-gray-200">
                        <div className="h-2 rounded-full bg-[#EF6C36]" style={{ width: "70%" }}></div>
                      </div>
                    </div>
                    <div className="mb-4">
                      <div className="mb-2 flex justify-between text-sm">
                        <span>Weekly Rank</span>
                        <span className="font-bold">#12</span>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      <p>Total challenges completed: 24</p>
                      <p>Longest streak: 9 days</p>
                    </div>
                  </div>
                </div>
                <div className="order-1 md:order-2">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#EF6C36] text-white text-2xl font-bold">
                    4
                  </div>
                  <h3 className="mb-4 text-2xl font-bold">Build Your Streak</h3>
                  <p className="mb-4 text-gray-600">
                    Keep the momentum going by completing challenges daily and climbing the leaderboard. Consistency is
                    key to personal growth and building new habits.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <CheckCircle className="mr-2 h-5 w-5 text-[#EF6C36]" />
                      <span>Track your daily streak</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="mr-2 h-5 w-5 text-[#EF6C36]" />
                      <span>Compete on the weekly leaderboard</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="mr-2 h-5 w-5 text-[#EF6C36]" />
                      <span>Earn recognition for consistency</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="bg-gray-100 py-16">
          <div className="container mx-auto max-w-4xl px-4">
            <h2 className="mb-12 text-center font-heading text-3xl font-bold">Frequently Asked Questions</h2>

            <div className="space-y-6">
              <div className="rounded-lg bg-white p-6 shadow-md">
                <h3 className="mb-2 text-xl font-bold">How much time do I need to complete challenges?</h3>
                <p className="text-gray-600">
                  Most challenges are designed to take between 10-30 minutes. We understand you're busy, so we keep them
                  manageable for daily life.
                </p>
              </div>

              <div className="rounded-lg bg-white p-6 shadow-md">
                <h3 className="mb-2 text-xl font-bold">What if I miss a day?</h3>
                <p className="text-gray-600">
                  No problem! While streaks reset if you miss a day, you can always jump back in. The goal is progress,
                  not perfection.
                </p>
              </div>

              <div className="rounded-lg bg-white p-6 shadow-md">
                <h3 className="mb-2 text-xl font-bold">Are the challenges appropriate for everyone?</h3>
                <p className="text-gray-600">
                  Yes! We offer varying difficulty levels and categories. You can always adapt challenges to fit your
                  comfort level and personal situation.
                </p>
              </div>

              <div className="rounded-lg bg-white p-6 shadow-md">
                <h3 className="mb-2 text-xl font-bold">How is the 26-Day Blueprint different?</h3>
                <p className="text-gray-600">
                  While daily challenges are standalone activities, the Blueprint is a structured program specifically
                  designed to help you launch a project or idea over 26 days.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-black py-16 text-white">
          <div className="container mx-auto max-w-4xl px-4 text-center">
            <h2 className="mb-6 font-heading text-4xl font-bold">Ready to Start Your Adventure?</h2>
            <p className="mb-8 text-lg text-gray-300">
              Join thousands of Nigerians who are discovering new experiences, building connections, and growing every
              day.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                size="lg"
                className="rounded-full bg-[#EF6C36] hover:bg-[#EF6C36]/90 text-white px-8 py-6 text-lg font-bold animate-pulse-border"
                asChild
              >
                <Link href="/daily-challenges">Try Today's Challenge</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
