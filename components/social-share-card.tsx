"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Twitter, Facebook, Instagram, Copy, Check, MessageCircle } from "lucide-react"
import Link from "next/link"

interface SocialShareCardProps {
  name: string
  challengeTitle: string
  streak: number
  submissionId: string
}

export function SocialShareCard({ name, challengeTitle, streak, submissionId }: SocialShareCardProps) {
  const [copied, setCopied] = useState(false)
  const shareUrl = `https://startrally.xyz/s/${submissionId}?ref=share`

  // Generate share text
  const shareText = `I just completed the "${challengeTitle}" challenge on Rally! ${streak > 1 ? `That's ${streak} days in a row! 🔥` : ""} #JoinRally`

  // Copy share link to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(`${shareText}\n\n${shareUrl}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6">
      {/* Streak display */}
      <div className="bg-primary/10 p-6 rounded-lg text-center">
        <h3 className="text-2xl font-bold mb-2">You're on a {streak} day streak! 🔥</h3>
        <p className="text-muted-foreground">Keep going to climb the leaderboard and earn more points!</p>
      </div>

      {/* Share buttons */}
      <div>
        <h4 className="font-medium mb-3">Share your achievement:</h4>
        <div className="flex justify-center space-x-3 py-2">
          <Button
            onClick={() => {
              // Twitter share
              const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`
              window.open(twitterUrl, "_blank")
            }}
            variant="outline"
            size="icon"
            className="rounded-full"
          >
            <Twitter className="h-5 w-5 text-blue-500" />
            <span className="sr-only">Share to Twitter</span>
          </Button>

          <Button
            onClick={() => {
              // Facebook share
              const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`
              window.open(facebookUrl, "_blank")
            }}
            variant="outline"
            size="icon"
            className="rounded-full"
          >
            <Facebook className="h-5 w-5 text-blue-600" />
            <span className="sr-only">Share to Facebook</span>
          </Button>

          <Button
            onClick={() => {
              // Instagram - download image first
              alert("To share on Instagram: Download the image and upload it to Instagram with the provided caption.")
            }}
            variant="outline"
            size="icon"
            className="rounded-full"
          >
            <Instagram className="h-5 w-5 text-pink-600" />
            <span className="sr-only">Share to Instagram</span>
          </Button>

          <Button
            onClick={() => {
              // WhatsApp share
              const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${shareText}\n\n${shareUrl}`)}`
              window.open(whatsappUrl, "_blank")
            }}
            variant="outline"
            size="icon"
            className="rounded-full"
          >
            <MessageCircle className="h-5 w-5 text-green-500" />
            <span className="sr-only">Share to WhatsApp</span>
          </Button>
        </div>
      </div>

      {/* Copy link button */}
      <Button variant={copied ? "default" : "outline"} className="w-full" onClick={copyToClipboard}>
        {copied ? (
          <>
            <Check className="mr-2 h-4 w-4" />
            Copied!
          </>
        ) : (
          <>
            <Copy className="mr-2 h-4 w-4" />
            Copy Link
          </>
        )}
      </Button>

      {/* Link to compliment others */}
      <Button variant="default" className="w-full bg-[#FF8882] text-white hover:bg-[#FF8882]/90" asChild>
        <Link href="/compliments">
          <MessageCircle className="mr-2 h-4 w-4" />
          Compliment Others to Earn Points
        </Link>
      </Button>
    </div>
  )
}
