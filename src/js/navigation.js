/* ============================================
   NAVIGATION SYSTEM - OVA Reciclaje
   ============================================ */

window.OVA = window.OVA || {};

OVA.navigation = (function() {
  let currentSlide = 0;
  const totalSlides = 9;
  let completedSlides = new Set();

  const slideNames = [
    'Bienvenida',
    'Objetivos',
    'Exploracion',
    'Datos Curiosos',
    'Actividades',
    'Video',
    'Clasificar',
    'Evaluacion',
    'Cierre'
  ];

  const slideIcons = [
    'home', 'track_changes', 'explore', 'lightbulb',
    'sports_esports', 'play_circle', 'category', 'quiz', 'emoji_events'
  ];

  function init() {
    buildSidebar();
    updateUI();
    setupKeyboardNav();
    setupHamburger();
    setupResize();
  }

  function setupResize() {
    function onResize() {
      const sidebar = document.getElementById('sidebar');
      const overlay = document.getElementById('sidebarOverlay');
      if (window.innerWidth > 768) {
        if (sidebar) sidebar.classList.remove('open');
        if (overlay) overlay.classList.remove('visible');
      }
    }
    window.addEventListener('resize', onResize);
    onResize();
  }

  function buildSidebar() {
    const nav = document.getElementById('sidebarNav');
    if (!nav) return;

    let html = '';
    for (let i = 0; i < totalSlides; i++) {
      const isActive = i === currentSlide;
      const isDone = completedSlides.has(i);
      let cls = 'sidebar-nav-item';
      if (isActive) cls += ' active';
      if (isDone) cls += ' completed';

      html += `<div class="${cls}" role="menuitem" tabindex="0" data-slide="${i}"
                    aria-label="Pantalla ${i + 1}: ${slideNames[i]}">
        <span class="nav-icon"><span class="material-icons" style="font-size:20px;color:white;">${isDone ? 'check_circle' : slideIcons[i]}</span></span>
        <span class="nav-text">${slideNames[i]}</span>
        <span class="nav-number">${isDone && !isActive ? '' : (i + 1)}</span>
      </div>`;
    }
    nav.innerHTML = html;

    nav.querySelectorAll('.sidebar-nav-item').forEach(item => {
      const handler = () => goTo(parseInt(item.dataset.slide));
      item.addEventListener('click', handler);
      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handler();
        }
      });
    });
  }

  function goTo(index) {
    if (index < 0 || index >= totalSlides) return;
    if (index === currentSlide) return;

    completedSlides.add(currentSlide);
    if (OVA.audio) OVA.audio.stopNarration();

    const currentEl = document.getElementById('slide-' + (currentSlide + 1));
    if (currentEl) currentEl.classList.remove('active');

    currentSlide = index;

    const newEl = document.getElementById('slide-' + (currentSlide + 1));
    if (newEl) newEl.classList.add('active');

    updateUI();
    if (OVA.audio) OVA.audio.playTransition();
    closeSidebar();
    window.scrollTo({ top: 0, behavior: 'instant' });

    setTimeout(() => triggerSlideNarration(), 500);
  }

  function updateUI() {
    buildSidebar();
    const progress = ((currentSlide + 1) / totalSlides) * 100;
    const bar = document.getElementById('progressBar');
    const text = document.getElementById('progressText');
    if (bar) bar.style.width = progress + '%';
    if (text) text.textContent = (currentSlide + 1) + ' / ' + totalSlides;
    updateCharacterSpeech();
  }

  function triggerSlideNarration() {
    const narrations = [
      'Bienvenido. En este OVA aprenderas a identificar los diferentes tipos de residuos.',
      'Estos son tus objetivos de aprendizaje. Observalos con atencion.',
      'Haz clic sobre cada contenedor para conocer que residuos deben depositarse en el.',
      'Estos datos te sorprenderan sobre el reciclaje.',
      'Elige una actividad para practicar. Hay muchas opciones!',
      'Observa el siguiente video y presta atencion a los ejemplos.',
      'Arrastra cada residuo al contenedor correcto. Mucha suerte!',
      'Responde las siguientes preguntas para comprobar tu aprendizaje.',
      'Felicidades! Ahora conoces la importancia del reciclaje.'
    ];
    if (narrations[currentSlide] && OVA.audio) {
      OVA.audio.narrate(narrations[currentSlide]);
    }
  }

  function updateCharacterSpeech() {
    const speeches = [
      'Hola! Soy Eco, tu guia de reciclaje.',
      'Estos son tus objetivos de aprendizaje. Son importantes!',
      'Explora cada contenedor haciendo clic. Aprenderas mucho!',
      'Estos datos son increibles!',
      'Elige una actividad para practicar!',
      'Presta atencion al video. Es muy educativo.',
      'Ahora te toca practicar! Arrastra los residuos.',
      'Demuestra lo que aprendiste con estas preguntas.',
      'Lo lograste! Eres un experto en reciclaje.'
    ];
    const speech = document.getElementById('characterSpeech');
    if (speech && speeches[currentSlide]) {
      speech.textContent = speeches[currentSlide];
    }
  }

  function setupKeyboardNav() {
    document.addEventListener('keydown', (e) => {
      if (e.target.closest('.accessibility-panel') || e.target.closest('.modal-overlay')) return;
      if (e.key === 'ArrowRight' && e.altKey) {
        e.preventDefault();
        goTo(Math.min(currentSlide + 1, totalSlides - 1));
      }
      if (e.key === 'ArrowLeft' && e.altKey) {
        e.preventDefault();
        goTo(Math.max(currentSlide - 1, 0));
      }
      if (e.key === 'Escape') {
        closeSidebar();
        if (OVA.accessibility) OVA.accessibility.closePanel();
        if (OVA.activities) OVA.activities.close();
        else if (OVA.modal) OVA.modal.close();
      }
    });
  }

  function setupHamburger() {
    const btn = document.getElementById('hamburgerBtn');
    const overlay = document.getElementById('sidebarOverlay');
    if (btn) btn.addEventListener('click', toggleSidebar);
    if (overlay) overlay.addEventListener('click', closeSidebar);
  }

  function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    if (sidebar) sidebar.classList.toggle('open');
    if (overlay) overlay.classList.toggle('visible');
  }

  function closeSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    if (sidebar) sidebar.classList.remove('open');
    if (overlay) overlay.classList.remove('visible');
  }

  function getCurrentSlide() { return currentSlide; }
  function getCompletedSlides() { return completedSlides; }
  function markCompleted(i) { completedSlides.add(i); buildSidebar(); }

  return {
    init,
    goTo,
    getCurrentSlide,
    getCompletedSlides,
    markCompleted,
    toggleSidebar,
    closeSidebar,
    get totalSlides() { return totalSlides; }
  };
})();
