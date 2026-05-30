/* ============================================
   SLIDE: Welcome - OVA Reciclaje
   ============================================ */

window.OVA = window.OVA || {};
OVA.slides = OVA.slides || {};

OVA.slides.welcome = (function() {
  function init() {
    createBackgroundElements();
  }

  function createBackgroundElements() {
    const container = document.getElementById('welcomeBg');
    if (!container) return;

    const icons = ['recycling', 'eco', 'park', 'public', 'delete', 'compost', 'water_drop', 'forest', 'grass', 'bolt'];
    for (let i = 0; i < 18; i++) {
      const el = document.createElement('span');
      el.className = 'bg-element';
      el.innerHTML = '<span class="material-icons" style="font-size:' + (20 + Math.random() * 25) + 'px">' + icons[i % icons.length] + '</span>';
      el.style.left = Math.random() * 100 + '%';
      el.style.top = Math.random() * 100 + '%';
      el.style.animationDelay = (Math.random() * 5) + 's';
      el.style.animationDuration = (4 + Math.random() * 4) + 's';
      container.appendChild(el);
    }
  }

  return { init };
})();
