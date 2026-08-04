// ==================== MÓDULOS ====================
    let modules = [
        { id:0, icon:"🐾", title:"CLASIFICACIÓN DE ANIMALES", desc:"Agrupa los animales por su hábitat", type:"classification", points:25, unlocked:true, done:false },
        { id:1, icon:"🌳", title:"ECOSISTEMAS DEL MUNDO", desc:"Identifica el ecosistema correcto", type:"ecosystem", points:30, unlocked:false, done:false },
        { id:2, icon:"🌍", title:"HUELLA DE CARBONO", desc:"Calcula tu impacto ambiental", type:"carbon", points:35, unlocked:false, done:false },
        { id:3, icon:"🌿", title:"PLANTAS MEDICINALES", desc:"Reconoce plantas curativas", type:"plants", points:30, unlocked:false, done:false },
        { id:4, icon:"🔄", title:"CICLO DE VIDA", desc:"Ordena el ciclo de vida", type:"lifecycle", points:40, unlocked:false, done:false },
        { id:5, icon:"🌊", title:"BIODIVERSIDAD MARINA", desc:"Identifica especies marinas", type:"marine", points:35, unlocked:false, done:false },
        { id:6, icon:"🏆", title:"GUARDIÁN DE LA TIERRA", desc:"Protege el medio ambiente", type:"guardian", points:50, unlocked:false, done:false }
    ];

    let totalPoints = 0;
    let currentModule = null;
    let selectedAnswer = null;

    function saveProgress() {
        localStorage.setItem('ecoMindPoints', totalPoints);
        localStorage.setItem('ecoModules', JSON.stringify(modules.map(m => ({ done: m.done, unlocked: m.unlocked }))));
    }

    function loadProgress() {
        const savedPts = localStorage.getItem('ecoMindPoints');
        const savedMod = localStorage.getItem('ecoModules');
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
                ${m.done ? '<div class="status-done">✅ Completado</div>' : ''}
                ${!m.unlocked && !m.done ? '<div class="lock-icon">🔒</div>' : ''}
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
        
        let rank = totalPoints >= 230 ? "GUARDIÁN DE LA TIERRA" : totalPoints >= 150 ? "NATURALISTA EXPERTO" : totalPoints >= 80 ? "EXPLORADOR" : totalPoints >= 30 ? "APRENDIZ" : "NOVATO";
        document.getElementById("rankLabel").innerHTML = rank;
        saveProgress();
    }

    function floatPoints(p) {
        for (let i=0;i<4;i++) {
            setTimeout(() => {
                const f = document.createElement("div");
                f.className = "float-particle";
                f.innerHTML = `+${p} 🌿`;
                f.style.left = (Math.random() * window.innerWidth * 0.7 + window.innerWidth * 0.15) + "px";
                f.style.top = "70%";
                f.style.color = "#4ADE80";
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
            document.getElementById("finalMsg").innerHTML = "🎉 ¡FELICIDADES! Eres un verdadero Guardián de la Tierra. Tu conexión con la naturaleza es excepcional.";
            document.getElementById("finalPanel").classList.add("show");
        }
    }

    function openModule(id) {
        currentModule = modules[id];
        selectedAnswer = null;
        const modalBody = document.getElementById("modalBody");
        document.getElementById("modalTitle").innerHTML = `${currentModule.icon} ${currentModule.title}`;
        
        if (currentModule.type === "classification") {
            modalBody.innerHTML = `
                <div class="eco-area">
                    <p class="question-text">🐾 ¿Cuáles animales viven en la selva tropical?</p>
                    <p style="color:#86EFAC; font-size:0.8rem;">Selecciona los 3 animales que habitan en la selva</p>
                    <div class="classification-grid" id="animalGrid"></div>
                </div>
            `;
            const animals = [
                { name: "Tucán", emoji: "🐦", habitat: "selva" },
                { name: "Pingüino", emoji: "🐧", habitat: "polar" },
                { name: "Jaguar", emoji: "🐆", habitat: "selva" },
                { name: "Camello", emoji: "🐫", habitat: "desierto" },
                { name: "Mono", emoji: "🐒", habitat: "selva" },
                { name: "Oso Polar", emoji: "🐻‍❄️", habitat: "polar" }
            ];
            const grid = document.getElementById("animalGrid");
            grid.innerHTML = animals.map((a, idx) => `
                <div class="animal-card" data-idx="${idx}" data-habitat="${a.habitat}">
                    <div class="animal-emoji">${a.emoji}</div>
                    <div class="animal-name">${a.name}</div>
                </div>
            `).join('');
            let selected = [];
            document.querySelectorAll(".animal-card").forEach(card => {
                card.onclick = () => {
                    card.classList.toggle("selected");
                    selected = Array.from(document.querySelectorAll(".animal-card.selected")).map(c => c.dataset.habitat);
                    if (selected.length === 3) {
                        selectedAnswer = selected;
                    }
                };
            });
        }
        else if (currentModule.type === "ecosystem") {
            modalBody.innerHTML = `
                <div class="eco-area">
                    <p class="question-text">🌳 ¿Qué ecosistema tiene mayor biodiversidad?</p>
                    <div class="carbon-options" id="ecoOptions"></div>
                </div>
            `;
            const options = ['🌴 Selva Tropical', '🏜️ Desierto', '🌊 Océano', '🌲 Bosque Templado'];
            const optsDiv = document.getElementById("ecoOptions");
            optsDiv.innerHTML = options.map((o, idx) => `<div class="carbon-option" data-val="${idx}">${o}</div>`).join('');
            document.querySelectorAll(".carbon-option").forEach(opt => {
                opt.onclick = () => {
                    document.querySelectorAll(".carbon-option").forEach(o => o.classList.remove("selected"));
                    opt.classList.add("selected");
                    selectedAnswer = parseInt(opt.dataset.val);
                };
            });
        }
        else if (currentModule.type === "carbon") {
            modalBody.innerHTML = `
                <div class="eco-area">
                    <p class="question-text">🌍 ¿Cuál de estas acciones reduce más la huella de carbono?</p>
                    <div class="carbon-options" id="carbonOptions"></div>
                </div>
            `;
            const options = ['🚲 Usar bicicleta', '💡 Apagar luces', '♻️ Reciclar', '🌱 Plantar árboles'];
            const optsDiv = document.getElementById("carbonOptions");
            optsDiv.innerHTML = options.map((o, idx) => `<div class="carbon-option" data-val="${idx}">${o}</div>`).join('');
            document.querySelectorAll(".carbon-option").forEach(opt => {
                opt.onclick = () => {
                    document.querySelectorAll(".carbon-option").forEach(o => o.classList.remove("selected"));
                    opt.classList.add("selected");
                    selectedAnswer = parseInt(opt.dataset.val);
                };
            });
        }
        else if (currentModule.type === "plants") {
            modalBody.innerHTML = `
                <div class="eco-area">
                    <p class="question-text">🌿 ¿Qué planta medicinal se usa para calmar el dolor de cabeza?</p>
                    <div class="carbon-options" id="plantOptions"></div>
                </div>
            `;
            const options = ['🌿 Manzanilla', '🌿 Menta', '🌿 Lavanda', '🌿 Romero'];
            const optsDiv = document.getElementById("plantOptions");
            optsDiv.innerHTML = options.map((o, idx) => `<div class="carbon-option" data-val="${idx}">${o}</div>`).join('');
            document.querySelectorAll(".carbon-option").forEach(opt => {
                opt.onclick = () => {
                    document.querySelectorAll(".carbon-option").forEach(o => o.classList.remove("selected"));
                    opt.classList.add("selected");
                    selectedAnswer = parseInt(opt.dataset.val);
                };
            });
        }
        else if (currentModule.type === "lifecycle") {
            modalBody.innerHTML = `
                <div class="eco-area">
                    <p class="question-text">🔄 ¿Cuál es el primer paso en el ciclo de vida de una mariposa?</p>
                    <div class="carbon-options" id="lifecycleOptions"></div>
                </div>
            `;
            const options = ['🥚 Huevo', '🐛 Oruga', '🕷️ Crisálida', '🦋 Mariposa'];
            const optsDiv = document.getElementById("lifecycleOptions");
            optsDiv.innerHTML = options.map((o, idx) => `<div class="carbon-option" data-val="${idx}">${o}</div>`).join('');
            document.querySelectorAll(".carbon-option").forEach(opt => {
                opt.onclick = () => {
                    document.querySelectorAll(".carbon-option").forEach(o => o.classList.remove("selected"));
                    opt.classList.add("selected");
                    selectedAnswer = parseInt(opt.dataset.val);
                };
            });
        }
        else if (currentModule.type === "marine") {
            modalBody.innerHTML = `
                <div class="eco-area">
                    <p class="question-text">🌊 ¿Qué especie marina está en peligro de extinción?</p>
                    <div class="carbon-options" id="marineOptions"></div>
                </div>
            `;
            const options = ['🐬 Delfín', '🐋 Ballena', '🐢 Tortuga marina', '🦈 Tiburón'];
            const optsDiv = document.getElementById("marineOptions");
            optsDiv.innerHTML = options.map((o, idx) => `<div class="carbon-option" data-val="${idx}">${o}</div>`).join('');
            document.querySelectorAll(".carbon-option").forEach(opt => {
                opt.onclick = () => {
                    document.querySelectorAll(".carbon-option").forEach(o => o.classList.remove("selected"));
                    opt.classList.add("selected");
                    selectedAnswer = parseInt(opt.dataset.val);
                };
            });
        }
        else if (currentModule.type === "guardian") {
            modalBody.innerHTML = `
                <div class="eco-area">
                    <p class="question-text">🏆 ¿Qué acción tiene mayor impacto positivo en el planeta?</p>
                    <div class="carbon-options" id="guardianOptions"></div>
                </div>
            `;
            const options = ['🌳 Reforestar', '♻️ Reducir plásticos', '💧 Ahorrar agua', '🚗 Transporte público'];
            const optsDiv = document.getElementById("guardianOptions");
            optsDiv.innerHTML = options.map((o, idx) => `<div class="carbon-option" data-val="${idx}">${o}</div>`).join('');
            document.querySelectorAll(".carbon-option").forEach(opt => {
                opt.onclick = () => {
                    document.querySelectorAll(".carbon-option").forEach(o => o.classList.remove("selected"));
                    opt.classList.add("selected");
                    selectedAnswer = parseInt(opt.dataset.val);
                };
            });
        }
        
        document.getElementById("ecoModal").classList.add("active");
    }

    function submitModule() {
        if (currentModule === null) return;
        
        let completed = false;
        let correct = false;
        
        if (currentModule.type === "classification") {
            if (selectedAnswer) {
                let countCorrect = selectedAnswer.filter(a => a === 'selva').length;
                if (countCorrect === 3 && selectedAnswer.length === 3) correct = true;
            }
            if (correct) {
                completed = true;
                alert("🎉 ¡Excelente! Clasificaste correctamente los animales de la selva.");
            } else {
                alert("❌ Los animales de la selva son: Tucán, Jaguar y Mono.");
                closeModal();
                return;
            }
        }
        else if (currentModule.type === "ecosystem") {
            correct = (selectedAnswer === 0);
            if (correct) {
                completed = true;
                alert("🎉 ¡Correcto! La selva tropical tiene la mayor biodiversidad del planeta.");
            } else {
                alert("❌ La selva tropical alberga más del 50% de las especies del mundo.");
                closeModal();
                return;
            }
        }
        else if (currentModule.type === "carbon") {
            correct = (selectedAnswer === 3);
            if (correct) {
                completed = true;
                alert("🎉 ¡Plantar árboles es la acción que más reduce el CO₂!");
            } else {
                alert("❌ Plantar árboles absorbe CO₂ y produce oxígeno, es la mejor acción.");
                closeModal();
                return;
            }
        }
        else if (currentModule.type === "plants") {
            correct = (selectedAnswer === 0);
            if (correct) {
                completed = true;
                alert("🎉 ¡Correcto! La manzanilla es conocida por sus propiedades relajantes.");
            } else {
                alert("❌ La manzanilla es la planta medicinal más usada para dolores de cabeza.");
                closeModal();
                return;
            }
        }
        else if (currentModule.type === "lifecycle") {
            correct = (selectedAnswer === 0);
            if (correct) {
                completed = true;
                alert("🎉 ¡Correcto! El ciclo comienza con el huevo.");
            } else {
                alert("❌ El ciclo correcto es: Huevo → Oruga → Crisálida → Mariposa.");
                closeModal();
                return;
            }
        }
        else if (currentModule.type === "marine") {
            correct = (selectedAnswer === 2);
            if (correct) {
                completed = true;
                alert("🎉 ¡Correcto! Las tortugas marinas están en peligro crítico de extinción.");
            } else {
                alert("❌ Las tortugas marinas son una de las especies más amenazadas.");
                closeModal();
                return;
            }
        }
        else if (currentModule.type === "guardian") {
            correct = (selectedAnswer === 0);
            if (correct) {
                completed = true;
                alert("🎉 ¡Eres un Guardián de la Tierra! Reforestar salva el planeta.");
            } else {
                alert("❌ Reforestar tiene el mayor impacto positivo a largo plazo.");
                closeModal();
                return;
            }
        }
        
        if (completed) {
            completeModule(currentModule.id, currentModule.points);
            closeModal();
        }
    }

    function closeModal() {
        document.getElementById("ecoModal").classList.remove("active");
        currentModule = null;
        selectedAnswer = null;
    }

    document.getElementById("closeModalBtn").onclick = closeModal;
    document.getElementById("submitModalBtn").onclick = submitModule;
    document.getElementById("closeFinalBtn").onclick = () => document.getElementById("finalPanel").classList.remove("show");

    loadProgress();