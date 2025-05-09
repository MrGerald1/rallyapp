import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import { Montserrat } from "next/font/google"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })
const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["400", "500", "600", "700", "800", "900"],
})

export const metadata = {
  title: "Rally - Daily Challenges",
  description: "Step outside your comfort zone with daily challenges and build meaningful habits.",
    generator: 'v0.dev'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={`${inter.variable} ${montserrat.variable} font-sans`}>{children}</body>
    </html>
  )
}
