/* ============================================
   SLIDE: Closing - OVA Reciclaje
   ============================================ */

window.OVA = window.OVA || {};
OVA.slides = OVA.slides || {};

OVA.slides.closing = (function() {
  function init() {
    renderBadges();
  }

  function renderBadges() {
    const container = document.getElementById('finalBadges');
    if (!container) return;

    const earned = OVA.rewards.getBadges();
    const badgeDefs = [
      { name: 'Explorador', icon: 'explore', earned: true },
      { name: 'Clasificador', icon: 'recycling', earned: earned.some(b => b.name === 'Clasificador') },
      { name: 'Experto', icon: 'emoji_events', earned: earned.some(b => b.name === 'Experto') },
      { name: 'Eco-Heroe', icon: 'public', earned: OVA.rewards.totalStars >= 5 }
    ];

    container.innerHTML = badgeDefs.map(b => {
      const bg = b.earned
        ? 'background:linear-gradient(135deg, var(--color-accent-yellow), var(--color-accent-orange))'
        : 'background:rgba(0,0,0,0.1)';
      const icon = b.earned ? b.icon : 'lock';
      const color = b.earned ? 'color:white' : '';
      return '<div class="final-badge">' +
        '<div class="final-badge-icon" style="' + bg + '">' +
        '<span class="material-icons" style="font-size:36px;' + color + '">' + icon + '</span>' +
        '</div>' +
        '<span class="final-badge-label">' + b.name + '</span>' +
        '</div>';
    }).join('');
  }

  return { init };
})();
