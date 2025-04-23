import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const challengeId = params.id
  const searchParams = request.nextUrl.searchParams
  const random = searchParams.get("random") === "true"
  const excludeEmail = searchParams.get("exclude")

  try {
    const supabase = createRouteHandlerClient({ cookies })

    let query = supabase.from("submissions").select("*").eq("challenge_id", challengeId)

    if (excludeEmail) {
      query = query.neq("user_email", excludeEmail)
    }

    if (random) {
      // Fetch a random submission
      query = query.order("created_at", { ascending: false }).limit(10)
      const { data, error } = await query

      if (error) {
        console.error("Error fetching submissions:", error)
        return NextResponse.json({ error: "Failed to fetch submissions" }, { status: 500 })
      }

      if (data && data.length > 0) {
        // Select a random submission from the results
        const randomIndex = Math.floor(Math.random() * data.length)
        return NextResponse.json([data[randomIndex]])
      }

      return NextResponse.json([])
    } else {
      // Regular fetch - return all submissions for this challenge
      const { data, error } = await query.order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching submissions:", error)
        return NextResponse.json({ error: "Failed to fetch submissions" }, { status: 500 })
      }

      return NextResponse.json(data || [])
    }
  } catch (error) {
    console.error("Error in submissions API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
