// ═══════════════════════════════════════════════════════════════
// LAYER 5: Content Templates (What users see)
// ═══════════════════════════════════════════════════════════════

import { HelpCircle, Plus, ArrowRight, ArrowLeft, Edit2, Trash2 } from 'lucide-react';
import type { Note, QuestionElement } from '../entities/Note';

interface QuestionViewProps {
  note: Note;
  on_back: () => void;
  on_add_question: () => void;
  on_edit_question: (question: { id: string; text: string }) => void;
  on_delete_question: (question_id: string) => void;
  on_next: () => void;
}

export function QuestionView({ note, on_back, on_add_question, on_edit_question, on_delete_question, on_next }: QuestionViewProps) {
  const can_proceed = note.questions.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-slate-100 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <button
          onClick={on_back}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4 sm:mb-6 transition-colors duration-200"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="text-sm sm:text-base">Back</span>
        </button>

        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-violet-600 text-white text-sm font-bold px-3 py-1 rounded-full">Q</span>
            <span className="text-slate-400 text-sm">Question</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold text-slate-900 mb-2">{note.title}</h1>
          <p className="text-slate-600 text-base sm:text-lg">Transform headings into learning missions</p>
        </div>

        <div className="bg-white border-2 border-slate-200 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-semibold text-slate-900 mb-3">Your Mission</h2>
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed mb-4">
            Convert your survey elements into powerful questions. These questions will guide your reading and focus your attention.
          </p>
          <div className="bg-violet-50 border-2 border-violet-200 rounded-lg p-4 mb-4">
            <h3 className="font-semibold text-violet-900 mb-2 text-sm sm:text-base">Ask Deep Questions</h3>
            <ul className="space-y-2 text-violet-800 text-xs sm:text-sm">
              <li className="flex items-start gap-2">
                <span className="mt-1">✓</span>
                <span><strong>How</strong> does this process work?</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1">✓</span>
                <span><strong>Why</strong> is this concept important?</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1">✓</span>
                <span><strong>What relationship</strong> exists between these ideas?</span>
              </li>
            </ul>
          </div>
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
            <h3 className="font-semibold text-red-900 mb-2 text-sm sm:text-base">Avoid Shallow Questions</h3>
            <ul className="space-y-2 text-red-800 text-xs sm:text-sm">
              <li className="flex items-start gap-2">
                <span className="mt-1">✗</span>
                <span><strong>What</strong> is the definition of...?</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1">✗</span>
                <span>Simple yes/no questions</span>
              </li>
            </ul>
          </div>
        </div>

        {note.survey_elements.length > 0 && (
          <div className="bg-white border-2 border-slate-200 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
            <h2 className="text-base sm:text-lg font-semibold text-slate-900 mb-3">From Your Survey</h2>
            <div className="space-y-2">
              {note.survey_elements.map(element => (
                <div key={element.id} className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs sm:text-sm text-slate-600 capitalize">{element.type}</p>
                  <p className="text-sm sm:text-base text-slate-900 break-words">{element.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-white border-2 border-slate-200 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg sm:text-xl font-semibold text-slate-900">Your Questions</h2>
            <button
              onClick={on_add_question}
              className="flex items-center gap-1.5 sm:gap-2 bg-violet-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-violet-700 active:scale-95 transition-all duration-200 text-sm sm:text-base"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Add Question</span>
              <span className="sm:hidden">Add</span>
            </button>
          </div>

          {note.questions.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <HelpCircle className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 text-slate-400" />
              <p className="text-sm sm:text-base">No questions yet. Create your first learning mission.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {note.questions.map((question, index) => (
                <div key={question.id} className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4 bg-violet-50 border-2 border-violet-200 rounded-lg">
                  <span className="bg-violet-600 text-white text-sm font-bold px-2 py-1 rounded flex-shrink-0">
                    {index + 1}
                  </span>
                  <p className="flex-1 text-sm sm:text-base text-slate-900 break-words min-w-0">{question.text}</p>
                  <div className="flex gap-1 sm:gap-2 flex-shrink-0">
                    <button
                      onClick={() => on_edit_question(question)}
                      className="p-1.5 sm:p-2 text-violet-600 hover:bg-violet-100 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => on_delete_question(question.id)}
                      className="p-1.5 sm:p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={on_next}
          disabled={!can_proceed}
          className={`w-full flex items-center justify-center gap-2 px-6 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg active:scale-95 transition-all duration-200 ${
            can_proceed
              ? 'bg-violet-600 text-white hover:bg-violet-700 hover:shadow-lg'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          Begin Reading Mission
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
