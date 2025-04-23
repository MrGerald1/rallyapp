"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { LinkIcon } from "lucide-react"

interface ShareCardProps {
  name: string
  email: string // Changed from handle to email
  challengeTitle: string
  challengeId: string | number
  submissionId: string
}

export function ShareCard({ name, email, challengeTitle, challengeId, submissionId }: ShareCardProps) {
  const [copied, setCopied] = useState(false)
  const [shareUrl, setShareUrl] = useState("")

  useEffect(() => {
    // Create the share URL that links directly to this submission
    setShareUrl(`https://startrally.xyz/s/${submissionId}?ref=share`)
  }, [submissionId])

  const shareText = `I just completed the "${challengeTitle}" challenge on Rally! #JoinRally

Join me and try something new today at ${shareUrl}`

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card className="overflow-hidden border-2 border-primary/20">
      <CardContent className="p-5">
        <div className="mb-4 text-center">
          <h3 className="text-lg font-bold">Share Your Achievement!</h3>
          <p className="text-sm text-muted-foreground">Show others what you've accomplished and inspire them to join</p>
        </div>

        <div className="mb-4 rounded-lg bg-black/5 p-3">
          <div className="mb-2 overflow-hidden text-ellipsis whitespace-nowrap">
            <span className="font-semibold">Rally Challenge:</span> {challengeTitle}
          </div>
          <div className="mb-2 overflow-hidden text-ellipsis whitespace-nowrap">
            <span className="font-semibold">Completed by:</span> {name}
          </div>
        </div>

        <Button variant="outline" className="w-full" onClick={copyToClipboard}>
          <LinkIcon className="mr-2 h-4 w-4" />
          {copied ? "Copied!" : "Share your submission"}
        </Button>
      </CardContent>
    </Card>
  )
}
