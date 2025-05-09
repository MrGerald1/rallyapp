import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const blueprintId = params.id
    const supabase = createServerSupabaseClient()

    // First, set all blueprints to inactive
    const { error: updateAllError } = await supabase
      .from("blueprints")
      .update({ is_active: false })
      .neq("id", "placeholder") // Update all records

    if (updateAllError) {
      return NextResponse.json({ error: updateAllError.message }, { status: 500 })
    }

    // Then set the selected blueprint to active
    const { error: updateError } = await supabase.from("blueprints").update({ is_active: true }).eq("id", blueprintId)

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Error setting active blueprint:", error)
    return NextResponse.json({ error: "Failed to set active blueprint" }, { status: 500 })
  }
}
