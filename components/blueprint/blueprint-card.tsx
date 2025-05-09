import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Calendar, Users } from "lucide-react"
import Link from "next/link"

export function BlueprintCard() {
  return (
    <Card className="overflow-hidden border-none bg-gradient-to-br from-[#002b5c]/90 to-[#002b5c] text-white">
      <div className="h-2 bg-primary"></div>
      <CardContent className="p-6">
        <div className="mb-4">
          <h3 className="font-heading text-xl font-bold mb-2">26-Day Blueprint</h3>
          <p className="mt-2 text-muted-foreground">
            Transform your idea into reality with our structured, step-by-step program designed for creators
            and innovators.
          </p>
        </div>

        <div className="mb-4 space-y-2">
          <div className="flex items-center">
            <Calendar className="mr-2 h-4 w-4 text-primary" />
            <span className="text-sm">26 days of guided tasks</span>
          </div>
          <div className="flex items-center">
            <Users className="mr-2 h-4 w-4 text-primary" />
            <span className="text-sm">Community support via WhatsApp</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-primary/5 p-6">
        <Button className="w-full text-sm sm:text-base px-2 sm:px-4 whitespace-normal h-auto py-3" asChild>
          <Link href="/blueprint">
            <span className="flex items-center justify-center">
              <span>Learn More & Enroll</span>
              <ArrowRight className="ml-2 h-4 w-4 flex-shrink-0" />
            </span>
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
