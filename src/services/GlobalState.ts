// ═══════════════════════════════════════════════════════════════
// LAYER 3: Application Services (Business logic)
// ═══════════════════════════════════════════════════════════════

import type { NoteSubject, Note } from '../entities/Note';

export type ViewIdentifier =
  | 'home'
  | 'note_list'
  | 'survey'
  | 'question'
  | 'read'
  | 'record'
  | 'recite'
  | 'review'
  | 'reflect';

/**
 * Represents: The global application state.
 */
export interface ApplicationState {
  current_view_identifier: ViewIdentifier;
  all_subjects: NoteSubject[];
  all_notes: Note[];
  current_subject: NoteSubject | null;
  current_note: Note | null;
  due_reviews: Note[];
}

type StateListener = (state: ApplicationState) => void;

/**
 * Responsible for: Managing the centralized application state.
 * Single Responsibility: Providing observable state management for the entire application.
 */
export class GlobalState {
  private state: ApplicationState = {
    current_view_identifier: 'home',
    all_subjects: [],
    all_notes: [],
    current_subject: null,
    current_note: null,
    due_reviews: []
  };

  private listeners: StateListener[] = [];

  get_state(): ApplicationState {
    return { ...this.state };
  }

  update_state(partial_state: Partial<ApplicationState>): void {
    this.state = {
      ...this.state,
      ...partial_state
    };
    this.notify_listeners();
  }

  subscribe(listener: StateListener): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify_listeners(): void {
    const current_state = this.get_state();
    this.listeners.forEach(listener => listener(current_state));
  }
}
