import type {
  Blueprint,
  BlueprintTask,
  BlueprintEnrollment,
  BlueprintTaskProgress,
  BlueprintStats,
  EnrollmentFormData,
  EnrollmentWithBlueprint,
  TaskWithProgress,
} from "../types/blueprint"

/**
 * Base API request function with error handling and logging
 */
async function apiRequest<T>(url: string, options: RequestInit = {}, cacheBust = true): Promise<T> {
  try {
    // Add default headers
    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
    }

    // Add cache busting if needed
    if (cacheBust) {
      headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
      headers["Pragma"] = "no-cache"
      headers["Expires"] = "0"
    }

    // Make the request
    console.log(`API Request: ${options.method || "GET"} ${url}`)
    const response = await fetch(url, {
      ...options,
      headers,
    })

    // Handle non-OK responses
    if (!response.ok) {
      const errorText = await response.text()
      console.error(`API Error (${response.status}): ${url}`, errorText)

      let errorData
      try {
        errorData = JSON.parse(errorText)
      } catch (e) {
        errorData = { error: `Request failed with status ${response.status}` }
      }

      throw new Error(errorData.error || `Request failed with status ${response.status}`)
    }

    // Parse the response
    const data = await response.json()
    console.log(`API Response: ${url}`, { status: response.status, data })
    return data as T
  } catch (error) {
    console.error(`API Request Failed: ${url}`, error)
    throw error
  }
}

/**
 * Blueprint API Functions
 */

// Get all blueprints
export async function getBlueprints(): Promise<Blueprint[]> {
  const response = await apiRequest<{ blueprints: Blueprint[] }>("/api/blueprints")
  return response.blueprints || []
}

// Get active blueprint
export async function getActiveBlueprint(): Promise<Blueprint> {
  const response = await fetch("/api/blueprints/active", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch active blueprint: ${response.status}`)
  }

  const data = await response.json()
  return data.blueprint || data
}

// Get a specific blueprint
export async function getBlueprint(id: string): Promise<Blueprint> {
  const response = await apiRequest<{ blueprint: Blueprint }>(`/api/blueprints/${id}`)
  return response.blueprint
}

// Create a new blueprint
export async function createBlueprint(
  blueprint: Omit<Blueprint, "id" | "created_at" | "updated_at">,
): Promise<Blueprint> {
  const response = await apiRequest<{ blueprint: Blueprint }>("/api/blueprints", {
    method: "POST",
    body: JSON.stringify(blueprint),
  })
  return response.blueprint
}

// Update a blueprint
export async function updateBlueprint(id: string, blueprint: Partial<Blueprint>): Promise<Blueprint> {
  const response = await apiRequest<{ blueprint: Blueprint }>(`/api/blueprints/${id}`, {
    method: "PATCH",
    body: JSON.stringify(blueprint),
  })
  return response.blueprint
}

// Delete a blueprint
export async function deleteBlueprint(id: string): Promise<{ success: boolean }> {
  return apiRequest<{ success: boolean }>(`/api/blueprints/${id}`, {
    method: "DELETE",
  })
}

// Set a blueprint as active
export async function setActiveBlueprint(id: string): Promise<{ success: boolean }> {
  return apiRequest<{ success: boolean }>(`/api/blueprints/${id}/set-active`, {
    method: "POST",
  })
}

/**
 * Blueprint Tasks API Functions
 */

// Get all tasks for a blueprint
export async function getBlueprintTasks(blueprintId: string): Promise<BlueprintTask[]> {
  const response = await fetch(`/api/blueprints/${blueprintId}/tasks`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch tasks: ${response.status}`)
  }

  const data = await response.json()
  return data.tasks || []
}

// Get a specific task
export async function getBlueprintTask(blueprintId: string, taskId: string): Promise<BlueprintTask> {
  const response = await apiRequest<{ task: BlueprintTask }>(`/api/blueprints/${blueprintId}/tasks/${taskId}`)
  return response.task
}

// Create a new task
export async function createBlueprintTask(
  blueprintId: string,
  task: Omit<BlueprintTask, "id" | "blueprint_id" | "created_at" | "updated_at">,
): Promise<BlueprintTask> {
  const response = await fetch(`/api/blueprints/${blueprintId}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.error || `Failed to create task: ${response.status}`)
  }

  const data = await response.json()
  return data.task
}

// Update a task
export async function updateBlueprintTask(
  blueprintId: string,
  taskId: string,
  task: Partial<BlueprintTask>,
): Promise<BlueprintTask> {
  const response = await fetch(`/api/blueprints/${blueprintId}/tasks/${taskId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.error || `Failed to update task: ${response.status}`)
  }

  const data = await response.json()
  return data.task
}

