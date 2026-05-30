/* ============================================
   MAIN APP - OVA Reciclaje
   ============================================ */

window.OVA = window.OVA || {};

OVA.app = (function() {
  var totalAssets = 0;
  var loadedAssets = 0;

  function init() {
    showLoading();
    preloadAllAssets(function() {
      hideLoading();
      startApp();
    });
  }

  function showLoading() {
    var el = document.getElementById('loadingScreen');
    if (el) el.style.display = 'flex';
  }

  function hideLoading() {
    var el = document.getElementById('loadingScreen');
    if (el) el.classList.add('hidden');
    setTimeout(function() {
      if (el) el.style.display = 'none';
    }, 600);
  }

  function updateProgress(pct) {
    var bar = document.getElementById('loadingBar');
    var text = document.getElementById('loadingPercent');
    if (bar) bar.style.width = pct + '%';
    if (text) text.textContent = Math.round(pct) + '%';
  }

  function preloadAllAssets(callback) {
    var files = [
      'src/assets/audio/narracion/bienvenida.mp3',
      'src/assets/audio/narracion/objetivos.mp3',
      'src/assets/audio/narracion/exploracion.mp3',
      'src/assets/audio/narracion/datoscuriosos.mp3',
      'src/assets/audio/narracion/actividades.mp3',
      'src/assets/audio/narracion/video.mp3',
      'src/assets/audio/narracion/clasificar.mp3',
      'src/assets/audio/narracion/evaluacion.mp3',
      'src/assets/audio/narracion/cierre.mp3',
      'src/assets/audio/actividades/detective.mp3',
      'src/assets/audio/actividades/hotspots.mp3',
      'src/assets/audio/actividades/ordenar.mp3',
      'src/assets/audio/actividades/contrarreloj.mp3',
      'src/assets/audio/actividades/ruleta.mp3',
      'src/assets/audio/actividades/puzzle.mp3',
      'src/assets/audio/actividades/casa.mp3',
      'src/assets/audio/actividades/verdaderofalso.mp3',
      'src/assets/audio/actividades/memorama.mp3',
      'src/assets/audio/actividades/camion.mp3',
      'src/assets/audio/actividades/antesdespues.mp3',
      'src/assets/audio/actividades/personalizar.mp3',
      'src/assets/audio/actividades/personaje.mp3',
      'src/assets/audio/actividades/mision.mp3'
    ];

    totalAssets = files.length;
    loadedAssets = 0;
    var existingFiles = [];

    // First pass: check which files exist using fetch
    var checked = 0;
    files.forEach(function(file) {
      fetch(file, { method: 'HEAD' })
        .then(function(resp) {
          if (resp.ok) existingFiles.push(file);
          checked++;
          if (checked >= files.length) startPreload();
        })
        .catch(function() {
          checked++;
          if (checked >= files.length) startPreload();
        });
    });

    function startPreload() {
      totalAssets = existingFiles.length;
      loadedAssets = 0;

      if (totalAssets === 0) {
        updateProgress(100);
        callback();
        return;
      }

      existingFiles.forEach(function(file) {
        var audio = new Audio();
        audio.preload = 'auto';

        audio.oncanplaythrough = function() {
          loadedAssets++;
          updateProgress((loadedAssets / totalAssets) * 100);
          if (loadedAssets >= totalAssets) callback();
        };

        audio.onerror = function() {
          loadedAssets++;
          updateProgress((loadedAssets / totalAssets) * 100);
          if (loadedAssets >= totalAssets) callback();
        };

        audio.src = file;
      });
    }

    // Safety timeout: max 10 seconds
    setTimeout(function() {
      if (loadedAssets < totalAssets) callback();
    }, 10000);
  }

  function startApp() {
    OVA.audio.init();
    OVA.accessibility.init();
    OVA.rewards.init();
    OVA.navigation.init();
    OVA.character.init();
    OVA.slides.welcome.init();
    OVA.slides.exploration.init();
    OVA.slides.dragdrop.init();
    OVA.slides.quiz.init();
    OVA.slides.closing.init();
    setupCloseHandlers();
    setupCharacterClick();
    setupModalOverlay();

    // Play welcome narration after a short delay
    setTimeout(function() {
      if (OVA.audio && OVA.audio.playNarracion) OVA.audio.playNarracion(0);
    }, 500);

    console.log('OVA Reciclaje initialized');
  }

  function setupCloseHandlers() {
    document.addEventListener('click', function(e) {
      var panel = document.getElementById('accessibilityPanel');
      var toggle = document.getElementById('accessibilityToggle');
      if (panel && panel.classList.contains('open') && !panel.contains(e.target) && !toggle.contains(e.target)) {
        OVA.accessibility.closePanel();
      }
    });
  }

  function setupCharacterClick() {
    var guide = document.getElementById('characterGuide');
    if (guide) {
      guide.addEventListener('click', function() {
        if (OVA.character) OVA.character.toggleSpeech();
      });
    }
  }

  function setupModalOverlay() {
    var overlay = document.getElementById('modalOverlay');
    if (overlay) {
      overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
          if (OVA.activities) OVA.activities.close();
          else OVA.modal.close();
        }
      });
    }
  }

  return { init: init };
})();

OVA.modal = (function() {
  function open(content) {
    var overlay = document.getElementById('modalOverlay');
    var body = document.getElementById('modalBody');
    if (overlay && body) {
      body.innerHTML = content;
      overlay.classList.add('visible');
      document.body.style.overflow = 'hidden';
      OVA.audio.stop();
    }
  }
  function close() {
    var overlay = document.getElementById('modalOverlay');
    if (overlay) overlay.classList.remove('visible');
    document.body.style.overflow = '';
  }
  return { open: open, close: close };
})();

document.addEventListener('DOMContentLoaded', OVA.app.init);
