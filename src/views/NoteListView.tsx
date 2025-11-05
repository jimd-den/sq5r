// ═══════════════════════════════════════════════════════════════
// LAYER 5: Content Templates (What users see)
// ═══════════════════════════════════════════════════════════════

import { ArrowLeft, Plus, FileText, Trash2 } from 'lucide-react';
import type { NoteSubject, Note } from '../entities/Note';

interface NoteListViewProps {
  subject: NoteSubject;
  notes: Note[];
  on_back: () => void;
  on_create_note: () => void;
  on_select_note: (note: Note) => void;
  on_delete_note: (note_id: string) => void;
}

export function NoteListView({
  subject,
  notes,
  on_back,
  on_create_note,
  on_select_note,
  on_delete_note
}: NoteListViewProps) {
  const get_step_label = (step: string): string => {
    const labels: Record<string, string> = {
      'SURVEY': 'Survey',
      'QUESTION': 'Question',
      'READ': 'Read',
      'RECORD': 'Record',
      'RECITE': 'Recite',
      'REVIEW': 'Review',
      'REFLECT': 'Reflect',
      'COMPLETED': 'Completed'
    };
    return labels[step] || step;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <button
          onClick={on_back}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6 transition-colors duration-200"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </button>

        <header className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">{subject.name}</h1>
          <div className="flex items-center justify-between">
            <p className="text-slate-600">
              {notes.length} {notes.length === 1 ? 'note' : 'notes'}
            </p>
            <button
              onClick={on_create_note}
              className="flex items-center gap-2 bg-slate-700 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors duration-200"
            >
              <Plus className="w-5 h-5" />
              New Note
            </button>
          </div>
        </header>

        {notes.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-slate-300 rounded-lg p-12 text-center">
            <FileText className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-700 mb-2">No notes yet</h3>
            <p className="text-slate-500 mb-6">Create your first note to start the SQ5R process</p>
            <button
              onClick={on_create_note}
              className="bg-slate-700 text-white px-6 py-3 rounded-lg hover:bg-slate-800 transition-colors duration-200"
            >
              Create Note
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {notes.map(note => (
              <div
                key={note.id}
                className="bg-white border-2 border-slate-200 rounded-lg p-6 hover:border-slate-400 hover:shadow-lg transition-all duration-200 relative group"
              >
                <button
                  onClick={() => on_select_note(note)}
                  className="text-left w-full"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-slate-900 flex-1 pr-8">{note.title}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      note.current_step === 'COMPLETED'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {get_step_label(note.current_step)}
                    </span>
                  </div>
                  {note.current_step === 'COMPLETED' && (
                    <p className="text-sm text-slate-600">Review Level {note.srs_level + 1}</p>
                  )}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    on_delete_note(note.id);
                  }}
                  className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
