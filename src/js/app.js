/* ============================================
   MAIN APP - OVA Reciclaje
   ============================================ */

window.OVA = window.OVA || {};

OVA.app = (function() {
  function init() {
    OVA.audio.init();
    OVA.accessibility.init();
    setupStartScreen();
    console.log('OVA Reciclaje initialized');
  }

  function setupStartScreen() {
    var startBtn = document.getElementById('startBtn');
    var startScreen = document.getElementById('startScreen');
    var ovaContainer = document.getElementById('ovaContainer');

    if (startBtn) {
      startBtn.addEventListener('click', function() {
        // Hide start screen
        startScreen.classList.add('hidden');
        setTimeout(function() { startScreen.style.display = 'none'; }, 600);

        // Show OVA
        ovaContainer.style.display = 'flex';

        // Play welcome audio
        OVA.audio.playNarracion(0);

        // Initialize OVA modules
        startOVA();
      });
    }

    // Create background elements for start screen
    createStartBg();
  }

  function createStartBg() {
    var container = document.getElementById('startBg');
    if (!container) return;
    var icons = ['recycling', 'eco', 'park', 'public', 'delete', 'compost', 'water_drop', 'forest', 'grass', 'bolt'];
    for (var i = 0; i < 18; i++) {
      var el = document.createElement('span');
      el.className = 'bg-element';
      el.innerHTML = '<span class="material-icons" style="font-size:' + (20 + Math.random() * 25) + 'px">' + icons[i % icons.length] + '</span>';
      el.style.left = Math.random() * 100 + '%';
      el.style.top = Math.random() * 100 + '%';
      el.style.animationDelay = (Math.random() * 5) + 's';
      el.style.animationDuration = (4 + Math.random() * 4) + 's';
      container.appendChild(el);
    }
  }

  function startOVA() {
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
    var g = document.getElementById('characterGuide');
    if (g) g.addEventListener('click', function() { OVA.character.toggleSpeech(); });
  }

  function setupModalOverlay() {
    var o = document.getElementById('modalOverlay');
    if (o) o.addEventListener('click', function(e) {
      if (e.target === o) { if (OVA.activities) OVA.activities.close(); else OVA.modal.close(); }
    });
  }

  return { init: init };
})();

OVA.modal = (function() {
  function open(c) {
    var o = document.getElementById('modalOverlay');
    var b = document.getElementById('modalBody');
    if (o && b) { b.innerHTML = c; o.classList.add('visible'); document.body.style.overflow = 'hidden'; OVA.audio.stop(); }
  }
  function close() {
    var o = document.getElementById('modalOverlay');
    if (o) o.classList.remove('visible');
    document.body.style.overflow = '';
  }
  return { open: open, close: close };
})();

document.addEventListener('DOMContentLoaded', OVA.app.init);
