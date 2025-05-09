"use client"

import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Users, Target, Award, TrendingUp, Mail } from "lucide-react"
import { SiteFooter } from "@/components/site-footer"

export default function PartnerPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="container mx-auto max-w-4xl px-4 py-8 sm:py-12">
        {/* Header and Tagline */}
        <div className="mb-12 text-center">
          <h1 className="font-heading mb-4 text-4xl font-bold sm:text-5xl md:text-6xl">Partner with Rally</h1>
          <p className="mx-auto max-w-2xl text-xl text-muted-foreground">
            Create personalized, gamified experiences that increase loyalty and reward engagement
          </p>
        </div>

        {/* Introduction Section */}
        <div className="mb-16 rounded-lg bg-primary/5 p-6 sm:p-8">
          <h2 className="font-heading mb-4 text-2xl font-bold sm:text-3xl">Empower Your Audience to Grow</h2>
          <p className="mb-6 text-lg">
            Rally is a platform that helps people step outside their comfort zone through daily challenges. By
            partnering with Rally, your brand can create meaningful connections with your audience, encouraging them to
            try new things and celebrate their growth journey.
          </p>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="flex items-start space-x-3">
              <Users className="mt-1 h-6 w-6 text-primary" />
              <div>
                <h3 className="font-heading font-semibold">Engage Your Community</h3>
                <p className="text-muted-foreground">
                  Create challenges that resonate with your audience and align with your brand values.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Target className="mt-1 h-6 w-6 text-primary" />
              <div>
                <h3 className="font-heading font-semibold">Targeted Experiences</h3>
                <p className="text-muted-foreground">
                  Deliver personalized challenges based on user preferences and behaviors.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Core Offerings */}
        <div className="mb-16">
          <h2 className="font-heading mb-8 text-center text-2xl font-bold sm:text-3xl">
            How Rally Can Help Your Brand
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="overflow-hidden border-none">
              <div className="h-2 bg-primary"></div>
              <CardContent className="p-6">
                <Award className="mb-4 h-10 w-10 text-primary" />
                <h3 className="font-heading mb-2 text-xl font-bold">Reward Engagement</h3>
                <p className="text-muted-foreground">
                  Create a reward system that recognizes and celebrates user participation and achievements.
                </p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-none">
              <div className="h-2 bg-primary"></div>
              <CardContent className="p-6">
                <TrendingUp className="mb-4 h-10 w-10 text-primary" />
                <h3 className="font-heading mb-2 text-xl font-bold">Increase Loyalty</h3>
                <p className="text-muted-foreground">
                  Build stronger connections with your audience through consistent, meaningful interactions.
                </p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-none sm:col-span-2 lg:col-span-1">
              <div className="h-2 bg-primary"></div>
              <CardContent className="p-6">
                <Users className="mb-4 h-10 w-10 text-primary" />
                <h3 className="font-heading mb-2 text-xl font-bold">Community Building</h3>
                <p className="text-muted-foreground">
                  Foster a sense of community among your audience as they share their experiences and achievements.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Success Stories */}
        <div className="mb-16">
          <h2 className="font-heading mb-8 text-center text-2xl font-bold sm:text-3xl">What Rally Offers</h2>
          <div className="grid gap-8 sm:grid-cols-2">
            <div className="rounded-lg border-none bg-card p-6 shadow-sm">
              <h3 className="font-heading mb-4 text-xl font-bold">Daily Challenges</h3>
              <p className="mb-4 text-muted-foreground">
                Engage your audience with daily challenges that inspire them to try new things and step outside their
                comfort zone.
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start">
                  <ArrowRight className="mr-2 mt-1 h-4 w-4 text-primary" />
                  <span>Customized challenges aligned with your brand</span>
                </li>
                <li className="flex items-start">
                  <ArrowRight className="mr-2 mt-1 h-4 w-4 text-primary" />
                  <span>Scheduled content that keeps users coming back</span>
                </li>
                <li className="flex items-start">
                  <ArrowRight className="mr-2 mt-1 h-4 w-4 text-primary" />
                  <span>Varied difficulty levels to accommodate all users</span>
                </li>
              </ul>
            </div>

            <div className="rounded-lg border-none bg-card p-6 shadow-sm">
              <h3 className="font-heading mb-4 text-xl font-bold">Social Sharing</h3>
              <p className="mb-4 text-muted-foreground">
                Amplify your reach as users share their challenge completions on social media, creating organic
                promotion for your brand.
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start">
                  <ArrowRight className="mr-2 mt-1 h-4 w-4 text-primary" />
                  <span>Built-in sharing features with your branded hashtags</span>
                </li>
                <li className="flex items-start">
                  <ArrowRight className="mr-2 mt-1 h-4 w-4 text-primary" />
                  <span>Community showcase of submissions</span>
                </li>
                <li className="flex items-start">
                  <ArrowRight className="mr-2 mt-1 h-4 w-4 text-primary" />
                  <span>Increased visibility through user-generated content</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Call-to-Action */}
        <div className="rounded-lg bg-black p-8 text-center text-white sm:p-12">
          <h2 className="font-heading mb-4 text-2xl font-bold sm:text-3xl">Ready to Partner with Rally?</h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-300">
            Join us in helping people step outside their comfort zone while building stronger connections with your
            audience.
          </p>
          <Button
            size="lg"
            className="bg-primary text-white hover:bg-primary/90"
            onClick={() => {
              window.location.href = "mailto:kamsonwani@yahoo.com?subject=Rally Partnership Inquiry"
            }}
          >
            <Mail className="mr-2 h-5 w-5" />
            Get in Touch
          </Button>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
