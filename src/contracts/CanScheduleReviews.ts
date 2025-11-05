// ═══════════════════════════════════════════════════════════════
// LAYER 1: Domain Contracts (What the system promises to do)
// ═══════════════════════════════════════════════════════════════

import type { Note } from '../entities/Note';

/**
 * Contract: Defines the capability to calculate review schedules using
 * spaced repetition algorithms based on user performance ratings.
 */
export interface CanScheduleReviews {
  calculate_next_review_date(note: Note, performance_rating: number): {
    next_review_date: number;
    srs_level: number;
  };
  find_notes_due_for_review(all_notes: Note[]): Note[];
}
