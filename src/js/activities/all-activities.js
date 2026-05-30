/* ============================================
   ALL ACTIVITIES - OVA Reciclaje
   ============================================ */

window.OVA = window.OVA || {};
if (!OVA.activities) OVA.activities = {};

/* ---- ACTIVITY LAUNCHER ---- */
OVA.activities.launch = function(type) {
  try {
    var overlay = document.getElementById('modalOverlay');
    if (!overlay) return;
    overlay.classList.add('visible');
    document.body.style.overflow = 'hidden';
    var fn = OVA.activities['act_' + type];
    if (typeof fn === 'function') {
      fn();
    }
    if (OVA.audio && OVA.audio.playActividad) {
      OVA.audio.playActividad(type);
    }
  } catch(e) {
    console.error('Activity error:', e);
  }
};

OVA.activities.close = function() {
  try {
    var overlay = document.getElementById('modalOverlay');
    if (overlay) overlay.classList.remove('visible');
    document.body.style.overflow = '';
    if (OVA.audio && OVA.audio.stopNarration) OVA.audio.stopNarration();
  } catch(e) {}
};

OVA.activities.showResult = function(body, title, msg, score, total, actType) {
  if (!body) return;
  var pct = total ? Math.round((score / total) * 100) : 0;
  var stars = pct >= 80 ? 3 : pct >= 50 ? 2 : pct > 0 ? 1 : 0;
  var starsHtml = '';
  for (var i = 0; i < 3; i++) {
    starsHtml += '<span class="material-icons" style="font-size:36px;color:' + (i < stars ? 'var(--color-accent-yellow)' : '#ccc') + '">star</span>';
  }
  var retryBtn = actType ? '<button class="btn btn-primary" style="margin-top:16px" onclick="OVA.activities.close();setTimeout(function(){OVA.activities.launch(\'' + actType + '\')},300)"><span class="material-icons">refresh</span> Reintentar</button>' : '';
  body.innerHTML = '<div class="activity-score"><h3>' + title + '</h3><p style="margin:12px 0">' + msg + '</p><p style="font-size:32px;font-weight:800;color:var(--color-primary)">' + score + (total !== undefined ? '/' + total : '') + '</p><div style="margin:12px 0">' + starsHtml + '</div>' + retryBtn + '</div><div class="activity-footer"><button class="btn btn-secondary" onclick="OVA.activities.close()"><span class="material-icons">close</span> Cerrar</button></div>';
  if (stars >= 2 && OVA.rewards) { OVA.rewards.createConfetti(); }
  if (OVA.audio && OVA.audio.playComplete) OVA.audio.playComplete();
};

/* ---- 1. DETECTIVE DEL RECICLAJE ---- */
OVA.activities.act_detective = function() {
  var body = document.getElementById('modalBody');
  var items = [
    { id: 'bottle', name: 'Botella de plastico', icon: '🥤', shouldBin: 'recyclable', feedback: 'La botella de plastico es reciclable. Debe ir al contenedor azul.' },
    { id: 'banana', name: 'Cascara de banana', icon: '🍌', shouldBin: 'organic', feedback: 'La cascara de banana es organica. Va al contenedor marron.' },
    { id: 'newspaper', name: 'Periodico viejo', icon: '📰', shouldBin: 'recyclable', feedback: 'El periodico es reciclable. Va al contenedor azul.' },
    { id: 'tissue', name: 'Panuelo usado', icon: '🧻', shouldBin: 'non-recyclable', feedback: 'El panuelo no es reciclable. Va al basurero general.' },
    { id: 'can', name: 'Lata de gaseosa', icon: '🥫', shouldBin: 'recyclable', feedback: 'La lata es reciclable. Va al contenedor azul.' },
    { id: 'leaves', name: 'Hojas secas', icon: '🍂', shouldBin: 'organic', feedback: 'Las hojas son organicas. Van al contenedor marron.' }
  ];
  var found = 0;
  var total = items.length;

  function renderScene() {
    var html = '<div class="activity-header"><div class="activity-title"><span class="material-icons" style="color:var(--color-accent-orange);vertical-align:middle">search</span> Detective del Reciclaje</div><div class="activity-subtitle">Esta cocina esta desordenada. Haz clic en los residuos que estan mal ubicados para corregirlos.</div><p style="color:var(--text-secondary);font-size:13px">Encontrados: ' + found + ' / ' + total + '</p></div>';

    html += '<div style="position:relative;width:100%;max-width:600px;margin:0 auto;border-radius:16px;overflow:hidden;border:3px solid rgba(0,0,0,0.1)">';
    // Room background
    html += '<div style="background:linear-gradient(180deg,#f5e6d3 0%,#f5e6d3 55%,#8B7355 55%,#8B7355 100%);min-height:320px;position:relative;padding:20px">';
    // Wall decorations
    html += '<div style="position:absolute;top:10px;left:20px;width:60px;height:45px;border:3px solid #8B4513;border-radius:4px;background:rgba(135,206,235,0.3)"><span class="material-icons" style="font-size:20px;color:#87CEEB;position:absolute;top:8px;left:14px">wb_sunny</span></div>';
    html += '<div style="position:absolute;top:10px;right:20px;width:80px;height:12px;background:#8B4513;border-radius:2px"></div>';
    // Counter
    html += '<div style="position:absolute;bottom:45%;left:0;right:0;height:12px;background:#A0522D;border-top:3px solid #8B4513"></div>';
    html += '<div style="position:absolute;bottom:0;left:0;width:40%;height:45%;background:#DEB887;border:2px solid #A0522D;border-radius:0 8px 0 0">';
    html += '<div style="position:absolute;top:8px;left:50%;transform:translateX(-50%);font-size:11px;color:#8B4513;font-weight:600">Cocina</div>';
    // Trash can
    html += '<div style="position:absolute;bottom:10px;right:10px;width:40px;height:50px;background:#757575;border-radius:0 0 8px 8px;border:2px solid #616161"><span class="material-icons" style="font-size:18px;color:white;position:absolute;top:8px;left:8px">delete</span></div>';
    html += '</div>';
    // Items on scene
    items.forEach(function(it, i) {
      var positions = [
        { bottom: '48%', left: '15%' },
        { bottom: '48%', left: '55%' },
        { bottom: '48%', right: '15%' },
        { bottom: '25%', left: '12%' },
        { bottom: '25%', left: '50%' },
        { bottom: '25%', right: '12%' }
      ];
      var p = positions[i];
      var style = 'position:absolute;font-size:32px;cursor:pointer;transition:all 0.2s;z-index:5;';
      if (p.bottom) style += 'bottom:' + p.bottom + ';';
      if (p.left) style += 'left:' + p.left + ';';
      if (p.right) style += 'right:' + p.right + ';';
      html += '<div class="detective-scene-item" data-idx="' + i + '" style="' + style + '" onclick="OVA.activities._detectiveClick(' + i + ')" title="' + it.name + '">' + it.icon + '<div style="position:absolute;top:-8px;right:-4px;width:10px;height:10px;background:var(--color-accent-yellow);border-radius:50%;border:1px solid white;animation:pulse 1.5s ease infinite"></div></div>';
    });
    html += '</div></div>';

    // Bin reference
    html += '<div style="display:flex;gap:12px;justify-content:center;margin-top:16px;flex-wrap:wrap">';
    html += '<div style="display:flex;align-items:center;gap:4px;font-size:12px"><span style="width:14px;height:14px;border-radius:3px;background:#8B4513;display:inline-block"></span> Organico</div>';
    html += '<div style="display:flex;align-items:center;gap:4px;font-size:12px"><span style="width:14px;height:14px;border-radius:3px;background:#2196F3;display:inline-block"></span> Reciclable</div>';
    html += '<div style="display:flex;align-items:center;gap:4px;font-size:12px"><span style="width:14px;height:14px;border-radius:3px;background:#757575;display:inline-block"></span> No Reciclable</div>';
    html += '</div>';

    html += '<div id="detectiveFeedback" style="margin-top:12px;text-align:center;min-height:40px"></div>';
    body.innerHTML = html;
  }

  OVA.activities._detectiveClick = function(idx) {
    var el = document.querySelector('.detective-scene-item[data-idx="' + idx + '"]');
    if (!el || el.dataset.found === '1') return;
    var it = items[idx];
    el.dataset.found = '1';
    el.style.opacity = '0.4';
    el.style.transform = 'scale(0.7)';
    el.style.pointerEvents = 'none';
    found++;
    var fb = document.getElementById('detectiveFeedback');
    OVA.audio.playCorrect();
    fb.innerHTML = '<div class="quiz-feedback correct"><span class="material-icons" style="vertical-align:middle">check_circle</span> ' + it.feedback + '</div>';
    setTimeout(function() { fb.innerHTML = ''; }, 2500);
    if (found >= total) {
      setTimeout(function() {
        OVA.activities.showResult(document.getElementById('modalBody'), 'Detective Completado!', 'Encontraste todos los residuos mal ubicados. Eres un verdadero detective del reciclaje.', found, total, 'detective');
      }, 1200);
    }
  };

  renderScene();
};

