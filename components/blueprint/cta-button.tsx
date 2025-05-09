"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

interface CTAButtonProps {
  onClick?: () => void
  className?: string
}

export function CTAButton({ onClick, className = "" }: CTAButtonProps) {
  return (
    <Button onClick={onClick} className={`text-base px-6 py-6 h-auto whitespace-normal ${className}`}>
      <span className="flex items-center justify-center">
        <span className="mr-2">Yeah, let's build!</span>
        <ArrowRight className="h-4 w-4" />
      </span>
    </Button>
  )
}
