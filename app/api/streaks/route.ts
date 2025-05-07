import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const email = url.searchParams.get("email")

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const supabase = createServerSupabaseClient()

    // Get all submission dates for this email
    const { data, error } = await supabase
      .from("submissions")
      .select("created_at")
      .eq("email", email)
      .order("created_at", { ascending: true })

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Calculate streak
    let currentStreak = 0
    let longestStreak = 0
    let lastDate: Date | null = null

    if (data && data.length > 0) {
      // Convert submission dates to local date strings (without time)
      const submissionDates = data.map((submission) => {
        const date = new Date(submission.created_at)
        return date.toISOString().split("T")[0]
      })

      // Remove duplicates (multiple submissions on same day)
      const uniqueDates = [...new Set(submissionDates)].sort()

      // Calculate current streak
      currentStreak = 1 // Start with 1 for the first submission
      longestStreak = 1

      for (let i = 1; i < uniqueDates.length; i++) {
        const currentDate = new Date(uniqueDates[i])
        const previousDate = new Date(uniqueDates[i - 1])

        // Add one day to previous date
        previousDate.setDate(previousDate.getDate() + 1)

        if (currentDate.toISOString().split("T")[0] === previousDate.toISOString().split("T")[0]) {
          // Consecutive day
          currentStreak++
        } else {
          // Streak broken
          if (currentStreak > longestStreak) {
            longestStreak = currentStreak
          }
          currentStreak = 1
        }
      }

      // Check if current streak is the longest
      if (currentStreak > longestStreak) {
        longestStreak = currentStreak
      }

      // Check if the streak is still active (last submission was today or yesterday)
      const lastSubmissionDate = new Date(uniqueDates[uniqueDates.length - 1])
      const today = new Date()
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)

      // Convert to date strings for comparison
      const todayString = today.toISOString().split("T")[0]
      const yesterdayString = yesterday.toISOString().split("T")[0]
      const lastSubmissionString = lastSubmissionDate.toISOString().split("T")[0]

      // If last submission wasn't today or yesterday, streak is broken
      if (lastSubmissionString !== todayString && lastSubmissionString !== yesterdayString) {
        currentStreak = 0
      }

      lastDate = lastSubmissionDate
    }

    return NextResponse.json({
      currentStreak,
      longestStreak,
      lastSubmissionDate: lastDate ? lastDate.toISOString() : null,
      submissionCount: data.length,
    })
  } catch (error: any) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}
