// ═══════════════════════════════════════════════════════════════
// LAYER 3: Application Services (Business logic)
// ═══════════════════════════════════════════════════════════════

import type { CanOperateTimer } from '../contracts/CanOperateTimer';

/**
 * Responsible for: Managing the Read step timer.
 * Single Responsibility: Operating a countdown timer with event notifications.
 */
export class TimerService implements CanOperateTimer {
  private interval_id: number | null = null;
  private remaining_seconds = 0;

  start_timer(
    duration_in_seconds: number,
    on_tick: (remaining: number) => void,
    on_complete: () => void
  ): void {
    this.reset_timer();
    this.remaining_seconds = duration_in_seconds;

    this.interval_id = window.setInterval(() => {
      this.remaining_seconds -= 1;
      on_tick(this.remaining_seconds);

      if (this.remaining_seconds <= 0) {
        this.reset_timer();
        on_complete();
      }
    }, 1000);
  }

  reset_timer(): void {
    if (this.interval_id !== null) {
      clearInterval(this.interval_id);
      this.interval_id = null;
    }
    this.remaining_seconds = 0;
  }
}
