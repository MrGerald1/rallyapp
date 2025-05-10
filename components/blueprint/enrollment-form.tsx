"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

// WhatsApp community link
const WHATSAPP_COMMUNITY_LINK = "https://chat.whatsapp.com/E4eiorCbLb04GyqqKiB2M9"

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

  useEffect(() => {
    // Fetch the active blueprint ID when the component mounts
    const fetchActiveBlueprintId = async () => {
      try {
        const response = await fetch("/api/blueprints/active")
        if (!response.ok) {
          throw new Error("Failed to fetch active blueprint")
        }
        const data = await response.json()
        setBlueprintId(data.id)

        // Check if user is already enrolled
        const email = localStorage.getItem("rally_user_email")
        if (email) {
          const checkResponse = await fetch(
            `/api/blueprints/${data.id}/check-enrollment?email=${encodeURIComponent(email)}`,
          )
          const checkData = await checkResponse.json()
          setAlreadyEnrolled(checkData.enrolled)

          if (checkData.enrolled) {
            toast.info("You're already enrolled in this blueprint!")
          }
        }
      } catch (error) {
        console.error("Error fetching active blueprint:", error)
        toast.error("Could not load enrollment information")
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

    try {
      console.log("Submitting enrollment to blueprint:", blueprintId)

      // Check if user is already enrolled
      const checkResponse = await fetch(
        `/api/blueprints/${blueprintId}/check-enrollment?email=${encodeURIComponent(formData.email)}`,
      )
      const checkData = await checkResponse.json()

      if (checkData.enrolled) {
        setAlreadyEnrolled(true)
        toast.info("You're already enrolled in this blueprint!")
        setShowSuccessDialog(true)

        // Store user info in localStorage
        localStorage.setItem("rally_user_name", formData.name)
        localStorage.setItem("rally_user_email", formData.email)

        return
      }

      const response = await fetch(`/api/blueprints/${blueprintId}/enroll`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()
      console.log("Enrollment response:", data)

      if (!response.ok) {
        throw new Error(data.error || "Failed to enroll")
      }

      // Store user info in localStorage for future use
      localStorage.setItem("rally_user_name", formData.name)
      localStorage.setItem("rally_user_email", formData.email)

      // Show success dialog
      setShowSuccessDialog(true)
    } catch (error: any) {
      console.error("Enrollment error:", error)
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
            {/* <Button
              className="w-full"
              onClick={() => {
                window.open(WHATSAPP_COMMUNITY_LINK, "_blank")
                setShowSuccessDialog(false)
                if (!alreadyEnrolled) resetForm()
              }}
            >
              Join Community
            </Button> */}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
