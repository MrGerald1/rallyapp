// API functions to fetch data from the server
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
const supabase = createClient(supabaseUrl, supabaseKey)

export interface LeaderboardEntry {
  email: string
  points: number
  currentStreak: number
  longestStreak: number
}

export async function fetchChallengeSubmissions(challengeId: string) {
  try {
    const response = await fetch(`/api/challenges/${challengeId}/submissions`)

    if (!response.ok) {
      throw new Error(`Failed to fetch submissions: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching submissions:", error)
    throw error
  }
}

export async function fetchUserStreak(email: string) {
  try {
    const response = await fetch(`/api/streaks?email=${encodeURIComponent(email)}`)

    if (!response.ok) {
      throw new Error(`Failed to fetch user streak: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching user streak:", error)
    throw error
  }
}

export async function fetchWeeklyLeaderboard(email: string) {
  try {
    const response = await fetch(`/api/leaderboard/weekly?email=${encodeURIComponent(email)}`)

    if (!response.ok) {
      throw new Error(`Failed to fetch leaderboard: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching leaderboard:", error)
    throw error
  }
}

export async function setReminder(email: string) {
  try {
    const response = await fetch("/api/reminders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    })

    if (!response.ok) {
      throw new Error(`Failed to set reminder: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error setting reminder:", error)
    throw error
  }
}

export async function submitChallenge(challengeId: string, data: any) {
  try {
    const response = await fetch("/api/submissions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        challenge_id: challengeId,
        ...data,
      }),
    })

    if (!response.ok) {
      throw new Error(`Failed to submit challenge: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error submitting challenge:", error)
    throw error
  }
}

export async function sendCompliment(fromEmail: string, toEmail: string, challengeId: string, message: string) {
  try {
    // Generate a unique ID to avoid duplicate key errors
    const uniqueId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`

    const response = await fetch("/api/complements", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from_user_email: fromEmail,
        to_user_email: toEmail,
        challenge_id: challengeId,
        message,
        unique_id: uniqueId, // Add a unique ID to prevent duplicates
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || `Failed to send compliment: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error sending compliment:", error)
    throw error
  }
}
