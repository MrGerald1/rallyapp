"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { formatDistanceToNow } from "date-fns"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, Check, Users } from "lucide-react"
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

interface Complement {
  id: string
  from_user_email: string
  to_user_email: string
  message: string
  challenge_id: string
  challenge_title?: string
  created_at: string
  from_user_name?: string
  to_user_name?: string
  submission_id?: string
}

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

export function ComplimentsSection() {
  const [activeTab, setActiveTab] = useState("received")
  const [receivedCompliments, setReceivedCompliments] = useState<Complement[]>([])
  const [sentCompliments, setSentCompliments] = useState<Complement[]>([])
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingSubmissions, setIsLoadingSubmissions] = useState(true)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [showComplimentDialog, setShowComplimentDialog] = useState(false)
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null)
  const [complimentMessage, setComplimentMessage] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [complimentedSubmissions, setComplimentedSubmissions] = useState<string[]>([])
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [pointsEarned, setPointsEarned] = useState(0)

  useEffect(() => {
    // Get user email from localStorage
    const email = localStorage.getItem("rally_user_email")
    setUserEmail(email)

    if (email) {
      fetchCompliments(email)
    }

    // Get complimentedSubmissions from localStorage
    const storedCompliments = localStorage.getItem("complimentedSubmissions")
    if (storedCompliments) {
      setComplimentedSubmissions(JSON.parse(storedCompliments))
    }

    // Fetch submissions regardless of email
    fetchSubmissions()
  }, [])

  const fetchCompliments = async (email: string) => {
    try {
      setIsLoading(true)

      // Fetch received compliments
      const receivedResponse = await fetch(`/api/complements?to=${email}`)
      const receivedData = await receivedResponse.json()

      // Fetch sent compliments
      const sentResponse = await fetch(`/api/complements?from=${email}`)
      const sentData = await sentResponse.json()

      setReceivedCompliments(receivedData || [])
      setSentCompliments(sentData || [])
    } catch (error) {
      console.error("Error fetching compliments:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchSubmissions = async () => {
    try {
      setIsLoadingSubmissions(true)
      const response = await fetch("/api/submissions")

      if (!response.ok) {
        throw new Error(`Failed to fetch submissions: ${response.status}`)
      }

      const data = await response.json()

      // Sort by most recent first
      const sortedData = data.sort(
        (a: Submission, b: Submission) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      )

      setSubmissions(sortedData || [])
    } catch (error) {
      console.error("Error fetching submissions:", error)
    } finally {
      setIsLoadingSubmissions(false)
    }
  }

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

      const response = await fetch("/api/complements", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from_user_email: fromEmail,
          to_user_email: selectedSubmission.email,
          challenge_id: selectedSubmission.challenge_id,
          message: complimentMessage,
          submission_id: typeof selectedSubmission.id === "string" ? null : selectedSubmission.id,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Failed to send compliment: ${response.status}`)
      }

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

      // Refresh compliments data
      if (userEmail) {
        fetchCompliments(userEmail)
      }

      toast.success("Compliment sent successfully!")
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

  const getInitials = (name: string) => {
    return name?.charAt(0).toUpperCase() || "U"
  }

  return (
    <div className="space-y-6">
      <div className="bg-yellow-50 p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-2">About Compliments</h2>
        <p className="mb-4">
          Encourage others who have completed challenges and earn points! Each compliment you send earns you 1 point (up
          to 3 per day), and each compliment you receive earns you 2 points (up to 5 per day).
        </p>
        <p className="text-sm italic">
          Sending compliments is a great way to build community and motivate others to continue their journey!
        </p>
      </div>

      <Tabs defaultValue="received" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="give">Give Compliments</TabsTrigger>
          <TabsTrigger value="received">Received</TabsTrigger>
          <TabsTrigger value="sent">Sent</TabsTrigger>
        </TabsList>

        <TabsContent value="give" className="mt-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Recent Submissions</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Send compliments to others who have completed challenges to earn points!
            </p>

            {isLoadingSubmissions ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-3 p-4 border rounded-lg">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-1/3" />
                      <Skeleton className="h-3 w-1/4" />
                    </div>
                    <Skeleton className="h-6 w-12" />
                  </div>
                ))}
              </div>
            ) : submissions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-6 text-center border rounded-lg p-8">
                <Users className="mb-3 h-12 w-12 text-muted-foreground/50" />
                <p className="text-muted-foreground">No submissions yet. Check back later!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {submissions.map((submission) => (
                  <Card key={submission.id} className="bg-white/50 border shadow-sm">
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
            )}
          </div>
        </TabsContent>

        <TabsContent value="received" className="mt-6">
          {isLoading ? (
            <div className="text-center py-8">Loading your compliments...</div>
          ) : receivedCompliments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">You haven't received any compliments yet.</div>
          ) : (
            <div className="space-y-4">
              {receivedCompliments.map((complement) => (
                <div key={complement.id} className="border rounded-lg p-4 bg-white">
                  <div className="flex items-center gap-3 mb-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary/10">
                        {getInitials(complement.from_user_name || complement.from_user_email)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{complement.from_user_name || complement.from_user_email}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(complement.created_at), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm mb-2">{complement.message}</p>
                  {complement.challenge_title && (
                    <p className="text-xs text-muted-foreground">Challenge: {complement.challenge_title}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="sent" className="mt-6">
          {isLoading ? (
            <div className="text-center py-8">Loading your sent compliments...</div>
          ) : sentCompliments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">You haven't sent any compliments yet.</div>
          ) : (
            <div className="space-y-4">
              {sentCompliments.map((complement) => (
                <div key={complement.id} className="border rounded-lg p-4 bg-white">
                  <div className="flex items-center gap-3 mb-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary/10">
                        {getInitials(complement.to_user_name || complement.to_user_email)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">To: {complement.to_user_name || complement.to_user_email}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(complement.created_at), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm mb-2">{complement.message}</p>
                  {complement.challenge_title && (
                    <p className="text-xs text-muted-foreground">Challenge: {complement.challenge_title}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

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
                value={userEmail || ""}
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
