(function() {
    "use strict";

    // ---- DOM ----
    const btnIniciar = document.getElementById('btnIniciar');
    const btnDetener = document.getElementById('btnDetener');
    const faseTexto = document.getElementById('faseTexto');
    const timerDisplay = document.getElementById('timerDisplay');
    const circulo = document.getElementById('circuloIndicador');
    const timelineContainer = document.getElementById('timelineContainer');
    const emptyMessage = document.getElementById('emptyMessage');
    const entryCounter = document.getElementById('entryCounter');

    // ---- Estado de respiración ----
    let cicloActivo = false;
    let temporizador = null;
    let faseActual = 0; // 0:inhalar, 1:pausa, 2:exhalar, 3:pausa
    let tiempoRestante = 4; // segundos
    const DURACION_FASE = 4; // 4 segundos cada fase
    let cicloCompleto = 0; // contador de ciclos completos

    // ---- Almacén de sesiones ----
    let sesiones = [];

    // ---- Mapa de emociones para reflejos (usamos las mismas del paso 1 pero orientado a regulación) ----
    const emotionMap = {
      'calma': { face: '😌', reflection: 'La calma es el centro. Respirar te ancla.' },
      'serenidad': { face: '😌', reflection: 'Serenidad: el poder de la pausa.' },
      'concentración': { face: '🧘', reflection: 'La respiración enfoca tu mente.' },
      'paz': { face: '☮️', reflection: 'Paz interior, cada inhalación te acerca.' },
      'control': { face: '💪', reflection: 'El autocontrol nace en la respiración.' },
      'relajación': { face: '😊', reflection: 'Relajación profunda, soltá el estrés.' },
      'atención': { face: '👁️', reflection: 'Atención plena en el aquí y ahora.' },
      'equilibrio': { face: '⚖️', reflection: 'Equilibrio emocional, respirá consciente.' },
      'fortaleza': { face: '🌟', reflection: 'La respiración te da fortaleza interior.' },
      'confianza': { face: '😎', reflection: 'Confianza en tu capacidad de regular.' },
    };

    function getEmotionData(emotion) {
      const key = emotion.toLowerCase().trim();
      for (const [k, v] of Object.entries(emotionMap)) {
        if (key.includes(k) || k.includes(key)) return v;
      }
      return { face: '🧘', reflection: 'Cada respiración es un paso hacia el autocontrol.' };
    }

    // ---- Funciones de UI ----
    function actualizarUI() {
      const fases = ['Inhalar', 'Pausa', 'Exhalar', 'Pausa'];
      const colores = ['inhale', 'pause', 'exhale', 'pause'];
      faseTexto.textContent = fases[faseActual];
      circulo.className = 'circle-indicator ' + colores[faseActual];
      timerDisplay.textContent = tiempoRestante + 's';
    }

    function detenerCiclo() {
      if (temporizador) {
        clearInterval(temporizador);
        temporizador = null;
      }
      cicloActivo = false;
      faseTexto.textContent = 'Detenido';
      circulo.className = 'circle-indicator';
      timerDisplay.textContent = '0s';
      btnIniciar.innerHTML = '<i class="fas fa-play"></i> Iniciar';
    }

    function iniciarCiclo() {
      if (cicloActivo) return;
      // Si ya hay un temporizador, limpiar
      if (temporizador) {
        clearInterval(temporizador);
        temporizador = null;
      }
      // Resetear estado
      faseActual = 0;
      tiempoRestante = DURACION_FASE;
      cicloActivo = true;
      btnIniciar.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> En curso';
      actualizarUI();

      // Registrar inicio de sesión (se guarda al completar 1 ciclo completo o al detener)
      // Guardamos el inicio para luego registrar sesión

      temporizador = setInterval(() => {
        tiempoRestante--;
        if (tiempoRestante <= 0) {
          // Cambiar de fase
          faseActual = (faseActual + 1) % 4;
          tiempoRestante = DURACION_FASE;
          // Si volvemos a inhalar (fase 0) es un ciclo completo
          if (faseActual === 0) {
            cicloCompleto++;
            // Registrar sesión cada ciclo completo (opcional: solo si se completó al menos 1)
            registrarSesion('completado');
          }
          actualizarUI();
        } else {
          actualizarUI();
        }
      }, 1000);
    }

    // ---- Registrar sesión en timeline ----
    function registrarSesion(estado = 'completado') {
      const now = Date.now();
      const date = new Date(now);
      const emotion = 'autocontrol';
      const thought = `Respiración cuadrada · ${cicloCompleto} ciclo${cicloCompleto > 1 ? 's' : ''}`;
      
      const data = getEmotionData(emotion);
      const face = data.face;
      const reflection = data.reflection;

      const entry = {
        id: now + '_' + Math.random().toString(36).substring(2, 6),
        emotion: emotion,
        thought: thought,
        timestamp: now,
        face: face,
        reflection: reflection,
        ciclos: cicloCompleto,
      };
      sesiones.push(entry);
      localStorage.setItem('goleanSesiones', JSON.stringify(sesiones));
      renderTimeline();
    }

    // ---- Renderizar timeline ----
    function renderTimeline() {
      const items = timelineContainer.querySelectorAll('.timeline-item');
      items.forEach(el => el.remove());

      if (sesiones.length === 0) {
        emptyMessage.style.display = 'block';
        entryCounter.textContent = '0 sesiones';
        return;
      }
      emptyMessage.style.display = 'none';
      entryCounter.textContent = `${sesiones.length} sesión${sesiones.length > 1 ? 'es' : ''}`;

      const sorted = [...sesiones].sort((a, b) => b.timestamp - a.timestamp);

      for (const entry of sorted) {
        const date = new Date(entry.timestamp);
        const timeStr = String(date.getHours()).padStart(2,'0') + ':' + String(date.getMinutes()).padStart(2,'0');
        const dateStr = String(date.getDate()).padStart(2,'0') + '/' + String(date.getMonth()+1).padStart(2,'0') + '/' + date.getFullYear();

        const item = document.createElement('div');
        item.className = 'timeline-item';

        const badge = document.createElement('span');
        badge.className = 'time-badge';
        badge.innerHTML = `<i class="far fa-clock" style="margin-right: 4px;"></i> ${dateStr} · ${timeStr}`;

        const emotionSpan = document.createElement('span');
        emotionSpan.className = 'entry-emotion';
        emotionSpan.innerHTML = `<span class="face">${entry.face || '🧘'}</span> ${entry.emotion || 'autocontrol'}`;

        const textSpan = document.createElement('span');
        textSpan.className = 'entry-text';
        textSpan.textContent = entry.thought || '';

        const reflectionBox = document.createElement('span');
        reflectionBox.className = 'reflection-box';
        reflectionBox.innerHTML = `<i class="fas fa-lightbulb"></i> ${entry.reflection || 'Respirar es regular.'}`;

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn-borrar';
        deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
        deleteBtn.addEventListener('click', function(e) {
          e.stopPropagation();
          eliminarSesion(entry.id);
        });

        item.appendChild(badge);
        item.appendChild(emotionSpan);
        item.appendChild(textSpan);
        item.appendChild(reflectionBox);
        item.appendChild(deleteBtn);

        timelineContainer.prepend(item);
      }
    }

    function eliminarSesion(id) {
      sesiones = sesiones.filter(s => s.id !== id);
      localStorage.setItem('goleanSesiones', JSON.stringify(sesiones));
      renderTimeline();
    }

    // ---- Cargar desde localStorage ----
    function loadSesiones() {
      const stored = localStorage.getItem('goleanSesiones');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) sesiones = parsed;
        } catch (e) { sesiones = []; }
      } else {
        // datos de ejemplo
        const now = Date.now();
        const sample = [
          { id: 's1_' + now, emotion: 'autocontrol', thought: 'Respiración cuadrada · 3 ciclos', timestamp: now - 3600000 * 1, face: '🧘', reflection: 'La respiración te da fortaleza interior.' },
          { id: 's2_' + now, emotion: 'autocontrol', thought: 'Respiración cuadrada · 5 ciclos', timestamp: now - 3600000 * 4, face: '😌', reflection: 'Serenidad: el poder de la pausa.' },
        ];
        sesiones = sample;
        localStorage.setItem('goleanSesiones', JSON.stringify(sesiones));
      }
      renderTimeline();
    }

    // ---- Fecha en footer ----
    function setCurrentDate() {
      const now = new Date();
      document.getElementById('currentDate').textContent = 
        String(now.getDate()).padStart(2,'0') + '/' + String(now.getMonth()+1).padStart(2,'0') + '/' + now.getFullYear() + ' · ' +
        String(now.getHours()).padStart(2,'0') + ':' + String(now.getMinutes()).padStart(2,'0');
    }

    // ---- Eventos ----
    btnIniciar.addEventListener('click', iniciarCiclo);
    btnDetener.addEventListener('click', function() {
      detenerCiclo();
      // Si se detiene y hay ciclos completos, registrar sesión (si no se registró ya)
      if (cicloCompleto > 0) {
        // evitar duplicados si ya se registró al completar ciclo
        // pero podemos registrar solo si no se registró en el último ciclo
        // mejor: registrar al detener si hay ciclos completos y no se registró recientemente
        // Revisar si la última sesión tiene el mismo número de ciclos
        let ultima = sesiones.length > 0 ? sesiones[sesiones.length - 1] : null;
        if (!ultima || ultima.ciclos !== cicloCompleto) {
          registrarSesion('detenido');
        }
      }
      cicloCompleto = 0;
      btnIniciar.innerHTML = '<i class="fas fa-play"></i> Iniciar';
    });

    // ---- Inicio ----
    loadSesiones();
    setCurrentDate();
    setInterval(setCurrentDate, 60000);
  })();