import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const blueprintId = params.id

    if (!blueprintId) {
      return NextResponse.json({ error: "Missing blueprint ID" }, { status: 400 })
    }

    const supabase = createServerSupabaseClient()

    // Get tasks for this blueprint
    const { data, error } = await supabase
      .from("blueprint_tasks")
      .select("*")
      .eq("blueprint_id", blueprintId)
      .order("day_number", { ascending: true })

    if (error) {
      console.error("Error fetching blueprint tasks:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error("Unexpected error in GET /api/blueprints/[id]/tasks:", error)
    return NextResponse.json({ error: "Failed to fetch blueprint tasks" }, { status: 500 })
  }
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const blueprintId = params.id

    if (!blueprintId) {
      return NextResponse.json({ error: "Missing blueprint ID" }, { status: 400 })
    }

    const taskData = await request.json()
    taskData.blueprint_id = blueprintId

    const supabase = createServerSupabaseClient()

    // Create task
    const { data, error } = await supabase.from("blueprint_tasks").insert(taskData).select().single()

    if (error) {
      console.error("Error creating blueprint task:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error("Unexpected error in POST /api/blueprints/[id]/tasks:", error)
    return NextResponse.json({ error: "Failed to create blueprint task" }, { status: 500 })
  }
}

// Add OPTIONS method to handle preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS, HEAD",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Max-Age": "86400",
    },
  })
}

// Add HEAD method to handle HEAD requests
export async function HEAD() {
  return new NextResponse(null, { status: 200 })
}
