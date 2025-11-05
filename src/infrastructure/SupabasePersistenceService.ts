// ═══════════════════════════════════════════════════════════════
// LAYER 4: Infrastructure (Technical implementation details)
// ═══════════════════════════════════════════════════════════════

import type { CanPersistData } from '../contracts/CanPersistData';
import type { NoteSubject, Note } from '../entities/Note';
import { supabase_client } from './SupabaseClient';

/**
 * Responsible for: Persisting application data to Supabase.
 * Single Responsibility: Implementing the persistence interface using Supabase as the storage mechanism.
 */
export class SupabasePersistenceService implements CanPersistData {
  async save_note_subject(subject: NoteSubject): Promise<void> {
    const { error } = await supabase_client
      .from('note_subjects')
      .upsert({
        id: subject.id,
        name: subject.name
      });

    if (error) {
      throw new Error(`Failed to save subject: ${error.message}`);
    }
  }

  async retrieve_all_note_subjects(): Promise<NoteSubject[]> {
    const { data, error } = await supabase_client
      .from('note_subjects')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to retrieve subjects: ${error.message}`);
    }

    return (data || []).map(row => ({
      id: row.id,
      name: row.name,
      note_identifiers: []
    }));
  }

  async retrieve_note_subject_by_id(id: string): Promise<NoteSubject | null> {
    const { data, error } = await supabase_client
      .from('note_subjects')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      throw new Error(`Failed to retrieve subject: ${error.message}`);
    }

    if (!data) {
      return null;
    }

    const notes = await this.retrieve_notes_for_subject(id);
    const note_identifiers = notes.map(note => note.id);

    return {
      id: data.id,
      name: data.name,
      note_identifiers
    };
  }

  async delete_note_subject(id: string): Promise<void> {
    const { error } = await supabase_client
      .from('note_subjects')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete subject: ${error.message}`);
    }
  }

  async save_note(note: Note): Promise<void> {
    const { error } = await supabase_client
      .from('notes')
      .upsert({
        id: note.id,
        subject_id: note.subject_identifier,
        title: note.title,
        current_step: note.current_step,
        survey_elements: note.survey_elements,
        questions: note.questions,
        recorded_notes: note.recorded_notes,
        recited_notes: note.recited_notes,
        review_corrections: note.review_corrections,
        reflection: note.reflection,
        srs_level: note.srs_level,
        next_review_date: note.next_review_date,
        rating: note.rating
      });

    if (error) {
      throw new Error(`Failed to save note: ${error.message}`);
    }
  }

  async retrieve_note_by_id(id: string): Promise<Note | null> {
    const { data, error } = await supabase_client
      .from('notes')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      throw new Error(`Failed to retrieve note: ${error.message}`);
    }

    if (!data) {
      return null;
    }

    return this.map_database_row_to_note(data);
  }

  async retrieve_notes_for_subject(subject_id: string): Promise<Note[]> {
    const { data, error } = await supabase_client
      .from('notes')
      .select('*')
      .eq('subject_id', subject_id)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to retrieve notes: ${error.message}`);
    }

    return (data || []).map(row => this.map_database_row_to_note(row));
  }

  async retrieve_all_notes(): Promise<Note[]> {
    const { data, error } = await supabase_client
      .from('notes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to retrieve all notes: ${error.message}`);
    }

    return (data || []).map(row => this.map_database_row_to_note(row));
  }

  async delete_note(id: string): Promise<void> {
    const { error } = await supabase_client
      .from('notes')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete note: ${error.message}`);
    }
  }

  private map_database_row_to_note(row: any): Note {
    return {
      id: row.id,
      subject_identifier: row.subject_id,
      title: row.title,
      current_step: row.current_step,
      survey_elements: row.survey_elements || [],
      questions: row.questions || [],
      recorded_notes: row.recorded_notes || {},
      recited_notes: row.recited_notes || {},
      review_corrections: row.review_corrections || {},
      reflection: row.reflection || '',
      srs_level: row.srs_level || 0,
      next_review_date: row.next_review_date || 0,
      rating: row.rating || 0
    };
  }
}
