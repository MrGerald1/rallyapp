"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Heart, MessageCircle, ExternalLink, Loader2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface RallyTogetherProps {
  challengeId: string
  currentUserEmail: string
}

export function RallyTogether({ challengeId, currentUserEmail }: RallyTogetherProps) {
  const [randomSubmission, setRandomSubmission] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [isSent, setIsSent] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    // Fetch a random submission for this challenge
    const fetchRandomSubmission = async () => {
      try {
        setLoading(true)

        // In a real implementation, we would fetch from the API
        // For demo purposes, simulate a random submission
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Simulate a random submission with either an image or a link
        const randomType = Math.random() > 0.5 ? "image" : "link"

        if (randomType === "image") {
          setRandomSubmission({
            id: "123",
            user_email: "user@example.com",
            user_name: "Jane",
            image_url: "/placeholder.svg?height=300&width=400",
            description: "I tried something new today and it was amazing!",
          })
        } else {
          setRandomSubmission({
            id: "456",
            user_email: "another@example.com",
            user_name: "John",
            submission_link: "https://example.com/submission",
            description: "Check out my submission on Instagram!",
          })
        }
      } catch (err) {
        console.error("Error fetching random submission:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchRandomSubmission()
  }, [challengeId])

  const handleSendCompliment = async () => {
    if (!message.trim()) {
      setError("Please enter a message")
      return
    }

    try {
      setIsSending(true)
      setError("")

      // Simulate sending a compliment
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // In a real implementation, we would send the compliment to the API
      // const response = await fetch("/api/compliments", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({
      //     from_user_email: currentUserEmail,
      //     to_user_email: randomSubmission.user_email,
      //     challenge_id: challengeId,
      //     message: message.trim()
      //   })
      // })

      setIsSent(true)
    } catch (err) {
      console.error("Error sending compliment:", err)
      setError("Failed to send compliment. Please try again.")
    } finally {
      setIsSending(false)
    }
  }

  if (loading) {
    return (
      <Card className="mt-6 border-t-4 border-t-primary">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Heart className="mr-2 h-5 w-5 text-primary" />
            Rally Together
          </CardTitle>
          <CardDescription>Loading another user's submission...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
        </CardContent>
      </Card>
    )
  }

  if (!randomSubmission) {
    return (
      <Card className="mt-6 border-t-4 border-t-primary">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Heart className="mr-2 h-5 w-5 text-primary" />
            Rally Together
          </CardTitle>
          <CardDescription>Be the first to complete this challenge!</CardDescription>
        </CardHeader>
        <CardContent>
          <p>No other submissions found for this challenge yet. Complete the challenge and be the trailblazer!</p>
        </CardContent>
      </Card>
    )
  }

  if (isSent) {
    return (
      <Card className="mt-6 border-t-4 border-t-primary">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Heart className="mr-2 h-5 w-5 text-primary fill-primary" />
            Compliment Sent!
          </CardTitle>
          <CardDescription>You've brightened someone's day</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-primary/10 p-4 rounded-md mb-4">
            <p className="font-medium mb-2">Your message:</p>
            <p className="italic">"{message}"</p>
          </div>
          <p className="mb-4">Thank you for encouraging another Rally user! Your support helps build our community.</p>
        </CardContent>
        <CardFooter>
          <Button asChild className="w-full">
            <Link href="/my-compliments">
              <MessageCircle className="mr-2 h-4 w-4" />
              View My Compliments
            </Link>
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card className="mt-6 border-t-4 border-t-primary">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Heart className="mr-2 h-5 w-5 text-primary" />
          Rally Together
        </CardTitle>
        <CardDescription>Encourage someone who completed the same challenge</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <p className="font-medium mb-2">
            {randomSubmission.user_name || randomSubmission.user_email.split("@")[0]}'s submission:
          </p>

          {/* Show the actual submission content */}
          {randomSubmission.image_url && (
            <div className="relative w-full h-48 mb-4 rounded-md overflow-hidden">
              <Image
                src={randomSubmission.image_url || "/placeholder.svg"}
                alt="User submission"
                fill
                className="object-cover"
              />
            </div>
          )}

          {randomSubmission.submission_link && (
            <a
              href={randomSubmission.submission_link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center p-3 mb-4 bg-primary/10 rounded-md hover:bg-primary/20 transition-colors"
            >
              <ExternalLink className="h-5 w-5 mr-2 flex-shrink-0" />
              <span className="text-sm font-medium truncate">View their submission</span>
            </a>
          )}

          {randomSubmission.description && (
            <p className="text-muted-foreground italic">"{randomSubmission.description}"</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="message" className="block text-sm font-medium">
            Send a compliment:
          </label>
          <Textarea
            id="message"
            placeholder="Great job! Keep up the good work..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="min-h-[100px]"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" asChild>
          <Link href="/my-compliments">
            <MessageCircle className="mr-2 h-4 w-4" />
            My Compliments
          </Link>
        </Button>
        <Button onClick={handleSendCompliment} disabled={isSending || !message.trim()}>
          {isSending ? "Sending..." : "Send Compliment"}
        </Button>
      </CardFooter>
    </Card>
  )
}
