/* ============================================
   SLIDE: Objectives - OVA Reciclaje
   ============================================ */

window.OVA = window.OVA || {};
OVA.slides = OVA.slides || {};

OVA.slides.objectives = (function() {
  function init() {
    setupHoverEffects();
  }

  function setupHoverEffects() {
    const items = document.querySelectorAll('.objective-item');
    items.forEach(item => {
      item.addEventListener('mouseenter', () => {
        OVA.audio.playClick();
      });
    });
  }

  return { init };
})();
