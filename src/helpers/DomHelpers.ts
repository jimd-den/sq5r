// ═══════════════════════════════════════════════════════════════
// LAYER 6: Helper Utilities (Readability enhancers)
// ═══════════════════════════════════════════════════════════════

/**
 * Natural language helper: Makes DOM element selection more readable.
 */
export function find_element_by_id<T extends HTMLElement>(id: string): T | null {
  return document.getElementById(id) as T | null;
}

/**
 * Natural language helper: Makes DOM query selection more readable.
 */
export function find_element_by_selector<T extends Element>(selector: string): T | null {
  return document.querySelector(selector) as T | null;
}

/**
 * Natural language helper: Makes multiple element selection more readable.
 */
export function find_all_elements_by_selector<T extends Element>(selector: string): T[] {
  return Array.from(document.querySelectorAll(selector)) as T[];
}

/**
 * Natural language helper: Makes event listener attachment more readable.
 */
export function when_clicked(element: HTMLElement | null, handler: () => void): void {
  if (element) {
    element.addEventListener('click', handler);
  }
}

/**
 * Natural language helper: Makes input value retrieval more readable.
 */
export function get_value_from_input(element: HTMLInputElement | HTMLTextAreaElement | null): string {
  return element?.value || '';
}

/**
 * Natural language helper: Makes element visibility control more readable.
 */
export function show_element(element: HTMLElement | null): void {
  if (element) {
    element.classList.remove('hidden');
  }
}

/**
 * Natural language helper: Makes element hiding more readable.
 */
export function hide_element(element: HTMLElement | null): void {
  if (element) {
    element.classList.add('hidden');
  }
}

/**
 * Natural language helper: Formats seconds into MM:SS display format.
 */
export function format_time_as_minutes_seconds(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remaining_seconds = seconds % 60;
  return `${minutes}:${remaining_seconds.toString().padStart(2, '0')}`;
}
