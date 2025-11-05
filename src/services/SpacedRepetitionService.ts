// ═══════════════════════════════════════════════════════════════
// LAYER 3: Application Services (Business logic)
// ═══════════════════════════════════════════════════════════════

import type { CanScheduleReviews } from '../contracts/CanScheduleReviews';
import type { Note } from '../entities/Note';

/**
 * Responsible for: Calculating review schedules using spaced repetition.
 * Single Responsibility: Implementing the spaced repetition algorithm for optimal retention.
 */
export class SpacedRepetitionService implements CanScheduleReviews {
  private intervals_in_days = [1, 3, 7, 14, 30, 60, 120, 240, 365];

  calculate_next_review_date(note: Note, performance_rating: number): {
    next_review_date: number;
    srs_level: number;
  } {
    let new_level = note.srs_level;

    if (performance_rating === 1) {
      new_level = Math.max(0, note.srs_level - 2);
    } else if (performance_rating === 2) {
      new_level = note.srs_level;
    } else if (performance_rating === 3) {
      new_level = Math.min(this.intervals_in_days.length - 1, note.srs_level + 1);
    }

    const days_until_review = this.intervals_in_days[new_level];
    const milliseconds_per_day = 24 * 60 * 60 * 1000;
    const next_review_date = Date.now() + (days_until_review * milliseconds_per_day);

    return {
      next_review_date,
      srs_level: new_level
    };
  }

  find_notes_due_for_review(all_notes: Note[]): Note[] {
    const current_time = Date.now();
    return all_notes.filter(note =>
      note.current_step === 'COMPLETED' &&
      note.next_review_date <= current_time
    );
  }
}
