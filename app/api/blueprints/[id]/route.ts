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

    // Get blueprint by ID
    const { data, error } = await supabase.from("blueprints").select("*").eq("id", params.id).single()

    if (error) {
      console.error(`Error fetching blueprint ${params.id}:`, error)

      if (error.code === "PGRST116") {
        return NextResponse.json({ error: "Blueprint not found" }, { status: 404 })
      }

      return NextResponse.json({ error: "Failed to fetch blueprint" }, { status: 500 })
    }

    return NextResponse.json({ blueprint: data })
  } catch (error) {
    console.error(`Unexpected error in blueprint ${params.id} route:`, error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (!params.id) {
      return NextResponse.json({ error: "Blueprint ID is required" }, { status: 400 })
    }

    const supabase = createRouteHandlerClient({ cookies })

    // Verify authentication
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    // Parse request body
    const body = await request.json()

    // Update blueprint
    const { data, error } = await supabase
      .from("blueprints")
      .update({
        title: body.title,
        description: body.description,
        duration_days: body.duration_days,
        start_date: body.start_date,
        whatsapp_link: body.whatsapp_link,
        is_active: body.is_active,
        updated_at: new Date().toISOString(),
      })
      .eq("id", params.id)
      .select()
      .single()

    if (error) {
      console.error(`Error updating blueprint ${params.id}:`, error)
      return NextResponse.json({ error: "Failed to update blueprint" }, { status: 500 })
    }

    return NextResponse.json({ blueprint: data })
  } catch (error) {
    console.error(`Unexpected error in blueprint ${params.id} PUT route:`, error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (!params.id) {
      return NextResponse.json({ error: "Blueprint ID is required" }, { status: 400 })
    }

    const supabase = createRouteHandlerClient({ cookies })

    // Parse request body
    const body = await request.json()

    // Update blueprint
    const { data, error } = await supabase
      .from("blueprints")
      .update({
        title: body.title,
        description: body.description,
        duration_days: body.duration_days,
        start_date: body.start_date,
        whatsapp_link: body.whatsapp_link,
        is_active: body.is_active,
        updated_at: new Date().toISOString(),
      })
      .eq("id", params.id)
      .select()
      .single()

    if (error) {
      console.error(`Error updating blueprint ${params.id}:`, error)
      return NextResponse.json({ error: "Failed to update blueprint" }, { status: 500 })
    }

    return NextResponse.json({ blueprint: data })
  } catch (error) {
    console.error(`Unexpected error in blueprint ${params.id} PATCH route:`, error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (!params.id) {
      return NextResponse.json({ error: "Blueprint ID is required" }, { status: 400 })
    }

    const supabase = createRouteHandlerClient({ cookies })

    // Verify authentication
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    // Delete blueprint
    const { error } = await supabase.from("blueprints").delete().eq("id", params.id)

    if (error) {
      console.error(`Error deleting blueprint ${params.id}:`, error)
      return NextResponse.json({ error: "Failed to delete blueprint" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(`Unexpected error in blueprint ${params.id} DELETE route:`, error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}

// Add OPTIONS method to handle preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Methods": "GET, PUT, PATCH, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Allow-Origin": "*",
    },
  })
}
