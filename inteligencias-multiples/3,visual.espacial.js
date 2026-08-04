// ==================== DESAFÍOS VISUAL-ESPACIALES 3D ====================
    let challenges = [
        { id:0, title:"🔄 ROTACIÓN MENTAL", desc:"¿Cuál figura es la misma rotada?", icon:"🔄", points:25, type:"rotation", unlocked:true, completed:false, correct:1 },
        { id:1, title:"🪞 SIMETRÍA ESPECULAR", desc:"Encuentra el reflejo exacto", icon:"🪞", points:30, type:"symmetry", unlocked:false, completed:false, correct:0 },
        { id:2, title:"🧊 CONTEO DE CUBOS 3D", desc:"¿Cuántos cubos ves?", icon:"🧊", points:35, type:"count3d", unlocked:false, completed:false, correct:10 },
        { id:3, title:"🔷 ROTACIÓN DE CUBO", desc:"¿Qué cubo se obtiene?", icon:"🔷", points:30, type:"cubeRotate", unlocked:false, completed:false, correct:2 },
        { id:4, title:"📦 VISTA ISOMÉTRICA", desc:"¿Cuál es la vista correcta?", icon:"📦", points:40, type:"isometric", unlocked:false, completed:false, correct:1 },
        { id:5, title:"🌀 TESELADO 3D", desc:"Completa el patrón", icon:"🌀", points:45, type:"pattern", unlocked:false, completed:false, correct:0 },
        { id:6, title:"📐 PERSPECTIVA", desc:"¿Cuál es la vista superior?", icon:"📐", points:40, type:"topview", unlocked:false, completed:false, correct:2 },
        { id:7, title:"💎 CUBO MÁGICO", desc:"¿Cuántos cubos faltan?", icon:"💎", points:50, type:"missing", unlocked:false, completed:false, correct:4 }
    ];

    let totalPoints = 0;
    let currentChallenge = null;
    let selectedOption = null;
    let threeScene = null;
    let threeCamera = null;
    let threeRenderer = null;

    function saveGame() {
        localStorage.setItem('spatial3dPoints', totalPoints);
        localStorage.setItem('spatial3dChallenges', JSON.stringify(challenges.map(c => ({ completed: c.completed, unlocked: c.unlocked }))));
    }

    function loadGame() {
        const savedPts = localStorage.getItem('spatial3dPoints');
        const savedChal = localStorage.getItem('spatial3dChallenges');
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
        updateUnlockChain();
        renderChallenges();
    }

    function updateUnlockChain() {
        for (let i = 1; i < challenges.length; i++) {
            if (challenges[i-1].completed && !challenges[i].unlocked) {
                challenges[i].unlocked = true;
            }
        }
    }

    function renderChallenges() {
        const container = document.getElementById("challengesContainer");
        container.innerHTML = "";
        challenges.forEach((ch, idx) => {
            const card = document.createElement("div");
            card.className = "challenge-pro-card";
            if (ch.completed) card.classList.add("completed");
            if (!ch.unlocked && !ch.completed) card.classList.add("locked");
            card.innerHTML = `
                <div class="card-header-pro">
                    <div class="card-icon-pro">${ch.icon}</div>
                    <div class="card-title-pro">${ch.title}</div>
                </div>
                <div class="card-desc-pro">${ch.desc}</div>
                <div class="points-badge">🏆 ${ch.points} puntos</div>
                ${ch.completed ? '<div style="color:#10B981; margin-top:0.8rem;">✅ Resuelto</div>' : ''}
                ${!ch.unlocked && !ch.completed ? '<div class="lock-icon">🔒</div>' : ''}
            `;
            if (!ch.completed && ch.unlocked) {
                card.onclick = () => openChallenge(idx);
            }
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
        
        let rank = "";
        if (totalPoints >= 250) rank = "GENIO 3D";
        else if (totalPoints >= 170) rank = "MAESTRO 3D";
        else if (totalPoints >= 100) rank = "EXPLORADOR";
        else if (totalPoints >= 40) rank = "APRENDIZ";
        else rank = "NOVATO";
        document.getElementById("rankDisplayPro").innerHTML = rank;
        saveGame();
    }

    function floatPoints(points) {
        for (let i=0; i<5; i++) {
            setTimeout(() => {
                const particle = document.createElement("div");
                particle.className = "float-particle";
                particle.innerHTML = `+${points} ✨`;
                particle.style.left = (Math.random() * window.innerWidth * 0.7 + window.innerWidth * 0.15) + "px";
                particle.style.top = "70%";
                particle.style.color = "#60A5FA";
                document.body.appendChild(particle);
                setTimeout(() => particle.remove(), 1400);
            }, i*70);
        }
    }

    function completeChallenge(id, earned) {
        if (challenges[id].completed) return;
        challenges[id].completed = true;
        totalPoints += earned;
        floatPoints(earned);
        updateUnlockChain();
        renderChallenges();
        
        if (challenges.filter(c => c.completed).length === challenges.length) {
            showFinalScreen();
        }
    }

    function showFinalScreen() {
        let msg = "";
        if (totalPoints >= 250) msg = "🏆 ¡EXCEPCIONAL! Tu percepción espacial 3D es de nivel experto.";
        else if (totalPoints >= 170) msg = "🎓 ¡MAESTRO! Visualizas formas 3D con claridad sobresaliente.";
        else if (totalPoints >= 100) msg = "⚔️ ¡ESTRATEGA! Tienes buen ojo para el espacio tridimensional.";
        else msg = "🌱 ¡APRENDIZ! Cada desafío entrena tu cerebro visual 3D. ¡Sigue así!";
        document.getElementById("finalRankTitle").innerHTML = `🏅 ${document.getElementById("rankDisplayPro").innerHTML} · ${totalPoints} pts`;
        document.getElementById("finalMessageText").innerHTML = msg;
        document.getElementById("finalPanelSpatial").classList.add("show");
    }

    // ========== FUNCIONES 3D CON THREE.JS ==========
    function init3DScene(containerId, width, height, color = 0x3B82F6, shape = 'cube') {
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x0B0F1C);
        const camera = new THREE.PerspectiveCamera(45, width/height, 0.1, 1000);
        camera.position.set(3, 2, 5);
        camera.lookAt(0, 0, 0);
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(width, height);
        renderer.setClearColor(0x0B0F1C);
        
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = '';
            container.appendChild(renderer.domElement);
        }
        
        // Luces
        const ambientLight = new THREE.AmbientLight(0x404060);
        scene.add(ambientLight);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 10, 7);
        scene.add(directionalLight);
        const backLight = new THREE.PointLight(0x60A5FA, 0.5);
        backLight.position.set(-2, 1, -3);
        scene.add(backLight);
        
        // Crear figura 3D
        let mesh;
        if (shape === 'cube') {
            const geometry = new THREE.BoxGeometry(1.2, 1.2, 1.2);
            const material = new THREE.MeshStandardMaterial({ color: color, metalness: 0.3, roughness: 0.4, emissive: 0x1a2a4a });
            mesh = new THREE.Mesh(geometry, material);
        } else if (shape === 'sphere') {
            const geometry = new THREE.SphereGeometry(0.8, 32, 32);
            const material = new THREE.MeshStandardMaterial({ color: color, metalness: 0.2, roughness: 0.3 });
            mesh = new THREE.Mesh(geometry, material);
        } else {
            const geometry = new THREE.BoxGeometry(1, 1, 1);
            const material = new THREE.MeshStandardMaterial({ color: color });
            mesh = new THREE.Mesh(geometry, material);
        }
        
        scene.add(mesh);
        
        // Ejes de referencia sutiles
        const gridHelper = new THREE.GridHelper(8, 20, 0x334155, 0x1E293B);
        gridHelper.position.y = -1.2;
        scene.add(gridHelper);
        
        function animate() {
            requestAnimationFrame(animate);
            mesh.rotation.y += 0.008;
            mesh.rotation.x += 0.005;
            renderer.render(scene, camera);
        }
        animate();
        
        return { scene, camera, renderer, mesh };
    }

    function initCubeGroup(containerId, width, height, cubeCount = 10) {
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x0B0F1C);
        const camera = new THREE.PerspectiveCamera(45, width/height, 0.1, 1000);
        camera.position.set(4, 3, 6);
        camera.lookAt(0, 0, 0);
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(width, height);
        
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = '';
            container.appendChild(renderer.domElement);
        }
        
        const ambientLight = new THREE.AmbientLight(0x404060);
        scene.add(ambientLight);
        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(3, 5, 4);
        scene.add(light);
        
        // Crear grupo de cubos para contar (figura 3D real)
        const colors = [0x3B82F6, 0x60A5FA, 0xA855F7, 0xEC4899];
        const positions = [
            [-1, -0.5, -1], [0, -0.5, -1], [1, -0.5, -1],
            [-1, -0.5, 0], [0, -0.5, 0], [1, -0.5, 0],
            [0, 0.5, 0], [1, 0.5, 0], [-1, 0.5, -1], [0, 0.5, -1]
        ];
        
        for (let i = 0; i < cubeCount && i < positions.length; i++) {
            const geometry = new THREE.BoxGeometry(0.8, 0.8, 0.8);
            const material = new THREE.MeshStandardMaterial({ color: colors[i % colors.length], metalness: 0.4, roughness: 0.3 });
            const cube = new THREE.Mesh(geometry, material);
            cube.position.set(positions[i][0], positions[i][1], positions[i][2]);
            scene.add(cube);
        }
        
        const gridHelper = new THREE.GridHelper(6, 20, 0x334155, 0x1E293B);
        gridHelper.position.y = -1;
        scene.add(gridHelper);
        
        function animate() {
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
        }
        animate();
        
        return { scene, camera, renderer };
    }

    function openChallenge(id) {
        currentChallenge = challenges[id];
        selectedOption = null;
        const modalBody = document.getElementById("modalBodySpatial");
        document.getElementById("modalTitleSpatial").innerHTML = `${currentChallenge.icon} ${currentChallenge.title}`;
        
        if (currentChallenge.type === "rotation") {
            modalBody.innerHTML = `
                <div class="visual-question-area">
                    <p style="color:#60A5FA; margin-bottom:1rem;">¿Cuál de estas figuras es la misma pero rotada?</p>
                    <div class="figure-3d-container" style="height:250px;" id="rot3dContainer"></div>
                    <div class="options-spatial" id="rotOptions"></div>
                </div>
            `;
            init3DScene('rot3dContainer', 300, 200, 0x60A5FA, 'cube');
            const optsDiv = document.getElementById("rotOptions");
            optsDiv.innerHTML = ['Opción A', 'Opción B', 'Opción C', 'Opción D'].map((opt, idx) => 
                `<div class="opt-spatial" data-val="${idx}">${opt}</div>`
            ).join('');
            document.querySelectorAll("#rotOptions .opt-spatial").forEach(opt => {
                opt.onclick = () => {
                    document.querySelectorAll("#rotOptions .opt-spatial").forEach(o => o.classList.remove("selected"));
                    opt.classList.add("selected");
                    selectedOption = parseInt(opt.dataset.val);
                };
            });
        }
        else if (currentChallenge.type === "symmetry") {
            modalBody.innerHTML = `
                <div class="visual-question-area">
                    <p style="color:#60A5FA;">¿Cuál es el reflejo especular?</p>
                    <div class="options-spatial" id="symOptions">
                        ${['Reflejo A', 'Reflejo B', 'Reflejo C', 'Reflejo D'].map((opt,idx) => `<div class="opt-spatial" data-val="${idx}">${opt}</div>`).join('')}
                    </div>
                </div>
            `;
            document.querySelectorAll("#symOptions .opt-spatial").forEach(opt => {
                opt.onclick = () => {
                    document.querySelectorAll("#symOptions .opt-spatial").forEach(o => o.classList.remove("selected"));
                    opt.classList.add("selected");
                    selectedOption = parseInt(opt.dataset.val);
                };
            });
        }
        else if (currentChallenge.type === "count3d") {
            modalBody.innerHTML = `
                <div class="visual-question-area">
                    <p><strong>¿Cuántos cubos forman esta figura 3D?</strong></p>
                    <div class="figure-3d-container" style="height:300px;" id="count3dContainer"></div>
                    <input type="number" id="count3dInput" class="number-input-pro" placeholder="Escribe el número de cubos">
                </div>
            `;
            initCubeGroup('count3dContainer', 350, 280, 10);
        }
        else if (currentChallenge.type === "cubeRotate") {
            modalBody.innerHTML = `
                <div class="visual-question-area">
                    <p>¿Qué figura se obtiene al rotar el cubo?</p>
                    <div class="options-spatial" id="cubeRotOptions">
                        ${['Rotación 1', 'Rotación 2', 'Rotación 3', 'Rotación 4'].map((opt,idx) => `<div class="opt-spatial" data-val="${idx}">${opt}</div>`).join('')}
                    </div>
                </div>
            `;
            document.querySelectorAll("#cubeRotOptions .opt-spatial").forEach(opt => {
                opt.onclick = () => {
                    document.querySelectorAll("#cubeRotOptions .opt-spatial").forEach(o => o.classList.remove("selected"));
                    opt.classList.add("selected");
                    selectedOption = parseInt(opt.dataset.val);
                };
            });
        }
        else {
            modalBody.innerHTML = `
                <div class="visual-question-area">
                    <p>✨ Selecciona la opción correcta</p>
                    <div class="options-spatial" id="genericOptions">
                        ${['Opción 1', 'Opción 2', 'Opción 3', 'Opción 4'].map((opt,idx) => `<div class="opt-spatial" data-val="${idx}">${opt}</div>`).join('')}
                    </div>
                </div>
            `;
            document.querySelectorAll("#genericOptions .opt-spatial").forEach(opt => {
                opt.onclick = () => {
                    document.querySelectorAll("#genericOptions .opt-spatial").forEach(o => o.classList.remove("selected"));
                    opt.classList.add("selected");
                    selectedOption = parseInt(opt.dataset.val);
                };
            });
        }
        document.getElementById("spatialModal").classList.add("active");
    }

    function submitAnswer() {
        if (currentChallenge === null) return;
        let isCorrect = false;
        
        if (currentChallenge.type === "rotation") {
            isCorrect = (selectedOption === currentChallenge.correct);
        }
        else if (currentChallenge.type === "symmetry") {
            isCorrect = (selectedOption === currentChallenge.correct);
        }
        else if (currentChallenge.type === "count3d") {
            const inputVal = parseInt(document.getElementById("count3dInput")?.value);
            isCorrect = (inputVal === currentChallenge.correct);
        }
        else if (currentChallenge.type === "cubeRotate") {
            isCorrect = (selectedOption === currentChallenge.correct);
        }
        else {
            isCorrect = (selectedOption === currentChallenge.correct);
        }
        
        if (isCorrect) {
            completeChallenge(currentChallenge.id, currentChallenge.points);
            alert("🎉 ¡Correcto! Excelente percepción espacial 3D.");
        } else {
            alert(`❌ Incorrecto. La respuesta correcta era otra. Sigue practicando tu mente visual 3D.`);
        }
        closeModal();
    }

    function closeModal() {
        document.getElementById("spatialModal").classList.remove("active");
        currentChallenge = null;
        selectedOption = null;
    }

    document.getElementById("closeSpatialModalBtn").onclick = closeModal;
    document.getElementById("submitSpatialAnswerBtn").onclick = submitAnswer;
    document.getElementById("closeFinalSpatialBtn").onclick = () => document.getElementById("finalPanelSpatial").classList.remove("show");

    loadGame();