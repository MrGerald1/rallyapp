"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronRight, Heart, Users, Check } from "lucide-react"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { useChallengeStore } from "@/lib/store"

interface Submission {
  id: number | string
  name: string
  handle: string
  submission_link: string
  challenge_id: string
  created_at: string
  email: string
  challenge_title?: string
}

interface RecentSubmissionsProps {
  limit?: number
  showViewAll?: boolean
  hideHeader?: boolean
  challengeId?: string
  currentUserEmail?: string
}

export function RecentSubmissions({
  limit = 3,
  showViewAll = true,
  hideHeader = false,
  challengeId,
  currentUserEmail,
}: RecentSubmissionsProps) {
  const { submissions, fetchSubmissions, sendCompliment, fetchLeaderboard, refreshData } = useChallengeStore()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showComplimentDialog, setShowComplimentDialog] = useState(false)
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null)
  const [complimentMessage, setComplimentMessage] = useState("")
  const [userEmail, setUserEmail] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [complimentedSubmissions, setComplimentedSubmissions] = useState<string[]>([])
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [pointsEarned, setPointsEarned] = useState(0)

  useEffect(() => {
    const loadSubmissions = async () => {
      try {
        setIsLoading(true)
        setError(null)
        await fetchSubmissions()
      } catch (error) {
        console.error("Error loading submissions:", error)
        setError("Unable to load submissions at this time")
      } finally {
        setIsLoading(false)
      }
    }

    // Get user email from localStorage
    const storedEmail = localStorage.getItem("rally_user_email") || ""
    setUserEmail(storedEmail)

    // Get complimentedSubmissions from localStorage
    const storedCompliments = localStorage.getItem("complimentedSubmissions")
    if (storedCompliments) {
      setComplimentedSubmissions(JSON.parse(storedCompliments))
    }

    loadSubmissions()
  }, [fetchSubmissions])

  const handleSendCompliment = async () => {
    if (!selectedSubmission || !complimentMessage.trim()) return

    try {
      setIsSending(true)

      // Check if user has an email
      let fromEmail = userEmail
      if (!fromEmail) {
        // If no email in storage, use the one from the input
        fromEmail = userEmail
        if (fromEmail) {
          localStorage.setItem("rally_user_email", fromEmail)
        } else {
          toast.error("Please enter your email address")
          return
        }
      }

      await sendCompliment(
        fromEmail,
        selectedSubmission.email,
        selectedSubmission.challenge_id,
        complimentMessage,
        typeof selectedSubmission.id === "string" ? null : selectedSubmission.id,
      )

      // Add to complimentedSubmissions to show the check mark
      const updatedCompliments = [...complimentedSubmissions, selectedSubmission.id.toString()]
      setComplimentedSubmissions(updatedCompliments)
      localStorage.setItem("complimentedSubmissions", JSON.stringify(updatedCompliments))

      // Set points earned (1 point per compliment)
      setPointsEarned(1)

      // Show success dialog
      setShowSuccessDialog(true)
      setShowComplimentDialog(false)
      setComplimentMessage("")

      // Refresh leaderboard data
      await fetchLeaderboard()
    } catch (error: any) {
      console.error("Error sending compliment:", error)
      toast.error(`Error sending compliment: ${error.message}`)
    } finally {
      setIsSending(false)
    }
  }

  const openComplimentDialog = (submission: Submission) => {
    setSelectedSubmission(submission)
    setShowComplimentDialog(true)
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="bg-[#E2F1EB] border-none">
        <div className="space-y-4 pt-4 px-6 pb-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center space-x-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-3 w-1/4" />
              </div>
              <Skeleton className="h-6 w-12" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="bg-[#E2F1EB] border-none">
        <div className="pt-4 px-6 pb-6">
          <p className="text-center text-muted-foreground">{error}</p>
          <div className="flex justify-center mt-3">
            <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Empty state
  if (!submissions || !Array.isArray(submissions) || submissions.length === 0) {
    return (
      <div className="bg-[#E2F1EB] border-none">
        <div className="pt-4 px-6 pb-6">
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <Users className="mb-3 h-12 w-12 text-muted-foreground/50" />
            <p className="text-muted-foreground">No submissions yet. Be the first to complete today's challenge!</p>
          </div>
        </div>
      </div>
    )
  }

  // Filter submissions by challenge ID if provided
  const filteredSubmissions = challengeId ? submissions.filter((sub) => sub.challenge_id === challengeId) : submissions

  // Filter out user's own submissions if email provided
  const displaySubmissions = currentUserEmail
    ? filteredSubmissions.filter((sub) => sub.email !== currentUserEmail)
    : filteredSubmissions

  // Limit the number of submissions to display
  const displayedSubmissions = displaySubmissions.slice(0, limit)

  return (
    <div className="bg-[#E2F1EB] border-none">
      <div className="space-y-4 pt-4 px-6 pb-6">
        {displayedSubmissions.map((submission, index) => (
          <Card key={index} className="bg-white/50 border-none shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <Avatar className="h-8 w-8 border">
                  <AvatarFallback className="bg-primary/10 text-foreground">
                    {submission.name?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium">{submission.name || "User"}</p>
                  <p className="text-sm text-muted-foreground truncate">
                    {new Date(submission.created_at).toLocaleDateString()}
                  </p>
                  <div className="mt-2">
                    <a
                      href={submission.submission_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline"
                    >
                      View submission
                    </a>
                  </div>
                </div>
                {complimentedSubmissions.includes(submission.id.toString()) ? (
                  <Button variant="outline" size="sm" className="text-green-600" disabled>
                    <Check className="mr-2 h-4 w-4" />
                    Complimented
                  </Button>
                ) : (
                  <Button
                    variant="destructive"
                    size="sm"
                    className="bg-[#FF8882] text-white hover:bg-[#FF8882]/90"
                    onClick={() => openComplimentDialog(submission)}
                  >
                    <Heart className="h-4 w-4 mr-1" />
                    Compliment
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {showViewAll && displaySubmissions.length > limit && (
        <div className="flex justify-center pt-2 pb-4">
          <Button variant="ghost" asChild className="text-primary">
            <Link href="/complements" className="flex items-center">
              View All
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      )}

      {/* Compliment Dialog */}
      <Dialog open={showComplimentDialog} onOpenChange={setShowComplimentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send a Compliment</DialogTitle>
            <DialogDescription>
              Send some encouragement to {selectedSubmission?.name || "this user"} for their submission.
            </DialogDescription>
          </DialogHeader>
          {!userEmail && (
            <div className="space-y-2">
              <Label htmlFor="email">Your Email</Label>
              <Input
                id="email"
                placeholder="Enter your email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
              />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="message">Your Message</Label>
            <Textarea
              id="message"
              placeholder="Write your compliment here..."
              value={complimentMessage}
              onChange={(e) => setComplimentMessage(e.target.value)}
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button
              variant="destructive"
              className="bg-[#FF8882] text-white hover:bg-[#FF8882]/90"
              onClick={handleSendCompliment}
              disabled={
                isSending || !complimentMessage.trim() || (!userEmail && !localStorage.getItem("rally_user_email"))
              }
            >
              {isSending ? "Sending..." : "Send Compliment"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Compliment Sent!</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="bg-green-50 p-4 rounded-lg mb-4">
              <p className="text-green-700 font-medium">+{pointsEarned} point added to your score!</p>
              <p className="text-sm text-muted-foreground mt-1">
                Your compliment has been sent and your leaderboard position has been updated.
              </p>
            </div>
            <p className="text-sm">
              Send more compliments to earn additional points and climb the leaderboard! You can earn up to 3 points per
              day from compliments.
            </p>
          </div>
          <DialogFooter>
            <Button
              onClick={() => setShowSuccessDialog(false)}
              className="bg-[#FF8882] text-white hover:bg-[#FF8882]/90"
            >
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
