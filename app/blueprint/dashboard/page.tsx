"use client"

import type React from "react"

import { useEffect, useState, useCallback } from "react"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import type { BlueprintTask } from "@/lib/models/blueprint"
import { BlueprintTaskCard } from "@/components/blueprint/task-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Calendar, ArrowLeft, Mail, Twitter, RefreshCw } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import Link from "next/link"

interface BlueprintData {
  blueprint: any
  enrollment: any
  tasks: BlueprintTask[]
  completedCount: number
  totalCount: number
  currentDay: number
  hasStarted: boolean
}

export default function BlueprintDashboardPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [blueprintData, setBlueprintData] = useState<BlueprintData>({
    blueprint: null,
    enrollment: null,
    tasks: [],
    completedCount: 0,
    totalCount: 0,
    currentDay: 0,
    hasStarted: false,
  })
  const [activeTab, setActiveTab] = useState("current")
  const [notEnrolled, setNotEnrolled] = useState(false)
  const [emailVerified, setEmailVerified] = useState(false)
  const [emailInput, setEmailInput] = useState("")
  const [verifyingEmail, setVerifyingEmail] = useState(false)

  const { blueprint, enrollment, tasks, completedCount, totalCount, currentDay, hasStarted } = blueprintData

  useEffect(() => {
    const storedEmail = localStorage.getItem("rally_user_email")
    if (storedEmail) {
      setEmailInput(storedEmail)
      verifyEmail(storedEmail)
    } else {
      setIsLoading(false)
    }
  }, [])

  const fetchBlueprintData = useCallback(async (email: string): Promise<BlueprintData> => {
    // Fetch the active blueprint
    const blueprintResponse = await fetch("/api/blueprints/active")
    if (!blueprintResponse.ok) {
      throw new Error("Failed to fetch active blueprint")
    }
    const blueprintData = await blueprintResponse.json()

    if (!blueprintData || !blueprintData.id) {
      throw new Error("No active blueprint found")
    }

    const blueprintId = blueprintData.id
    const startDate = blueprintData.start_date ? new Date(blueprintData.start_date) : null
    const today = new Date()
    const blueprintHasStarted = startDate ? today >= startDate : false

    // Check if user is enrolled
    const checkResponse = await fetch(
      `/api/blueprints/${blueprintId}/check-enrollment?email=${encodeURIComponent(email)}`,
    )
    const checkData = await checkResponse.json()

    if (!checkData.enrolled) {
      setNotEnrolled(true)
      setEmailVerified(false)
      throw new Error("Email not found in enrollment records")
    }

    // User is enrolled, fetch their progress
    const response = await fetch(`/api/blueprints/${blueprintId}/progress?email=${encodeURIComponent(email)}`)
    if (!response.ok) {
      throw new Error("Failed to fetch progress")
    }

    const data = await response.json()

    return {
      blueprint: blueprintData,
      enrollment: data.enrollment,
      tasks: data.tasks || [],
      completedCount: data.completedCount || 0,
      totalCount: data.totalCount || 0,
      currentDay: data.currentDay,
      hasStarted: blueprintHasStarted,
    }
  }, [])

  const verifyEmail = async (email: string) => {
    try {
      setVerifyingEmail(true)
      const data = await fetchBlueprintData(email)
      setBlueprintData(data)
      localStorage.setItem("rally_user_email", email)
      setEmailVerified(true)
      return true
    } catch (error: any) {
      console.error("Error verifying email:", error)
      setError(error.message || "Failed to verify your enrollment")
      toast.error("Failed to verify your enrollment. Please try again.")
      return false
    } finally {
      setVerifyingEmail(false)
      setIsLoading(false)
    }
  }

  const refreshProgress = async () => {
    if (!emailVerified || !emailInput || !blueprint?.id) return

    try {
      setIsRefreshing(true)
      const data = await fetchBlueprintData(emailInput)
      setBlueprintData(data)
      toast.success("Progress refreshed")
    } catch (error: any) {
      console.error("Error refreshing progress:", error)
      toast.error("Failed to refresh progress")
    } finally {
      setIsRefreshing(false)
    }
  }

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!emailInput.trim()) {
      toast.error("Please enter your email address")
      return
    }
    await verifyEmail(emailInput)
  }

  const handleTaskComplete = async (taskId: string, submissionData: any) => {
    try {
      if (!emailVerified || !emailInput) {
        toast.error("Please verify your email to mark tasks as complete")
        return
      }

      if (!blueprint?.id) {
        toast.error("Blueprint not found")
        return
      }

      const response = await fetch(`/api/blueprints/${blueprint.id}/tasks/${taskId}/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: emailInput,
          submission_data: submissionData,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to mark task as complete")
      }

      // Update the local state
      setBlueprintData((prev) => ({
        ...prev,
        tasks: prev.tasks.map((task) => {
          if (task.id === taskId) {
            return {
              ...task,
              progress: {
                ...task.progress,
                completed: true,
                completion_date: new Date().toISOString(),
                submission_data: submissionData,
              },
            }
          }
          return task
        }),
        completedCount: prev.completedCount + 1,
      }))

      toast.success("Task completed successfully!")
      await refreshProgress()
    } catch (error: any) {
      console.error("Error completing task:", error)
      toast.error(error.message || "Failed to mark task as complete")
    }
  }

  // Email verification form
  if (!emailVerified && !isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <main className="container mx-auto max-w-md px-4 py-8">
          <Button variant="ghost" className="mb-6" onClick={() => router.push("/blueprint")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blueprint
          </Button>

          <Card>
            <CardHeader>
              <CardTitle>Verify Your Enrollment</CardTitle>
              <CardDescription>Please enter the email address you used to enroll in the blueprint.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email Address
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={verifyingEmail}>
                  {verifyingEmail ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verifying...
                    </>
                  ) : (
                    "Access Dashboard"
                  )}
                </Button>

                {notEnrolled && (
                  <div className="mt-4 text-center text-sm text-red-500">
                    <p>This email is not enrolled in the active blueprint.</p>
                    <Button variant="link" className="p-0 h-auto text-sm" onClick={() => router.push("/blueprint")}>
                      Enroll now
                    </Button>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <main className="container mx-auto max-w-4xl px-4 py-8">
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="mt-4 text-muted-foreground">Loading your blueprint progress...</p>
          </div>
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <main className="container mx-auto max-w-4xl px-4 py-8">
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-red-500">{error}</p>
            <Button className="mt-4" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </main>
      </div>
    )
  }

  // Blueprint hasn't started yet - show holding page
  if (!hasStarted && blueprint) {
    const startDate = blueprint.start_date ? new Date(blueprint.start_date) : new Date()
    const formattedDate = startDate.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })

    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <main className="container mx-auto max-w-4xl px-4 py-8">
          <Button variant="ghost" className="mb-6" onClick={() => router.push("/")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl">You're Enrolled in the {blueprint.title || "Blueprint"}!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="rounded-lg bg-primary/10 p-6 text-center">
                <h2 className="text-xl font-bold mb-4">The Blueprint Starts on {formattedDate}</h2>
                <p className="mb-4">
                  Thank you for enrolling! Your journey will begin soon. We'll notify you when the first tasks are
                  available.
                </p>
                <div className="rounded-lg bg-white p-4 mb-4">
                  <h3 className="font-semibold mb-2">Your Project Idea</h3>
                  <p className="text-sm">{enrollment?.project_idea || "No project idea specified"}</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  Make sure to check your email and join our community for updates and announcements.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4 flex flex-col items-center text-center">
                    <Mail className="h-8 w-8 text-primary mb-2" />
                    <h3 className="font-medium">Check Your Email</h3>
                    <p className="text-sm text-muted-foreground mt-2">
                      We'll send important updates to your registered email address.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 flex flex-col items-center text-center">
                    <Twitter className="h-8 w-8 text-primary mb-2" />
                    <h3 className="font-medium">Follow Us</h3>
                    <p className="text-sm text-muted-foreground mt-2">
                      Get the latest news and updates on our social media.
                    </p>
                    <div className="flex space-x-4 mt-2">
                      <Link href="https://twitter.com/rallyafrica" target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="sm">
                          Twitter
                        </Button>
                      </Link>
                      <Link href="https://instagram.com/rallyafrica" target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="sm">
                          Instagram
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 flex flex-col items-center text-center">
                    <Calendar className="h-8 w-8 text-primary mb-2" />
                    <h3 className="font-medium">Mark Your Calendar</h3>
                    <p className="text-sm text-muted-foreground mt-2">
                      The blueprint starts on {formattedDate}. Set a reminder!
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="flex justify-center">
                <Link href="https://chat.whatsapp.com/E4eiorCbLb04GyqqKiB2M9" target="_blank" rel="noopener noreferrer">
                  <Button className="mt-4">Join Our Community</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  // Filter tasks based on the active tab
  const filteredTasks = tasks
    .filter((task) => {
      if (activeTab === "current") {
        return task.day_number === currentDay
      } else if (activeTab === "completed") {
        return task.progress?.completed
      } else if (activeTab === "upcoming") {
        return task.day_number > currentDay && task.day_number <= currentDay + 2
      } else if (activeTab === "all") {
        return task.day_number <= currentDay
      }
      return false
    })
    .sort((a, b) => {
      return activeTab === "all" ? b.day_number - a.day_number : a.day_number - b.day_number
    })

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="container mx-auto max-w-4xl px-4 py-8">
        <Button variant="ghost" className="mb-6" onClick={() => router.push("/")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold">{blueprint?.title || "26-Day Idea Launch Blueprint"}</h1>
          <p className="text-muted-foreground">
            Your daily tasks to bring your idea to life in {blueprint?.duration_days || 26} days.
          </p>
        </div>

        {/* Progress Overview */}
        <Card className="mb-8">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle>Your Progress</CardTitle>
            <Button variant="ghost" size="sm" onClick={refreshProgress} disabled={isRefreshing} className="h-8 px-2">
              <RefreshCw className={`h-4 w-4 mr-1 ${isRefreshing ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    Day {currentDay} of {blueprint?.duration_days || 26}
                  </span>
                  <span className="text-sm font-medium">
                    {completedCount} / {totalCount} tasks completed
                  </span>
                </div>
                <Progress value={(completedCount / totalCount) * 100} className="h-2 mt-2" />
              </div>

              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-primary" />
                <span className="text-sm">
                  Started on {new Date(blueprint?.start_date || new Date()).toLocaleDateString()}
                </span>
              </div>

              <div className="rounded-lg bg-primary/10 p-4">
                <h3 className="font-semibold">Your Project Idea</h3>
                <p className="text-sm mt-1">{enrollment?.project_idea || "No project idea specified"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tasks Tabs */}
        <Tabs defaultValue="current" value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="current">Today's Task</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="all">All Tasks</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-4">
            {filteredTasks.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <p className="text-muted-foreground">
                    {activeTab === "current"
                      ? "No task for today. Check back tomorrow!"
                      : activeTab === "completed"
                        ? "You haven't completed any tasks yet."
                        : activeTab === "upcoming"
                          ? "No upcoming tasks available yet."
                          : "No tasks available."}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {filteredTasks.map((task) => (
                  <BlueprintTaskCard key={task.id} task={task} onComplete={handleTaskComplete} userEmail={emailInput} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
