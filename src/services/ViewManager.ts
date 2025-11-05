// ═══════════════════════════════════════════════════════════════
// LAYER 3: Application Services (Business logic)
// ═══════════════════════════════════════════════════════════════

import type { GlobalState, ViewIdentifier, ApplicationState } from './GlobalState';

/**
 * Responsible for: Controlling the presentation layer based on application state.
 * Single Responsibility: Showing and hiding views in response to state changes.
 */
export class ViewManager {
  private global_state: GlobalState;
  private render_callback: (view: ViewIdentifier, state: ApplicationState) => void;

  constructor(
    global_state: GlobalState,
    render_callback: (view: ViewIdentifier, state: ApplicationState) => void
  ) {
    this.global_state = global_state;
    this.render_callback = render_callback;

    this.global_state.subscribe((state) => {
      this.render_callback(state.current_view_identifier, state);
    });
  }

  navigate_to_view(view: ViewIdentifier): void {
    this.global_state.update_state({
      current_view_identifier: view
    });
  }
}
