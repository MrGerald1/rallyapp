"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, LinkIcon } from "lucide-react"

interface SimplifiedSubmissionProps {
  challengeId: string
  onSuccess: (submissionId: string) => void
}

export function SimplifiedSubmission({ challengeId, onSuccess }: SimplifiedSubmissionProps) {
  const [name, setName] = useState<string>(localStorage.getItem("rally_user_name") || "")
  const [email, setEmail] = useState<string>(localStorage.getItem("rally_user_email") || "")
  const [link, setLink] = useState<string>("")
  const [isUploading, setIsUploading] = useState<boolean>(false)
  const [submissionType, setSubmissionType] = useState<"upload" | "link">("link")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim() || !email.trim()) {
      toast.error("Please fill in all required fields")
      return
    }

    if (submissionType === "link" && !link.trim()) {
      toast.error("Please enter a link to your submission")
      return
    }

    try {
      setIsUploading(true)

      // Store user info in localStorage
      localStorage.setItem("rally_user_name", name)
      localStorage.setItem("rally_user_email", email)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Generate a temporary ID for the submission
      const tempId = `temp-${Date.now()}`
      onSuccess(tempId)

      toast.success("Challenge completed successfully!")
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
          className="bg-input"
          required
        />
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
          className="bg-input"
          required
        />
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
          <Input type="file" id="media" accept="image/*,video/*,.gif" className="bg-input" />
          <p className="text-xs text-muted-foreground">Upload your submission (JPEG, PNG, GIF, MP4, etc.)</p>
        </TabsContent>
        <TabsContent value="link" className="space-y-2 pt-2">
          <Input
            type="url"
            id="link"
            placeholder="https://example.com/my-submission"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            className="bg-input"
          />
          <p className="text-xs text-muted-foreground">Link to your submission on Instagram, Twitter, etc.</p>
        </TabsContent>
      </Tabs>

      <Button
        type="submit"
        disabled={isUploading}
        className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
      >
        {isUploading ? "Submitting..." : "Complete Challenge"}
      </Button>
    </form>
  )
}
