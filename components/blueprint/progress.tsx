"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { useUserProgress } from "@/lib/hooks/use-blueprint"
import { Calendar, Award, ArrowRight } from "lucide-react"
import Link from "next/link"

interface BlueprintProgressProps {
  userEmail: string
}

export function BlueprintProgress({ userEmail }: BlueprintProgressProps) {
  const { enrollments, isLoading, error } = useUserProgress(userEmail)

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (!enrollments || enrollments.length === 0) {
    return (
      <Alert>
        <AlertTitle>No Enrollments</AlertTitle>
        <AlertDescription>You are not enrolled in any blueprints yet.</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Your Blueprints</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {enrollments.map((enrollment) => (
          <Card key={enrollment.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle>{enrollment.blueprint.title}</CardTitle>
              <CardDescription>{enrollment.status === "completed" ? "Completed" : "In Progress"}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{Math.round(enrollment.progress.percentage)}%</span>
                </div>
                <Progress value={enrollment.progress.percentage} className="h-2" />
                <div className="text-sm text-muted-foreground">
                  {enrollment.progress.completed} of {enrollment.progress.total} tasks completed
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-primary" />
                  <span className="text-sm">Day {enrollment.current_day}</span>
                </div>
                <div className="flex items-center">
                  <Award className="h-5 w-5 mr-2 text-primary" />
                  <span className="text-sm">{enrollment.total_points || 0} points</span>
                </div>
              </div>

              <Link
                href={`/blueprint/dashboard?id=${enrollment.blueprint_id}`}
                className="flex items-center text-primary hover:underline text-sm mt-2"
              >
                View Dashboard <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
