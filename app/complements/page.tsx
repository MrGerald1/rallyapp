"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Heart, Check, ExternalLink, Users, MessageCircle, Calendar } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import Link from "next/link"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

interface Submission {
  id: string
  name: string
  handle: string
  submission_link: string
  challenge_id: string
  created_at: string
  email: string
  challenge_title?: string
}

interface Compliment {
  id: string
  from_user_email: string
  to_user_email: string
  from_name?: string
  to_name?: string
  message: string
  challenge_id: string
  challenge_title?: string
  created_at: string
}

export default function ComplementsPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("give")
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [receivedCompliments, setReceivedCompliments] = useState<Compliment[]>([])
  const [givenCompliments, setGivenCompliments] = useState<Compliment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeSubmissionId, setActiveSubmissionId] = useState<string | null>(null)
  const [complimentMessage, setComplimentMessage] = useState("")
  const [isSendingCompliment, setIsSendingCompliment] = useState(false)
  const [complimentedSubmissions, setComplimentedSubmissions] = useState<string[]>([])
  const [userEmail, setUserEmail] = useState<string>("")
  const [userName, setUserName] = useState<string>("")
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [pointsEarned, setPointsEarned] = useState(0)

  useEffect(() => {
    // Get user email and name from localStorage
    const storedEmail = localStorage.getItem("rally_user_email") || ""
    const storedName = localStorage.getItem("rally_user_name") || ""
    setUserEmail(storedEmail)
    setUserName(storedName)

    // Get complimentedSubmissions from localStorage
    const storedCompliments = localStorage.getItem("complimentedSubmissions")
    if (storedCompliments) {
      setComplimentedSubmissions(JSON.parse(storedCompliments))
    }

    const loadData = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Fetch submissions for giving compliments
        const submissionsResponse = await fetch("/api/submissions")
        if (!submissionsResponse.ok) {
          throw new Error(`Failed to fetch submissions: ${submissionsResponse.status}`)
        }
        const submissionsData = await submissionsResponse.json()

        // Filter out user's own submissions
        const filteredSubmissions = storedEmail
          ? submissionsData.filter((sub: Submission) => sub.email !== storedEmail)
          : submissionsData
        setSubmissions(filteredSubmissions)

        // Fetch received compliments if user is logged in
        if (storedEmail) {
          const receivedResponse = await fetch(`/api/complements?to=${storedEmail}`)
          if (receivedResponse.ok) {
            const receivedData = await receivedResponse.json()
            setReceivedCompliments(receivedData)
          }

          // Fetch given compliments
          const givenResponse = await fetch(`/api/complements?from=${storedEmail}`)
          if (givenResponse.ok) {
            const givenData = await givenResponse.json()
            setGivenCompliments(givenData)
          }
        }
      } catch (error) {
        console.error("Error loading data:", error)
        setError("Unable to load data at this time. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  // Handle sending compliments
  const handleSendCompliment = async (submissionId: string) => {
    if (!complimentMessage.trim()) {
      toast.error("Please enter a message")
      return
    }

    if (!userEmail) {
      toast.error("Please log in to send compliments")
      return
    }

    try {
      setIsSendingCompliment(true)

      // Find the submission to get the recipient's email
      const submission = submissions.find((sub) => sub.id === submissionId)
      if (!submission) {
        throw new Error("Submission not found")
      }

      // Use the submission's user_email or handle as the recipient email
      const recipientEmail = submission.email || `${submission.handle}@example.com`

      // Send the compliment
      const response = await fetch("/api/complements", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
        body: JSON.stringify({
          from_user_email: userEmail,
          to_user_email: recipientEmail,
          message: complimentMessage,
          challenge_id: submission.challenge_id,
          submission_id: submissionId,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Failed to send compliment: ${response.status}`)
      }

      // Add to complimentedSubmissions to show the check mark
      const updatedCompliments = [...complimentedSubmissions, submissionId]
      setComplimentedSubmissions(updatedCompliments)
      localStorage.setItem("complimentedSubmissions", JSON.stringify(updatedCompliments))

      // Add the new compliment to the given compliments list
      const newCompliment = {
        id: `temp-${Date.now()}`,
        from_user_email: userEmail,
        to_user_email: recipientEmail,
        message: complimentMessage,
        challenge_id: submission.challenge_id,
        challenge_title: submission.challenge_title,
        created_at: new Date().toISOString(),
      }
      setGivenCompliments([newCompliment, ...givenCompliments])

      // Set points earned (1 point per compliment)
      setPointsEarned(1)

      // Show success dialog
      setShowSuccessDialog(true)
      setActiveSubmissionId(null)
      setComplimentMessage("")
    } catch (err: any) {
      console.error("Error sending compliment:", err)
      toast.error(err.message || "Failed to send compliment. Please try again.")
    } finally {
      setIsSendingCompliment(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="container mx-auto max-w-4xl px-4 py-6">
        <div className="mb-6 flex items-center">
          <Button variant="ghost" size="sm" onClick={() => router.push("/")} className="mr-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
          <h1 className="text-2xl font-bold">Compliments</h1>
        </div>

        <Card className="mb-6 border-none bg-[#FFF9D3]">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-2">About Compliments</h2>
            <p className="text-muted-foreground mb-4">
              Encourage others who have completed challenges and earn points! Each compliment you send earns you 1 point
              (up to 3 per day), and each compliment you receive earns you 2 points (up to 5 per day).
            </p>
            <div className="bg-primary/10 p-4 rounded-lg">
              <p className="text-sm font-medium">
                Sending compliments is a great way to build community and motivate others to continue their journey!
              </p>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="give" value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="give">Give Compliments</TabsTrigger>
            <TabsTrigger value="received">Received</TabsTrigger>
            <TabsTrigger value="given">Given</TabsTrigger>
          </TabsList>

          {isLoading ? (
            <div className="mt-8 flex justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
          ) : error ? (
            <div className="mt-8 bg-red-50/50 p-4 rounded-md">
              <p className="text-sm text-muted-foreground">{error}</p>
              <Button variant="outline" size="sm" className="mt-2" onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          ) : (
            <>
              {/* Give Compliments Tab */}
              <TabsContent value="give" className="mt-6">
                {activeSubmissionId && (
                  <div className="mb-6 p-4 bg-white/50 rounded-lg">
                    <h3 className="font-medium mb-2">
                      Send a compliment to {submissions.find((s) => s.id === activeSubmissionId)?.name}:
                    </h3>
                    <Textarea
                      placeholder="Write a compliment to encourage them..."
                      value={complimentMessage}
                      onChange={(e) => setComplimentMessage(e.target.value)}
                      className="min-h-[100px] resize-none mb-3 bg-white"
                    />
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setActiveSubmissionId(null)
                          setComplimentMessage("")
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={() => handleSendCompliment(activeSubmissionId)}
                        disabled={isSendingCompliment || !complimentMessage.trim()}
                        className="bg-[#FF8882] text-white hover:bg-[#FF8882]/90"
                      >
                        {isSendingCompliment ? "Sending..." : "Send Compliment"}
                      </Button>
                    </div>
                  </div>
                )}

                {submissions.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground mb-4">No submissions available to compliment at this time.</p>
                    <Button asChild>
                      <Link href="/">Try Today's Challenge</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {submissions.map((submission) => (
                      <Card key={submission.id} className="overflow-hidden border-none">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <Avatar className="h-10 w-10 border">
                                <AvatarFallback className="bg-primary/10 text-foreground">
                                  {submission.name.charAt(0).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{submission.name}</p>
                                {submission.challenge_title && (
                                  <p className="text-xs text-muted-foreground">{submission.challenge_title}</p>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-muted-foreground mb-2">
                                {new Date(submission.created_at).toLocaleDateString()}
                              </p>
                              <div className="flex space-x-2">
                                {complimentedSubmissions.includes(submission.id) ? (
                                  <Button variant="outline" size="sm" className="text-green-600" disabled>
                                    <Check className="mr-1 h-3 w-3" />
                                    Complimented
                                  </Button>
                                ) : (
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => setActiveSubmissionId(submission.id)}
                                    className="bg-[#FF8882] text-white hover:bg-[#FF8882]/90"
                                  >
                                    <Heart className="mr-1 h-3 w-3" />
                                    Compliment
                                  </Button>
                                )}
                                <Button variant="outline" size="sm" asChild>
                                  <a
                                    href={submission.submission_link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center"
                                  >
                                    <ExternalLink className="mr-1 h-3 w-3" />
                                    View
                                  </a>
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* Received Compliments Tab */}
              <TabsContent value="received" className="mt-6">
                {!userEmail ? (
                  <EmptyStateCard
                    title="Sign in to see your compliments"
                    description="Complete a challenge to register your email and start receiving compliments."
                    icon={<MessageCircle className="h-12 w-12 text-muted-foreground/50" />}
                  />
                ) : receivedCompliments.length === 0 ? (
                  <EmptyStateCard
                    title="No compliments received yet"
                    description="Complete challenges to get compliments from others!"
                    icon={<Heart className="h-12 w-12 text-muted-foreground/50" />}
                  />
                ) : (
                  <div className="space-y-4">
                    {receivedCompliments.map((compliment) => (
                      <ComplimentCard key={compliment.id} compliment={compliment} type="received" />
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* Given Compliments Tab */}
              <TabsContent value="given" className="mt-6">
                {!userEmail ? (
                  <EmptyStateCard
                    title="Sign in to see your given compliments"
                    description="Complete a challenge to register your email and start giving compliments."
                    icon={<MessageCircle className="h-12 w-12 text-muted-foreground/50" />}
                  />
                ) : givenCompliments.length === 0 ? (
                  <EmptyStateCard
                    title="You haven't given any compliments yet"
                    description="Encourage others by complimenting their submissions!"
                    icon={<Heart className="h-12 w-12 text-muted-foreground/50" />}
                  />
                ) : (
                  <div className="space-y-4">
                    {givenCompliments.map((compliment) => (
                      <ComplimentCard key={compliment.id} compliment={compliment} type="given" />
                    ))}
                  </div>
                )}
              </TabsContent>
            </>
          )}
        </Tabs>

        {/* How Compliments Work Section */}
        {!isLoading && (
          <Card className="mb-8 max-w-lg mx-auto border border-primary/20">
            <CardContent className="p-6">
              <h3 className="text-lg font-bold mb-4">How compliments work</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                    1
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Complete daily challenges</p>
                    <p className="text-sm text-muted-foreground">Complete a daily challenge</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                    2
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Send compliments to others</p>
                    <p className="text-sm text-muted-foreground">
                      After completing a challenge, you'll see other entries to compliment
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                    3
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Receive compliments in return</p>
                    <p className="text-sm text-muted-foreground">
                      As you participate, others will send you encouraging messages
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </main>

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

// Helper component for empty states
function EmptyStateCard({ title, description, icon }: { title: string; description: string; icon: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-8">
      <div className="mb-4">{icon}</div>
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      <p className="text-muted-foreground max-w-md mb-6">{description}</p>
      <div className="flex flex-col space-y-3 sm:flex-row sm:space-x-3 sm:space-y-0">
        <Button asChild className="flex items-center">
          <Link href="/">
            <Calendar className="mr-2 h-4 w-4" />
            Try Today's Challenge
          </Link>
        </Button>
        <Button variant="outline" asChild className="flex items-center">
          <Link href="https://chat.whatsapp.com/HsIgtz1Ge0MFryTkAVjnIy" target="_blank" rel="noopener noreferrer">
            <Users className="mr-2 h-4 w-4" />
            Join Community
          </Link>
        </Button>
      </div>
    </div>
  )
}

// Helper component for compliment cards
function ComplimentCard({ compliment, type }: { compliment: Compliment; type: "received" | "given" }) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <Avatar className="h-10 w-10 border">
            <AvatarFallback className="bg-primary/10 text-primary">
              {type === "received"
                ? compliment.from_user_email?.charAt(0).toUpperCase() || "U"
                : compliment.to_user_email?.charAt(0).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <p className="font-medium">
                {type === "received"
                  ? `From ${compliment.from_name || compliment.from_user_email?.split("@")[0] || "User"}`
                  : `To ${compliment.to_name || compliment.to_user_email?.split("@")[0] || "User"}`}
              </p>
              <span className="text-xs text-muted-foreground">
                {new Date(compliment.created_at).toLocaleDateString()}
              </span>
            </div>
            <p className="text-sm mt-1">{compliment.message}</p>
            <div className="mt-2 text-xs text-muted-foreground">
              <span className="bg-primary/10 px-2 py-1 rounded-full">{compliment.challenge_title || "Challenge"}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
