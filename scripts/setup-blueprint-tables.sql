-- Create blueprints table if it doesn't exist
CREATE TABLE IF NOT EXISTS blueprints (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  duration_days INTEGER NOT NULL DEFAULT 26,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  whatsapp_link TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE
);

-- Create blueprint_tasks table if it doesn't exist
CREATE TABLE IF NOT EXISTS blueprint_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  blueprint_id UUID NOT NULL REFERENCES blueprints(id) ON DELETE CASCADE,
  day_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  instructions TEXT NOT NULL,
  skill_focus TEXT NOT NULL,
  examples TEXT NOT NULL,
  story TEXT NOT NULL,
  resources JSONB DEFAULT '[]'::JSONB,
  share_prompt BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(blueprint_id, day_number)
);

-- Create user_blueprint_enrollments table if it doesn't exist
CREATE TABLE IF NOT EXISTS user_blueprint_enrollments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_email TEXT NOT NULL,
  blueprint_id UUID NOT NULL REFERENCES blueprints(id) ON DELETE CASCADE,
  project_idea TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  current_day INTEGER DEFAULT 1,
  start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_email, blueprint_id)
);

-- Create user_blueprint_task_progress table if it doesn't exist
CREATE TABLE IF NOT EXISTS user_blueprint_task_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  enrollment_id UUID NOT NULL REFERENCES user_blueprint_enrollments(id) ON DELETE CASCADE,
  task_id UUID NOT NULL REFERENCES blueprint_tasks(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT FALSE,
  completion_date TIMESTAMP WITH TIME ZONE,
  submission_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(enrollment_id, task_id)
);

-- Insert a sample blueprint if it doesn't exist
INSERT INTO blueprints (
  id,
  title,
  description,
  duration_days,
  start_date,
  whatsapp_link,
  created_at,
  updated_at,
  is_active
) VALUES (
  '123e4567-e89b-12d3-a456-426614174000',
  '26-Day Idea Launch Blueprint',
  'Transform your idea into reality in just 26 days with our structured, step-by-step program designed for Nigerian creators and innovators.',
  26,
  CURRENT_DATE,
  'https://chat.whatsapp.com/example',
  NOW(),
  NOW(),
  TRUE
)
ON CONFLICT (id) DO NOTHING;

-- Insert sample tasks for the blueprint
INSERT INTO blueprint_tasks (
  blueprint_id,
  day_number,
  title,
  instructions,
  skill_focus,
  examples,
  story,
  resources,
  share_prompt
) VALUES
(
  '123e4567-e89b-12d3-a456-426614174000',
  1,
  'Define Your Idea',
  'Write a clear one-paragraph description of your idea. Focus on what problem it solves and who it helps.',
  'Clarity and Focus',
  'Example: "My app helps Nigerian students find affordable textbooks by connecting them with seniors who want to sell their used books. It solves the problem of expensive textbooks and helps reduce waste."',
  'Every great project starts with clarity. When Chioma started her food delivery business, she spent a full day refining her idea until she could explain it in one sentence.',
  '[{"title":"How to Define Your Idea","url":"https://example.com/define-idea","type":"article"},{"title":"Idea Validation Template","url":"https://example.com/template","type":"template"}]',
  TRUE
),
(
  '123e4567-e89b-12d3-a456-426614174000',
  2,
  'Research Your Market',
  'Identify 3 existing solutions similar to your idea. List what they do well and what they could improve.',
  'Market Research',
  'Example: "Competitor 1: Good UI but expensive. Competitor 2: Affordable but limited features. Competitor 3: Great features but not available in Nigeria."',
  'Before launching his fintech app, Ade spent a week researching competitors. This helped him find a unique angle that made his product stand out.',
  '[{"title":"Market Research Basics","url":"https://example.com/market-research","type":"article"},{"title":"Competitor Analysis Tool","url":"https://example.com/tool","type":"tool"}]',
  TRUE
)
ON CONFLICT (blueprint_id, day_number) DO NOTHING;
