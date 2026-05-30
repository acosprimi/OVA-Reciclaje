/* ============================================
   AUDIO SYSTEM - OVA Reciclaje
   Loads MP3 files for narracion and actividades
   ============================================ */

window.OVA = window.OVA || {};

OVA.audio = (function() {
  var currentAudio = null;
  var volume = 0.8;
  var isMuted = false;
  var audioEnabled = true;

  // Map of screen indices to narracion audio files
  var narracionFiles = {
    0: 'src/assets/audio/narracion/bienvenida.mp3',
    1: 'src/assets/audio/narracion/objetivos.mp3',
    2: 'src/assets/audio/narracion/exploracion.mp3',
    3: 'src/assets/audio/narracion/datoscuriosos.mp3',
    4: 'src/assets/audio/narracion/actividades.mp3',
    5: 'src/assets/audio/narracion/video.mp3',
    6: 'src/assets/audio/narracion/clasificar.mp3',
    7: 'src/assets/audio/narracion/evaluacion.mp3',
    8: 'src/assets/audio/narracion/cierre.mp3'
  };

  // Map of activity types to actividades audio files
  var actividadesFiles = {
    detective: 'src/assets/audio/actividades/detective.mp3',
    hotspots: 'src/assets/audio/actividades/hotspots.mp3',
    ordering: 'src/assets/audio/actividades/ordenar.mp3',
    timed: 'src/assets/audio/actividades/contrarreloj.mp3',
    roulette: 'src/assets/audio/actividades/ruleta.mp3',
    puzzle: 'src/assets/audio/actividades/puzzle.mp3',
    house: 'src/assets/audio/actividades/casa.mp3',
    truefalse: 'src/assets/audio/actividades/verdaderofalso.mp3',
    memory: 'src/assets/audio/actividades/memorama.mp3',
    truck: 'src/assets/audio/actividades/camion.mp3',
    beforeafter: 'src/assets/audio/actividades/antesdespues.mp3',
    customize: 'src/assets/audio/actividades/personalizar.mp3',
    character: 'src/assets/audio/actividades/personaje.mp3',
    mission: 'src/assets/audio/actividades/mision.mp3'
  };

  function init() {
    var slider = document.getElementById('audioVolumeSlider');
    if (slider) volume = slider.value / 100;
  }

  // No preload here - handled by app.js loading screen

  function stopCurrent() {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      currentAudio = null;
    }
  }

  function playFile(filePath, callback) {
    if (!audioEnabled || isMuted || !filePath) {
      if (callback) callback();
      return;
    }
    stopCurrent();
    var audio = new Audio();
    audio.preload = 'auto';
    audio.src = filePath;
    audio.volume = volume;
    currentAudio = audio;

    audio.onended = function() {
      currentAudio = null;
      if (callback) callback();
    };

    audio.onerror = function() {
      currentAudio = null;
      if (callback) callback();
    };

    audio.play().catch(function() {
      currentAudio = null;
      if (callback) callback();
    });
  }

  function playNarracion(slideIndex) {
    var file = narracionFiles[slideIndex];
    if (file) playFile(file);
  }

  function playActividad(activityType) {
    var file = actividadesFiles[activityType];
    if (file) playFile(file);
  }

  function setVolume(val) {
    volume = parseInt(val) / 100;
    if (currentAudio) currentAudio.volume = volume;
    var s1 = document.getElementById('audioVolumeSlider');
    var s2 = document.getElementById('accessVolumeSlider');
    if (s1) s1.value = val;
    if (s2) s2.value = val;
  }

  function toggleMute() {
    isMuted = !isMuted;
    if (isMuted) {
      stopCurrent();
    }
    var btn = document.getElementById('audioPlayBtn');
    if (btn) btn.innerHTML = '<span class="material-icons">' + (isMuted ? 'volume_off' : 'volume_up') + '</span>';
  }

  function togglePlay() {
    if (isMuted) {
      isMuted = false;
      var btn = document.getElementById('audioPlayBtn');
      if (btn) btn.innerHTML = '<span class="material-icons">volume_up</span>';
    } else if (currentAudio && !currentAudio.paused) {
      currentAudio.pause();
    } else if (currentAudio) {
      currentAudio.play();
    }
  }

  function stop() {
    stopCurrent();
  }

  // Simple sound effects using Web Audio API (no files needed)
  var audioCtx = null;
  function ensureCtx() {
    if (!audioCtx) {
      try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch(e) {}
    }
    if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
  }

  function playTone(freq, dur, type, vol) {
    if (isMuted) return;
    ensureCtx();
    if (!audioCtx) return;
    var osc = audioCtx.createOscillator();
    var gain = audioCtx.createGain();
    osc.type = type || 'sine';
    osc.frequency.value = freq;
    gain.gain.setValueAtTime((vol || volume) * 0.3, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + dur);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + dur);
  }

  function playClick() { playTone(800, 0.08, 'sine', 0.15); }
  function playCorrect() {
    playTone(523.25, 0.15);
    setTimeout(function() { playTone(659.25, 0.15); }, 100);
    setTimeout(function() { playTone(783.99, 0.3); }, 200);
  }
  function playIncorrect() {
    playTone(330, 0.2, 'sawtooth', 0.2);
    setTimeout(function() { playTone(260, 0.3, 'sawtooth', 0.2); }, 150);
  }
  function playStar() {
    playTone(880, 0.1);
    setTimeout(function() { playTone(1108.73, 0.15); }, 80);
    setTimeout(function() { playTone(1318.51, 0.2); }, 160);
  }
  function playTransition() { playTone(440, 0.1, 'triangle', 0.15); }
  function playComplete() {
    [523.25, 587.33, 659.25, 783.99, 880, 1046.50].forEach(function(f, i) {
      setTimeout(function() { playTone(f, 0.2, 'sine', 0.2); }, i * 120);
    });
  }

  return {
    init: init,
    playNarracion: playNarracion,
    playActividad: playActividad,
    playClick: playClick,
    playCorrect: playCorrect,
    playIncorrect: playIncorrect,
    playStar: playStar,
    playTransition: playTransition,
    playComplete: playComplete,
    stop: stop,
    setVolume: setVolume,
    toggleMute: toggleMute,
    togglePlay: togglePlay,
    stopNarration: stopCurrent,
    get volume() { return volume; },
    get isMuted() { return isMuted; }
  };
})();
