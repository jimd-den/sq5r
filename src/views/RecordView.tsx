// ═══════════════════════════════════════════════════════════════
// LAYER 5: Content Templates (What users see)
// ═══════════════════════════════════════════════════════════════

import { FileText, Plus, ArrowRight, BookOpen, ArrowLeft } from 'lucide-react';
import type { Note } from '../entities/Note';

interface RecordViewProps {
  note: Note;
  on_answer_mission: (question_id: string) => void;
  on_add_side_note: () => void;
  on_read_next_section: () => void;
  on_finish: () => void;
}

export function RecordView({
  note,
  on_answer_mission,
  on_add_side_note,
  on_read_next_section,
  on_finish
}: RecordViewProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-slate-100 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4 sm:mb-6 transition-colors duration-200"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="text-sm sm:text-base">Back</span>
        </button>
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-amber-600 text-white text-sm font-bold px-3 py-1 rounded-full">R2</span>
            <span className="text-slate-400 text-sm">Record</span>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">{note.title}</h1>
          <p className="text-slate-600 text-lg">Capture your findings while they're fresh</p>
        </div>

        <div className="bg-white border-2 border-slate-200 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-3">Your Mission</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Document your discoveries. Answer each mission question with the insights you gained. Add side notes for anything interesting that didn't fit your original questions.
          </p>
        </div>

        <div className="bg-white border-2 border-slate-200 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Mission List</h2>
          <div className="space-y-4">
            {note.questions.map((question, index) => {
              const has_answer = note.recorded_notes[question.id];
              return (
                <div key={question.id} className={`p-4 rounded-lg border-2 ${
                  has_answer
                    ? 'bg-green-50 border-green-200'
                    : 'bg-white border-amber-200'
                }`}>
                  <div className="flex items-start gap-3 mb-3">
                    <span className="bg-amber-600 text-white text-sm font-bold px-2 py-1 rounded min-w-[2rem] text-center">
                      {index + 1}
                    </span>
                    <p className="flex-1 text-slate-900 font-medium">{question.text}</p>
                  </div>
                  {has_answer ? (
                    <div className="ml-11 p-3 bg-white rounded border border-green-300">
                      <p className="text-slate-700">{has_answer.content}</p>
                      <button
                        onClick={() => on_answer_mission(question.id)}
                        className="text-sm text-amber-600 hover:text-amber-700 mt-2 font-medium"
                      >
                        Edit answer
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => on_answer_mission(question.id)}
                      className="ml-11 w-full py-2 border-2 border-dashed border-amber-300 rounded-lg text-amber-700 hover:bg-amber-50 transition-colors duration-200 font-medium"
                    >
                      Answer this mission
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {Object.keys(note.recorded_notes).filter(id => !note.questions.find(q => q.id === id)).length > 0 && (
          <div className="bg-white border-2 border-slate-200 rounded-lg p-6 mb-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-3">Side Notes</h2>
            <div className="space-y-2">
              {Object.values(note.recorded_notes)
                .filter(noteEl => !note.questions.find(q => q.id === noteEl.question_id))
                .map(noteEl => (
                  <div key={noteEl.id} className="p-3 bg-slate-50 rounded-lg">
                    <p className="text-slate-700">{noteEl.content}</p>
                  </div>
                ))}
            </div>
          </div>
        )}

        <button
          onClick={on_add_side_note}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 mb-4 border-2 border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors duration-200 font-medium"
        >
          <Plus className="w-5 h-5" />
          Add Side Note
        </button>

        <div className="flex gap-4">
          <button
            onClick={on_read_next_section}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-4 border-2 border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-all duration-200 font-semibold"
          >
            <BookOpen className="w-5 h-5" />
            Read Next Section
          </button>
          <button
            onClick={on_finish}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-all duration-200 hover:shadow-lg font-semibold"
          >
            Finish Recording
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
