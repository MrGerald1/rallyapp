import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

export default function WhyPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="container mx-auto max-w-2xl px-4 py-6 sm:py-8">
        <div className="mb-6 text-center">
          <h1 className="font-heading text-center text-3xl font-bold sm:text-4xl md:text-5xl">Why I Built Rally</h1>
        </div>
        <div className="prose prose-lg mx-auto dark:prose-invert">
          <div className="mt-6 space-y-4 text-base text-gray-800 sm:space-y-5 sm:text-lg">
            <p>Hi friend👋🏾,</p>
            <p>
              My name is Kamso (
              <a href="https://x.com/Kamso_nwani" className="text-primary hover:underline">
                X{" "}
              </a>
              ,{" "}
              <a href="https://linkedin.com/in/kamsonwani" className="text-primary hover:underline">
                {" "}
                Linkedin
              </a>
              ).
            </p>
            <p>
              I created Rally out of a simple, persistent thought—what if every day could hold something new? A small
              adventure, a quiet challenge, a moment that breaks the rhythm of the ordinary. I wanted my days to stretch
              beyond routine, to carry a little more meaning.
            </p>
            <p>But meaning is best when shared. And so, Rally is now yours too.</p>
            <p>
              Thank you for stepping into this little experiment with me. May your days surprise you. May joy find you
              in unexpected ways.💙
            </p>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
