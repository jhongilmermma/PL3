// ==================== SISTEMA DE SONIDO ====================
    let audioCtx = null;
    
    function initAudio() {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        return audioCtx;
    }
    
    function playTone(frequency, duration = 0.8, type = 'sine') {
        try {
            const ctx = initAudio();
            const oscillator = ctx.createOscillator();
            const gainNode = ctx.createGain();
            oscillator.connect(gainNode);
            gainNode.connect(ctx.destination);
            oscillator.frequency.value = frequency;
            oscillator.type = type;
            gainNode.gain.value = 0.25;
            oscillator.start();
            gainNode.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + duration);
            oscillator.stop(ctx.currentTime + duration);
        } catch(e) { console.log("Audio error:", e); }
    }
    
    function getFreq(note) {
        const freqs = { 'C4': 261.63, 'C#4': 277.18, 'D4': 293.66, 'D#4': 311.13, 'E4': 329.63, 'F4': 349.23, 'F#4': 369.99, 'G4': 392.00, 'G#4': 415.30, 'A4': 440.00, 'A#4': 466.16, 'B4': 493.88, 'C5': 523.25 };
        return freqs[note] || 440;
    }
    
    // ==================== DESAFÍOS ====================
    let challenges = [
        { id:0, title:"🎹 APRENDE EL PIANO", desc:"Toca la nota DO (C4)", icon:"🎹", points:25, type:"piano", unlocked:true, completed:false, correctNote:"C4" },
        { id:1, title:"👂 RECONOCE EL SONIDO", desc:"¿Qué nota escuchaste?", icon:"👂", points:30, type:"listen", unlocked:false, completed:false, correctAnswer:"Sol", soundFreq:392.00 },
        { id:2, title:"🥁 SIGUE EL RITMO", desc:"¿Cuál es el patrón?", icon:"🥁", points:35, type:"rhythm", unlocked:false, completed:false, correctIndex:1 },
        { id:3, title:"🎵 ESCALA MUSICAL", desc:"Orden correcto de la escala", icon:"🎵", points:30, type:"scale", unlocked:false, completed:false, correctIndex:0 },
        { id:4, title:"🎼 INTENSIDAD", desc:"¿Forte o Piano?", icon:"🎼", points:40, type:"dynamics", unlocked:false, completed:false, correctAnswer:"Forte" },
        { id:5, title:"🎶 COMPÁS DE 4/4", desc:"¿Cuántos tiempos tiene?", icon:"🎶", points:45, type:"time", unlocked:false, completed:false, correctAnswer:"4" },
        { id:6, title:"🏆 MAESTRO FINAL", desc:"¿Cuál es el instrumento?", icon:"🏆", points:50, type:"master", unlocked:false, completed:false, correctIndex:2 }
    ];
    
    let totalPoints = 0;
    let currentChallenge = null;
    let selectedOption = null;
    let pendingPianoCheck = null;
    
    function saveGame() {
        localStorage.setItem('musicalMindPoints', totalPoints);
        localStorage.setItem('musicalChallenges', JSON.stringify(challenges.map(c => ({ completed: c.completed, unlocked: c.unlocked }))));
    }
    
    function loadGame() {
        const savedPts = localStorage.getItem('musicalMindPoints');
        const savedChal = localStorage.getItem('musicalChallenges');
        if (savedPts) totalPoints = parseInt(savedPts);
        if (savedChal) {
            const saved = JSON.parse(savedChal);
            challenges.forEach((ch, idx) => {
                if (saved[idx]) {
                    ch.completed = saved[idx].completed;
                    ch.unlocked = saved[idx].unlocked;
                }
            });
        }
        challenges[0].unlocked = true;
        for (let i = 1; i < challenges.length; i++) {
            if (challenges[i-1].completed && !challenges[i].unlocked) challenges[i].unlocked = true;
        }
        renderChallenges();
    }
    
    function renderChallenges() {
        const container = document.getElementById("challengesContainer");
        container.innerHTML = "";
        challenges.forEach((ch, idx) => {
            const card = document.createElement("div");
            card.className = "challenge-card";
            if (ch.completed) card.classList.add("completed");
            if (!ch.unlocked && !ch.completed) card.classList.add("locked");
            card.innerHTML = `
                <div class="card-header">
                    <div class="card-icon">${ch.icon}</div>
                    <div class="card-title">${ch.title}</div>
                </div>
                <div class="card-desc">${ch.desc}</div>
                <div class="points-badge">🏆 ${ch.points} puntos</div>
                ${ch.completed ? '<div style="color:#10B981; margin-top:0.8rem;">✅ Completado</div>' : ''}
                ${!ch.unlocked && !ch.completed ? '<div class="lock-icon">🔒</div>' : ''}
            `;
            if (!ch.completed && ch.unlocked) card.onclick = () => openChallenge(idx);
            container.appendChild(card);
        });
        updateStats();
    }
    
    function updateStats() {
        const completedCount = challenges.filter(c => c.completed).length;
        document.getElementById("totalPointsDisplay").innerText = totalPoints;
        document.getElementById("completedDisplay").innerHTML = `${completedCount}/${challenges.length}`;
        const percent = (completedCount / challenges.length) * 100;
        document.getElementById("globalProgressBar").style.width = percent + "%";
        let rank = totalPoints >= 220 ? "MAESTRO" : totalPoints >= 150 ? "VIRTUOSO" : totalPoints >= 80 ? "MÚSICO" : totalPoints >= 30 ? "APRENDIZ" : "NOVATO";
        document.getElementById("rankDisplayMusic").innerHTML = rank;
        saveGame();
    }
    
    function floatPoints(points) {
        for (let i=0; i<5; i++) {
            setTimeout(() => {
                const p = document.createElement("div");
                p.className = "float-particle";
                p.innerHTML = `+${points} ✨`;
                p.style.left = (Math.random() * window.innerWidth * 0.7 + window.innerWidth * 0.15) + "px";
                p.style.top = "70%";
                p.style.color = "#E879F9";
                document.body.appendChild(p);
                setTimeout(() => p.remove(), 1400);
            }, i*70);
        }
    }
    
    function completeChallenge(id, earned) {
        if (challenges[id].completed) return;
        challenges[id].completed = true;
        totalPoints += earned;
        floatPoints(earned);
        for (let i = 1; i < challenges.length; i++) {
            if (challenges[i-1].completed && !challenges[i].unlocked) challenges[i].unlocked = true;
        }
        renderChallenges();
        if (challenges.filter(c => c.completed).length === challenges.length) {
            document.getElementById("finalRankTitle").innerHTML = `🏅 ${document.getElementById("rankDisplayMusic").innerHTML} · ${totalPoints} pts`;
            document.getElementById("finalMessageText").innerHTML = "🏆 ¡EXCEPCIONAL! Has completado todas las misiones musicales. ¡Eres un maestro!";
            document.getElementById("finalPanel").classList.add("show");
        }
    }
    
    // ========== MODALES ==========
    function openChallenge(id) {
        currentChallenge = challenges[id];
        selectedOption = null;
        const modalBody = document.getElementById("modalBodyMusic");
        document.getElementById("modalTitleMusic").innerHTML = `${currentChallenge.icon} ${currentChallenge.title}`;
        
        if (currentChallenge.type === "piano") {
            modalBody.innerHTML = `
                <div class="music-question-area">
                    <p style="color:#E879F9; margin-bottom:1rem;">🎹 Toca la nota <strong>DO (C4)</strong> en el piano</p>
                    <div class="piano-wrapper">
                        <div class="piano" id="pianoKeyboard"></div>
                    </div>
                    <p style="color:#A78BFA; margin-top:0.8rem;">💡 Haz clic en la tecla blanca que dice C4</p>
                </div>
            `;
            const pianoDiv = document.getElementById("pianoKeyboard");
            pianoDiv.innerHTML = '';
            const whiteNotes = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'];
            whiteNotes.forEach(note => {
                const key = document.createElement("div");
                key.className = "key white";
                key.style.display = "inline-block";
                key.innerHTML = `<div class="key-label">${note}</div>`;
                key.onclick = (e) => {
                    e.stopPropagation();
                    playTone(getFreq(note), 0.6);
                    key.classList.add("active");
                    setTimeout(() => key.classList.remove("active"), 200);
                    if (note === currentChallenge.correctNote) {
                        completeChallenge(currentChallenge.id, currentChallenge.points);
                        alert("🎉 ¡Correcto! Has tocado DO.");
                        closeModal();
                    } else {
                        alert(`❌ Tocaste ${note}. La nota correcta es C4 (DO). ¡Sigue practicando!`);
                        closeModal();
                    }
                };
                pianoDiv.appendChild(key);
            });
        }
        else if (currentChallenge.type === "listen") {
            modalBody.innerHTML = `
                <div class="music-question-area">
                    <p style="color:#E879F9;">🎧 Escucha el sonido y selecciona la nota</p>
                    <button class="play-sound-btn" id="playListenSound">🔊 Reproducir sonido</button>
                    <div class="options-music" id="listenOptions"></div>
                </div>
            `;
            const optsDiv = document.getElementById("listenOptions");
            const notes = ['Do', 'Re', 'Mi', 'Fa', 'Sol', 'La', 'Si'];
            optsDiv.innerHTML = notes.map((opt, idx) => `<div class="opt-music" data-val="${opt}">${opt}</div>`).join('');
            document.querySelectorAll("#listenOptions .opt-music").forEach(opt => {
                opt.onclick = () => {
                    document.querySelectorAll("#listenOptions .opt-music").forEach(o => o.classList.remove("selected"));
                    opt.classList.add("selected");
                    selectedOption = opt.dataset.val;
                };
            });
            document.getElementById("playListenSound").onclick = () => playTone(392.00, 1.2, 'sine');
        }
        else if (currentChallenge.type === "rhythm") {
            modalBody.innerHTML = `
                <div class="music-question-area">
                    <p style="color:#E879F9;">🥁 ¿Cuál es el patrón rítmico correcto?</p>
                    <div class="rhythm-demo">🎵 🎵 🎵 | 🎵 🎵 | 🎵 🎵 🎵 🎵</div>
                    <div class="options-music" id="rhythmOptions"></div>
                </div>
            `;
            const rhythms = ['3/4 - Tres tiempos', '4/4 - Cuatro tiempos', '2/4 - Dos tiempos', '6/8 - Seis tiempos'];
            const optsDiv = document.getElementById("rhythmOptions");
            optsDiv.innerHTML = rhythms.map((opt, idx) => `<div class="opt-music" data-val="${idx}">${opt}</div>`).join('');
            document.querySelectorAll("#rhythmOptions .opt-music").forEach(opt => {
                opt.onclick = () => {
                    document.querySelectorAll("#rhythmOptions .opt-music").forEach(o => o.classList.remove("selected"));
                    opt.classList.add("selected");
                    selectedOption = parseInt(opt.dataset.val);
                };
            });
        }
        else {
            modalBody.innerHTML = `
                <div class="music-question-area">
                    <p style="color:#E879F9;">${currentChallenge.title}</p>
                    <div class="options-music" id="genericOptions"></div>
                </div>
            `;
            let options = [];
            if (currentChallenge.type === "scale") options = ['Do-Re-Mi-Fa-Sol-La-Si', 'Do-Mi-Sol-Si-Re-Fa-La', 'Sol-La-Si-Do-Re-Mi-Fa', 'Fa-Sol-La-Si-Do-Re-Mi'];
            else if (currentChallenge.type === "dynamics") options = ['Piano (suave)', 'Forte (fuerte)', 'Mezzo-forte', 'Pianissimo'];
            else if (currentChallenge.type === "time") options = ['2 tiempos', '3 tiempos', '4 tiempos', '6 tiempos'];
            else options = ['Guitarra', 'Piano', 'Violín', 'Flauta'];
            
            const optsDiv = document.getElementById("genericOptions");
            optsDiv.innerHTML = options.map((opt, idx) => `<div class="opt-music" data-val="${idx}">${opt}</div>`).join('');
            document.querySelectorAll("#genericOptions .opt-music").forEach(opt => {
                opt.onclick = () => {
                    document.querySelectorAll("#genericOptions .opt-music").forEach(o => o.classList.remove("selected"));
                    opt.classList.add("selected");
                    selectedOption = parseInt(opt.dataset.val);
                };
            });
        }
        document.getElementById("musicModal").classList.add("active");
    }
    
    function submitAnswer() {
        if (currentChallenge === null) return;
        let isCorrect = false;
        
        if (currentChallenge.type === "listen") {
            isCorrect = (selectedOption === currentChallenge.correctAnswer);
        }
        else if (currentChallenge.type === "rhythm") {
            isCorrect = (selectedOption === currentChallenge.correctIndex);
        }
        else if (currentChallenge.type === "scale") {
            isCorrect = (selectedOption === currentChallenge.correctIndex);
        }
        else if (currentChallenge.type === "dynamics") {
            isCorrect = (selectedOption === 1);
        }
        else if (currentChallenge.type === "time") {
            isCorrect = (selectedOption === 2);
        }
        else if (currentChallenge.type === "master") {
            isCorrect = (selectedOption === currentChallenge.correctIndex);
        }
        else {
            isCorrect = (selectedOption === currentChallenge.correctIndex);
        }
        
        if (isCorrect) {
            completeChallenge(currentChallenge.id, currentChallenge.points);
            alert("🎉 ¡Correcto! Excelente percepción musical.");
            closeModal();
        } else {
            alert(`❌ Incorrecto. ¡Sigue entrenando tu oído musical!`);
            closeModal();
        }
    }
    
    function closeModal() {
        document.getElementById("musicModal").classList.remove("active");
        currentChallenge = null;
        selectedOption = null;
    }
    
    document.getElementById("closeModalBtn").onclick = closeModal;
    document.getElementById("submitAnswerBtn").onclick = submitAnswer;
    document.getElementById("closeFinalBtn").onclick = () => document.getElementById("finalPanel").classList.remove("show");
    
    loadGame();