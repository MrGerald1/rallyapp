import type React from "react"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/react"
import { Suspense } from "react"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "Rally - Try new things daily",
  description: "Step outside your comfort zone with daily challenges that help you grow and try new things.",
  openGraph: {
    title: "Rally - Try new things daily",
    description: "Step outside your comfort zone with daily challenges that help you grow and try new things.",
    url: "https://startrally.xyz",
    siteName: "Rally",
    images: [
      {
        url: "https://startrally.xyz/og-image.png", // You'll need to create this image
        width: 1200,
        height: 630,
        alt: "Rally - Try new things daily",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rally - Try new things daily",
    description: "Step outside your comfort zone with daily challenges that help you grow and try new things.",
    images: ["https://startrally.xyz/og-image.png"], // Same as OG image
  },
    generator: 'v0.dev'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#FFF8E7]`}>
        <ThemeProvider attribute="class" defaultTheme="light">
          <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
            {children}
          </Suspense>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
