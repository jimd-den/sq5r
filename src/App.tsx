import { useState, useEffect } from 'react';
import { Download } from 'lucide-react';
import { GlobalState } from './services/GlobalState';
import { NoteWorkflowService } from './services/NoteWorkflowService';
import { SpacedRepetitionService } from './services/SpacedRepetitionService';
import { TimerService } from './services/TimerService';
import { AudioFeedbackService } from './services/AudioFeedbackService';
import { IndexedDBPersistenceService } from './infrastructure/IndexedDBPersistenceService';
import { TextInputModal, ConfirmModal } from './views/Modal';

import { HomeView } from './views/HomeView';
import { NoteListView } from './views/NoteListView';
import { SurveyView } from './views/SurveyView';
import { QuestionView } from './views/QuestionView';
import { ReadView } from './views/ReadView';
import { RecordView } from './views/RecordView';
import { ReciteView } from './views/ReciteView';
import { ReviewView } from './views/ReviewView';
import { ReflectView } from './views/ReflectView';

import type { ApplicationState, ViewIdentifier } from './services/GlobalState';
import type { NoteSubject, Note, SurveyElement } from './entities/Note';

const global_state = new GlobalState();
const note_workflow_service = new NoteWorkflowService();
const spaced_repetition_service = new SpacedRepetitionService();
const timer_service = new TimerService();
const audio_feedback_service = new AudioFeedbackService();
const persistence_service = new IndexedDBPersistenceService();

type ModalType =
  | { type: 'none' }
  | { type: 'create_subject' }
  | { type: 'create_note' }
  | { type: 'add_survey_element'; element_type: SurveyElement['type'] }
  | { type: 'edit_survey_element'; element: SurveyElement }
  | { type: 'add_question' }
  | { type: 'edit_question'; question: { id: string; text: string } }
  | { type: 'answer_mission'; question_id: string }
  | { type: 'add_side_note' }
  | { type: 'recite_answer'; question_id: string }
  | { type: 'add_correction'; question_id: string }
  | { type: 'skip_timer_warning' }
  | { type: 'delete_survey_element'; element_id: string }
  | { type: 'delete_question'; question_id: string }
  | { type: 'delete_subject'; subject_id: string }
  | { type: 'delete_note'; note_id: string };

