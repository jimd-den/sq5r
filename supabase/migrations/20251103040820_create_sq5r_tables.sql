/*
  # Create sq5r Application Tables

  ## Overview
  This migration creates the database schema for the sq5r guided study application.
  The schema supports the SQ5R (Survey, Question, Read, Record, Recite, Review, Reflect)
  methodology with spaced repetition for optimal retention.

  ## New Tables

  ### `note_subjects`
  Represents a subject or topic that contains multiple study notes.
  - `id` (uuid, primary key)
  - `name` (text, the subject name)
  - `created_at` (timestamptz, auto-generated)

  ### `notes`
  Represents a single study note progressing through the SQ5R workflow.
  - `id` (uuid, primary key)
  - `subject_id` (uuid, foreign key to note_subjects)
  - `title` (text, the note title)
  - `current_step` (text, enum: SURVEY, QUESTION, READ, RECORD, RECITE, REVIEW, REFLECT, COMPLETED)
  - `survey_elements` (jsonb, array of survey elements)
  - `questions` (jsonb, array of questions)
  - `recorded_notes` (jsonb, map of question_id to note element)
  - `recited_notes` (jsonb, map of question_id to note element)
  - `review_corrections` (jsonb, map of question_id to correction element)
  - `reflection` (text, final reflection)
  - `srs_level` (integer, spaced repetition level 0-8)
  - `next_review_date` (bigint, timestamp in milliseconds)
  - `rating` (integer, difficulty rating 1-3)
  - `created_at` (timestamptz, auto-generated)
  - `updated_at` (timestamptz, auto-updated)

  ## Security
  - Enable RLS on all tables
  - All data is accessible without authentication (local-first, single-user application)
  - Policies allow full CRUD operations for all users

  ## Important Notes
  1. This is a local-first application - data is meant to be device-specific
  2. No authentication is required as this is a single-user study tool
  3. JSONB is used for flexible nested data structures (survey elements, questions, notes)
*/

CREATE TABLE IF NOT EXISTS note_subjects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id uuid NOT NULL REFERENCES note_subjects(id) ON DELETE CASCADE,
  title text NOT NULL,
  current_step text NOT NULL DEFAULT 'SURVEY',
  survey_elements jsonb DEFAULT '[]'::jsonb,
  questions jsonb DEFAULT '[]'::jsonb,
  recorded_notes jsonb DEFAULT '{}'::jsonb,
  recited_notes jsonb DEFAULT '{}'::jsonb,
  review_corrections jsonb DEFAULT '{}'::jsonb,
  reflection text DEFAULT '',
  srs_level integer DEFAULT 0,
  next_review_date bigint DEFAULT 0,
  rating integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_notes_subject_id ON notes(subject_id);
CREATE INDEX IF NOT EXISTS idx_notes_current_step ON notes(current_step);
CREATE INDEX IF NOT EXISTS idx_notes_next_review_date ON notes(next_review_date);

ALTER TABLE note_subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations on note_subjects"
  ON note_subjects
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all operations on notes"
  ON notes
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_notes_updated_at BEFORE UPDATE ON notes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
