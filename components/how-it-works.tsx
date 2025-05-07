"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Camera, Share2, ChevronDown, ChevronUp, Star } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

interface HowItWorksProps {
  defaultExpanded?: boolean
}

export function HowItWorks({ defaultExpanded = false }: HowItWorksProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)

  return (
    <Card className="border border-primary/30 shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">How Rally Works</h3>
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
                <p className="font-medium">1. Daily Challenge</p>
                <p className="text-sm text-muted-foreground">Every day at 9 AM, a new challenge is released.</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary/20 text-foreground">
                <Camera className="h-4 w-4" />
              </div>
              <div>
                <p className="font-medium">2. Complete & Capture</p>
                <p className="text-sm text-muted-foreground">Complete the challenge and share your experience.</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary/20 text-foreground">
                <Share2 className="h-4 w-4" />
              </div>
              <div>
                <p className="font-medium">3. Share & Connect</p>
                <p className="text-sm text-muted-foreground">
                  Submit your response before 9 PM and see what others have shared!
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
                  Come back daily to build your streak. The longer your streak, the more you grow!
                </p>
              </div>
            </div>
          </div>
        )}

        {!isExpanded && (
          <p className="mt-2 text-sm text-muted-foreground">Click to learn how to participate in daily challenges</p>
        )}
      </CardContent>
    </Card>
  )
}
