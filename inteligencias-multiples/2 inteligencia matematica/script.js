
// ============================================================
// // PARTE 1: MODELO DE DATOS Y ESTADO INICIAL
// ============================================================
const challengesData = [
    { id:0, title:"🔢 EL PATRÓN DORADO", desc:"Secuencia lógica", icon:"✨", points:25, type:"quiz", question:"¿Qué número sigue? 3, 9, 27, 81, ?", options:["162","243","324","405"], ans:1, unlocked:true },
    { id:1, title:"⚙️ LA OPERACIÓN MÁGICA", desc:"Descubre la regla", icon:"🧩", points:30, type:"quiz", question:"Si 2#3 = 13, 4#5 = 41, entonces 6#7 = ?", options:["55","85","113","97"], ans:1 },
    { id:2, title:"🎯 TRIÁNGULO MISTERIOSO", desc:"Pirámide numérica", icon:"🔺", points:35, type:"quiz", question:"En una pirámide: 1, 2+3=5, 4+5+6=15, 7+8+9+10=34, ¿cuánto suma la siguiente fila?", options:["55","65","75","85"], ans:1 },
    { id:3, title:"⚖️ ECUACIÓN OCULTA", desc:"Encuentra el valor", icon:"🧮", points:30, type:"quiz", question:"Si 3△4 = 25, 5△2 = 29, entonces 7△1 = ?", options:["48","50","52","54"], ans:1 },
    { id:4, title:"🐚 ESPIRAL LÓGICA", desc:"Patrón geométrico", icon:"🌀", points:40, type:"input", question:"Observa la secuencia: 2 → 5, 4 → 17, 6 → 37, ¿qué número corresponde a 8?", ans:65, hint:"Fórmula: n² + 1" },
    { id:5, title:"⏳ EL RELOJ MENTAL", desc:"Razonamiento temporal", icon:"⏰", points:35, type:"quiz", question:"Si ayer era mañana, hoy sería viernes. ¿Qué día es hoy?", options:["Domingo","Miércoles","Viernes","Sábado"], ans:0 },
    { id:6, title:"🎲 CUBO MATEMÁTICO", desc:"Volumen y lógica", icon:"📦", points:40, type:"input", question:"Un cubo grande de 3x3x3 está pintado de azul. Si se desarma, ¿cuántos cubitos tienen exactamente 2 caras pintadas?", ans:12 },
    { id:7, title:"🏆 TESORO NUMÉRICO", desc:"Ecuación maestra", icon:"💎", points:50, type:"quiz", question:"Encuentra el número que falta: 144, 121, 100, 81, ?", options:["64","72","49","56"], ans:0 }
];

let totalPoints = 0, activeId = null, selectedOpt = null;
let challenges = challengesData.map(c => ({...c, completed: false, unlocked: !!c.unlocked}));

// Abstracción de selección del DOM para minificar código
const $ = id => document.getElementById(id);


// ============================================================
// // PARTE 2: PERSISTENCIA LOCAL (LOCALSTORAGE)
// ============================================================
function saveGame() {
    localStorage.setItem('mathMindPoints', totalPoints);
    localStorage.setItem('mathMindChallenges', JSON.stringify(challenges.map(({completed, unlocked}) => ({completed, unlocked}))));
}

function loadGame() {
    totalPoints = parseInt(localStorage.getItem('mathMindPoints')) || 0;
    const saved = JSON.parse(localStorage.getItem('mathMindChallenges')) || [];
    challenges.forEach((ch, i) => {
        ch.completed = saved[i]?.completed || false;
        ch.unlocked = i === 0 || saved[i]?.unlocked || challenges[i-1].completed;
    });
    renderBoard();
}


// ============================================================
// // PARTE 3: INTERFAZ DINÁMICA (DOM Y RENDERIZADO)
// ============================================================
function renderBoard() {
    const board = $("board");
    board.innerHTML = "";
    challenges.forEach((ch, idx) => {
        const isLocked = !ch.unlocked && !ch.completed;
        const tile = document.createElement("div");
        tile.className = `challenge-tile ${ch.completed ? 'completed' : ''} ${isLocked ? 'locked' : ''}`;
        tile.innerHTML = `
            <div class="tile-icon">${ch.icon}</div><div class="tile-title">${ch.title}</div><div class="tile-desc">${ch.desc}</div>
            <div class="badge-points">🏆 ${ch.points} pts</div>
            ${isLocked ? '<div class="lock-icon">🔒</div>' : ch.completed ? '<div class="tile-status">✅ Resuelto</div>' : ''}`;
        if (!ch.completed && ch.unlocked) tile.onclick = () => openChallenge(idx);
        board.appendChild(tile);
    });
    updateStats();
}

