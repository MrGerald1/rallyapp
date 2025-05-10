import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = createServerSupabaseClient()

    // Fetch blueprint
    const { data, error } = await supabase.from("blueprints").select("*").eq("id", params.id).single()

    if (error) {
      console.error("Error fetching blueprint:", error)
      if (error.code === "PGRST116") {
        return NextResponse.json({ error: "Blueprint not found" }, { status: 404 })
      }
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error("Unexpected error in GET /api/blueprints/[id]:", error)
    return NextResponse.json({ error: "Failed to fetch blueprint" }, { status: 500 })
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = createServerSupabaseClient()
    const blueprintData = await request.json()

    // Update blueprint
    const { data, error } = await supabase
      .from("blueprints")
      .update({
        ...blueprintData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", params.id)
      .select()
      .single()

    if (error) {
      console.error("Error updating blueprint:", error)
      if (error.code === "PGRST116") {
        return NextResponse.json({ error: "Blueprint not found" }, { status: 404 })
      }
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error("Unexpected error in PATCH /api/blueprints/[id]:", error)
    return NextResponse.json({ error: "Failed to update blueprint" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  // Redirect PUT requests to PATCH for compatibility
  return PATCH(request, { params })
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = createServerSupabaseClient()

    // Delete blueprint
    const { error } = await supabase.from("blueprints").delete().eq("id", params.id)

    if (error) {
      console.error("Error deleting blueprint:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Unexpected error in DELETE /api/blueprints/[id]:", error)
    return NextResponse.json({ error: "Failed to delete blueprint" }, { status: 500 })
  }
}

// Add OPTIONS method to handle preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      Allow: "GET, PATCH, PUT, DELETE, OPTIONS, HEAD",
      "Access-Control-Allow-Methods": "GET, PATCH, PUT, DELETE, OPTIONS, HEAD",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  })
}

// Add HEAD method to handle HEAD requests
export async function HEAD(request: Request, { params }: { params: { id: string } }) {
  return new NextResponse(null, { status: 200 })
}
