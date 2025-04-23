import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export async function GET(request: Request) {
  const supabase = createRouteHandlerClient({ cookies })
  const { searchParams } = new URL(request.url)
  const email = searchParams.get("email")

  if (!email) {
    return Response.json({ error: "Email parameter is required" }, { status: 400 })
  }

  try {
    // Get user's streak data
    const { data, error } = await supabase
      .from("streaks")
      .select("current_streak, longest_streak, points, last_submission_date")
      .eq("user_email", email)
      .single()

    if (error) {
      // If no record found, return default values
      if (error.code === "PGRST116") {
        return Response.json({
          currentStreak: 0,
          longestStreak: 0,
          submissionCount: 0,
          points: 0,
          lastSubmissionDate: null,
        })
      }
      throw error
    }

    // Get submission count
    const { count, error: countError } = await supabase
      .from("submissions")
      .select("*", { count: "exact", head: true })
      .eq("email", email)

    if (countError) {
      throw countError
    }

    // Format response
    return Response.json({
      currentStreak: data.current_streak || 0,
      longestStreak: data.longest_streak || 0,
      submissionCount: count || 0,
      points: data.points || 0,
      lastSubmissionDate: data.last_submission_date,
    })
  } catch (error) {
    console.error("Error fetching user streak:", error)
    return Response.json({ error: "Failed to fetch user streak" }, { status: 500 })
  }
}
