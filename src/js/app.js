/* ============================================
   MAIN APP - OVA Reciclaje
   ============================================ */

window.OVA = window.OVA || {};

OVA.app = (function() {

  function init() {
    showLoading();
    loadAssets(function() {
      hideLoading();
      startApp();
    });
  }

  function showLoading() {
    var el = document.getElementById('loadingScreen');
    if (el) { el.style.display = 'flex'; el.classList.remove('hidden'); }
  }

  function hideLoading() {
    var el = document.getElementById('loadingScreen');
    if (el) {
      el.classList.add('hidden');
      setTimeout(function() { el.style.display = 'none'; }, 600);
    }
  }

  function setProgress(pct) {
    var bar = document.getElementById('loadingBar');
    var text = document.getElementById('loadingPercent');
    if (bar) bar.style.width = pct + '%';
    if (text) text.textContent = Math.round(pct) + '%';
  }

  function loadAssets(done) {
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

    var existentes = [];
    var revisados = 0;

    function onLoadComplete() {
      if (existentes.length === 0) {
        setProgress(100);
        done();
        return;
      }
      var cargados = 0;
      existentes.forEach(function(file) {
        var a = new Audio();
        a.preload = 'auto';
        a.oncanplaythrough = function() {
          cargados++;
          setProgress((cargados / existentes.length) * 100);
          if (cargados >= existentes.length) done();
        };
        a.onerror = function() {
          cargados++;
          setProgress((cargados / existentes.length) * 100);
          if (cargados >= existentes.length) done();
        };
        a.src = file;
      });
    }

    files.forEach(function(file) {
      fetch(file, { method: 'HEAD' })
        .then(function(r) {
          if (r.ok) existentes.push(file);
        })
        .catch(function() {})
        .finally(function() {
          revisados++;
          setProgress((revisados / files.length) * 30);
          if (revisados >= files.length) onLoadComplete();
        });
    });

    setTimeout(function() { done(); }, 8000);
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
