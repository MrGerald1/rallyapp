"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useChallengeStore } from "@/lib/store"
import { isAfterDeadline } from "@/components/countdown-timer"
import { Bell, Calendar, Users, Sparkles, Upload, LinkIcon } from "lucide-react"
import Link from "next/link"
import { SocialShareCard } from "@/components/social-share-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CommunityTabs } from "@/components/community-tabs"
import { toast } from "sonner"

export function ChallengeCard() {
  const { currentChallenge, isLoading, error, fetchCurrentChallenge, addSubmission } = useChallengeStore()
  const [submitted, setSubmitted] = useState(false)
  const [submissionId, setSubmissionId] = useState("")
  const [reminderEmail, setReminderEmail] = useState("")
  const [reminderSet, setReminderSet] = useState(false)
  const [userStreak, setUserStreak] = useState(0)
  const [userEmail, setUserEmail] = useState("")
  const [userName, setUserName] = useState("")
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)
  const [submissionType, setSubmissionType] = useState<"upload" | "link">("link")
  const [submissionLink, setSubmissionLink] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSubmissionForm, setShowSubmissionForm] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Check if we're past the 9pm deadline
  const [afterDeadline, setAfterDeadline] = useState(false)

  useEffect(() => {
    // Set the initial deadline state
    setAfterDeadline(isAfterDeadline())

    // Check every minute if we've passed the deadline
    const interval = setInterval(() => {
      setAfterDeadline(isAfterDeadline())
    }, 60000)

    // Try to get the user's email from localStorage to pre-fill the form
    const storedEmail = localStorage.getItem("rally_user_email")
    if (storedEmail) {
      setReminderEmail(storedEmail)
      setUserEmail(storedEmail)
    }

    // Get user's name from localStorage
    const storedName = localStorage.getItem("rally_user_name")
    if (storedName) {
      setUserName(storedName)
    }

    // Get user's streak from localStorage
    const storedStreak = localStorage.getItem("rally_streak")
    if (storedStreak) {
      setUserStreak(Number.parseInt(storedStreak, 10))
    }

    // Fetch the current challenge from the API
    fetchCurrentChallenge()

    return () => clearInterval(interval)
  }, [fetchCurrentChallenge])

  const handleSubmissionSuccess = (id: string) => {
    setSubmissionId(id)
    setSubmitted(true)

    // Update streak in localStorage
    const currentStreak = Number.parseInt(localStorage.getItem("rally_streak") || "0", 10)
    const newStreak = currentStreak + 1
    localStorage.setItem("rally_streak", newStreak.toString())
    setUserStreak(newStreak)
  }

  const handleSetReminder = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!reminderEmail) return

    try {
      // Call the API to set a reminder
      const response = await fetch("/api/reminders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: reminderEmail }),
      })

      if (!response.ok) {
        throw new Error("Failed to set reminder")
      }

      setReminderSet(true)

      // Store the email for future use
      localStorage.setItem("rally_user_email", reminderEmail)
      setUserEmail(reminderEmail)

      toast.success("Reminder set successfully!")

      // Open the user's mail client with a pre-filled email
      const subject = "Rally Challenge Reminder"
      const body =
        "Hi there,\n\nThis is a reminder to check out tomorrow's challenge on Rally!\n\nhttps://startrally.xyz"
      window.open(
        `mailto:${reminderEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
        "_blank",
      )
    } catch (error) {
      console.error("Error setting reminder:", error)
      toast.error("Failed to set reminder. Please try again.")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!userName || !userEmail) {
      toast.error("Please enter your name and email")
      return
    }

    if (submissionType === "link" && !submissionLink) {
      toast.error("Please enter a link to your submission")
      return
    }

    if (submissionType === "upload" && !fileInputRef.current?.files?.length) {
      toast.error("Please select a file to upload")
      return
    }

    setIsSubmitting(true)

    try {
      // Store user info in localStorage
      localStorage.setItem("rally_user_name", userName)
      localStorage.setItem("rally_user_email", userEmail)

      // Prepare submission data
      const submissionData = {
        name: userName,
        email: userEmail,
        handle: userName.toLowerCase().replace(/\s+/g, ""),
        submission_link: submissionType === "link" ? submissionLink : "file://uploaded-file",
      }

      // If file upload is selected, upload the file first
      if (submissionType === "upload" && fileInputRef.current?.files?.length) {
        const file = fileInputRef.current.files[0]
        const formData = new FormData()
        formData.append("file", file)

        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })

        if (!uploadResponse.ok) {
          throw new Error("Failed to upload file")
        }

        const uploadData = await uploadResponse.json()
        submissionData.submission_link = uploadData.url
      }

      // Submit the challenge
      const response = await fetch("/api/submissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          challenge_id: currentChallenge?.id,
          ...submissionData,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to submit challenge")
      }

      const data = await response.json()

      // Update streak immediately
      const currentStreak = Number.parseInt(localStorage.getItem("rally_streak") || "0", 10)
      const newStreak = currentStreak + 1
      localStorage.setItem("rally_streak", newStreak.toString())
      setUserStreak(newStreak)

      handleSubmissionSuccess(data.id)
      toast.success("Challenge completed successfully!")
    } catch (error) {
      console.error("Error submitting challenge:", error)
      toast.error("Failed to submit your challenge. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Show loading state while fetching the challenge
  if (isLoading && !currentChallenge) {
    return (
      <Card className="shadow-sm bg-[#FFF9D3] border-none" id="challenge-card">
        <CardContent className="flex flex-col items-center justify-center p-6 text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="mt-4 text-muted-foreground">Loading today's challenge...</p>
        </CardContent>
      </Card>
    )
  }

  // Show error state if there was an error fetching the challenge
  if (error && !currentChallenge) {
    return (
      <Card className="shadow-sm bg-[#FFF9D3] border-none" id="challenge-card">
        <CardContent className="p-6 text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={() => fetchCurrentChallenge()}>Try Again</Button>
        </CardContent>
      </Card>
    )
  }

  // If no challenge is available, show a message
  if (!currentChallenge) {
    return (
      <Card className="shadow-sm bg-[#FFF9D3] border-none" id="challenge-card">
        <CardContent className="p-6 text-center">
          <p className="mb-4">No challenge available at the moment. Please check back later.</p>
          <Button onClick={() => fetchCurrentChallenge()}>Refresh</Button>
        </CardContent>
      </Card>
    )
  }

  if (submitted) {
    return (
      <div className="space-y-6">
        <Card className="card-accent-top border-t-primary shadow-sm bg-[#FFF9D3] border-none">
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold mb-2">Challenge Completed! 🎉</h2>
              <p className="text-muted-foreground">+5 points added to your streak!</p>
              <p className="text-sm font-medium mt-2">
                You're now at {userStreak * 5} points
                {userStreak >= 3 ? " — keep going!" : ""}
              </p>
            </div>

            {/* Social share card */}
            <SocialShareCard
              name={userName}
              challengeTitle={currentChallenge.title}
              streak={userStreak}
              submissionId={submissionId}
            />
          </CardContent>
        </Card>

        {/* Community Tabs with submissions tab active by default */}
        <CommunityTabs challengeId={currentChallenge.id} currentUserEmail={userEmail} defaultTab="submissions" />
      </div>
    )
  }

  return (
    <Card
      className="card-accent-top border-t-primary shadow-sm bg-[#FFF9D3] border-none rounded-lg"
      id="challenge-card"
    >
      <CardHeader className="border-b border-border/40 pb-3">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-xl font-bold text-foreground">Today's Challenge:</h2>
          <span className="font-medium">{currentChallenge.title}</span>
          <Badge variant="secondary" className="bg-secondary text-foreground">
            {currentChallenge.category}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <p className="mb-4">{currentChallenge.description}</p>

        <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
          <DialogContent className="bg-[#FFF9D3] border-none">
            <DialogHeader>
              <DialogTitle>{currentChallenge.title}</DialogTitle>
            </DialogHeader>
            <DialogDescription>{currentChallenge.description}</DialogDescription>
            <div className="mt-4 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary" className="bg-secondary text-foreground">
                  {currentChallenge.category}
                </Badge>
                <Badge variant="outline">{currentChallenge.difficulty}</Badge>
                <span className="text-sm text-muted-foreground">{currentChallenge.hashtag}</span>
              </div>

              <blockquote className="border-l-2 border-primary/20 pl-4 mt-4">
                <p className="italic">"{currentChallenge.quote}"</p>
                <footer className="mt-1 text-sm text-muted-foreground">— {currentChallenge.author}</footer>
              </blockquote>
            </div>
          </DialogContent>
        </Dialog>

        {/* After 9pm, show deadline message but still display the challenge */}
        {afterDeadline ? (
          <div className="mt-6 space-y-6">
            <div className="rounded-lg bg-secondary/10 p-4">
              <h3 className="mb-2 text-lg font-semibold">Today's challenge has ended</h3>
              <p>
                You can no longer submit for today's challenge. Come back tomorrow for a new challenge, or join our
                community to stay updated!
              </p>
            </div>

            {/* View Challenge Details button */}
            <Button
              variant="outline"
              className="w-full border-none bg-secondary/20"
              onClick={() => setShowDetailsDialog(true)}
            >
              <Sparkles className="mr-2 h-4 w-4" />
              View Challenge Details
            </Button>

            {/* WhatsApp group section */}
            <div className="space-y-4">
              <Button className="w-full" variant="outline" asChild>
                <Link href="https://chat.whatsapp.com/HsIgtz1Ge0MFryTkAVjnIy" target="_blank" rel="noopener noreferrer">
                  <Users className="mr-2 h-4 w-4" />
                  Join Community
                </Link>
              </Button>

              {!reminderSet ? (
                <form onSubmit={handleSetReminder} className="space-y-2">
                  <div className="flex space-x-2">
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      value={reminderEmail}
                      onChange={(e) => setReminderEmail(e.target.value)}
                      required
                      className="bg-input"
                    />
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="bg-[#FF8882] text-white hover:bg-[#FF8882]/90"
                    >
                      <Bell className="mr-2 h-4 w-4" />
                      Remind Me
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">We'll send you a reminder for tomorrow's challenge</p>
                </form>
              ) : (
                <div className="rounded-lg bg-accent/20 p-3 text-center text-foreground">
                  We'll remind you about tomorrow's challenge!
                </div>
              )}

              {/* Add calendar option */}
              <Button
                className="w-full"
                variant="outline"
                onClick={() => {
                  // Create calendar event details
                  const tomorrow = new Date()
                  tomorrow.setDate(tomorrow.getDate() + 1)
                  tomorrow.setHours(9, 0, 0, 0) // 9 AM tomorrow

                  const endTime = new Date(tomorrow)
                  endTime.setHours(21, 0, 0, 0) // 9 PM tomorrow

                  const startDate = tomorrow.toISOString().replace(/-|:|\.\d+/g, "")
                  const endDate = endTime.toISOString().replace(/-|:|\.\d+/g, "")

                  // Create Google Calendar link with daily recurrence for a year
                  const event = {
                    text: "Rally Daily Challenge",
                    dates: `${startDate}/${endDate}`,
                    details: "Check out the new daily challenge on Rally!",
                    location: "https://startrally.xyz",
                    recur: "RRULE:FREQ=DAILY;COUNT=365", // Repeat daily for 1 year
                  }

                  const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.text)}&dates=${encodeURIComponent(event.dates)}&details=${encodeURIComponent(event.details)}&location=${encodeURIComponent(event.location)}&recur=${encodeURIComponent(event.recur)}`

                  window.open(googleCalendarUrl, "_blank")
                }}
              >
                <Calendar className="mr-2 h-4 w-4" />
                Add to Calendar
              </Button>
            </div>
          </div>
        ) : (
          // Challenge submission form
          <div className="mt-6 space-y-4">
            {/* View Challenge Details button - moved above Start Challenge */}
            <Button
              variant="outline"
              className="w-full border-none bg-secondary/20"
              onClick={() => setShowDetailsDialog(true)}
            >
              <Sparkles className="mr-2 h-4 w-4" />
              View Challenge Details
            </Button>

            {!showSubmissionForm ? (
              <Button
                className="w-full bg-[#FF8882] text-white hover:bg-[#FF8882]/90"
                onClick={() => setShowSubmissionForm(true)}
              >
                Start Challenge
              </Button>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Your Name
                  </label>
                  <Input
                    type="text"
                    id="name"
                    placeholder="Enter your name"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
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
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
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
                    <div className="bg-yellow-50 p-3 rounded-md text-sm">
                      <p>Maximum file size: 2MB. Supported formats: Images, GIFs, Videos</p>
                    </div>
                    <input
                      type="file"
                      id="media"
                      ref={fileInputRef}
                      accept="image/*,video/*,.gif"
                      className="w-full p-2 border rounded"
                    />
                    <p className="text-xs text-muted-foreground">Upload your submission (JPEG, PNG, GIF, MP4, etc.)</p>
                  </TabsContent>
                  <TabsContent value="link" className="space-y-2 pt-2">
                    <Input
                      type="url"
                      id="link"
                      placeholder="https://example.com/my-submission"
                      value={submissionLink}
                      onChange={(e) => setSubmissionLink(e.target.value)}
                      className="bg-input"
                    />
                    <p className="text-xs text-muted-foreground">Link to your submission on Instagram, Twitter, etc.</p>
                  </TabsContent>
                </Tabs>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#FF8882] text-white hover:bg-[#FF8882]/90"
                >
                  {isSubmitting ? "Submitting..." : "Complete Challenge"}
                </Button>
              </form>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
