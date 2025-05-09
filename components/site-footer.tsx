import Link from "next/link"
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react"
import { Logo } from "@/components/logo"

export function SiteFooter() {
  return (
    <footer className="bg-black px-4 py-12 text-white">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Logo />
              <span className="text-xl font-bold">Rally</span>
            </div>
            <p className="text-sm text-gray-300">
              Rally helps you step outside your comfort zone with daily challenges, build streaks, and connect with a
              community of like-minded individuals.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <Youtube className="h-5 w-5" />
                <span className="sr-only">YouTube</span>
              </a>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-bold">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/daily-challenges" className="text-gray-300 hover:text-white hover:underline">
                  Daily Challenges
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="text-gray-300 hover:text-white hover:underline">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/blueprint" className="text-gray-300 hover:text-white hover:underline">
                  26-Day Blueprint
                </Link>
              </li>
              <li>
                <Link href="/community?tab=compliments" className="text-gray-300 hover:text-white hover:underline">
                  Compliments
                </Link>
              </li>
              <li>
                <Link href="/community" className="text-gray-300 hover:text-white hover:underline">
                  Leaderboard
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-bold">Community</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="https://chat.whatsapp.com/HsIgtz1Ge0MFryTkAVjnIy"
                  target="_blank"
                  className="text-gray-300 hover:text-white hover:underline"
                  rel="noreferrer"
                >
                  Join WhatsApp Group
                </Link>
              </li>
              <li>
                <Link href="/partner" className="text-gray-300 hover:text-white hover:underline">
                  Partner With Us
                </Link>
              </li>
              <li>
                <Link href="/why" className="text-gray-300 hover:text-white hover:underline">
                  Why Rally?
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-300 hover:text-white hover:underline">
                  Testimonials
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-bold">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li className="text-gray-300">
                Email:{" "}
                <a href="mailto:hello@rally.ng" className="hover:text-white hover:underline">
                  hello@rally.ng
                </a>
              </li>
              <li className="text-gray-300">
                Address: <br />
                Lagos, Nigeria
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-800 pt-8 text-center">
          <p className="text-sm text-gray-300">© 2025 Rally. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
