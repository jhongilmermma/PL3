(function() {
            "use strict";

            // ===== DATOS DE HABILIDADES =====
            const skillsData = [{
                id: 'autoconocimiento',
                icon: '🧠',
                name: 'Autoconocimiento',
                subtitle: 'Conócete a ti mismo',
                color: '#f5a623',
                desc: 'La capacidad de reconocer y comprender tus propias emociones, fortalezas, debilidades y motivaciones. Es la base de toda la inteligencia emocional.',
                concept: 'El autoconocimiento implica una mirada profunda hacia dentro. Significa estar atento a tus estados emocionales, entender qué los desencadena y cómo afectan tu comportamiento.',
                caracteristicas: [
                    'Reconocimiento de emociones en tiempo real',
                    'Comprensión de fortalezas y debilidades',
                    'Identificación de valores y motivaciones',
                    'Conciencia del impacto emocional en los demás'
                ],
                ejemplos: [
                    'Saber cuándo estás estresado y por qué',
                    'Reconocer tus talentos naturales',
                    'Entender qué te apasiona',
                    'Identificar patrones de comportamiento'
                ],
                frase: '"Conocerse a uno mismo es el principio de toda sabiduría." — Aristóteles'
            }, {
                id: 'autoregulacion',
                icon: '🌊',
                name: 'Autoregulación',
                subtitle: 'Control emocional',
                color: '#4a90d9',
                desc: 'La habilidad de gestionar tus emociones, impulsos y comportamientos de manera saludable y constructiva, respondiendo en lugar de reaccionar.',
                concept: 'La autoregulación te permite mantener el equilibrio emocional incluso en situaciones difíciles. Implica manejar el estrés, controlar impulsos y adaptarte a los cambios con serenidad.',
                caracteristicas: [
                    'Manejo del estrés y la ansiedad',
                    'Control de impulsos y reacciones',
                    'Adaptabilidad ante el cambio',
                    'Capacidad de postergar gratificaciones'
                ],
                ejemplos: [
                    'Mantener la calma en una discusión',
                    'Pensar antes de actuar',
                    'Recuperarse rápidamente de un fracaso',
                    'Gestionar la frustración sin explotar'
                ],
                frase: '"Entre el estímulo y la respuesta hay un espacio. En ese espacio está nuestro poder para elegir." — Viktor Frankl'
            }, {
                id: 'automotivacion',
                icon: '🚀',
                name: 'Automotivación',
                subtitle: 'Impulso interior',
                color: '#e88b4a',
                desc: 'La capacidad de encontrar la fuerza y el entusiasmo para perseguir tus metas, incluso frente a obstáculos y adversidades.',
                concept: 'La automotivación surge de tu interior. Es el deseo de lograr algo por el valor que tiene para ti, no por recompensas externas. Es la chispa que te mantiene en movimiento.',
                caracteristicas: [
                    'Resiliencia ante la adversidad',
                    'Optimismo y actitud positiva',
                    'Persistencia en la búsqueda de metas',
                    'Capacidad de automotivarse sin estímulos externos'
                ],
                ejemplos: [
                    'Seguir adelante después de un fracaso',
                    'Mantener el enfoque en tus sueños',
                    'Buscar soluciones en lugar de quejarte',
                    'Crear tus propias oportunidades'
                ],
                frase: '"El éxito no es la clave de la felicidad. La felicidad es la clave del éxito." — Albert Schweitzer'
            }, {
                id: 'empatia',
                icon: '❤️',
                name: 'Empatía',
                subtitle: 'Conectar con los demás',
                color: '#e8737a',
                desc: 'La capacidad de comprender y compartir los sentimientos de otra persona, poniéndote en su lugar y viendo el mundo desde su perspectiva.',
                concept: 'La empatía va más allá de sentir lástima. Es comprender profundamente la perspectiva del otro, sus emociones y necesidades, sin juzgar. Es la base de las relaciones auténticas.',
                caracteristicas: [
                    'Comprensión de las emociones ajenas',
                    'Escucha activa y atenta',
                    'Capacidad de ponerse en el lugar del otro',
                    'Sensibilidad a las necesidades de los demás'
                ],
                ejemplos: [
                    'Escuchar sin juzgar',
                    'Sentir alegría por el éxito de otro',
                    'Ofrecer apoyo a quien sufre',
                    'Comprender el punto de vista opuesto'
                ],
                frase: '"La empatía es ver con los ojos de otro, escuchar con los oídos de otro y sentir con el corazón de otro." — Alfred Adler'
            }, {
                id: 'social',
                icon: '🤝',
                name: 'Habilidades Sociales',
                subtitle: 'Comunicación efectiva',
                color: '#7a9a6e',
                desc: 'La capacidad de interactuar de manera efectiva y armoniosa con los demás, construyendo relaciones saludables y significativas.',
                concept: 'Las habilidades sociales incluyen la comunicación clara, la resolución de conflictos, el trabajo en equipo y la capacidad de influir positivamente en los demás. Son esenciales para el éxito personal y profesional.',
                caracteristicas: [
                    'Comunicación asertiva y clara',
                    'Resolución de conflictos constructiva',
                    'Trabajo en equipo y colaboración',
                    'Capacidad de influir e inspirar'
                ],
                ejemplos: [
                    'Expresar ideas con claridad',
                    'Negociar acuerdos beneficiosos',
                    'Liderar un equipo con empatía',
                    'Mantener relaciones saludables'
                ],
                frase: '"El arte de la comunicación es el lenguaje del liderazgo." — James Humes'
            }];

            // ===== ESTADO =====
            let reflexiones = [];
            let skillActual = 'autoconocimiento';

            // ===== DOM REFERENCIAS =====
            const navMenu = document.getElementById('navMenu');
            const skillsContainer = document.getElementById('skillsContainer');
            const sidebar = document.getElementById('sidebar');
            const sidebarToggle = document.getElementById('sidebarToggle');
            const sidebarOverlay = document.getElementById('sidebarOverlay');

            // ===== TOGGLE SIDEBAR =====
            function toggleSidebar() {
                sidebar.classList.toggle('open');
                sidebarOverlay.classList.toggle('active');
            }

            sidebarToggle.addEventListener('click', toggleSidebar);
            sidebarOverlay.addEventListener('click', toggleSidebar);

            // Cerrar sidebar al seleccionar un item en móvil
            function closeSidebar() {
                if (window.innerWidth <= 768) {
                    sidebar.classList.remove('open');
                    sidebarOverlay.classList.remove('active');
                }
            }

            // ===== HELPERS =====
            function formatTime(date) {
                return String(date.getHours()).padStart(2, '0') + ':' + String(date.getMinutes()).padStart(2, '0');
            }

            function formatDate(date) {
                return String(date.getDate()).padStart(2, '0') + '/' + String(date.getMonth() + 1).padStart(2, '0') + '/' + date
                    .getFullYear();
            }

            function getSkillById(id) {
                return skillsData.find(s => s.id === id);
            }

            function getReflexionesBySkill(skillId) {
                return reflexiones.filter(r => r.skillId === skillId);
            }

            // ===== RENDER NAV =====
            function renderNav() {
                navMenu.innerHTML = '';
                skillsData.forEach(skill => {
                    const count = getReflexionesBySkill(skill.id).length;
                    const btn = document.createElement('button');
                    btn.className = `nav-item ${skill.id === skillActual ? 'active' : ''}`;
                    btn.dataset.skill = skill.id;
                    btn.innerHTML = `
                        <span class="dot" style="background:${skill.color};"></span>
                        <span class="icon">${skill.icon}</span>
                        <span class="nav-text">${skill.name}</span>
                        <span class="badge-count">${count}</span>
                        <span class="arrow"><i class="fas fa-chevron-right"></i></span>
                    `;
                    btn.addEventListener('click', function() {
                        skillActual = skill.id;
                        renderNav();
                        renderContent();
                        closeSidebar();
                        // Scroll al inicio del contenido
                        document.querySelector('.main-content').scrollIntoView({ behavior: 'smooth', block: 'start' });
                    });
                    navMenu.appendChild(btn);
                });
            }

            // ===== RENDER CONTENT =====
            function renderContent() {
                const skill = getSkillById(skillActual);
                if (!skill) return;

                const reflexionesSkill = getReflexionesBySkill(skill.id);

                let html = `
                    <div class="skill-content active">
                        <!-- HERO -->
                        <div class="skill-hero" style="--skill-color:${skill.color};">
                            <div class="info">
                                <div class="icon">${skill.icon}</div>
                                <h2>${skill.name}</h2>
                                <div class="subtitle">${skill.subtitle}</div>
                                <div class="desc">${skill.desc}</div>
                                <div class="concept">
                                    <div class="label"><i class="fas fa-lightbulb"></i> Concepto clave</div>
                                    <div class="text"><i class="fas fa-arrow-right"></i> ${skill.concept}</div>
                                </div>
                            </div>
                            <div class="stats-box" style="--skill-color:${skill.color};">
                                <h4><i class="fas fa-chart-simple"></i> Datos clave</h4>
                                <div class="stat-item">
                                    <span>🧠 Características</span>
                                    <span class="value">${skill.caracteristicas.length}</span>
                                </div>
                                <div class="stat-item">
                                    <span>📌 Ejemplos prácticos</span>
                                    <span class="value">${skill.ejemplos.length}</span>
                                </div>
                                <div class="stat-item">
                                    <span>💭 Reflexiones</span>
                                    <span class="value">${reflexionesSkill.length}</span>
                                </div>
                                <div class="stat-item" style="border-bottom:none; padding-top:0.5rem; font-style:italic; font-size:0.85rem; color:#6a7a8a;">
                                    "${skill.frase}"
                                </div>
                            </div>
                        </div>

                        <!-- CARDS -->
                        <div class="cards-grid">
                            <div class="info-card" style="--skill-color:${skill.color};">
                                <div class="card-icon">🎯</div>
                                <h4>Características</h4>
                                <ul>
                                    ${skill.caracteristicas.map(c => `<li>${c}</li>`).join('')}
                                </ul>
                            </div>
                            <div class="info-card" style="--skill-color:${skill.color};">
                                <div class="card-icon">✨</div>
                                <h4>Ejemplos prácticos</h4>
                                <div class="tags">
                                    ${skill.ejemplos.map(e => `<span class="tag">${e}</span>`).join('')}
                                </div>
                                <p style="margin-top:0.8rem; font-size:0.85rem; color:#6a7a8a;">
                                    <i class="fas fa-quote-left" style="color:${skill.color};"></i>
                                    ${skill.frase}
                                </p>
                            </div>
                        </div>

                        <!-- REFLEXIONES -->
                        <div class="reflexiones-section" style="--skill-color:${skill.color};">
                            <div class="header-reflexiones">
                                <h3><i class="fas fa-comment"></i> Reflexiones sobre ${skill.name}</h3>
                                <button class="btn-add-reflexion" style="background:${skill.color};">
                                    <i class="fas fa-plus-circle"></i> Agregar reflexión
                                </button>
                            </div>
                            <div class="reflexiones-list" id="reflexionesList_${skill.id}">
                                ${renderReflexiones(skill.id)}
                            </div>
                        </div>
                    </div>
                `;

                skillsContainer.innerHTML = html;

                // Evento agregar reflexión
                const btnAdd = skillsContainer.querySelector('.btn-add-reflexion');
                btnAdd.addEventListener('click', function() {
                    agregarReflexion(skill.id);
                });
            }

            // ===== RENDER REFLEXIONES =====
            function renderReflexiones(skillId) {
                const skill = getSkillById(skillId);
                if (!skill) return '';

                const reflexionesSkill = getReflexionesBySkill(skillId);

                if (reflexionesSkill.length === 0) {
                    return `<div class="empty-reflexiones"><i class="fas fa-hourglass-start" style="margin-right:8px;"></i> Aún no hay reflexiones. ¡Agregá la primera!</div>`;
                }

                const sorted = [...reflexionesSkill].sort((a, b) => b.timestamp - a.timestamp);

                return sorted.map(entry => {
                    const date = new Date(entry.timestamp);
                    return `
                        <div class="reflexion-item" style="--skill-color:${skill.color};">
                            <span class="time-badge">${formatDate(date)} · ${formatTime(date)}</span>
                            <span class="text"><span class="emoji">💭</span> ${entry.texto}</span>
                            <button class="btn-delete" data-id="${entry.id}"><i class="fas fa-trash-alt"></i></button>
                        </div>
                    `;
                }).join('');
            }

            // ===== AGREGAR REFLEXIÓN =====
            function agregarReflexion(skillId) {
                const skill = getSkillById(skillId);
                if (!skill) return;

                const reflexion = prompt(`💭 Escribe una reflexión personal sobre "${skill.name}":`, `Aprendí que ${skill.name.toLowerCase()} me ayuda a...`);

                if (reflexion && reflexion.trim() !== '') {
                    const newEntry = {
                        id: Date.now() + '_' + Math.random().toString(36).substring(2, 6),
                        skillId: skillId,
                        skillName: skill.name,
                        texto: reflexion.trim(),
                        timestamp: Date.now(),
                    };

                    reflexiones.push(newEntry);
                    localStorage.setItem('goleanReflexionesFinal', JSON.stringify(reflexiones));
                    renderNav();
                    renderContent();
                }
            }

            // ===== ELIMINAR REFLEXIÓN =====
            function eliminarReflexion(id) {
                reflexiones = reflexiones.filter(r => r.id !== id);
                localStorage.setItem('goleanReflexionesFinal', JSON.stringify(reflexiones));
                renderNav();
                renderContent();
            }

            // ===== DELEGACIÓN DE EVENTOS PARA ELIMINAR =====
            document.addEventListener('click', function(e) {
                const btn = e.target.closest('.btn-delete');
                if (btn) {
                    const id = btn.dataset.id;
                    if (id) {
                        eliminarReflexion(id);
                    }
                }
            });

            // ===== CARGAR DESDE LOCALSTORAGE =====
            function loadReflexiones() {
                const stored = localStorage.getItem('goleanReflexionesFinal');
                if (stored) {
                    try {
                        const parsed = JSON.parse(stored);
                        if (Array.isArray(parsed)) reflexiones = parsed;
                    } catch (e) { reflexiones = []; }
                } else {
                    // Datos de ejemplo
                    const now = Date.now();
                    const sample = [
                        { id: 's1_' + now, skillId: 'autoconocimiento', skillName: 'Autoconocimiento',
                            texto: 'La meditación me ha ayudado a reconocer mis emociones antes de que me controlen.',
                            timestamp: now - 3600000 * 1 },
                        { id: 's2_' + now, skillId: 'autoregulacion', skillName: 'Autoregulación',
                            texto: 'Aprendí a respirar profundo antes de responder en situaciones tensas.',
                            timestamp: now - 3600000 * 3 },
                        { id: 's3_' + now, skillId: 'automotivacion', skillName: 'Automotivación',
                            texto: 'Tener metas claras me mantiene enfocado incluso cuando las cosas se ponen difíciles.',
                            timestamp: now - 3600000 * 6 },
                        { id: 's4_' + now, skillId: 'empatia', skillName: 'Empatía',
                            texto: 'Escuchar sin interrumpir ha transformado mis relaciones personales.',
                            timestamp: now - 3600000 * 8 },
                        { id: 's5_' + now, skillId: 'social', skillName: 'Habilidades Sociales',
                            texto: 'Expresar mis ideas con claridad me ha abierto muchas puertas.',
                            timestamp: now - 3600000 * 10 },
                    ];
                    reflexiones = sample;
                    localStorage.setItem('goleanReflexionesFinal', JSON.stringify(reflexiones));
                }
            }

            // ===== AJUSTAR ALTURA DEL SIDEBAR EN MÓVIL =====
            function adjustSidebarHeight() {
                if (window.innerWidth <= 768) {
                    sidebar.style.height = '100vh';
                } else {
                    sidebar.style.height = '100vh';
                }
            }

            window.addEventListener('resize', adjustSidebarHeight);

            // ===== INICIO =====
            loadReflexiones();
            renderNav();
            renderContent();
            adjustSidebarHeight();

        })();