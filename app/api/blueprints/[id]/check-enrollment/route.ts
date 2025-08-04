import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    console.log("Check enrollment API called with blueprint ID:", params.id)

    if (!params.id) {
      return NextResponse.json({ error: "Blueprint ID is required" }, { status: 400 })
    }

    const { searchParams } = new URL(request.url)
    const email = searchParams.get("email")

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    console.log("Checking enrollment for email:", email)

    const supabase = createRouteHandlerClient({ cookies })

    // Check if user is enrolled
    const { data: enrollment, error: enrollmentError } = await supabase
      .from("user_blueprint_enrollments")
      .select("*")
      .eq("blueprint_id", params.id)
      .eq("user_email", email)
      .maybeSingle()

    if (enrollmentError && enrollmentError.code !== "PGRST116") {
      console.error("Error checking enrollment:", enrollmentError)
      return NextResponse.json({ error: "Error checking enrollment" }, { status: 500 })
    }

    const isEnrolled = !!enrollment
    console.log("Enrollment check result:", { enrolled: isEnrolled, enrollment })

    return NextResponse.json({
      enrolled: isEnrolled,
      enrollment: enrollment || null,
    })
  } catch (error) {
    console.error("Unexpected error in check enrollment route:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  })
}
