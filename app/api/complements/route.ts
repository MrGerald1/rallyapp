import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

import type { Database } from "@/lib/database.types"

export async function GET(request: Request) {
  const searchParams = new URL(request.url).searchParams
  const toEmail = searchParams.get("to")
  const fromEmail = searchParams.get("from")
  const challengeId = searchParams.get("challenge")
  const unread = searchParams.get("unread") === "true"

  if (!toEmail && !fromEmail && !challengeId) {
    return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
  }

  try {
    const supabase = createServerSupabaseClient()

    let query = supabase.from("complements").select(`
        id,
        from_user_email,
        to_user_email,
        challenge_id,
        message,
        created_at,
        submission_id
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
      const challengeIds = [...new Set(complements.map((c) => c.challenge_id).filter(Boolean))]

      if (challengeIds.length > 0) {
        const { data: challenges } = await supabase.from("challenges").select("id, title").in("id", challengeIds)

        const challengeMap =
          challenges?.reduce((acc, challenge) => {
            acc[challenge.id] = challenge.title
            return acc
          }, {}) || {}

        // Add challenge titles to complements
        const complementsWithTitles = complements.map((complement) => ({
          ...complement,
          challenge_title: complement.challenge_id ? challengeMap[complement.challenge_id] || null : null,
        }))

        return NextResponse.json(complementsWithTitles)
      }
    }

    return NextResponse.json(complements || [])
  } catch (error) {
    console.error("Error in complements API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const { from_user_email, to_user_email, message, challenge_id, submission_id } = await req.json()

    // Validate required fields
    if (!from_user_email || !to_user_email || !message) {
      return Response.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = createRouteHandlerClient<Database>({ cookies })

    // Insert the complement
    const { data, error } = await supabase
      .from("complements")
      .insert({
        from_user_email,
        to_user_email,
        message,
        challenge_id,
        submission_id: submission_id || null,
      })
      .select()

    if (error) {
      console.error("Error creating complement:", error)
      return Response.json({ error: error.message }, { status: 500 })
    }

    return Response.json({ success: true, data })
  } catch (error) {
    console.error("Error in complement route:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
