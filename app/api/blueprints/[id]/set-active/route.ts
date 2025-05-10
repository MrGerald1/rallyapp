import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const blueprintId = params.id

    if (!blueprintId) {
      return NextResponse.json({ error: "Missing blueprint ID" }, { status: 400 })
    }

    const supabase = createServerSupabaseClient()

    // First, set all blueprints to inactive
    const { error: updateAllError } = await supabase.from("blueprints").update({ is_active: false })

    if (updateAllError) {
      console.error("Error updating all blueprints:", updateAllError)
      return NextResponse.json({ error: "Failed to update blueprints" }, { status: 500 })
    }

    // Then, set the specified blueprint to active
    const { data, error } = await supabase
      .from("blueprints")
      .update({ is_active: true })
      .eq("id", blueprintId)
      .select()
      .single()

    if (error) {
      console.error("Error setting blueprint active:", error)
      return NextResponse.json({ error: "Failed to set blueprint active" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      blueprint: data,
    })
  } catch (error: any) {
    console.error("Error setting blueprint active:", error)
    return NextResponse.json({ error: "Failed to set blueprint active" }, { status: 500 })
  }
}

// Add OPTIONS method to handle preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS, HEAD",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Max-Age": "86400",
    },
  })
}

// Add HEAD method to handle HEAD requests
export async function HEAD() {
  return new NextResponse(null, { status: 200 })
}
