/* ============================================
   AUDIO MANAGER - OVA Reciclaje
   Professional audio system with caching,
   preloading, queue, and event handling.
   ============================================ */

window.OVA = window.OVA || {};

OVA.audio = (function() {
  'use strict';

  // ─── Configuration ───────────────────────────────────
  var CONFIG = {
    volume: 0.8,
    preloadDelay: 200,
    queueDelay: 100,
    logPrefix: '[AudioManager]'
  };

  // ─── Audio file registry ─────────────────────────────
  var NARRACION = {
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

  var ACTIVIDADES = {
    detective:    'src/assets/audio/actividades/detective.mp3',
    hotspots:     'src/assets/audio/actividades/hotspots.mp3',
    ordering:     'src/assets/audio/actividades/ordenar.mp3',
    timed:        'src/assets/audio/actividades/contrarreloj.mp3',
    roulette:     'src/assets/audio/actividades/ruleta.mp3',
    puzzle:       'src/assets/audio/actividades/puzzle.mp3',
    house:        'src/assets/audio/actividades/casa.mp3',
    truefalse:    'src/assets/audio/actividades/verdaderofalso.mp3',
    memory:       'src/assets/audio/actividades/memorama.mp3',
    truck:        'src/assets/audio/actividades/camion.mp3',
    beforeafter:  'src/assets/audio/actividades/antesdespues.mp3',
    customize:    'src/assets/audio/actividades/personalizar.mp3',
    character:    'src/assets/audio/actividades/personaje.mp3',
    mission:      'src/assets/audio/actividades/mision.mp3'
  };

  // ─── State ───────────────────────────────────────────
  var cache = {};
  var currentAudio = null;
  var queue = [];
  var isProcessingQueue = false;
  var isMuted = false;
  var userInteracted = false;
  var pendingPlays = [];
  var ctx = null;

  // ─── Logging ─────────────────────────────────────────
  function log(type, msg, data) {
    var styles = {
      info:    'color: #2196F3; font-weight: bold;',
      success: 'color: #4CAF50; font-weight: bold;',
      warn:    'color: #FF9800; font-weight: bold;',
      error:   'color: #F44336; font-weight: bold;',
      debug:   'color: #9E9E9E;'
    };
    var prefix = CONFIG.logPrefix;
    switch(type) {
      case 'info':    console.log('%c' + prefix + ' ' + msg, styles.info, data || ''); break;
      case 'success': console.log('%c' + prefix + ' ' + msg, styles.success, data || ''); break;
      case 'warn':    console.warn('%c' + prefix + ' ' + msg, styles.warn, data || ''); break;
      case 'error':   console.error('%c' + prefix + ' ' + msg, styles.error, data || ''); break;
      case 'debug':   console.log('%c' + prefix + ' ' + msg, styles.debug, data || ''); break;
    }
  }

  // ─── Audio Instance Factory ──────────────────────────
  function createAudioInstance(url) {
    var audio = new Audio();
    audio.preload = 'auto';
    audio.crossOrigin = 'anonymous';

    audio.addEventListener('loadedmetadata', function() {
      log('debug', 'loadedmetadata: ' + url + ' (' + audio.duration.toFixed(2) + 's)');
    });

    audio.addEventListener('loadeddata', function() {
      log('debug', 'loadeddata: ' + url);
    });

    audio.addEventListener('canplay', function() {
      log('debug', 'canplay: ' + url);
    });

    audio.addEventListener('canplaythrough', function() {
      log('success', 'canplaythrough: ' + url);
    });

    audio.addEventListener('error', function(e) {
      var code = audio.error ? audio.error.code : 'unknown';
      var msg = audio.error ? audio.error.message : 'unknown error';
      log('error', 'Error cargando: ' + url + ' [code: ' + code + ', msg: ' + msg + ']');
    });

    audio.src = url;
    return audio;
  }

  // ─── Cache Management ────────────────────────────────
  function getCached(url) {
    return cache[url] || null;
  }

  function setCached(url, audio) {
    cache[url] = audio;
  }

  function getOrCreate(url) {
    var existing = getCached(url);
    if (existing) return existing;
    var audio = createAudioInstance(url);
    setCached(url, audio);
    return audio;
  }

  // ─── Autoplay Detection ──────────────────────────────
  function onFirstInteraction() {
    if (userInteracted) return;
    userInteracted = true;
    log('info', 'Interaccion del usuario detectada - sistema de audio desbloqueado');
    document.removeEventListener('click', onFirstInteraction);
    document.removeEventListener('keydown', onFirstInteraction);
    document.removeEventListener('touchstart', onFirstInteraction);

    pendingPlays.forEach(function(item) {
      safePlay(item.audio, item.url);
    });
    pendingPlays = [];
  }

  function setupAutoplayDetection() {
    document.addEventListener('click', onFirstInteraction, { once: false });
    document.addEventListener('keydown', onFirstInteraction, { once: false });
    document.addEventListener('touchstart', onFirstInteraction, { once: false });
  }

  // ─── Playback Engine ─────────────────────────────────
  function safePlay(audio, url) {
    if (!audio) {
      log('warn', 'safePlay: audio es null para ' + url);
      return Promise.resolve();
    }

    return new Promise(function(resolve) {
      var onEnded = function() {
        audio.removeEventListener('ended', onEnded);
        audio.removeEventListener('error', onError);
        resolve();
      };

      var onError = function() {
        audio.removeEventListener('ended', onEnded);
        audio.removeEventListener('error', onError);
        resolve();
      };

      audio.addEventListener('ended', onEnded, { once: true });
      audio.addEventListener('error', onError, { once: true });

      audio.currentTime = 0;
      audio.volume = isMuted ? 0 : CONFIG.volume;

      var playPromise = audio.play();
      if (playPromise && typeof playPromise.then === 'function') {
        playPromise.then(function() {
          log('success', 'Reproduciendo: ' + url);
        }).catch(function(err) {
          if (err.name === 'NotAllowedError') {
            log('warn', 'Autoplay bloqueado. Esperando interaccion del usuario para: ' + url);
            pendingPlays.push({ audio: audio, url: url });
          } else {
            log('error', 'Error reproduciendo: ' + url + ' - ' + err.message);
          }
          resolve();
        });
      } else {
        log('success', 'Reproduciendo (legacy): ' + url);
      }
    });
  }

  // ─── Queue System ────────────────────────────────────
  function enqueue(url, category) {
    queue.push({ url: url, category: category, timestamp: Date.now() });
    if (!isProcessingQueue) processQueue();
  }

  function processQueue() {
    if (isProcessingQueue || queue.length === 0) return;
    isProcessingQueue = true;

    var item = queue.shift();

    // Stop current audio before playing new one
    if (currentAudio) {
      log('debug', 'Deteniendo audio anterior');
      currentAudio.pause();
      currentAudio.currentTime = 0;
      currentAudio = null;
    }

    var audio = getOrCreate(item.url);
    currentAudio = audio;

    safePlay(audio, item.url).then(function() {
      setTimeout(function() {
        isProcessingQueue = false;
        processQueue();
      }, CONFIG.queueDelay);
    });
  }

  function clearQueue() {
    queue = [];
    isProcessingQueue = false;
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      currentAudio = null;
    }
    log('debug', 'Cola limpiada');
  }

  // ─── Public API: Narracion ───────────────────────────
  function playNarracion(slideIndex) {
    var url = NARRACION[slideIndex];
    if (!url) {
      log('warn', 'No hay audio de narracion para la pantalla: ' + slideIndex);
      return;
    }
    log('info', 'Solicitado audio narracion [' + slideIndex + ']: ' + url);
    clearQueue();
    enqueue(url, 'narracion');
  }

  // ─── Public API: Actividades ─────────────────────────
  function playActividad(activityType) {
    var url = ACTIVIDADES[activityType];
    if (!url) {
      log('warn', 'No hay audio de actividad para: ' + activityType);
      return;
    }
    log('info', 'Solicitado audio actividad [' + activityType + ']: ' + url);
    clearQueue();
    enqueue(url, 'actividad');
  }

  // ─── Public API: Stop ────────────────────────────────
  function stop() {
    clearQueue();
    log('debug', 'Audio detenido');
  }

  // ─── Public API: Volume ──────────────────────────────
  function setVolume(val) {
    CONFIG.volume = Math.max(0, Math.min(1, val / 100));
    if (currentAudio) currentAudio.volume = isMuted ? 0 : CONFIG.volume;
    log('debug', 'Volumen: ' + Math.round(CONFIG.volume * 100) + '%');
  }

  // ─── Public API: Mute ────────────────────────────────
  function toggleMute() {
    isMuted = !isMuted;
    if (currentAudio) currentAudio.volume = isMuted ? 0 : CONFIG.volume;
    var btn = document.getElementById('audioPlayBtn');
    if (btn) btn.innerHTML = '<span class="material-icons">' + (isMuted ? 'volume_off' : 'volume_up') + '</span>';
    log('info', isMuted ? 'Audio silenciado' : 'Audio activado');
  }

  // ─── Sound Effects (Web Audio API) ───────────────────
  function getCtx() {
    if (!ctx) {
      try { ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch(e) {}
    }
    if (ctx && ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  function tone(freq, dur, type, vol) {
    var c = getCtx();
    if (!c || isMuted) return;
    var o = c.createOscillator();
    var g = c.createGain();
    o.type = type || 'sine';
    o.frequency.value = freq;
    g.gain.setValueAtTime((vol || CONFIG.volume) * 0.3, c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + dur);
    o.connect(g);
    g.connect(c.destination);
    o.start();
    o.stop(c.currentTime + dur);
  }

  var sfx = {
    playClick:    function() { tone(800, 0.08); },
    playCorrect:  function() { tone(523, 0.15); setTimeout(function(){ tone(659, 0.15); }, 100); setTimeout(function(){ tone(784, 0.3); }, 200); },
    playIncorrect:function() { tone(330, 0.2, 'sawtooth', 0.2); setTimeout(function(){ tone(260, 0.3, 'sawtooth', 0.2); }, 150); },
    playStar:     function() { tone(880, 0.1); setTimeout(function(){ tone(1109, 0.15); }, 80); setTimeout(function(){ tone(1319, 0.2); }, 160); },
    playTransition:function(){ tone(440, 0.1, 'triangle', 0.15); },
    playComplete: function() { [523,587,659,784,880,1047].forEach(function(f,i){ setTimeout(function(){ tone(f, 0.2); }, i * 120); }); }
  };

  // ─── File Verification ───────────────────────────────
  function verifyFiles() {
    var allFiles = {};
    var key;
    for (key in NARRACION) allFiles['narracion/' + key] = NARRACION[key];
    for (key in ACTIVIDADES) allFiles['actividad/' + key] = ACTIVIDADES[key];

    var total = Object.keys(allFiles).length;
    var checked = 0;
    var found = 0;
    var missing = [];

    log('info', 'Verificando ' + total + ' archivos de audio...');

    for (key in allFiles) {
      (function(label, url) {
        fetch(url, { method: 'HEAD' })
          .then(function(resp) {
            checked++;
            if (resp.ok) {
              found++;
            } else {
              missing.push(url);
              log('warn', 'Archivo NO encontrado [' + resp.status + ']: ' + url);
            }
            if (checked >= total) printVerificationReport(found, missing, total);
          })
          .catch(function() {
            checked++;
            missing.push(url);
            log('warn', 'Error verificando: ' + url);
            if (checked >= total) printVerificationReport(found, missing, total);
          });
      })(key, allFiles[key]);
    }
  }

  function printVerificationReport(found, missing, total) {
    log('info', '────────────────────────────────────');
    log('info', 'REPORTE DE VERIFICACION DE AUDIOS');
    log('info', '────────────────────────────────────');
    log('info', 'Total archivos: ' + total);
    log('success', 'Encontrados: ' + found);
    if (missing.length > 0) {
      log('warn', 'Faltantes: ' + missing.length);
      missing.forEach(function(url) {
        log('warn', '  → ' + url);
      });
    }
    log('info', '────────────────────────────────────');
  }

  // ─── Preload All ─────────────────────────────────────
  function preloadAll() {
    var allUrls = [];
    var key;
    for (key in NARRACION) allUrls.push(NARRACION[key]);
    for (key in ACTIVIDADES) allUrls.push(ACTIVIDADES[key]);

    log('info', 'Precargando ' + allUrls.length + ' archivos de audio...');

    var loaded = 0;
    var errors = 0;

    allUrls.forEach(function(url, i) {
      setTimeout(function() {
        var audio = createAudioInstance(url);
        setCached(url, audio);

        audio.addEventListener('canplaythrough', function onLoad() {
          audio.removeEventListener('canplaythrough', onLoad);
          loaded++;
          log('success', 'Precargado [' + (loaded + errors) + '/' + allUrls.length + ']: ' + url);
          checkDone();
        });

        audio.addEventListener('error', function onError() {
          audio.removeEventListener('error', onError);
          errors++;
          log('warn', 'No se pudo precargar [' + (loaded + errors) + '/' + allUrls.length + ']: ' + url);
          checkDone();
        });

        function checkDone() {
          if (loaded + errors >= allUrls.length) {
            log('info', 'Precarga completada: ' + loaded + ' cargados, ' + errors + ' errores');
          }
        }
      }, i * CONFIG.preloadDelay);
    });
  }

  // ─── Initialization ──────────────────────────────────
  function init() {
    var slider = document.getElementById('audioVolumeSlider');
    if (slider) {
      CONFIG.volume = slider.value / 100;
      slider.addEventListener('input', function() {
        setVolume(parseInt(this.value));
      });
    }

    setupAutoplayDetection();
    verifyFiles();
    preloadAll();

    log('info', 'AudioManager inicializado');
  }

  // ─── Public Interface ────────────────────────────────
  return {
    init:           init,
    playNarracion:  playNarracion,
    playActividad:  playActividad,
    stop:           stop,
    setVolume:      setVolume,
    toggleMute:     toggleMute,
    clearQueue:     clearQueue,
    verifyFiles:    verifyFiles,
    playClick:      sfx.playClick,
    playCorrect:    sfx.playCorrect,
    playIncorrect:  sfx.playIncorrect,
    playStar:       sfx.playStar,
    playTransition: sfx.playTransition,
    playComplete:   sfx.playComplete,
    stopNarration:  stop
  };
})();
