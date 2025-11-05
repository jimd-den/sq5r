// ═══════════════════════════════════════════════════════════════
// LAYER 5: Content Templates (What users see)
// ═══════════════════════════════════════════════════════════════

import { Lightbulb, CheckCircle2, ArrowLeft } from 'lucide-react';
import type { Note } from '../entities/Note';

interface ReflectViewProps {
  note: Note;
  on_save_reflection: () => void;
}

export function ReflectView({ note, on_save_reflection }: ReflectViewProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-slate-100 pb-20">
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
            <span className="bg-violet-600 text-white text-sm font-bold px-3 py-1 rounded-full">R5</span>
            <span className="text-slate-400 text-sm">Reflect</span>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">{note.title}</h1>
          <p className="text-slate-600 text-lg">Connect the dots and make it yours</p>
        </div>

        <div className="bg-white border-2 border-slate-200 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-3">Your Final Mission</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Step back and see the bigger picture. Connect this new knowledge to what you already know. Make it meaningful by understanding its importance.
          </p>
          <div className="bg-violet-50 border-2 border-violet-200 rounded-lg p-4">
            <h3 className="font-semibold text-violet-900 mb-2">Reflection Questions</h3>
            <ul className="space-y-2 text-violet-800 text-sm">
              <li className="flex items-start gap-2">
                <span className="mt-1">→</span>
                <span>Why is this material important or relevant?</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1">→</span>
                <span>How does this connect to what I already know?</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1">→</span>
                <span>How might I use this knowledge in the future?</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1">→</span>
                <span>What surprised me or changed my thinking?</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-white border-2 border-slate-200 rounded-lg p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="w-6 h-6 text-violet-600" />
            <h2 className="text-xl font-semibold text-slate-900">Your Reflection</h2>
          </div>
          <textarea
            id="reflection-input"
            className="w-full h-48 p-4 border-2 border-slate-200 rounded-lg focus:border-violet-500 focus:ring-2 focus:ring-violet-200 outline-none resize-none text-slate-900"
            placeholder="Why is this important? How does it connect to what you already know? What surprised you?&#10;&#10;Take your time to think deeply about the significance of what you learned..."
            defaultValue={note.reflection}
          />
        </div>

        <button
          onClick={on_save_reflection}
          className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-all duration-200 hover:shadow-lg font-semibold"
        >
          <CheckCircle2 className="w-5 h-5" />
          Complete Study Session
        </button>
      </div>
    </div>
  );
}
