"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Instagram } from "lucide-react"
import { useChallengeStore } from "@/lib/store"

export function SubmissionForm() {
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    handle: "",
    submission_link: "",
  })

  const { currentChallenge, addSubmission, isLoading } = useChallengeStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (currentChallenge) {
      try {
        await addSubmission(currentChallenge.id, formData)
        setSubmitted(true)
      } catch (error) {
        console.error("Error submitting entry:", error)
      }
    }
  }

  if (submitted) {
    return (
      <Card className="space-y-6 p-6 text-center">
        <h3 className="text-xl font-bold">Thanks for participating! 🎉</h3>
        <div className="space-y-4">
          <Button className="w-full" asChild>
            <a href="https://instagram.com/rally" target="_blank" rel="noopener noreferrer">
              <Instagram className="mr-2 h-4 w-4" />
              Follow @rally to see other submissions
            </a>
          </Button>
          <Button variant="outline" className="w-full" asChild>
            <a href="https://chat.whatsapp.com/HsIgtz1Ge0MFryTkAVjnIy" target="_blank" rel="noopener noreferrer">
              Give Feedback
            </a>
          </Button>
        </div>
      </Card>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        placeholder="Your name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        required
      />
      <Input
        placeholder="Social media handle"
        value={formData.handle}
        onChange={(e) => setFormData({ ...formData, handle: e.target.value })}
        required
      />
      <Input
        placeholder="Link to your submission"
        value={formData.submission_link}
        onChange={(e) => setFormData({ ...formData, submission_link: e.target.value })}
        required
      />
      <Button type="submit" className="w-full bg-black text-white hover:bg-gray-800" disabled={isLoading}>
        {isLoading ? "Submitting..." : "Submit My Entry"}
      </Button>
    </form>
  )
}
