// ═══════════════════════════════════════════════════════════════
// LAYER 5: Content Templates (What users see)
// ═══════════════════════════════════════════════════════════════

import { MessageSquare, ArrowRight, ArrowLeft } from 'lucide-react';
import type { Note } from '../entities/Note';

interface ReciteViewProps {
  note: Note;
  on_recite_answer: (question_id: string) => void;
  on_next: () => void;
}

export function ReciteView({ note, on_recite_answer, on_next }: ReciteViewProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-slate-100 pb-20">
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
            <span className="bg-indigo-600 text-white text-sm font-bold px-3 py-1 rounded-full">R3</span>
            <span className="text-slate-400 text-sm">Recite</span>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">{note.title}</h1>
          <p className="text-slate-600 text-lg">Test your recall without looking</p>
        </div>

        <div className="bg-white border-2 border-slate-200 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-3">Your Mission</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Answer each question from memory without referring to your recorded notes. This active recall is where the real learning happens.
          </p>
          <div className="bg-indigo-50 border-2 border-indigo-200 rounded-lg p-4">
            <h3 className="font-semibold text-indigo-900 mb-2">Critical Rule</h3>
            <p className="text-indigo-800 text-sm">
              Your recorded notes are hidden. Rely only on your memory. It's okay if you can't remember everything—that's valuable feedback.
            </p>
          </div>
        </div>

        <div className="bg-white border-2 border-slate-200 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Recall Each Mission</h2>
          <div className="space-y-4">
            {note.questions.map((question, index) => {
              const has_recited = note.recited_notes[question.id];
              return (
                <div key={question.id} className={`p-4 rounded-lg border-2 ${
                  has_recited
                    ? 'bg-green-50 border-green-200'
                    : 'bg-white border-indigo-200'
                }`}>
                  <div className="flex items-start gap-3 mb-3">
                    <span className="bg-indigo-600 text-white text-sm font-bold px-2 py-1 rounded min-w-[2rem] text-center">
                      {index + 1}
                    </span>
                    <p className="flex-1 text-slate-900 font-medium">{question.text}</p>
                  </div>
                  {has_recited ? (
                    <div className="ml-11 p-3 bg-white rounded border border-green-300">
                      <p className="text-slate-700">{has_recited.content}</p>
                      <button
                        onClick={() => on_recite_answer(question.id)}
                        className="text-sm text-indigo-600 hover:text-indigo-700 mt-2 font-medium"
                      >
                        Edit answer
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => on_recite_answer(question.id)}
                      className="ml-11 w-full py-2 border-2 border-dashed border-indigo-300 rounded-lg text-indigo-700 hover:bg-indigo-50 transition-colors duration-200 font-medium"
                    >
                      Recite from memory
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <button
          onClick={on_next}
          className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200 hover:shadow-lg font-semibold"
        >
          Continue to Review
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
