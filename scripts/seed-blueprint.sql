-- Insert a sample blueprint
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
