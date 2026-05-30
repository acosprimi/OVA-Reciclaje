/* ============================================
   REWARD SYSTEM - OVA Reciclaje
   ============================================ */

window.OVA = window.OVA || {};

OVA.rewards = (function() {
  let totalStars = 0;
  let maxStars = 3;
  let quizScore = 0;
  let badges = [];

  function init() { loadProgress(); }

  function loadProgress() {
    try {
      const saved = localStorage.getItem('ova-rewards');
      if (saved) {
        const d = JSON.parse(saved);
        totalStars = d.totalStars || 0;
        quizScore = d.quizScore || 0;
        badges = d.badges || [];
      }
    } catch(e) {}
  }

  function saveProgress() {
    try {
      localStorage.setItem('ova-rewards', JSON.stringify({ totalStars, quizScore, badges }));
    } catch(e) {}
  }

  function earnStar(index) {
    if (index <= maxStars) {
      const star = document.getElementById('star-' + index);
      if (star && !star.classList.contains('earned')) {
        star.classList.add('earned');
        totalStars++;
        OVA.audio.playStar();
        saveProgress();
      }
    }
  }

  function resetStars() {
    for (let i = 1; i <= maxStars; i++) {
      const star = document.getElementById('star-' + i);
      if (star) star.classList.remove('earned');
    }
    totalStars = 0;
    saveProgress();
  }

  function setQuizScore(s) { quizScore = s; saveProgress(); }
  function getQuizScore() { return quizScore; }

  function addBadge(name, icon) {
    if (!badges.find(b => b.name === name)) {
      badges.push({ name, icon, date: Date.now() });
      saveProgress();
    }
  }

  function getBadges() { return badges; }

  function createConfetti() {
    const colors = ['#2ecc71', '#3498db', '#f1c40f', '#e74c3c', '#9b59b6', '#e67e22'];
    const container = document.createElement('div');
    container.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999;overflow:hidden;';
    document.body.appendChild(container);
    for (let i = 0; i < 50; i++) {
      const c = document.createElement('div');
      const color = colors[Math.floor(Math.random() * colors.length)];
      const left = Math.random() * 100;
      const delay = Math.random() * 2;
      const dur = 2 + Math.random() * 2;
      const size = 8 + Math.random() * 8;
      c.style.cssText = 'position:absolute;top:-20px;left:' + left + '%;width:' + size + 'px;height:' + size + 'px;background:' + color + ';border-radius:' + (Math.random() > 0.5 ? '50%' : '2px') + ';animation:confetti-fall ' + dur + 's ease-in ' + delay + 's forwards;';
      container.appendChild(c);
    }
    setTimeout(() => container.remove(), 5000);
  }

  function resetAll() {
    totalStars = 0;
    quizScore = 0;
    badges = [];
    resetStars();
    saveProgress();
  }

  return {
    init, earnStar, resetStars, setQuizScore, getQuizScore,
    addBadge, getBadges, createConfetti, resetAll,
    get totalStars() { return totalStars; }
  };
})();
