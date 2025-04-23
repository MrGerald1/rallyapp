"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Twitter, Linkedin, Download, Copy, Check, MessageCircle, Facebook, Instagram } from "lucide-react"
import html2canvas from "html2canvas"
import { Logo } from "@/components/logo"
import { useToast } from "@/components/ui/use-toast"

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
  const { toast } = useToast()

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

  // Share to Instagram (note: direct sharing to Instagram is limited, so we'll copy to clipboard)
  const shareToInstagram = () => {
    if (imageUrl) {
      // For Instagram, we'll download the image and notify the user
      const link = document.createElement("a")
      link.href = imageUrl
      link.download = `rally-challenge-${new Date().toISOString().split("T")[0]}.png`
      link.click()

      // Show toast notification
      toast({
        title: "Image downloaded!",
        description: "Open Instagram and create a new post with this image.",
      })
    }
  }

  // Share to WhatsApp
  const shareToWhatsApp = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${shareText}\n\n${shareUrl}`)}`
    window.open(whatsappUrl, "_blank")
  }

  return (
    <div className="space-y-4">
      {/* The card that will be captured as an image */}
      <div
        ref={cardRef}
        className="p-4 bg-gradient-to-br from-white to-primary/5 rounded-xl shadow-lg max-w-sm mx-auto"
      >
        <div className="flex items-center justify-between mb-3">
          <Logo />
          <span className="text-xs font-medium text-primary">Rally Challenge</span>
        </div>

        <div className="bg-white/80 backdrop-blur-sm p-3 rounded-lg mb-3 shadow-sm">
          <h3 className="font-bold text-lg mb-1 text-black">{challengeTitle}</h3>
          <p className="text-sm text-muted-foreground">Completed by {name}</p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {streak > 0 && (
              <div className="flex items-center space-x-1 bg-yellow-100 px-2 py-1 rounded-full shadow-sm">
                <span className="text-yellow-700 text-xs font-bold">{streak} day streak 🔥</span>
              </div>
            )}
          </div>
          <span className="text-xs text-muted-foreground">startrally.xyz</span>
        </div>
      </div>

      {/* Share buttons - compact row of icons */}
      <div className="flex justify-center space-x-3 py-2">
        <button
          onClick={shareToTwitter}
          className="p-2 rounded-full hover:bg-blue-50 transition-colors"
          aria-label="Share to Twitter"
        >
          <Twitter className="h-5 w-5 text-blue-500" />
        </button>

        <button
          onClick={shareToFacebook}
          className="p-2 rounded-full hover:bg-blue-100 transition-colors"
          aria-label="Share to Facebook"
        >
          <Facebook className="h-5 w-5 text-blue-600" />
        </button>

        <button
          onClick={shareToLinkedIn}
          className="p-2 rounded-full hover:bg-blue-50 transition-colors"
          aria-label="Share to LinkedIn"
        >
          <Linkedin className="h-5 w-5 text-blue-700" />
        </button>

        <button
          onClick={shareToInstagram}
          className="p-2 rounded-full hover:bg-pink-50 transition-colors"
          aria-label="Share to Instagram"
        >
          <Instagram className="h-5 w-5 text-pink-600" />
        </button>

        <button
          onClick={shareToWhatsApp}
          className="p-2 rounded-full hover:bg-green-50 transition-colors"
          aria-label="Share to WhatsApp"
        >
          <MessageCircle className="h-5 w-5 text-green-500" />
        </button>
      </div>

      {/* Download and copy buttons */}
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
  )
}
