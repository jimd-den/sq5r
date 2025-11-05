// ═══════════════════════════════════════════════════════════════
// LAYER 3: Application Services (Business logic)
// ═══════════════════════════════════════════════════════════════

import type { CanProvideFeedback } from '../contracts/CanProvideFeedback';

/**
 * Responsible for: Providing non-intrusive audio feedback.
 * Single Responsibility: Playing distinct sounds for different user actions.
 */
export class AudioFeedbackService implements CanProvideFeedback {
  private audio_context: AudioContext;

  constructor() {
    this.audio_context = new (window.AudioContext || (window as any).webkitAudioContext)();
  }

  play_primary_action_sound(): void {
    this.play_tone(440, 0.1, 'sine');
  }

  play_secondary_action_sound(): void {
    this.play_tone(330, 0.08, 'sine');
  }

  play_success_sound(): void {
    this.play_tone(523, 0.15, 'sine');
    setTimeout(() => this.play_tone(659, 0.15, 'sine'), 100);
  }

  private play_tone(frequency: number, duration: number, type: OscillatorType): void {
    const oscillator = this.audio_context.createOscillator();
    const gain_node = this.audio_context.createGain();

    oscillator.connect(gain_node);
    gain_node.connect(this.audio_context.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = type;

    gain_node.gain.setValueAtTime(0.1, this.audio_context.currentTime);
    gain_node.gain.exponentialRampToValueAtTime(0.01, this.audio_context.currentTime + duration);

    oscillator.start(this.audio_context.currentTime);
    oscillator.stop(this.audio_context.currentTime + duration);
  }
}
