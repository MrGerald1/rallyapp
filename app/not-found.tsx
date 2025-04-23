import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/logo"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="container mx-auto flex max-w-3xl flex-col items-center justify-center px-4 py-16">
        <Logo />

        <h1 className="mt-8 text-center text-4xl font-bold">Page Not Found</h1>

        <p className="mt-4 text-center text-lg text-muted-foreground">
          We couldn't find the page you were looking for. Let's find a new challenge instead!
        </p>

        <div className="mt-8 rounded-lg bg-primary/5 p-6 text-center">
          <blockquote className="mb-2 text-xl italic">"The path to growth is rarely a straight line."</blockquote>
          <p className="text-sm text-muted-foreground">— Rally Team</p>
        </div>

        <div className="mt-8 flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
          <Button asChild>
            <Link href="/">Return Home</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/why">Learn About Rally</Link>
          </Button>
        </div>
      </main>
    </div>
  )
}
