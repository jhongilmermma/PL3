// ==================== PRÁCTICAS DE INTELIGENCIA INTRAPERSONAL ====================
    let practices = [
        { id:0, icon:"🧘", title:"RESPIRACIÓN CONSCIENTE", desc:"Conecta con tu respiración", type:"breathing", points:25, unlocked:true, done:false, duration:60 },
        { id:1, icon:"🙏", title:"GRATITUD", desc:"Agradece lo que tienes", type:"gratitude", points:30, unlocked:false, done:false },
        { id:2, icon:"💎", title:"MIS VALORES", desc:"Identifica lo que más valoras", type:"values", points:35, unlocked:false, done:false },
        { id:3, icon:"📊", title:"BIENESTAR PERSONAL", desc:"Evalúa cómo te sientes", type:"wellness", points:30, unlocked:false, done:false },
        { id:4, icon:"✨", title:"AFIRMACIONES", desc:"Refuerza tu autoestima", type:"affirmations", points:40, unlocked:false, done:false },
        { id:5, icon:"🎯", title:"PROPÓSITO", desc:"Define tu razón de ser", type:"purpose", points:45, unlocked:false, done:false },
        { id:6, icon:"🏆", title:"MI MEJOR VERSIÓN", desc:"Visualiza tu transformación", type:"vision", points:50, unlocked:false, done:false }
    ];

    let totalPoints = 0;
    let currentPractice = null;
    let selectedValue = null;
    let breathingInterval = null;
    let breathingTime = 0;

    function saveProgress() {
        localStorage.setItem('mindfulPoints', totalPoints);
        localStorage.setItem('mindfulPractices', JSON.stringify(practices.map(p => ({ done: p.done, unlocked: p.unlocked }))));
    }

    function loadProgress() {
        const savedPts = localStorage.getItem('mindfulPoints');
        const savedPrac = localStorage.getItem('mindfulPractices');
        if (savedPts) totalPoints = parseInt(savedPts);
        if (savedPrac) {
            const saved = JSON.parse(savedPrac);
            practices.forEach((p, idx) => {
                if (saved[idx]) {
                    p.done = saved[idx].done;
                    p.unlocked = saved[idx].unlocked;
                }
            });
        }
        practices[0].unlocked = true;
        for (let i = 1; i < practices.length; i++) {
            if (practices[i-1].done && !practices[i].unlocked) practices[i].unlocked = true;
        }
        renderPractices();
    }

    function renderPractices() {
        const grid = document.getElementById("practicesGrid");
        grid.innerHTML = "";
        practices.forEach((p, idx) => {
            const card = document.createElement("div");
            card.className = "practice-card";
            if (p.done) card.classList.add("done");
            if (!p.unlocked && !p.done) card.classList.add("locked");
            card.innerHTML = `
                <div class="practice-icon">${p.icon}</div>
                <div class="practice-title">${p.title}</div>
                <div class="practice-desc">${p.desc}</div>
                <div class="practice-points">🏆 ${p.points} pts</div>
                ${p.done ? '<div style="color:#34D399; margin-top:8px;">✅ Completada</div>' : ''}
                ${!p.unlocked && !p.done ? '<div style="position:absolute; top:1rem; right:1rem;">🔒</div>' : ''}
            `;
            if (!p.done && p.unlocked) card.onclick = () => openPractice(idx);
            grid.appendChild(card);
        });
        updateStats();
    }

    function updateStats() {
        const doneCount = practices.filter(p => p.done).length;
        document.getElementById("pointsTotal").innerText = totalPoints;
        document.getElementById("practicesDone").innerHTML = `${doneCount}/${practices.length}`;
        const percent = (doneCount / practices.length) * 100;
        document.getElementById("globalProgress").style.width = percent + "%";
        
        let rank = totalPoints >= 230 ? "MAESTRO INTERIOR" : totalPoints >= 150 ? "SABIO" : totalPoints >= 80 ? "EXPLORADOR" : totalPoints >= 30 ? "APRENDIZ" : "NOVATO";
        document.getElementById("rankLabel").innerHTML = rank;
        saveProgress();
    }

    function floatPoints(p) {
        for (let i=0;i<4;i++) {
            setTimeout(() => {
                const f = document.createElement("div");
                f.className = "float-particle";
                f.innerHTML = `+${p} 🌟`;
                f.style.left = (Math.random() * window.innerWidth * 0.7 + window.innerWidth * 0.15) + "px";
                f.style.top = "70%";
                f.style.color = "#34D399";
                document.body.appendChild(f);
                setTimeout(() => f.remove(), 1500);
            }, i*70);
        }
    }

    function completePractice(id, earned) {
        if (practices[id].done) return;
        practices[id].done = true;
        totalPoints += earned;
        floatPoints(earned);
        for (let i = 1; i < practices.length; i++) {
            if (practices[i-1].done && !practices[i].unlocked) practices[i].unlocked = true;
        }
        renderPractices();
        
        if (practices.filter(p => p.done).length === practices.length) {
            document.getElementById("finalRank").innerHTML = `🏅 ${document.getElementById("rankLabel").innerHTML} · ${totalPoints} pts`;
            document.getElementById("finalMsg").innerHTML = "🎉 ¡INCREÍBLE! Has completado tu viaje interior. Ahora eres más consciente de ti mismo.";
            document.getElementById("finalPanel").classList.add("show");
        }
    }

    // ========== APERTURA DE PRÁCTICAS ==========
    function openPractice(id) {
        currentPractice = practices[id];
        selectedValue = null;
        const modalBody = document.getElementById("modalBody");
        document.getElementById("modalTitle").innerHTML = `${currentPractice.icon} ${currentPractice.title}`;
        
        if (currentPractice.type === "breathing") {
            breathingTime = 0;
            modalBody.innerHTML = `
                <div class="meditation-area">
                    <p style="color:#6EE7B7; margin-bottom:1rem;">🧘 Respira profundo durante 60 segundos</p>
                    <div class="breathing-circle" id="breathingCircle">🌿</div>
                    <p id="breathingTimer" style="margin-top:1rem; font-size:1.5rem; color:#34D399;">0s</p>
                    <p style="color:#94A3B8; margin-top:0.5rem;">Inspira → la bola crece<br>Espira → la bola vuelve</p>
                </div>
            `;
            startBreathing();
        }
        else if (currentPractice.type === "gratitude") {
            let gratitudes = [];
            modalBody.innerHTML = `
                <div class="meditation-area">
                    <p style="color:#6EE7B7;">🙏 Escribe 3 cosas por las que estás agradecido/a hoy</p>
                    <div class="gratitude-list" id="gratitudeList"></div>
                    <button class="btn btn-secondary" id="addGratitudeBtn" style="margin-top:0.5rem;">+ Agregar</button>
                </div>
            `;
            const listDiv = document.getElementById("gratitudeList");
            function updateList() {
                listDiv.innerHTML = gratitudes.map((g, i) => `<div class="gratitude-item">✨ ${g}</div>`).join('');
                if (gratitudes.length >= 3) {
                    selectedValue = gratitudes;
                }
            }
            document.getElementById("addGratitudeBtn").onclick = () => {
                const newGrat = prompt("¿Por qué estás agradecido/a?");
                if (newGrat && newGrat.trim()) {
                    gratitudes.push(newGrat.trim());
                    updateList();
                    if (gratitudes.length >= 3) {
                        alert("🎉 3 cosas hermosas! La gratitud transforma.");
                    }
                }
            };
            updateList();
        }
        else if (currentPractice.type === "values") {
            modalBody.innerHTML = `
                <div class="meditation-area">
                    <p style="color:#6EE7B7;">💎 Selecciona tus 3 valores más importantes</p>
                    <div class="values-wheel" id="valuesWheel"></div>
                </div>
            `;
            const values = ['Honestidad', 'Respeto', 'Empatía', 'Libertad', 'Familia', 'Amistad', 'Creatividad', 'Sabiduría', 'Paz', 'Justicia', 'Solidaridad', 'Alegría'];
            const wheel = document.getElementById("valuesWheel");
            let selectedValues = [];
            wheel.innerHTML = values.map(v => `<div class="value-tag" data-value="${v}">${v}</div>`).join('');
            document.querySelectorAll(".value-tag").forEach(tag => {
                tag.onclick = () => {
                    tag.classList.toggle("selected");
                    selectedValues = Array.from(document.querySelectorAll(".value-tag.selected")).map(t => t.dataset.value);
                    if (selectedValues.length <= 3) {
                        selectedValue = selectedValues;
                    } else {
                        tag.classList.remove("selected");
                        alert("Puedes seleccionar solo 3 valores principales");
                    }
                };
            });
        }
        else if (currentPractice.type === "wellness") {
            modalBody.innerHTML = `
                <div class="meditation-area">
                    <p style="color:#6EE7B7;">📊 ¿Cómo te sientes hoy en una escala del 1 al 5?</p>
                    <div class="wellness-scale">
                        <div class="wellness-options" id="wellnessOptions"></div>
                    </div>
                </div>
            `;
            const options = ['😔 Muy mal', '😕 Mal', '😐 Normal', '🙂 Bien', '😊 Excelente'];
            const optsDiv = document.getElementById("wellnessOptions");
            optsDiv.innerHTML = options.map((opt, idx) => `<div class="wellness-option" data-val="${idx+1}">${opt}</div>`).join('');
            document.querySelectorAll(".wellness-option").forEach(opt => {
                opt.onclick = () => {
                    document.querySelectorAll(".wellness-option").forEach(o => o.classList.remove("selected"));
                    opt.classList.add("selected");
                    selectedValue = parseInt(opt.dataset.val);
                };
            });
        }
        else if (currentPractice.type === "affirmations") {
            const affirmations = [
                "Soy suficiente tal como soy",
                "Merezco amor y respeto",
                "Cada día aprendo y crezco",
                "Confío en mi intuición",
                "Soy fuerte y capaz",
                "Elijo la paz interior"
            ];
            modalBody.innerHTML = `
                <div class="meditation-area">
                    <p style="color:#6EE7B7;">✨ Elige una afirmación que resuene contigo</p>
                    <div class="values-wheel" id="affirmationsWheel"></div>
                </div>
            `;
            const wheel = document.getElementById("affirmationsWheel");
            wheel.innerHTML = affirmations.map(a => `<div class="value-tag" data-affirm="${a}">"${a}"</div>`).join('');
            document.querySelectorAll(".value-tag").forEach(tag => {
                tag.onclick = () => {
                    document.querySelectorAll(".value-tag").forEach(t => t.classList.remove("selected"));
                    tag.classList.add("selected");
                    selectedValue = tag.dataset.affirm;
                };
            });
        }
        else if (currentPractice.type === "purpose") {
            modalBody.innerHTML = `
                <div class="meditation-area">
                    <p style="color:#6EE7B7;">🎯 ¿Cuál es tu propósito en la vida?</p>
                    <textarea class="journal-input" id="purposeText" rows="4" placeholder="Escribe tu propósito..." style="width:100%; background:#1E293B; border:1px solid #334155; border-radius:1rem; padding:1rem; color:white;"></textarea>
                </div>
            `;
        }
        else if (currentPractice.type === "vision") {
            modalBody.innerHTML = `
                <div class="meditation-area">
                    <p style="color:#6EE7B7;">🏆 ¿Cómo te imaginas a ti mismo dentro de 5 años?</p>
                    <textarea class="journal-input" id="visionText" rows="5" placeholder="Describe a tu mejor versión..." style="width:100%; background:#1E293B; border:1px solid #334155; border-radius:1rem; padding:1rem; color:white;"></textarea>
                </div>
            `;
        }
        
        document.getElementById("mindfulModal").classList.add("active");
    }

    function startBreathing() {
        const circle = document.getElementById("breathingCircle");
        const timerDiv = document.getElementById("breathingTimer");
        let isInhaling = true;
        let elapsed = 0;
        
        breathingInterval = setInterval(() => {
            elapsed++;
            timerDiv.innerText = `${elapsed}s`;
            
            if (isInhaling) {
                circle.classList.add("breathing-in");
                if (elapsed % 8 === 0 && elapsed > 0) {
                    isInhaling = false;
                }
            } else {
                circle.classList.remove("breathing-in");
                if (elapsed % 8 === 4) {
                    isInhaling = true;
                }
            }
            
            if (elapsed >= 60) {
                clearInterval(breathingInterval);
                timerDiv.innerText = "✓ Completado";
                timerDiv.style.color = "#34D399";
                selectedValue = true;
            }
        }, 1000);
    }

    function submitPractice() {
        if (currentPractice === null) return;
        
        let completed = false;
        
        if (currentPractice.type === "breathing") {
            if (selectedValue === true || (breathingTime >= 60)) {
                completed = true;
                alert("🎉 ¡Respiración completada! Has conectado contigo mismo.");
            } else {
                alert("❌ Completa los 60 segundos de respiración consciente.");
                return;
            }
        }
        else if (currentPractice.type === "gratitude") {
            if (selectedValue && selectedValue.length >= 3) {
                completed = true;
                alert("🎉 ¡Gracias por compartir! La gratitud abre el corazón.");
            } else {
                alert("❌ Escribe al menos 3 cosas por las que estás agradecido/a.");
                return;
            }
        }
        else if (currentPractice.type === "values") {
            if (selectedValue && selectedValue.length === 3) {
                completed = true;
                alert(`🎉 Tus valores son: ${selectedValue.join(", ")}. Guían tu vida.`);
            } else {
                alert("❌ Selecciona exactamente 3 valores importantes para ti.");
                return;
            }
        }
        else if (currentPractice.type === "wellness") {
            if (selectedValue) {
                completed = true;
                const msgs = ["Necesitas cuidado", "Puedes mejorar", "Estable", "Vas bien", "Excelente!"];
                alert(`🎉 Bienestar nivel ${selectedValue}/5. ${msgs[selectedValue-1]}`);
            } else {
                alert("❌ Selecciona cómo te sientes hoy.");
                return;
            }
        }
        else if (currentPractice.type === "affirmations") {
            if (selectedValue) {
                completed = true;
                alert(`🎉 " ${selectedValue} " ✨ Repite esta afirmación cada mañana.`);
            } else {
                alert("❌ Selecciona una afirmación.");
                return;
            }
        }
        else if (currentPractice.type === "purpose") {
            const purpose = document.getElementById("purposeText")?.value;
            if (purpose && purpose.length > 10) {
                completed = true;
                alert(`🎉 Tu propósito es hermoso: "${purpose.substring(0, 50)}..."`);
            } else {
                alert("❌ Escribe tu propósito con más detalle.");
                return;
            }
        }
        else if (currentPractice.type === "vision") {
            const vision = document.getElementById("visionText")?.value;
            if (vision && vision.length > 15) {
                completed = true;
                alert(`🎉 ¡Tu visión es inspiradora! Visualízala cada día.`);
            } else {
                alert("❌ Describe tu mejor versión con más detalle.");
                return;
            }
        }
        
        if (completed) {
            if (breathingInterval) clearInterval(breathingInterval);
            completePractice(currentPractice.id, currentPractice.points);
            closeModal();
        }
    }

    function closeModal() {
        if (breathingInterval) clearInterval(breathingInterval);
        document.getElementById("mindfulModal").classList.remove("active");
        currentPractice = null;
        selectedValue = null;
    }

    document.getElementById("closeModalBtn").onclick = closeModal;
    document.getElementById("submitModalBtn").onclick = submitPractice;
    document.getElementById("closeFinalBtn").onclick = () => document.getElementById("finalPanel").classList.remove("show");

    loadProgress();