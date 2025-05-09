import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export async function GET(request: Request) {
  const supabase = createRouteHandlerClient({ cookies })

  try {
    // Get current week's start date (Sunday)
    const today = new Date()
    const startOfWeek = new Date(today)
    startOfWeek.setDate(today.getDate() - today.getDay()) // Go to Sunday
    startOfWeek.setHours(0, 0, 0, 0)

    // Get submissions from this week
    const { data: weeklySubmissions, error: submissionsError } = await supabase
      .from("submissions")
      .select("email")
      .gte("created_at", startOfWeek.toISOString())

    if (submissionsError) {
      console.error("Error fetching submissions:", submissionsError)
      return Response.json([])
    }

    // Get unique emails from this week's submissions
    const weeklyEmails = [...new Set(weeklySubmissions.map((sub) => sub.email))]

    if (weeklyEmails.length === 0) {
      return Response.json([])
    }

    // Get streak data for users who submitted this week
    const { data: streakData, error: streakError } = await supabase
      .from("streaks")
      .select("user_email, points, current_streak, longest_streak")
      .in("user_email", weeklyEmails)
      .order("points", { ascending: false })

    if (streakError) {
      console.error("Error fetching streak data:", streakError)
      return Response.json([])
    }

    if (!streakData || !Array.isArray(streakData)) {
      return Response.json([])
    }

    // Format the leaderboard data
    const leaderboard = streakData.map((entry, index) => ({
      email: entry.user_email || "",
      name: entry.user_email ? entry.user_email.split("@")[0] : "User", // Simple name extraction
      points: entry.points || 0,
      currentStreak: entry.current_streak || 0,
      position: index + 1,
    }))

    return Response.json(leaderboard)
  } catch (error) {
    console.error("Error fetching weekly leaderboard:", error)
    return Response.json([])
  }
}
