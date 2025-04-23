"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Camera, Share2, ChevronDown, ChevronUp, Star } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

interface HowItWorksProps {
  defaultExpanded?: boolean
}

export function HowItWorks({ defaultExpanded = false }: HowItWorksProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)

  return (
    <Card className="shadow-sm bg-[#FFF9D3] border-none rounded-lg">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">How Rally Works</h3>
          <Button variant="ghost" size="sm" onClick={() => setIsExpanded(!isExpanded)} className="h-8 w-8 p-0">
            {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            <span className="sr-only">{isExpanded ? "Collapse" : "Expand"}</span>
          </Button>
        </div>

        {isExpanded && (
          <div className="mt-4 space-y-4">
            <div className="flex items-start space-x-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary/20 text-foreground">
                <Calendar className="h-4 w-4" />
              </div>
              <div>
                <p className="font-medium">1. Join Today's Challenge</p>
                <p className="text-sm text-muted-foreground">Every day at 9 AM, a new challenge is released.</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary/20 text-foreground">
                <Camera className="h-4 w-4" />
              </div>
              <div>
                <p className="font-medium">2. Complete & Submit Proof</p>
                <p className="text-sm text-muted-foreground">Complete the challenge and share your experience.</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary/20 text-foreground">
                <Share2 className="h-4 w-4" />
              </div>
              <div>
                <p className="font-medium">3. Earn Points & Encourage Others</p>
                <p className="text-sm text-muted-foreground">
                  Submit your response, earn points, and see what others have shared!
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-foreground">
                <Star className="h-4 w-4" />
              </div>
              <div>
                <p className="font-medium">4. Build Your Streak</p>
                <p className="text-sm text-muted-foreground">
                  Come back daily to build your streak. The longer your streak, the more points you earn!
                </p>
              </div>
            </div>
          </div>
        )}

        {isExpanded && (
          <div className="mt-6 text-center">
            <Button variant="outline" asChild>
              <Link href="/how-it-works">
                Learn More About Rally
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        )}

        {!isExpanded && (
          <p className="mt-2 text-sm text-muted-foreground">Click to learn how to participate in daily challenges</p>
        )}
      </CardContent>
    </Card>
  )
}
