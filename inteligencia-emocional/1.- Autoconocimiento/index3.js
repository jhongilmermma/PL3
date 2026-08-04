(function() {
    "use strict";

    // ---- DOM ----
    const situationInput = document.getElementById('situationInput');
    const feelingInput = document.getElementById('feelingInput');
    const grabarBtn = document.getElementById('grabarBtn');
    const timelineContainer = document.getElementById('timelineContainer');
    const emptyMessage = document.getElementById('emptyMessage');
    const entryCounter = document.getElementById('entryCounter');

    // ---- Mapa de empatía ----
    const empathyMap = {
      'triste': { face: '😢', reflection: 'La tristeza necesita ser escuchada. Ofrece tu presencia.' },
      'alegre': { face: '😊', reflection: 'Compartir la alegría la multiplica. Celebra con el otro.' },
      'enojado': { face: '😠', reflection: 'El enojo es una señal. Valida la emoción sin juzgar.' },
      'frustrado': { face: '😤', reflection: 'La frustración busca comprensión. Escucha activamente.' },
      'ansioso': { face: '😰', reflection: 'La ansiedad se calma con presencia y calma.' },
      'confundido': { face: '😕', reflection: 'La confusión necesita claridad. Acompaña con paciencia.' },
      'solo': { face: '🥺', reflection: 'La soledad se alivia con una conexión genuina.' },
      'abrumado': { face: '😩', reflection: 'Sentirse abrumado es humano. Ofrece tu apoyo.' },
      'agradecido': { face: '🙏', reflection: 'La gratitud conecta corazones. Reconoce los gestos.' },
      'esperanzado': { face: '🌟', reflection: 'La esperanza es contagiosa. Comparte el optimismo.' },
      'asustado': { face: '😨', reflection: 'El miedo se transforma con acompañamiento y seguridad.' },
      'orgulloso': { face: '😌', reflection: 'El orgullo sano merece ser reconocido y celebrado.' },
      'culpable': { face: '😔', reflection: 'La culpa se disuelve con comprensión y perdón.' },
      'amoroso': { face: '❤️', reflection: 'El amor es la base de toda conexión empática.' },
      'indiferente': { face: '😐', reflection: 'La indiferencia puede esconder dolor. Acércate con cuidado.' },
    };

    function getEmpathyData(text) {
      const lower = text.toLowerCase().trim();
      for (const [key, value] of Object.entries(empathyMap)) {
        if (lower.includes(key) || key.includes(lower)) {
          return value;
        }
      }
      return { face: '🤗', reflection: 'Cada persona es un mundo. Acércate con respeto y escucha.' };
    }

    // ---- Estado ----
    let registros = [];

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

      if (registros.length === 0) {
        emptyMessage.style.display = 'block';
        entryCounter.textContent = '0 registros';
        return;
      }
      emptyMessage.style.display = 'none';
      entryCounter.textContent = `${registros.length} registro${registros.length > 1 ? 's' : ''}`;

      const sorted = [...registros].sort((a, b) => b.timestamp - a.timestamp);

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
        emotionSpan.innerHTML = `<span class="face">${entry.face || '🤗'}</span> ${entry.situation || 'situación'}`;

        const textSpan = document.createElement('span');
        textSpan.className = 'entry-text';
        textSpan.textContent = entry.feeling || '';

        const reflectionBox = document.createElement('span');
        reflectionBox.className = 'reflection-box';
        reflectionBox.innerHTML = `<i class="fas fa-lightbulb"></i> ${entry.reflection || 'La empatía construye puentes.'}`;

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn-borrar';
        deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
        deleteBtn.addEventListener('click', function(e) {
          e.stopPropagation();
          eliminarRegistro(entry.id);
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
    function eliminarRegistro(id) {
      registros = registros.filter(r => r.id !== id);
      localStorage.setItem('goleanEmpatia', JSON.stringify(registros));
      renderTimeline();
    }

    // ---- Agregar registro ----
    function addRegistro() {
      let situation = situationInput.value.trim();
      let feeling = feelingInput.value.trim();

      if (!situation && !feeling) {
        situation = 'una persona cercana';
        feeling = 'necesita apoyo';
      } else if (!situation) {
        situation = 'una situación empática';
      }

      const data = getEmpathyData(situation + ' ' + feeling);

      const newEntry = {
        id: Date.now() + '_' + Math.random().toString(36).substring(2, 6),
        situation: situation,
        feeling: feeling,
        timestamp: Date.now(),
        face: data.face,
        reflection: data.reflection,
      };

      registros.push(newEntry);
      localStorage.setItem('goleanEmpatia', JSON.stringify(registros));

      // Limpiar
      situationInput.value = '';
      feelingInput.value = '';
      situationInput.placeholder = 'Ej. una persona que está pasando un mal momento...';
      feelingInput.placeholder = '¿Cómo crees que se siente?';

      renderTimeline();
      timelineContainer.scrollTop = 0;
    }

    // ---- Cargar desde localStorage ----
    function loadRegistros() {
      const stored = localStorage.getItem('goleanEmpatia');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) registros = parsed;
        } catch (e) { registros = []; }
      } else {
        // datos de ejemplo
        const now = Date.now();
        const sample = [
          { id: 's1_' + now, situation: 'un amigo que perdió su trabajo', feeling: 'se siente inseguro y preocupado', timestamp: now - 3600000 * 2, face: '😢', reflection: 'La tristeza necesita ser escuchada. Ofrece tu presencia.' },
          { id: 's2_' + now, situation: 'una compañera que logró su meta', feeling: 'está emocionada y orgullosa', timestamp: now - 3600000 * 5, face: '😊', reflection: 'Compartir la alegría la multiplica. Celebra con el otro.' },
          { id: 's3_' + now, situation: 'alguien que está pasando por un duelo', feeling: 'se siente abrumado y solo', timestamp: now - 3600000 * 24, face: '🥺', reflection: 'La soledad se alivia con una conexión genuina.' },
        ];
        registros = sample;
        localStorage.setItem('goleanEmpatia', JSON.stringify(registros));
      }
      renderTimeline();
    }

    // ---- Fecha ----
    function setCurrentDate() {
      const now = new Date();
      document.getElementById('currentDate').textContent = 
        formatDate(now) + ' · ' + formatTime(now);
    }

    // ---- Eventos ----
    grabarBtn.addEventListener('click', addRegistro);

    situationInput.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        feelingInput.focus();
      }
    });
    feelingInput.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        addRegistro();
      }
    });

    // ---- Inicio ----
    loadRegistros();
    setCurrentDate();
    setInterval(setCurrentDate, 60000);
  })();