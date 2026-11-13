/**
 * Procedural Web Audio Engine for SanatanVerse
 * Generates meditative temple bells, cosmic drones, panel transitions, and celestial pulses
 * entirely through Web Audio API without requiring any external audio files.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private droneOsc: OscillatorNode | null = null;
  private droneGain: GainNode | null = null;
  private isDroneActive: boolean = false;

  constructor() {
    // Check saved audio preference
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sanatan_sound_muted');
      this.isMuted = saved === 'true';
    }
  }

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (typeof window !== 'undefined') {
      localStorage.setItem('sanatan_sound_muted', String(this.isMuted));
    }
    if (this.isMuted && this.droneGain && this.ctx) {
      this.droneGain.gain.setValueAtTime(0, this.ctx.currentTime);
    }
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Resonant Temple Bell / Ghanta sound
   */
  public playTempleBell() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const baseFreq = 432; // Sacred A432 tuning

    // 3 harmonic partials to simulate bronze alloy resonance
    const partials = [
      { ratio: 1.0, gain: 0.35, decay: 3.2 },
      { ratio: 2.76, gain: 0.18, decay: 2.1 },
      { ratio: 5.4, gain: 0.08, decay: 1.4 },
    ];

    partials.forEach(({ ratio, gain, decay }) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gainNode = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(baseFreq * ratio, now);

      gainNode.gain.setValueAtTime(gain, now);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + decay);

      osc.connect(gainNode);
      gainNode.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + decay);
    });
  }

  public playBell() {
    this.playTempleBell();
  }

  /**
   * Comic panel transition swoosh
   */
  public playPanelSwoosh() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(520, now + 0.12);
    osc.frequency.exponentialRampToValueAtTime(90, now + 0.28);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, now);

    gainNode.gain.setValueAtTime(0.12, now);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.28);

    osc.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.28);
  }

  /**
   * Celestial / Astra Energy Pulse
   */
  public playAstraPulse() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.25);
    osc.frequency.exponentialRampToValueAtTime(440, now + 0.5);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.5);
  }

  /**
   * Toggle subtle meditative ambient drone
   */
  public toggleAmbientDrone(): boolean {
    this.initContext();
    if (!this.ctx) return false;

    if (this.isDroneActive) {
      if (this.droneGain) {
        this.droneGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.5);
      }
      setTimeout(() => {
        try {
          this.droneOsc?.stop();
          this.droneOsc?.disconnect();
        } catch {
          // ignore
        }
        this.droneOsc = null;
        this.droneGain = null;
        this.isDroneActive = false;
      }, 600);
      return false;
    } else {
      const now = this.ctx.currentTime;
      this.droneOsc = this.ctx.createOscillator();
      this.droneGain = this.ctx.createGain();

      this.droneOsc.type = 'sine';
      this.droneOsc.frequency.setValueAtTime(108, now); // 108Hz sacred root tone

      this.droneGain.gain.setValueAtTime(0, now);
      const targetGain = this.isMuted ? 0 : 0.04;
      this.droneGain.gain.setTargetAtTime(targetGain, now, 1.2);

      this.droneOsc.connect(this.droneGain);
      this.droneGain.connect(this.ctx.destination);

      this.droneOsc.start(now);
      this.isDroneActive = true;
      return true;
    }
  }

  public getIsDroneActive(): boolean {
    return this.isDroneActive;
  }
}

export const soundEffects = new SoundEngine();
