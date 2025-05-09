"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, ArrowRight } from "lucide-react"
import Link from "next/link"

interface UserProgressProps {
  userEmail: string
  blueprintId: string
}

export function UserProgress({ userEmail, blueprintId }: UserProgressProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [progress, setProgress] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const response = await fetch(`/api/blueprints/${blueprintId}/progress?email=${encodeURIComponent(userEmail)}`)

        if (!response.ok) {
          throw new Error("Failed to fetch progress")
        }

        const data = await response.json()
        setProgress(data)
      } catch (error: any) {
        console.error("Error fetching progress:", error)
        setError(error.message || "Failed to load your progress")
      } finally {
        setIsLoading(false)
      }
    }

    fetchProgress()
  }, [userEmail, blueprintId])

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Progress</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-6">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">{error}</p>
        </CardContent>
      </Card>
    )
  }

  if (!progress || !progress.enrollment) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">You are not enrolled in this blueprint.</p>
          <Button asChild>
            <Link href="/blueprint">
              Enroll Now <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  const { enrollment, tasks, completedCount, totalCount } = progress
  const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0

  // Update the return statement to correctly display the current day
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Progress</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">
              Day {enrollment.current_day || 1} of {totalCount}
            </span>
            <span className="text-sm font-medium">
              {completedCount} / {totalCount} tasks completed
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2 mt-2" />
        </div>

        <div className="flex items-center space-x-2">
          <Clock className="h-5 w-5 text-primary" />
          <span className="text-sm">Started on {new Date(enrollment.start_date).toLocaleDateString()}</span>
        </div>

        <div className="rounded-lg bg-primary/10 p-4">
          <h3 className="font-semibold">Your Project Idea</h3>
          <p className="text-sm mt-1">{enrollment.project_idea}</p>
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold">Recent Tasks</h3>
          {tasks.slice(0, 3).map((task: any) => (
            <div key={task.id} className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium">
                    Day {task.day_number}: {task.title}
                  </span>
                  {task.progress?.completed && (
                    <Badge className="bg-green-500">
                      <CheckCircle className="mr-1 h-3 w-3" /> Completed
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">{task.skill_focus}</p>
              </div>
              {!task.progress?.completed && (
                <Button size="sm" asChild>
                  <Link href={`/blueprint/dashboard?day=${task.day_number}`}>View</Link>
                </Button>
              )}
            </div>
          ))}
        </div>

        <Button className="w-full" asChild>
          <Link href="/blueprint/dashboard">
            Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}
