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
