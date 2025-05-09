import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function POST(request: Request) {
  try {
    const supabase = createServerSupabaseClient()
    const formData = await request.formData()

    const file = formData.get("file") as File
    const email = formData.get("email") as string
    const taskId = formData.get("taskId") as string

    if (!file || !email || !taskId) {
      return NextResponse.json({ error: "Missing required fields: file, email, or taskId" }, { status: 400 })
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: "File size exceeds the 10MB limit" }, { status: 400 })
    }

    // Generate a unique filename
    const timestamp = Date.now()
    const fileExtension = file.name.split(".").pop()
    const fileName = `blueprint-submissions/${email.replace("@", "_at_")}/${taskId}_${timestamp}.${fileExtension}`

    // Upload file to Supabase Storage
    const { data, error } = await supabase.storage.from("rallybucket").upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    })

    if (error) {
      console.error("Error uploading file:", error)
      return NextResponse.json({ error: "Failed to upload file" }, { status: 500 })
    }

    // Get the public URL
    const { data: publicUrlData } = supabase.storage.from("rallybucket").getPublicUrl(fileName)

    return NextResponse.json({
      success: true,
      fileUrl: publicUrlData.publicUrl,
      fileName: file.name,
      filePath: fileName,
    })
  } catch (error: any) {
    console.error("Error in file upload:", error)
    return NextResponse.json({ error: "Failed to process file upload" }, { status: 500 })
  }
}
