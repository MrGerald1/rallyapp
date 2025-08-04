"use client"

import { useState, useEffect, useCallback } from "react"
import { useToast } from "@/components/ui/use-toast"
import {
  getActiveBlueprint,
  getBlueprint,
  getBlueprintTasks,
  checkBlueprintEnrollment,
  enrollInBlueprint,
  getUserBlueprintEnrollment,
  completeTask,
  getUserBlueprintProgress,
} from "@/lib/api/blueprint-api"
import type { Blueprint, BlueprintTask, EnrollmentFormData, TaskWithProgress } from "@/lib/types/blueprint"

export function useActiveBlueprint() {
  const [blueprint, setBlueprint] = useState<Blueprint | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const fetchActiveBlueprint = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const data = await getActiveBlueprint()
        setBlueprint(data)
      } catch (err: any) {
        console.error("Error fetching active blueprint:", err)
        setError(err.message || "Failed to load active blueprint")
        toast({
          title: "Error",
          description: "Failed to load active blueprint",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchActiveBlueprint()
  }, [toast])

  return { blueprint, isLoading, error }
}

export function useBlueprint(blueprintId: string) {
  const [blueprint, setBlueprint] = useState<Blueprint | null>(null)
  const [tasks, setTasks] = useState<BlueprintTask[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const fetchBlueprint = async () => {
      if (!blueprintId) return

      try {
        setIsLoading(true)
        setError(null)

        // Fetch blueprint details
        const blueprintData = await getBlueprint(blueprintId)
        setBlueprint(blueprintData)

        // Fetch blueprint tasks
        const tasksData = await getBlueprintTasks(blueprintId)
        setTasks(tasksData)
      } catch (err: any) {
        console.error("Error fetching blueprint:", err)
        setError(err.message || "Failed to load blueprint")
        toast({
          title: "Error",
          description: "Failed to load blueprint details",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchBlueprint()
  }, [blueprintId, toast])

  return { blueprint, tasks, isLoading, error }
}

export function useEnrollment(blueprintId: string, userEmail: string) {
  const [isEnrolled, setIsEnrolled] = useState(false)
  const [enrollment, setEnrollment] = useState<any>(null)
  const [tasks, setTasks] = useState<TaskWithProgress[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const checkEnrollment = useCallback(async () => {
    if (!blueprintId || !userEmail) return

    try {
      setIsLoading(true)
      setError(null)

      // Check if user is enrolled
      const { enrolled, enrollment: enrollmentData } = await checkBlueprintEnrollment(blueprintId, userEmail)
      setIsEnrolled(enrolled)

      if (enrolled && enrollmentData) {
        setEnrollment(enrollmentData)

        // Fetch enrollment details with tasks
        const { tasks: tasksWithProgress } = await getUserBlueprintEnrollment(blueprintId, userEmail)
        setTasks(tasksWithProgress)
      }
    } catch (err: any) {
      console.error("Error checking enrollment:", err)
      setError(err.message || "Failed to check enrollment status")
    } finally {
      setIsLoading(false)
    }
  }, [blueprintId, userEmail, toast])

  const enroll = useCallback(
    async (formData: EnrollmentFormData) => {
      if (!blueprintId) {
        toast({
          title: "Error",
          description: "Blueprint ID is required",
          variant: "destructive",
        })
        return
      }

      try {
        setIsLoading(true)
        setError(null)

        // Enroll user
        const enrollmentData = await enrollInBlueprint(blueprintId, formData)
        setIsEnrolled(true)
        setEnrollment(enrollmentData)

        // Refresh enrollment details
        await checkEnrollment()

        toast({
          title: "Success",
          description: "Successfully enrolled in blueprint",
        })

        return enrollmentData
      } catch (err: any) {
        console.error("Error enrolling in blueprint:", err)
        setError(err.message || "Failed to enroll in blueprint")
        toast({
          title: "Error",
          description: err.message || "Failed to enroll in blueprint",
          variant: "destructive",
        })
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [blueprintId, checkEnrollment, toast],
  )

  const completeTaskFn = useCallback(
    async (taskId: string, submissionData?: any) => {
      if (!blueprintId || !enrollment) {
        toast({
          title: "Error",
          description: "Blueprint ID and enrollment are required",
          variant: "destructive",
        })
        return
      }

      try {
        setIsLoading(true)
        setError(null)

        // Complete task
        await completeTask(blueprintId, taskId, enrollment.id, submissionData)

        // Refresh enrollment details
        await checkEnrollment()

        toast({
          title: "Success",
          description: "Task completed successfully",
        })
      } catch (err: any) {
        console.error("Error completing task:", err)
        setError(err.message || "Failed to complete task")
        toast({
          title: "Error",
          description: err.message || "Failed to complete task",
          variant: "destructive",
        })
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [blueprintId, enrollment, checkEnrollment, toast],
  )

  useEffect(() => {
    checkEnrollment()
  }, [checkEnrollment])

  return {
    isEnrolled,
    enrollment,
    tasks,
    isLoading,
    error,
    checkEnrollment,
    enroll,
    completeTask: completeTaskFn,
  }
}

export function useUserProgress(userEmail: string) {
  const [enrollments, setEnrollments] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const fetchProgress = useCallback(async () => {
    if (!userEmail) return

    try {
      setIsLoading(true)
      setError(null)

      // Fetch user's progress across all blueprints
      const { enrollments: enrollmentsData } = await getUserBlueprintProgress(userEmail)
      setEnrollments(enrollmentsData)
    } catch (err: any) {
      console.error("Error fetching user progress:", err)
      setError(err.message || "Failed to fetch progress")
      toast({
        title: "Error",
        description: "Failed to fetch your progress",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [userEmail, toast])

  useEffect(() => {
    fetchProgress()
  }, [fetchProgress])

  return { enrollments, isLoading, error, refreshProgress: fetchProgress }
}
