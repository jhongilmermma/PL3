// ==================== MÓDULOS DE INTELIGENCIA INTERPERSONAL ====================
    let modules = [
        { id:0, icon:"👂", title:"ESCUCHA ACTIVA", desc:"Comprende lo que otros sienten", type:"listening", points:25, unlocked:true, done:false },
        { id:1, icon:"💬", title:"COMUNICACIÓN ASERTIVA", desc:"Expresa tus ideas con respeto", type:"assertive", points:30, unlocked:false, done:false },
        { id:2, icon:"🤝", title:"RESOLUCIÓN DE CONFLICTOS", desc:"Media entre dos personas", type:"conflict", points:35, unlocked:false, done:false },
        { id:3, icon:"💞", title:"EMPATÍA", desc:"Ponte en los zapatos del otro", type:"empathy", points:30, unlocked:false, done:false },
        { id:4, icon:"🎭", title:"ROL PLAY", desc:"Comprende diferentes perspectivas", type:"roleplay", points:40, unlocked:false, done:false },
        { id:5, icon:"🤲", title:"TRABAJO EN EQUIPO", desc:"Colaboración efectiva", type:"teamwork", points:35, unlocked:false, done:false },
        { id:6, icon:"🏆", title:"LIDERAZGO SOCIAL", desc:"Inspira y conecta", type:"leadership", points:50, unlocked:false, done:false }
    ];

    let totalPoints = 0;
    let currentModule = null;
    let selectedAnswer = null;

    function saveProgress() {
        localStorage.setItem('socialMindPoints', totalPoints);
        localStorage.setItem('socialModules', JSON.stringify(modules.map(m => ({ done: m.done, unlocked: m.unlocked }))));
    }

    function loadProgress() {
        const savedPts = localStorage.getItem('socialMindPoints');
        const savedMod = localStorage.getItem('socialModules');
        if (savedPts) totalPoints = parseInt(savedPts);
        if (savedMod) {
            const saved = JSON.parse(savedMod);
            modules.forEach((m, idx) => {
                if (saved[idx]) {
                    m.done = saved[idx].done;
                    m.unlocked = saved[idx].unlocked;
                }
            });
        }
        modules[0].unlocked = true;
        for (let i = 1; i < modules.length; i++) {
            if (modules[i-1].done && !modules[i].unlocked) modules[i].unlocked = true;
        }
        renderModules();
    }

    function renderModules() {
        const grid = document.getElementById("modulesGrid");
        grid.innerHTML = "";
        modules.forEach((m, idx) => {
            const card = document.createElement("div");
            card.className = "module-card";
            if (m.done) card.classList.add("completed");
            if (!m.unlocked && !m.done) card.classList.add("locked");
            card.innerHTML = `
                <div class="module-icon">${m.icon}</div>
                <div class="module-title">${m.title}</div>
                <div class="module-desc">${m.desc}</div>
                <div class="module-points">🏆 ${m.points} pts</div>
                ${m.done ? '<div style="color:#10B981; margin-top:8px;">✅ Completado</div>' : ''}
                ${!m.unlocked && !m.done ? '<div style="position:absolute; top:1rem; right:1rem;">🔒</div>' : ''}
            `;
            if (!m.done && m.unlocked) card.onclick = () => openModule(idx);
            grid.appendChild(card);
        });
        updateStats();
    }

    function updateStats() {
        const doneCount = modules.filter(m => m.done).length;
        document.getElementById("pointsTotal").innerText = totalPoints;
        document.getElementById("completedCount").innerHTML = `${doneCount}/${modules.length}`;
        const percent = (doneCount / modules.length) * 100;
        document.getElementById("globalProgress").style.width = percent + "%";
        
        let rank = totalPoints >= 230 ? "MAESTRO SOCIAL" : totalPoints >= 150 ? "CONECTOR" : totalPoints >= 80 ? "EXPLORADOR" : totalPoints >= 30 ? "APRENDIZ" : "NOVATO";
        document.getElementById("rankLabel").innerHTML = rank;
        saveProgress();
    }

    function floatPoints(p) {
        for (let i=0;i<4;i++) {
            setTimeout(() => {
                const f = document.createElement("div");
                f.className = "float-particle";
                f.innerHTML = `+${p} 🤝`;
                f.style.left = (Math.random() * window.innerWidth * 0.7 + window.innerWidth * 0.15) + "px";
                f.style.top = "70%";
                f.style.color = "#60A5FA";
                document.body.appendChild(f);
                setTimeout(() => f.remove(), 1500);
            }, i*70);
        }
    }

    function completeModule(id, earned) {
        if (modules[id].done) return;
        modules[id].done = true;
        totalPoints += earned;
        floatPoints(earned);
        for (let i = 1; i < modules.length; i++) {
            if (modules[i-1].done && !modules[i].unlocked) modules[i].unlocked = true;
        }
        renderModules();
        
        if (modules.filter(m => m.done).length === modules.length) {
            document.getElementById("finalRank").innerHTML = `🏅 ${document.getElementById("rankLabel").innerHTML} · ${totalPoints} pts`;
            document.getElementById("finalMsg").innerHTML = "🎉 ¡FELICIDADES! Has desarrollado tu inteligencia interpersonal. Ahora conectas mejor con los demás.";
            document.getElementById("finalPanel").classList.add("show");
        }
    }

    // ========== APERTURA DE MÓDULOS ==========
    function openModule(id) {
        currentModule = modules[id];
        selectedAnswer = null;
        const modalBody = document.getElementById("modalBody");
        document.getElementById("modalTitle").innerHTML = `${currentModule.icon} ${currentModule.title}`;
        
        if (currentModule.type === "listening") {
            modalBody.innerHTML = `
                <div class="social-area">
                    <div class="avatar-container">
                        <div class="avatar">👤</div>
                    </div>
                    <div class="chat-bubble">
                        <strong>📢 Situación:</strong> Tu amigo te dice: "Últimamente me siento muy solo, siento que nadie me entiende..."
                    </div>
                    <p style="color:#60A5FA; margin:0.5rem 0;">¿Cómo responderías?</p>
                    <div class="response-options" id="listeningOptions"></div>
                </div>
            `;
            const responses = [
                "Entiendo cómo te sientes, ¿quieres hablar más de eso?",
                "No te preocupes, a todos nos pasa. ¡Anímate!",
                "Bueno, tienes que ser más positivo y socializar más",
                "¿Has intentado hacer nuevos amigos?"
            ];
            const optsDiv = document.getElementById("listeningOptions");
            optsDiv.innerHTML = responses.map((r, idx) => `<div class="response-btn" data-val="${idx}">${r}</div>`).join('');
            document.querySelectorAll(".response-btn").forEach(btn => {
                btn.onclick = () => {
                    document.querySelectorAll(".response-btn").forEach(b => b.classList.remove("selected"));
                    btn.classList.add("selected");
                    selectedAnswer = btn.dataset.val;
                };
            });
        }
        else if (currentModule.type === "assertive") {
            modalBody.innerHTML = `
                <div class="social-area">
                    <p style="color:#60A5FA;">💬 Escenario: Un compañero interrumpe constantemente tu trabajo</p>
                    <div class="response-options" id="assertiveOptions"></div>
                </div>
            `;
            const responses = [
                "Disculpa, necesito concentrarme para terminar mi trabajo ¿Podemos hablar después?",
                "¡Deja de interrumpirme, eres muy molesto!",
                "No importa, sigue interrumpiendo",
                "Me voy a quejar con el jefe"
            ];
            const optsDiv = document.getElementById("assertiveOptions");
            optsDiv.innerHTML = responses.map((r, idx) => `<div class="response-btn" data-val="${idx}">${r}</div>`).join('');
            document.querySelectorAll(".response-btn").forEach(btn => {
                btn.onclick = () => {
                    document.querySelectorAll(".response-btn").forEach(b => b.classList.remove("selected"));
                    btn.classList.add("selected");
                    selectedAnswer = btn.dataset.val;
                };
            });
        }
        else if (currentModule.type === "conflict") {
            modalBody.innerHTML = `
                <div class="social-area">
                    <p style="color:#60A5FA;">🤝 Conflicto: Dos amigos discuten por un malentendido</p>
                    <div class="response-options" id="conflictOptions"></div>
                </div>
            `;
            const responses = [
                "Invitar a ambos a hablar en privado y ayudarles a expresar sus sentimientos",
                "Tomar partido por uno de ellos",
                "Ignorar el conflicto y esperar que se resuelva solo",
                "Decirles que dejen de pelear y ya"
            ];
            const optsDiv = document.getElementById("conflictOptions");
            optsDiv.innerHTML = responses.map((r, idx) => `<div class="response-btn" data-val="${idx}">${r}</div>`).join('');
            document.querySelectorAll(".response-btn").forEach(btn => {
                btn.onclick = () => {
                    document.querySelectorAll(".response-btn").forEach(b => b.classList.remove("selected"));
                    btn.classList.add("selected");
                    selectedAnswer = btn.dataset.val;
                };
            });
        }
        else if (currentModule.type === "empathy") {
            modalBody.innerHTML = `
                <div class="social-area">
                    <div class="avatar-container">
                        <div class="avatar">😢</div>
                    </div>
                    <div class="chat-bubble">
                        <strong>📢 Escenario:</strong> Un compañero acaba de perder a un ser querido y regresa al trabajo.
                    </div>
                    <div class="empathy-scale" id="empathyScale"></div>
                </div>
            `;
            const levels = ['😐 Indiferente', '🙁 Poca empatía', '😌 Algo empático', '😢 Empático', '🤗 Muy empático'];
            const scaleDiv = document.getElementById("empathyScale");
            scaleDiv.innerHTML = levels.map((l, idx) => `<div class="empathy-option" data-val="${idx}">${l}</div>`).join('');
            document.querySelectorAll(".empathy-option").forEach(opt => {
                opt.onclick = () => {
                    document.querySelectorAll(".empathy-option").forEach(o => o.classList.remove("selected"));
                    opt.classList.add("selected");
                    selectedAnswer = parseInt(opt.dataset.val);
                };
            });
        }
        else if (currentModule.type === "roleplay") {
            modalBody.innerHTML = `
                <div class="social-area">
                    <p style="color:#60A5FA;">🎭 Elige un personaje y describe cómo se siente</p>
                    <div class="role-cards" id="roleCards"></div>
                    <textarea id="roleDescription" rows="3" placeholder="Describe cómo se siente esta persona y qué necesita..." style="width:100%; margin-top:1rem; background:#1E293B; border:1px solid #334155; border-radius:1rem; padding:0.8rem; color:white;"></textarea>
                </div>
            `;
            const roles = ['😊 Persona optimista', '😔 Persona triste', '😤 Persona frustrada', '😰 Persona ansiosa'];
            const cardsDiv = document.getElementById("roleCards");
            cardsDiv.innerHTML = roles.map((r, idx) => `<div class="role-card" data-role="${idx}">${r}</div>`).join('');
            document.querySelectorAll(".role-card").forEach(card => {
                card.onclick = () => {
                    document.querySelectorAll(".role-card").forEach(c => c.classList.remove("selected"));
                    card.classList.add("selected");
                    selectedAnswer = card.dataset.role;
                };
            });
        }
        else if (currentModule.type === "teamwork") {
            modalBody.innerHTML = `
                <div class="social-area">
                    <p style="color:#60A5FA;">🤲 Trabajo en equipo: Tu equipo debe entregar un proyecto importante</p>
                    <div class="response-options" id="teamworkOptions"></div>
                </div>
            `;
            const responses = [
                "Organizar una reunión para delegar tareas según las fortalezas de cada uno",
                "Hacer todo yo mismo para asegurar la calidad",
                "Esperar a que alguien tome el liderazgo",
                "Criticar a los que no trabajan rápido"
            ];
            const optsDiv = document.getElementById("teamworkOptions");
            optsDiv.innerHTML = responses.map((r, idx) => `<div class="response-btn" data-val="${idx}">${r}</div>`).join('');
            document.querySelectorAll(".response-btn").forEach(btn => {
                btn.onclick = () => {
                    document.querySelectorAll(".response-btn").forEach(b => b.classList.remove("selected"));
                    btn.classList.add("selected");
                    selectedAnswer = btn.dataset.val;
                };
            });
        }
        else if (currentModule.type === "leadership") {
            modalBody.innerHTML = `
                <div class="social-area">
                    <p style="color:#60A5FA;">🏆 Un buen líder social...</p>
                    <div class="response-options" id="leadershipOptions"></div>
                </div>
            `;
            const responses = [
                "Escucha, inspira y empodera a los demás",
                "Da órdenes sin explicación",
                "Hace todo él mismo",
                "Solo busca su propio beneficio"
            ];
            const optsDiv = document.getElementById("leadershipOptions");
            optsDiv.innerHTML = responses.map((r, idx) => `<div class="response-btn" data-val="${idx}">${r}</div>`).join('');
            document.querySelectorAll(".response-btn").forEach(btn => {
                btn.onclick = () => {
                    document.querySelectorAll(".response-btn").forEach(b => b.classList.remove("selected"));
                    btn.classList.add("selected");
                    selectedAnswer = btn.dataset.val;
                };
            });
        }
        
        document.getElementById("socialModal").classList.add("active");
    }

    function submitModule() {
        if (currentModule === null) return;
        
        let completed = false;
        let correctAnswer = false;
        
        if (currentModule.type === "listening") {
            correctAnswer = (selectedAnswer == 0);
            if (correctAnswer) {
                completed = true;
                alert("🎉 ¡Excelente! La escucha activa es fundamental para conectar con los demás.");
            } else {
                alert("❌ La mejor respuesta es validar los sentimientos de la otra persona antes de dar consejos.");
            }
        }
        else if (currentModule.type === "assertive") {
            correctAnswer = (selectedAnswer == 0);
            if (correctAnswer) {
                completed = true;
                alert("🎉 ¡Comunicación asertiva! Expresas tus necesidades sin agredir.");
            } else {
                alert("❌ La comunicación asertiva expresa lo que sientes sin atacar al otro.");
            }
        }
        else if (currentModule.type === "conflict") {
            correctAnswer = (selectedAnswer == 0);
            if (correctAnswer) {
                completed = true;
                alert("🎉 ¡Mediador nato! Ayudaste a resolver el conflicto constructivamente.");
            } else {
                alert("❌ La mejor forma es mediar y ayudar a que ambos expresen sus sentimientos.");
            }
        }
        else if (currentModule.type === "empathy") {
            if (selectedAnswer >= 3) {
                completed = true;
                alert("🎉 ¡Alta empatía! Ponerse en el lugar del otro es una habilidad invaluable.");
            } else {
                alert("❌ Practica más la empatía. Intenta sentir lo que otros sienten.");
            }
        }
        else if (currentModule.type === "roleplay") {
            const description = document.getElementById("roleDescription")?.value;
            if (description && description.length > 15) {
                completed = true;
                alert("🎉 ¡Excelente análisis! Comprender diferentes perspectivas es clave.");
            } else {
                alert("❌ Describe con más detalle cómo se siente la persona que elegiste.");
                return;
            }
        }
        else if (currentModule.type === "teamwork") {
            correctAnswer = (selectedAnswer == 0);
            if (correctAnswer) {
                completed = true;
                alert("🎉 ¡Gran líder de equipo! Delegar según fortalezas maximiza el resultado.");
            } else {
                alert("❌ El trabajo en equipo efectivo se basa en colaboración y delegación.");
            }
        }
        else if (currentModule.type === "leadership") {
            correctAnswer = (selectedAnswer == 0);
            if (correctAnswer) {
                completed = true;
                alert("🎉 ¡Líder excepcional! El verdadero líder inspira y empodera.");
            } else {
                alert("❌ Un buen líder escucha, inspira y trabaja con el equipo.");
            }
        }
        
        if (completed) {
            completeModule(currentModule.id, currentModule.points);
            closeModal();
        } else if (currentModule.type !== "empathy" && currentModule.type !== "roleplay") {
            closeModal();
        }
    }

    function closeModal() {
        document.getElementById("socialModal").classList.remove("active");
        currentModule = null;
        selectedAnswer = null;
    }

    document.getElementById("closeModalBtn").onclick = closeModal;
    document.getElementById("submitModalBtn").onclick = submitModule;
    document.getElementById("closeFinalBtn").onclick = () => document.getElementById("finalPanel").classList.remove("show");

    loadProgress();