/* ---- 2. HOTSPOTS EDUCATIVOS ---- */
OVA.activities.act_hotspots = function() {
  var body = document.getElementById('modalBody');
  var bins = [
    { name: 'Organico', icon: 'compost', color: '#8B4513', items: ['Cascara de fruta','Restos de verduras','Hojas secas','Posos de cafe'], tip: 'Se descomponen naturalmente. Sirven para hacer compost.' },
    { name: 'Reciclable', icon: 'recycling', color: '#2196F3', items: ['Papel','Plastico','Vidrio','Metal'], tip: 'Se pueden transformar en nuevos productos. Limpialos antes de reciclar.' },
    { name: 'No Reciclable', icon: 'delete', color: '#757575', items: ['Panuelos','Esponjas','Apositos','Mezclados'], tip: 'No pueden reciclarse ni compostarse. Van al basurero general.' }
  ];
  var html = '<div class="activity-header"><div class="activity-title"><span class="material-icons" style="color:var(--color-secondary);vertical-align:middle">touch_app</span> Hotspots Educativos</div><div class="activity-subtitle">Toca cada contenedor para descubrir su informacion.</div></div><div class="exploration-grid" style="margin-top:16px">';
  bins.forEach(function(b, i) {
    html += '<div class="bin-card" onclick="OVA.activities._hotspotClick(' + i + ')" style="cursor:pointer"><span class="bin-card-icon"><span class="material-icons" style="font-size:56px;color:' + b.color + '">' + b.icon + '</span></span><div class="bin-card-title" style="color:' + b.color + '">' + b.name + '</div><div class="bin-card-items" style="margin-top:8px">';
    b.items.forEach(function(it) { html += '<span class="bin-card-item">' + it + '</span>'; });
    html += '</div></div>';
  });
  html += '</div><div id="hotspotInfo" style="margin-top:16px;min-height:80px"></div><div class="activity-footer"><button class="btn btn-secondary" onclick="OVA.activities.close()"><span class="material-icons">close</span> Cerrar</button></div>';
  body.innerHTML = html;
  OVA.activities._hotspotData = { bins: bins, clicked: [] };
    OVA.audio.playClick();
};

OVA.activities._hotspotClick = function(i) {
  var b = OVA.activities._hotspotData.bins[i];
  var info = document.getElementById('hotspotInfo');
  info.innerHTML = '<div class="quiz-feedback correct" style="text-align:left"><strong>' + b.name + ':</strong> ' + b.tip + '</div>';
  OVA.audio.playClick();
    OVA.audio.playClick();
};

/* ---- 3. QUE SUCEDE DESPUES (Ordering) ---- */
OVA.activities.act_ordering = function() {
  var body = document.getElementById('modalBody');
  var steps = [
    { id: 0, text: 'Depositar la botella en el contenedor azul', icon: 'delete' },
    { id: 1, text: 'El camion recolecta los residuos', icon: 'local_shipping' },
    { id: 2, text: 'Transporte a la planta de reciclaje', icon: 'factory' },
    { id: 3, text: 'Separacion y limpieza de materiales', icon: 'filter_list' },
    { id: 4, text: 'Procesamiento y transformacion', icon: 'autorenew' },
    { id: 5, text: 'Nuevo producto fabricado con material reciclado', icon: 'inventory_2' }
  ];
  var shuffled = steps.slice().sort(function() { return Math.random() - 0.5; });
  var html = '<div class="activity-header"><div class="activity-title"><span class="material-icons" style="color:var(--color-accent-purple);vertical-align:middle">sort</span> Que Sucede Despues?</div><div class="activity-subtitle">Ordena los pasos del proceso de reciclaje. Arrastra para reordenar.</div></div><div class="ordering-list" id="orderingList">';
  shuffled.forEach(function(s, i) {
    html += '<div class="ordering-item" draggable="true" data-id="' + s.id + '" data-pos="' + i + '"><span class="order-num">' + (i + 1) + '</span><span class="material-icons" style="color:var(--color-secondary)">' + s.icon + '</span><span>' + s.text + '</span></div>';
  });
  html += '</div><div class="activity-footer"><button class="btn btn-secondary" onclick="OVA.activities.close()"><span class="material-icons">close</span> Cerrar</button><button class="btn btn-primary" onclick="OVA.activities._orderingCheck()"><span class="material-icons">check</span> Verificar</button></div>';
  body.innerHTML = html;
  OVA.activities._orderingSetup();
};

OVA.activities._orderingSetup = function() {
  var list = document.getElementById('orderingList');
  if (!list) return;
  var items = list.querySelectorAll('.ordering-item');
  var dragItem = null;
  items.forEach(function(item) {
    item.addEventListener('dragstart', function(e) {
      dragItem = item;
      item.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
    });
    item.addEventListener('dragend', function() {
      item.classList.remove('dragging');
      dragItem = null;
      list.querySelectorAll('.ordering-item').forEach(function(it, i) {
        it.querySelector('.order-num').textContent = i + 1;
      });
    });
    item.addEventListener('dragover', function(e) {
      e.preventDefault();
      if (dragItem && dragItem !== item) {
        var rect = item.getBoundingClientRect();
        var mid = rect.top + rect.height / 2;
        if (e.clientY < mid) {
          list.insertBefore(dragItem, item);
        } else {
          list.insertBefore(dragItem, item.nextSibling);
        }
      }
    });
    // Touch support
    var touchY = 0;
    item.addEventListener('touchstart', function(e) {
      dragItem = item;
      touchY = e.touches[0].clientY;
      item.classList.add('dragging');
    }, { passive: true });
    item.addEventListener('touchmove', function(e) {
      e.preventDefault();
      var touch = e.touches[0];
      var target = document.elementFromPoint(touch.clientX, touch.clientY);
      if (target) {
        var targetItem = target.closest('.ordering-item');
        if (targetItem && targetItem !== dragItem) {
          var rect = targetItem.getBoundingClientRect();
          var mid = rect.top + rect.height / 2;
          if (touch.clientY < mid) {
            list.insertBefore(dragItem, targetItem);
          } else {
            list.insertBefore(dragItem, targetItem.nextSibling);
          }
        }
      }
    }, { passive: false });
    item.addEventListener('touchend', function() {
      if (dragItem) dragItem.classList.remove('dragging');
      dragItem = null;
      list.querySelectorAll('.ordering-item').forEach(function(it, i) {
        it.querySelector('.order-num').textContent = i + 1;
      });
    });
  });
};

OVA.activities._orderingCheck = function() {
  var list = document.getElementById('orderingList');
  var items = list.querySelectorAll('.ordering-item');
  var correct = 0;
  items.forEach(function(item, i) {
    item.classList.remove('correct-pos', 'incorrect-pos');
    if (parseInt(item.dataset.id) === i) {
      item.classList.add('correct-pos');
      correct++;
    } else {
      item.classList.add('incorrect-pos');
    }
  });
  if (correct === items.length) {
    OVA.audio.playCorrect();
    setTimeout(function() {
      OVA.activities.showResult(document.getElementById('modalBody'), 'Orden Perfecto!', 'Conoces todo el proceso de reciclaje.', correct, items.length, 'ordering');
    }, 1000);
  } else {
    OVA.audio.playIncorrect();
  }
};

