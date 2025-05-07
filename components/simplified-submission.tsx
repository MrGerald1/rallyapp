"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useChallengeStore } from "@/lib/store"
import { toast } from "sonner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, LinkIcon, AlertTriangle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface SimplifiedSubmissionProps {
  challengeId: string
  onSuccess: (submissionId: string) => void
}

export function SimplifiedSubmission({ challengeId, onSuccess }: SimplifiedSubmissionProps) {
  const [name, setName] = useState<string>(localStorage.getItem("rally_user_name") || "")
  const [email, setEmail] = useState<string>(localStorage.getItem("rally_user_email") || "")
  const [media, setMedia] = useState<File | null>(null)
  const [link, setLink] = useState<string>("")
  const [isUploading, setIsUploading] = useState<boolean>(false)
  const [submissionType, setSubmissionType] = useState<"upload" | "link">("upload")
  const [sizeError, setSizeError] = useState<boolean>(false)
  const [validationErrors, setValidationErrors] = useState<{
    name?: string
    email?: string
    media?: string
    link?: string
  }>({})
  const { addSubmission } = useChallengeStore()

  // Clear validation errors when fields change
  useEffect(() => {
    if (name) setValidationErrors((prev) => ({ ...prev, name: undefined }))
  }, [name])

  useEffect(() => {
    if (email) setValidationErrors((prev) => ({ ...prev, email: undefined }))
  }, [email])

  useEffect(() => {
    if (media) setValidationErrors((prev) => ({ ...prev, media: undefined }))
  }, [media])

  useEffect(() => {
    if (link) setValidationErrors((prev) => ({ ...prev, link: undefined }))
  }, [link])

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0]

      // Clear previous errors
      setSizeError(false)
      setValidationErrors((prev) => ({ ...prev, media: undefined }))

      // Check file size (5MB limit)
      const FIVE_MB = 5 * 1024 * 1024 // 5MB in bytes
      if (selectedFile.size > FIVE_MB) {
        // Show error message
        setSizeError(true)
        toast.error("File size exceeds 5MB limit. Please choose a smaller file.")
        e.target.value = "" // Clear the input
        return
      }

      setMedia(selectedFile)
    }
  }

  const validateForm = (): boolean => {
    const errors: {
      name?: string
      email?: string
      media?: string
      link?: string
    } = {}

    if (!name.trim()) {
      errors.name = "Please enter your name"
    }

    if (!email.trim()) {
      errors.email = "Please enter your email"
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Please enter a valid email address"
    }

    if (submissionType === "upload" && !media) {
      errors.media = "Please upload a file"
    }

    if (submissionType === "link" && !link.trim()) {
      errors.link = "Please enter a link to your submission"
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (!validateForm()) {
      // Show toast for the first error
      const firstError = Object.values(validationErrors)[0]
      if (firstError) {
        toast.error(firstError)
      }
      return
    }

    try {
      setIsUploading(true)

      // Store user info in localStorage
      localStorage.setItem("rally_user_name", name)
      localStorage.setItem("rally_user_email", email)

      let submission_link = ""

      // Handle submission based on type
      if (submissionType === "upload" && media) {
        const formData = new FormData()
        formData.append("file", media)

        // Upload to our own API endpoint
        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })

        if (!uploadResponse.ok) {
          const errorData = await uploadResponse.json().catch(() => ({}))

          // Check if it's a file size error from the server
          if (errorData.error && errorData.error.includes("size")) {
            throw new Error("File size exceeds 5MB limit. Please choose a smaller file.")
          }

          throw new Error(errorData.error || "Failed to upload file")
        }

        const uploadData = await uploadResponse.json()
        submission_link = uploadData.url
      } else if (submissionType === "link") {
        submission_link = link
      }

      // Create submission data
      const submissionData = {
        name,
        handle: email, // For backward compatibility
        email,
        submission_link,
      }

      // Submit to Rally
      const result = await addSubmission(challengeId, submissionData)

      // Only call onSuccess if we have a valid result with an ID
      if (result && result.id) {
        onSuccess(result.id)
        toast.success("Challenge submitted successfully!")
      } else {
        // If we don't have a valid result, show a generic success message
        // This is a fallback for when the API doesn't return an ID but the submission was successful
        toast.success("Challenge submitted successfully!")

        // Generate a temporary ID for the submission
        const tempId = `temp-${Date.now()}`
        onSuccess(tempId)
      }
    } catch (error: any) {
      console.error("Error submitting:", error)
      toast.error(error.message || "Failed to submit your challenge. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium">
          Your Name
        </label>
        <Input
          type="text"
          id="name"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={validationErrors.name ? "border-red-300 focus:ring-red-500" : ""}
          aria-invalid={!!validationErrors.name}
          aria-describedby={validationErrors.name ? "name-error" : undefined}
        />
        {validationErrors.name && (
          <p id="name-error" className="text-xs text-red-500 mt-1">
            {validationErrors.name}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium">
          Your Email
        </label>
        <Input
          type="email"
          id="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={validationErrors.email ? "border-red-300 focus:ring-red-500" : ""}
          aria-invalid={!!validationErrors.email}
          aria-describedby={validationErrors.email ? "email-error" : undefined}
        />
        {validationErrors.email && (
          <p id="email-error" className="text-xs text-red-500 mt-1">
            {validationErrors.email}
          </p>
        )}
      </div>

      <Tabs
        value={submissionType}
        onValueChange={(value) => setSubmissionType(value as "upload" | "link")}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload" className="flex items-center">
            <Upload className="mr-2 h-4 w-4" />
            Upload Media
          </TabsTrigger>
          <TabsTrigger value="link" className="flex items-center">
            <LinkIcon className="mr-2 h-4 w-4" />
            Submit Link
          </TabsTrigger>
        </TabsList>
        <TabsContent value="upload" className="space-y-2 pt-2">
          {/* File size warning banner */}
          <Alert variant="warning" className="bg-secondary/10 border-secondary/30">
            <AlertTriangle className="h-4 w-4 text-foreground" />
            <AlertDescription className="text-xs text-foreground">
              Maximum file size: 5MB. Supported formats: Images, GIFs, Videos
            </AlertDescription>
          </Alert>

          {/* Error message if file is too large */}
          {sizeError && (
            <Alert variant="destructive" className="bg-red-50 border-red-200 py-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-xs text-red-600 font-medium">
                File too large! Please select a file under 5MB.
              </AlertDescription>
            </Alert>
          )}

          <Input
            type="file"
            id="media"
            accept="image/*,video/*,.gif"
            onChange={handleMediaChange}
            className={`bg-white ${validationErrors.media ? "border-red-300" : ""}`}
            aria-invalid={!!validationErrors.media}
            aria-describedby={validationErrors.media ? "media-error" : undefined}
          />
          {validationErrors.media ? (
            <p id="media-error" className="text-xs text-red-500">
              {validationErrors.media}
            </p>
          ) : (
            <p className="text-xs text-muted-foreground">Upload your submission (JPEG, PNG, GIF, MP4, etc.)</p>
          )}
        </TabsContent>
        <TabsContent value="link" className="space-y-2 pt-2">
          <Input
            type="url"
            id="link"
            placeholder="https://example.com/my-submission"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            className={`bg-white ${validationErrors.link ? "border-red-300" : ""}`}
            aria-invalid={!!validationErrors.link}
            aria-describedby={validationErrors.link ? "link-error" : undefined}
          />
          {validationErrors.link ? (
            <p id="link-error" className="text-xs text-red-500">
              {validationErrors.link}
            </p>
          ) : (
            <p className="text-xs text-muted-foreground">Link to your submission on Instagram, Twitter, etc.</p>
          )}
        </TabsContent>
      </Tabs>

      <Button type="submit" disabled={isUploading} className="w-full bg-primary text-foreground hover:bg-primary/90">
        {isUploading ? "Submitting..." : "Submit My Challenge"}
      </Button>
    </form>
  )
}
