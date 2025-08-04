"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { getActiveBlueprint, checkBlueprintEnrollment, enrollInBlueprint } from "@/lib/api/blueprint-api"

export function EnrollmentForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone_number: "",
    project_idea: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [blueprint, setBlueprint] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [alreadyEnrolled, setAlreadyEnrolled] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Initialize form with stored user data if available
    const storedName = localStorage.getItem("rally_user_name")
    const storedEmail = localStorage.getItem("rally_user_email")

    if (storedName || storedEmail) {
      setFormData((prev) => ({
        ...prev,
        name: storedName || prev.name,
        email: storedEmail || prev.email,
      }))
    }

    // Fetch the active blueprint
    const fetchActiveBlueprint = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const blueprintData = await getActiveBlueprint()
        setBlueprint(blueprintData)

        // Check if user is already enrolled
        if (storedEmail) {
          try {
            const checkResult = await checkBlueprintEnrollment(blueprintData.id, storedEmail)
            setAlreadyEnrolled(checkResult.enrolled)

            if (checkResult.enrolled) {
              toast.info("You're already enrolled in this blueprint!")
            }
          } catch (checkError) {
            console.error("Error checking enrollment:", checkError)
            // Continue without enrollment check
          }
        }
      } catch (error: any) {
        console.error("Error fetching active blueprint:", error)
        setError(error.message || "Could not load enrollment information")
        toast.error("Could not load enrollment information")
      } finally {
        setIsLoading(false)
      }
    }

    fetchActiveBlueprint()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!blueprint) {
      toast.error("No active blueprint found. Please try again later.")
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      // Check if user is already enrolled
      const checkResult = await checkBlueprintEnrollment(blueprint.id, formData.email)

      if (checkResult.enrolled) {
        setAlreadyEnrolled(true)
        toast.info("You're already enrolled in this blueprint!")
        setShowSuccessDialog(true)

        // Store user info in localStorage
        localStorage.setItem("rally_user_name", formData.name)
        localStorage.setItem("rally_user_email", formData.email)

        return
      }

      // Enroll user
      await enrollInBlueprint(blueprint.id, formData)

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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading enrollment form...</span>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive" className="my-4">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
        <Button onClick={() => window.location.reload()} className="mt-4">
          Try Again
        </Button>
      </Alert>
    )
  }

  if (!blueprint) {
    return (
      <Alert className="my-4">
        <AlertTitle>No Active Blueprint</AlertTitle>
        <AlertDescription>No active blueprint available for enrollment at this time.</AlertDescription>
      </Alert>
    )
  }

  if (alreadyEnrolled) {
    return (
      <Alert className="my-4">
        <AlertTitle>Already Enrolled</AlertTitle>
        <AlertDescription className="mb-4">You're already enrolled in this blueprint!</AlertDescription>
        <Button onClick={() => setShowSuccessDialog(true)}>View Community Link</Button>
      </Alert>
    )
  }

  return (
    <>
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
            placeholder="Briefly describe the idea or project you want to launch..."
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
                ? "You're already enrolled in the blueprint."
                : "You've successfully enrolled in the blueprint."}
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
                if (blueprint?.whatsapp_link) {
                  window.open(blueprint.whatsapp_link, "_blank")
                }
                setShowSuccessDialog(false)
                if (!alreadyEnrolled) resetForm()
              }}
            >
              Join Community
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
