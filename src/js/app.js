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

    console.log('OVA Reciclaje initialized');
  }

  function setupCloseHandlers() {
    document.addEventListener('click', (e) => {
      const panel = document.getElementById('accessibilityPanel');
      const toggle = document.getElementById('accessibilityToggle');
      if (panel && panel.classList.contains('open') && !panel.contains(e.target) && !toggle.contains(e.target)) {
        OVA.accessibility.closePanel();
      }
    });
  }

  function setupCharacterClick() {
    const guide = document.getElementById('characterGuide');
    if (guide) {
      guide.addEventListener('click', () => {
        if (OVA.character) OVA.character.toggleSpeech();
      });
    }
  }

  function setupModalOverlay() {
    const overlay = document.getElementById('modalOverlay');
    if (overlay) {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          if (OVA.activities) OVA.activities.close();
          else OVA.modal.close();
        }
      });
    }
  }

  return { init };
})();

OVA.modal = (function() {
  function open(content) {
    const overlay = document.getElementById('modalOverlay');
    const body = document.getElementById('modalBody');
    if (overlay && body) {
      body.innerHTML = content;
      overlay.classList.add('visible');
      document.body.style.overflow = 'hidden';
      OVA.audio.stopNarration();
    }
  }
  function close() {
    const overlay = document.getElementById('modalOverlay');
    if (overlay) overlay.classList.remove('visible');
    document.body.style.overflow = '';
  }
  return { open, close };
})();

document.addEventListener('DOMContentLoaded', OVA.app.init);
