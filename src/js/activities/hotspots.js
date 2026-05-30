/* ============================================
   HOTSPOTS ENGINE - OVA Reciclaje
   ============================================ */

window.OVA = window.OVA || {};

OVA.hotspots = (function() {
  let activeCard = null;
  let toastEl = null;

  function init() {
    setupBinCards();
    createToast();
  }

  function createToast() {
    if (toastEl) return;
    toastEl = document.createElement('div');
    toastEl.id = 'hotspotToast';
    toastEl.style.cssText = 'position:fixed;bottom:80px;left:50%;transform:translateX(-50%) translateY(20px);background:var(--bg-secondary);color:var(--text-primary);padding:20px 24px;border-radius:16px;box-shadow:0 8px 32px rgba(0,0,0,0.25);max-width:90vw;width:500px;z-index:999;opacity:0;visibility:hidden;transition:all 0.3s ease;text-align:left;border-left:4px solid var(--color-primary);';
    document.body.appendChild(toastEl);
  }

  function setupBinCards() {
    const cards = document.querySelectorAll('.bin-card');
    cards.forEach(card => {
      card.addEventListener('click', () => toggleCardInfo(card));
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleCardInfo(card);
        }
      });
    });
  }

  function toggleCardInfo(card) {
    const binType = card.dataset.bin;

    if (activeCard === card) {
      hideToast();
      activeCard = null;
      return;
    }

    activeCard = card;
    const info = getBinInfo(binType);
    showToast(info);
    OVA.audio.playClick();
    OVA.audio.narrate(info.title + '. ' + info.content);
  }

  function getBinInfo(type) {
    const info = {
      organic: {
        title: 'Contenedor Organico',
        content: 'Aqui van todos los residuos que se descomponen naturalmente: restos de comida, hojas, cascaras, posos de cafe.',
        tip: 'Consejo: Puedes crear compost con estos residuos para nutrir tus plantas.',
        items: 'Cascara de fruta, restos de verduras, hojas secas, posos de cafe, cascara de huevo, restos de pan.'
      },
      recyclable: {
        title: 'Contenedor Reciclable',
        content: 'Materiales que pueden transformarse en nuevos productos: papel, carton, plastico, vidrio, metal.',
        tip: 'Consejo: Limpia los envases antes de depositarlos para facilitar el reciclaje.',
        items: 'Papel, carton, botellas de vidrio, envases de plastico, latas de aluminio, cajas de carton.'
      },
      'non-recyclable': {
        title: 'Contenedor No Reciclable',
        content: 'Residuos que no pueden reciclarse ni compostarse: panuelos, esponjas, objetos contaminados.',
        tip: 'Consejo: Intenta reducir estos residuos eligiendo productos mas sostenibles.',
        items: 'Panuelos, esponjas, apositos medicos, residuos mezclados, panales.'
      }
    };
    return info[type] || info.organic;
  }

  function showToast(info) {
    if (!toastEl) createToast();
    toastEl.innerHTML = '<div style="display:flex;align-items:center;gap:8px;margin-bottom:8px"><span class="material-icons" style="color:var(--color-primary);font-size:24px">info</span><strong style="font-size:17px">' + info.title + '</strong></div><p style="margin:0 0 8px;font-size:14px;line-height:1.5;color:var(--text-secondary)">' + info.content + '</p><p style="margin:0 0 8px;font-size:13px;line-height:1.5"><strong>Contenido:</strong> ' + info.items + '</p><p style="margin:0;font-size:13px;font-style:italic;color:var(--color-primary)">' + info.tip + '</p><button onclick="OVA.hotspots.hideToast()" style="margin-top:12px;padding:6px 16px;border:1px solid var(--color-primary);background:transparent;color:var(--color-primary);border-radius:20px;cursor:pointer;font-size:13px;font-family:inherit">Cerrar</button>';
    toastEl.style.opacity = '1';
    toastEl.style.visibility = 'visible';
    toastEl.style.transform = 'translateX(-50%) translateY(0)';
  }

  function hideToast() {
    if (!toastEl) return;
    toastEl.style.opacity = '0';
    toastEl.style.visibility = 'hidden';
    toastEl.style.transform = 'translateX(-50%) translateY(20px)';
  }

  function closeAll() {
    hideToast();
    activeCard = null;
  }

  return { init, hideToast, closeAll };
})();
