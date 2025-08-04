export function validateBlueprint(data: any): { success: boolean; errors: string[] } {
  const errors: string[] = []

  // Required fields
  if (!data.title) errors.push("Title is required")
  if (!data.description) errors.push("Description is required")
  if (!data.duration_days) errors.push("Duration days is required")
  if (!data.start_date) errors.push("Start date is required")

  // Type validation
  if (data.duration_days && typeof data.duration_days !== "number") {
    errors.push("Duration days must be a number")
  }

  if (data.duration_days && data.duration_days <= 0) {
    errors.push("Duration days must be greater than 0")
  }

  if (data.start_date) {
    try {
      new Date(data.start_date)
    } catch (e) {
      errors.push("Start date must be a valid date")
    }
  }

  return {
    success: errors.length === 0,
    errors,
  }
}

export function validateBlueprintUpdate(data: any): { success: boolean; errors: string[] } {
  const errors: string[] = []

  // Type validation for optional fields
  if (data.title !== undefined && !data.title) {
    errors.push("Title cannot be empty")
  }

  if (data.description !== undefined && !data.description) {
    errors.push("Description cannot be empty")
  }

  if (data.duration_days !== undefined) {
    if (typeof data.duration_days !== "number") {
      errors.push("Duration days must be a number")
    } else if (data.duration_days <= 0) {
      errors.push("Duration days must be greater than 0")
    }
  }

  if (data.start_date !== undefined) {
    try {
      new Date(data.start_date)
    } catch (e) {
      errors.push("Start date must be a valid date")
    }
  }

  return {
    success: errors.length === 0,
    errors,
  }
}

export function validateBlueprintTask(data: any): { success: boolean; errors: string[] } {
  const errors: string[] = []

  // Required fields
  if (!data.day_number) errors.push("Day number is required")
  if (!data.title) errors.push("Title is required")
  if (!data.instructions) errors.push("Instructions are required")

  // Type validation
  if (data.day_number && typeof data.day_number !== "number") {
    errors.push("Day number must be a number")
  }

  if (data.day_number && data.day_number < 0) {
    errors.push("Day number must be greater than or equal to 0")
  }

  // Validate resources if provided
  if (data.resources) {
    if (!Array.isArray(data.resources)) {
      errors.push("Resources must be an array")
    } else {
      data.resources.forEach((resource: any, index: number) => {
        if (!resource.title) {
          errors.push(`Resource ${index + 1} must have a title`)
        }
        if (!resource.url) {
          errors.push(`Resource ${index + 1} must have a URL`)
        }
        if (!resource.type) {
          errors.push(`Resource ${index + 1} must have a type`)
        } else if (!["article", "video", "template", "tool", "other"].includes(resource.type)) {
          errors.push(`Resource ${index + 1} has an invalid type`)
        }
      })
    }
  }

  return {
    success: errors.length === 0,
    errors,
  }
}

export function validateBlueprintTaskUpdate(data: any): { success: boolean; errors: string[] } {
  const errors: string[] = []

  // Type validation for optional fields
  if (data.day_number !== undefined) {
    if (typeof data.day_number !== "number") {
      errors.push("Day number must be a number")
    } else if (data.day_number < 0) {
      errors.push("Day number must be greater than or equal to 0")
    }
  }

  if (data.title !== undefined && !data.title) {
    errors.push("Title cannot be empty")
  }

  if (data.instructions !== undefined && !data.instructions) {
    errors.push("Instructions cannot be empty")
  }

  // Validate resources if provided
  if (data.resources !== undefined) {
    if (!Array.isArray(data.resources)) {
      errors.push("Resources must be an array")
    } else {
      data.resources.forEach((resource: any, index: number) => {
        if (!resource.title) {
          errors.push(`Resource ${index + 1} must have a title`)
        }
        if (!resource.url) {
          errors.push(`Resource ${index + 1} must have a URL`)
        }
        if (!resource.type) {
          errors.push(`Resource ${index + 1} must have a type`)
        } else if (!["article", "video", "template", "tool", "other"].includes(resource.type)) {
          errors.push(`Resource ${index + 1} has an invalid type`)
        }
      })
    }
  }

  return {
    success: errors.length === 0,
    errors,
  }
}
