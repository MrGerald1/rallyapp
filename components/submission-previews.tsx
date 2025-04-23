"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ExternalLink } from "lucide-react"
import { fetchChallengeSubmissions } from "@/lib/api"

interface Submission {
  id: string
  name: string
  handle: string
  submission_link: string
  challenge_id: string
  created_at: string
}

interface SubmissionPreviewsProps {
  challengeId: string
}

export function SubmissionPreviews({ challengeId }: SubmissionPreviewsProps) {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [isLoading, setIsLoading] = useState(true)
  // Add error state handling
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadSubmissions = async () => {
      try {
        setIsLoading(true)
        setError(null)
        console.log(`Attempting to fetch submissions for challenge: ${challengeId}`)
        const data = await fetchChallengeSubmissions(challengeId)
        // Only show the most recent 5 submissions
        setSubmissions(data.slice(0, 5))
        console.log(`Successfully loaded ${data.length} submissions`)
      } catch (error) {
        console.error("Error loading submissions:", error)
        setError("Unable to load submissions at this time")
        // Set empty array instead of leaving previous state
        setSubmissions([])
      } finally {
        setIsLoading(false)
      }
    }

    if (challengeId) {
      loadSubmissions()
    } else {
      console.log("No challenge ID provided, skipping submission fetch")
      setSubmissions([])
      setIsLoading(false)
    }
  }, [challengeId])

  // Add error UI
  if (error) {
    return (
      <div className="mt-6">
        <h3 className="text-lg font-semibold">Recent Submissions</h3>
        <Card className="mt-2 bg-red-50/50">
          <CardContent className="p-3">
            <p className="text-sm text-muted-foreground">{error}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="mt-6 space-y-4">
        <h3 className="text-lg font-semibold">Recent Submissions</h3>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <CardContent className="p-3">
                <div className="flex items-center space-x-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-3 w-full" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (submissions.length === 0) {
    return (
      <div className="mt-6">
        <h3 className="text-lg font-semibold">Recent Submissions</h3>
        <p className="text-sm text-muted-foreground mt-2">Be the first to submit your response to today's challenge!</p>
      </div>
    )
  }

  return (
    <div className="mt-6 space-y-4">
      <h3 className="text-lg font-semibold">Recent Submissions</h3>
      <div className="space-y-3">
        {submissions.map((submission) => (
          <Card key={submission.id} className="overflow-hidden hover:shadow-md transition-shadow">
            <CardContent className="p-3">
              <a
                href={submission.submission_link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3"
              >
                <Avatar className="h-10 w-10 border">
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {submission.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-medium truncate">{submission.name}</p>
                    <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0 ml-2" />
                  </div>
                  <p className="text-sm text-muted-foreground truncate">@{submission.handle}</p>
                </div>
              </a>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
