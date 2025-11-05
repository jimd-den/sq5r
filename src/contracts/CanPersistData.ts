// ═══════════════════════════════════════════════════════════════
// LAYER 1: Domain Contracts (What the system promises to do)
// ═══════════════════════════════════════════════════════════════

import type { NoteSubject, Note } from '../entities/Note';

/**
 * Contract: Defines the capability to persist and retrieve application data
 * from the underlying storage mechanism without exposing implementation details.
 */
export interface CanPersistData {
  save_note_subject(subject: NoteSubject): Promise<void>;
  retrieve_all_note_subjects(): Promise<NoteSubject[]>;
  retrieve_note_subject_by_id(id: string): Promise<NoteSubject | null>;
  delete_note_subject(id: string): Promise<void>;

  save_note(note: Note): Promise<void>;
  retrieve_note_by_id(id: string): Promise<Note | null>;
  retrieve_notes_for_subject(subject_id: string): Promise<Note[]>;
  retrieve_all_notes(): Promise<Note[]>;
  delete_note(id: string): Promise<void>;
}
