import { redirect } from "next/navigation"

export default function LeaderboardRedirectPage() {
  redirect("/community?tab=leaderboard")
}
