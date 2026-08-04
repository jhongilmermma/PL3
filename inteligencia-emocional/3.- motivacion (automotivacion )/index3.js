(function() {
    "use strict";

    // ---- DOM ----
    const goalInput = document.getElementById('goalInput');
    const reasonInput = document.getElementById('reasonInput');
    const grabarBtn = document.getElementById('grabarBtn');
    const timelineContainer = document.getElementById('timelineContainer');
    const emptyMessage = document.getElementById('emptyMessage');
    const entryCounter = document.getElementById('entryCounter');
    const fraseMotivacional = document.getElementById('fraseMotivacional');

    // ---- Mapa de motivación ----
    const motivationMap = {
      'meta': { face: '🎯', reflection: 'Una meta clara es el primer paso hacia el logro.' },
      'sueño': { face: '🌟', reflection: 'Los sueños son el combustible del alma. Perseguilos.' },
      'crecer': { face: '🌱', reflection: 'El crecimiento ocurre cuando salís de tu zona de confort.' },
      'avanzar': { face: '🚀', reflection: 'Cada pequeño avance te acerca a tu gran objetivo.' },
      'perseverar': { face: '💪', reflection: 'La perseverancia convierte lo imposible en posible.' },
      'confianza': { face: '😎', reflection: 'Confiar en ti es el motor de toda gran hazaña.' },
      'acción': { face: '⚡', reflection: 'La acción disuelve la duda. Movete hacia tu meta.' },
      'éxito': { face: '🏆', reflection: 'El éxito es la suma de pequeños esfuerzos repetidos.' },
      'pasión': { face: '❤️‍🔥', reflection: 'La pasión enciende el camino hacia tus sueños.' },
      'determinación': { face: '🔥', reflection: 'La determinación transforma obstáculos en escalones.' },
      'optimismo': { face: '😊', reflection: 'El optimismo atrae oportunidades. Mantené la fe.' },
      'valor': { face: '🦁', reflection: 'El valor no es ausencia de miedo, es actuar a pesar de él.' },
      'paciencia': { face: '🧘', reflection: 'La paciencia es la aliada de los grandes logros.' },
      'disciplina': { face: '📚', reflection: 'La disciplina convierte el talento en genialidad.' },
      'inspiración': { face: '✨', reflection: 'La inspiración llega cuando estás en movimiento.' },
    };

    function getMotivationData(text) {
      const lower = text.toLowerCase().trim();
      for (const [key, value] of Object.entries(motivationMap)) {
        if (lower.includes(key) || key.includes(lower)) {
          return value;
        }
      }
      return { face: '🌟', reflection: 'Tu motivación es única. Seguí adelante con fe.' };
    }

    // ---- Estado ----
    let metas = [];

    // ---- Frases motivacionales aleatorias ----
    const frases = [
      '"La motivación te impulsa, el hábito te mantiene."',
      '"El único límite es el que tú mismo te pones."',
      '"Hoy es el primer día del resto de tu vida."',
      '"Cree en ti y todo será posible."',
      '"Pequeños pasos llevan a grandes logros."',
      '"La determinación vence al talento."',
      '"Tu único competidor es quien fuiste ayer."',
      '"El éxito es la suma de pequeños esfuerzos."',
      '"No esperes el momento, crealo."',
      '"Cada día es una nueva oportunidad."'
    ];

    function cambiarFrase() {
      const random = frases[Math.floor(Math.random() * frases.length)];
      fraseMotivacional.innerHTML = `<i class="fas fa-quote-left"></i> ${random}`;
    }

    // ---- Helpers ----
    function formatTime(date) {
      return String(date.getHours()).padStart(2,'0') + ':' + String(date.getMinutes()).padStart(2,'0');
    }
    function formatDate(date) {
      return String(date.getDate()).padStart(2,'0') + '/' + String(date.getMonth()+1).padStart(2,'0') + '/' + date.getFullYear();
    }

    // ---- Renderizar timeline ----
    function renderTimeline() {
      const items = timelineContainer.querySelectorAll('.timeline-item');
      items.forEach(el => el.remove());

      if (metas.length === 0) {
        emptyMessage.style.display = 'block';
        entryCounter.textContent = '0 metas';
        return;
      }
      emptyMessage.style.display = 'none';
      entryCounter.textContent = `${metas.length} meta${metas.length > 1 ? 's' : ''}`;

      const sorted = [...metas].sort((a, b) => b.timestamp - a.timestamp);

      for (const entry of sorted) {
        const date = new Date(entry.timestamp);
        const timeStr = formatTime(date);
        const dateStr = formatDate(date);

        const item = document.createElement('div');
        item.className = 'timeline-item';

        const badge = document.createElement('span');
        badge.className = 'time-badge';
        badge.innerHTML = `<i class="far fa-clock" style="margin-right: 4px;"></i> ${dateStr} · ${timeStr}`;

        const emotionSpan = document.createElement('span');
        emotionSpan.className = 'entry-emotion';
        emotionSpan.innerHTML = `<span class="face">${entry.face || '🌟'}</span> ${entry.goal || 'meta'}`;

        const textSpan = document.createElement('span');
        textSpan.className = 'entry-text';
        textSpan.textContent = entry.reason || '';

        const reflectionBox = document.createElement('span');
        reflectionBox.className = 'reflection-box';
        reflectionBox.innerHTML = `<i class="fas fa-lightbulb"></i> ${entry.reflection || 'Tu motivación te guía.'}`;

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn-borrar';
        deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
        deleteBtn.addEventListener('click', function(e) {
          e.stopPropagation();
          eliminarMeta(entry.id);
        });

        item.appendChild(badge);
        item.appendChild(emotionSpan);
        item.appendChild(textSpan);
        item.appendChild(reflectionBox);
        item.appendChild(deleteBtn);

        timelineContainer.prepend(item);
      }
    }

    // ---- Eliminar ----
    function eliminarMeta(id) {
      metas = metas.filter(m => m.id !== id);
      localStorage.setItem('goleanMetas', JSON.stringify(metas));
      renderTimeline();
      cambiarFrase();
    }

    // ---- Agregar meta ----
    function addMeta() {
      let goal = goalInput.value.trim();
      let reason = reasonInput.value.trim();

      if (!goal && !reason) {
        goal = 'motivación';
        reason = 'seguir adelante';
      } else if (!goal) {
        goal = 'meta personal';
      }

      const data = getMotivationData(goal + ' ' + reason);

      const newEntry = {
        id: Date.now() + '_' + Math.random().toString(36).substring(2, 6),
        goal: goal,
        reason: reason,
        timestamp: Date.now(),
        face: data.face,
        reflection: data.reflection,
      };

      metas.push(newEntry);
      localStorage.setItem('goleanMetas', JSON.stringify(metas));

      // Limpiar
      goalInput.value = '';
      reasonInput.value = '';
      goalInput.placeholder = 'Ej. correr una maratón...';
      reasonInput.placeholder = '¿Qué te mueve?';

      renderTimeline();
      cambiarFrase();
      timelineContainer.scrollTop = 0;
    }

    // ---- Cargar desde localStorage ----
    function loadMetas() {
      const stored = localStorage.getItem('goleanMetas');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) metas = parsed;
        } catch (e) { metas = []; }
      } else {
        // datos de ejemplo
        const now = Date.now();
        const sample = [
          { id: 's1_' + now, goal: 'aprender programación', reason: 'para crear soluciones', timestamp: now - 3600000 * 2, face: '🚀', reflection: 'Cada línea de código te acerca a tu sueño.' },
          { id: 's2_' + now, goal: 'correr 5km', reason: 'para sentirme más fuerte', timestamp: now - 3600000 * 5, face: '🏃', reflection: 'La constancia en el deporte forja el carácter.' },
          { id: 's3_' + now, goal: 'escribir un libro', reason: 'para compartir mi historia', timestamp: now - 3600000 * 24, face: '📖', reflection: 'Cada palabra escrita es un paso hacia tu legado.' },
        ];
        metas = sample;
        localStorage.setItem('goleanMetas', JSON.stringify(metas));
      }
      renderTimeline();
      cambiarFrase();
    }

    // ---- Fecha ----
    function setCurrentDate() {
      const now = new Date();
      document.getElementById('currentDate').textContent = 
        formatDate(now) + ' · ' + formatTime(now);
    }

    // ---- Eventos ----
    grabarBtn.addEventListener('click', addMeta);

    goalInput.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        reasonInput.focus();
      }
    });
    reasonInput.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        addMeta();
      }
    });

    // Cambiar frase cada 30 segundos
    setInterval(cambiarFrase, 30000);

    // ---- Inicio ----
    loadMetas();
    setCurrentDate();
    setInterval(setCurrentDate, 60000);
  })();