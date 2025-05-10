"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { BlueprintTask } from "@/lib/types"
import { TaskForm } from "@/components/blueprint/task-form"
import { Loader2, ArrowLeft, Plus, Edit, Trash, Calendar } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { calculateCurrentDay } from "@/lib/blueprint-api"

export default function BlueprintTasksPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [blueprint, setBlueprint] = useState<any>(null)
  const [tasks, setTasks] = useState<BlueprintTask[]>([])
  const [editingTask, setEditingTask] = useState<BlueprintTask | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentDay, setCurrentDay] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        setError(null)
        console.log("Fetching blueprint and tasks data...")

        // Fetch blueprint details with error handling
        const blueprintResponse = await fetch(`/api/blueprints/${params.id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            // Add cache busting
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
            Expires: "0",
          },
        })

        if (!blueprintResponse.ok) {
          console.error("Blueprint response error:", blueprintResponse.status)
          const errorText = await blueprintResponse.text()
          console.error("Error response:", errorText)
          let errorData
          try {
            errorData = JSON.parse(errorText)
          } catch (e) {
            errorData = { error: `Failed to fetch blueprint: ${blueprintResponse.status}` }
          }
          throw new Error(errorData.error || `Failed to fetch blueprint: ${blueprintResponse.status}`)
        }

        const blueprintData = await blueprintResponse.json()
        console.log("Fetched blueprint:", blueprintData)
        setBlueprint(blueprintData)

        // Calculate current day based on blueprint start date
        if (blueprintData.start_date) {
          const calculatedDay = calculateCurrentDay(blueprintData.start_date)
          console.log(`Calculated current day: ${calculatedDay} for blueprint starting on ${blueprintData.start_date}`)
          setCurrentDay(calculatedDay)
        }

        // Fetch tasks with error handling
        const tasksResponse = await fetch(`/api/blueprints/${params.id}/tasks`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            // Add cache busting
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
            Expires: "0",
          },
        })

        if (!tasksResponse.ok) {
          console.error("Tasks response error:", tasksResponse.status)
          const errorText = await tasksResponse.text()
          console.error("Error response:", errorText)
          let errorData
          try {
            errorData = JSON.parse(errorText)
          } catch (e) {
            errorData = { error: `Failed to fetch tasks: ${tasksResponse.status}` }
          }
          throw new Error(errorData.error || `Failed to fetch tasks: ${tasksResponse.status}`)
        }

        const tasksData = await tasksResponse.json()
        console.log("Fetched tasks:", tasksData)
        setTasks(tasksData)
      } catch (error: any) {
        console.error("Error fetching data:", error)
        setError(error.message || "Failed to load data")
        toast.error("Failed to load blueprint tasks: " + (error.message || "Unknown error"))
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [params.id])

  const handleCreateTask = async (taskData: Partial<BlueprintTask>) => {
    try {
      console.log("Creating task:", taskData)

      const response = await fetch(`/api/blueprints/${params.id}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(taskData),
      })

      if (!response.ok) {
        const errorText = await response.text()
        let data
        try {
          data = JSON.parse(errorText)
        } catch (e) {
          data = { error: `Failed to create task: ${response.status}` }
        }
        console.error("Error response:", data)
        throw new Error(data.error || "Failed to create task")
      }

      const newTask = await response.json()
      console.log("Created task:", newTask)
      setTasks((prev) => [...prev, newTask])
      setIsCreating(false)
      toast.success("Task created successfully")
    } catch (error: any) {
      console.error("Error creating task:", error)
      toast.error(error.message || "Failed to create task")
    }
  }

  const handleUpdateTask = async (taskData: Partial<BlueprintTask>) => {
    if (!editingTask) return

    try {
      console.log("Updating task:", taskData)

      const response = await fetch(`/api/blueprints/${params.id}/tasks/${editingTask.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(taskData),
      })

      if (!response.ok) {
        const errorText = await response.text()
        let data
        try {
          data = JSON.parse(errorText)
        } catch (e) {
          data = { error: `Failed to update task: ${response.status}` }
        }
        console.error("Error response:", data)
        throw new Error(data.error || "Failed to update task")
      }

      const updatedTask = await response.json()
      console.log("Updated task:", updatedTask)
      setTasks((prev) => prev.map((task) => (task.id === updatedTask.id ? updatedTask : task)))
      setEditingTask(null)
      toast.success("Task updated successfully")
    } catch (error: any) {
      console.error("Error updating task:", error)
      toast.error(error.message || "Failed to update task")
    }
  }

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm("Are you sure you want to delete this task?")) {
      return
    }

    try {
      console.log("Deleting task:", taskId)

      const response = await fetch(`/api/blueprints/${params.id}/tasks/${taskId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorText = await response.text()
        let data
        try {
          data = JSON.parse(errorText)
        } catch (e) {
          data = { error: `Failed to delete task: ${response.status}` }
        }
        console.error("Error response:", data)
        throw new Error(data.error || "Failed to delete task")
      }

      console.log("Task deleted successfully")
      setTasks((prev) => prev.filter((task) => task.id !== taskId))
      toast.success("Task deleted successfully")
    } catch (error: any) {
      console.error("Error deleting task:", error)
      toast.error(error.message || "Failed to delete task")
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error || !blueprint) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-red-500">{error || "Blueprint not found"}</p>
        <Button className="mt-4" onClick={() => router.push("/admin/blueprints")}>
          Back to Blueprints
        </Button>
      </div>
    )
  }

  // Format the start date
  const startDate = blueprint.start_date ? new Date(blueprint.start_date) : new Date()
  const formattedDate = startDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <>
      <Button variant="ghost" className="mb-6" asChild>
        <Link href="/admin/blueprints">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Blueprints
        </Link>
      </Button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold">{blueprint.title}: Tasks</h1>
        <p className="text-muted-foreground">Manage the daily tasks for this blueprint</p>
        <div className="flex items-center mt-2 space-x-4">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Started on {formattedDate}</span>
          </div>
          <div className="text-sm bg-primary/10 px-3 py-1 rounded-full">Current Day: {currentDay}</div>
        </div>
      </div>

      {isCreating || editingTask ? (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{isCreating ? "Create New Task" : "Edit Task"}</CardTitle>
          </CardHeader>
          <CardContent>
            <TaskForm
              task={editingTask || undefined}
              onSubmit={isCreating ? handleCreateTask : handleUpdateTask}
              onCancel={() => {
                setIsCreating(false)
                setEditingTask(null)
              }}
              existingDayNumbers={tasks.map((t) => t.day_number)}
              maxDays={blueprint.duration_days}
            />
          </CardContent>
        </Card>
      ) : (
        <Button className="mb-8" onClick={() => setIsCreating(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Task
        </Button>
      )}

      {tasks.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground">No tasks created yet for this blueprint.</p>
            <Button className="mt-4" onClick={() => setIsCreating(true)}>
              <Plus className="mr-2 h-4 w-4" /> Create Your First Task
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {[...tasks]
            .sort((a, b) => a.day_number - b.day_number)
            .map((task) => {
              const isCurrentDay = task.day_number === currentDay
              const isUnlocked = task.day_number <= currentDay
              const isUpcoming = task.day_number > currentDay

              return (
                <Card key={task.id} className={isCurrentDay ? "border-primary" : ""}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-lg">
                          Day {task.day_number}: {task.title}
                        </CardTitle>
                        {isCurrentDay && (
                          <Badge variant="default" className="bg-primary text-white">
                            Today
                          </Badge>
                        )}
                        {isUpcoming && (
                          <Badge variant="outline" className="text-muted-foreground">
                            Upcoming
                          </Badge>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => setEditingTask(task)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteTask(task.id)}
                          className="text-red-500 hover:text-red-600"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-2">{task.instructions}</p>
                    <div className="mt-2 flex flex-wrap gap-2 text-xs">
                      <span className="rounded-full bg-primary/10 px-2 py-1">Skill: {task.skill_focus}</span>
                      {task.share_prompt && (
                        <span className="rounded-full bg-green-100 px-2 py-1 text-green-800">Share Prompt</span>
                      )}
                      {task.requires_submission && (
                        <span className="rounded-full bg-blue-100 px-2 py-1 text-blue-800">Requires Submission</span>
                      )}
                      {isUnlocked ? (
                        <span className="rounded-full bg-emerald-100 px-2 py-1 text-emerald-800">Unlocked</span>
                      ) : (
                        <span className="rounded-full bg-gray-100 px-2 py-1 text-gray-800">Locked</span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
        </div>
      )}
    </>
  )
}
