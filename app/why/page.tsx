import { SiteHeader } from "@/components/site-header"
import { Logo } from "@/components/logo"

export default function WhyPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="container mx-auto max-w-2xl px-4 py-6 sm:py-8">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4">
            <Logo />
          </div>
        </div>
        <div className="prose prose-lg mx-auto dark:prose-invert">
          <h1 className="text-center text-2xl font-bold sm:text-3xl md:text-4xl">Why I Built Rally</h1>
          <div className="mt-6 space-y-4 text-base text-gray-800 sm:space-y-5 sm:text-lg">
            <p>Hi friend👋🏾,</p>
            <p>
              My name is Kamso (<a href="https://x.com/Kamso_nwani">X </a>,{" "}
              <a href="https://linkedin.com/in/kamsonwani"> Linkedin</a>).
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
