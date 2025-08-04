// Base URL for API requests
const API_BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || ""

// Cache busting parameter to prevent stale data
const cacheBuster = () => `_cb=${Date.now()}`

/**
 * Fetches all blueprints
 * @returns Promise resolving to array of blueprints
 */
export async function getBlueprints() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/blueprints?${cacheBuster()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error("Failed to fetch blueprints:", response.status, errorData)
      throw new Error(`Failed to fetch blueprints: ${response.status}`)
    }

    const data = await response.json()
    return data.blueprints || data
  } catch (error) {
    console.error("Error fetching blueprints:", error)
    throw error
  }
}

/**
 * Fetches a specific blueprint by ID
 * @param id Blueprint ID
 * @returns Promise resolving to blueprint data
 */
export async function getBlueprint(id: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/blueprints/${id}?${cacheBuster()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error(`Failed to fetch blueprint ${id}:`, response.status, errorData)
      throw new Error(`Failed to fetch blueprint: ${response.status}`)
    }

    const data = await response.json()
    return data.blueprint || data
  } catch (error) {
    console.error(`Error fetching blueprint ${id}:`, error)
    throw error
  }
}

/**
 * Fetches tasks for a specific blueprint
 * @param blueprintId Blueprint ID
 * @returns Promise resolving to array of tasks
 */
