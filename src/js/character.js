/* ============================================
   CHARACTER GUIDE - OVA Reciclaje
   ============================================ */

window.OVA = window.OVA || {};

OVA.character = (function() {
  let speechVisible = false;
  let speechTimeout = null;

  function init() {
    setTimeout(() => {
      showMessage('Hola! Soy Eco, tu guia de reciclaje.', 5000);
    }, 1500);
  }

  function showSpeech() {
    const bubble = document.getElementById('characterSpeech');
    if (bubble) {
      bubble.classList.add('visible');
      speechVisible = true;
    }
  }

  function hideSpeech() {
    const bubble = document.getElementById('characterSpeech');
    if (bubble) {
      bubble.classList.remove('visible');
      speechVisible = false;
    }
  }

  function toggleSpeech() {
    if (speechVisible) {
      hideSpeech();
    } else {
      showSpeech();
      clearTimeout(speechTimeout);
      speechTimeout = setTimeout(hideSpeech, 6000);
    }
    OVA.audio.playClick();
  }

  function showMessage(text, duration) {
    const bubble = document.getElementById('characterSpeech');
    if (!bubble) return;
    bubble.textContent = text;
    showSpeech();
    clearTimeout(speechTimeout);
    speechTimeout = setTimeout(hideSpeech, duration || 4000);
  }

  function celebrate() {
    showMessage('Excelente trabajo!', 3000);
    OVA.audio.playStar();
  }

  function encourage() {
    showMessage('Tu puedes! Intentalo de nuevo.', 3000);
    OVA.audio.playIncorrect();
  }

  function congratulate() {
    showMessage('Felicidades! Eres un experto en reciclaje.', 5000);
    OVA.audio.playComplete();
  }

  return { init, showSpeech, hideSpeech, toggleSpeech, showMessage, celebrate, encourage, congratulate };
})();