// Delete a task
export async function deleteBlueprintTask(blueprintId: string, taskId: string): Promise<{ success: boolean }> {
  const response = await fetch(`/api/blueprints/${blueprintId}/tasks/${taskId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.error || `Failed to delete task: ${response.status}`)
  }

  return response.json()
}

/**
 * Enrollment API Functions
 */

// Enroll in a blueprint
export async function enrollInBlueprint(
  blueprintId: string,
  enrollmentData: EnrollmentFormData,
): Promise<BlueprintEnrollment> {
  const response = await fetch(`/api/blueprints/${blueprintId}/enroll`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(enrollmentData),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.error || `Failed to enroll: ${response.status}`)
  }

  return response.json()
}

// Check if a user is enrolled in a blueprint
export async function checkBlueprintEnrollment(
  blueprintId: string,
  email: string,
): Promise<{ enrolled: boolean; enrollment: BlueprintEnrollment | null }> {
  const response = await fetch(`/api/blueprints/${blueprintId}/check-enrollment?email=${encodeURIComponent(email)}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to check enrollment: ${response.status}`)
  }

  return response.json()
}

// Get user's enrollment in a blueprint
export async function getUserBlueprintEnrollment(
  blueprintId: string,
  email: string,
): Promise<{ enrollment: BlueprintEnrollment; blueprint: Blueprint; tasks: TaskWithProgress[] }> {
  return apiRequest<{ enrollment: BlueprintEnrollment; blueprint: Blueprint; tasks: TaskWithProgress[] }>(
    `/api/blueprints/${blueprintId}/enrollment?email=${encodeURIComponent(email)}`,
  )
}

// Get all enrollments (admin)
export async function getAllEnrollments(): Promise<{ enrollments: EnrollmentWithBlueprint[] }> {
  return apiRequest<{ enrollments: EnrollmentWithBlueprint[] }>("/api/enrollments")
}

// Get a specific enrollment with details (admin)
export async function getEnrollmentDetails(
  enrollmentId: string,
): Promise<{ enrollment: EnrollmentWithBlueprint; tasks: TaskWithProgress[] }> {
  return apiRequest<{ enrollment: EnrollmentWithBlueprint; tasks: TaskWithProgress[] }>(
    `/api/enrollments/${enrollmentId}`,
  )
}

/**
 * Task Progress API Functions
 */

// Mark a task as complete
export async function completeTask(
  blueprintId: string,
  taskId: string,
  enrollmentId: string,
  submissionData?: any,
): Promise<{ success: boolean; progress: BlueprintTaskProgress }> {
  return apiRequest<{ success: boolean; progress: BlueprintTaskProgress }>(
    `/api/blueprints/${blueprintId}/tasks/${taskId}/complete`,
    {
      method: "POST",
      body: JSON.stringify({ enrollmentId, submission_data: submissionData }),
    },
  )
}

// Get user's progress for all blueprints
export async function getUserBlueprintProgress(email: string): Promise<{
  enrollments: (EnrollmentWithBlueprint & { progress: { completed: number; total: number; percentage: number } })[]
}> {
  return apiRequest<{
    enrollments: (EnrollmentWithBlueprint & { progress: { completed: number; total: number; percentage: number } })[]
  }>(`/api/blueprints/progress?email=${encodeURIComponent(email)}`)
}

// Get blueprint statistics (admin)
export async function getBlueprintStats(blueprintId: string): Promise<{ blueprint: Blueprint; stats: BlueprintStats }> {
  return apiRequest<{ blueprint: Blueprint; stats: BlueprintStats }>(`/api/blueprints/${blueprintId}/stats`)
}

/**
 * File Upload API Functions
 */

// Upload a file for blueprint submission
export async function uploadBlueprintSubmission(
  file: File,
  taskId: string,
  enrollmentId: string,
): Promise<{ success: boolean; url: string; fileName: string; fileSize: number; fileType: string }> {
  const formData = new FormData()
  formData.append("file", file)
  formData.append("taskId", taskId)
  formData.append("enrollmentId", enrollmentId)

  return apiRequest<{ success: boolean; url: string; fileName: string; fileSize: number; fileType: string }>(
    "/api/upload/blueprint-submission",
    {
      method: "POST",
      body: formData,
      headers: {}, // Let the browser set the content type for FormData
    },
    false, // Don't add JSON content type header for FormData
  )
}

/**
 * Utility Functions
 */

// Calculate the current day based on blueprint start date
export function calculateCurrentDay(startDateStr: string): number {
  const startDate = new Date(startDateStr)
  const today = new Date()

  // Reset hours to compare just the dates
  startDate.setHours(0, 0, 0, 0)
  today.setHours(0, 0, 0, 0)

  // Calculate the difference in days
  const diffTime = today.getTime() - startDate.getTime()
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

  return Math.max(0, diffDays)
}