function updateStats() {
    const done = challenges.filter(c => c.completed).length;
    $("pointDisplay").innerText = totalPoints;
    $("challengeCount").innerHTML = `${done}/${challenges.length}`;
    $("globalFill").style.width = `${(done / challenges.length) * 100}%`;
    
    // Cortocircuito iterativo para asignar rangos eficientemente
    const ranks = [[240, "🧠 GENIO ABSOLUTO"], [170, "🏅 MAESTRO LÓGICO"], [100, "⚔️ ESTRATEGA"], [40, "📚 APRENDIZ"], [0, "🌱 NOVATO"]];
    $("rankDisplay").innerHTML = ranks.find(([pts]) => totalPoints >= pts)[1];
    saveGame();
}


// ============================================================
// // PARTE 4: CONTROL DE MODALES Y SELECCIÓN
// ============================================================
function openChallenge(id) {
    activeId = id;
    selectedOpt = null;
    const ch = challenges[id];
    $("modalTitle").innerHTML = `${ch.icon} ${ch.title}`;
    
    // Inyección condicional según el tipo de reto (Quiz o Entrada libre)
    $("modalDynamicBody").innerHTML = ch.type === "quiz" 
        ? `<div class="question-area"><div class="question-text">${ch.question}</div></div><div class="options-area" id="opts"></div>`
        : `<div class="question-area"><div class="question-text">${ch.question}</div>${ch.hint ? `<p style="color:#FBBF24;font-size:0.8rem;margin-top:0.5rem;">💡 Pista: ${ch.hint}</p>`:''}</div><input type="number" id="numAnswer" class="input-number" placeholder="Respuesta numérica">`;

    if (ch.type === "quiz") {
        ch.options.forEach((opt, idx) => {
            const btn = document.createElement("div");
            btn.className = "opt-btn";
            btn.innerText = opt;
            btn.onclick = () => {
                document.querySelectorAll(".opt-btn").forEach(b => b.classList.remove("selected"));
                btn.classList.add("selected");
                selectedOpt = idx;
            };
            $("opts").appendChild(btn);
        });
    }
    $("gameModal").classList.add("active");
}


// ============================================================
// // PARTE 5: EVALUACIÓN DE RESPUESTA Y FIN DE JUEGO
// ============================================================
function submitChallenge() {
    if (activeId === null) return;
    const ch = challenges[activeId];
    const isQuiz = ch.type === "quiz";
    const userAns = isQuiz ? selectedOpt : parseInt($("numAnswer")?.value);
    const correctAns = ch.ans;

    if (userAns === null || isNaN(userAns)) return alert(isQuiz ? "Selecciona una opción." : "Ingresa un número válido.");

    if (userAns === correctAns) {
        ch.completed = true;
        totalPoints += ch.points;
        
        // Generación dinámica de efectos visuales (puntos flotantes)
        for (let i = 0; i < 4; i++) setTimeout(() => {
            const fl = document.createElement("div");
            fl.className = "float-points"; fl.innerText = `+${ch.points}`;
            fl.style.left = `${Math.random() * window.innerWidth * 0.7 + window.innerWidth * 0.15}px`; fl.style.top = "70%";
            document.body.appendChild(fl); setTimeout(() => fl.remove(), 1500);
        }, i * 70);
        
        // Desbloqueo del siguiente nodo indexado
        if (activeId + 1 < challenges.length) challenges[activeId + 1].unlocked = true;
        renderBoard();
        
        // Evaluación de estado de victoria total
        if (challenges.every(c => c.completed)) {
            $("finalRankLabel").innerHTML = `🏅 ${$("rankDisplay").innerHTML} · ${totalPoints} pts`;
            $("finalMsg").innerHTML = totalPoints >= 240 ? "🏆 ¡EXCEPCIONAL!" : totalPoints >= 170 ? "🎓 ¡MAESTRO!" : "⚔️ ¡ESTRATEGA!";
            $("finalScreen").classList.add("show");
        }
    } else {
        alert(`❌ Incorrecto. La respuesta era: ${isQuiz ? ch.options[correctAns] : correctAns}`);
    }
    closeModal();
}

function closeModal() { $("gameModal").classList.remove("active"); activeId = selectedOpt = null; }

// Listeners y disparador inicial del ciclo de vida
$("closeModalBtn").onclick = closeModal;
$("submitModalBtn").onclick = submitChallenge;
$("closeFinalBtn").onclick = () => $("finalScreen").classList.remove("show");
document.addEventListener("keydown", (e) => e.key === "Escape" && closeModal());

loadGame();