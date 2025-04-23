import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Logo } from "@/components/logo"
import { createServerSupabaseClient } from "@/lib/supabase"
import Link from "next/link"
import { ArrowRight, Calendar, Star, MessageSquare } from "lucide-react"

export default async function SubmissionPage({ params }: { params: { id: string } }) {
  const supabase = createServerSupabaseClient()

  // Fetch the submission
  const { data: submission, error: submissionError } = await supabase
    .from("submissions")
    .select("*")
    .eq("id", params.id)
    .single()

  if (submissionError || !submission) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <main className="container mx-auto max-w-3xl px-4 py-8">
          <div className="flex flex-col items-center justify-center text-center">
            <Logo />
            <h1 className="mt-6 text-2xl font-bold">Submission Not Found</h1>
            <p className="mt-2 text-muted-foreground">
              This submission may have been removed or the link is incorrect.
            </p>
            <Button asChild className="mt-6">
              <Link href="/">Try Today's Challenge</Link>
            </Button>
          </div>
        </main>
      </div>
    )
  }

  // Fetch the associated challenge
  const { data: challenge, error: challengeError } = await supabase
    .from("challenges")
    .select("*")
    .eq("id", submission.challenge_id)
    .single()

  if (challengeError || !challenge) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <main className="container mx-auto max-w-3xl px-4 py-8">
          <div className="flex flex-col items-center justify-center text-center">
            <Logo />
            <h1 className="mt-6 text-2xl font-bold">Challenge Not Found</h1>
            <p className="mt-2 text-muted-foreground">
              The challenge associated with this submission may have been removed.
            </p>
            <Button asChild className="mt-6">
              <Link href="/">Try Today's Challenge</Link>
            </Button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="container mx-auto max-w-3xl px-4 py-8">
        <div className="mb-8 text-center">
          <Logo />
          <h1 className="mt-4 text-3xl font-bold">Rally Challenge Completed!</h1>
          <p className="mt-2 text-lg text-muted-foreground">See what others are accomplishing and join the movement</p>
        </div>

        <Card className="mb-8 overflow-hidden">
          <div className="h-2 bg-primary"></div>
          <CardHeader>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-bold">{challenge.title}</h2>
              <Badge>{challenge.category}</Badge>
              <Badge variant="outline">{challenge.difficulty}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="mb-4">{challenge.description}</p>
            <blockquote className="border-l-2 border-primary/20 pl-4">
              <p className="italic">"{challenge.quote}"</p>
              <footer className="mt-1 text-sm text-muted-foreground">— {challenge.author}</footer>
            </blockquote>

            <div className="mt-6 rounded-lg bg-primary/5 p-4">
              <div className="mb-3 flex items-center">
                <Star className="mr-2 h-5 w-5 text-primary" />
                <h3 className="font-semibold">Completed by {submission.name}</h3>
              </div>
              <p className="mb-2 text-sm text-muted-foreground">
                @{submission.handle} stepped outside their comfort zone and completed this challenge!
              </p>

              {submission.submission_link && (
                <div className="mt-4">
                  <Button variant="outline" className="w-full" asChild>
                    <a href={submission.submission_link} target="_blank" rel="noopener noreferrer">
                      View Their Submission
                    </a>
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t p-4">
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="mr-2 h-4 w-4" />
              <span>
                {new Date(challenge.scheduled_date).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
            <div className="text-sm text-muted-foreground">{challenge.hashtag}</div>
          </CardFooter>
        </Card>

        <div className="space-y-6">
          <div className="rounded-lg bg-black p-6 text-center text-white">
            <h2 className="mb-3 text-2xl font-bold">Ready to Try Something New?</h2>
            <p className="mb-4">Join thousands of others stepping outside their comfort zone with daily challenges.</p>
            <div className="flex flex-col space-y-3 sm:flex-row sm:space-x-3 sm:space-y-0">
              <Button asChild size="lg" className="bg-primary text-black hover:bg-primary/90">
                <Link href="/">
                  Try Today's Challenge <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <a href="https://chat.whatsapp.com/HsIgtz1Ge0MFryTkAVjnIy" target="_blank" rel="noopener noreferrer">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Join WhatsApp Group
                </a>
              </Button>
            </div>
          </div>

          <Card>
            <CardContent className="p-6">
              <h3 className="mb-3 text-lg font-bold">Why Rally Works</h3>
              <p className="mb-4 text-muted-foreground">Rally helps you build a habit of trying new things through:</p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <div className="mr-3 flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary">
                    1
                  </div>
                  <div>
                    <p className="font-medium">Daily Challenges</p>
                    <p className="text-sm text-muted-foreground">Curated activities to expand your horizons</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="mr-3 flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary">
                    2
                  </div>
                  <div>
                    <p className="font-medium">Community Sharing</p>
                    <p className="text-sm text-muted-foreground">See what others are accomplishing</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="mr-3 flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary">
                    3
                  </div>
                  <div>
                    <p className="font-medium">Growth Tracking</p>
                    <p className="text-sm text-muted-foreground">Build a visual record of your journey</p>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="mt-12 bg-black px-4 py-6 text-white sm:mt-16 sm:py-8">
        <div className="container mx-auto max-w-3xl text-center">
          <p className="mb-3 sm:mb-4">© 2025 Rally. Made with ❤️ in Nigeria.</p>
          <div className="flex justify-center space-x-4 text-sm">
            <a href="/why" className="hover:underline">
              Why Rally?
            </a>
            <a href="/partner" className="hover:underline">
              Partner with Us
            </a>
            <a href="https://forms.gle/Fn2bPEwHnRerrg7h9" className="hover:underline">
              Give Feedback
            </a>
            <a
              href="https://chat.whatsapp.com/HsIgtz1Ge0MFryTkAVjnIy"
              target="_blank"
              className="hover:underline"
              rel="noreferrer"
            >
              Join WhatsApp Group
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
