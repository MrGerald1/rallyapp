import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Edit, Eye, Trash } from "lucide-react"

interface AdminChallengeCardProps {
  title: string
  description: string
  date: string
  hashtag: string
  quote: string
  author: string
  category: string
  difficulty: string
}

export function AdminChallengeCard({
  title,
  description,
  date,
  hashtag,
  quote,
  author,
  category,
  difficulty,
}: AdminChallengeCardProps) {
  return (
    <Card className="mb-4">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-bold">{title}</h2>
              <Badge>{category}</Badge>
              <Badge variant="outline">{difficulty}</Badge>
            </div>
            <p className="text-muted-foreground">{description}</p>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{date}</span>
              <span className="text-yellow-600">{hashtag}</span>
            </div>
            <blockquote className="border-l-2 border-yellow-200 pl-4">
              <p className="italic">"{quote}"</p>
              <footer className="mt-1 text-sm text-muted-foreground">— {author}</footer>
            </blockquote>
          </div>
        </div>
        <div className="mt-6 flex space-x-2">
          <Button variant="outline" size="sm">
            Set as Today&apos;s Challenge
          </Button>
          <Button variant="outline" size="sm">
            <Calendar className="mr-2 h-4 w-4" />
            Schedule
          </Button>
          <Button variant="ghost" size="sm">
            <Eye className="mr-2 h-4 w-4" />
            View
          </Button>
          <Button variant="ghost" size="sm">
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600">
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
