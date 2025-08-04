"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Users, Calendar, Target, Rocket, Play, ArrowRight, Star, Zap } from "lucide-react"
import { getActiveBlueprint, enrollInBlueprint } from "@/lib/api/blueprint-api"
import { toast } from "@/hooks/use-toast"

interface Blueprint {
  id: string
  title: string
  description: string
  duration_days: number
  start_date: string
  whatsapp_link: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export default function BlueprintPage() {
  const [blueprint, setBlueprint] = useState<Blueprint | null>(null)
  const [loading, setLoading] = useState(true)
  const [enrolling, setEnrolling] = useState(false)
  const [enrolled, setEnrolled] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone_number: "",
    project_idea: "",
  })

  const enrollmentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchActiveBlueprint()
  }, [])

  const fetchActiveBlueprint = async () => {
    try {
      const data = await getActiveBlueprint()
      setBlueprint(data)
    } catch (error) {
      console.error("Error fetching active blueprint:", error)
      toast({
        title: "Error",
        description: "Failed to load blueprint information",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const scrollToEnrollment = () => {
    enrollmentRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!blueprint) return

    setEnrolling(true)
    try {
      await enrollInBlueprint(blueprint.id, formData)
      setEnrolled(true)
      toast({
        title: "Success!",
        description: "You've been enrolled in the blueprint. Check your email for next steps.",
      })
    } catch (error) {
      console.error("Error enrolling:", error)
      toast({
        title: "Error",
        description: "Failed to enroll. Please try again.",
        variant: "destructive",
      })
    } finally {
      setEnrolling(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  if (!blueprint) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">No Active Blueprint</h1>
          <p className="text-gray-600">There's no active blueprint available at the moment.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 text-white py-16 sm:py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <Badge className="mb-4 sm:mb-6 bg-white/20 text-white border-white/30 text-sm sm:text-base">
            26-Day Blueprint
          </Badge>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-4 sm:mb-6 leading-tight">
            Stop Dreaming.
            <br />
            <span className="text-yellow-300">Start Building.</span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed">
            The no-BS blueprint that turns your idea into a real business in 26 days. No theory. No fluff. Just action.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              onClick={scrollToEnrollment}
              size="lg"
              className="bg-black hover:bg-gray-800 text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-bold rounded-full transition-all duration-300 transform hover:scale-105"
            >
              I'm Ready to Build <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2 text-sm sm:text-base">
              <Star className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-300 fill-current" />
              <span>Join 500+ builders already enrolled</span>
            </div>
          </div>
        </div>
      </section>

      {/* The Real Talk Section */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4 sm:mb-6">The Real Talk</h2>
            <div className="w-20 h-1 bg-orange-500 mx-auto mb-6 sm:mb-8"></div>
          </div>

          <div className="prose prose-lg sm:prose-xl max-w-none text-gray-800 leading-relaxed space-y-4 sm:space-y-6">
            <p className="text-lg sm:text-xl font-semibold text-center">
              You've been "planning" your startup for months. Maybe years.
            </p>

            <p>
              You've got notebooks full of ideas. Bookmarks of "inspiration." You've watched every Gary Vee video, read
              every Medium article about "10 Steps to Success," and you KNOW you have something good.
            </p>

            <p>
              But here's the brutal truth: <strong>You're stuck in planning hell.</strong>
            </p>

            <p>
              While you're perfecting your business plan, someone else is building. While you're researching "the
              perfect time to start," someone else is launching. While you're waiting for everything to be perfect,
              someone else is making money.
            </p>

            <p className="text-xl sm:text-2xl font-bold text-center text-orange-600">
              The market doesn't care about your perfect plan. It cares about what you BUILD.
            </p>

            <p>
              This blueprint isn't about more planning. It's about building something REAL in 26 days. Something you can
              touch, test, and sell. Something that proves your idea works—or fails fast so you can move on to the next
              one.
            </p>
          </div>

          <div className="text-center mt-8 sm:mt-12">
            <Button
              onClick={scrollToEnrollment}
              size="lg"
              className="bg-black hover:bg-gray-800 text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-bold rounded-full"
            >
              I'm Done Waiting
            </Button>
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-r from-orange-500 to-red-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4 sm:mb-6">Before You Continue, Watch This</h2>
          <p className="text-lg sm:text-xl text-white/90 mb-8 sm:mb-12">
            See exactly what you'll build and why this blueprint works
          </p>

          <div className="relative bg-black rounded-2xl overflow-hidden shadow-2xl mb-8 sm:mb-12">
            <div className="aspect-video">
              <iframe
                src="https://www.youtube.com/embed/TmLtD8aY3x0"
                title="Blueprint Overview"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            </div>
          </div>

          <Button
            onClick={scrollToEnrollment}
            size="lg"
            className="bg-white hover:bg-gray-100 text-orange-600 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-bold rounded-full"
          >
            Ready to Start? Let's Go! <Play className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* The Blueprint Section */}
      <section className="py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4 sm:mb-6">The Blueprint</h2>
            <div className="w-20 h-1 bg-orange-500 mx-auto mb-6 sm:mb-8"></div>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              26 days. 4 phases. 1 goal: Turn your idea into a real business.
            </p>
            <div className="mt-6 sm:mt-8">
              <Button
                onClick={scrollToEnrollment}
                size="lg"
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-bold rounded-full"
              >
                Start the 26 Days <Rocket className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {/* Phase 1 */}
            <Card className="border-2 border-orange-200 hover:border-orange-400 transition-colors">
              <CardContent className="p-4 sm:p-6">
                <div className="text-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-black text-lg sm:text-xl">1</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold mb-2">Validate</h3>
                  <p className="text-sm sm:text-base text-gray-600 mb-4">
                    Days 1-7: Prove people actually want what you're building
                  </p>
                  <Badge variant="outline" className="text-xs sm:text-sm">
                    Week 1
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Phase 2 */}
            <Card className="border-2 border-blue-200 hover:border-blue-400 transition-colors">
              <CardContent className="p-4 sm:p-6">
                <div className="text-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-black text-lg sm:text-xl">2</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold mb-2">Build</h3>
                  <p className="text-sm sm:text-base text-gray-600 mb-4">
                    Days 8-14: Create your minimum viable product
                  </p>
                  <Badge variant="outline" className="text-xs sm:text-sm">
                    Week 2
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Phase 3 */}
            <Card className="border-2 border-green-200 hover:border-green-400 transition-colors">
              <CardContent className="p-4 sm:p-6">
                <div className="text-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-black text-lg sm:text-xl">3</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold mb-2">Test</h3>
                  <p className="text-sm sm:text-base text-gray-600 mb-4">
                    Days 15-21: Get real users and real feedback
                  </p>
                  <Badge variant="outline" className="text-xs sm:text-sm">
                    Week 3
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Phase 4 */}
            <Card className="border-2 border-purple-200 hover:border-purple-400 transition-colors">
              <CardContent className="p-4 sm:p-6">
                <div className="text-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-black text-lg sm:text-xl">4</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold mb-2">Launch</h3>
                  <p className="text-sm sm:text-base text-gray-600 mb-4">Days 22-26: Go live and start making money</p>
                  <Badge variant="outline" className="text-xs sm:text-sm">
                    Week 4
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Your Launch Crew Section */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl font-black mb-4 sm:mb-6">Your Launch Crew</h2>
            <div className="w-20 h-1 bg-orange-500 mx-auto mb-6 sm:mb-8"></div>
          </div>

          <Card className="border-2 border-orange-200 bg-white">
            <CardContent className="p-6 sm:p-8">
              <div className="flex flex-col md:flex-row items-center gap-6 sm:gap-8">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-orange-500 rounded-full flex items-center justify-center">
                    <Users className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
                  </div>
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">You're Not Building Alone</h3>
                  <p className="text-base sm:text-lg text-gray-600 mb-4 sm:mb-6">
                    Join a community of builders who are on the same journey. Share progress, get feedback, and stay
                    accountable. Plus, direct access to mentors who've been there.
                  </p>
                  <Button
                    onClick={scrollToEnrollment}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full"
                  >
                    Find Your People <Users className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Daily Tasks in Rally Section */}
      <section className="py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl font-black mb-4 sm:mb-6">Daily Tasks in Rally</h2>
            <div className="w-20 h-1 bg-orange-500 mx-auto mb-6 sm:mb-8"></div>
          </div>

          <Card className="border-2 border-gray-200 bg-white">
            <CardContent className="p-6 sm:p-8">
              <div className="flex flex-col md:flex-row items-center gap-6 sm:gap-8">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-black rounded-full flex items-center justify-center">
                    <CheckCircle className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
                  </div>
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Never Wonder "What's Next?"</h3>
                  <p className="text-base sm:text-lg text-gray-600 mb-4 sm:mb-6">
                    Every day, you'll get a specific task with clear instructions. No guessing. No overwhelm. Just one
                    focused action that moves you closer to launch.
                  </p>
                  <Button
                    onClick={scrollToEnrollment}
                    className="bg-black hover:bg-gray-800 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full"
                  >
                    Show Me Today's Task <Calendar className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Build and Test Your "Toy" Section */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl font-black mb-4 sm:mb-6">Build and Test Your "Toy"</h2>
            <div className="w-20 h-1 bg-orange-500 mx-auto mb-6 sm:mb-8"></div>
          </div>

          <Card className="border-2 border-green-200 bg-white">
            <CardContent className="p-6 sm:p-8">
              <div className="flex flex-col md:flex-row items-center gap-6 sm:gap-8">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-500 rounded-full flex items-center justify-center">
                    <Zap className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
                  </div>
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Start Small, Think Big</h3>
                  <p className="text-base sm:text-lg text-gray-600 mb-4 sm:mb-6">
                    We call it a "toy" because it's simple, focused, and fun to build. But don't be fooled— this toy
                    will teach you everything about your market, your customers, and your business.
                  </p>
                  <Button
                    onClick={scrollToEnrollment}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full"
                  >
                    Test the Idea Fast <Target className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Weekly Check-ins & Demo Day Section */}
      <section className="py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl font-black mb-4 sm:mb-6">Weekly Check-ins & Demo Day</h2>
            <div className="w-20 h-1 bg-orange-500 mx-auto mb-6 sm:mb-8"></div>
          </div>

          <Card className="border-2 border-orange-200 bg-white">
            <CardContent className="p-6 sm:p-8">
              <div className="flex flex-col md:flex-row items-center gap-6 sm:gap-8">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-orange-500 rounded-full flex items-center justify-center">
                    <Calendar className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
                  </div>
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Stay on Track</h3>
                  <p className="text-base sm:text-lg text-gray-600 mb-4 sm:mb-6">
                    Every week, we'll check in as a group. Share your progress, get unstuck, and see what others are
                    building. Plus, demo day at the end where you show off what you've created.
                  </p>
                  <Button
                    onClick={scrollToEnrollment}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full"
                  >
                    I'll Be There <CheckCircle className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* The Outcome Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-purple-600 via-blue-600 to-green-500 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-6 sm:mb-8">The Outcome</h2>
          <div className="w-20 h-1 bg-white mx-auto mb-8 sm:mb-12"></div>

          <div className="space-y-6 sm:space-y-8 mb-8 sm:mb-12">
            <p className="text-lg sm:text-xl md:text-2xl font-semibold">In 26 days, you'll have:</p>

            <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 text-left">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-green-300 flex-shrink-0 mt-1" />
                <span className="text-base sm:text-lg">A real product that people can use</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-green-300 flex-shrink-0 mt-1" />
                <span className="text-base sm:text-lg">Actual customers giving you feedback</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-green-300 flex-shrink-0 mt-1" />
                <span className="text-base sm:text-lg">Proof that your idea works (or doesn't)</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-green-300 flex-shrink-0 mt-1" />
                <span className="text-base sm:text-lg">The confidence to scale or pivot</span>
              </div>
            </div>

            <p className="text-lg sm:text-xl font-semibold">
              Most importantly: You'll have broken the cycle of endless planning and started BUILDING.
            </p>
          </div>

          <Button
            onClick={scrollToEnrollment}
            size="lg"
            className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-black rounded-full transform hover:scale-105 transition-all duration-300"
          >
            Let's Launch This <Rocket className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Enrollment Form */}
      <section ref={enrollmentRef} className="py-16 sm:py-20 bg-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl font-black mb-4 sm:mb-6">Ready to Build?</h2>
            <div className="w-20 h-1 bg-orange-500 mx-auto mb-6 sm:mb-8"></div>
            <p className="text-lg sm:text-xl text-gray-600">
              Join the 26-day blueprint and turn your idea into reality.
            </p>
          </div>

          {enrolled ? (
            <Card className="border-2 border-green-200 bg-green-50">
              <CardContent className="p-6 sm:p-8 text-center">
                <CheckCircle className="h-12 w-12 sm:h-16 sm:w-16 text-green-500 mx-auto mb-4 sm:mb-6" />
                <h3 className="text-xl sm:text-2xl font-bold text-green-800 mb-3 sm:mb-4">You're In!</h3>
                <p className="text-base sm:text-lg text-green-700">
                  Welcome to the blueprint! Check your email for next steps and join our community.
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-2 border-orange-200">
              <CardContent className="p-6 sm:p-8">
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full"
                      placeholder="Your full name"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <Input
                      id="phone_number"
                      name="phone_number"
                      type="tel"
                      required
                      value={formData.phone_number}
                      onChange={handleInputChange}
                      className="w-full"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>

                  <div>
                    <label htmlFor="project_idea" className="block text-sm font-medium text-gray-700 mb-2">
                      What's Your Project Idea? *
                    </label>
                    <Textarea
                      id="project_idea"
                      name="project_idea"
                      required
                      value={formData.project_idea}
                      onChange={handleInputChange}
                      className="w-full"
                      rows={4}
                      placeholder="Describe your project idea in a few sentences..."
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={enrolling}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 sm:py-4 text-base sm:text-lg font-bold rounded-full"
                  >
                    {enrolling ? "Enrolling..." : "Start My 26-Day Journey"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    </div>
  )
}
