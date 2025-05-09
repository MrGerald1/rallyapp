import type { Blueprint, BlueprintEnrollment, BlueprintTask, BlueprintTaskProgress, BlueprintStats } from "./types"

// Helper function for API requests
async function apiRequest<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, options)

  if (!response.ok) {
    const errorText = await response.text()
    let errorMessage
    try {
      const errorData = JSON.parse(errorText)
      errorMessage = errorData.error || `API error: ${response.status}`
    } catch {
      errorMessage = `API error: ${response.status}`
    }
    throw new Error(errorMessage)
  }

  return response.json()
}

// Get all blueprints
export async function getBlueprints(): Promise<Blueprint[]> {
  return apiRequest<Blueprint[]>("/api/blueprints")
}

// Get a specific blueprint
export async function getBlueprint(id: string): Promise<Blueprint> {
  return apiRequest<Blueprint>(`/api/blueprints/${id}`)
}

// Create a new blueprint
export async function createBlueprint(
  blueprint: Omit<Blueprint, "id" | "created_at" | "updated_at">,
): Promise<Blueprint> {
  return apiRequest<Blueprint>("/api/blueprints", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(blueprint),
  })
}

// Update a blueprint
export async function updateBlueprint(id: string, blueprint: Partial<Blueprint>): Promise<Blueprint> {
  return apiRequest<Blueprint>(`/api/blueprints/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(blueprint),
  })
}

// Delete a blueprint
export async function deleteBlueprint(id: string): Promise<void> {
  return apiRequest<void>(`/api/blueprints/${id}`, { method: "DELETE" })
}

// Get all tasks for a blueprint
export async function getBlueprintTasks(blueprintId: string): Promise<BlueprintTask[]> {
  return apiRequest<BlueprintTask[]>(`/api/blueprints/${blueprintId}/tasks`)
}

// Get a specific task
export async function getBlueprintTask(blueprintId: string, taskId: string): Promise<BlueprintTask> {
  return apiRequest<BlueprintTask>(`/api/blueprints/${blueprintId}/tasks/${taskId}`)
}

// Create a new task
export async function createBlueprintTask(
  blueprintId: string,
  task: Omit<BlueprintTask, "id" | "blueprint_id" | "created_at" | "updated_at">,
): Promise<BlueprintTask> {
  return apiRequest<BlueprintTask>(`/api/blueprints/${blueprintId}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
  })
}

// Update a task
export async function updateBlueprintTask(
  blueprintId: string,
  taskId: string,
  task: Partial<BlueprintTask>,
): Promise<BlueprintTask> {
  return apiRequest<BlueprintTask>(`/api/blueprints/${blueprintId}/tasks/${taskId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
  })
}

// Delete a task
export async function deleteBlueprintTask(blueprintId: string, taskId: string): Promise<void> {
  return apiRequest<void>(`/api/blueprints/${blueprintId}/tasks/${taskId}`, { method: "DELETE" })
}

// Enroll in a blueprint
export async function enrollInBlueprint(
  blueprintId: string,
  enrollment: {
    name: string
    email: string
    phone_number: string
    project_idea: string
  },
): Promise<BlueprintEnrollment> {
  return apiRequest<BlueprintEnrollment>(`/api/blueprints/${blueprintId}/enroll`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(enrollment),
  })
}

// Get user's enrollment in a blueprint
export async function getUserBlueprintEnrollment(blueprintId: string): Promise<BlueprintEnrollment | null> {
  try {
    return await apiRequest<BlueprintEnrollment>(`/api/blueprints/${blueprintId}/enrollment`)
  } catch (error) {
    if (error instanceof Error && error.message.includes("404")) {
      return null
    }
    throw error
  }
}

// Get user's progress in a blueprint
export async function getUserBlueprintProgress(blueprintId: string): Promise<BlueprintTaskProgress[]> {
  return apiRequest<BlueprintTaskProgress[]>(`/api/blueprints/${blueprintId}/progress`)
}

// Mark a task as complete
export async function completeTask(
  blueprintId: string,
  taskId: string,
  email: string,
  submissionData?: any,
): Promise<BlueprintTaskProgress> {
  return apiRequest<BlueprintTaskProgress>(`/api/blueprints/${blueprintId}/tasks/${taskId}/complete`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, submission_data: submissionData }),
  })
}

// Get blueprint statistics
export async function getBlueprintStats(blueprintId: string): Promise<BlueprintStats> {
  return apiRequest<BlueprintStats>(`/api/blueprints/${blueprintId}/stats`)
}

/**
 * Calculate the current day based on blueprint start date
 */
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
