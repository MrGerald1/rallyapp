"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Loader2 } from "lucide-react"

interface BlueprintStatsProps {
  blueprintId: string
}

export function BlueprintStats({ blueprintId }: BlueprintStatsProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const response = await fetch(`/api/blueprints/${blueprintId}/stats`)

        if (!response.ok) {
          throw new Error("Failed to fetch blueprint statistics")
        }

        const data = await response.json()
        setStats(data)
      } catch (error: any) {
        console.error("Error fetching blueprint stats:", error)
        setError(error.message || "Failed to load statistics")
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [blueprintId])

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Blueprint Statistics</CardTitle>
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
          <CardTitle>Blueprint Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">{error}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Blueprint Statistics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg bg-primary/5 p-4">
            <h3 className="text-lg font-bold">{stats.total_enrollments}</h3>
            <p className="text-sm text-muted-foreground">Total Enrollments</p>
          </div>
          <div className="rounded-lg bg-primary/5 p-4">
            <h3 className="text-lg font-bold">{stats.average_completion_rate.toFixed(1)}%</h3>
            <p className="text-sm text-muted-foreground">Average Completion Rate</p>
          </div>
        </div>

        <div>
          <h3 className="mb-2 font-medium">Daily Completion Rates</h3>
          <div className="space-y-2">
            {stats.daily_completion_rates.map((day: any) => (
              <div key={day.day} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Day {day.day}</span>
                  <span className="text-sm">{day.completion_rate.toFixed(1)}%</span>
                </div>
                <Progress value={day.completion_rate} className="h-2" />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
