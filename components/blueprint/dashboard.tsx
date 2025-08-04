"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { TaskCard } from "@/components/blueprint/task-card"
import { useEnrollment, useBlueprint } from "@/lib/hooks/use-blueprint"
import { Calendar, Award, CheckCircle, AlertCircle } from "lucide-react"

interface BlueprintDashboardProps {
  blueprintId: string
  userEmail: string
}

export function BlueprintDashboard({ blueprintId, userEmail }: BlueprintDashboardProps) {
  const [activeTab, setActiveTab] = useState("current")
  const { blueprint, isLoading: blueprintLoading } = useBlueprint(blueprintId)
  const {
    isEnrolled,
    enrollment,
    tasks,
    isLoading: enrollmentLoading,
    error,
    completeTask,
  } = useEnrollment(blueprintId, userEmail)

  const isLoading = blueprintLoading || enrollmentLoading

  // Group tasks by status
  const completedTasks = tasks.filter((task) => task.progress?.completed)
  const incompleteTasks = tasks.filter((task) => !task.progress?.completed)
  const currentDay = enrollment?.current_day || 1
  const currentTasks = incompleteTasks.filter((task) => task.day_number === currentDay)
  const upcomingTasks = incompleteTasks.filter((task) => task.day_number > currentDay)

  // Calculate progress
  const totalTasks = tasks.length
  const completedTaskCount = completedTasks.length
  const progressPercentage = totalTasks > 0 ? (completedTaskCount / totalTasks) * 100 : 0

  const handleTaskCompleted = () => {
    // This will be called after a task is completed
    // The useEnrollment hook will automatically refresh the data
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-32 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    )
  }

  if (!isEnrolled || !enrollment) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Not Enrolled</AlertTitle>
        <AlertDescription>You are not enrolled in this blueprint.</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{blueprint?.title}</h1>
        <p className="text-muted-foreground">{blueprint?.description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Progress</CardTitle>
            <CardDescription>Your blueprint completion</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Progress value={progressPercentage} className="h-2" />
              <div className="flex justify-between text-sm">
                <span>
                  {completedTaskCount} of {totalTasks} tasks completed
                </span>
                <span>{Math.round(progressPercentage)}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Current Day</CardTitle>
            <CardDescription>Your progress timeline</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center">
            <Calendar className="h-8 w-8 mr-3 text-primary" />
            <div>
              <div className="text-2xl font-bold">Day {currentDay}</div>
              <div className="text-sm text-muted-foreground">of {blueprint?.duration_days || tasks.length} days</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Achievements</CardTitle>
            <CardDescription>Your completed milestones</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center">
            <Award className="h-8 w-8 mr-3 text-primary" />
            <div>
              <div className="text-2xl font-bold">{completedTaskCount}</div>
              <div className="text-sm text-muted-foreground">tasks completed</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="current">
            Today&apos;s Tasks{" "}
            {currentTasks.length > 0 && <span className="ml-1 text-xs">({currentTasks.length})</span>}
          </TabsTrigger>
          <TabsTrigger value="upcoming">
            Upcoming {upcomingTasks.length > 0 && <span className="ml-1 text-xs">({upcomingTasks.length})</span>}
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed {completedTasks.length > 0 && <span className="ml-1 text-xs">({completedTasks.length})</span>}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="current" className="space-y-4">
          {currentTasks.length > 0 ? (
            currentTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                enrollmentId={enrollment.id}
                blueprintId={blueprintId}
                isUnlocked={true}
                isCurrentDay={true}
                onTaskCompleted={handleTaskCompleted}
              />
            ))
          ) : (
            <Card>
              <CardContent className="pt-6 text-center">
                <CheckCircle className="h-12 w-12 mx-auto text-primary mb-2" />
                <h3 className="text-lg font-medium">All caught up!</h3>
                <p className="text-muted-foreground">You've completed all tasks for today.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-4">
          {upcomingTasks.length > 0 ? (
            upcomingTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                enrollmentId={enrollment.id}
                blueprintId={blueprintId}
                isUnlocked={false}
                isCurrentDay={false}
                onTaskCompleted={handleTaskCompleted}
              />
            ))
          ) : (
            <Card>
              <CardContent className="pt-6 text-center">
                <CheckCircle className="h-12 w-12 mx-auto text-primary mb-2" />
                <h3 className="text-lg font-medium">No upcoming tasks</h3>
                <p className="text-muted-foreground">You've reached the end of this blueprint.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completedTasks.length > 0 ? (
            completedTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                enrollmentId={enrollment.id}
                blueprintId={blueprintId}
                isUnlocked={true}
                isCurrentDay={false}
                onTaskCompleted={handleTaskCompleted}
              />
            ))
          ) : (
            <Card>
              <CardContent className="pt-6 text-center">
                <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                <h3 className="text-lg font-medium">No completed tasks yet</h3>
                <p className="text-muted-foreground">Start with today's tasks to make progress.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
