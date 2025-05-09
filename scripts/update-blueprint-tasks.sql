-- Add requires_submission and submission_instructions columns to blueprint_tasks table
ALTER TABLE blueprint_tasks 
ADD COLUMN requires_submission BOOLEAN DEFAULT FALSE,
ADD COLUMN submission_instructions TEXT;
