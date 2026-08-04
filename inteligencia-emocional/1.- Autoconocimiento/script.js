(function() {
    "use strict";

    // ---- elementos DOM ----
    const emotionInput = document.getElementById('emotionInput');
    const thoughtInput = document.getElementById('thoughtInput');
    const grabarBtn = document.getElementById('grabarBtn');
    const timelineContainer = document.getElementById('timelineContainer');
    const emptyMessage = document.getElementById('emptyMessage');
    const entryCounter = document.getElementById('entryCounter');

    // ---- estado ----
    let entries = [];

    // ---- helpers ----
    function formatTime(date) {
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${hours}:${minutes}`;
    }

    function formatDate(date) {
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    }

    // ---- renderizar timeline ----
    function renderTimeline() {
      // limpiar contenedor (mantener el emptyMessage como referencia)
      const items = timelineContainer.querySelectorAll('.timeline-item');
      items.forEach(el => el.remove());

      // si no hay entries, mostrar mensaje vacío
      if (entries.length === 0) {
        emptyMessage.style.display = 'block';
        entryCounter.textContent = '0 entradas';
        return;
      }
      emptyMessage.style.display = 'none';
      entryCounter.textContent = `${entries.length} entrada${entries.length > 1 ? 's' : ''}`;

      // ordenar de más reciente a más antiguo (por fecha)
      const sorted = [...entries].sort((a, b) => b.timestamp - a.timestamp);

      for (const entry of sorted) {
        const date = new Date(entry.timestamp);
        const timeStr = formatTime(date);
        const dateStr = formatDate(date);

        const item = document.createElement('div');
        item.className = 'timeline-item';

        // badge tiempo
        const badge = document.createElement('span');
        badge.className = 'time-badge';
        badge.innerHTML = `<i class="far fa-clock" style="margin-right: 4px;"></i> ${dateStr} · ${timeStr}`;

        // contenido
        const contentDiv = document.createElement('div');
        contentDiv.className = 'entry-content';

        // etiqueta emoción
        const emotionSpan = document.createElement('span');
        emotionSpan.className = 'entry-emotion';
        emotionSpan.textContent = entry.emotion || 'sin etiqueta';

        // texto
        const textSpan = document.createElement('span');
        textSpan.className = 'entry-text';
        textSpan.textContent = entry.thought || '';

        // botón borrar (ícono)
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn-borrar';
        deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
        deleteBtn.setAttribute('aria-label', 'Eliminar entrada');
        deleteBtn.addEventListener('click', function(e) {
          e.stopPropagation();
          eliminarEntrada(entry.id);
        });

        // armar
        contentDiv.appendChild(emotionSpan);
        contentDiv.appendChild(textSpan);
        item.appendChild(badge);
        item.appendChild(contentDiv);
        item.appendChild(deleteBtn);

        // insertar al inicio (para que lo más nuevo esté arriba)
        timelineContainer.prepend(item);
      }
    }

    // ---- eliminar entrada ----
    function eliminarEntrada(id) {
      entries = entries.filter(entry => entry.id !== id);
      // guardar en localStorage
      localStorage.setItem('goleanEntries', JSON.stringify(entries));
      renderTimeline();
    }

    // ---- agregar nueva entrada ----
    function addEntry() {
      const emotion = emotionInput.value.trim() || 'sin emoción';
      const thought = thoughtInput.value.trim() || '';

      if (!emotion && !thought) {
        // si ambos están vacíos, al menos poner un placeholder
        // pero dejamos que se guarde con "sin emoción" y texto vacío
      }

      const newEntry = {
        id: Date.now() + '_' + Math.random().toString(36).substring(2, 6),
        emotion: emotion,
        thought: thought,
        timestamp: Date.now()
      };

      entries.push(newEntry);
      // guardar en localStorage
      localStorage.setItem('goleanEntries', JSON.stringify(entries));
      
      // limpiar campos (pero dejamos algo de ejemplo, o reset)
      emotionInput.value = '';
      thoughtInput.value = '';
      // poner placeholders o ejemplos sutiles
      emotionInput.placeholder = 'ej. gratitud, enojo...';
      thoughtInput.placeholder = '¿qué pensás?';

      renderTimeline();

      // scroll al inicio (nuevo registro arriba)
      timelineContainer.scrollTop = 0;
    }

    // ---- cargar datos desde localStorage ----
    function loadFromStorage() {
      const stored = localStorage.getItem('goleanEntries');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            entries = parsed;
          }
        } catch (e) {
          console.warn('Error parseando localStorage, se inicia vacío');
          entries = [];
        }
      } else {
        // datos de ejemplo para mostrar la funcionalidad
        const now = Date.now();
        const sample = [
          { id: 's1_' + now, emotion: 'alegría', thought: 'me siento en paz conmigo mismo', timestamp: now - 3600000 * 2 },
          { id: 's2_' + now, emotion: 'curiosidad', thought: 'explorando mi autoconocimiento', timestamp: now - 3600000 * 5 },
          { id: 's3_' + now, emotion: 'serenidad', thought: 'respirar y observar', timestamp: now - 3600000 * 24 }
        ];
        entries = sample;
        localStorage.setItem('goleanEntries', JSON.stringify(entries));
      }
      renderTimeline();
    }

    // ---- mostrar fecha actual en footer ----
    function setCurrentDate() {
      const now = new Date();
      const dateSpan = document.getElementById('currentDate');
      if (dateSpan) {
        dateSpan.textContent = formatDate(now) + ' · ' + formatTime(now);
      }
    }

    // ---- evento grabar ----
    grabarBtn.addEventListener('click', addEntry);

    // ---- enter en campos (opcional) ----
    emotionInput.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        thoughtInput.focus();
      }
    });
    thoughtInput.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        addEntry();
      }
    });

    // ---- inicio ----
    loadFromStorage();
    setCurrentDate();

    // actualizar fecha cada minuto (solo por estética)
    setInterval(setCurrentDate, 60000);
  })();