/* ---- 4. DESAFIO CONTRARELOJ ---- */
OVA.activities.act_timed = function() {
  var body = document.getElementById('modalBody');
  var items = [
    { name: 'Manzana', icon: '🍎', cat: 'organic' },
    { name: 'Periodico', icon: '📰', cat: 'recyclable' },
    { name: 'Botella', icon: '🥤', cat: 'recyclable' },
    { name: 'Panuelo', icon: '🧻', cat: 'non-recyclable' },
    { name: 'Platano', icon: '🍌', cat: 'organic' },
    { name: 'Lata', icon: '🥫', cat: 'recyclable' },
    { name: 'Esponja', icon: '🧽', cat: 'non-recyclable' },
    { name: 'Hojas', icon: '🍂', cat: 'organic' },
    { name: 'Vidrio', icon: '🍶', cat: 'recyclable' },
    { name: 'Aposito', icon: '🩹', cat: 'non-recyclable' },
    { name: 'Cascara naranja', icon: '🍊', cat: 'organic' },
    { name: 'Carton', icon: '📦', cat: 'recyclable' }
  ];
  var shuffled = items.slice().sort(function() { return Math.random() - 0.5; });
  var current = 0;
  var score = 0;
  var timeLeft = 30;
  var timer = null;

  function render() {
    if (current >= shuffled.length || timeLeft <= 0) {
      clearInterval(timer);
      var stars = score >= 10 ? 3 : score >= 6 ? 2 : score > 0 ? 1 : 0;
      var msg = stars === 3 ? 'Increible! Eres un maestro!' : stars === 2 ? 'Muy bien!' : 'Sigue practicando!';
      OVA.activities.showResult(document.getElementById('modalBody'), 'Desafio Contrarreloj', msg + ' Clasificaste ' + score + ' residuos.', score, undefined, 'timed');
      return;
    }
    var it = shuffled[current];
    body.innerHTML = '<div class="activity-header"><div class="activity-title"><span class="material-icons" style="color:var(--color-accent-red);vertical-align:middle">timer</span> Desafio Contrarreloj</div><div class="activity-timer" id="timedTimer">' + timeLeft + 's</div><div style="font-size:48px;margin:16px 0">' + it.icon + '</div><p style="font-size:18px;font-weight:600">' + it.name + '</p></div><div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap"><button class="btn btn-primary" onclick="OVA.activities._timedAnswer(\'organic\')" style="background:var(--bin-organic)"><span class="material-icons">compost</span> Organico</button><button class="btn btn-primary" onclick="OVA.activities._timedAnswer(\'recyclable\')" style="background:var(--bin-recyclable)"><span class="material-icons">recycling</span> Reciclable</button><button class="btn btn-primary" onclick="OVA.activities._timedAnswer(\'non-recyclable\')" style="background:var(--bin-non-recyclable)"><span class="material-icons">delete</span> No Reciclable</button></div><p style="text-align:center;margin-top:12px;color:var(--text-secondary)">' + (current + 1) + ' de ' + shuffled.length + ' | Puntos: ' + score + '</p>';
  }

  OVA.activities._timedAnswer = function(cat) {
    if (shuffled[current].cat === cat) {
      score++;
      OVA.audio.playCorrect();
    } else {
      OVA.audio.playIncorrect();
    }
    current++;
    render();
  };

  if (timer) clearInterval(timer);
  render();
  timer = setInterval(function() {
    timeLeft--;
    var t = document.getElementById('timedTimer');
    if (t) t.textContent = timeLeft + 's';
    if (timeLeft <= 5 && t) t.classList.add('warning');
    if (timeLeft <= 0) {
      clearInterval(timer);
      OVA.activities._timedAnswer = function() {};
      var stars = score >= 10 ? 3 : score >= 6 ? 2 : score > 0 ? 1 : 0;
      OVA.activities.showResult(document.getElementById('modalBody'), 'Tiempo!', 'Clasificaste ' + score + ' residuos en 30 segundos.', score, undefined, 'timed');
    }
  }, 1000);
  OVA.activities._timedTimer = timer;
};

/* ---- 5. RULETA ECOLOGICA ---- */
OVA.activities.act_roulette = function() {
  var body = document.getElementById('modalBody');
  var segments = [
    { text: 'Donde va una lata?', answer: 'Reciclable', color: '#2196F3' },
    { text: 'Cascara de huevo...', answer: 'Organico', color: '#8B4513' },
    { text: 'Panuelo usado?', answer: 'No Reciclable', color: '#757575' },
    { text: 'Botella de vidrio?', answer: 'Reciclable', color: '#2196F3' },
    { text: 'Restos de café?', answer: 'Organico', color: '#8B4513' },
    { text: 'Esponja vieja?', answer: 'No Reciclable', color: '#757575' }
  ];
  var spinning = false;
  var html = '<div class="activity-header"><div class="activity-title"><span class="material-icons" style="color:var(--color-accent-yellow);vertical-align:middle">casino</span> Ruleta Ecologica</div><div class="activity-subtitle">Gira la ruleta y responde la pregunta.</div></div><div class="roulette-wrapper"><div class="roulette-container"><div class="roulette-pointer"></div><div class="roulette-wheel" id="rouletteWheel">';
  segments.forEach(function(s, i) {
    var angle = (360 / segments.length) * i;
    html += '<div class="roulette-segment" style="background:' + s.color + ';transform:rotate(' + angle + 'deg)"><span style="transform:rotate(' + (angle + 45) + 'deg);display:block">' + s.text + '</span></div>';
  });
  html += '</div></div><div class="roulette-result" id="rouletteResult">Gira la ruleta!</div><div id="rouletteAnswer" style="display:none;margin-top:12px"><p style="font-weight:600;margin-bottom:8px">Donde debe ir?</p><div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap"><button class="btn btn-outline" onclick="OVA.activities._rouletteAnswer(\'Organico\')"><span class="material-icons">compost</span> Organico</button><button class="btn btn-outline" onclick="OVA.activities._rouletteAnswer(\'Reciclable\')"><span class="material-icons">recycling</span> Reciclable</button><button class="btn btn-outline" onclick="OVA.activities._rouletteAnswer(\'No Reciclable\')"><span class="material-icons">delete</span> No Reciclable</button></div></div><div class="activity-footer"><button class="btn btn-primary" onclick="OVA.activities._rouletteSpin()" id="rouletteSpinBtn"><span class="material-icons">refresh</span> Girar</button><button class="btn btn-secondary" onclick="OVA.activities.close()"><span class="material-icons">close</span> Cerrar</button></div></div>';
  body.innerHTML = html;
  OVA.activities._rouletteData = { segments: segments, current: 0, score: 0, total: 4, asked: 0 };
};

OVA.activities._rouletteSpin = function() {
  var d = OVA.activities._rouletteData;
  if (d.asked >= d.total) return;
  var wheel = document.getElementById('rouletteWheel');
  var btn = document.getElementById('rouletteSpinBtn');
  btn.disabled = true;
  var rand = Math.floor(Math.random() * d.segments.length);
  var rot = 360 * 5 + (360 / d.segments.length) * rand;
  wheel.style.transform = 'rotate(-' + rot + 'deg)';
  setTimeout(function() {
    d.current = rand;
    document.getElementById('rouletteResult').innerHTML = '<strong>' + d.segments[rand].text + '</strong>';
    document.getElementById('rouletteAnswer').style.display = 'block';
    OVA.audio.playClick();
  }, 4200);
};

