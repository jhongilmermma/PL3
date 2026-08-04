(function() {
            "use strict";

            // ---- DOM ----
            const situationInput = document.getElementById('situationInput');
            const actionInput = document.getElementById('actionInput');
            const grabarBtn = document.getElementById('grabarBtn');
            const timelineContainer = document.getElementById('timelineContainer');
            const emptyMessage = document.getElementById('emptyMessage');
            const entryCounter = document.getElementById('entryCounter');
            const tipSocial = document.getElementById('tipSocial');

            // ---- Mapa de habilidades sociales ----
            const socialMap = {
                'escuchar': { face: '👂', reflection: 'La escucha activa construye puentes de confianza.' },
                'comunicar': { face: '💬', reflection: 'Comunicar con claridad evita malentendidos.' },
                'empatía': { face: '🤝', reflection: 'La empatía fortalece cualquier vínculo social.' },
                'asertivo': { face: '😌', reflection: 'Ser asertivo es expresar tus necesidades con respeto.' },
                'conflicto': { face: '⚖️', reflection: 'Resolver conflictos con calma y diálogo.' },
                'colaborar': { face: '🤲', reflection: 'La colaboración multiplica los resultados.' },
                'respeto': { face: '🙏', reflection: 'El respeto es la base de toda interacción.' },
                'paciencia': { face: '🧘', reflection: 'La paciencia en las relaciones da frutos.' },
                'amabilidad': { face: '😊', reflection: 'La amabilidad abre puertas y corazones.' },
                'humor': { face: '😄', reflection: 'El humor sano alivia tensiones y conecta.' },
                'gratitud': { face: '🌟', reflection: 'Agradecer fortalece los lazos sociales.' },
                'honestidad': { face: '💎', reflection: 'La honestidad construye relaciones auténticas.' },
                'liderazgo': { face: '👑', reflection: 'Liderar con ejemplo y escucha activa.' },
                'negociación': { face: '🤝', reflection: 'Negociar es encontrar puntos en común.' },
                'adaptación': { face: '🔄', reflection: 'Adaptarse a los demás es una gran habilidad.' },
                'iniciativa': { face: '🚀', reflection: 'Tomar iniciativa en lo social abre oportunidades.' },
                'escucha': { face: '👂', reflection: 'Escuchar es el primer paso para entender.' },
            };

            function getSocialData(text) {
                const lower = text.toLowerCase().trim();
                for (const [key, value] of Object.entries(socialMap)) {
                    if (lower.includes(key) || key.includes(lower)) {
                        return value;
                    }
                }
                return { face: '🤗', reflection: 'Cada interacción es una oportunidad para crecer.' };
            }

            // ---- Consejos sociales aleatorios ----
            const consejos = [
                '"La escucha activa es la base de toda buena relación."',
                '"La comunicación clara evita malentendidos."',
                '"La empatía abre puertas que la lógica no puede."',
                '"El respeto es el cimiento de cualquier vínculo."',
                '"La paciencia en las relaciones es una virtud poderosa."',
                '"Una sonrisa puede cambiar el ambiente de una conversación."',
                '"La honestidad construye confianza duradera."',
                '"La colaboración hace que los sueños se hagan realidad."',
                '"La asertividad es equilibrio entre tus derechos y los de los demás."',
                '"Cada persona tiene una historia que vale la pena escuchar."'
            ];

            function cambiarConsejo() {
                const random = consejos[Math.floor(Math.random() * consejos.length)];
                tipSocial.innerHTML = `<i class="fas fa-lightbulb"></i> ${random}`;
            }

            // ---- Estado ----
            let registros = [];

            // ---- Helpers ----
            function formatTime(date) {
                return String(date.getHours()).padStart(2, '0') + ':' + String(date.getMinutes()).padStart(2, '0');
            }

            function formatDate(date) {
                return String(date.getDate()).padStart(2, '0') + '/' + String(date.getMonth() + 1).padStart(2, '0') + '/' + date
                    .getFullYear();
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
                    textSpan.textContent = entry.action || '';

                    const reflectionBox = document.createElement('span');
                    reflectionBox.className = 'reflection-box';
                    reflectionBox.innerHTML = `<i class="fas fa-lightbulb"></i> ${entry.reflection || 'Cada interacción es una oportunidad.'}`;

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
                localStorage.setItem('goleanSocial', JSON.stringify(registros));
                renderTimeline();
                cambiarConsejo();
            }

            // ---- Agregar registro ----
            function addRegistro() {
                let situation = situationInput.value.trim();
                let action = actionInput.value.trim();

                if (!situation && !action) {
                    situation = 'interacción social';
                    action = 'observé y participé';
                } else if (!situation) {
                    situation = 'situación social';
                }

                const data = getSocialData(situation + ' ' + action);

                const newEntry = {
                    id: Date.now() + '_' + Math.random().toString(36).substring(2, 6),
                    situation: situation,
                    action: action,
                    timestamp: Date.now(),
                    face: data.face,
                    reflection: data.reflection,
                };

                registros.push(newEntry);
                localStorage.setItem('goleanSocial', JSON.stringify(registros));

                // Limpiar
                situationInput.value = '';
                actionInput.value = '';
                situationInput.placeholder = 'Ej. una conversación con un compañero...';
                actionInput.placeholder = '¿Cómo actuaste?';

                renderTimeline();
                cambiarConsejo();
                timelineContainer.scrollTop = 0;
            }

            // ---- Cargar desde localStorage ----
            function loadRegistros() {
                const stored = localStorage.getItem('goleanSocial');
                if (stored) {
                    try {
                        const parsed = JSON.parse(stored);
                        if (Array.isArray(parsed)) registros = parsed;
                    } catch (e) { registros = []; }
                } else {
                    // datos de ejemplo
                    const now = Date.now();
                    const sample = [
                        { id: 's1_' + now, situation: 'una reunión de trabajo', action: 'escuché activamente y propuse soluciones',
                            timestamp: now - 3600000 * 2, face: '👂',
                            reflection: 'La escucha activa construye puentes de confianza.' },
                        { id: 's2_' + now, situation: 'un amigo con problemas', action: 'le ofrecí mi apoyo y compañía',
                            timestamp: now - 3600000 * 5, face: '🤝',
                            reflection: 'La empatía fortalece cualquier vínculo social.' },
                        { id: 's3_' + now, situation: 'un conflicto con un familiar', action: 'mantuvimos un diálogo calmado y respetuoso',
                            timestamp: now - 3600000 * 24, face: '⚖️',
                            reflection: 'Resolver conflictos con calma y diálogo.' },
                    ];
                    registros = sample;
                    localStorage.setItem('goleanSocial', JSON.stringify(registros));
                }
                renderTimeline();
                cambiarConsejo();
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
                    actionInput.focus();
                }
            });
            actionInput.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    addRegistro();
                }
            });

            // Cambiar consejo cada 30 segundos
            setInterval(cambiarConsejo, 30000);

            // ---- Inicio ----
            loadRegistros();
            setCurrentDate();
            setInterval(setCurrentDate, 60000);
        })();