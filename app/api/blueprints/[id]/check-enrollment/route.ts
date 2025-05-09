import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const blueprintId = params.id
  const searchParams = request.nextUrl.searchParams
  const email = searchParams.get("email")

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 })
  }

  try {
    const supabase = createRouteHandlerClient({ cookies })

    // Check if the user is already enrolled in this blueprint
    const { data, error } = await supabase
      .from("user_blueprint_enrollments")
      .select("id")
      .eq("blueprint_id", blueprintId)
      .eq("user_email", email)
      .maybeSingle()

    if (error) {
      console.error("Error checking enrollment:", error)
      return NextResponse.json({ error: "Failed to check enrollment" }, { status: 500 })
    }

    return NextResponse.json({ enrolled: !!data })
  } catch (error) {
    console.error("Error checking enrollment:", error)
    return NextResponse.json({ error: "Failed to check enrollment" }, { status: 500 })
  }
}