OVA.activities._rouletteAnswer = function(ans) {
  var d = OVA.activities._rouletteData;
  var correct = d.segments[d.current].answer;
  var res = document.getElementById('rouletteResult');
  var ansDiv = document.getElementById('rouletteAnswer');
  d.asked++;
  if (ans === correct) {
    d.score++;
    res.innerHTML = '<span class="material-icons" style="color:var(--color-primary)">check_circle</span> Correcto! ' + correct;
    OVA.audio.playCorrect();
  } else {
    res.innerHTML = '<span class="material-icons" style="color:var(--color-accent-red)">cancel</span> Incorrecto. Era: ' + correct;
    OVA.audio.playIncorrect();
  }
  ansDiv.style.display = 'none';
  var btn = document.getElementById('rouletteSpinBtn');
  if (d.asked >= d.total) {
    setTimeout(function() {
      OVA.activities.showResult(document.getElementById('modalBody'), 'Ruleta Completada', 'Respuestas correctas:', d.score, d.total, 'roulette');
    }, 1500);
  } else {
    btn.disabled = false;
    btn.innerHTML = '<span class="material-icons">refresh</span> Girar de nuevo';
  }
};

/* ---- 6. ROMPECABEZAS ECOLOGICO ---- */
OVA.activities.act_puzzle = function() {
  var body = document.getElementById('modalBody');

  // Create puzzle image on canvas
  function createPuzzleImage() {
    var canvas = document.createElement('canvas');
    canvas.width = 300;
    canvas.height = 300;
    var ctx = canvas.getContext('2d');
    // Sky
    var skyGrad = ctx.createLinearGradient(0, 0, 0, 200);
    skyGrad.addColorStop(0, '#87CEEB');
    skyGrad.addColorStop(1, '#E0F7FA');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, 300, 300);
    // Grass
    ctx.fillStyle = '#4CAF50';
    ctx.fillRect(0, 200, 300, 100);
    ctx.fillStyle = '#388E3C';
    ctx.fillRect(0, 198, 300, 6);
    // Sun
    ctx.fillStyle = '#FFD54F';
    ctx.beginPath();
    ctx.arc(260, 45, 28, 0, Math.PI * 2);
    ctx.fill();
    // Tree 1
    ctx.fillStyle = '#5D4037';
    ctx.fillRect(35, 140, 12, 60);
    ctx.fillStyle = '#2E7D32';
    ctx.beginPath();
    ctx.arc(41, 125, 28, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#388E3C';
    ctx.beginPath();
    ctx.arc(55, 135, 20, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#1B5E20';
    ctx.beginPath();
    ctx.arc(30, 130, 16, 0, Math.PI * 2);
    ctx.fill();
    // Tree 2
    ctx.fillStyle = '#5D4037';
    ctx.fillRect(238, 150, 10, 50);
    ctx.fillStyle = '#2E7D32';
    ctx.beginPath();
    ctx.arc(243, 135, 24, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#43A047';
    ctx.beginPath();
    ctx.arc(256, 142, 17, 0, Math.PI * 2);
    ctx.fill();
    // Bin
    ctx.fillStyle = '#795548';
    ctx.fillRect(115, 230, 70, 45);
    ctx.fillStyle = '#8D6E63';
    ctx.fillRect(110, 224, 80, 10);
    // Recycle symbol on bin
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('R', 150, 258);
    // Flowers
    ctx.fillStyle = '#F44336';
    ctx.beginPath(); ctx.arc(80, 218, 5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#FF9800';
    ctx.beginPath(); ctx.arc(92, 223, 4, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#E91E63';
    ctx.beginPath(); ctx.arc(195, 216, 5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#FF5722';
    ctx.beginPath(); ctx.arc(210, 220, 4, 0, Math.PI * 2); ctx.fill();
    // Path
    ctx.fillStyle = '#8D6E63';
    ctx.beginPath();
    ctx.moveTo(130, 300);
    ctx.quadraticCurveTo(150, 275, 170, 300);
    ctx.fill();
    return canvas.toDataURL();
  }

  var imgData = createPuzzleImage();
  var pieceSize = 80;
  var pieces = [];
  for (var i = 0; i < 9; i++) pieces.push(i);
  var shuffled = pieces.slice(0, 8).sort(function() { return Math.random() - 0.5; });
  shuffled.push(8);
  var moves = 0;

  function render() {
    var html = '<div class="activity-header"><div class="activity-title"><span class="material-icons" style="color:var(--color-primary);vertical-align:middle">extension</span> Rompecabezas Ecologico</div><div class="activity-subtitle">Haz clic en una pieza adyacente al espacio vacio para moverla.</div><p style="color:var(--text-secondary)">Movimientos: ' + moves + '</p></div>';
    html += '<div style="display:flex;gap:20px;align-items:flex-start;justify-content:center;flex-wrap:wrap">';
    // Reference image
    html += '<div style="text-align:center"><p style="font-size:12px;color:var(--text-secondary);margin-bottom:4px">Imagen completa:</p><div style="width:140px;height:140px;border-radius:8px;overflow:hidden;border:2px solid var(--color-primary)"><img src="' + imgData + '" style="width:140px;height:140px;object-fit:cover"></div></div>';
    // Puzzle grid
    html += '<div id="puzzleGrid" style="display:grid;grid-template-columns:repeat(3,80px);grid-template-rows:repeat(3,80px);gap:2px;background:rgba(0,0,0,0.1);padding:2px;border-radius:8px">';
    shuffled.forEach(function(pieceIdx, pos) {
      var row = Math.floor(pieceIdx / 3);
      var col = pieceIdx % 3;
      var isEmpty = pieceIdx === 8;
      if (isEmpty) {
        html += '<div style="background:rgba(0,0,0,0.05);border-radius:4px"></div>';
      } else {
        var bgX = -col * pieceSize;
        var bgY = -row * pieceSize;
        html += '<div onclick="OVA.activities._puzzleSwap(' + pos + ')" style="width:80px;height:80px;border-radius:4px;cursor:pointer;overflow:hidden;border:1px solid rgba(0,0,0,0.15);background-image:url(' + imgData + ');background-size:240px 240px;background-position:' + bgX + 'px ' + bgY + 'px;transition:transform 0.15s" onmouseenter="this.style.transform=\'scale(1.05)\'" onmouseleave="this.style.transform=\'scale(1)\'"></div>';
      }
    });
    html += '</div></div>';
    html += '<div id="puzzleFeedback" style="margin-top:12px;text-align:center;min-height:30px"></div>';
    html += '<div class="activity-footer"><button class="btn btn-secondary" onclick="OVA.activities.close()"><span class="material-icons">close</span> Cerrar</button><button class="btn btn-primary" onclick="OVA.activities.act_puzzle()"><span class="material-icons">refresh</span> Nuevo</button></div>';
    body.innerHTML = html;
  }

  OVA.activities._puzzleSwap = function(pos) {
    var emptyPos = shuffled.indexOf(8);
    // Check adjacency: same row diff 1, or same col diff 3
    var rowDiff = Math.abs(Math.floor(pos / 3) - Math.floor(emptyPos / 3));
    var colDiff = Math.abs((pos % 3) - (emptyPos % 3));
    var valid = (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
    if (!valid) return;
    var temp = shuffled[pos];
    shuffled[pos] = shuffled[emptyPos];
    shuffled[emptyPos] = temp;
    moves++;
    OVA.audio.playClick();
    // Check solved
    var solved = true;
    for (var i = 0; i < 8; i++) {
      if (shuffled[i] !== i) { solved = false; break; }
    }
    render();
    if (solved) {
      var fb = document.getElementById('puzzleFeedback');
      if (fb) fb.innerHTML = '<div class="quiz-feedback correct"><span class="material-icons" style="vertical-align:middle">check_circle</span> Reciclar ayuda a mantener limpio nuestro planeta!</div>';
      OVA.audio.playComplete();
      OVA.rewards.createConfetti();
      setTimeout(function() {
        OVA.activities.showResult(document.getElementById('modalBody'), 'Puzzle Completado!', 'La escena de reciclaje quedo perfecta. Lo resolviste en ' + moves + ' movimientos.', moves, undefined, 'puzzle');
      }, 2000);
    }
  };

  render();
};

/* ---- 7. CLASIFICA TU CASA ---- */
OVA.activities.act_house = function() {
  var body = document.getElementById('modalBody');
  var rooms = {
    cocina: { name: 'Cocina', icon: 'kitchen', items: [
      { name: 'Cascara de manzana', cat: 'organic' },
      { name: 'Bolsa de plastico', cat: 'recyclable' },
      { name: 'Esponja vieja', cat: 'non-recyclable' },
      { name: 'Caja de cereales', cat: 'recyclable' },
      { name: 'Restos de arroz', cat: 'organic' }
    ]},
    banio: { name: 'Bano', icon: 'bathtub', items: [
      { name: 'Botella de shampoo', cat: 'recyclable' },
      { name: 'Panuelo usado', cat: 'non-recyclable' },
      { name: 'Papel higienico', cat: 'non-recyclable' },
      { name: 'Caja de crema', cat: 'recyclable' }
    ]},
    sala: { name: 'Sala', icon: 'weekend', items: [
      { name: 'Periodico viejo', cat: 'recyclable' },
      { name: 'Envoltorio de dulce', cat: 'non-recyclable' },
      { name: 'Flor seca', cat: 'organic' },
      { name: 'Botella de agua', cat: 'recyclable' }
    ]}
  };
  var currentRoom = 'cocina';
  var currentIdx = 0;
  var score = 0;
  var totalItems = 0;
  Object.keys(rooms).forEach(function(r) { totalItems += rooms[r].items.length; });

  function render() {
    var room = rooms[currentRoom];
    var item = room.items[currentIdx];
    if (!item) {
      // Move to next room
      var roomKeys = Object.keys(rooms);
      var nextIdx = roomKeys.indexOf(currentRoom) + 1;
      if (nextIdx < roomKeys.length) {
        currentRoom = roomKeys[nextIdx];
        currentIdx = 0;
        render();
      } else {
        OVA.activities.showResult(document.getElementById('modalBody'), 'Casa Clasificada!', 'Clasificaste todos los residuos del hogar.', score, totalItems, 'house');
      }
      return;
    }
    var html = '<div class="activity-header"><div class="activity-title"><span class="material-icons" style="color:var(--color-accent-orange);vertical-align:middle">home</span> Clasifica tu Casa</div><div class="activity-subtitle">En que contenedor va este residuo de la ' + room.name + '?</div></div>';
    // Room tabs
    html += '<div class="room-tabs">';
    Object.keys(rooms).forEach(function(r) {
      var cls = r === currentRoom ? 'room-tab active' : 'room-tab';
      html += '<button class="' + cls + '" disabled>' + rooms[r].name + '</button>';
    });
    html += '</div>';
    // Current item
    html += '<div style="text-align:center;margin:20px 0"><div style="font-size:48px;margin-bottom:8px">' + item.name.charAt(0).toUpperCase() + '</div><p style="font-size:18px;font-weight:600">' + item.name + '</p></div>';
    // Answer buttons
    html += '<div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap"><button class="btn btn-primary" onclick="OVA.activities._houseAnswer(\'organic\')" style="background:var(--bin-organic)"><span class="material-icons">compost</span> Organico</button><button class="btn btn-primary" onclick="OVA.activities._houseAnswer(\'recyclable\')" style="background:var(--bin-recyclable)"><span class="material-icons">recycling</span> Reciclable</button><button class="btn btn-primary" onclick="OVA.activities._houseAnswer(\'non-recyclable\')" style="background:var(--bin-non-recyclable)"><span class="material-icons">delete</span> No Reciclable</button></div>';
    html += '<p style="text-align:center;margin-top:12px;color:var(--text-secondary)">Puntos: ' + score + '/' + totalItems + '</p>';
    body.innerHTML = html;
  }

  OVA.activities._houseAnswer = function(cat) {
    var room = rooms[currentRoom];
    var item = room.items[currentIdx];
    if (item.cat === cat) {
      score++;
      OVA.audio.playCorrect();
    } else {
      OVA.audio.playIncorrect();
    }
    currentIdx++;
    render();
  };

  render();
};

/* ---- 8. VERDADERO O FALSO ---- */
OVA.activities.act_truefalse = function() {
  var body = document.getElementById('modalBody');
  var questions = [
    { text: 'Las cascara de frutas son reciclables.', answer: false, explanation: 'Son organicos, no reciclables. Van al contenedor marron.' },
    { text: 'El vidrio se tarda mas de 4000 anos en descomponerse.', answer: true, explanation: 'Correcto! Por eso es tan importante reciclarlo.' },
    { text: 'Una lata de aluminio se puede reciclar infinitamente.', answer: true, explanation: 'El aluminio puede reciclarce sin perder calidad.' },
    { text: 'El papel sucio se puede reciclar.', answer: false, explanation: 'El papel contaminado con grasa o comida no es reciclable.' },
    { text: 'Reciclar una botella de plastico ahorra energia.', answer: true, explanation: 'Reciclar plastico ahorra un 75% de energia vs fabricar nuevo.' },
    { text: 'Los panuelos usados van al contenedor reciclable.', answer: false, explanation: 'Los panuelos van al basurero general, no son reciclables.' },
    { text: 'El compostaje es una forma de reciclar residuos organicos.', answer: true, explanation: 'El compostaje transforma residuos organicos en abono natural.' },
    { text: 'Todos los plasticos se reciclan igual.', answer: false, explanation: 'Cada tipo de plastico tiene un proceso de reciclaje diferente.' }
  ];
  var current = 0;
  var score = 0;

  function render() {
    if (current >= questions.length) {
      var pct = Math.round((score / questions.length) * 100);
      var msg = pct >= 75 ? 'Excelente! Dominas este tema.' : pct >= 50 ? 'Muy bien! Sigue aprendiendo.' : 'Repasa los contenido e intenta de nuevo.';
      OVA.activities.showResult(document.getElementById('modalBody'), 'Verdadero o Falso', msg + ' Puntuacion: ' + pct + '%.', score, questions.length, 'truefalse');
      return;
    }
    var q = questions[current];
    var html = '<div class="activity-header"><div class="activity-title"><span class="material-icons" style="color:var(--color-accent-purple);vertical-align:middle">fact_check</span> Verdadero o Falso</div><div class="activity-subtitle">Pregunta ' + (current + 1) + ' de ' + questions.length + '</div></div><div class="tf-cards"><div class="tf-statement">' + q.text + '</div><div class="tf-buttons"><button class="tf-btn tf-btn-true" onclick="OVA.activities._tfAnswer(true)"><span class="material-icons">check</span> Verdadero</button><button class="tf-btn tf-btn-false" onclick="OVA.activities._tfAnswer(false)"><span class="material-icons">close</span> Falso</button></div><div id="tfFeedback" style="min-height:60px"></div></div>';
    body.innerHTML = html;
  }

  OVA.activities._tfAnswer = function(ans) {
    var q = questions[current];
    var correct = ans === q.answer;
    if (correct) { score++; OVA.audio.playCorrect(); } else { OVA.audio.playIncorrect(); }
    var btns = document.querySelectorAll('.tf-btn');
    btns.forEach(function(b) { b.disabled = true; });
    var fb = document.getElementById('tfFeedback');
    fb.innerHTML = '<div class="tf-feedback ' + (correct ? 'quiz-feedback correct' : 'quiz-feedback incorrect') + '">' + (correct ? 'Correcto!' : 'Incorrecto.') + ' ' + q.explanation + '</div>';
    current++;
    setTimeout(render, 2000);
  };

  render();
};

/* ---- 9. MEMORAMA ECOLOGICO ---- */
OVA.activities.act_memory = function() {
  var body = document.getElementById('modalBody');
  var pairs = [
    { icon: '🥤', label: 'Botella', match: 'Reciclable' },
    { icon: '🍂', label: 'Hojas', match: 'Organico' },
    { icon: '🧻', label: 'Panuelo', match: 'No Reciclable' },
    { icon: '🥫', label: 'Lata', match: 'Reciclable' },
    { icon: '🍌', label: 'Platano', match: 'Organico' },
    { icon: '🧽', label: 'Esponja', match: 'No Reciclable' }
  ];
  var cards = [];
  pairs.forEach(function(p) {
    cards.push({ type: 'icon', icon: p.icon, pairId: p.icon, matched: false });
    cards.push({ type: 'label', label: p.match, pairId: p.icon, matched: false });
  });
  cards.sort(function() { return Math.random() - 0.5; });
  var flipped = [];
  var matched = 0;
  var lockBoard = false;

  function render() {
    var html = '<div class="activity-header"><div class="activity-title"><span class="material-icons" style="color:var(--color-accent-yellow);vertical-align:middle">grid_view</span> Memorama Ecologico</div><div class="activity-subtitle">Encuentra las parejas: residuo con su contenedor.</div><p style="color:var(--text-secondary)">Parejas encontradas: ' + matched + '/' + pairs.length + '</p></div><div class="memory-grid" id="memoryGrid">';
    cards.forEach(function(c, i) {
      var flippedClass = c.matched || flipped.indexOf(i) !== -1 ? ' flipped' : '';
      var matchedClass = c.matched ? ' matched' : '';
      html += '<div class="memory-card' + flippedClass + matchedClass + '" data-idx="' + i + '" onclick="OVA.activities._memoryFlip(' + i + ')"><div class="memory-card-inner"><div class="memory-card-front"><span class="material-icons">help_outline</span></div><div class="memory-card-back">' + (c.type === 'icon' ? '<span style="font-size:28px">' + c.icon + '</span>' : '<span>' + c.label + '</span>') + '</div></div></div>';
    });
    html += '</div><div id="memoryFeedback" style="margin-top:12px;text-align:center;min-height:40px"></div><div class="activity-footer"><button class="btn btn-secondary" onclick="OVA.activities.close()"><span class="material-icons">close</span> Cerrar</button></div>';
    body.innerHTML = html;
  }

  OVA.activities._memoryFlip = function(idx) {
    if (lockBoard || cards[idx].matched || flipped.indexOf(idx) !== -1) return;
    flipped.push(idx);
    OVA.audio.playClick();
    render();
    if (flipped.length === 2) {
      lockBoard = true;
      var c1 = cards[flipped[0]];
      var c2 = cards[flipped[1]];
      if (c1.pairId === c2.pairId && c1.type !== c2.type) {
        c1.matched = true;
        c2.matched = true;
        matched++;
        OVA.audio.playCorrect();
        flipped = [];
        lockBoard = false;
        render();
        if (matched === pairs.length) {
          setTimeout(function() {
            OVA.activities.showResult(document.getElementById('modalBody'), 'Memorama Completado!', 'Encontraste todas las parejas.', matched, pairs.length, 'memory');
          }, 800);
        }
      } else {
        OVA.audio.playIncorrect();
        setTimeout(function() {
          flipped = [];
          lockBoard = false;
          render();
        }, 1000);
      }
    }
  };

  render();
};

/* ---- 10. CONDUCE EL CAMION ---- */
OVA.activities.act_truck = function() {
  var body = document.getElementById('modalBody');
  var challenges = [
    { question: 'El camion debe llevar estos restos de comida. A donde?', answer: 'organic', options: [
      { id: 'organic', icon: 'compost', label: 'Contenedor Organico', color: '#8B4513' },
      { id: 'recyclable', icon: 'recycling', label: 'Contenedor Reciclable', color: '#2196F3' },
      { id: 'non-recyclable', icon: 'delete', label: 'Basurero General', color: '#757575' }
    ]},
    { question: 'Transportas botellas de vidrio. Cuál es el destino?', answer: 'recyclable', options: [
      { id: 'organic', icon: 'compost', label: 'Organico', color: '#8B4513' },
      { id: 'recyclable', icon: 'recycling', label: 'Reciclable', color: '#2196F3' },
      { id: 'non-recyclable', icon: 'delete', label: 'No Reciclable', color: '#757575' }
    ]},
    { question: 'Llevas esponjas y panuelos usados. Camino correcto?', answer: 'non-recyclable', options: [
      { id: 'organic', icon: 'compost', label: 'Organico', color: '#8B4513' },
      { id: 'recyclable', icon: 'recycling', label: 'Reciclable', color: '#2196F3' },
      { id: 'non-recyclable', icon: 'delete', label: 'Basurero', color: '#757575' }
    ]}
  ];
  var current = 0;
  var score = 0;

  function render() {
    if (current >= challenges.length) {
      OVA.activities.showResult(document.getElementById('modalBody'), 'Viaje Completado!', 'Clasificaste bien ' + score + ' de ' + challenges.length + ' cargamentos.', score, challenges.length, 'truck');
      return;
    }
    var ch = challenges[current];
    var html = '<div class="activity-header"><div class="activity-title"><span class="material-icons" style="color:var(--color-secondary);vertical-align:middle">local_shipping</span> Conduce el Camion Reciclador</div><div class="activity-subtitle">' + ch.question + '</div><p style="color:var(--text-secondary)">Camion ' + (current + 1) + ' de ' + challenges.length + '</p></div><div style="text-align:center;font-size:48px;margin:16px 0"><span class="material-icons" style="font-size:64px;color:var(--color-secondary)">local_shipping</span></div><div class="truck-roads">';
    ch.options.forEach(function(opt) {
      html += '<div class="truck-road" onclick="OVA.activities._truckAnswer(\'' + opt.id + '\')"><div class="road-icon"><span class="material-icons" style="font-size:32px;color:' + opt.color + '">' + opt.icon + '</span></div><div class="road-label">' + opt.label + '</div></div>';
    });
    html += '</div><div id="truckFeedback" style="margin-top:12px;text-align:center;min-height:40px"></div>';
    body.innerHTML = html;
  }

  OVA.activities._truckAnswer = function(id) {
    var ch = challenges[current];
    var roads = document.querySelectorAll('.truck-road');
    roads.forEach(function(r) { r.style.pointerEvents = 'none'; });
    var fb = document.getElementById('truckFeedback');
    if (id === ch.answer) {
      score++;
      OVA.audio.playCorrect();
      fb.innerHTML = '<div class="quiz-feedback correct"><span class="material-icons">check_circle</span> Camino correcto!</div>';
    } else {
      OVA.audio.playIncorrect();
      fb.innerHTML = '<div class="quiz-feedback incorrect"><span class="material-icons">cancel</span> Camino equivocado.</div>';
    }
    current++;
    setTimeout(render, 1500);
  };

  render();
};

/* ---- 11. ANTES Y DESPUES ---- */
OVA.activities.act_beforeafter = function() {
  var body = document.getElementById('modalBody');
  var differences = [
    { name: 'Botella en el rio', found: false, icon: 'water_drop' },
    { name: 'Humo de fabricas', found: false, icon: 'cloud' },
    { name: 'Basura en el parque', found: false, icon: 'delete' },
    { name: 'Sin arboles', found: false, icon: 'park' },
    { name: 'Aire gris', found: false, icon: 'air' }
  ];
  var found = 0;

  var pollutedSVG = '<svg viewBox="0 0 280 180" xmlns="http://www.w3.org/2000/svg" style="width:100%;border-radius:8px">' +
    '<rect fill="#90A4AE" width="280" height="180"/>' +
    '<rect fill="#78909C" y="100" width="280" height="80"/>' +
    '<rect fill="#546E7A" x="20" y="50" width="40" height="50"/>' +
    '<rect fill="#546E7A" x="70" y="40" width="30" height="60"/>' +
    '<rect fill="#455A64" x="110" y="55" width="35" height="45"/>' +
    '<rect fill="#546E7A" x="155" y="35" width="45" height="65"/>' +
    '<rect fill="#455A64" x="210" y="50" width="50" height="50"/>' +
    '<rect fill="#78909C" x="25" y="60" width="8" height="8" fill="#FFD54F" opacity="0.6"/>' +
    '<rect fill="#78909C" x="80" y="50" width="6" height="6" fill="#FFD54F" opacity="0.4"/>' +
    '<ellipse fill="#607D8B" cx="180" cy="30" rx="20" ry="10"/>' +
    '<ellipse fill="#546E7A" cx="165" cy="25" rx="15" ry="8"/>' +
    '<rect fill="#455A64" x="30" y="48" width="6" height="20"/>' +
    '<rect fill="#455A64" x="75" y="38" width="5" height="15"/>' +
    '<rect fill="#455A64" x="160" y="33" width="6" height="18"/>' +
    '<circle fill="#F44336" cx="50" cy="115" r="4"/>' +
    '<circle fill="#FF9800" cx="180" cy="120" r="3"/>' +
    '<text x="140" y="140" text-anchor="middle" font-size="10" fill="#B0BEC5" font-weight="bold">Ciudad Contaminada</text>' +
    '</svg>';

  var cleanSVG = '<svg viewBox="0 0 280 180" xmlns="http://www.w3.org/2000/svg" style="width:100%;border-radius:8px">' +
    '<defs><linearGradient id="csky" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#81D4FA"/><stop offset="100%" stop-color="#E1F5FE"/></linearGradient></defs>' +
    '<rect fill="url(#csky)" width="280" height="180"/>' +
    '<rect fill="#66BB6A" y="110" width="280" height="70"/>' +
    '<rect fill="#4CAF50" y="110" width="280" height="5"/>' +
    '<circle fill="#FFD54F" cx="245" cy="30" r="22" opacity="0.9"/>' +
    '<rect fill="#5D4037" x="30" y="70" width="8" height="40"/>' +
    '<circle fill="#2E7D32" cx="34" cy="55" r="22"/>' +
    '<circle fill="#388E3C" cx="48" cy="62" r="16"/>' +
    '<rect fill="#5D4037" x="120" y="75" width="7" height="35"/>' +
    '<circle fill="#2E7D32" cx="123" cy="62" r="18"/>' +
    '<circle fill="#43A047" cx="135" cy="67" r="13"/>' +
    '<rect fill="#5D4037" x="200" y="68" width="8" height="42"/>' +
    '<circle fill="#2E7D32" cx="204" cy="52" r="20"/>' +
    '<circle fill="#1B5E20" cx="218" cy="58" r="14"/>' +
    '<rect fill="#546E7A" x="65" y="70" width="30" height="40" rx="2"/>' +
    '<rect fill="#546E7A" x="155" y="65" width="35" height="45" rx="2"/>' +
    '<circle fill="#F44336" cx="75" cy="125" r="5"/><circle fill="#FF9800" cx="200" cy="128" r="4"/>' +
    '<circle fill="#E91E63" cx="100" cy="130" r="4"/>' +
    '<text x="140" y="155" text-anchor="middle" font-size="10" fill="#2E7D32" font-weight="bold">Ciudad Limpia</text>' +
    '</svg>';

  function render() {
    var html = '<div class="activity-header"><div class="activity-title"><span class="material-icons" style="color:var(--color-accent-orange);vertical-align:middle">compare</span> Antes y Despues</div><div class="activity-subtitle">Observa las dos ciudades. Toca los problemas de la ciudad contaminada que desaparecieron en la ciudad limpia.</div><p style="color:var(--text-secondary);font-size:13px">Encontradas: ' + found + ' / ' + differences.length + '</p></div>';

    html += '<div style="display:flex;gap:16px;justify-content:center;flex-wrap:wrap">';
    // Polluted city
    html += '<div style="flex:1;min-width:250px;max-width:350px"><div style="position:relative;border-radius:12px;overflow:hidden;border:3px solid #E53935">' + pollutedSVG;
    differences.forEach(function(d, i) {
      if (!d.found) {
        html += '<div class="ba-hotspot" data-idx="' + i + '" onclick="OVA.activities._baFind(' + i + ')" style="position:absolute;cursor:pointer;width:36px;height:36px;border-radius:50%;border:2px solid rgba(255,255,255,0.8);background:rgba(244,67,54,0.4);display:flex;align-items:center;justify-content:center;animation:pulse 2s ease infinite">' +
          '<span class="material-icons" style="font-size:18px;color:white">' + d.icon + '</span>' +
          '</div>';
      }
    });
    html += '</div></div>';

    // Clean city
    html += '<div style="flex:1;min-width:250px;max-width:350px"><div style="border-radius:12px;overflow:hidden;border:3px solid #4CAF50">' + cleanSVG + '</div></div>';
    html += '</div>';

    // Legend
    html += '<div style="margin-top:12px;display:flex;gap:12px;justify-content:center;flex-wrap:wrap">';
    differences.forEach(function(d, i) {
      var color = d.found ? 'var(--color-primary)' : 'var(--color-accent-red)';
      html += '<span style="font-size:11px;display:flex;align-items:center;gap:3px;color:' + color + '"><span class="material-icons" style="font-size:14px">' + d.icon + '</span>' + d.name + (d.found ? ' ✓' : '') + '</span>';
    });
    html += '</div>';

    html += '<div id="baFeedback" style="margin-top:12px;text-align:center;min-height:40px"></div>';
    body.innerHTML = html;

    // Position hotspots
    var positions = [
      { bottom: '25%', left: '45%' },
      { top: '10%', left: '20%' },
      { bottom: '30%', right: '15%' },
      { top: '35%', left: '10%' },
      { top: '5%', right: '20%' }
    ];
    var hotspots = document.querySelectorAll('.ba-hotspot');
    hotspots.forEach(function(hs) {
      var idx = parseInt(hs.dataset.idx);
      var p = positions[idx];
      if (p) {
        if (p.top) hs.style.top = p.top;
        if (p.bottom) hs.style.bottom = p.bottom;
        if (p.left) hs.style.left = p.left;
        if (p.right) hs.style.right = p.right;
      }
    });
  }

  OVA.activities._baFind = function(i) {
    if (differences[i].found) return;
    differences[i].found = true;
    found++;
    OVA.audio.playCorrect();
    var fb = document.getElementById('baFeedback');
    fb.innerHTML = '<div class="quiz-feedback correct"><span class="material-icons" style="vertical-align:middle">check_circle</span> Encontraste: ' + differences[i].name + '</div>';
    setTimeout(function() { render(); }, 600);
    if (found >= differences.length) {
      setTimeout(function() {
        OVA.activities.showResult(document.getElementById('modalBody'), 'Ciudad Transformada!', 'Identificaste todos los problemas. El reciclaje cambia nuestro mundo.', found, differences.length, 'beforeafter');
      }, 1200);
    }
  };

  render();
};

/* ---- 12. PERSONALIZA TU CONTENEDOR ---- */
OVA.activities.act_customize = function() {
  var body = document.getElementById('modalBody');
  var colors = ['#2ecc71', '#3498db', '#e74c3c', '#f1c40f', '#9b59b6', '#e67e22'];
  var stickers = ['♻️', '🌍', '🌱', '⭐', '💚', '🍃'];
  var eyes = ['◕‿◕', '●‿●', '◉‿◉', '◕ᴗ◕'];
  var selectedColor = colors[0];
  var selectedSticker = stickers[0];
  var selectedEyes = eyes[0];

  function render() {
    var html = '<div class="activity-header"><div class="activity-title"><span class="material-icons" style="color:var(--color-primary);vertical-align:middle">palette</span> Personaliza tu Contenedor</div><div class="activity-subtitle">Elige color, ojos y sticker para tu contenedor.</div></div><div class="customize-container"><div class="customize-bin" style="background:' + selectedColor + ';border-radius:12px;border:4px solid rgba(0,0,0,0.2)"><span style="font-size:36px">' + selectedEyes + '</span><span class="material-icons" style="font-size:40px;color:white">delete</span><span style="font-size:20px">' + selectedSticker + '</span></div><p style="font-weight:600">Color:</p><div class="customize-options">';
    colors.forEach(function(c) {
      html += '<div class="customize-option' + (c === selectedColor ? ' selected' : '') + '" onclick="OVA.activities._customizeSet(\'color\',\'' + c + '\')" style="background:' + c + ';width:36px;height:36px;border-radius:50%;min-width:36px"></div>';
    });
    html += '</div><p style="font-weight:600;margin-top:8px">Ojos:</p><div class="customize-options">';
    eyes.forEach(function(e) {
      html += '<div class="customize-option' + (e === selectedEyes ? ' selected' : '') + '" onclick="OVA.activities._customizeSet(\'eyes\',\'' + e + '\')" style="font-size:18px;padding:6px 10px">' + e + '</div>';
    });
    html += '</div><p style="font-weight:600;margin-top:8px">Sticker:</p><div class="customize-options">';
    stickers.forEach(function(s) {
      html += '<div class="customize-option' + (s === selectedSticker ? ' selected' : '') + '" onclick="OVA.activities._customizeSet(\'sticker\',\'' + s + '\')" style="font-size:20px;padding:6px 10px">' + s + '</div>';
    });
    html += '</div></div><div class="activity-footer"><button class="btn btn-primary" onclick="OVA.activities.showResult(document.getElementById(\'modalBody\'),\'Contenedor Personalizado!\',\'Creaste tu propio contenedor de reciclaje.\',1,1,\'customize\')"><span class="material-icons">check</span> Guardar</button><button class="btn btn-secondary" onclick="OVA.activities.close()"><span class="material-icons">close</span> Cerrar</button></div>';
    body.innerHTML = html;
  }

  OVA.activities._customizeSet = function(type, val) {
    if (type === 'color') selectedColor = val;
    if (type === 'eyes') selectedEyes = val;
    if (type === 'sticker') selectedSticker = val;
    OVA.audio.playClick();
    render();
  };

  render();
};

/* ---- 13. RETO DEL PERSONAJE ---- */
OVA.activities.act_character = function() {
  var body = document.getElementById('modalBody');
  var challenges = [
    { question: 'Encontre esta botella de plastico. Donde debo ponerla?', options: ['Organico', 'Reciclable', 'No Reciclable'], correct: 1, reaction: 'Excelente! La botella de plastico va al contenedor azul (reciclable).' },
    { question: 'Tengo esta cascara de platano. Que hago?', options: ['Reciclable', 'Organico', 'Basurero'], correct: 1, reaction: 'Muy bien! La cascara de platano es organica.' },
    { question: 'Encontre un panuelo usado. A donde va?', options: ['Reciclable', 'Organico', 'No Reciclable'], correct: 2, reaction: 'Correcto! El panuelo va al basurero general.' },
    { question: 'Una lata de Coca-Cola. Contenedor correcto?', options: ['Organico', 'No Reciclable', 'Reciclable'], correct: 2, reaction: 'Perfecto! Las latas son reciclables.' },
    { question: 'Restos de comida de la cena. Donde deposito?', options: ['Organico', 'Reciclable', 'Basurero'], correct: 0, reaction: 'Asi es! Los restos de comida son organicos.' }
  ];
  var current = 0;
  var score = 0;

  function render() {
    if (current >= challenges.length) {
      OVA.activities.showResult(document.getElementById('modalBody'), 'Reto Completado!', 'El personaje esta orgulloso de ti.', score, challenges.length, 'character');
      return;
    }
    var ch = challenges[current];
    var html = '<div class="activity-header"><div class="activity-title"><span class="material-icons" style="color:var(--color-primary);vertical-align:middle">smart_toy</span> Reto del Personaje Guia</div></div><div class="cc-bubble"><div class="cc-character"><span class="material-icons" style="font-size:48px;color:var(--color-primary)">smart_toy</span></div><div class="cc-question">' + ch.question + '</div></div><div class="cc-options">';
    ch.options.forEach(function(opt, i) {
      html += '<button class="cc-option" onclick="OVA.activities._charAnswer(' + i + ')">' + opt + '</button>';
    });
    html += '</div><div id="charFeedback" style="margin-top:12px;text-align:center;min-height:40px"></div>';
    body.innerHTML = html;
  }

  OVA.activities._charAnswer = function(idx) {
    var ch = challenges[current];
    var btns = document.querySelectorAll('.cc-option');
    btns.forEach(function(b, i) {
      b.disabled = true;
      if (i === ch.correct) b.classList.add('correct');
      if (i === idx && idx !== ch.correct) b.classList.add('wrong');
    });
    var fb = document.getElementById('charFeedback');
    if (idx === ch.correct) {
      score++;
      OVA.audio.playCorrect();
      fb.innerHTML = '<div class="quiz-feedback correct">' + ch.reaction + '</div>';
    } else {
      OVA.audio.playIncorrect();
      fb.innerHTML = '<div class="quiz-feedback incorrect">' + ch.reaction + '</div>';
    }
    current++;
    setTimeout(render, 2500);
  };

  render();
};

/* ---- 14. MEMORAMA (alias for #9) ---- */
OVA.activities.act_memorama = function() { OVA.activities.act_memory(); };

/* ---- 15. DESAFIO CONTRARELOJ (alias) ---- */
OVA.activities.act_challenge = function() { OVA.activities.act_timed(); };

/* ---- 16. MISION ECOLOGICA ---- */
OVA.activities.act_mission = function() {
  var body = document.getElementById('modalBody');
  var stations = [
    { id: 'park', name: 'Parque', icon: 'park', completed: false,
      question: 'En el parque encuentras una botella de plastico. Donde va?',
      options: ['Organico', 'Reciclable', 'No Reciclable'], correct: 1 },
    { id: 'house', name: 'Casa', icon: 'home', completed: false,
      question: 'En la cocina tienes cascara de huevo. Contenedor correcto?',
      options: ['Reciclable', 'Organico', 'No Reciclable'], correct: 1 },
    { id: 'school', name: 'Escuela', icon: 'school', completed: false,
      question: 'En la escuela ves un periodico viejo. Donde depositarlo?',
      options: ['Organico', 'No Reciclable', 'Reciclable'], correct: 2 }
  ];
  var currentStation = -1;
  var completed = 0;

  function render() {
    var html = '<div class="activity-header"><div class="activity-title"><span class="material-icons" style="color:var(--color-primary);vertical-align:middle">map</span> Mision Ecologica</div><div class="activity-subtitle">Completa el reto de cada estacion para convertirte en Guardian del Reciclaje.</div></div><div class="mission-stations">';
    stations.forEach(function(s, i) {
      var cls = 'mission-station';
      if (s.completed) cls += ' completed';
      if (i === currentStation) cls += ' active';
      html += '<div class="' + cls + '" onclick="OVA.activities._missionSelect(' + i + ')"><span class="station-icon"><span class="material-icons" style="font-size:28px">' + s.icon + '</span></span><span class="station-label">' + s.name + '</span></div>';
    });
    html += '</div>';
    if (currentStation >= 0 && currentStation < stations.length && !stations[currentStation].completed) {
      var st = stations[currentStation];
      html += '<div class="cc-bubble"><div class="cc-question">' + st.question + '</div></div><div class="cc-options">';
      st.options.forEach(function(opt, i) {
        html += '<button class="cc-option" onclick="OVA.activities._missionAnswer(' + i + ')">' + opt + '</button>';
      });
      html += '</div>';
    }
    html += '<div id="missionFeedback" style="margin-top:12px;text-align:center;min-height:40px"></div>';
    body.innerHTML = html;
  }

  OVA.activities._missionSelect = function(i) {
    if (stations[i].completed) return;
    currentStation = i;
    OVA.audio.playClick();
    render();
  };

  OVA.activities._missionAnswer = function(idx) {
    var st = stations[currentStation];
    var btns = document.querySelectorAll('.cc-option');
    btns.forEach(function(b, i) {
      b.disabled = true;
      if (i === st.correct) b.classList.add('correct');
      if (i === idx && idx !== st.correct) b.classList.add('wrong');
    });
    var fb = document.getElementById('missionFeedback');
    if (idx === st.correct) {
      stations[currentStation].completed = true;
      completed++;
      OVA.audio.playCorrect();
      fb.innerHTML = '<div class="quiz-feedback correct">Estacion completada!</div>';
      if (completed >= stations.length) {
        setTimeout(function() {
          OVA.activities.showResult(document.getElementById('modalBody'), 'Mision Completa!', 'Eres un Guardian del Reciclaje!', completed, stations.length, 'mission');
        }, 1500);
      }
    } else {
      OVA.audio.playIncorrect();
      fb.innerHTML = '<div class="quiz-feedback incorrect">Intenta de nuevo en esta estacion.</div>';
    }
    setTimeout(render, 2000);
  };

  render();
};
