let audioCtx = null;

// Must be called from a user gesture handler (click) at least once so
// browsers' autoplay policy allows later async playback to go through.
export function unlockAudio() {
  if (!audioCtx) {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    audioCtx = new Ctx();
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
}

export function playBeep() {
  unlockAudio();
  if (!audioCtx) return;

  const start = audioCtx.currentTime;
  [0, 0.25].forEach((offset) => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = "sine";
    osc.frequency.value = 880;

    gain.gain.setValueAtTime(0.0001, start + offset);
    gain.gain.exponentialRampToValueAtTime(0.3, start + offset + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + offset + 0.2);

    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(start + offset);
    osc.stop(start + offset + 0.22);
  });
}
