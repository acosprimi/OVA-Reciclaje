/* ============================================
   DRAG AND DROP ENGINE - OVA Reciclaje
   ============================================ */

window.OVA = window.OVA || {};

OVA.dragdrop = (function() {
  let items = [];
  let draggedItem = null;
  let draggedElement = null;
  let correctCount = 0;
  let totalItems = 0;
  let isComplete = false;

  const wasteItems = [
    { id: 'apple-core', name: 'Manzana', icon: '🍎', category: 'organic' },
    { id: 'newspaper', name: 'Periódico', icon: '📰', category: 'recyclable' },
    { id: 'plastic-bottle', name: 'Botella', icon: '🥤', category: 'recyclable' },
    { id: 'tissue', name: 'Pañuelo', icon: '🧻', category: 'non-recyclable' },
    { id: 'banana-peel', name: 'Plátano', icon: '🍌', category: 'organic' },
    { id: 'glass-bottle', name: 'Vidrio', icon: '🍶', category: 'recyclable' },
    { id: 'sponge', name: 'Esponja', icon: '🧽', category: 'non-recyclable' },
    { id: 'leaves', name: 'Hojas', icon: '🍂', category: 'organic' },
    { id: 'can', name: 'Lata', icon: '🥫', category: 'recyclable' },
    { id: 'bandage', name: 'Apósito', icon: '🩹', category: 'non-recyclable' }
  ];

  function init() {
    items = [...wasteItems].sort(() => Math.random() - 0.5);
    correctCount = 0;
    totalItems = items.length;
    isComplete = false;
    renderItems();
    setupBins();
    updateCheckButton();
  }

  function renderItems() {
    const container = document.getElementById('dragItems');
    if (!container) return;

    container.innerHTML = '';
    items.forEach(item => {
      const el = createDragItem(item);
      container.appendChild(el);
    });
  }

  function createDragItem(item) {
    const el = document.createElement('div');
    el.className = 'drag-item';
    el.setAttribute('draggable', 'true');
    el.setAttribute('data-id', item.id);
    el.setAttribute('data-category', item.category);
    el.setAttribute('role', 'listitem');
    el.setAttribute('aria-label', `${item.name} - ${item.category}`);
    el.setAttribute('tabindex', '0');
    
    el.innerHTML = `
      <span class="item-icon">${item.icon}</span>
      <span class="item-name">${item.name}</span>
    `;

    // Desktop drag events
    el.addEventListener('dragstart', handleDragStart);
    el.addEventListener('dragend', handleDragEnd);

    // Touch events for mobile
    el.addEventListener('touchstart', handleTouchStart, { passive: false });
    el.addEventListener('touchmove', handleTouchMove, { passive: false });
    el.addEventListener('touchend', handleTouchEnd);

    // Keyboard support
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        selectWithKeyboard(item, el);
      }
    });

    return el;
  }

  function handleDragStart(e) {
    draggedItem = e.target.closest('.drag-item');
    if (!draggedItem) return;
    
    draggedItem.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', draggedItem.dataset.id);
    
    OVA.audio.playClick();
  }

  function handleDragEnd(e) {
    if (draggedItem) {
      draggedItem.classList.remove('dragging');
    }
    draggedItem = null;
    
    // Remove all drag-over states
    document.querySelectorAll('.drop-bin').forEach(bin => {
      bin.classList.remove('drag-over');
    });
  }

  function handleTouchStart(e) {
    draggedItem = e.target.closest('.drag-item');
    if (!draggedItem) return;
    
    draggedElement = draggedItem.cloneNode(true);
    draggedElement.style.position = 'fixed';
    draggedElement.style.zIndex = '9999';
    draggedElement.style.pointerEvents = 'none';
    draggedElement.style.opacity = '0.8';
    draggedElement.style.transform = 'scale(1.1)';
    document.body.appendChild(draggedElement);
    
    const touch = e.touches[0];
    updateDragPosition(touch.clientX, touch.clientY);
    
    OVA.audio.playClick();
  }

  function handleTouchMove(e) {
    if (!draggedElement) return;
    e.preventDefault();
    
    const touch = e.touches[0];
    updateDragPosition(touch.clientX, touch.clientY);
    
    // Highlight bin under touch
    const bin = getBinAtPoint(touch.clientX, touch.clientY);
    document.querySelectorAll('.drop-bin').forEach(b => b.classList.remove('drag-over'));
    if (bin) bin.classList.add('drag-over');
  }

  function handleTouchEnd(e) {
    if (!draggedItem || !draggedElement) return;
    
    const touch = e.changedTouches[0];
    const bin = getBinAtPoint(touch.clientX, touch.clientY);
    
    if (bin) {
      handleDrop(bin);
    }
    
    if (draggedElement && draggedElement.parentNode) {
      draggedElement.remove();
    }
    draggedElement = null;
    draggedItem = null;
    
    document.querySelectorAll('.drop-bin').forEach(b => b.classList.remove('drag-over'));
  }

  function updateDragPosition(x, y) {
    if (draggedElement) {
      draggedElement.style.left = (x - 40) + 'px';
      draggedElement.style.top = (y - 40) + 'px';
    }
  }

  function getBinAtPoint(x, y) {
    const bins = document.querySelectorAll('.drop-bin');
    for (const bin of bins) {
      const rect = bin.getBoundingClientRect();
      if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
        return bin;
      }
    }
    return null;
  }

  function setupBins() {
    const bins = document.querySelectorAll('.drop-bin');
    bins.forEach(bin => {
      bin.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        bin.classList.add('drag-over');
      });

      bin.addEventListener('dragleave', () => {
        bin.classList.remove('drag-over');
      });

      bin.addEventListener('drop', (e) => {
        e.preventDefault();
        bin.classList.remove('drag-over');
        handleDrop(bin);
      });
    });
  }

  function handleDrop(bin) {
    if (!draggedItem || isComplete) return;

    const itemId = draggedItem.dataset.id;
    const itemCategory = draggedItem.dataset.category;
    const binCategory = bin.dataset.bin;
    const item = items.find(i => i.id === itemId);

    if (!item) return;

    const isCorrect = itemCategory === binCategory;

    if (isCorrect) {
      // Correct placement
      bin.classList.add('correct');
      setTimeout(() => bin.classList.remove('correct'), 1000);

      // Add item to bin
      const binItems = bin.querySelector('.bin-items');
      const droppedEl = document.createElement('span');
      droppedEl.className = 'dropped-item';
      droppedEl.textContent = `${item.icon} ${item.name}`;
      binItems.appendChild(droppedEl);

      // Remove from drag area
      if (draggedItem.parentNode) {
        draggedItem.remove();
      }

      correctCount++;
      OVA.audio.playCorrect();
      OVA.character.showMessage('Excelente! ' + item.name + ' va en el contenedor correcto.', 2000);

      // Earn star at milestones
      if (correctCount === 3) OVA.rewards.earnStar(1);
      if (correctCount === 6) OVA.rewards.earnStar(2);
      if (correctCount === totalItems) {
        OVA.rewards.earnStar(3);
        completeActivity();
      }
    } else {
      // Incorrect placement
      bin.classList.add('incorrect');
      setTimeout(() => bin.classList.remove('incorrect'), 800);

      // Shake the item back
      draggedItem.style.animation = 'wiggle 0.5s ease';
      setTimeout(() => {
        if (draggedItem) draggedItem.style.animation = '';
      }, 500);

      OVA.audio.playIncorrect();
      OVA.character.showMessage('Intentalo de nuevo! ' + item.name + ' no va ahi.', 2500);
    }

    updateCheckButton();
  }

  function selectWithKeyboard(item, element) {
    // For keyboard users: show a selection UI
    const bins = document.querySelectorAll('.drop-bin');
    const binNames = ['Orgánico', 'Reciclable', 'No Reciclable'];
    
    // Simple keyboard: use 1, 2, 3 keys after selecting
    OVA.character.showMessage('Presiona 1 (Organico), 2 (Reciclable) o 3 (No Reciclable) para ' + item.name, 5000);
    
    draggedItem = element;
    
    const handler = (e) => {
      if (e.key === '1' || e.key === '2' || e.key === '3') {
        const binIndex = parseInt(e.key) - 1;
        const targetBin = bins[binIndex];
        if (targetBin) {
          handleDrop(targetBin);
        }
        document.removeEventListener('keydown', handler);
      }
      if (e.key === 'Escape') {
        draggedItem = null;
        document.removeEventListener('keydown', handler);
      }
    };
    
    document.addEventListener('keydown', handler);
  }

  function updateCheckButton() {
    const checkBtn = document.getElementById('checkDragDropBtn');
    const continueBtn = document.getElementById('continueFromDrag');
    
    if (correctCount >= totalItems) {
      if (checkBtn) checkBtn.style.display = 'none';
      if (continueBtn) continueBtn.style.display = 'inline-flex';
    }
  }

  function completeActivity() {
    isComplete = true;
    OVA.rewards.createConfetti();
    OVA.character.celebrate();
    OVA.rewards.addBadge('Clasificador', 'recycling');
    OVA.navigation.markCompleted(6);
    
    const continueBtn = document.getElementById('continueFromDrag');
    if (continueBtn) continueBtn.style.display = 'inline-flex';
  }

  function checkAll() {
    // Manual check button - just shows feedback
    if (correctCount >= totalItems) {
      completeActivity();
    } else {
      OVA.character.showMessage('Has clasificado ' + correctCount + ' de ' + totalItems + ' residuos. Sigue asi!', 3000);
    }
  }

  function reset() {
    isComplete = false;
    correctCount = 0;
    init();
  }

  return {
    init,
    checkAll,
    reset,
    get correctCount() { return correctCount; },
    get totalItems() { return totalItems; }
  };
})();
