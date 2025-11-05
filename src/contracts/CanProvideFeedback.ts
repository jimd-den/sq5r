// ═══════════════════════════════════════════════════════════════
// LAYER 1: Domain Contracts (What the system promises to do)
// ═══════════════════════════════════════════════════════════════

/**
 * Contract: Defines the capability to provide non-intrusive audio
 * feedback for different types of user actions.
 */
export interface CanProvideFeedback {
  play_primary_action_sound(): void;
  play_secondary_action_sound(): void;
  play_success_sound(): void;
}
