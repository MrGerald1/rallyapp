import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const taskId = formData.get("taskId") as string
    const enrollmentId = formData.get("enrollmentId") as string

    if (!file || !taskId || !enrollmentId) {
      return NextResponse.json({ error: "Missing required fields: file, taskId, enrollmentId" }, { status: 400 })
    }

    // Check file size (limit to 10MB)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: "File size exceeds the 10MB limit" }, { status: 400 })
    }

    const supabase = createServerSupabaseClient()

    // Get the enrollment to verify it exists
    const { data: enrollment, error: enrollmentError } = await supabase
      .from("user_blueprint_enrollments")
      .select("*")
      .eq("id", enrollmentId)
      .single()

    if (enrollmentError) {
      console.error("Error fetching enrollment:", enrollmentError)
      return NextResponse.json({ error: "Enrollment not found" }, { status: 404 })
    }

    // Get the task to verify it exists
    const { data: task, error: taskError } = await supabase
      .from("blueprint_tasks")
      .select("*")
      .eq("id", taskId)
      .single()

    if (taskError) {
      console.error("Error fetching task:", taskError)
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    // Generate a unique file path
    const fileExt = file.name.split(".").pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`
    const filePath = `blueprint-submissions/${enrollmentId}/${taskId}/${fileName}`

    // Upload file to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage.from("submissions").upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    })

    if (uploadError) {
      console.error("Error uploading file:", uploadError)
      return NextResponse.json({ error: "Failed to upload file" }, { status: 500 })
    }

    // Get the public URL
    const { data: publicUrlData } = supabase.storage.from("submissions").getPublicUrl(filePath)

    const publicUrl = publicUrlData.publicUrl

    // Return the file URL
    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
    })
  } catch (error: any) {
    console.error("Error uploading blueprint submission:", error)
    return NextResponse.json({ error: "Failed to upload submission" }, { status: 500 })
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
