"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Twitter, Linkedin, Download, Copy, Check, MessageCircle, Facebook } from "lucide-react"
import html2canvas from "html2canvas"
import { Logo } from "@/components/logo"

interface SocialShareCardProps {
  name: string
  challengeTitle: string
  streak: number
  submissionId: string
}

export function SocialShareCard({ name, challengeTitle, streak, submissionId }: SocialShareCardProps) {
  const [copied, setCopied] = useState(false)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const shareUrl = `https://startrally.xyz/s/${submissionId}?ref=share`

  // Generate share text for different platforms
  const shareText = `I just completed the "${challengeTitle}" challenge on Rally! ${streak > 1 ? `That's ${streak} days in a row! 🔥` : ""} #JoinRally`

  // Generate the shareable image
  const generateImage = async () => {
    if (!cardRef.current) return

    try {
      setIsGenerating(true)

      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        backgroundColor: null,
        logging: false,
      })

      const dataUrl = canvas.toDataURL("image/png")
      setImageUrl(dataUrl)
    } catch (error) {
      console.error("Error generating image:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  // Generate image on component mount
  useEffect(() => {
    generateImage()
  }, [])

  // Copy share link to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(`${shareText}\n\n${shareUrl}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Download the generated image
  const downloadImage = () => {
    if (!imageUrl) return

    const link = document.createElement("a")
    link.href = imageUrl
    link.download = `rally-challenge-${new Date().toISOString().split("T")[0]}.png`
    link.click()
  }

  // Share to Twitter
  const shareToTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`
    window.open(twitterUrl, "_blank")
  }

  // Share to LinkedIn
  const shareToLinkedIn = () => {
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}&summary=${encodeURIComponent(shareText)}`
    window.open(linkedinUrl, "_blank")
  }

  // Share to Facebook
  const shareToFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`
    window.open(facebookUrl, "_blank")
  }

  // Share to WhatsApp
  const shareToWhatsApp = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${shareText}\n\n${shareUrl}`)}`
    window.open(whatsappUrl, "_blank")
  }

  return (
    <div className="space-y-4">
      {/* The card that will be captured as an image */}
      <div ref={cardRef} className="p-4 bg-white rounded-lg shadow-lg w-[300px] mx-auto">
        <div className="flex items-center justify-between mb-3">
          <Logo />
          <span className="text-xs text-muted-foreground">Rally Challenge</span>
        </div>

        <div className="bg-primary/10 p-3 rounded-lg mb-3">
          <h3 className="font-bold text-lg mb-1 text-black">{challengeTitle}</h3>
          <p className="text-sm text-muted-foreground">Completed by {name}</p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {streak > 0 && (
              <div className="flex items-center space-x-1 bg-yellow-100 px-2 py-1 rounded-full">
                <span className="text-yellow-700 text-xs font-bold">{streak} day streak 🔥</span>
              </div>
            )}
          </div>
          <span className="text-xs text-muted-foreground">startrally.xyz</span>
        </div>
      </div>

      {/* Share buttons - now with 4 options (removed TikTok) */}
      <div className="space-y-3">
        <div className="grid grid-cols-4 gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex flex-col items-center justify-center h-16 p-1"
            onClick={shareToTwitter}
          >
            <Twitter className="h-5 w-5 mb-1" />
            <span className="text-xs">Twitter</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="flex flex-col items-center justify-center h-16 p-1"
            onClick={shareToWhatsApp}
          >
            <MessageCircle className="h-5 w-5 mb-1" />
            <span className="text-xs">WhatsApp</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="flex flex-col items-center justify-center h-16 p-1"
            onClick={shareToLinkedIn}
          >
            <Linkedin className="h-5 w-5 mb-1" />
            <span className="text-xs">LinkedIn</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="flex flex-col items-center justify-center h-16 p-1"
            onClick={shareToFacebook}
          >
            <Facebook className="h-5 w-5 mb-1" />
            <span className="text-xs">Facebook</span>
          </Button>
        </div>

        <div className="flex space-x-2">
          <Button variant="outline" className="flex-1" onClick={downloadImage} disabled={!imageUrl || isGenerating}>
            <Download className="mr-2 h-4 w-4" />
            Save Image
          </Button>

          <Button variant={copied ? "default" : "outline"} className="flex-1" onClick={copyToClipboard}>
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
        </div>
      </div>
    </div>
  )
}
