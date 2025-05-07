"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useChallengeStore } from "@/lib/store"
import { isAfterDeadline } from "@/components/countdown-timer"
import { Bell, Calendar, Users } from "lucide-react"
import { SocialShareCard } from "@/components/social-sharecard"
import { SimplifiedSubmission } from "@/components/simplified-submission"
import Link from "next/link"
import { RecentSubmissions } from "@/components/recent-submissions"

export function ChallengeCard() {
  const { currentChallenge, isLoading, error, setReminder } = useChallengeStore()
  const [submitted, setSubmitted] = useState(false)
  const [submissionId, setSubmissionId] = useState("")
  const [reminderEmail, setReminderEmail] = useState("")
  const [reminderSet, setReminderSet] = useState(false)
  const [userStreak, setUserStreak] = useState(0)
  const [userEmail, setUserEmail] = useState("")
  const [userName, setUserName] = useState("")

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

    return () => clearInterval(interval)
  }, [])

  // Fetch the current challenge when the component mounts
  useEffect(() => {
    if (!currentChallenge) {
      useChallengeStore.getState().fetchCurrentChallenge()
    }
  }, [currentChallenge])

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
      await setReminder(reminderEmail)
      setReminderSet(true)

      // Store the email for future use
      localStorage.setItem("rally_user_email", reminderEmail)
      setUserEmail(reminderEmail)

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
    }
  }

  // Show loading state while fetching the challenge
  if (isLoading && !currentChallenge) {
    return (
      <Card className="border border-primary/30 shadow-sm">
        <CardContent className="flex flex-col items-center justify-center p-6 text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="mt-4 text-muted-foreground">Loading today's challenge...</p>
        </CardContent>
      </Card>
    )
  }

  // If there's no challenge available, show a message
  if (!currentChallenge) {
    return (
      <Card className="border border-primary/30 shadow-sm">
        <CardContent className="p-6 text-center">
          <p className="mb-4">No challenge available today. Check back tomorrow!</p>

          <Button className="mt-2" variant="outline" asChild>
            <Link href="https://chat.whatsapp.com/HsIgtz1Ge0MFryTkAVjnIy" target="_blank" rel="noopener noreferrer">
              <Users className="mr-2 h-4 w-4" />
              Join Community
            </Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (submitted) {
    return (
      <div className="space-y-6">
        <Card className="border-t-4 border-t-primary border-x border-b shadow-sm">
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold mb-2">Challenge Completed! 🎉</h2>
            </div>

            {/* Social share card - full width */}
            <div className="mb-6">
              <p className="text-sm font-medium mb-3">Share your achievement:</p>
              <SocialShareCard
                name={userName || ""}
                challengeTitle={currentChallenge.title}
                streak={userStreak}
                submissionId={submissionId}
              />
            </div>
          </CardContent>
        </Card>

        {/* Recent submissions with compliment functionality */}
        <RecentSubmissions challengeId={currentChallenge.id} currentUserEmail={userEmail} />
      </div>
    )
  }

  return (
    <Card className="border-t-4 border-t-primary border-x border-b shadow-sm">
      <CardHeader className="border-b border-border/40 pb-3">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-xl font-bold">{currentChallenge.title}</h2>
          <Badge variant="secondary" className="bg-secondary text-foreground">
            {currentChallenge.category}
          </Badge>
          <Badge variant="outline">{currentChallenge.difficulty}</Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <p className="mb-4">{currentChallenge.description}</p>
        <blockquote className="border-l-2 border-primary/20 pl-4">
          <p className="italic">"{currentChallenge.quote}"</p>
          <footer className="mt-1 text-sm text-muted-foreground">— {currentChallenge.author}</footer>
        </blockquote>

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
                    />
                    <Button type="submit" disabled={isLoading}>
                      <Bell className="mr-2 h-4 w-4" />
                      Remind Me
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">We'll send you a reminder for tomorrow's challenge</p>
                </form>
              ) : (
                <div className="rounded-lg bg-green-50 p-3 text-center text-green-700">
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
          // New simplified submission form
          <div className="mt-6">
            <SimplifiedSubmission challengeId={currentChallenge.id} onSuccess={handleSubmissionSuccess} />
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-center border-t border-border/40 px-6 py-4">
        <p className="text-center text-sm text-muted-foreground">{currentChallenge.hashtag} • Rally Challenge</p>
      </CardFooter>
    </Card>
  )
}
