// ═══════════════════════════════════════════════════════════════
// LAYER 5: Content Templates (What users see)
// ═══════════════════════════════════════════════════════════════

import { Play, ArrowRight, CheckCircle2, ArrowLeft, SkipForward } from 'lucide-react';
import type { Note } from '../entities/Note';

interface ReadViewProps {
  note: Note;
  timer_started: boolean;
  timer_complete: boolean;
  remaining_time: number;
  on_back: () => void;
  on_start_timer: () => void;
  on_skip_timer: () => void;
  on_next: () => void;
}

export function ReadView({
  note,
  timer_started,
  timer_complete,
  remaining_time,
  on_back,
  on_start_timer,
  on_skip_timer,
  on_next
}: ReadViewProps) {
  const format_time = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-slate-100 pb-20">
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
            <span className="bg-green-600 text-white text-sm font-bold px-3 py-1 rounded-full">R1</span>
            <span className="text-slate-400 text-sm">Read</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold text-slate-900 mb-2">{note.title}</h1>
          <p className="text-slate-600 text-base sm:text-lg">Read with purpose, guided by your questions</p>
        </div>

        <div className="bg-white border-2 border-slate-200 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-semibold text-slate-900 mb-3">Your Mission</h2>
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed mb-4">
            Read through your material actively, hunting for answers to your questions. This focused timer helps you maintain deep concentration.
          </p>
          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
            <h3 className="font-semibold text-green-900 mb-2">During This Session</h3>
            <ul className="space-y-2 text-green-800 text-sm">
              <li className="flex items-start gap-2">
                <span className="mt-1">→</span>
                <span>Read with your questions as your guide</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1">→</span>
                <span>Look for answers, connections, and insights</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1">→</span>
                <span>Stay focused until the timer completes</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-white border-2 border-slate-200 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-semibold text-slate-900 mb-4">Mission List</h2>
          <div className="space-y-2">
            {note.questions.map((question, index) => (
              <div key={question.id} className="flex items-start gap-2 sm:gap-3 p-3 bg-slate-50 rounded-lg">
                <span className="bg-green-600 text-white text-sm font-bold px-2 py-1 rounded min-w-[2rem] text-center">
                  {index + 1}
                </span>
                <p className="flex-1 text-sm sm:text-base text-slate-900 break-words">{question.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border-2 border-slate-200 rounded-lg p-6 sm:p-8 mb-4 sm:mb-6 text-center">
          {!timer_started ? (
            <>
              <div className="text-4xl sm:text-6xl font-bold text-slate-900 mb-4">25:00</div>
              <p className="text-sm sm:text-base text-slate-600 mb-6">Ready to begin your focused reading session</p>
              <button
                onClick={on_start_timer}
                className="inline-flex items-center gap-2 bg-green-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg hover:bg-green-700 active:scale-95 transition-all duration-200 hover:shadow-lg font-semibold"
              >
                <Play className="w-5 h-5 sm:w-6 sm:h-6" />
                Start Timer
              </button>
            </>
          ) : timer_complete ? (
            <>
              <CheckCircle2 className="w-12 h-12 sm:w-16 sm:h-16 text-green-600 mx-auto mb-4" />
              <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-4">Session Complete</div>
              <p className="text-sm sm:text-base text-slate-700 mb-6">Great work! You've completed your focused reading session.</p>
            </>
          ) : (
            <>
              <div className="text-4xl sm:text-6xl font-bold text-green-600 mb-4">{format_time(remaining_time)}</div>
              <p className="text-sm sm:text-base text-slate-600 mb-4">Reading in progress...</p>
              <button
                onClick={on_skip_timer}
                className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 font-medium text-sm"
              >
                <SkipForward className="w-4 h-4" />
                Skip timer
              </button>
            </>
          )}
        </div>

        <button
          onClick={on_next}
          disabled={!timer_complete}
          className={`w-full flex items-center justify-center gap-2 px-6 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg active:scale-95 transition-all duration-200 ${
            timer_complete
              ? 'bg-green-600 text-white hover:bg-green-700 hover:shadow-lg'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          Continue to Record
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
