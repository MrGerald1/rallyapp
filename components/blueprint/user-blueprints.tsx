"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Loader2, ArrowRight } from "lucide-react"
import Link from "next/link"

interface UserBlueprintsProps {
  userEmail: string
}

export function UserBlueprints({ userEmail }: UserBlueprintsProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [enrollments, setEnrollments] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchEnrollments = async () => {
      if (!userEmail) return

      try {
        setIsLoading(true)
        setError(null)

        const response = await fetch(`/api/blueprints/progress?email=${encodeURIComponent(userEmail)}`)

        if (!response.ok) {
          throw new Error("Failed to fetch enrollments")
        }

        const data = await response.json()
        setEnrollments(data)
      } catch (error: any) {
        console.error("Error fetching enrollments:", error)
        setError(error.message || "Failed to load your enrollments")
      } finally {
        setIsLoading(false)
      }
    }

    fetchEnrollments()
  }, [userEmail])

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Blueprints</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-6">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Blueprints</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">{error}</p>
          <Button className="mt-4" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (enrollments.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Blueprints</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">You haven't enrolled in any blueprints yet.</p>
          <Button asChild>
            <Link href="/blueprint">
              Explore Blueprints <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Blueprints</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {enrollments.map((enrollment) => {
          const blueprint = enrollment.blueprint
          const completedCount = enrollment.progress?.filter((p: any) => p.completed).length || 0
          const totalCount = enrollment.progress?.length || blueprint.duration_days
          const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0

          return (
            <div key={enrollment.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">{blueprint.title}</h3>
                <span className="text-sm text-muted-foreground">
                  Day {enrollment.current_day} of {blueprint.duration_days}
                </span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {completedCount} of {totalCount} tasks completed
                </span>
                <Button size="sm" asChild>
                  <Link href="/blueprint/dashboard">Continue</Link>
                </Button>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
