/* ============================================
   AUDIO SYSTEM - OVA Reciclaje
   ============================================ */

window.OVA = window.OVA || {};

OVA.audio = (function() {
  let audioContext = null;
  let isPlaying = false;
  let isMuted = false;
  let volume = 0.8;
  let narrationEnabled = false;

  function init() {
    try {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch(e) {}
  }

  function ensureContext() {
    if (audioContext && audioContext.state === 'suspended') audioContext.resume();
  }

  function playTone(freq, dur, type, vol) {
    ensureContext();
    if (!audioContext || isMuted) return;
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    osc.type = type || 'sine';
    osc.frequency.value = freq;
    gain.gain.setValueAtTime((vol || volume) * 0.3, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + dur);
    osc.connect(gain);
    gain.connect(audioContext.destination);
    osc.start();
    osc.stop(audioContext.currentTime + dur);
  }

  function playCorrect() {
    playTone(523.25, 0.15);
    setTimeout(() => playTone(659.25, 0.15), 100);
    setTimeout(() => playTone(783.99, 0.3), 200);
  }

  function playIncorrect() {
    playTone(330, 0.2, 'sawtooth', 0.2);
    setTimeout(() => playTone(260, 0.3, 'sawtooth', 0.2), 150);
  }

  function playClick() {
    playTone(800, 0.08, 'sine', 0.15);
  }

  function playStar() {
    playTone(880, 0.1);
    setTimeout(() => playTone(1108.73, 0.15), 80);
    setTimeout(() => playTone(1318.51, 0.2), 160);
  }

  function playTransition() {
    playTone(440, 0.1, 'triangle', 0.15);
    setTimeout(() => playTone(554.37, 0.1, 'triangle', 0.15), 80);
  }

  function playComplete() {
    [523.25, 587.33, 659.25, 783.99, 880, 1046.50].forEach((f, i) => {
      setTimeout(() => playTone(f, 0.2, 'sine', 0.2), i * 120);
    });
  }

  function narrate(text, cb) {
    if (!narrationEnabled || !window.speechSynthesis) { if (cb) cb(); return; }
    stopNarration();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'es-ES';
    u.rate = 0.9;
    u.pitch = 1.1;
    u.volume = volume;
    const voices = speechSynthesis.getVoices();
    const sv = voices.find(v => v.lang.startsWith('es'));
    if (sv) u.voice = sv;
    u.onend = u.onerror = () => { if (cb) cb(); };
    speechSynthesis.speak(u);
  }

  function stopNarration() {
    if (window.speechSynthesis) speechSynthesis.cancel();
  }

  function setVolume(val) {
    volume = parseInt(val) / 100;
    const s1 = document.getElementById('audioVolumeSlider');
    const s2 = document.getElementById('accessVolumeSlider');
    if (s1) s1.value = val;
    if (s2) s2.value = val;
  }

  function toggleMute() {
    isMuted = !isMuted;
    if (isMuted) stopNarration();
  }

  function togglePlay() {
    isPlaying = !isPlaying;
    if (!isPlaying) stopNarration();
  }

  return {
    init, playCorrect, playIncorrect, playClick, playStar,
    playTransition, playComplete, narrate, stopNarration,
    setVolume, toggleMute, togglePlay
  };
})();
