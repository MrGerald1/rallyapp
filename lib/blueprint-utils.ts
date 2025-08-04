import type { BlueprintTask, Enrollment } from "./types"

/**
 * Calculates the progress percentage for a blueprint
 * @param tasks Array of blueprint tasks
 * @param completedTaskIds Array of completed task IDs
 * @returns Progress percentage (0-100)
 */
export function calculateBlueprintProgress(tasks: BlueprintTask[], completedTaskIds: string[]): number {
  if (!tasks || tasks.length === 0) return 0

  const totalTasks = tasks.length
  const completedTasks = tasks.filter((task) => completedTaskIds.includes(task.id)).length

  return Math.round((completedTasks / totalTasks) * 100)
}

/**
 * Gets the next incomplete task for a blueprint
 * @param tasks Array of blueprint tasks
 * @param completedTaskIds Array of completed task IDs
 * @returns Next incomplete task or undefined if all tasks are complete
 */
export function getNextIncompleteTask(tasks: BlueprintTask[], completedTaskIds: string[]): BlueprintTask | undefined {
  if (!tasks || tasks.length === 0) return undefined

  // Sort tasks by order
  const sortedTasks = [...tasks].sort((a, b) => a.order - b.order)

  // Find the first incomplete task
  return sortedTasks.find((task) => !completedTaskIds.includes(task.id))
}

/**
 * Formats a date string for display
 * @param dateString Date string to format
 * @returns Formatted date string
 */
export function formatDate(dateString: string): string {
  if (!dateString) return ""

  const date = new Date(dateString)
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date)
}

/**
 * Calculates time remaining for a blueprint enrollment
 * @param enrollment Enrollment object
 * @returns Object containing days, hours, and minutes remaining
 */
export function calculateTimeRemaining(enrollment: Enrollment): {
  days: number
  hours: number
  minutes: number
  expired: boolean
} {
  if (!enrollment || !enrollment.deadline) {
    return { days: 0, hours: 0, minutes: 0, expired: false }
  }

  const now = new Date()
  const deadline = new Date(enrollment.deadline)
  const diffMs = deadline.getTime() - now.getTime()

  if (diffMs <= 0) {
    return { days: 0, hours: 0, minutes: 0, expired: true }
  }

  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))

  return { days, hours, minutes, expired: false }
}

/**
 * Validates blueprint data
 * @param blueprint Blueprint data to validate
 * @returns Object containing validation result and error message
 */
export function validateBlueprint(blueprint: any): {
  isValid: boolean
  errors: Record<string, string>
} {
  const errors: Record<string, string> = {}

  if (!blueprint.title || blueprint.title.trim() === "") {
    errors.title = "Title is required"
  }

  if (!blueprint.description || blueprint.description.trim() === "") {
    errors.description = "Description is required"
  }

  if (!blueprint.duration || isNaN(Number.parseInt(blueprint.duration))) {
    errors.duration = "Valid duration is required"
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

/**
 * Validates blueprint task data
 * @param task Task data to validate
 * @returns Object containing validation result and error message
 */
export function validateBlueprintTask(task: any): {
  isValid: boolean
  errors: Record<string, string>
} {
  const errors: Record<string, string> = {}

  if (!task.title || task.title.trim() === "") {
    errors.title = "Title is required"
  }

  if (!task.description || task.description.trim() === "") {
    errors.description = "Description is required"
  }

  if (task.order === undefined || isNaN(Number.parseInt(task.order))) {
    errors.order = "Valid order is required"
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

/**
 * Validates enrollment data
 * @param enrollment Enrollment data to validate
 * @returns Object containing validation result and error message
 */
export function validateEnrollment(enrollment: any): {
  isValid: boolean
  errors: Record<string, string>
} {
  const errors: Record<string, string> = {}

  if (!enrollment.name || enrollment.name.trim() === "") {
    errors.name = "Name is required"
  }

  if (!enrollment.email || enrollment.email.trim() === "") {
    errors.email = "Email is required"
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(enrollment.email)) {
    errors.email = "Valid email is required"
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

/**
 * Sorts tasks by their order property
 * @param tasks Array of tasks to sort
 * @returns Sorted array of tasks
 */
export function sortTasksByOrder(tasks: BlueprintTask[]): BlueprintTask[] {
  if (!tasks || tasks.length === 0) return []
  return [...tasks].sort((a, b) => a.order - b.order)
}

/**
 * Groups tasks by their category
 * @param tasks Array of tasks to group
 * @returns Object with category keys and task arrays
 */
export function groupTasksByCategory(tasks: BlueprintTask[]): Record<string, BlueprintTask[]> {
  if (!tasks || tasks.length === 0) return {}

  const grouped: Record<string, BlueprintTask[]> = {}

  tasks.forEach((task) => {
    const category = task.category || "Uncategorized"
    if (!grouped[category]) {
      grouped[category] = []
    }
    grouped[category].push(task)
  })

  // Sort tasks within each category
  Object.keys(grouped).forEach((category) => {
    grouped[category] = sortTasksByOrder(grouped[category])
  })

  return grouped
}

/**
 * Updates the current day for an enrollment based on the start date
 * @param enrollment Enrollment object with start_date
 * @returns Updated enrollment with current_day calculated
 */
export function updateEnrollmentCurrentDay(enrollment: Enrollment): Enrollment {
  if (!enrollment || !enrollment.start_date) {
    return { ...enrollment, current_day: 1 }
  }

  const startDate = new Date(enrollment.start_date)
  const currentDate = new Date()

  // Calculate the difference in days
  const diffTime = currentDate.getTime() - startDate.getTime()
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

  // Current day is the difference plus 1 (start date is day 1)
  const currentDay = Math.max(1, diffDays + 1)

  // Don't exceed the blueprint duration if available
  if (enrollment.blueprint && enrollment.blueprint.duration) {
    return {
      ...enrollment,
      current_day: Math.min(currentDay, enrollment.blueprint.duration),
    }
  }

  return { ...enrollment, current_day: currentDay }
}
