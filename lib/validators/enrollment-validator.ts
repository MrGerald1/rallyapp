export function validateEnrollmentData(data: any): { success: boolean; errors: string[] } {
  const errors: string[] = []

  // Required fields
  if (!data.name) errors.push("Name is required")
  if (!data.email) errors.push("Email is required")
  if (!data.phone_number) errors.push("Phone number is required")
  if (!data.project_idea) errors.push("Project idea is required")

  // Email validation
  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push("Email must be a valid email address")
  }

  // Phone number validation (basic)
  if (data.phone_number && !/^\+?[0-9\s\-()]{8,20}$/.test(data.phone_number)) {
    errors.push("Phone number must be a valid phone number")
  }

  return {
    success: errors.length === 0,
    errors,
  }
}
