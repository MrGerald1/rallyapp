"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, ArrowLeft, Calendar, Mail, Phone } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"

export default function UserDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [enrollment, setEnrollment] = useState<any>(null)
  const [tasks, setTasks] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("details")

  useEffect(() => {
    const fetchEnrollmentDetails = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const response = await fetch(`/api/enrollments/${params.id}`)

        if (!response.ok) {
          throw new Error("Failed to fetch enrollment details")
        }

        const data = await response.json()
        setEnrollment(data.enrollment)
        setTasks(data.tasks || [])
      } catch (error: any) {
        console.error("Error fetching enrollment details:", error)
        setError(error.message || "Failed to load enrollment details")
        toast.error("Failed to load enrollment details")
      } finally {
        setIsLoading(false)
      }
    }

    fetchEnrollmentDetails()
  }, [params.id])

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error || !enrollment) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="text-red-500">{error || "Enrollment not found"}</p>
          <Button className="mt-4" onClick={() => router.push("/admin/users")}>
            Back to Users
          </Button>
        </CardContent>
      </Card>
    )
  }

  const completedTasks = tasks.filter((task) => task.progress?.completed).length
  const progressPercentage = tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0

  return (
    <div>
      <Button variant="ghost" className="mb-6" onClick={() => router.push("/admin/users")}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Users
      </Button>

      <div className="mb-6">
        <h2 className="text-2xl font-bold">{enrollment.user_email}</h2>
        <p className="text-muted-foreground">Enrolled on {new Date(enrollment.start_date).toLocaleDateString()}</p>
      </div>

      <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3">
          <TabsTrigger value="details">User Details</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="submissions">Submissions</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>User Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium">Email</h3>
                  <div className="flex items-center mt-1">
                    <Mail className="h-4 w-4 text-muted-foreground mr-2" />
                    <a href={`mailto:${enrollment.user_email}`} className="text-primary hover:underline">
                      {enrollment.user_email}
                    </a>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Phone</h3>
                  <div className="flex items-center mt-1">
                    <Phone className="h-4 w-4 text-muted-foreground mr-2" />
                    <span>{enrollment.phone_number}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium">Blueprint</h3>
                <p className="mt-1">{enrollment.blueprint?.title || "Unknown Blueprint"}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium">Project Idea</h3>
                <p className="mt-1 text-muted-foreground">{enrollment.project_idea}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="progress" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Blueprint Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">
                    Day {enrollment.current_day} of {enrollment.blueprint?.duration_days || 26}
                  </span>
                  <span className="text-sm font-medium">
                    {completedTasks} / {tasks.length} tasks completed
                  </span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
              </div>

              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-primary" />
                <span className="text-sm">Started on {new Date(enrollment.start_date).toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="submissions" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Task Submissions</CardTitle>
            </CardHeader>
            <CardContent>
              {tasks.filter((task) => task.progress?.completed).length === 0 ? (
                <p className="text-center py-6 text-muted-foreground">No task submissions yet.</p>
              ) : (
                <div className="space-y-4">
                  {tasks
                    .filter((task) => task.progress?.completed)
                    .map((task) => (
                      <div key={task.id} className="border rounded-lg p-4">
                        <h3 className="font-medium">{task.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                        <div className="mt-2">
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                            Completed on {new Date(task.progress.completion_date).toLocaleDateString()}
                          </span>
                        </div>
                        {task.progress.submission_data && (
                          <div className="mt-3 bg-muted/30 p-3 rounded-md">
                            <h4 className="text-sm font-medium mb-1">Submission:</h4>
                            {typeof task.progress.submission_data === "object" ? (
                              <div className="text-sm">
                                {Object.entries(task.progress.submission_data).map(([key, value]) => (
                                  <div key={key} className="mb-1">
                                    <strong>{key}:</strong>{" "}
                                    {typeof value === "string" && value.startsWith("http") ? (
                                      <a
                                        href={value}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary hover:underline"
                                      >
                                        {value}
                                      </a>
                                    ) : (
                                      String(value)
                                    )}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-sm">{JSON.stringify(task.progress.submission_data)}</p>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
