// ==================== MÓDULOS DE ENTRENAMIENTO ====================
    let modules = [
        { id:0, icon:"⚡", title:"REFLEJOS RÁPIDOS", desc:"Reacciona al estímulo visual", type:"reflex", points:25, unlocked:true, done:false, required:3 },
        { id:1, icon:"🧠", title:"MEMORIA MOTORA", desc:"Repite la secuencia de toques", type:"sequence", points:30, unlocked:false, done:false, length:4 },
        { id:2, icon:"⚖️", title:"EQUILIBRIO FINO", desc:"Mantén el marcador en el centro", type:"balance", points:35, unlocked:false, done:false, duration:8 },
        { id:3, icon:"🥁", title:"RITMO CORPORAL", desc:"Sigue el patrón rítmico", type:"rhythm", points:40, unlocked:false, done:false },
        { id:4, icon:"🖐️", title:"LATERALIDAD", desc:"Identifica tu mano dominante", type:"laterality", points:25, unlocked:false, done:false, correct:0 },
        { id:5, icon:"🎯", title:"COORDINACIÓN", desc:"Toca los objetivos en orden", type:"coordination", points:45, unlocked:false, done:false },
        { id:6, icon:"🏆", title:"MAESTRO CORPORAL", desc:"Conciencia del cuerpo", type:"master", points:50, unlocked:false, done:false, correct:1 }
    ];

    let totalPoints = 0;
    let currentModule = null;
    let selectedAnswer = null;
    let reflexHits = 0;
    let reflexTimeout = null;
    let reflexActive = false;
    let balanceInterval = null;
    let balanceValue = 50;
    let isDragging = false;

    function saveProgress() {
        localStorage.setItem('kineticProPoints', totalPoints);
        localStorage.setItem('kineticProModules', JSON.stringify(modules.map(m => ({ done: m.done, unlocked: m.unlocked }))));
    }

    function loadProgress() {
        const savedPts = localStorage.getItem('kineticProPoints');
        const savedMod = localStorage.getItem('kineticProModules');
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
            if (m.done) card.classList.add("done");
            if (!m.unlocked && !m.done) card.classList.add("blocked");
            card.innerHTML = `
                <div class="module-icon">${m.icon}</div>
                <div class="module-title">${m.title}</div>
                <div class="module-desc">${m.desc}</div>
                <div class="module-points">🏆 ${m.points} pts</div>
                ${m.done ? '<div style="color:#10B981; margin-top:8px;">✅ Completado</div>' : ''}
                ${!m.unlocked && !m.done ? '<div class="lock-overlay">🔒</div>' : ''}
            `;
            if (!m.done && m.unlocked) card.onclick = () => openModule(idx);
            grid.appendChild(card);
        });
        updateStats();
    }

    function updateStats() {
        const doneCount = modules.filter(m => m.done).length;
        document.getElementById("pointsTotal").innerText = totalPoints;
        document.getElementById("levelsDone").innerHTML = `${doneCount}/${modules.length}`;
        const percent = (doneCount / modules.length) * 100;
        document.getElementById("globalFill").style.width = percent + "%";
        
        let rank = totalPoints >= 230 ? "MAESTRO CORPORAL" : totalPoints >= 150 ? "EXPERTO" : totalPoints >= 80 ? "ATLETA" : totalPoints >= 30 ? "APRENDIZ" : "NOVATO";
        document.getElementById("rankLabel").innerHTML = rank;
        saveProgress();
    }

    function floatPoints(p) {
        for (let i=0;i<4;i++) {
            setTimeout(() => {
                const f = document.createElement("div");
                f.className = "float-point";
                f.innerHTML = `+${p} 💪`;
                f.style.left = (Math.random() * window.innerWidth * 0.7 + window.innerWidth * 0.15) + "px";
                f.style.top = "70%";
                f.style.color = "#F97316";
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
            document.getElementById("finalMsg").innerHTML = "🎉 ¡EXCEPCIONAL! Has dominado todas las habilidades corporales.";
            document.getElementById("finalPanel").classList.add("show");
        }
    }

    // ========== APERTURA DE MÓDULOS ==========
    function openModule(id) {
        currentModule = modules[id];
        selectedAnswer = null;
        const modalBody = document.getElementById("modalBody");
        document.getElementById("modalTitle").innerHTML = `${currentModule.icon} ${currentModule.title}`;
        
        if (currentModule.type === "reflex") {
            reflexHits = 0;
            modalBody.innerHTML = `
                <div class="challenge-area">
                    <p style="color:#F97316; margin-bottom:1rem;">⚡ Haz clic cuando el círculo se ponga NARANJA</p>
                    <div class="reflex-circle" id="reflexCircle">⚪</div>
                    <p>Aciertos: <span id="reflexCount">0</span>/${currentModule.required}</p>
                </div>
            `;
            startReflexGame();
        }
        else if (currentModule.type === "sequence") {
            const sequence = [0, 2, 1, 3];
            let userSeq = [];
            modalBody.innerHTML = `
                <div class="challenge-area">
                    <p style="color:#F97316;">🧠 Repite la secuencia de luces</p>
                    <div class="seq-grid" id="seqGrid"></div>
                    <p>Tu secuencia: <span id="userSeq">---</span></p>
                </div>
            `;
            const grid = document.getElementById("seqGrid");
            const items = ['🔴', '🟢', '🔵', '🟡'];
            grid.innerHTML = items.map((item, idx) => `<div class="seq-cell" data-idx="${idx}">${item}</div>`).join('');
            
            function playSequence() {
                let i = 0;
                function showNext() {
                    if (i >= sequence.length) return;
                    const cell = grid.children[sequence[i]];
                    cell.classList.add("highlight");
                    setTimeout(() => cell.classList.remove("highlight"), 300);
                    i++;
                    setTimeout(showNext, 700);
                }
                showNext();
            }
            
            let seqPlayed = false;
            document.querySelectorAll("#seqGrid .seq-cell").forEach(cell => {
                cell.onclick = () => {
                    if (!seqPlayed) {
                        playSequence();
                        seqPlayed = true;
                        return;
                    }
                    const idx = parseInt(cell.dataset.idx);
                    userSeq.push(idx);
                    document.getElementById("userSeq").innerHTML = userSeq.join(' → ');
                    if (userSeq.length === sequence.length) {
                        let correct = true;
                        for (let i = 0; i < sequence.length; i++) {
                            if (userSeq[i] !== sequence[i]) correct = false;
                        }
                        if (correct) {
                            completeModule(currentModule.id, currentModule.points);
                            alert("🎉 ¡Memoria motora perfecta!");
                            closeModal();
                        } else {
                            alert("❌ Secuencia incorrecta. Vuelve a intentarlo.");
                            userSeq = [];
                            document.getElementById("userSeq").innerHTML = "---";
                        }
                    }
                };
            });
            setTimeout(() => { if (!seqPlayed) playSequence(); }, 500);
        }
        else if (currentModule.type === "balance") {
            let elapsed = 0;
            let success = true;
            balanceValue = 50;
            modalBody.innerHTML = `
                <div class="challenge-area">
                    <p style="color:#F97316;">⚖️ Mantén el marcador en la línea blanca durante ${currentModule.duration}s</p>
                    <div class="balance-track" id="balanceTrack">
                        <div class="balance-target"></div>
                        <div class="balance-marker" id="balanceMarker"></div>
                    </div>
                    <p>Tiempo: <span id="balanceTime">0</span>/${currentModule.duration}s</p>
                </div>
            `;
            const marker = document.getElementById("balanceMarker");
            const track = document.getElementById("balanceTrack");
            
            marker.onmousedown = (e) => { isDragging = true; e.preventDefault(); };
            document.onmousemove = (e) => {
                if (!isDragging) return;
                const rect = track.getBoundingClientRect();
                let x = e.clientX - rect.left;
                x = Math.max(0, Math.min(rect.width, x));
                let percent = (x / rect.width) * 100;
                marker.style.left = percent + "%";
                balanceValue = percent;
                if (percent < 45 || percent > 55) success = false;
            };
            document.onmouseup = () => { isDragging = false; };
            
            const timer = setInterval(() => {
                elapsed++;
                document.getElementById("balanceTime").innerText = elapsed;
                if (balanceValue < 45 || balanceValue > 55) success = false;
                if (elapsed >= currentModule.duration) {
                    clearInterval(timer);
                    if (success && balanceValue >= 47 && balanceValue <= 53) {
                        completeModule(currentModule.id, currentModule.points);
                        alert("🎉 ¡Equilibrio perfecto!");
                    } else {
                        alert("❌ Perdiste el equilibrio. Vuelve a intentarlo.");
                    }
                    closeModal();
                }
            }, 1000);
        }
        else if (currentModule.type === "rhythm") {
            const pattern = ['👆', '👆', '👇', '👈', '👉'];
            let userPattern = [];
            modalBody.innerHTML = `
                <div class="challenge-area">
                    <p style="color:#F97316;">🥁 Repite el patrón: ${pattern.join(' → ')}</p>
                    <div class="rhythm-panel">
                        <button class="rhythm-pad" data-move="👆">👆 ARRIBA</button>
                        <button class="rhythm-pad" data-move="👇">👇 ABAJO</button>
                        <button class="rhythm-pad" data-move="👈">👈 IZQ</button>
                        <button class="rhythm-pad" data-move="👉">👉 DER</button>
                    </div>
                    <p>Tu patrón: <span id="userPattern">---</span></p>
                    <button class="btn-pro btn-primary-pro" id="checkRhythm" style="margin-top:1rem;">✅ Verificar ritmo</button>
                </div>
            `;
            document.querySelectorAll(".rhythm-pad").forEach(btn => {
                btn.onclick = () => {
                    const move = btn.dataset.move;
                    userPattern.push(move);
                    document.getElementById("userPattern").innerHTML = userPattern.join(' → ');
                };
            });
            document.getElementById("checkRhythm").onclick = () => {
                if (userPattern.length !== pattern.length) {
                    alert(`Debes repetir ${pattern.length} movimientos. Tienes ${userPattern.length}`);
                    return;
                }
                let correct = true;
                for (let i = 0; i < pattern.length; i++) {
                    if (userPattern[i] !== pattern[i]) correct = false;
                }
                if (correct) {
                    completeModule(currentModule.id, currentModule.points);
                    alert("🎉 ¡Ritmo corporal perfecto!");
                    closeModal();
                } else {
                    alert("❌ Patrón incorrecto. Vuelve a intentarlo.");
                    userPattern = [];
                    document.getElementById("userPattern").innerHTML = "---";
                }
            };
        }
        else {
            modalBody.innerHTML = `
                <div class="challenge-area">
                    <p style="color:#F97316;">${currentModule.title}</p>
                    <div class="options-pro" id="optionsContainer"></div>
                </div>
            `;
            let opts = [];
            if (currentModule.type === "laterality") opts = ['Mano derecha', 'Mano izquierda', 'Ambas', 'No lo sé'];
            else if (currentModule.type === "coordination") opts = ['Manos', 'Pies', 'Ojos', 'Cuerpo completo'];
            else opts = ['Fuerza', 'Coordinación', 'Flexibilidad', 'Resistencia'];
            
            document.getElementById("optionsContainer").innerHTML = opts.map((opt, idx) => `<div class="option-pro" data-val="${idx}">${opt}</div>`).join('');
            document.querySelectorAll("#optionsContainer .option-pro").forEach(opt => {
                opt.onclick = () => {
                    document.querySelectorAll("#optionsContainer .option-pro").forEach(o => o.classList.remove("selected"));
                    opt.classList.add("selected");
                    selectedAnswer = parseInt(opt.dataset.val);
                };
            });
        }
        document.getElementById("gameModal").classList.add("active");
    }

    function startReflexGame() {
        const circle = document.getElementById("reflexCircle");
        
        function activate() {
            reflexActive = true;
            circle.classList.add("ready");
            circle.innerHTML = "🎯";
            reflexTimeout = setTimeout(() => {
                if (reflexActive) {
                    reflexActive = false;
                    circle.classList.remove("ready");
                    circle.innerHTML = "⚪";
                    alert("❌ Demasiado lento. Reiniciando...");
                    closeModal();
                }
            }, 800);
        }
        
        circle.onclick = () => {
            if (reflexActive) {
                reflexHits++;
                document.getElementById("reflexCount").innerText = reflexHits;
                reflexActive = false;
                circle.classList.remove("ready");
                circle.innerHTML = "⚪";
                clearTimeout(reflexTimeout);
                if (reflexHits >= currentModule.required) {
                    completeModule(currentModule.id, currentModule.points);
                    alert("🎉 ¡Reflejos excelentes!");
                    closeModal();
                } else {
                    setTimeout(() => activate(), 800 + Math.random() * 1500);
                }
            } else {
                alert("❌ Demasiado pronto. Espera a que se ponga naranja.");
                closeModal();
            }
        };
        setTimeout(() => activate(), 1000);
    }

    function submitModule() {
        if (currentModule === null) return;
        
        if (currentModule.type === "laterality") {
            if (selectedAnswer === currentModule.correct) {
                completeModule(currentModule.id, currentModule.points);
                alert("🎉 ¡Correcto! Excelente autoconocimiento.");
                closeModal();
            } else {
                alert("❌ Reflexiona sobre tu cuerpo. ¡Sigue practicando!");
                closeModal();
            }
        }
        else if (currentModule.type === "coordination") {
            if (selectedAnswer === 1) {
                completeModule(currentModule.id, currentModule.points);
                alert("🎉 ¡Correcto! La coordinación ojo-pie es clave.");
                closeModal();
            } else {
                alert("❌ La respuesta correcta es 'Pies'. ¡Sigue entrenando!");
                closeModal();
            }
        }
        else if (currentModule.type === "master") {
            if (selectedAnswer === currentModule.correct) {
                completeModule(currentModule.id, currentModule.points);
                alert("🎉 ¡MAESTRO! Has completado el entrenamiento corporal.");
                closeModal();
            } else {
                alert("❌ La coordinación es la base de la inteligencia corporal.");
                closeModal();
            }
        }
    }

    function closeModal() {
        if (reflexTimeout) clearTimeout(reflexTimeout);
        if (balanceInterval) clearInterval(balanceInterval);
        document.getElementById("gameModal").classList.remove("active");
        currentModule = null;
        selectedAnswer = null;
    }

    document.getElementById("closeModalBtn").onclick = closeModal;
    document.getElementById("submitModalBtn").onclick = submitModule;
    document.getElementById("closeFinalBtn").onclick = () => document.getElementById("finalPanel").classList.remove("show");

    loadProgress();