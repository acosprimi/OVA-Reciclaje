/* ============================================
   MAIN APP - OVA Reciclaje
   ============================================ */

window.OVA = window.OVA || {};

OVA.app = (function() {
  function init() {
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
    setTimeout(function() { OVA.audio.playNarracion(0); }, 1000);
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
