import { createServerSupabaseClient } from "@/lib/supabase"

/**
 * Records a blueprint task completion as a submission to ensure it counts toward streaks and leaderboard
 */
export async function recordBlueprintSubmission({
  userEmail,
  blueprintId,
  taskId,
  taskTitle,
}: {
  userEmail: string
  blueprintId: string
  taskId: string
  taskTitle: string
}) {
  const supabase = createServerSupabaseClient()
  const challengeId = `blueprint_${blueprintId}_task_${taskId}`

  // Check if a submission already exists
  const { data: existingSubmission } = await supabase
    .from("submissions")
    .select("id")
    .eq("user_email", userEmail)
    .eq("challenge_id", challengeId)
    .single()

  if (existingSubmission) {
    return existingSubmission.id
  }

  // Create a new submission
  const { data, error } = await supabase
    .from("submissions")
    .insert({
      user_email: userEmail,
      challenge_id: challengeId,
      name: userEmail.split("@")[0],
      handle: userEmail.split("@")[0],
      submission_link: `/blueprint/dashboard`,
    })
    .select("id")
    .single()

  if (error) {
    console.error("Error recording blueprint submission:", error)
    throw new Error("Failed to record blueprint submission")
  }

  // Update the user's streak
  await updateUserStreak(userEmail)

  return data.id
}

/**
 * Updates a user's streak when they complete a blueprint task
 */
async function updateUserStreak(userEmail: string) {
  const supabase = createServerSupabaseClient()
  const { data: streak } = await supabase.from("streaks").select("*").eq("user_email", userEmail).single()

  if (!streak) {
    // Create a new streak record if one doesn't exist
    await supabase.from("streaks").insert({
      user_email: userEmail,
      current_streak: 1,
      longest_streak: 1,
      points: 10,
      last_submission_date: new Date().toISOString(),
    })
    return
  }

  // Calculate if this is a streak continuation
  const lastSubmissionDate = new Date(streak.last_submission_date)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  // Format dates to compare just the date part (not time)
  const lastSubmissionDateStr = lastSubmissionDate.toISOString().split("T")[0]
  const todayStr = today.toISOString().split("T")[0]
  const yesterdayStr = yesterday.toISOString().split("T")[0]

  let currentStreak = streak.current_streak

  // If the last submission was today, don't update the streak
  if (lastSubmissionDateStr === todayStr) {
    return
  }

  // If the last submission was yesterday, increment the streak
  if (lastSubmissionDateStr === yesterdayStr) {
    currentStreak += 1
  } else {
    // Otherwise, reset the streak to 1
    currentStreak = 1
  }

  // Update the streak record
  await supabase
    .from("streaks")
    .update({
      current_streak: currentStreak,
      longest_streak: Math.max(currentStreak, streak.longest_streak || 0),
      points: (streak.points || 0) + 10,
      last_submission_date: today.toISOString(),
    })
    .eq("user_email", userEmail)
}
