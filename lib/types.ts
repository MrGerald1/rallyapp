export interface Blueprint {
  id: string
  title: string
  description: string
  duration_days: number
  start_date: string
  whatsapp_link: string
  created_at: string
  updated_at: string
  is_active: boolean
}

export interface BlueprintTask {
  id: string
  blueprint_id: string
  day_number: number
  title: string
  instructions: string
  skill_focus: string
  examples: string
  story: string
  resources: Resource[]
  share_prompt: boolean
  created_at: string
  updated_at: string
}

export interface Resource {
  title: string
  url: string
  type: "article" | "video" | "template" | "tool" | "other"
}

export interface BlueprintEnrollment {
  id: string
  user_email: string
  blueprint_id: string
  project_idea: string
  phone_number: string
  current_day: number
  start_date: string
  completed: boolean
  created_at: string
  updated_at: string
}

export interface BlueprintTaskProgress {
  id: string
  enrollment_id: string
  task_id: string
  completed: boolean
  completion_date: string | null
  submission_data: any
  created_at: string
  updated_at: string
}

export interface BlueprintStats {
  total_enrollments: number
  average_completion_rate: number
  daily_completion_rates: { day: number; completion_rate: number }[]
}

export interface Challenge {
  id: string
  title: string
  description: string
  category: string
  difficulty: string
  hashtag: string
  quote: string
  author: string
  scheduled_date: string
  is_current?: boolean
}

export interface Submission {
  id: string
  name: string
  handle: string
  submission_link: string
  challenge_id: string
  created_at: string
  email?: string
}

export interface LeaderboardEntry {
  email: string
  name: string
  points: number
  currentStreak: number
  position: number
}