export async function getBlueprintTasks(blueprintId: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/blueprints/${blueprintId}/tasks?${cacheBuster()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error(`Failed to fetch tasks for blueprint ${blueprintId}:`, response.status, errorData)
      throw new Error(`Failed to fetch blueprint tasks: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error(`Error fetching tasks for blueprint ${blueprintId}:`, error)
    throw error
  }
}

/**
 * Enrolls a user in a blueprint
 * @param blueprintId Blueprint ID
 * @param userData User data for enrollment
 * @returns Promise resolving to enrollment result
 */
export async function enrollInBlueprint(blueprintId: string, userData: any) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/blueprints/${blueprintId}/enroll`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error(`Failed to enroll in blueprint ${blueprintId}:`, response.status, errorData)
      throw new Error(errorData.error || `Failed to enroll in blueprint: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error(`Error enrolling in blueprint ${blueprintId}:`, error)
    throw error
  }
}

/**
 * Checks if a user is enrolled in a blueprint
 * @param blueprintId Blueprint ID
 * @param email User email
 * @returns Promise resolving to enrollment status
 */
export async function checkBlueprintEnrollment(blueprintId: string, email: string) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/blueprints/${blueprintId}/check-enrollment?email=${encodeURIComponent(email)}&${cacheBuster()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      },
    )

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error(`Failed to check enrollment for blueprint ${blueprintId}:`, response.status, errorData)
      throw new Error(`Failed to check blueprint enrollment: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error(`Error checking enrollment for blueprint ${blueprintId}:`, error)
    throw error
  }
}

/**
 * Gets enrollment details for a blueprint
 * @param blueprintId Blueprint ID
 * @returns Promise resolving to enrollment details
 */
export async function getBlueprintEnrollment(blueprintId: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/blueprints/${blueprintId}/enrollment?${cacheBuster()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error(`Failed to get enrollment for blueprint ${blueprintId}:`, response.status, errorData)
      throw new Error(`Failed to get blueprint enrollment: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error(`Error getting enrollment for blueprint ${blueprintId}:`, error)
    throw error
  }
}

/**
 * Marks a task as complete
 * @param blueprintId Blueprint ID
 * @param taskId Task ID
 * @param data Additional data for task completion
 * @returns Promise resolving to task completion result
 */
export async function completeTask(blueprintId: string, taskId: string, data?: any) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/blueprints/${blueprintId}/tasks/${taskId}/complete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data || {}),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error(`Failed to complete task ${taskId} for blueprint ${blueprintId}:`, response.status, errorData)
      throw new Error(`Failed to complete task: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error(`Error completing task ${taskId} for blueprint ${blueprintId}:`, error)
    throw error
  }
}

/**
 * Gets progress for all blueprints
 * @returns Promise resolving to blueprint progress data
 */
export async function getBlueprintProgress() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/blueprints/progress?${cacheBuster()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error("Failed to fetch blueprint progress:", response.status, errorData)
      throw new Error(`Failed to fetch blueprint progress: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching blueprint progress:", error)
    throw error
  }
}

/**
 * Gets stats for a specific blueprint
 * @param blueprintId Blueprint ID
 * @returns Promise resolving to blueprint stats
 */
export async function getBlueprintStats(blueprintId: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/blueprints/${blueprintId}/stats?${cacheBuster()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error(`Failed to fetch stats for blueprint ${blueprintId}:`, response.status, errorData)
      throw new Error(`Failed to fetch blueprint stats: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error(`Error fetching stats for blueprint ${blueprintId}:`, error)
    throw error
  }
}

/**
 * Gets all enrollments
 * @returns Promise resolving to array of enrollments
 */
export async function getEnrollments() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/enrollments?${cacheBuster()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error("Failed to fetch enrollments:", response.status, errorData)
      throw new Error(`Failed to fetch enrollments: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching enrollments:", error)
    throw error
  }
}

/**
 * Gets a specific enrollment by ID
 * @param enrollmentId Enrollment ID
 * @returns Promise resolving to enrollment data
 */
export async function getEnrollment(enrollmentId: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/enrollments/${enrollmentId}?${cacheBuster()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error(`Failed to fetch enrollment ${enrollmentId}:`, response.status, errorData)
      throw new Error(`Failed to fetch enrollment: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error(`Error fetching enrollment ${enrollmentId}:`, error)
    throw error
  }
}

/**
 * Gets the active blueprint
 * @returns Promise resolving to active blueprint data
 */
export async function getActiveBlueprint() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/blueprints/active?${cacheBuster()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error("Failed to fetch active blueprint:", response.status, errorData)
      throw new Error(`Failed to fetch active blueprint: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching active blueprint:", error)
    throw error
  }
}

/**
 * Sets a blueprint as active
 * @param blueprintId Blueprint ID
 * @returns Promise resolving to operation result
 */
export async function setActiveBlueprint(blueprintId: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/blueprints/${blueprintId}/set-active`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error(`Failed to set blueprint ${blueprintId} as active:`, response.status, errorData)
      throw new Error(`Failed to set active blueprint: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error(`Error setting blueprint ${blueprintId} as active:`, error)
    throw error
  }
}

/**
 * Updates a blueprint
 * @param blueprintId Blueprint ID
 * @param data Blueprint data to update
 * @returns Promise resolving to updated blueprint
 */
export async function updateBlueprint(blueprintId: string, data: any) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/blueprints/${blueprintId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error(`Failed to update blueprint ${blueprintId}:`, response.status, errorData)
      throw new Error(`Failed to update blueprint: ${response.status}`)
    }

    const result = await response.json()
    return result.blueprint || result
  } catch (error) {
    console.error(`Error updating blueprint ${blueprintId}:`, error)
    throw error
  }
}

/**
 * Creates a new blueprint
 * @param data Blueprint data
 * @returns Promise resolving to created blueprint
 */
export async function createBlueprint(data: any) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/blueprints`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error("Failed to create blueprint:", response.status, errorData)
      throw new Error(`Failed to create blueprint: ${response.status}`)
    }

    const result = await response.json()
    return result.blueprint || result
  } catch (error) {
    console.error("Error creating blueprint:", error)
    throw error
  }
}

/**
 * Creates a new task for a blueprint
 * @param blueprintId Blueprint ID
 * @param data Task data
 * @returns Promise resolving to created task
 */
export async function createBlueprintTask(blueprintId: string, data: any) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/blueprints/${blueprintId}/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error(`Failed to create task for blueprint ${blueprintId}:`, response.status, errorData)
      throw new Error(`Failed to create blueprint task: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error(`Error creating task for blueprint ${blueprintId}:`, error)
    throw error
  }
}

/**
 * Updates a task for a blueprint
 * @param blueprintId Blueprint ID
 * @param taskId Task ID
 * @param data Task data to update
 * @returns Promise resolving to updated task
 */
export async function updateBlueprintTask(blueprintId: string, taskId: string, data: any) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/blueprints/${blueprintId}/tasks/${taskId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error(`Failed to update task ${taskId} for blueprint ${blueprintId}:`, response.status, errorData)
      throw new Error(`Failed to update blueprint task: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error(`Error updating task ${taskId} for blueprint ${blueprintId}:`, error)
    throw error
  }
}

/**
 * Deletes a task from a blueprint
 * @param blueprintId Blueprint ID
 * @param taskId Task ID
 * @returns Promise resolving to deletion result
 */
export async function deleteBlueprintTask(blueprintId: string, taskId: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/blueprints/${blueprintId}/tasks/${taskId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error(`Failed to delete task ${taskId} from blueprint ${blueprintId}:`, response.status, errorData)
      throw new Error(`Failed to delete blueprint task: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error(`Error deleting task ${taskId} from blueprint ${blueprintId}:`, error)
    throw error
  }
}

/**
 * Uploads a file for a blueprint submission
 * @param file File to upload
 * @param blueprintId Blueprint ID
 * @param taskId Task ID
 * @returns Promise resolving to upload result
 */
export async function uploadBlueprintSubmission(file: File, blueprintId: string, taskId: string) {
  try {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("blueprintId", blueprintId)
    formData.append("taskId", taskId)

    const response = await fetch(`${API_BASE_URL}/api/upload/blueprint-submission`, {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error(
        `Failed to upload submission for task ${taskId} in blueprint ${blueprintId}:`,
        response.status,
        errorData,
      )
      throw new Error(`Failed to upload blueprint submission: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error(`Error uploading submission for task ${taskId} in blueprint ${blueprintId}:`, error)
    throw error
  }
}
