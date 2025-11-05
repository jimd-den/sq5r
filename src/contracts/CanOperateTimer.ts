// ═══════════════════════════════════════════════════════════════
// LAYER 1: Domain Contracts (What the system promises to do)
// ═══════════════════════════════════════════════════════════════

/**
 * Contract: Defines the capability to operate a countdown timer with
 * event notifications for tick updates and completion.
 */
export interface CanOperateTimer {
  start_timer(duration_in_seconds: number, on_tick: (remaining: number) => void, on_complete: () => void): void;
  reset_timer(): void;
}
