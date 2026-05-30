/* ============================================
   SLIDE: Video - OVA Reciclaje
   ============================================ */

window.OVA = window.OVA || {};
OVA.slides = OVA.slides || {};

OVA.video = (function() {
  let isPlaying = false;
  let isMuted = false;
  let progress = 0;
  let duration = 180; // 3 minutes simulated
  let currentTime = 0;
  let interval = null;
  let subtitlesVisible = true;

  const subtitleTexts = [
    'El reciclaje es fundamental para cuidar nuestro planeta.',
    'Existen tres tipos principales de residuos: orgánicos, reciclables y no reciclables.',
    'Los residuos orgánicos se descomponen naturalmente y pueden convertirse en compost.',
    'Los materiales reciclables como el papel, plástico y vidrio pueden transformarse en nuevos productos.',
    'Los residuos no reciclables van al basurero general y debemos intentar reducirlos.',
    'Clasificar correctamente los residuos es el primer paso para cuidar el medio ambiente.',
    'Cada uno de nosotros puede hacer la diferencia reciclando todos los días.',
    'Recuerda: reduce, reutiliza y recicla. Las 3R del reciclaje.'
  ];

  function init() {
    setupControls();
  }

  function setupControls() {
    // Initial state handled in HTML
  }

  function play() {
    if (isPlaying) {
      pause();
      return;
    }

    isPlaying = true;
    const placeholder = document.getElementById('videoPlaceholder');
    const controls = document.getElementById('videoControls');
    const playBtn = document.getElementById('videoPlayBtn');
    const playPauseBtn = document.getElementById('videoPlayPauseBtn');
    const subtitles = document.getElementById('videoSubtitles');

    if (placeholder) {
      placeholder.innerHTML = `
        <div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg, #1a5c38, #2ecc71);position:relative;">
          <div style="text-align:center;color:white;">
            <div style="font-size:80px;margin-bottom:16px;">🎬</div>
            <div style="font-size:22px;font-weight:600;">El proceso de reciclaje</div>
            <div style="margin-top:8px;opacity:0.7;">Video educativo en reproducción...</div>
            <div style="margin-top:20px;display:flex;gap:16px;justify-content:center;">
              <div style="text-align:center;">
                <div style="font-size:40px;">🍂</div>
                <div style="font-size:12px;">Orgánico</div>
              </div>
              <div style="font-size:40px;display:flex;align-items:center;">→</div>
              <div style="text-align:center;">
                <div style="font-size:40px;">♻️</div>
                <div style="font-size:12px;">Reciclar</div>
              </div>
              <div style="font-size:40px;display:flex;align-items:center;">→</div>
              <div style="text-align:center;">
                <div style="font-size:40px;">🌱</div>
                <div style="font-size:12px;">Compost</div>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    if (controls) controls.style.display = 'flex';
    if (playBtn) playBtn.textContent = '⏸';
    if (playPauseBtn) playPauseBtn.textContent = '⏸';
    if (subtitles && subtitlesVisible) subtitles.style.display = 'block';

    // Simulate video playback
    interval = setInterval(() => {
      if (!isPlaying) return;
      
      currentTime += 1;
      progress = (currentTime / duration) * 100;
      
      updateProgress();
      updateSubtitles();
      
      if (currentTime >= duration) {
        pause();
        currentTime = 0;
        progress = 0;
        updateProgress();
        OVA.character.showMessage('¡Video completado! Ahora sabes más sobre reciclaje. 🎬', 3000);
      }
    }, 1000);
  }

  function pause() {
    isPlaying = false;
    clearInterval(interval);
    
    const playBtn = document.getElementById('videoPlayBtn');
    const playPauseBtn = document.getElementById('videoPlayPauseBtn');
    
    if (playBtn) playBtn.textContent = '▶';
    if (playPauseBtn) playPauseBtn.textContent = '▶';
  }

  function togglePlay() {
    play();
    OVA.audio.playClick();
  }

  function toggleMute() {
    isMuted = !isMuted;
    const btn = document.getElementById('videoMuteBtn');
    if (btn) btn.textContent = isMuted ? '🔇' : '🔊';
    OVA.audio.playClick();
  }

  function seek(e) {
    const bar = e.currentTarget;
    const rect = bar.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    currentTime = Math.floor(percentage * duration);
    progress = percentage * 100;
    updateProgress();
  }

  function updateProgress() {
    const fill = document.getElementById('videoProgressFill');
    const time = document.getElementById('videoTime');
    
    if (fill) fill.style.width = progress + '%';
    if (time) {
      const min = Math.floor(currentTime / 60);
      const sec = currentTime % 60;
      const totalMin = Math.floor(duration / 60);
      const totalSec = duration % 60;
      time.textContent = `${min}:${sec.toString().padStart(2, '0')} / ${totalMin}:${totalSec.toString().padStart(2, '0')}`;
    }
  }

  function updateSubtitles() {
    const subtitles = document.getElementById('videoSubtitles');
    if (!subtitles || !subtitlesVisible) return;

    const subtitleIndex = Math.floor(currentTime / (duration / subtitleTexts.length));
    const clampedIndex = Math.min(subtitleIndex, subtitleTexts.length - 1);
    subtitles.textContent = subtitleTexts[clampedIndex];
  }

  function showSubtitles(visible) {
    subtitlesVisible = visible;
    const subtitles = document.getElementById('videoSubtitles');
    if (subtitles) {
      subtitles.style.display = visible ? 'block' : 'none';
    }
  }

  function stop() {
    pause();
    currentTime = 0;
    progress = 0;
    updateProgress();
  }

  return {
    init,
    play,
    pause,
    togglePlay,
    toggleMute,
    seek,
    showSubtitles,
    stop
  };
})();