function App() {
  const [state, setState] = useState<ApplicationState>(global_state.get_state());
  const [timer_started, setTimerStarted] = useState(false);
  const [timer_complete, setTimerComplete] = useState(false);
  const [remaining_time, setRemainingTime] = useState(1500);
  const [selected_rating, setSelectedRating] = useState(0);
  const [modal, setModal] = useState<ModalType>({ type: 'none' });

  useEffect(() => {
    const unsubscribe = global_state.subscribe((new_state) => {
      setState(new_state);
    });

    load_initial_data();

    return unsubscribe;
  }, []);

  const load_initial_data = async () => {
    try {
      const subjects = await persistence_service.retrieve_all_note_subjects();
      const notes = await persistence_service.retrieve_all_notes();
      const due_reviews = spaced_repetition_service.find_notes_due_for_review(notes);

      global_state.update_state({
        all_subjects: subjects,
        all_notes: notes,
        due_reviews
      });
    } catch (error) {
      console.error('✗ Failed to load data:', error);
    }
  };

  const navigate_to_home = () => {
    global_state.update_state({
      current_view_identifier: 'home',
      current_subject: null,
      current_note: null
    });
  };

  const navigate_to_note_list = () => {
    global_state.update_state({
      current_view_identifier: 'note_list',
      current_note: null
    });
  };

  const go_back_to_survey = () => {
    if (!state.current_note) return;
    const updated_note = { ...state.current_note, current_step: 'SURVEY' as const };
    persistence_service.save_note(updated_note)
      .then(() => {
        global_state.update_state({
          current_view_identifier: 'survey',
          current_note: updated_note
        });
      });
  };

  const go_back_to_question = () => {
    if (!state.current_note) return;
    const updated_note = { ...state.current_note, current_step: 'QUESTION' as const };
    persistence_service.save_note(updated_note)
      .then(() => {
        setTimerStarted(false);
        setTimerComplete(false);
        setRemainingTime(1500);
        timer_service.reset_timer();
        global_state.update_state({
          current_view_identifier: 'question',
          current_note: updated_note
        });
      });
  };

  const go_back_to_read = () => {
    if (!state.current_note) return;
    const updated_note = { ...state.current_note, current_step: 'READ' as const };
    persistence_service.save_note(updated_note)
      .then(() => {
        global_state.update_state({
          current_view_identifier: 'read',
          current_note: updated_note
        });
      });
  };

  const go_back_to_record = () => {
    if (!state.current_note) return;
    const updated_note = { ...state.current_note, current_step: 'RECORD' as const };
    persistence_service.save_note(updated_note)
      .then(() => {
        global_state.update_state({
          current_view_identifier: 'record',
          current_note: updated_note
        });
      });
  };

  const go_back_to_recite = () => {
    if (!state.current_note) return;
    const updated_note = { ...state.current_note, current_step: 'RECITE' as const };
    persistence_service.save_note(updated_note)
      .then(() => {
        global_state.update_state({
          current_view_identifier: 'recite',
          current_note: updated_note
        });
      });
  };

  const go_back_to_review = () => {
    if (!state.current_note) return;
    const updated_note = { ...state.current_note, current_step: 'REVIEW' as const };
    persistence_service.save_note(updated_note)
      .then(() => {
        global_state.update_state({
          current_view_identifier: 'review',
          current_note: updated_note
        });
      });
  };

  const export_note_as_markdown = (note: Note) => {
    const subject = state.all_subjects.find(s => s.id === note.subject_identifier);
    let markdown = `# ${note.title}\n\n`;
    markdown += `**Subject:** ${subject?.name || 'Unknown'}\n\n`;
    markdown += `**Status:** ${note.current_step}\n\n`;

    if (note.survey_elements.length > 0) {
      markdown += `## Survey Elements\n\n`;
      note.survey_elements.forEach(el => {
        markdown += `- **${el.type}:** ${el.content}\n`;
      });
      markdown += `\n`;
    }

    if (note.questions.length > 0) {
      markdown += `## Questions & Answers\n\n`;
      note.questions.forEach((q, idx) => {
        markdown += `### ${idx + 1}. ${q.text}\n\n`;
        const recorded = note.recorded_notes[q.id];
        const recited = note.recited_notes[q.id];
        const correction = note.review_corrections[q.id];

        if (recorded) {
          markdown += `**Recorded Answer:**\n${recorded.content}\n\n`;
        }
        if (recited) {
          markdown += `**Recited Answer:**\n${recited.content}\n\n`;
        }
        if (correction) {
          markdown += `**Corrections:**\n${correction.content}\n\n`;
        }
      });
    }

    if (note.reflection) {
      markdown += `## Reflection\n\n${note.reflection}\n\n`;
    }

    markdown += `---\n\n`;
    markdown += `**Review Level:** ${note.srs_level + 1}\n`;
    markdown += `**Difficulty Rating:** ${note.rating === 1 ? 'Hard' : note.rating === 2 ? 'Medium' : note.rating === 3 ? 'Easy' : 'Not rated'}\n`;

    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${note.title.replace(/[^a-z0-9]/gi, '_')}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    audio_feedback_service.play_success_sound();
  };

  const handle_create_subject = (name: string) => {
    audio_feedback_service.play_primary_action_sound();

    const new_subject: NoteSubject = {
      id: crypto.randomUUID(),
      name,
      note_identifiers: []
    };

    persistence_service.save_note_subject(new_subject)
      .then(() => {
        console.log('✓ Subject created successfully');
        return load_initial_data();
      })
      .catch(error => console.error('✗ Failed to create subject:', error));
  };

  const handle_delete_subject = (subject_id: string) => {
    persistence_service.delete_note_subject(subject_id)
      .then(() => {
        console.log('✓ Subject and all associated notes deleted');
        return load_initial_data();
      })
      .catch(error => console.error('✗ Failed to delete subject:', error));
  };

  const handle_delete_note = (note_id: string) => {
    persistence_service.delete_note(note_id)
      .then(() => {
        console.log('✓ Note deleted');
        return load_initial_data();
      })
      .catch(error => console.error('✗ Failed to delete note:', error));
  };

  const handle_select_subject = async (subject: NoteSubject) => {
    audio_feedback_service.play_primary_action_sound();

    const subject_with_notes = await persistence_service.retrieve_note_subject_by_id(subject.id);

    global_state.update_state({
      current_view_identifier: 'note_list',
      current_subject: subject_with_notes
    });
  };

  const handle_create_note = (title: string) => {
    if (!state.current_subject) return;

    audio_feedback_service.play_primary_action_sound();

    const new_note = note_workflow_service.create_new_note(state.current_subject.id, title);

    persistence_service.save_note(new_note)
      .then(() => {
        console.log('✓ Note created successfully');
        global_state.update_state({
          current_view_identifier: 'survey',
          current_note: new_note
        });
        return load_initial_data();
      })
      .catch(error => console.error('✗ Failed to create note:', error));
  };

  const handle_select_note = (note: Note) => {
    audio_feedback_service.play_primary_action_sound();

    const view_map: Record<string, ViewIdentifier> = {
      'SURVEY': 'survey',
      'QUESTION': 'question',
      'READ': 'read',
      'RECORD': 'record',
      'RECITE': 'recite',
      'REVIEW': 'review',
      'REFLECT': 'reflect',
      'COMPLETED': 'review'
    };

    global_state.update_state({
      current_view_identifier: view_map[note.current_step] || 'note_list',
      current_note: note
    });

    if (note.current_step === 'COMPLETED') {
      setSelectedRating(note.rating);
    }
  };

  const handle_add_survey_element = (type: SurveyElement['type'], content: string) => {
    if (!state.current_note) return;

    audio_feedback_service.play_secondary_action_sound();

    const element: SurveyElement = {
      id: crypto.randomUUID(),
      type,
      content
    };

    const updated_note = note_workflow_service.add_survey_element(state.current_note, element);

    persistence_service.save_note(updated_note)
      .then(() => {
        global_state.update_state({ current_note: updated_note });
      })
      .catch(error => console.error('✗ Failed to save element:', error));
  };

  const handle_edit_survey_element = (element: SurveyElement, new_content: string) => {
    if (!state.current_note) return;

    audio_feedback_service.play_secondary_action_sound();

    const updated_elements = state.current_note.survey_elements.map(el =>
      el.id === element.id ? { ...el, content: new_content } : el
    );

    const updated_note = { ...state.current_note, survey_elements: updated_elements };

    persistence_service.save_note(updated_note)
      .then(() => {
        global_state.update_state({ current_note: updated_note });
      })
      .catch(error => console.error('✗ Failed to update element:', error));
  };

  const handle_delete_survey_element = (element_id: string) => {
    if (!state.current_note) return;

    audio_feedback_service.play_secondary_action_sound();

    const updated_elements = state.current_note.survey_elements.filter(el => el.id !== element_id);
    const updated_note = { ...state.current_note, survey_elements: updated_elements };

    persistence_service.save_note(updated_note)
      .then(() => {
        global_state.update_state({ current_note: updated_note });
      })
      .catch(error => console.error('✗ Failed to delete element:', error));
  };

  const handle_survey_next = () => {
    if (!state.current_note) return;
    audio_feedback_service.play_success_sound();

    const updated_note = note_workflow_service.advance_to_next_step(state.current_note);

    persistence_service.save_note(updated_note)
      .then(() => {
        global_state.update_state({
          current_view_identifier: 'question',
          current_note: updated_note
        });
      })
      .catch(error => console.error('✗ Failed to advance step:', error));
  };

  const handle_add_question = (text: string) => {
    if (!state.current_note) return;

    audio_feedback_service.play_secondary_action_sound();

    const question = {
      id: crypto.randomUUID(),
      text
    };

    const updated_note = note_workflow_service.add_question(state.current_note, question);

    persistence_service.save_note(updated_note)
      .then(() => {
        global_state.update_state({ current_note: updated_note });
      })
      .catch(error => console.error('✗ Failed to save question:', error));
  };

  const handle_edit_question = (question: { id: string; text: string }, new_text: string) => {
    if (!state.current_note) return;

    audio_feedback_service.play_secondary_action_sound();

    const updated_questions = state.current_note.questions.map(q =>
      q.id === question.id ? { ...q, text: new_text } : q
    );

    const updated_note = { ...state.current_note, questions: updated_questions };

    persistence_service.save_note(updated_note)
      .then(() => {
        global_state.update_state({ current_note: updated_note });
      })
      .catch(error => console.error('✗ Failed to update question:', error));
  };

  const handle_delete_question = (question_id: string) => {
    if (!state.current_note) return;

    audio_feedback_service.play_secondary_action_sound();

    const updated_questions = state.current_note.questions.filter(q => q.id !== question_id);
    const updated_note = { ...state.current_note, questions: updated_questions };

    persistence_service.save_note(updated_note)
      .then(() => {
        global_state.update_state({ current_note: updated_note });
      })
      .catch(error => console.error('✗ Failed to delete question:', error));
  };

  const handle_question_next = () => {
    if (!state.current_note) return;
    audio_feedback_service.play_success_sound();

    const updated_note = note_workflow_service.advance_to_next_step(state.current_note);

    persistence_service.save_note(updated_note)
      .then(() => {
        global_state.update_state({
          current_view_identifier: 'read',
          current_note: updated_note
        });
      })
      .catch(error => console.error('✗ Failed to advance step:', error));
  };

  const handle_start_timer = () => {
    audio_feedback_service.play_primary_action_sound();
    setTimerStarted(true);
    setTimerComplete(false);

    timer_service.start_timer(
      1500,
      (remaining) => setRemainingTime(remaining),
      () => {
        setTimerComplete(true);
        audio_feedback_service.play_success_sound();
      }
    );
  };

  const handle_skip_timer = () => {
    audio_feedback_service.play_primary_action_sound();
    timer_service.reset_timer();
    setTimerComplete(true);
  };

  const handle_read_next = () => {
    if (!state.current_note) return;
    audio_feedback_service.play_success_sound();

    const updated_note = note_workflow_service.advance_to_next_step(state.current_note);

    persistence_service.save_note(updated_note)
      .then(() => {
        setTimerStarted(false);
        setTimerComplete(false);
        setRemainingTime(1500);
        global_state.update_state({
          current_view_identifier: 'record',
          current_note: updated_note
        });
      })
      .catch(error => console.error('✗ Failed to advance step:', error));
  };

  const handle_answer_mission = (question_id: string, content: string) => {
    if (!state.current_note) return;

    audio_feedback_service.play_secondary_action_sound();

    const note_element = {
      id: crypto.randomUUID(),
      question_id,
      content
    };

    const updated_note = note_workflow_service.add_recorded_note(state.current_note, note_element);

    persistence_service.save_note(updated_note)
      .then(() => {
        global_state.update_state({ current_note: updated_note });
      })
      .catch(error => console.error('✗ Failed to save answer:', error));
  };

  const handle_add_side_note = (content: string) => {
    if (!state.current_note) return;

    audio_feedback_service.play_secondary_action_sound();

    const note_element = {
      id: crypto.randomUUID(),
      question_id: 'side_note_' + crypto.randomUUID(),
      content
    };

    const updated_note = note_workflow_service.add_recorded_note(state.current_note, note_element);

    persistence_service.save_note(updated_note)
      .then(() => {
        global_state.update_state({ current_note: updated_note });
      })
      .catch(error => console.error('✗ Failed to save side note:', error));
  };

  const handle_read_next_section = () => {
    audio_feedback_service.play_primary_action_sound();

    setTimerStarted(false);
    setTimerComplete(false);
    setRemainingTime(1500);

    global_state.update_state({
      current_view_identifier: 'read'
    });
  };

  const handle_finish_recording = () => {
    if (!state.current_note) return;
    audio_feedback_service.play_success_sound();

    const updated_note = note_workflow_service.advance_to_next_step(state.current_note);

    persistence_service.save_note(updated_note)
      .then(() => {
        global_state.update_state({
          current_view_identifier: 'recite',
          current_note: updated_note
        });
      })
      .catch(error => console.error('✗ Failed to advance step:', error));
  };

  const handle_recite_answer = (question_id: string, content: string) => {
    if (!state.current_note) return;

    audio_feedback_service.play_secondary_action_sound();

    const note_element = {
      id: crypto.randomUUID(),
      question_id,
      content
    };

    const updated_note = note_workflow_service.add_recited_note(state.current_note, note_element);

    persistence_service.save_note(updated_note)
      .then(() => {
        global_state.update_state({ current_note: updated_note });
      })
      .catch(error => console.error('✗ Failed to save recitation:', error));
  };

  const handle_recite_next = () => {
    if (!state.current_note) return;
    audio_feedback_service.play_success_sound();

    const updated_note = note_workflow_service.advance_to_next_step(state.current_note);

    persistence_service.save_note(updated_note)
      .then(() => {
        global_state.update_state({
          current_view_identifier: 'review',
          current_note: updated_note
        });
      })
      .catch(error => console.error('✗ Failed to advance step:', error));
  };

  const handle_add_correction = (question_id: string, content: string) => {
    if (!state.current_note) return;

    audio_feedback_service.play_secondary_action_sound();

    const correction = {
      id: crypto.randomUUID(),
      question_id,
      content
    };

    const updated_note = note_workflow_service.add_review_correction(state.current_note, correction);

    persistence_service.save_note(updated_note)
      .then(() => {
        global_state.update_state({ current_note: updated_note });
      })
      .catch(error => console.error('✗ Failed to save correction:', error));
  };

  const handle_select_rating = (rating: number) => {
    audio_feedback_service.play_primary_action_sound();
    setSelectedRating(rating);

    if (!state.current_note) return;

    const updated_note = note_workflow_service.set_difficulty_rating(state.current_note, rating);

    persistence_service.save_note(updated_note)
      .then(() => {
        global_state.update_state({ current_note: updated_note });
      })
      .catch(error => console.error('✗ Failed to save rating:', error));
  };

  const handle_review_next = () => {
    if (!state.current_note) return;
    audio_feedback_service.play_success_sound();

    const updated_note = note_workflow_service.advance_to_next_step(state.current_note);

    persistence_service.save_note(updated_note)
      .then(() => {
        setSelectedRating(0);
        global_state.update_state({
          current_view_identifier: 'reflect',
          current_note: updated_note
        });
      })
      .catch(error => console.error('✗ Failed to advance step:', error));
  };

  const handle_save_reflection = () => {
    const reflection_input = document.getElementById('reflection-input') as HTMLTextAreaElement;
    const reflection = reflection_input?.value || '';

    if (!state.current_note) return;

    audio_feedback_service.play_success_sound();

    let updated_note = note_workflow_service.add_reflection_and_complete(state.current_note, reflection);

    const schedule = spaced_repetition_service.calculate_next_review_date(
      updated_note,
      updated_note.rating
    );

    updated_note = {
      ...updated_note,
      next_review_date: schedule.next_review_date,
      srs_level: schedule.srs_level
    };

    persistence_service.save_note(updated_note)
      .then(() => {
        console.log('✓ Study session completed');
        return load_initial_data();
      })
      .then(() => {
        navigate_to_home();
      })
      .catch(error => console.error('✗ Failed to complete session:', error));
  };

  const current_notes = state.all_notes.filter(
    note => note.subject_identifier === state.current_subject?.id
  );

  return (
    <>
      {state.current_note && state.current_note.current_step === 'COMPLETED' && (
        <button
          onClick={() => export_note_as_markdown(state.current_note!)}
          className="fixed top-4 right-4 z-40 flex items-center gap-2 bg-slate-700 text-white px-4 py-2 rounded-lg hover:bg-slate-800 active:scale-95 transition-all duration-200 shadow-lg"
        >
          <Download className="w-4 h-4" />
          <span className="hidden sm:inline">Export</span>
        </button>
      )}

      {state.current_view_identifier === 'home' && (
        <HomeView
          subjects={state.all_subjects}
          all_notes={state.all_notes}
          due_reviews={state.due_reviews}
          on_create_subject={() => setModal({ type: 'create_subject' })}
          on_select_subject={handle_select_subject}
          on_delete_subject={(subject_id) => setModal({ type: 'delete_subject', subject_id })}
          on_select_review={handle_select_note}
        />
      )}
      {state.current_view_identifier === 'note_list' && state.current_subject && (
        <NoteListView
          subject={state.current_subject}
          notes={current_notes}
          on_back={navigate_to_home}
          on_create_note={() => setModal({ type: 'create_note' })}
          on_select_note={handle_select_note}
          on_delete_note={(note_id) => setModal({ type: 'delete_note', note_id })}
        />
      )}
      {state.current_view_identifier === 'survey' && state.current_note && (
        <SurveyView
          note={state.current_note}
          on_back={navigate_to_note_list}
          on_add_element={(type) => setModal({ type: 'add_survey_element', element_type: type })}
          on_edit_element={(element) => setModal({ type: 'edit_survey_element', element })}
          on_delete_element={(element_id) => setModal({ type: 'delete_survey_element', element_id })}
          on_next={handle_survey_next}
        />
      )}
      {state.current_view_identifier === 'question' && state.current_note && (
        <QuestionView
          note={state.current_note}
          on_back={go_back_to_survey}
          on_add_question={() => setModal({ type: 'add_question' })}
          on_edit_question={(question) => setModal({ type: 'edit_question', question })}
          on_delete_question={(question_id) => setModal({ type: 'delete_question', question_id })}
          on_next={handle_question_next}
        />
      )}
      {state.current_view_identifier === 'read' && state.current_note && (
        <ReadView
          note={state.current_note}
          timer_started={timer_started}
          timer_complete={timer_complete}
          remaining_time={remaining_time}
          on_back={go_back_to_question}
          on_start_timer={handle_start_timer}
          on_skip_timer={() => setModal({ type: 'skip_timer_warning' })}
          on_next={handle_read_next}
        />
      )}
      {state.current_view_identifier === 'record' && state.current_note && (
        <RecordView
          note={state.current_note}
          on_back={go_back_to_read}
          on_answer_mission={(question_id) => setModal({ type: 'answer_mission', question_id })}
          on_add_side_note={() => setModal({ type: 'add_side_note' })}
          on_read_next_section={handle_read_next_section}
          on_finish={handle_finish_recording}
        />
      )}
      {state.current_view_identifier === 'recite' && state.current_note && (
        <ReciteView
          note={state.current_note}
          on_back={go_back_to_record}
          on_recite_answer={(question_id) => setModal({ type: 'recite_answer', question_id })}
          on_next={handle_recite_next}
        />
      )}
      {state.current_view_identifier === 'review' && state.current_note && (
        <ReviewView
          note={state.current_note}
          selected_rating={selected_rating}
          on_back={go_back_to_recite}
          on_add_correction={(question_id) => setModal({ type: 'add_correction', question_id })}
          on_select_rating={handle_select_rating}
          on_export={() => export_note_as_markdown(state.current_note!)}
          on_next={handle_review_next}
        />
      )}
      {state.current_view_identifier === 'reflect' && state.current_note && (
        <ReflectView
          note={state.current_note}
          on_back={go_back_to_review}
          on_save_reflection={handle_save_reflection}
        />
      )}

      <TextInputModal
        is_open={modal.type === 'create_subject'}
        on_close={() => setModal({ type: 'none' })}
        on_submit={handle_create_subject}
        title="Create Subject"
        label="Subject Name"
        placeholder="e.g., Biology 101, History, Mathematics"
      />

      <TextInputModal
        is_open={modal.type === 'create_note'}
        on_close={() => setModal({ type: 'none' })}
        on_submit={handle_create_note}
        title="Create Note"
        label="Note Title"
        placeholder="e.g., Chapter 5: Cell Division"
      />

      {modal.type === 'add_survey_element' && (
        <TextInputModal
          is_open={true}
          on_close={() => setModal({ type: 'none' })}
          on_submit={(content) => {
            handle_add_survey_element(modal.element_type, content);
            setModal({ type: 'none' });
          }}
          title={`Add ${modal.element_type}`}
          label={`Enter ${modal.element_type}`}
          placeholder={`What ${modal.element_type} did you find?`}
          multiline
        />
      )}

      {modal.type === 'edit_survey_element' && (
        <TextInputModal
          is_open={true}
          on_close={() => setModal({ type: 'none' })}
          on_submit={(content) => {
            handle_edit_survey_element(modal.element, content);
            setModal({ type: 'none' });
          }}
          title={`Edit ${modal.element.type}`}
          label={`Edit ${modal.element.type}`}
          initial_value={modal.element.content}
          multiline
        />
      )}

      <TextInputModal
        is_open={modal.type === 'add_question'}
        on_close={() => setModal({ type: 'none' })}
        on_submit={(text) => {
          handle_add_question(text);
          setModal({ type: 'none' });
        }}
        title="Add Question"
        label="Your Question"
        placeholder="How does...? Why is...? What relationship...?"
        multiline
      />

      {modal.type === 'edit_question' && (
        <TextInputModal
          is_open={true}
          on_close={() => setModal({ type: 'none' })}
          on_submit={(text) => {
            handle_edit_question(modal.question, text);
            setModal({ type: 'none' });
          }}
          title="Edit Question"
          label="Your Question"
          initial_value={modal.question.text}
          multiline
        />
      )}

      {modal.type === 'answer_mission' && (
        <TextInputModal
          is_open={true}
          on_close={() => setModal({ type: 'none' })}
          on_submit={(content) => {
            handle_answer_mission(modal.question_id, content);
            setModal({ type: 'none' });
          }}
          title="Answer Mission"
          label="Your Answer"
          placeholder="What did you discover?"
          initial_value={state.current_note?.recorded_notes[modal.question_id]?.content || ''}
          multiline
        />
      )}

      <TextInputModal
        is_open={modal.type === 'add_side_note'}
        on_close={() => setModal({ type: 'none' })}
        on_submit={(content) => {
          handle_add_side_note(content);
          setModal({ type: 'none' });
        }}
        title="Add Side Note"
        label="Side Note"
        placeholder="Something interesting you noticed..."
        multiline
      />

      {modal.type === 'recite_answer' && (
        <TextInputModal
          is_open={true}
          on_close={() => setModal({ type: 'none' })}
          on_submit={(content) => {
            handle_recite_answer(modal.question_id, content);
            setModal({ type: 'none' });
          }}
          title="Recite from Memory"
          label="Your Answer"
          placeholder="What do you remember?"
          initial_value={state.current_note?.recited_notes[modal.question_id]?.content || ''}
          multiline
        />
      )}

      {modal.type === 'add_correction' && (
        <TextInputModal
          is_open={true}
          on_close={() => setModal({ type: 'none' })}
          on_submit={(content) => {
            handle_add_correction(modal.question_id, content);
            setModal({ type: 'none' });
          }}
          title="Note Corrections or Gaps"
          label="Corrections"
          placeholder="What did you miss or get wrong?"
          initial_value={state.current_note?.review_corrections[modal.question_id]?.content || ''}
          multiline
        />
      )}

      <ConfirmModal
        is_open={modal.type === 'skip_timer_warning'}
        on_close={() => setModal({ type: 'none' })}
        on_confirm={handle_skip_timer}
        title="Skip Timer?"
        message="Skipping the focused reading timer reduces the effectiveness of this method. Deep, concentrated reading is essential for retention. Are you sure you want to skip?"
        confirm_text="Skip Anyway"
        confirm_style="warning"
      />

      {modal.type === 'delete_survey_element' && (
        <ConfirmModal
          is_open={true}
          on_close={() => setModal({ type: 'none' })}
          on_confirm={() => {
            handle_delete_survey_element(modal.element_id);
            setModal({ type: 'none' });
          }}
          title="Delete Element?"
          message="Are you sure you want to delete this survey element? This action cannot be undone."
          confirm_text="Delete"
          confirm_style="danger"
        />
      )}

      {modal.type === 'delete_question' && (
        <ConfirmModal
          is_open={true}
          on_close={() => setModal({ type: 'none' })}
          on_confirm={() => {
            handle_delete_question(modal.question_id);
            setModal({ type: 'none' });
          }}
          title="Delete Question?"
          message="Are you sure you want to delete this question? This will also remove any associated answers. This action cannot be undone."
          confirm_text="Delete"
          confirm_style="danger"
        />
      )}

      {modal.type === 'delete_subject' && (
        <ConfirmModal
          is_open={true}
          on_close={() => setModal({ type: 'none' })}
          on_confirm={() => {
            handle_delete_subject(modal.subject_id);
            setModal({ type: 'none' });
          }}
          title="Delete Subject?"
          message="Are you sure you want to delete this subject? This will permanently delete the subject and all associated notes. This action cannot be undone."
          confirm_text="Delete"
          confirm_style="danger"
        />
      )}

      {modal.type === 'delete_note' && (
        <ConfirmModal
          is_open={true}
          on_close={() => setModal({ type: 'none' })}
          on_confirm={() => {
            handle_delete_note(modal.note_id);
            setModal({ type: 'none' });
          }}
          title="Delete Note?"
          message="Are you sure you want to delete this note? This will permanently delete all your work on this note. This action cannot be undone."
          confirm_text="Delete"
          confirm_style="danger"
        />
      )}
    </>
  );
}

export default App;
