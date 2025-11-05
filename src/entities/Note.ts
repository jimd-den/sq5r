// ═══════════════════════════════════════════════════════════════
// LAYER 2: Domain Entities (Core business concepts)
// ═══════════════════════════════════════════════════════════════

/**
 * Represents: A subject or topic that contains multiple study notes.
 */
export interface NoteSubject {
  id: string;
  name: string;
  note_identifiers: string[];
}

/**
 * Represents: A single study element captured during the Survey step.
 */
export interface SurveyElement {
  id: string;
  type: 'heading' | 'keyword' | 'diagram' | 'other';
  content: string;
}

/**
 * Represents: A question formulated during the Question step.
 */
export interface QuestionElement {
  id: string;
  text: string;
}

/**
 * Represents: A note recorded during the Record step, linked to a specific question.
 */
export interface NoteElement {
  id: string;
  question_id: string;
  content: string;
}

/**
 * Represents: A correction or gap identified during the Review step.
 */
export interface CorrectionElement {
  id: string;
  question_id: string;
  content: string;
}

/**
 * Represents: The current step in the SQ5R workflow.
 */
export type WorkflowStep =
  | 'SURVEY'
  | 'QUESTION'
  | 'READ'
  | 'RECORD'
  | 'RECITE'
  | 'REVIEW'
  | 'REFLECT'
  | 'COMPLETED';

/**
 * Represents: A single study note progressing through the SQ5R workflow.
 */
export interface Note {
  id: string;
  subject_identifier: string;
  title: string;
  current_step: WorkflowStep;
  survey_elements: SurveyElement[];
  questions: QuestionElement[];
  recorded_notes: Record<string, NoteElement>;
  recited_notes: Record<string, NoteElement>;
  review_corrections: Record<string, CorrectionElement>;
  reflection: string;
  srs_level: number;
  next_review_date: number;
  rating: number;
}
