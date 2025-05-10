import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get("email")
    const blueprintId = params.id

    if (!email) {
      return NextResponse.json({ error: "Email parameter is required" }, { status: 400 })
    }

    if (!blueprintId) {
      return NextResponse.json({ error: "Blueprint ID is required" }, { status: 400 })
    }

    const supabase = createServerSupabaseClient()

    // Check if user is enrolled in this blueprint
    const { data, error } = await supabase
      .from("user_blueprint_enrollments")
      .select("*")
      .eq("user_email", email)
      .eq("blueprint_id", blueprintId)
      .maybeSingle()

    if (error) {
      console.error("Error checking enrollment:", error)
      return NextResponse.json({ error: "Failed to check enrollment" }, { status: 500 })
    }

    return NextResponse.json({
      enrolled: !!data,
      enrollment: data || null,
    })
  } catch (error: any) {
    console.error("Error checking enrollment:", error)
    return NextResponse.json({ error: "Failed to check enrollment" }, { status: 500 })
  }
}

// Add OPTIONS method to handle preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS, HEAD",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Max-Age": "86400",
    },
  })
}

// Add HEAD method to handle HEAD requests
export async function HEAD() {
  return new NextResponse(null, { status: 200 })
}
