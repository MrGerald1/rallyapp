import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import { Montserrat } from "next/font/google"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Suspense } from "react"
import Script from "next/script"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })
const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["400", "500", "600", "700", "800", "900"],
})

export const metadata = {
  title: "Rally - Try Something New",
  description: "Step outside your comfort zone with daily challenges and build meaningful habits.",
    generator: 'v0.app'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Twitter Pixel Base Code */}
        <Script id="twitter-pixel" strategy="afterInteractive">
          {`
            !function(e,t,n,s,u,a){e.twq||(s=e.twq=function(){s.exe?s.exe.apply(s,arguments):s.queue.push(arguments);
            },s.version='1.1',s.queue=[],u=t.createElement(n),u.async=!0,u.src='https://static.ads-twitter.com/uwt.js',
            a=t.getElementsByTagName(n)[0],a.parentNode.insertBefore(u,a))}(window,document,'script');
            twq('config','qbzk5');
          `}
        </Script>
      </head>
      <body className={`${inter.variable} ${montserrat.variable} font-sans`}>
        <Suspense fallback={null}>
          {children}
          <Analytics />
          <SpeedInsights />
        </Suspense>
      </body>
    </html>
  )
}
