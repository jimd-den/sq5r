// ═══════════════════════════════════════════════════════════════
// LAYER 5: Content Templates (What users see)
// ═══════════════════════════════════════════════════════════════

import { X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

interface BaseModalProps {
  is_open: boolean;
  on_close: () => void;
  title: string;
  children: React.ReactNode;
}

export function BaseModal({ is_open, on_close, title, children }: BaseModalProps) {
  useEffect(() => {
    if (is_open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [is_open]);

  if (!is_open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={on_close}
      />
      <div className="relative bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg max-h-[90vh] sm:max-h-[80vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">{title}</h2>
          <button
            onClick={on_close}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}

interface TextInputModalProps {
  is_open: boolean;
  on_close: () => void;
  on_submit: (value: string) => void;
  title: string;
  label: string;
  placeholder?: string;
  initial_value?: string;
  multiline?: boolean;
}

export function TextInputModal({
  is_open,
  on_close,
  on_submit,
  title,
  label,
  placeholder = '',
  initial_value = '',
  multiline = false
}: TextInputModalProps) {
  const [value, setValue] = useState(initial_value);
  const input_ref = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    if (is_open) {
      setValue(initial_value);
      setTimeout(() => input_ref.current?.focus(), 100);
    }
  }, [is_open, initial_value]);

  const handle_submit = () => {
    if (value.trim()) {
      on_submit(value.trim());
      setValue('');
      on_close();
    }
  };

  const handle_key_down = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline) {
      e.preventDefault();
      handle_submit();
    }
  };

  return (
    <BaseModal is_open={is_open} on_close={on_close} title={title}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            {label}
          </label>
          {multiline ? (
            <textarea
              ref={input_ref as React.RefObject<HTMLTextAreaElement>}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={placeholder}
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-slate-500 focus:ring-2 focus:ring-slate-200 outline-none resize-none text-slate-900"
              rows={4}
            />
          ) : (
            <input
              ref={input_ref as React.RefObject<HTMLInputElement>}
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={handle_key_down}
              placeholder={placeholder}
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-slate-500 focus:ring-2 focus:ring-slate-200 outline-none text-slate-900"
            />
          )}
        </div>
        <div className="flex gap-3">
          <button
            onClick={on_close}
            className="flex-1 px-4 py-3 border-2 border-slate-200 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handle_submit}
            disabled={!value.trim()}
            className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${
              value.trim()
                ? 'bg-slate-700 text-white hover:bg-slate-800'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            Submit
          </button>
        </div>
      </div>
    </BaseModal>
  );
}

interface ConfirmModalProps {
  is_open: boolean;
  on_close: () => void;
  on_confirm: () => void;
  title: string;
  message: string;
  confirm_text?: string;
  confirm_style?: 'danger' | 'warning' | 'primary';
}

export function ConfirmModal({
  is_open,
  on_close,
  on_confirm,
  title,
  message,
  confirm_text = 'Confirm',
  confirm_style = 'primary'
}: ConfirmModalProps) {
  const get_confirm_classes = () => {
    switch (confirm_style) {
      case 'danger':
        return 'bg-red-600 text-white hover:bg-red-700';
      case 'warning':
        return 'bg-amber-600 text-white hover:bg-amber-700';
      default:
        return 'bg-slate-700 text-white hover:bg-slate-800';
    }
  };

  return (
    <BaseModal is_open={is_open} on_close={on_close} title={title}>
      <div className="space-y-4">
        <p className="text-slate-700 leading-relaxed">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={on_close}
            className="flex-1 px-4 py-3 border-2 border-slate-200 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              on_confirm();
              on_close();
            }}
            className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${get_confirm_classes()}`}
          >
            {confirm_text}
          </button>
        </div>
      </div>
    </BaseModal>
  );
}
