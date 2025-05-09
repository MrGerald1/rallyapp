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
  requires_submission: boolean
  submission_instructions?: string
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

export interface TaskProgress {
  id: string
  enrollment_id: string
  task_id: string
  completed: boolean
  completion_date: string | null
  submission_data: any | null
  created_at: string
  updated_at: string
}
