import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"
export const revalidate = 0

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  })
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (!params.id) {
      return NextResponse.json(
        { error: "Blueprint ID is required" },
        {
          status: 400,
          headers: corsHeaders,
        },
      )
    }

    const { searchParams } = new URL(request.url)
    const email = searchParams.get("email")

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        {
          status: 400,
          headers: corsHeaders,
        },
      )
    }

    const supabase = createRouteHandlerClient({ cookies })

    // Check if user is enrolled
    const { data: enrollment, error } = await supabase
      .from("user_blueprint_enrollments")
      .select("id, current_day, completed")
      .eq("blueprint_id", params.id)
      .eq("user_email", email)
      .single()

    if (error && error.code !== "PGRST116") {
      console.error(`Error checking enrollment:`, error)
      return NextResponse.json(
        { error: "Failed to check enrollment" },
        {
          status: 500,
          headers: corsHeaders,
        },
      )
    }

    return NextResponse.json(
      {
        enrolled: !!enrollment,
        enrollment: enrollment || null,
      },
      { headers: corsHeaders },
    )
  } catch (error) {
    console.error(`Unexpected error in check enrollment route:`, error)
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      {
        status: 500,
        headers: corsHeaders,
      },
    )
  }
}
