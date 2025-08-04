import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (!params.id) {
      return NextResponse.json({ error: "Blueprint ID is required" }, { status: 400 })
    }

    const supabase = createRouteHandlerClient({ cookies })

    // Parse request body
    const body = await request.json()
    const { name, email, phone_number, project_idea } = body

    // Validate required fields
    if (!name || !email || !phone_number || !project_idea) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    // Check if the blueprint exists and is active
    const { data: blueprint, error: blueprintError } = await supabase
      .from("blueprints")
      .select("id, title, is_active")
      .eq("id", params.id)
      .single()

    if (blueprintError || !blueprint) {
      console.error(`Blueprint ${params.id} not found:`, blueprintError)
      return NextResponse.json({ error: "Blueprint not found" }, { status: 404 })
    }

    if (!blueprint.is_active) {
      return NextResponse.json({ error: "Blueprint is not currently active" }, { status: 400 })
    }

    // Check if user is already enrolled
    const { data: existingEnrollment, error: enrollmentCheckError } = await supabase
      .from("user_blueprint_enrollments")
      .select("id")
      .eq("blueprint_id", params.id)
      .eq("user_email", email)
      .single()

    if (existingEnrollment) {
      return NextResponse.json({
        success: true,
        message: "Already enrolled",
        enrollment: existingEnrollment,
      })
    }

    // Create new enrollment
    const { data: enrollment, error: insertError } = await supabase
      .from("user_blueprint_enrollments")
      .insert({
        blueprint_id: params.id,
        user_email: email,
        phone_number: phone_number,
        project_idea: project_idea,
        current_day: 1,
        start_date: new Date().toISOString().split("T")[0],
        completed: false,
      })
      .select()
      .single()

    if (insertError) {
      console.error(`Error enrolling user ${email} in blueprint ${params.id}:`, insertError)
      return NextResponse.json({ error: "Failed to enroll in blueprint" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "Successfully enrolled",
      enrollment,
    })
  } catch (error) {
    console.error(`Unexpected error in blueprint enrollment route:`, error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}

// Add OPTIONS method to handle preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Allow-Origin": "*",
    },
  })
}
