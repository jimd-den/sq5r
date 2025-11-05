// ═══════════════════════════════════════════════════════════════
// LAYER 4: Infrastructure (Technical implementation details)
// ═══════════════════════════════════════════════════════════════

import type { CanPersistData } from '../contracts/CanPersistData';
import type { NoteSubject, Note } from '../entities/Note';

/**
 * Responsible for: Persisting application data to IndexedDB.
 * Single Responsibility: Implementing the persistence interface using IndexedDB as the storage mechanism.
 */
export class IndexedDBPersistenceService implements CanPersistData {
  private db_name = 'sq5r_database';
  private db_version = 1;
  private db: IDBDatabase | null = null;

  constructor() {
    this.initialize_database();
  }

  private async initialize_database(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.db_name, this.db_version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        if (!db.objectStoreNames.contains('note_subjects')) {
          db.createObjectStore('note_subjects', { keyPath: 'id' });
        }

        if (!db.objectStoreNames.contains('notes')) {
          const notes_store = db.createObjectStore('notes', { keyPath: 'id' });
          notes_store.createIndex('subject_id', 'subject_identifier', { unique: false });
          notes_store.createIndex('current_step', 'current_step', { unique: false });
          notes_store.createIndex('next_review_date', 'next_review_date', { unique: false });
        }
      };
    });
  }

  private async ensure_database(): Promise<IDBDatabase> {
    if (this.db) return this.db;

    await this.initialize_database();
    if (!this.db) throw new Error('Failed to initialize database');
    return this.db;
  }

  async save_note_subject(subject: NoteSubject): Promise<void> {
    const db = await this.ensure_database();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['note_subjects'], 'readwrite');
      const store = transaction.objectStore('note_subjects');
      const request = store.put(subject);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async retrieve_all_note_subjects(): Promise<NoteSubject[]> {
    const db = await this.ensure_database();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['note_subjects'], 'readonly');
      const store = transaction.objectStore('note_subjects');
      const request = store.getAll();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result || []);
    });
  }

  async retrieve_note_subject_by_id(id: string): Promise<NoteSubject | null> {
    const db = await this.ensure_database();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['note_subjects'], 'readonly');
      const store = transaction.objectStore('note_subjects');
      const request = store.get(id);

      request.onerror = () => reject(request.error);
      request.onsuccess = async () => {
        const subject = request.result;
        if (!subject) {
          resolve(null);
          return;
        }

        const notes = await this.retrieve_notes_for_subject(id);
        resolve({
          ...subject,
          note_identifiers: notes.map(note => note.id)
        });
      };
    });
  }

  async delete_note_subject(id: string): Promise<void> {
    const db = await this.ensure_database();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['note_subjects', 'notes'], 'readwrite');

      const notes_store = transaction.objectStore('notes');
      const notes_index = notes_store.index('subject_id');
      const notes_request = notes_index.getAll(id);

      notes_request.onsuccess = () => {
        const notes = notes_request.result;
        notes.forEach(note => notes_store.delete(note.id));

        const subjects_store = transaction.objectStore('note_subjects');
        subjects_store.delete(id);
      };

      transaction.onerror = () => reject(transaction.error);
      transaction.oncomplete = () => resolve();
    });
  }

  async save_note(note: Note): Promise<void> {
    const db = await this.ensure_database();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['notes'], 'readwrite');
      const store = transaction.objectStore('notes');
      const request = store.put(note);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async retrieve_note_by_id(id: string): Promise<Note | null> {
    const db = await this.ensure_database();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['notes'], 'readonly');
      const store = transaction.objectStore('notes');
      const request = store.get(id);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result || null);
    });
  }

  async retrieve_notes_for_subject(subject_id: string): Promise<Note[]> {
    const db = await this.ensure_database();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['notes'], 'readonly');
      const store = transaction.objectStore('notes');
      const index = store.index('subject_id');
      const request = index.getAll(subject_id);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result || []);
    });
  }

  async retrieve_all_notes(): Promise<Note[]> {
    const db = await this.ensure_database();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['notes'], 'readonly');
      const store = transaction.objectStore('notes');
      const request = store.getAll();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result || []);
    });
  }

  async delete_note(id: string): Promise<void> {
    const db = await this.ensure_database();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['notes'], 'readwrite');
      const store = transaction.objectStore('notes');
      const request = store.delete(id);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }
}
