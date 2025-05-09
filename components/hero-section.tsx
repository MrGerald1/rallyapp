import type { ReactNode } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface HeroSectionProps {
  title: string
  subtitle?: string
  accentText?: string
  description?: string
  children?: ReactNode
  backgroundImage?: string
  smallHeader?: boolean
  showDefaultButtons?: boolean
}

export function HeroSection({
  title,
  subtitle,
  accentText,
  description,
  children,
  backgroundImage,
  smallHeader = false,
  showDefaultButtons = true,
}: HeroSectionProps) {
  return (
    <section
      className={`relative bg-black py-${smallHeader ? "12" : "16"} text-white md:py-${smallHeader ? "16" : "24"}`}
    >
      {backgroundImage && (
        <div className="absolute inset-0 z-0 opacity-30">
          <div
            className="h-full w-full bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${backgroundImage})` }}
          ></div>
        </div>
      )}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/80 to-black/60"></div>
      <div className="absolute -left-32 top-0 h-64 w-64 rounded-full bg-[#EF6C36]/20 blur-3xl"></div>
      <div className="absolute -right-32 bottom-0 h-64 w-64 rounded-full bg-[#EF6C36]/20 blur-3xl"></div>

      <div className="container relative z-10 mx-auto max-w-6xl px-4">
        {subtitle && (
          <div className="mb-4 inline-block rounded-full bg-[#EF6C36]/20 px-4 py-1 text-sm font-bold uppercase tracking-wider text-[#EF6C36]">
            {subtitle}
          </div>
        )}

        <h1
          className={`font-heading mb-6 text-${smallHeader ? "4xl" : "5xl"} font-black uppercase tracking-tight md:text-${smallHeader ? "5xl" : "7xl"}`}
        >
          {accentText ? (
            <>
              {title} <br />
              <span className="text-[#EF6C36]">{accentText}</span>
            </>
          ) : (
            title
          )}
        </h1>

        {description && <p className="mb-8 max-w-2xl text-lg text-gray-300 md:text-xl">{description}</p>}

        {children ? (
          children
        ) : showDefaultButtons ? (
          <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
            <Button size="lg" className="bg-[#EF6C36] hover:bg-[#EF6C36]/90" asChild>
              <Link href="/daily-challenges">Today's Challenge</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild>
              <Link href="/blueprint">26-Day Blueprint</Link>
            </Button>
          </div>
        ) : null}
      </div>
    </section>
  )
}
