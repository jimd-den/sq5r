// ═══════════════════════════════════════════════════════════════
// LAYER 5: Content Templates (What users see)
// ═══════════════════════════════════════════════════════════════

import { ArrowRight, Frown, Meh, Smile, ArrowLeft } from 'lucide-react';
import type { Note } from '../entities/Note';

interface ReviewViewProps {
  note: Note;
  selected_rating: number;
  on_add_correction: (question_id: string) => void;
  on_select_rating: (rating: number) => void;
  on_next: () => void;
}

export function ReviewView({
  note,
  selected_rating,
  on_add_correction,
  on_select_rating,
  on_next
}: ReviewViewProps) {
  const can_proceed = selected_rating > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-slate-100 pb-20">
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
            <span className="bg-rose-600 text-white text-sm font-bold px-3 py-1 rounded-full">R4</span>
            <span className="text-slate-400 text-sm">Review</span>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">{note.title}</h1>
          <p className="text-slate-600 text-lg">The big reveal: compare and correct</p>
        </div>

        <div className="bg-white border-2 border-slate-200 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-3">Your Mission</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Compare your recited answers with what you recorded. Identify gaps, errors, and insights. This is where you discover what you truly learned.
          </p>
        </div>

        <div className="space-y-6 mb-6">
          {note.questions.map((question, index) => {
            const recorded = note.recorded_notes[question.id];
            const recited = note.recited_notes[question.id];
            const correction = note.review_corrections[question.id];

            return (
              <div key={question.id} className="bg-white border-2 border-slate-200 rounded-lg p-6">
                <div className="flex items-start gap-3 mb-4">
                  <span className="bg-rose-600 text-white text-sm font-bold px-2 py-1 rounded min-w-[2rem] text-center">
                    {index + 1}
                  </span>
                  <p className="flex-1 text-slate-900 font-semibold text-lg">{question.text}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-2">
                      What You Recorded
                    </h3>
                    <div className="p-4 bg-amber-50 border-2 border-amber-200 rounded-lg">
                      <p className="text-slate-900">{recorded?.content || 'No answer recorded'}</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-2">
                      What You Recalled
                    </h3>
                    <div className="p-4 bg-indigo-50 border-2 border-indigo-200 rounded-lg">
                      <p className="text-slate-900">{recited?.content || 'No answer recited'}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-2">
                    Corrections & Gaps
                  </h3>
                  {correction ? (
                    <div className="p-4 bg-rose-50 border-2 border-rose-200 rounded-lg">
                      <p className="text-slate-900 mb-2">{correction.content}</p>
                      <button
                        onClick={() => on_add_correction(question.id)}
                        className="text-sm text-rose-600 hover:text-rose-700 font-medium"
                      >
                        Edit correction
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => on_add_correction(question.id)}
                      className="w-full py-2 border-2 border-dashed border-rose-300 rounded-lg text-rose-700 hover:bg-rose-50 transition-colors duration-200 font-medium"
                    >
                      Add correction or note gaps
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-white border-2 border-slate-200 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">How difficult was this material?</h2>
          <div className="grid grid-cols-3 gap-4">
            <button
              onClick={() => on_select_rating(1)}
              className={`p-6 rounded-lg border-2 transition-all duration-200 ${
                selected_rating === 1
                  ? 'bg-red-100 border-red-500 shadow-lg scale-105'
                  : 'bg-white border-slate-200 hover:border-red-300 hover:bg-red-50'
              }`}
            >
              <Frown className={`w-12 h-12 mx-auto mb-2 ${
                selected_rating === 1 ? 'text-red-600' : 'text-slate-400'
              }`} />
              <p className="font-semibold text-slate-900">Hard</p>
              <p className="text-sm text-slate-600">Many gaps</p>
            </button>
            <button
              onClick={() => on_select_rating(2)}
              className={`p-6 rounded-lg border-2 transition-all duration-200 ${
                selected_rating === 2
                  ? 'bg-amber-100 border-amber-500 shadow-lg scale-105'
                  : 'bg-white border-slate-200 hover:border-amber-300 hover:bg-amber-50'
              }`}
            >
              <Meh className={`w-12 h-12 mx-auto mb-2 ${
                selected_rating === 2 ? 'text-amber-600' : 'text-slate-400'
              }`} />
              <p className="font-semibold text-slate-900">Medium</p>
              <p className="text-sm text-slate-600">Some gaps</p>
            </button>
            <button
              onClick={() => on_select_rating(3)}
              className={`p-6 rounded-lg border-2 transition-all duration-200 ${
                selected_rating === 3
                  ? 'bg-green-100 border-green-500 shadow-lg scale-105'
                  : 'bg-white border-slate-200 hover:border-green-300 hover:bg-green-50'
              }`}
            >
              <Smile className={`w-12 h-12 mx-auto mb-2 ${
                selected_rating === 3 ? 'text-green-600' : 'text-slate-400'
              }`} />
              <p className="font-semibold text-slate-900">Easy</p>
              <p className="text-sm text-slate-600">Recalled well</p>
            </button>
          </div>
        </div>

        <button
          onClick={on_next}
          disabled={!can_proceed}
          className={`w-full flex items-center justify-center gap-2 px-6 py-4 rounded-lg font-semibold transition-all duration-200 ${
            can_proceed
              ? 'bg-rose-600 text-white hover:bg-rose-700 hover:shadow-lg'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          Continue to Reflect
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
