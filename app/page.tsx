import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { CheckCircle, Star, Users, Zap } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />

      {/* Hero Section */}
      <section className="relative bg-black py-16 md:py-24">
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 to-black/60 z-0"></div>
        <div className="container relative z-10 mx-auto max-w-6xl px-4">
          <div className="mb-6 inline-block rounded-full bg-[#EF6C36]/20 px-4 py-1 text-sm font-bold uppercase tracking-wider text-[#EF6C36]">
            TRY SOMETHING NEW EVERY DAY
          </div>

          <h1 className="font-heading mb-6 text-5xl font-black uppercase tracking-tight text-white md:text-7xl">
            STEP OUTSIDE YOUR <br />
            <span className="text-[#EF6C36]">COMFORT ZONE</span>
          </h1>

          <p className="mb-8 max-w-2xl text-lg text-gray-300 md:text-xl">
            Rally gives you opportunities that push your boundaries, help you discover new experiences, and connect with
            a community of like-minded people.
          </p>

          <div className="flex flex-wrap gap-4">
            <Button
              size="lg"
              className="rounded-full bg-[#EF6C36] hover:bg-[#EF6C36]/90 text-white px-8 py-6 text-lg font-bold"
              asChild
            >
              <Link href="/daily-challenges">Try Today's Challenge</Link>
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="rounded-full border-white text-black hover:bg-white/10 px-8 py-6 text-lg font-bold"
              asChild
            >
              <Link href="/blueprint">26-Day Blueprint</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="mb-4 flex items-center justify-center">
            <div className="h-px w-24 bg-gray-300"></div>
            <h2 className="mx-4 text-sm font-bold uppercase tracking-widest">HOW IT WORKS</h2>
            <div className="h-px w-24 bg-gray-300"></div>
          </div>

          <h2 className="mb-16 text-center font-heading text-4xl font-black uppercase md:text-5xl">
            YOUR DAILY <span className="text-[#EF6C36]">ADVENTURE</span> AWAITS
          </h2>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            <div className="flex flex-col items-center text-center">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#EF6C36] text-white text-2xl font-bold">
                1
              </div>
              <h3 className="mb-2 text-xl font-bold">Get Your Challenge</h3>
              <p className="text-gray-600">
                Each morning at 9 AM, a new challenge is released to push your boundaries.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#EF6C36] text-white text-2xl font-bold">
                2
              </div>
              <h3 className="mb-2 text-xl font-bold">Complete It</h3>
              <p className="text-gray-600">Step outside your comfort zone and complete the challenge before 9 PM.</p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#EF6C36] text-white text-2xl font-bold">
                3
              </div>
              <h3 className="mb-2 text-xl font-bold">Share & Connect</h3>
              <p className="text-gray-600">Share your experience and see how others completed the same challenge.</p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#EF6C36] text-white text-2xl font-bold">
                4
              </div>
              <h3 className="mb-2 text-xl font-bold">Build Your Streak</h3>
              <p className="text-gray-600">
                Keep the momentum going by completing challenges daily and climbing the leaderboard.
              </p>
            </div>
          </div>

          <div className="mt-12 flex justify-center">
            <Button className="rounded-full bg-[#EF6C36] hover:bg-[#EF6C36]/90 text-white px-6 py-2" asChild>
              <Link href="/how-it-works">Learn More About How It Works</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* What Rally Offers Section */}
      <section className="bg-gray-100 py-16 md:py-24">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="mb-4 flex items-center justify-center">
            <div className="h-px w-24 bg-gray-300"></div>
            <h2 className="mx-4 text-sm font-bold uppercase tracking-widest text-[#EF6C36]">WHAT RALLY OFFERS</h2>
            <div className="h-px w-24 bg-gray-300"></div>
          </div>

          <h2 className="mb-16 text-center font-heading text-4xl font-black uppercase md:text-5xl">
            MORE THAN JUST <span className="text-[#EF6C36]">CHALLENGES</span>
          </h2>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="group relative overflow-hidden rounded-xl bg-white p-8 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <div className="mb-4 text-[#EF6C36]">
                <Star className="h-8 w-8" />
              </div>
              <h3 className="mb-4 text-2xl font-bold">Daily Challenges</h3>
              <p className="mb-6 text-gray-600">
                From wellness activities to creative prompts, our challenges are designed to help you discover new
                experiences and grow.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center text-sm">
                  <CheckCircle className="mr-2 h-4 w-4 text-[#EF6C36]" />
                  Different categories each day
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle className="mr-2 h-4 w-4 text-[#EF6C36]" />
                  Varying difficulty levels
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle className="mr-2 h-4 w-4 text-[#EF6C36]" />
                  Designed for personal growth
                </li>
              </ul>
            </div>

            <div className="group relative overflow-hidden rounded-xl bg-white p-8 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <div className="mb-4 text-[#EF6C36]">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="mb-4 text-2xl font-bold">Community</h3>
              <p className="mb-6 text-gray-600">
                Connect with like-minded individuals who are also stepping outside their comfort zones and trying new
                things.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center text-sm">
                  <CheckCircle className="mr-2 h-4 w-4 text-[#EF6C36]" />
                  Share your experiences
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle className="mr-2 h-4 w-4 text-[#EF6C36]" />
                  Give and receive compliments
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle className="mr-2 h-4 w-4 text-[#EF6C36]" />
                  Join our WhatsApp group
                </li>
              </ul>
            </div>

            <div className="group relative overflow-hidden rounded-xl bg-white p-8 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <div className="mb-4 text-[#EF6C36]">
                <Zap className="h-8 w-8" />
              </div>
              <h3 className="mb-4 text-2xl font-bold">26-Day Blueprint</h3>
              <p className="mb-6 text-gray-600">
                Ready for a bigger challenge? Our 26-Day Blueprint helps you launch your idea and turn it into reality.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center text-sm">
                  <CheckCircle className="mr-2 h-4 w-4 text-[#EF6C36]" />
                  Structured daily tasks
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle className="mr-2 h-4 w-4 text-[#EF6C36]" />
                  Launch your project
                </li>
                <li className="flex items-center text-sm">
                  <CheckCircle className="mr-2 h-4 w-4 text-[#EF6C36]" />
                  Connect with fellow builders
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="mb-4 flex items-center justify-center">
            <div className="h-px w-24 bg-gray-300"></div>
            <h2 className="mx-4 text-sm font-bold uppercase tracking-widest">TESTIMONIALS</h2>
            <div className="h-px w-24 bg-gray-300"></div>
          </div>

          <h2 className="mb-16 text-center font-heading text-4xl font-black uppercase md:text-5xl">
            WHAT <span className="text-[#EF6C36]">NIGERIANS</span> ARE SAYING
          </h2>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="rounded-xl bg-white p-6 shadow-md">
              <div className="mb-4 flex items-center">
                <div className="h-12 w-12 rounded-full bg-gray-200"></div>
                <div className="ml-4">
                  <h4 className="font-bold">Joseph A.</h4>
                  <p className="text-sm text-gray-500">Lagos</p>
                </div>
              </div>
              <p className="text-gray-600">
                "Some tasks made me laugh. Some made me think. One made me cry. That’s Rally. It meets you where you are and moves you forward."
              </p>
            </div>

            <div className="rounded-xl bg-white p-6 shadow-md">
              <div className="mb-4 flex items-center">
                <div className="h-12 w-12 rounded-full bg-gray-200"></div>
                <div className="ml-4">
                  <h4 className="font-bold">Onyinye O.</h4>
                  <p className="text-sm text-gray-500">Abuja</p>
                </div>
              </div>
              <p className="text-gray-600">
                "Rally makes every day feel like an adventure. I’ve listened to new genres, tried yoga at 6AM, and even wrote a letter to myself. I’m discovering new parts of me and I love it."
              </p>
            </div>

            <div className="rounded-xl bg-white p-6 shadow-md">
              <div className="mb-4 flex items-center">
                <div className="h-12 w-12 rounded-full bg-gray-200"></div>
                <div className="ml-4">
                  <h4 className="font-bold">Eni B.</h4>
                  <p className="text-sm text-gray-500">Port Harcourt</p>
                </div>
              </div>
              <p className="text-gray-600">
                "I thought I needed a big life reset. Turns out I just needed Rally’s daily nudges. 5 minutes a day and I’m actually showing up for myself."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-black py-16 text-white md:py-24">
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <h2 className="mb-6 font-heading text-4xl font-black uppercase md:text-5xl">
            READY TO <span className="text-[#EF6C36]">STEP OUTSIDE</span> YOUR COMFORT ZONE?
          </h2>

          <p className="mb-8 text-lg text-gray-300">
            Join thousands of Nigerians who are discovering new experiences, building connections, and growing every
            day.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Button
              size="lg"
              className="rounded-full bg-[#EF6C36] hover:bg-[#EF6C36]/90 text-white px-8 py-6 text-lg font-bold"
              asChild
            >
              <Link href="/daily-challenges">Try Today's Challenge</Link>
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="rounded-full border-white text-black hover:bg-white/10 px-8 py-6 text-lg font-bold"
              asChild
            >
              <Link href="/blueprint">Explore 26-Day Blueprint</Link>
            </Button>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}
