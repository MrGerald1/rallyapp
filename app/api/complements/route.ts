import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const toEmail = searchParams.get("to")
  const fromEmail = searchParams.get("from")
  const challengeId = searchParams.get("challenge")

  if (!toEmail && !fromEmail && !challengeId) {
    return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
  }

  try {
    const supabase = createRouteHandlerClient({ cookies })

    let query = supabase.from("complements").select(`
        id,
        from_user_email,
        to_user_email,
        challenge_id,
        message,
        created_at
      `)

    if (toEmail) {
      query = query.eq("to_user_email", toEmail)
    }

    if (fromEmail) {
      query = query.eq("from_user_email", fromEmail)
    }

    if (challengeId) {
      query = query.eq("challenge_id", challengeId)
    }

    // Get challenge titles for each complement
    const { data: complements, error } = await query.order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching complements:", error)
      return NextResponse.json({ error: "Failed to fetch complements" }, { status: 500 })
    }

    // Get challenge titles
    if (complements && complements.length > 0) {
      const challengeIds = [...new Set(complements.map((c) => c.challenge_id))]

      const { data: challenges } = await supabase.from("challenges").select("id, title").in("id", challengeIds)

      const challengeMap =
        challenges?.reduce((acc, challenge) => {
          acc[challenge.id] = challenge.title
          return acc
        }, {}) || {}

      // Add challenge titles to complements
      const complementsWithTitles = complements.map((complement) => ({
        ...complement,
        challenge_title: challengeMap[complement.challenge_id] || null,
      }))

      return NextResponse.json(complementsWithTitles)
    }

    return NextResponse.json(complements || [])
  } catch (error) {
    console.error("Error in complements API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { from_user_email, to_user_email, challenge_id, challenge_title, message } = await request.json()

    if (!from_user_email || !to_user_email || !challenge_id || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = createRouteHandlerClient({ cookies })

    const { data, error } = await supabase
      .from("complements")
      .insert({
        from_user_email,
        to_user_email,
        challenge_id,
        message,
      })
      .select()

    if (error) {
      console.error("Error creating complement:", error)

      // Check if it's a unique constraint violation (user already complemented this submission)
      if (error.code === "23505") {
        return NextResponse.json({ error: "You have already sent a complement for this challenge" }, { status: 409 })
      }

      return NextResponse.json({ error: "Failed to create complement" }, { status: 500 })
    }

    return NextResponse.json(data[0])
  } catch (error) {
    console.error("Error in complements API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
