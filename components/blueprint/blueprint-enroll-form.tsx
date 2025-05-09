"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { Loader2, ArrowRight } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

interface BlueprintEnrollFormProps {
  blueprintId: string
}

export function BlueprintEnrollForm({ blueprintId }: BlueprintEnrollFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone_number: "",
    project_idea: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [whatsappLink, setWhatsappLink] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // For now, we'll use a hardcoded blueprint ID
      // In a real implementation, this would come from the page props or URL
      // const blueprintId = "123e4567-e89b-12d3-a456-426614174000"

      const response = await fetch(`/api/blueprints/${blueprintId}/enroll`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to enroll")
      }

      // Store user info in localStorage for future use
      localStorage.setItem("rally_user_name", formData.name)
      localStorage.setItem("rally_user_email", formData.email)

      // Show success dialog with WhatsApp link
      setWhatsappLink(data.whatsappLink)
      setShowSuccessDialog(true)
    } catch (error: any) {
      toast.error(error.message || "Failed to enroll. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-5">
          <div>
            <label htmlFor="name" className="mb-2 block text-left text-sm font-bold uppercase tracking-wider">
              Your Name
            </label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="border-2 border-gray-300 bg-white py-6 text-lg transition-all focus:border-[#EF6C36] focus:ring-[#EF6C36]"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="mb-2 block text-left text-sm font-bold uppercase tracking-wider">
              Email Address
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="border-2 border-gray-300 bg-white py-6 text-lg transition-all focus:border-[#EF6C36] focus:ring-[#EF6C36]"
              required
            />
          </div>

          <div>
            <label htmlFor="phone_number" className="mb-2 block text-left text-sm font-bold uppercase tracking-wider">
              Phone Number (WhatsApp)
            </label>
            <Input
              id="phone_number"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              placeholder="+234..."
              className="border-2 border-gray-300 bg-white py-6 text-lg transition-all focus:border-[#EF6C36] focus:ring-[#EF6C36]"
              required
            />
          </div>

          <div>
            <label htmlFor="project_idea" className="mb-2 block text-left text-sm font-bold uppercase tracking-wider">
              My Idea/Project Focus
            </label>
            <Textarea
              id="project_idea"
              name="project_idea"
              value={formData.project_idea}
              onChange={handleChange}
              placeholder="Briefly describe the idea or project you want to launch in 26 days..."
              className="border-2 border-gray-300 bg-white py-3 text-lg transition-all focus:border-[#EF6C36] focus:ring-[#EF6C36]"
              rows={4}
              required
            />
          </div>
        </div>

        <Button
          type="submit"
          className="group relative w-full overflow-hidden rounded-full bg-[#EF6C36] py-7 text-lg font-bold uppercase tracking-wider text-white transition-all hover:bg-[#EF6C36]/90 hover:shadow-lg"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Enrolling...
            </>
          ) : (
            <>
              Yeah, Let's Build! <ArrowRight className="ml-2 inline h-5 w-5" />
              <span className="absolute bottom-0 left-0 h-full w-0 bg-white/20 transition-all duration-300 group-hover:w-full"></span>
            </>
          )}
        </Button>
      </form>

      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">You're In! 🚀</DialogTitle>
            <DialogDescription className="text-lg">
              Your application for the 26-Day Idea Launch Blueprint has been received.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-lg">
              We will be sending more info to <strong className="text-[#EF6C36]">{formData.email}</strong> with all
              the details.
            </p>
            {/* <div className="rounded-lg bg-[#F3F4F6] p-6">
              <h3 className="mb-3 font-bold uppercase tracking-wider">Next Steps:</h3>
              <ol className="space-y-3 pl-5 text-base">
                <li className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#EF6C36] text-xs font-bold text-white">
                    1
                  </span>
                  Check your email for the welcome kit
                </li>
                <li className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#EF6C36] text-xs font-bold text-white">
                    2
                  </span>
                  Join the WhatsApp group using the link below
                </li>
                <li className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#EF6C36] text-xs font-bold text-white">
                    3
                  </span>
                  Get ready for Day 1 - we start soon!
                </li>
              </ol>
            </div> */}
            <Button
              className="group relative w-full overflow-hidden rounded-full bg-[#EF6C36] py-6 text-lg font-bold text-white transition-all hover:bg-[#EF6C36]/90"
              onClick={() => {
                window.open(whatsappLink, "_blank")
                setShowSuccessDialog(false)
              }}
            >
              <span className="relative z-10">Join Community</span>
              <span className="absolute bottom-0 left-0 h-full w-0 bg-white/20 transition-all duration-300 group-hover:w-full"></span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
