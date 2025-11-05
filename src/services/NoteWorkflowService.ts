// ═══════════════════════════════════════════════════════════════
// LAYER 3: Application Services (Business logic)
// ═══════════════════════════════════════════════════════════════

import type { CanManageNoteWorkflow } from '../contracts/CanManageNoteWorkflow';
import type {
  Note,
  SurveyElement,
  QuestionElement,
  NoteElement,
  CorrectionElement,
  WorkflowStep
} from '../entities/Note';

/**
 * Responsible for: Managing the state of a note as it moves through the wizard.
 * Single Responsibility: Orchestrating the S-Q-R1-R2-R3-R4-R5 workflow logic.
 */
export class NoteWorkflowService implements CanManageNoteWorkflow {
  private workflow_progression: Record<WorkflowStep, WorkflowStep> = {
    'SURVEY': 'QUESTION',
    'QUESTION': 'READ',
    'READ': 'RECORD',
    'RECORD': 'RECITE',
    'RECITE': 'REVIEW',
    'REVIEW': 'REFLECT',
    'REFLECT': 'COMPLETED',
    'COMPLETED': 'COMPLETED'
  };

  create_new_note(subject_id: string, title: string): Note {
    return {
      id: crypto.randomUUID(),
      subject_identifier: subject_id,
      title,
      current_step: 'SURVEY',
      survey_elements: [],
      questions: [],
      recorded_notes: {},
      recited_notes: {},
      review_corrections: {},
      reflection: '',
      srs_level: 0,
      next_review_date: 0,
      rating: 0
    };
  }

  add_survey_element(note: Note, element: SurveyElement): Note {
    return {
      ...note,
      survey_elements: [...note.survey_elements, element]
    };
  }

  add_question(note: Note, question: QuestionElement): Note {
    return {
      ...note,
      questions: [...note.questions, question]
    };
  }

  add_recorded_note(note: Note, note_element: NoteElement): Note {
    return {
      ...note,
      recorded_notes: {
        ...note.recorded_notes,
        [note_element.question_id]: note_element
      }
    };
  }

  add_recited_note(note: Note, note_element: NoteElement): Note {
    return {
      ...note,
      recited_notes: {
        ...note.recited_notes,
        [note_element.question_id]: note_element
      }
    };
  }

  add_review_correction(note: Note, correction: CorrectionElement): Note {
    return {
      ...note,
      review_corrections: {
        ...note.review_corrections,
        [correction.question_id]: correction
      }
    };
  }

  advance_to_next_step(note: Note): Note {
    const next_step = this.workflow_progression[note.current_step];
    return {
      ...note,
      current_step: next_step
    };
  }

  set_difficulty_rating(note: Note, rating: number): Note {
    return {
      ...note,
      rating
    };
  }

  add_reflection_and_complete(note: Note, reflection: string): Note {
    return {
      ...note,
      reflection,
      current_step: 'COMPLETED'
    };
  }
}
