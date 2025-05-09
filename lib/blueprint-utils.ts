import { createServerSupabaseClient } from "@/lib/supabase"
import { calculateCurrentDay } from "@/lib/blueprint-api"

/**
 * Updates the enrollment's current day based on the blueprint start date
 * Returns the calculated current day
 */
export async function updateEnrollmentCurrentDay(
  blueprintId: string,
  enrollmentId: string,
  startDate: string,
): Promise<number> {
  const supabase = createServerSupabaseClient()
  const currentDay = calculateCurrentDay(startDate)

  // Update the enrollment with the calculated current day
  await supabase
    .from("user_blueprint_enrollments")
    .update({
      current_day: currentDay,
      updated_at: new Date().toISOString(),
    })
    .eq("id", enrollmentId)

  return currentDay
}

/**
 * Formats a date for display
 */
export function formatDate(date: Date | string, options?: Intl.DateTimeFormatOptions): string {
  const dateObj = typeof date === "string" ? new Date(date) : date
  return dateObj.toLocaleDateString(
    "en-US",
    options || {
      year: "numeric",
      month: "long",
      day: "numeric",
    },
  )
}

/**
 * Checks if a blueprint has started based on its start date
 */
export function hasBlueprintStarted(startDate: string | Date): boolean {
  const start = typeof startDate === "string" ? new Date(startDate) : startDate
  const now = new Date()

  // Reset hours to compare just the dates
  start.setHours(0, 0, 0, 0)
  now.setHours(0, 0, 0, 0)

  return now >= start
}
