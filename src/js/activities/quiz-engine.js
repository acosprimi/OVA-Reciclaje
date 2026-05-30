/* ============================================
   QUIZ ENGINE - OVA Reciclaje
   ============================================ */

window.OVA = window.OVA || {};

OVA.quiz = (function() {
  let currentQuestion = 0;
  let score = 0;
  let answered = false;
  let questionsAnswered = [];

  const questions = [
    {
      context: 'Maria esta desayunando y le sobranrestos de naranja y un vasito de plastico.',
      question: 'Como deberia deshacerse Maria de cada residuo?',
      options: [
        'Todo al mismo contenedor',
        'Naranja al organico, plastico al reciclable',
        'Todo al basurero general',
        'Naranja al reciclable, plastico al organico'
      ],
      correct: 1,
      explanation: 'Los restos de fruta son organicos (se descomponen naturalmente). El plastico es reciclable y debe ir al contenedor azul.'
    },
    {
      context: 'El colegio de Juan hizo una fiesta y quedaron muchas latas de gaseosa, servilletas sucias y globos rotos.',
      question: 'Cuales de esos residuos se pueden reciclar?',
      options: [
        'Las latas, las servilletas y los globos',
        'Solo las latas',
        'Las servilletas y las latas',
        'Ninguno, todo es basura'
      ],
      correct: 1,
      explanation: 'Solo las latas de aluminio son reciclables. Las servilletas sucias y los globos no se pueden reciclar.'
    },
    {
      context: 'Tu mama esta limpiando el jardín y junta hojas secas, ramas pequeñas y una botella de vidrio que encontro.',
      question: 'Cual es la forma correcta de separar estos residuos?',
      options: [
        'Todo al contenedor verde',
        'Hojas y ramas al organico, botella de vidrio al reciclable',
        'Botella al organico, hojas al reciclable',
        'Todo junto al basurero'
      ],
      correct: 1,
      explanation: 'Las hojas y ramas son residuos organicos. La botella de vidrio es reciclable y puede transformarse en nuevos productos.'
    },
    {
      context: 'Carlos tira un panuelo usado al contenedor azul (reciclable). Su hermana le dice que esta mal.',
      question: 'Quien tiene razon y por que?',
      options: [
        'Carlos, porque el panuelo es reciclable',
        'La hermana, porque el panuelo va al basurero general',
        'Ninguno, da igual donde se tire',
        'Carlos, porque todos los residuos van al azul'
      ],
      correct: 1,
      explanation: 'La hermana tiene razon. Los panuelos usados, servilletas y papeles sucios no son reciclables. Van al basurero general.'
    },
    {
      context: 'En una planta de reciclaje reciben toneladas de papel, plastico y metal mezclados.',
      question: 'Que paso del proceso de reciclaje fallo?',
      options: [
        'La planta no puede reciclar esos materiales',
        'Los ciudadanos no separaron bien sus residuos en casa',
        'El camion recolector no funciono bien',
        'El papel no se puede reciclar'
      ],
      correct: 1,
      explanation: 'El proceso empieza en casa. Si no se separan bien los residuos, la planta tiene problemas para reciclarlos correctamente.'
    },
    {
      context: 'Laura quiere reducir sus residuos. Usa una botella reutilizable, lleva su propia bolsa al mercado y compra frutas sin plastico.',
      question: 'Que practica de las 3R esta aplicando Laura?',
      options: [
        'Solo reciclar',
        'Solo reusar',
        'Reducir y reusar',
        'Solo desechar mejor'
      ],
      correct: 2,
      explanation: 'Laura esta reduciendo la cantidad de residuos que genera y reusando envases. Son dos de las 3R: Reducir, Reusar y Reciclar.'
    },
    {
      context: 'Tu escuela quiere ser mas ecologica. Han puesto contenedores de colores, pero los alumnos no los usan bien.',
      question: 'Que estrategia ayudaria mas a mejorar la separacion?',
      options: [
        'Quitar los contenedores',
        'Poner carteles con imagenes de que va en cada contenedor y hacer talleres',
        'Castigar a quien no separe bien',
        'Dejar todo en un solo contenedor'
      ],
      correct: 1,
      explanation: 'La educacion es clave. Los carteles visuales y los talleres ayudan a que todos aprendan a separar correctamente.'
    },
    {
      context: 'Pedro recicla todos sus residuos, pero su vecino tira todo junto. Pedro cree que no sirve de nada reciclar si otros no lo hacen.',
      question: 'Que le dirias a Pedro?',
      options: [
        'Que tiene razon, no sirve de nada',
        'Que cada persona que recicla marca la diferencia, y puede motivar a otros',
        'Que deje de reciclar tambien',
        'Que solo sirve si todos reciclan al mismo tiempo'
      ],
      correct: 1,
      explanation: 'Cada accion individual cuenta. Ademas, cuando otros ven a alguien reciclando, se motivan a hacerlo tambien.'
    }
  ];

  function init() {
    currentQuestion = 0;
    score = 0;
    answered = false;
    questionsAnswered = [];
    render();
  }

  function render() {
    const container = document.getElementById('quizContainer');
    if (!container) return;

    if (currentQuestion >= questions.length) {
      showResults(container);
      return;
    }

    var q = questions[currentQuestion];
    let dotsHtml = '';
    for (let i = 0; i < questions.length; i++) {
      let cls = 'quiz-progress-dot';
      if (i < currentQuestion) cls += questionsAnswered[i] ? ' correct' : ' incorrect';
      else if (i === currentQuestion) cls += ' active';
      dotsHtml += '<div class="' + cls + '"></div>';
    }

    var contextHtml = q.context ? '<div style="background:rgba(52,152,219,0.08);border-left:4px solid var(--color-secondary);padding:14px 16px;border-radius:0 8px 8px 0;margin-bottom:16px;text-align:left"><span class="material-icons" style="color:var(--color-secondary);vertical-align:middle;margin-right:6px;font-size:18px">description</span><strong style="font-size:13px;color:var(--color-secondary)">Caso:</strong> <span style="font-size:14px">' + q.context + '</span></div>' : '';

    let optionsHtml = '';
    q.options.forEach((opt, i) => {
      optionsHtml += '<button class="quiz-option" onclick="OVA.quiz.answer(' + i + ')" data-index="' + i + '">' + opt + '</button>';
    });

    container.innerHTML = '<div class="quiz-progress">' + dotsHtml + '</div>' +
      '<div class="quiz-question-number">Pregunta ' + (currentQuestion + 1) + ' de ' + questions.length + '</div>' +
      contextHtml +
      '<div class="quiz-question">' + q.question + '</div>' +
      '<div class="quiz-options">' + optionsHtml + '</div>' +
      '<div id="quizFeedback"></div>';
  }

  function answer(index) {
    if (answered) return;
    answered = true;

    const q = questions[currentQuestion];
    const isCorrect = index === q.correct;
    const options = document.querySelectorAll('.quiz-option');
    const feedback = document.getElementById('quizFeedback');

    options.forEach(opt => opt.classList.add('disabled'));
    options[q.correct].classList.add('correct');
    if (!isCorrect) options[index].classList.add('incorrect');

    if (feedback) {
      feedback.innerHTML = '<div class="quiz-feedback ' + (isCorrect ? 'correct' : 'incorrect') + '">' +
        (isCorrect ? 'Correcto! ' : 'Incorrecto. ') + q.explanation + '</div>';
    }

    if (isCorrect) {
      score++;
      OVA.audio.playCorrect();
    } else {
      OVA.audio.playIncorrect();
    }

    questionsAnswered[currentQuestion] = isCorrect;

    setTimeout(() => {
      currentQuestion++;
      answered = false;
      render();
      if (currentQuestion >= questions.length) {
        OVA.quiz.onComplete();
      }
    }, 2500);
  }

  function showResults(container) {
    const pct = Math.round((score / questions.length) * 100);
    const passed = pct >= 60;

    let starsHtml = '';
    if (score >= 5) starsHtml = '<span class="star earned"><span class="material-icons" style="font-size:40px;">star</span></span>';
    if (score >= 6) starsHtml += '<span class="star earned"><span class="material-icons" style="font-size:40px;">star</span></span>';
    if (score >= 7) starsHtml += '<span class="star earned"><span class="material-icons" style="font-size:40px;">star</span></span>';

    container.innerHTML = '<div class="quiz-score">' +
      '<div class="quiz-score-value">' + score + '/' + questions.length + '</div>' +
      '<div class="quiz-score-label">' + (passed ? 'Excelente!' : 'Sigue practicando') + '</div>' +
      '<p style="margin-top:12px;color:var(--text-secondary)">' +
      (passed ? 'Has demostrado un buen entendimiento sobre el reciclaje.' : 'Repasa el contenido e intenta de nuevo.') + '</p>' +
      '<div class="reward-container" style="margin-top:20px">' + starsHtml + '</div>' +
      '<button class="btn btn-primary" style="margin-top:20px" onclick="OVA.quiz.restart()"><span class="material-icons">refresh</span> Intentar de nuevo</button>' +
      '</div>';

    OVA.rewards.setQuizScore(score);
    if (passed) {
      OVA.rewards.addBadge('Experto', 'emoji_events');
    }
    OVA.navigation.markCompleted(7);
    document.getElementById('continueFromQuiz').style.display = 'inline-flex';
    if (score >= 4) {
      OVA.rewards.createConfetti();
    }
  }

  function onComplete() {
    const pct = Math.round((score / questions.length) * 100);
    if (pct >= 60 && OVA.character) OVA.character.celebrate();
  }

  function restart() {
    init();
    OVA.audio.playClick();
  }

  return {
    init, answer, restart, onComplete,
    get score() { return score; },
    get total() { return questions.length; }
  };
})();
