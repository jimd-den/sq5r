// ═══════════════════════════════════════════════════════════════
// LAYER 1: Domain Contracts (What the system promises to do)
// ═══════════════════════════════════════════════════════════════

import type {
  Note,
  SurveyElement,
  QuestionElement,
  NoteElement,
  CorrectionElement
} from '../entities/Note';

/**
 * Contract: Defines the capability to manage a note's progression through
 * the SQ5R workflow (Survey, Question, Read, Record, Recite, Review, Reflect).
 */
export interface CanManageNoteWorkflow {
  create_new_note(subject_id: string, title: string): Note;
  add_survey_element(note: Note, element: SurveyElement): Note;
  add_question(note: Note, question: QuestionElement): Note;
  add_recorded_note(note: Note, note_element: NoteElement): Note;
  add_recited_note(note: Note, note_element: NoteElement): Note;
  add_review_correction(note: Note, correction: CorrectionElement): Note;
  advance_to_next_step(note: Note): Note;
  set_difficulty_rating(note: Note, rating: number): Note;
  add_reflection_and_complete(note: Note, reflection: string): Note;
}
