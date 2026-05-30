/* ============================================
   AUDIO SYSTEM - OVA Reciclaje
   Simple and robust: plays files when available
   ============================================ */

window.OVA = window.OVA || {};

OVA.audio = (function() {
  var currentAudio = null;
  var volume = 0.8;
  var isMuted = false;

  var narracion = {
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

  var actividades = {
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

  function stop() {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      currentAudio = null;
    }
  }

  function play(path) {
    if (!path || isMuted) return;
    stop();
    var a = new Audio();
    a.src = path;
    a.volume = volume;
    currentAudio = a;
    a.play().catch(function() {});
  }

  function playNarracion(i) {
    if (narracion[i]) play(narracion[i]);
  }

  function playActividad(type) {
    if (actividades[type]) play(actividades[type]);
  }

  function setVolume(v) {
    volume = v / 100;
    if (currentAudio) currentAudio.volume = volume;
  }

  function toggleMute() {
    isMuted = !isMuted;
    if (isMuted) stop();
    var btn = document.getElementById('audioPlayBtn');
    if (btn) btn.innerHTML = '<span class="material-icons">' + (isMuted ? 'volume_off' : 'volume_up') + '</span>';
  }

  // Sound effects with Web Audio API
  var ctx = null;
  function tone(f, d, type, v) {
    if (isMuted) return;
    try {
      if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
      if (ctx.state === 'suspended') ctx.resume();
      var o = ctx.createOscillator();
      var g = ctx.createGain();
      o.type = type || 'sine';
      o.frequency.value = f;
      g.gain.setValueAtTime((v || volume) * 0.3, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + d);
      o.connect(g);
      g.connect(ctx.destination);
      o.start();
      o.stop(ctx.currentTime + d);
    } catch(e) {}
  }

  return {
    init: init,
    play: play,
    playNarracion: playNarracion,
    playActividad: playActividad,
    stop: stop,
    setVolume: setVolume,
    toggleMute: toggleMute,
    playClick: function() { tone(800, 0.08); },
    playCorrect: function() { tone(523, 0.15); setTimeout(function(){ tone(659, 0.15); },100); setTimeout(function(){ tone(784, 0.3); },200); },
    playIncorrect: function() { tone(330, 0.2, 'sawtooth', 0.2); setTimeout(function(){ tone(260, 0.3, 'sawtooth', 0.2); },150); },
    playStar: function() { tone(880, 0.1); setTimeout(function(){ tone(1109, 0.15); },80); setTimeout(function(){ tone(1319, 0.2); },160); },
    playTransition: function() { tone(440, 0.1, 'triangle', 0.15); },
    playComplete: function() { [523,587,659,784,880,1047].forEach(function(f,i){ setTimeout(function(){ tone(f,0.2); },i*120); }); },
    stopNarration: stop
  };
})();
