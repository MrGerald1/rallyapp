import type { Blueprint, BlueprintEnrollment, BlueprintTask, BlueprintTaskProgress, BlueprintStats } from "./types"

// Get all blueprints
export async function getBlueprints(): Promise<Blueprint[]> {
  const response = await fetch("/api/blueprints")
  if (!response.ok) {
    throw new Error("Failed to fetch blueprints")
  }
  return response.json()
}

// Get a specific blueprint
export async function getBlueprint(id: string): Promise<Blueprint> {
  const response = await fetch(`/api/blueprints/${id}`)
  if (!response.ok) {
    throw new Error("Failed to fetch blueprint")
  }
  return response.json()
}

// Create a new blueprint
export async function createBlueprint(
  blueprint: Omit<Blueprint, "id" | "created_at" | "updated_at">,
): Promise<Blueprint> {
  const response = await fetch("/api/blueprints", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(blueprint),
  })
  if (!response.ok) {
    throw new Error("Failed to create blueprint")
  }
  return response.json()
}

// Update a blueprint
export async function updateBlueprint(id: string, blueprint: Partial<Blueprint>): Promise<Blueprint> {
  const response = await fetch(`/api/blueprints/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(blueprint),
  })
  if (!response.ok) {
    throw new Error("Failed to update blueprint")
  }
  return response.json()
}

// Delete a blueprint
export async function deleteBlueprint(id: string): Promise<void> {
  const response = await fetch(`/api/blueprints/${id}`, {
    method: "DELETE",
  })
  if (!response.ok) {
    throw new Error("Failed to delete blueprint")
  }
}

// Get all tasks for a blueprint
export async function getBlueprintTasks(blueprintId: string): Promise<BlueprintTask[]> {
  const response = await fetch(`/api/blueprints/${blueprintId}/tasks`)
  if (!response.ok) {
    throw new Error("Failed to fetch blueprint tasks")
  }
  return response.json()
}

// Get a specific task
export async function getBlueprintTask(blueprintId: string, taskId: string): Promise<BlueprintTask> {
  const response = await fetch(`/api/blueprints/${blueprintId}/tasks/${taskId}`)
  if (!response.ok) {
    throw new Error("Failed to fetch blueprint task")
  }
  return response.json()
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
    throw new Error("Failed to create blueprint task")
  }
  return response.json()
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
    throw new Error("Failed to update blueprint task")
  }
  return response.json()
}

// Delete a task
export async function deleteBlueprintTask(blueprintId: string, taskId: string): Promise<void> {
  const response = await fetch(`/api/blueprints/${blueprintId}/tasks/${taskId}`, {
    method: "DELETE",
  })
  if (!response.ok) {
    throw new Error("Failed to delete blueprint task")
  }
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
  const response = await fetch(`/api/blueprints/${blueprintId}/enroll`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(enrollment),
  })
  if (!response.ok) {
    throw new Error("Failed to enroll in blueprint")
  }
  return response.json()
}

// Get user's enrollment in a blueprint
export async function getUserBlueprintEnrollment(blueprintId: string): Promise<BlueprintEnrollment | null> {
  const response = await fetch(`/api/blueprints/${blueprintId}/enrollment`)
  if (response.status === 404) {
    return null
  }
  if (!response.ok) {
    throw new Error("Failed to fetch enrollment")
  }
  return response.json()
}

// Get user's progress in a blueprint
export async function getUserBlueprintProgress(blueprintId: string): Promise<BlueprintTaskProgress[]> {
  const response = await fetch(`/api/blueprints/${blueprintId}/progress`)
  if (!response.ok) {
    throw new Error("Failed to fetch progress")
  }
  return response.json()
}

// Mark a task as complete
export async function completeTask(
  blueprintId: string,
  taskId: string,
  email: string,
  submissionData?: any,
): Promise<BlueprintTaskProgress> {
  const response = await fetch(`/api/blueprints/${blueprintId}/tasks/${taskId}/complete`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, submission_data: submissionData }),
  })
  if (!response.ok) {
    throw new Error("Failed to complete task")
  }
  return response.json()
}

// Get blueprint statistics
export async function getBlueprintStats(blueprintId: string): Promise<BlueprintStats> {
  const response = await fetch(`/api/blueprints/${blueprintId}/stats`)
  if (!response.ok) {
    throw new Error("Failed to fetch blueprint stats")
  }
  return response.json()
}

/**
 * Calculate the current day based on blueprint start date
 * This is a utility function that can be used across the application
 * to ensure consistent day calculation
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

  // Start date is Day 0, so we don't add 1 to the difference
  return Math.max(0, diffDays)
}
