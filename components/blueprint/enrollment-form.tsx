"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

export function EnrollmentForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone_number: "",
    project_idea: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [blueprintId, setBlueprintId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [alreadyEnrolled, setAlreadyEnrolled] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Fetch the active blueprint ID when the component mounts
    const fetchActiveBlueprintId = async () => {
      try {
        setIsLoading(true)
        setError(null)
        console.log("Fetching active blueprint...")

        const response = await fetch("/api/blueprints/active", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            // Add cache busting
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
            Expires: "0",
          },
        })

        if (!response.ok) {
          console.error("Error response status:", response.status)
          const errorText = await response.text()
          console.error("Error response text:", errorText)

          let errorData
          try {
            errorData = JSON.parse(errorText)
          } catch (e) {
            errorData = { error: `Failed to fetch active blueprint: ${response.status}` }
          }

          throw new Error(errorData.error || "Failed to fetch active blueprint")
        }

        const data = await response.json()
        console.log("Fetched active blueprint:", data)

        if (!data || !data.id) {
          console.warn("No active blueprint found")
          setError("No active blueprint available")
          return
        }

        setBlueprintId(data.id)

        // Check if user is already enrolled
        const email = localStorage.getItem("rally_user_email")
        if (email) {
          console.log(`Checking enrollment for email: ${email}`)

          const checkResponse = await fetch(
            `/api/blueprints/${data.id}/check-enrollment?email=${encodeURIComponent(email)}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                // Add cache busting
                "Cache-Control": "no-cache, no-store, must-revalidate",
                Pragma: "no-cache",
                Expires: "0",
              },
            },
          )

          if (!checkResponse.ok) {
            console.error("Error checking enrollment:", checkResponse.status)
            // Continue without enrollment check
          } else {
            const checkData = await checkResponse.json()
            console.log("Enrollment check result:", checkData)
            setAlreadyEnrolled(checkData.enrolled)

            if (checkData.enrolled) {
              toast.info("You're already enrolled in this blueprint!")
            }
          }
        }
      } catch (error: any) {
        console.error("Error fetching active blueprint:", error)
        setError(error.message || "Could not load enrollment information")
        toast.error("Could not load enrollment information: " + (error.message || "Unknown error"))
      } finally {
        setIsLoading(false)
      }
    }

    fetchActiveBlueprintId()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!blueprintId) {
      toast.error("No active blueprint found. Please try again later.")
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      console.log("Submitting enrollment to blueprint:", blueprintId)

      // Check if user is already enrolled
      const checkResponse = await fetch(
        `/api/blueprints/${blueprintId}/check-enrollment?email=${encodeURIComponent(formData.email)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            // Add cache busting
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
            Expires: "0",
          },
        },
      )

      if (!checkResponse.ok) {
        console.error("Error checking enrollment:", checkResponse.status)
        const errorText = await checkResponse.text()
        console.error("Error response:", errorText)
        let errorData
        try {
          errorData = JSON.parse(errorText)
        } catch (e) {
          errorData = { error: `Failed to check enrollment: ${checkResponse.status}` }
        }
        throw new Error(errorData.error || "Failed to check enrollment")
      }

      const checkData = await checkResponse.json()
      console.log("Enrollment check result:", checkData)

      if (checkData.enrolled) {
        setAlreadyEnrolled(true)
        toast.info("You're already enrolled in this blueprint!")
        setShowSuccessDialog(true)

        // Store user info in localStorage
        localStorage.setItem("rally_user_name", formData.name)
        localStorage.setItem("rally_user_email", formData.email)

        return
      }

      console.log("Submitting enrollment form data:", formData)
      const response = await fetch(`/api/blueprints/${blueprintId}/enroll`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      console.log("Enrollment response status:", response.status)
      const responseText = await response.text()
      console.log("Enrollment response text:", responseText)

      let data
      try {
        data = JSON.parse(responseText)
      } catch (e) {
        console.error("Error parsing JSON response:", e)
        throw new Error("Invalid response from server")
      }

      console.log("Enrollment response data:", data)

      if (!response.ok) {
        throw new Error(data.error || "Failed to enroll")
      }

      // Store user info in localStorage for future use
      localStorage.setItem("rally_user_name", formData.name)
      localStorage.setItem("rally_user_email", formData.email)

      // Show success dialog
      setShowSuccessDialog(true)
      toast.success("Successfully enrolled in blueprint!")
    } catch (error: any) {
      console.error("Enrollment error:", error)
      setError(error.message || "Failed to enroll. Please try again.")
      toast.error(error.message || "Failed to enroll. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone_number: "",
      project_idea: "",
    })
  }

  return (
    <>
      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading enrollment form...</span>
        </div>
      ) : error ? (
        <div className="text-center py-6">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      ) : !blueprintId ? (
        <div className="text-center py-6">
          <p className="text-muted-foreground">No active blueprint available for enrollment at this time.</p>
        </div>
      ) : alreadyEnrolled ? (
        <div className="text-center py-6">
          <p className="text-muted-foreground mb-4">You're already enrolled in this blueprint!</p>
          <Button onClick={() => setShowSuccessDialog(true)}>View Community Link</Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Your Name
            </label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email Address
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="phone_number" className="text-sm font-medium">
              Phone Number (WhatsApp)
            </label>
            <Input
              id="phone_number"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              placeholder="+234..."
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="project_idea" className="text-sm font-medium">
              My Idea/Project Focus
            </label>
            <Textarea
              id="project_idea"
              name="project_idea"
              value={formData.project_idea}
              onChange={handleChange}
              placeholder="Briefly describe the idea or project you want to launch in 26 days..."
              rows={4}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Enrolling...
              </>
            ) : (
              "Enroll Now"
            )}
          </Button>
        </form>
      )}

      <Dialog
        open={showSuccessDialog}
        onOpenChange={(open) => {
          setShowSuccessDialog(open)
          if (!open && !alreadyEnrolled) resetForm()
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{alreadyEnrolled ? "Already Enrolled" : "Enrollment Successful!"}</DialogTitle>
            <DialogDescription>
              {alreadyEnrolled
                ? "You're already enrolled in the 26-Day Idea Launch Blueprint."
                : "You've successfully enrolled in the 26-Day Idea Launch Blueprint."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p>
              {alreadyEnrolled
                ? "Continue your journey with us!"
                : `Thank you for enrolling, ${formData.name}! Watch out for more information in your inbox.`}
            </p>
            <div className="rounded-lg bg-primary/10 p-4">
              <h3 className="mb-2 font-semibold">Next Steps:</h3>
              <ol className="space-y-2 pl-5 text-sm">
                <li>Join our community using the link below</li>
                <li>Log in to Rally daily to complete your tasks</li>
                <li>Share your progress with the community</li>
              </ol>
            </div>
            <Button
              className="w-full"
              onClick={() => {
                setShowSuccessDialog(false)
                if (!alreadyEnrolled) resetForm()
              }}
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
