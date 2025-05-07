import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const userEmail = url.searchParams.get("email") || ""

    const supabase = createServerSupabaseClient()

    // Get the start of the current week (Monday)
    const today = new Date()
    const day = today.getDay()
    const diff = today.getDate() - day + (day === 0 ? -6 : 1) // Adjust when day is Sunday
    const startOfWeek = new Date(today.setDate(diff))
    startOfWeek.setHours(0, 0, 0, 0)

    console.log(`Fetching submissions since ${startOfWeek.toISOString()}`)

    // Query to get users with their streak counts for this week
    const { data, error } = await supabase
      .from("submissions")
      .select(`
        name,
        email,
        created_at
      `)
      .gte("created_at", startOfWeek.toISOString())
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Process the data to calculate streaks and create the leaderboard
    const userStreaks = new Map()

    // Group submissions by user and count unique days
    data?.forEach((submission) => {
      const email = submission.email
      const name = submission.name
      const date = new Date(submission.created_at).toISOString().split("T")[0] // Get date part only

      if (!userStreaks.has(email)) {
        userStreaks.set(email, { name, email, streak: 0, days: new Set() })
      }

      const user = userStreaks.get(email)
      user.days = user.days || new Set()
      user.days.add(date)
      user.streak = user.days.size
    })

    // Convert to array and sort by streak
    const leaderboard = Array.from(userStreaks.values())
      .map(({ name, email, streak }) => ({ name, email, streak }))
      .sort((a, b) => b.streak - a.streak)
      .slice(0, 10) // Get top 10
      .map((user, index) => ({ ...user, position: index + 1 }))

    // Find the user's position if they're not in the top 10
    let userPosition = null
    if (userEmail && !leaderboard.some((user) => user.email === userEmail)) {
      const allUsers = Array.from(userStreaks.values())
        .map(({ name, email, streak }) => ({ name, email, streak }))
        .sort((a, b) => b.streak - a.streak)

      const userIndex = allUsers.findIndex((user) => user.email === userEmail)
      if (userIndex !== -1) {
        userPosition = userIndex + 1
      }
    }

    return NextResponse.json({
      leaderboard,
      userPosition,
    })
  } catch (error: any) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}
