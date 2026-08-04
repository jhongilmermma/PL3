const intelligences = [
      { id: 1, icon: "🗣️", title: "1. Lingüístico-Verbal", desc: "Habilidad para manejar el lenguaje oral y escrito, lectura, redacción y expresión de ideas complejas.", careers: "Escritores, Periodistas, Abogados, Poetas, Oradores, Lingüistas." },
      { id: 2, icon: "🧮", title: "2. Lógico-Matemática", desc: "Capacidad para el razonamiento numérico, resolución de problemas complejos, lógica pura y ciencias.", careers: "Ingenieros de Software, Matemáticos, Científicos, Economistas, Analistas de Datos." },
      { id: 3, icon: "🎨", title: "3. Visual-Espacial", desc: "Destreza para percibir el mundo en 3D, orientarse, crear mapas mentales, modelado visual y arte.", careers: "Arquitectos, Diseñadores 3D, Fotógrafos, Escultores, Pilotos, Ilustradores." },
      { id: 4, icon: "🎵", title: "4. Musical-Rítmica", desc: "Sensibilidad para percibir, diferenciar, transformar y expresar formas musicales, tonos y ritmos.", careers: "Músicos, Compositores, Directores de Orquesta, Ingenieros de Sonido." },
      { id: 5, icon: "🏃", title: "5. Corporal-Kinestésica", desc: "Habilidad de usar el cuerpo para expresar sentimientos, realizar actividades físicas o destreza manual.", careers: "Atletas, Cirujanos, Bailarines, Escultores, Fisioterapeutas." },
      { id: 6, icon: "🧘", title: "6. Intrapersonal", desc: "Capacidad de autoconocimiento, introspección, comprensión de emociones propias y metas personales.", careers: "Psicólogos, Filósofos, Investigadores, Autores, Emprendedores." },
      { id: 7, icon: "🤝", title: "7. Interpersonal", desc: "Capacidad de empatía, liderazgo, entender intenciones ajenas y relacionarse con los demás.", careers: "Líderes, Diplomáticos, Docentes, Trabajadores Sociales, Terapeutas." },
      { id: 8, icon: "🌿", title: "8. Naturalista", desc: "Sensibilidad para identificar, clasificar y comprender especies del entorno natural, flora y fauna.", careers: "Biólogos, Ecólogos, Veterinarios, Botánicos, Geólogos." }
    ];

    document.addEventListener('DOMContentLoaded', () => {
      renderCards();
    });

    function renderCards() {
      const grid = document.getElementById('intelGrid');
      grid.innerHTML = intelligences.map(item => `
        <div class="card-intel-3d" onmousemove="handleTilt(event, this)" onmouseleave="resetTilt(this)">
          <div>
            <span class="intel-number">0${item.id} / 08</span>
            <div class="icon-box-3d">${item.icon}</div>
            <h3 class="intel-title">${item.title}</h3>
            <p class="intel-desc">${item.desc}</p>
          </div>
          <button onclick="openModal(${item.id})" class="btn-test">
            ✨ Probar & Evaluar
          </button>
        </div>
      `).join('');
    }

    // Efecto 3D Tilt al mover el mouse
    function handleTilt(e, card) {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -12;
      const rotateY = ((x - centerX) / centerX) * 12;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    }

    function resetTilt(card) {
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)`;
    }

    // Modal
    function openModal(id) {
      const item = intelligences.find(i => i.id === id);
      if (!item) return;

      document.getElementById('modalIcon').textContent = item.icon;
      document.getElementById('modalTitle').textContent = item.title;
      document.getElementById('modalDesc').textContent = item.desc;
      document.getElementById('modalCareers').textContent = item.careers;
      
      document.getElementById('scoreSlider').value = 85;
      document.getElementById('scoreVal').textContent = '85%';
      
      document.getElementById('evalModal').classList.add('active');
    }

    function closeModal() {
      document.getElementById('evalModal').classList.remove('active');
    }

    function updateScore(val) {
      document.getElementById('scoreVal').textContent = `${val}%`;
    }