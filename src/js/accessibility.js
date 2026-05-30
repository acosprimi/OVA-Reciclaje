/* ============================================
   ACCESSIBILITY SYSTEM - OVA Reciclaje
   ============================================ */

window.OVA = window.OVA || {};

OVA.accessibility = (function() {
  let fontSizeLevel = 2;
  const fontSizes = [12, 14, 16, 18, 20, 22, 24];
  let isDarkMode = false;
  let isHighContrast = false;
  let animationsPaused = false;
  let panelOpen = false;

  function init() {
    loadSettings();
    applyAllSettings();
  }

  function loadSettings() {
    try {
      const saved = localStorage.getItem('ova-a11y');
      if (saved) {
        const s = JSON.parse(saved);
        fontSizeLevel = s.fontSizeLevel !== undefined ? s.fontSizeLevel : 2;
        isDarkMode = s.isDarkMode || false;
        isHighContrast = s.isHighContrast || false;
        animationsPaused = s.animationsPaused || false;
      }
    } catch(e) {}
  }

  function saveSettings() {
    try {
      localStorage.setItem('ova-a11y', JSON.stringify({
        fontSizeLevel, isDarkMode, isHighContrast, animationsPaused
      }));
    } catch(e) {}
  }

  function applyAllSettings() {
    var size = fontSizes[fontSizeLevel];
    document.documentElement.style.setProperty('--font-size-base', size + 'px');
    document.documentElement.style.setProperty('--font-size-sm', (size - 2) + 'px');
    document.documentElement.style.setProperty('--font-size-lg', (size + 2) + 'px');
    document.documentElement.style.setProperty('--font-size-xl', (size + 6) + 'px');
    document.documentElement.style.setProperty('--font-size-2xl', (size + 12) + 'px');
    document.documentElement.style.setProperty('--font-size-3xl', (size + 20) + 'px');
    document.documentElement.style.setProperty('--font-size-4xl', (size + 32) + 'px');

    document.body.classList.toggle('dark-mode', isDarkMode);
    document.body.classList.toggle('high-contrast', isHighContrast);
    document.body.classList.toggle('animations-paused', animationsPaused);

    syncToggle('darkModeToggle', isDarkMode);
    syncToggle('highContrastToggle', isHighContrast);
    syncToggle('pauseAnimationsToggle', animationsPaused);

    var fv = document.getElementById('fontSizeValue');
    if (fv) fv.textContent = Math.round((size / 16) * 100) + '%';
  }

  function syncToggle(id, state) {
    var el = document.getElementById(id);
    if (el) el.checked = state;
  }

  function togglePanel() {
    panelOpen = !panelOpen;
    var panel = document.getElementById('accessibilityPanel');
    if (panel) panel.classList.toggle('open', panelOpen);
  }

  function closePanel() {
    panelOpen = false;
    var panel = document.getElementById('accessibilityPanel');
    if (panel) panel.classList.remove('open');
  }

  function toggleDarkMode() {
    isDarkMode = !isDarkMode;
    document.body.classList.toggle('dark-mode', isDarkMode);
    syncToggle('darkModeToggle', isDarkMode);
    saveSettings();
    if (OVA.audio) OVA.audio.playClick();
  }

  function toggleContrast() {
    isHighContrast = !isHighContrast;
    document.body.classList.toggle('high-contrast', isHighContrast);
    syncToggle('highContrastToggle', isHighContrast);
    saveSettings();
    if (OVA.audio) OVA.audio.playClick();
  }

  function toggleAnimations() {
    animationsPaused = !animationsPaused;
    document.body.classList.toggle('animations-paused', animationsPaused);
    syncToggle('pauseAnimationsToggle', animationsPaused);
    saveSettings();
    if (OVA.audio) OVA.audio.playClick();
  }

  function changeFontSize(dir) {
    fontSizeLevel = Math.max(0, Math.min(fontSizes.length - 1, fontSizeLevel + dir));
    applyAllSettings();
    saveSettings();
    if (OVA.audio) OVA.audio.playClick();
  }

  return {
    init, togglePanel, closePanel,
    toggleDarkMode, toggleContrast, toggleAnimations, changeFontSize
  };
})();
