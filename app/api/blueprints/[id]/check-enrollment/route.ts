import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (!params.id) {
      return NextResponse.json({ error: "Blueprint ID is required" }, { status: 400 })
    }

    const supabase = createRouteHandlerClient({ cookies })
    const { searchParams } = new URL(request.url)
    const email = searchParams.get("email")

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // Check if user is enrolled in this blueprint
    const { data: enrollment, error } = await supabase
      .from("user_blueprint_enrollments")
      .select("*")
      .eq("blueprint_id", params.id)
      .eq("user_email", email)
      .single()

    if (error && error.code !== "PGRST116") {
      console.error(`Error checking enrollment for ${email} in blueprint ${params.id}:`, error)
      return NextResponse.json({ error: "Failed to check enrollment" }, { status: 500 })
    }

    return NextResponse.json({
      enrolled: !!enrollment,
      enrollment: enrollment || null,
    })
  } catch (error) {
    console.error(`Unexpected error in check enrollment route:`, error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Allow-Origin": "*",
    },
  })
}
