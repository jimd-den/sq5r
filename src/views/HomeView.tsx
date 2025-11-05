// ═══════════════════════════════════════════════════════════════
// LAYER 5: Content Templates (What users see)
// ═══════════════════════════════════════════════════════════════

import { BookOpen, Plus, Calendar, Trash2 } from 'lucide-react';
import type { NoteSubject, Note } from '../entities/Note';

interface HomeViewProps {
  subjects: NoteSubject[];
  all_notes: Note[];
  due_reviews: Note[];
  on_create_subject: () => void;
  on_select_subject: (subject: NoteSubject) => void;
  on_delete_subject: (subject_id: string) => void;
  on_select_review: (note: Note) => void;
}

export function HomeView({
  subjects,
  all_notes,
  due_reviews,
  on_create_subject,
  on_select_subject,
  on_delete_subject,
  on_select_review
}: HomeViewProps) {
  const get_note_count_for_subject = (subject_id: string): number => {
    return all_notes.filter(note => note.subject_identifier === subject_id).length;
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <header className="mb-8 sm:mb-12">
          <div className="flex items-center gap-2 sm:gap-3 mb-2">
            <BookOpen className="w-8 h-8 sm:w-10 sm:h-10 text-slate-700" />
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">sq5r</h1>
          </div>
          <p className="text-slate-600 text-base sm:text-lg">Transform passive reading into active learning</p>
        </header>

        {due_reviews.length > 0 && (
          <section className="mb-8 sm:mb-12">
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <Calendar className="w-5 h-5 text-amber-600" />
              <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">Reviews Due</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {due_reviews.map(note => (
                <button
                  key={note.id}
                  onClick={() => on_select_review(note)}
                  className="bg-gradient-to-br from-amber-50 to-amber-100 border-2 border-amber-200 rounded-lg p-4 sm:p-6 text-left hover:shadow-lg active:scale-95 sm:hover:scale-105 transition-all duration-200"
                >
                  <h3 className="font-semibold text-slate-900 mb-1 sm:mb-2">{note.title}</h3>
                  <p className="text-sm text-slate-600">Level {note.srs_level + 1}</p>
                </button>
              ))}
            </div>
          </section>
        )}

        <section>
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">Subjects</h2>
            <button
              onClick={on_create_subject}
              className="flex items-center gap-1.5 sm:gap-2 bg-slate-700 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-slate-800 active:scale-95 transition-all duration-200 text-sm sm:text-base"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">New Subject</span>
              <span className="sm:hidden">New</span>
            </button>
          </div>

          {subjects.length === 0 ? (
            <div className="bg-white border-2 border-dashed border-slate-300 rounded-lg p-8 sm:p-12 text-center">
              <BookOpen className="w-12 h-12 sm:w-16 sm:h-16 text-slate-400 mx-auto mb-3 sm:mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold text-slate-700 mb-2">No subjects yet</h3>
              <p className="text-sm sm:text-base text-slate-500 mb-4 sm:mb-6">Create your first subject to start learning</p>
              <button
                onClick={on_create_subject}
                className="bg-slate-700 text-white px-6 py-3 rounded-lg hover:bg-slate-800 active:scale-95 transition-all duration-200"
              >
                Create Subject
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {subjects.map(subject => (
                <div
                  key={subject.id}
                  className="bg-white border-2 border-slate-200 rounded-lg p-4 sm:p-6 hover:border-slate-400 hover:shadow-lg transition-all duration-200 relative group"
                >
                  <button
                    onClick={() => on_select_subject(subject)}
                    className="text-left w-full"
                  >
                    <h3 className="font-semibold text-slate-900 mb-1 sm:mb-2 pr-8">{subject.name}</h3>
                    <p className="text-sm text-slate-600">
                      {get_note_count_for_subject(subject.id)} {get_note_count_for_subject(subject.id) === 1 ? 'note' : 'notes'}
                    </p>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      on_delete_subject(subject.id);
                    }}
                    className="absolute top-3 right-3 p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
