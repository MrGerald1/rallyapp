import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    console.log("Enrollment API called with blueprint ID:", params.id)

    if (!params.id) {
      return NextResponse.json({ error: "Blueprint ID is required" }, { status: 400 })
    }

    const supabase = createRouteHandlerClient({ cookies })

    // Parse request body
    let body
    try {
      body = await request.json()
      console.log("Request body:", body)
    } catch (error) {
      console.error("Error parsing request body:", error)
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
    }

    const { name, email, phone_number, project_idea } = body

    // Validate required fields
    if (!name || !email || !phone_number || !project_idea) {
      console.error("Missing required fields:", {
        name: !!name,
        email: !!email,
        phone_number: !!phone_number,
        project_idea: !!project_idea,
      })
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    // Check if the blueprint exists and is active
    const { data: blueprint, error: blueprintError } = await supabase
      .from("blueprints")
      .select("id, title, is_active")
      .eq("id", params.id)
      .single()

    if (blueprintError) {
      console.error(`Blueprint ${params.id} query error:`, blueprintError)
      return NextResponse.json({ error: "Blueprint not found" }, { status: 404 })
    }

    if (!blueprint) {
      console.error(`Blueprint ${params.id} not found`)
      return NextResponse.json({ error: "Blueprint not found" }, { status: 404 })
    }

    if (!blueprint.is_active) {
      console.error(`Blueprint ${params.id} is not active`)
      return NextResponse.json({ error: "Blueprint is not currently active" }, { status: 400 })
    }

    // Check if user is already enrolled
    const { data: existingEnrollment, error: enrollmentCheckError } = await supabase
      .from("user_blueprint_enrollments")
      .select("id")
      .eq("blueprint_id", params.id)
      .eq("user_email", email)
      .maybeSingle()

    if (enrollmentCheckError && enrollmentCheckError.code !== "PGRST116") {
      console.error("Error checking existing enrollment:", enrollmentCheckError)
      return NextResponse.json({ error: "Error checking enrollment status" }, { status: 500 })
    }

    if (existingEnrollment) {
      console.log("User already enrolled:", existingEnrollment)
      return NextResponse.json({
        success: true,
        message: "Already enrolled",
        enrollment: existingEnrollment,
      })
    }

    // Create new enrollment
    const enrollmentData = {
      blueprint_id: params.id,
      user_name: name,
      user_email: email,
      phone_number: phone_number,
      project_idea: project_idea,
      current_day: 1,
      start_date: new Date().toISOString().split("T")[0],
      completed: false,
      created_at: new Date().toISOString(),
    }

    console.log("Creating enrollment with data:", enrollmentData)

    const { data: enrollment, error: insertError } = await supabase
      .from("user_blueprint_enrollments")
      .insert(enrollmentData)
      .select()
      .single()

    if (insertError) {
      console.error(`Error enrolling user ${email} in blueprint ${params.id}:`, insertError)
      return NextResponse.json({ error: "Failed to enroll in blueprint" }, { status: 500 })
    }

    console.log("Enrollment successful:", enrollment)

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

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  })
}
