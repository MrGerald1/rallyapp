"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Calendar } from "lucide-react"
import { toast } from "sonner"
import { TaskCard } from "@/components/blueprint/task-card"
import { getActiveBlueprint, getUserBlueprintEnrollment, calculateCurrentDay } from "@/lib/api/blueprint-api"
import type { Blueprint, BlueprintTask, BlueprintTaskProgress } from "@/lib/types/blueprint"

export default function BlueprintDashboardPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [blueprint, setBlueprint] = useState<Blueprint | null>(null)
  const [enrollment, setEnrollment] = useState<any | null>(null)
  const [tasks, setTasks] = useState<(BlueprintTask & { progress?: BlueprintTaskProgress | null })[]>([])
  const [currentDay, setCurrentDay] = useState(0)
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    // Check if user is already logged in
    const storedEmail = localStorage.getItem("rally_user_email")
    if (storedEmail) {
      setEmail(storedEmail)
      verifyEmail(storedEmail)
    } else {
      setIsLoading(false)
    }
  }, [])

  const verifyEmail = async (emailToVerify: string) => {
    setIsVerifying(true)
    setError(null)

    try {
      // Get active blueprint
      const activeBlueprint = await getActiveBlueprint()
      setBlueprint(activeBlueprint)

      // Calculate current day
      const calculatedDay = calculateCurrentDay(activeBlueprint.start_date)
      setCurrentDay(calculatedDay)

      // Get user's enrollment and progress
      try {
        const enrollmentData = await getUserBlueprintEnrollment(activeBlueprint.id, emailToVerify)

        setEnrollment(enrollmentData.enrollment)
        setTasks(enrollmentData.tasks)

        // Store email in localStorage
        localStorage.setItem("rally_user_email", emailToVerify)
      } catch (enrollmentError: any) {
        if (enrollmentError.message.includes("Enrollment not found")) {
          setError("You are not enrolled in the current blueprint. Please enroll first.")
        } else {
          throw enrollmentError
        }
      }
    } catch (error: any) {
      console.error("Error verifying email:", error)
      setError(error.message || "Failed to verify email. Please try again.")
      toast.error(error.message || "Failed to verify email")
    } finally {
      setIsVerifying(false)
      setIsLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      toast.error("Please enter your email address")
      return
    }
    verifyEmail(email)
  }

  const handleTaskCompleted = async () => {
    // Refresh tasks and enrollment data
    if (blueprint && email) {
      try {
        const enrollmentData = await getUserBlueprintEnrollment(blueprint.id, email)

        setEnrollment(enrollmentData.enrollment)
        setTasks(enrollmentData.tasks)

        toast.success("Progress updated!")
      } catch (error: any) {
        console.error("Error refreshing data:", error)
        toast.error("Failed to refresh data")
      }
    }
  }

  // Filter tasks based on active tab
  const filteredTasks = tasks.filter((task) => {
    if (activeTab === "all") return true
    if (activeTab === "completed") return task.progress?.completed
    if (activeTab === "pending") return !task.progress?.completed && task.day_number <= currentDay
    if (activeTab === "upcoming") return task.day_number > currentDay
    return true
  })

  // Calculate progress
  const completedTasks = tasks.filter((task) => task.progress?.completed).length
  const totalTasks = tasks.length
  const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  // If not enrolled or verified, show email verification form
  if (!enrollment) {
    return (
      <div className="container max-w-4xl py-8">
        <Card>
          <CardHeader>
            <CardTitle>Blueprint Dashboard</CardTitle>
            <CardDescription>Enter your email to access your blueprint progress</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </label>
                <div className="flex gap-2">
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    required
                    className="flex-1"
                  />
                  <Button type="submit" disabled={isVerifying}>
                    {isVerifying ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verifying...
                      </>
                    ) : (
                      "Verify"
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter>
            <Button variant="outline" onClick={() => router.push("/blueprint")} className="w-full">
              Back to Blueprint Page
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  // If blueprint hasn't started yet
  if (currentDay < 0 && blueprint) {
    const startDate = new Date(blueprint.start_date)
    const formattedDate = startDate.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })

    return (
      <div className="container max-w-4xl py-8">
        <Card>
          <CardHeader>
            <CardTitle>{blueprint.title}</CardTitle>
            <CardDescription>This blueprint hasn't started yet</CardDescription>
          </CardHeader>
          <CardContent>
            <Alert className="mb-4">
              <Calendar className="h-4 w-4" />
              <AlertTitle>Coming Soon</AlertTitle>
              <AlertDescription>
                This blueprint will start on {formattedDate}. Check back then to start your journey!
              </AlertDescription>
            </Alert>

            <div className="mt-4">
              <h3 className="text-lg font-medium mb-2">Your Project Idea</h3>
              <p className="text-muted-foreground">{enrollment.project_idea}</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" onClick={() => router.push("/blueprint")} className="w-full">
              Back to Blueprint Page
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  // Main dashboard view
  return (
    <div className="container max-w-4xl py-8">
      {blueprint && (
        <>
          <div className="mb-8">
            <h1 className="text-3xl font-bold">{blueprint.title}</h1>
            <p className="text-muted-foreground mt-2">{blueprint.description}</p>

            <div className="mt-4 flex flex-col sm:flex-row gap-4">
              <Card className="flex-1">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>
                        {completedTasks} of {totalTasks} tasks completed
                      </span>
                      <span>{Math.round(progressPercentage)}%</span>
                    </div>
                    <Progress value={progressPercentage} />
                  </div>
                </CardContent>
              </Card>

              <Card className="flex-1">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Current Day</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 mr-2 text-primary" />
                      <span className="text-2xl font-bold">Day {currentDay}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">of {blueprint.duration_days} days</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="mb-4">
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-4 mb-4">
                <TabsTrigger value="all">All Tasks</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="space-y-4">
                {filteredTasks.length === 0 ? (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <p className="text-muted-foreground">No tasks found in this category</p>
                    </CardContent>
                  </Card>
                ) : (
                  filteredTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      enrollmentId={enrollment.id}
                      blueprintId={blueprint.id}
                      isUnlocked={task.day_number <= currentDay}
                      isCurrentDay={task.day_number === currentDay}
                      onTaskCompleted={handleTaskCompleted}
                    />
                  ))
                )}
              </TabsContent>
            </Tabs>
          </div>
        </>
      )}
    </div>
  )
}
