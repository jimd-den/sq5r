// ═══════════════════════════════════════════════════════════════
// LAYER 5: Content Templates (What users see)
// ═══════════════════════════════════════════════════════════════

import { Heading1, Tag, Image, Plus, ArrowRight, Edit2, Trash2, ArrowLeft } from 'lucide-react';
import type { Note, SurveyElement } from '../entities/Note';

interface SurveyViewProps {
  note: Note;
  on_back: () => void;
  on_add_element: (type: SurveyElement['type']) => void;
  on_edit_element: (element: SurveyElement) => void;
  on_delete_element: (element_id: string) => void;
  on_next: () => void;
}

export function SurveyView({ note, on_back, on_add_element, on_edit_element, on_delete_element, on_next }: SurveyViewProps) {
  const can_proceed = note.survey_elements.length > 0;

  const get_icon_for_type = (type: SurveyElement['type']) => {
    switch (type) {
      case 'heading':
        return <Heading1 className="w-5 h-5" />;
      case 'keyword':
        return <Tag className="w-5 h-5" />;
      case 'diagram':
        return <Image className="w-5 h-5" />;
      default:
        return <Plus className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 pb-20">
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
            <span className="bg-blue-600 text-white text-sm font-bold px-3 py-1 rounded-full">S</span>
            <span className="text-slate-400 text-sm">Survey</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold text-slate-900 mb-2">{note.title}</h1>
          <p className="text-slate-600 text-base sm:text-lg">Map the terrain before diving deep</p>
        </div>

        <div className="bg-white border-2 border-slate-200 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-semibold text-slate-900 mb-3">Your Mission</h2>
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed mb-4">
            Scan through your material quickly. Capture the structure and key landmarks without getting caught in the details.
          </p>
          <ul className="space-y-2 text-sm sm:text-base text-slate-600">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">→</span>
              <span>Note chapter titles, section headings, and subheadings</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">→</span>
              <span>Identify bold terms, italicized concepts, and key vocabulary</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">→</span>
              <span>Spot diagrams, charts, graphs, and visual aids</span>
            </li>
          </ul>
        </div>

        <div className="bg-white border-2 border-slate-200 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-semibold text-slate-900 mb-4">Capture Elements</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 mb-6">
            <button
              onClick={() => on_add_element('heading')}
              className="flex flex-col items-center gap-2 p-3 sm:p-4 border-2 border-slate-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 active:scale-95 transition-all duration-200"
            >
              <Heading1 className="w-6 h-6 sm:w-8 sm:h-8 text-slate-700" />
              <span className="text-xs sm:text-sm font-medium text-slate-900">Heading</span>
            </button>
            <button
              onClick={() => on_add_element('keyword')}
              className="flex flex-col items-center gap-2 p-3 sm:p-4 border-2 border-slate-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 active:scale-95 transition-all duration-200"
            >
              <Tag className="w-6 h-6 sm:w-8 sm:h-8 text-slate-700" />
              <span className="text-xs sm:text-sm font-medium text-slate-900">Keyword</span>
            </button>
            <button
              onClick={() => on_add_element('diagram')}
              className="flex flex-col items-center gap-2 p-3 sm:p-4 border-2 border-slate-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 active:scale-95 transition-all duration-200"
            >
              <Image className="w-6 h-6 sm:w-8 sm:h-8 text-slate-700" />
              <span className="text-xs sm:text-sm font-medium text-slate-900">Diagram</span>
            </button>
            <button
              onClick={() => on_add_element('other')}
              className="flex flex-col items-center gap-2 p-3 sm:p-4 border-2 border-slate-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 active:scale-95 transition-all duration-200"
            >
              <Plus className="w-6 h-6 sm:w-8 sm:h-8 text-slate-700" />
              <span className="text-xs sm:text-sm font-medium text-slate-900">Other</span>
            </button>
          </div>

          {note.survey_elements.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold text-slate-700 text-xs sm:text-sm uppercase tracking-wide">Captured</h3>
              {note.survey_elements.map(element => (
                <div key={element.id} className="flex items-start gap-2 sm:gap-3 p-3 bg-slate-50 rounded-lg">
                  {get_icon_for_type(element.type)}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-slate-900 capitalize">{element.type}</p>
                    <p className="text-sm sm:text-base text-slate-700 break-words">{element.content}</p>
                  </div>
                  <div className="flex gap-1 sm:gap-2 flex-shrink-0">
                    <button
                      onClick={() => on_edit_element(element)}
                      className="p-1.5 sm:p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => on_delete_element(element.id)}
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
              ? 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          Continue to Questions
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
