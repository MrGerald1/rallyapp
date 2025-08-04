"use client"

import { Button } from "@/components/ui/button"
import { SiteHeader } from "@/components/site-header"
import { Zap, Star, Users, Rocket } from "lucide-react"
// import { BlueprintEnrollForm } from "@/components/blueprint/blueprint-enroll-form"
import { SiteFooter } from "@/components/site-footer"
// import { useState, useEffect } from "react"
// import type { Blueprint } from "@/lib/types"

export default function BlueprintPage() {
  // const [activeBlueprint, setActiveBlueprint] = useState<Blueprint | null>(null)
  // const [loading, setLoading] = useState(true)
  // const [error, setError] = useState<string | null>(null)

  // Add useEffect to fetch the active blueprint
  // useEffect(() => {
  //   async function fetchActiveBlueprint() {
  //     setLoading(true)
  //     setError(null)
  //     try {
  //       const response = await fetch("/api/blueprints/active")

  //       if (!response.ok) {
  //         if (response.status === 404) {
  //           setError("No active blueprint available at this time")
  //           setLoading(false)
  //           return
  //         }
  //         throw new Error(`Failed to fetch active blueprint: ${response.status}`)
  //       }

  //       const data = await response.json()
  //       setActiveBlueprint(data)
  //     } catch (err) {
  //       console.error("Error fetching active blueprint:", err)
  //       setError("Failed to load blueprint data")
  //     } finally {
  //       setLoading(false)
  //     }
  //   }

  //   fetchActiveBlueprint()
  // }, [])

  const scrollToEnroll = () => {
    const enrollSection = document.getElementById("enroll")
    if (enrollSection) {
      enrollSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <div className="min-h-screen bg-white font-sans">
      <SiteHeader />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-black py-6 text-white">
        <div className="absolute inset-0 z-0 opacity-30">
          <div className="h-full w-full bg-[url('/vibrant-african-tech.png')] bg-cover bg-center bg-no-repeat"></div>
        </div>
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/60 to-black/20"></div>
        <div className="absolute -left-20 top-20 h-64 w-64 rounded-full bg-[#EF6C36]/30 blur-3xl"></div>
        <div className="absolute -right-20 bottom-20 h-64 w-64 rounded-full bg-[#EF6C36]/20 blur-3xl"></div>

        <div className="container relative z-10 mx-auto max-w-5xl px-4 py-12 md:py-16">
          <div className="mb-2 inline-block rounded-full bg-[#EF6C36]/20 px-4 py-1 text-sm font-bold uppercase tracking-wider text-[#EF6C36]">
            26-Day Blueprint
          </div>
          <div className="flex flex-col">
            <h1 className="mb-3 font-heading text-4xl font-black uppercase leading-none tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              <span className="block text-xl font-medium uppercase tracking-widest sm:text-2xl">
                Ideas Don't Belong in
              </span>
              <span className="block">YOUR NOTES.</span>
              <span className="mt-1 block text-[#EF6C36]">MAKE IT REAL.</span>
            </h1>
            <div className="max-w-3xl">
              <p className="mb-6 text-lg font-medium leading-relaxed text-gray-300 sm:text-xl">
                Your app, your YouTube channel, your brand. Build what's yours.
                <span className="block mt-1 font-bold">
                  Blueprint is 26 days to stop thinking and start doing with folks who actually get it.
                </span>
              </p>
            </div>
            <div>
              <Button
                size="lg"
                className="group relative overflow-hidden rounded-full bg-[#EF6C36] px-8 py-6 text-lg font-bold text-white transition-all hover:bg-[#EF6C36]/90 hover:shadow-lg animate-pulse-border"
                onClick={scrollToEnroll}
              >
                <span className="relative z-10">Sounds like You - Enrol FREE!</span>
                <span className="absolute bottom-0 left-0 h-full w-0 bg-white/20 transition-all duration-300 group-hover:w-full"></span>
              </Button>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-start gap-6 text-sm font-medium text-gray-400">
            <div className="flex items-center">
              <Zap className="mr-2 h-4 w-4 text-[#EF6C36]" />
              <span>26 Days</span>
            </div>
            <div className="flex items-center">
              <Users className="mr-2 h-4 w-4 text-[#EF6C36]" />
              <span>Community Support</span>
            </div>
            <div className="flex items-center">
              <Rocket className="mr-2 h-4 w-4 text-[#EF6C36]" />
              <span>Launch Your Idea</span>
            </div>
            <div className="flex items-center">
              <Star className="mr-2 h-4 w-4 text-[#EF6C36]" />
              <span>100% Free</span>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black to-transparent"></div>
      </section>

      {/* The Real Talk Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="mb-12 flex items-center">
            <div className="h-1 flex-grow bg-black"></div>
            <h2 className="mx-4 text-sm font-bold uppercase tracking-widest">The Real Talk</h2>
            <div className="h-1 flex-grow bg-black"></div>
          </div>

          <h2 className="mb-12 text-center font-heading text-4xl font-black uppercase sm:text-5xl">
            Yeah, We <span className="text-[#EF6C36]">See</span> You.
          </h2>

          <div className="space-y-8 text-lg">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <div className="group relative overflow-hidden rounded-xl border-2 border-transparent bg-gray-100 p-6 transition-all duration-300 hover:border-[#EF6C36] hover:bg-gray-50">
                <h3 className="mb-2 text-xl font-bold">
                  You're the <span className="text-[#EF6C36]">Creator</span>
                </h3>
                <p>ready to launch your channel, podcast, newsletter, or community.</p>
              </div>

              <div className="group relative overflow-hidden rounded-xl border-2 border-transparent bg-gray-100 p-6 transition-all duration-300 hover:border-[#EF6C36] hover:bg-gray-50">
                <h3 className="mb-2 text-xl font-bold">
                  You're the <span className="text-[#EF6C36]">Techie</span>
                </h3>
                <p>itching to finally ship that app, platform, or AI tool.</p>
              </div>

              <div className="group relative overflow-hidden rounded-xl border-2 border-transparent bg-gray-100 p-6 transition-all duration-300 hover:border-[#EF6C36] hover:bg-gray-50">
                <h3 className="mb-2 text-xl font-bold">
                  You're the <span className="text-[#EF6C36]">Curious One</span>
                </h3>
                <p>eager to craft that brand, service, music or store.</p>
              </div>
            </div>

            <p className="text-xl">
              You've researched, planned, tweaked... but then tomorrow becomes next week, and next week becomes "one
              day". At the end of the day... <span className="font-bold italic">it's still an idea</span>😪.
            </p>

            {/* CTA for The Real Talk */}
            <div className="text-center pt-8">
              <Button
                size="lg"
                onClick={scrollToEnroll}
                className="group relative overflow-hidden rounded-full bg-black px-8 py-6 text-lg font-bold text-white transition-all hover:bg-gray-800 hover:shadow-lg"
              >
                <span className="relative z-10">I'm Done Waiting</span>
                <span className="absolute bottom-0 left-0 h-full w-0 bg-[#EF6C36]/20 transition-all duration-300 group-hover:w-full"></span>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#EF6C36] to-[#D55A2A] py-20 text-white">
        <div className="absolute -left-32 -top-32 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
        <div className="absolute -right-32 -bottom-32 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>

        <div className="container relative z-10 mx-auto max-w-4xl px-4 text-center">
          <div className="mb-8 inline-block rounded-full bg-white/20 px-4 py-1 text-sm font-bold uppercase tracking-wider">
            Before You Continue
          </div>

          <h2 className="mb-6 font-heading text-4xl font-black uppercase sm:text-5xl">
            Watch <span className="text-black">This</span>
          </h2>

          <p className="mx-auto mb-12 max-w-2xl text-xl opacity-90">
            See what the 26-Day Blueprint is really about and why it works.
          </p>

          <div className="relative mx-auto max-w-4xl">
            <div className="relative aspect-video overflow-hidden rounded-2xl bg-black shadow-2xl">
              <iframe
                src="https://www.youtube.com/embed/TmLtD8aY3x0"
                title="26-Day Blueprint Explanation"
                className="absolute inset-0 h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>

            {/* Play button overlay for visual appeal */}
            {/* <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="rounded-full bg-[#EF6C36]/20 p-4 backdrop-blur-sm">
                <Play className="h-12 w-12 text-white opacity-0 transition-opacity duration-300" />
              </div>
            </div> */}
          </div>

          <div className="mt-12">
            <Button
              size="lg"
              onClick={scrollToEnroll}
              className="group relative overflow-hidden rounded-full bg-white px-8 py-6 text-lg font-bold text-[#EF6C36] transition-all hover:bg-gray-100 hover:shadow-lg"
            >
              <span className="relative z-10">Ready to Start? Let's Go!</span>
              <span className="absolute bottom-0 left-0 h-full w-0 bg-[#EF6C36]/10 transition-all duration-300 group-hover:w-full"></span>
            </Button>
          </div>
        </div>
      </section>

      {/* The Blueprint Section */}
      <section className="relative overflow-hidden bg-[#F3F4F6] py-20">
        <div className="absolute -left-32 -top-32 h-64 w-64 rounded-full bg-[#EF6C36]/10 blur-3xl"></div>
        <div className="absolute -right-32 -bottom-32 h-64 w-64 rounded-full bg-[#EF6C36]/10 blur-3xl"></div>

        <div className="container relative z-10 mx-auto max-w-4xl px-4">
          <div className="mb-12 flex items-center">
            <div className="h-1 flex-grow bg-[#EF6C36]"></div>
            <h2 className="mx-4 text-sm font-bold uppercase tracking-widest text-[#EF6C36]">The Blueprint</h2>
            <div className="h-1 flex-grow bg-[#EF6C36]"></div>
          </div>

          <h2 className="mb-8 text-center font-heading text-4xl font-black uppercase sm:text-5xl">
            <span className="text-[#EF6C36]">26 Days</span> to Make It Real.
          </h2>

          <p className="mb-12 text-center text-xl">
            It's about doing the hard work, learning a ton, and finding friends who get why you're obsessed with your
            project.
          </p>

          {/* CTA for The Blueprint */}
          {/* <div className="text-center mb-12">
            <Button
              size="lg"
              onClick={scrollToEnroll}
              className="group relative overflow-hidden rounded-full bg-[#EF6C36] px-8 py-6 text-lg font-bold text-white transition-all hover:bg-[#EF6C36]/90 hover:shadow-lg"
            >
              <span className="relative z-10">Start the 26 Days</span>
              <span className="absolute bottom-0 left-0 h-full w-0 bg-white/20 transition-all duration-300 group-hover:w-full"></span>
            </Button>
          </div> */}

          <div className="grid gap-8 md:grid-cols-2">
            <div className="group relative overflow-hidden rounded-2xl bg-white p-8 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-[#EF6C36]/10 transition-all duration-300 group-hover:bg-[#EF6C36]/20"></div>
              <h3 className="relative z-10 mb-4 text-2xl font-bold">Any Idea</h3>
              <p className="relative z-10 text-lg mb-6">
                Tech, content, music, Instagram store – if it excites you, bring it.
              </p>
            </div>

            <div className="group relative overflow-hidden rounded-2xl bg-white p-8 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-[#EF6C36]/10 transition-all duration-300 group-hover:bg-[#EF6C36]/20"></div>
              <h3 className="relative z-10 mb-4 text-2xl font-bold">Your Launch Crew</h3>
              <p className="relative z-10 text-lg mb-6">
                Private community access with fellow participants in the trenches. Ask the dumb questions, share
                wins/fails, get unstuck.
              </p>
              {/* <Button
                onClick={scrollToEnroll}
                className="group/btn relative overflow-hidden rounded-full bg-[#EF6C36] px-6 py-3 text-sm font-bold text-white transition-all hover:bg-[#EF6C36]/90"
              >
                <span className="relative z-10">Find Your People</span>
                <span className="absolute bottom-0 left-0 h-full w-0 bg-white/20 transition-all duration-300 group-hover/btn:w-full"></span>
              </Button> */}
            </div>

            <div className="group relative overflow-hidden rounded-2xl bg-white p-8 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-[#EF6C36]/10 transition-all duration-300 group-hover:bg-[#EF6C36]/20"></div>
              <h3 className="relative z-10 mb-4 text-2xl font-bold">Daily Tasks in Rally</h3>
              <p className="relative z-10 text-lg mb-6">
                Log in each day. Get a clear task supported with examples and guidance. Do the work. No excuses.
              </p>
              {/* <Button
                onClick={scrollToEnroll}
                className="group/btn relative overflow-hidden rounded-full bg-black px-6 py-3 text-sm font-bold text-white transition-all hover:bg-gray-800"
              >
                <span className="relative z-10">Show Me Today's Task</span>
                <span className="absolute bottom-0 left-0 h-full w-0 bg-[#EF6C36]/20 transition-all duration-300 group-hover/btn:w-full"></span>
              </Button> */}
            </div>

            <div className="group relative overflow-hidden rounded-2xl bg-white p-8 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-[#EF6C36]/10 transition-all duration-300 group-hover:bg-[#EF6C36]/20"></div>
              <h3 className="relative z-10 mb-4 text-2xl font-bold">Build and Test Your "Toy"</h3>
              <p className="relative z-10 text-lg mb-6">
                Build the simplest version of your idea and get real, quick feedback from potential users.
              </p>
              {/* <Button
                onClick={scrollToEnroll}
                className="group/btn relative overflow-hidden rounded-full bg-green-600 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-green-700"
              >
                <span className="relative z-10">Test the Idea Fast</span>
                <span className="absolute bottom-0 left-0 h-full w-0 bg-white/20 transition-all duration-300 group-hover/btn:w-full"></span>
              </Button> */}
            </div>

            <div className="col-span-full group relative overflow-hidden rounded-2xl bg-black p-8 text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-[#EF6C36]/20 transition-all duration-300 group-hover:bg-[#EF6C36]/30"></div>
              <h3 className="relative z-10 mb-4 text-2xl font-bold">Weekly Check-ins & Demo Day</h3>
              <p className="relative z-10 text-lg mb-6">
                Stay accountable with external check-ins and showcase what you built.
              </p>
              <Button
                onClick={scrollToEnroll}
                className="group/btn relative overflow-hidden rounded-full bg-[#EF6C36] px-6 py-3 text-sm font-bold text-white transition-all hover:bg-[#EF6C36]/90"
              >
                <span className="relative z-10">I'll Be There</span>
                <span className="absolute bottom-0 left-0 h-full w-0 bg-white/20 transition-all duration-300 group-hover/btn:w-full"></span>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* The Outcome Section */}
      <section className="bg-white py-20">
        <div className="absolute -left-32 bottom-0 h-64 w-64 rounded-full bg-[#EF6C36]/10 blur-3xl"></div>
        <div className="absolute -right-32 top-0 h-64 w-64 rounded-full bg-[#EF6C36]/10 blur-3xl"></div>

        <div className="container relative z-10 mx-auto max-w-4xl px-4">
          <div className="mb-12 flex items-center">
            <div className="h-1 flex-grow bg-[#EF6C36]"></div>
            <h2 className="mx-4 text-sm font-bold uppercase tracking-widest text-[#EF6C36]">The Outcome</h2>
            <div className="h-1 flex-grow bg-[#EF6C36]"></div>
          </div>

          <h2 className="mb-12 text-center font-heading text-4xl font-black uppercase sm:text-5xl">
            After 26 Days? <br />
            <span className="text-[#EF6C36]">You've Done the Damn Thing.</span>
          </h2>

          <div className="mb-12 rounded-2xl bg-white p-8 shadow-lg">
            <p className="text-xl leading-relaxed">
              Your idea is <span className="font-bold">live and breathing</span>. It's out there. Maybe it goes viral.
              Maybe you get your first fans, users, or customers. Maybe you realise you can actually quit that job.
              You've learned by doing. You found your people.{" "}
              <span className="font-bold text-[#EF6C36]">You proved you could start.</span>
            </p>
          </div>

          {/* CTA for The Outcome */}
          <div className="text-center">
            <Button
              size="lg"
              onClick={scrollToEnroll}
              className="group relative overflow-hidden rounded-full bg-gradient-to-r from-[#EF6C36] to-[#D55A2A] px-8 py-6 text-lg font-bold text-white transition-all hover:shadow-lg"
            >
              <span className="relative z-10">Let's Launch This</span>
              <span className="absolute bottom-0 left-0 h-full w-0 bg-white/20 transition-all duration-300 group-hover:w-full"></span>
            </Button>
          </div>
        </div>
      </section>

      {/* Call to Action Section - Original with custom form (commented out for now)
      <section id="enroll" className="relative overflow-hidden bg-black py-20 text-white">
        <div className="absolute -left-32 -top-32 h-64 w-64 rounded-full bg-[#EF6C36]/20 blur-3xl"></div>
        <div className="absolute -right-32 -bottom-32 h-64 w-64 rounded-full bg-[#EF6C36]/20 blur-3xl"></div>

        <div className="container relative z-10 mx-auto max-w-4xl px-4 text-center">
          <div className="mb-8 inline-block rounded-full bg-[#EF6C36]/20 px-4 py-1 text-sm font-bold uppercase tracking-wider text-[#EF6C36]">
            Limited Spots Available
          </div>

          <h2 className="mb-6 font-heading text-5xl font-black uppercase sm:text-6xl">
            So. <span className="text-[#EF6C36]">You In?</span>
          </h2>

          <p className="mx-auto mb-12 max-w-2xl text-xl">
            The 26-Day Blueprint is <span className="font-bold text-[#EF6C36]">FREE</span>. Applications open August 4th
            to close on <span className="font-bold text-[#EF6C36]">August 31st </span>2025. Spots are limited. Don't
            overthink it.
          </p>

          <div className="relative mx-auto max-w-2xl rounded-2xl bg-white p-8 text-black shadow-2xl">
            <div className="absolute -right-4 -top-4 rounded-full bg-[#EF6C36] px-4 py-2 text-sm font-bold text-white animate-pulse-border">
              FREE
            </div>
            {loading ? (
              <div className="py-8 text-center">Loading blueprint information...</div>
            ) : error ? (
              <div className="py-8 text-center text-red-500">{error}</div>
            ) : activeBlueprint ? (
              <BlueprintEnrollForm blueprintId={activeBlueprint.id} />
            ) : (
              <div className="py-8 text-center">No active blueprint available at this time.</div>
            )}
          </div>

          <p className="mt-8 text-sm text-gray-400">
            Hit the button and get ready. Simple. And yeah, the 26 days thing? You'll see...😏
          </p>
        </div>
      </section>
      */}

      {/* Call to Action Section - Google Form */}
      <section id="enroll" className="relative overflow-hidden bg-black py-20 text-white">
        <div className="absolute -left-32 -top-32 h-64 w-64 rounded-full bg-[#EF6C36]/20 blur-3xl"></div>
        <div className="absolute -right-32 -bottom-32 h-64 w-64 rounded-full bg-[#EF6C36]/20 blur-3xl"></div>

        <div className="container relative z-10 mx-auto max-w-4xl px-4 text-center">
          <div className="mb-8 inline-block rounded-full bg-[#EF6C36]/20 px-4 py-1 text-sm font-bold uppercase tracking-wider text-[#EF6C36]">
            Limited Spots Available
          </div>

          <h2 className="mb-6 font-heading text-5xl font-black uppercase sm:text-6xl">
            So. <span className="text-[#EF6C36]">You In?</span>
          </h2>

          <p className="mx-auto mb-12 max-w-2xl text-xl">
            The 26-Day Blueprint is <span className="font-bold text-[#EF6C36]">FREE</span>. Applications open August 4th
            to close on <span className="font-bold text-[#EF6C36]">August 31st </span>2025. Spots are limited. Don't
            overthink it.
          </p>

          <div className="relative mx-auto max-w-4xl rounded-2xl bg-white p-4 shadow-2xl">
            <div className="absolute -right-4 -top-4 rounded-full bg-[#EF6C36] px-4 py-2 text-sm font-bold text-white animate-pulse-border">
              FREE
            </div>
            <div className="w-full overflow-hidden rounded-xl">
              <iframe
                src="https://docs.google.com/forms/d/e/1FAIpQLSeRLPQoAYD4ycxNMIoU2472RYSm8fOR1WC8zo3PUdRtqs-TUg/viewform?embedded=true"
                width="100%"
                height="1518"
                frameBorder="0"
                marginHeight="0"
                marginWidth="0"
                className="w-full"
                title="26-Day Blueprint Enrollment Form"
              >
                Loading…
              </iframe>
            </div>
          </div>

          <p className="mt-8 text-sm text-gray-400">
            Hit the button and get ready. Simple. And yeah, the 26 days thing? You'll see...😏
          </p>
        </div>
      </section>

      {/* Footer */}
      <SiteFooter />
    </div>
  )
}
