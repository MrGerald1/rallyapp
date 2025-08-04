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
  resources: string
  share_prompt: string
  created_at: string
  updated_at: string
  requires_submission: boolean
  submission_instructions: string
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
  completion_date: string
  submission_data: any
  created_at: string
  updated_at: string
}

export interface EnrollmentFormData {
  user_email: string
  project_idea: string
  phone_number: string
}

export interface EnrollmentWithBlueprint extends BlueprintEnrollment {
  blueprint: Blueprint
}

export interface TaskWithProgress extends BlueprintTask {
  progress?: BlueprintTaskProgress
}

export interface BlueprintStats {
  total_enrollments: number
  active_enrollments: number
  completed_enrollments: number
  completion_rate: number
  average_progress: number
  task_completion_rates: {
    task_id: string
    task_title: string
    day_number: number
    completion_count: number
    completion_rate: number
  }[]
}
