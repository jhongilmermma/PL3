/* ==========================================================================
   PORTAFOLIO LP3 - LÓGICA DE PROYECTOS, BÚSQUEDA Y MODAL INTERACTIVO
   ========================================================================== */

const projectsData = [
  {
    id: 1,
    folder: "analisis-composicion-riesgo-abdominal",
    title: "Análisis Corporal & Riesgo Abdominal",
    category: "salud",
    categoryLabel: "Salud",
    tagClass: "tag-salud",
    description: "Evaluación cuantitativa y cualitativa de grasa corporal, masa e índices de riesgo metabólico/abdominal.",
    tech: ["HTML5", "CSS3", "JavaScript"],
    mainFile: "index.html"
  },
  {
    id: 2,
    folder: "cajero-automatico",
    title: "Simulador de Cajero Automático",
    category: "comercio",
    categoryLabel: "Finanzas",
    tagClass: "tag-comercio",
    description: "Aplicación interactiva que simula transacciones bancarias (retiro, depósito, consulta de saldo y validación PIN).",
    tech: ["HTML5", "CSS3", "JavaScript"],
    mainFile: "index.html"
  },
  {
    id: 3,
    folder: "calculadora-cientifica",
    title: "Calculadora Científica Web",
    category: "utilidades",
    categoryLabel: "Utilidades",
    tagClass: "tag-utilidades",
    description: "Calculadora avanzada interactiva con funciones trigonométricas, exponenciales, memoria y formato estilizado.",
    tech: ["HTML5", "CSS3", "JavaScript"],
    mainFile: "index.html"
  },
  {
    id: 4,
    folder: "calculadora-imc",
    title: "Calculadora de Índice de Masa Corporal",
    category: "salud",
    categoryLabel: "Salud",
    tagClass: "tag-salud",
    description: "Evaluador de salud nutricional con semaforización gráfica de riesgo y cálculo dinámico de IMC.",
    tech: ["HTML5", "CSS3", "JavaScript"],
    mainFile: "index.html"
  },
  {
    id: 5,
    folder: "clasificacion-emergencia-triaje",
    title: "Sistema de Triaje y Clasificación Médica",
    category: "salud",
    categoryLabel: "Salud",
    tagClass: "tag-salud",
    description: "Algoritmo de atención médica hospitalaria que clasifica emergencias por código de colores e intencionalidad.",
    tech: ["HTML5", "CSS3", "JavaScript"],
    mainFile: "index.html"
  },
  {
    id: 6,
    folder: "congreso-bd-monousuario",
    title: "Gestión de Congreso Monousuario",
    category: "utilidades",
    categoryLabel: "Sistemas",
    tagClass: "tag-utilidades",
    description: "Base de datos y sistema de control de asistencia, acreditación y catálogo de participantes para conferencias.",
    tech: ["HTML5", "CSS3", "JavaScript"],
    mainFile: "index.html"
  },
  {
    id: 7,
    folder: "control-inventario",
    title: "Sistema de Control de Inventario",
    category: "comercio",
    categoryLabel: "Comercio",
    tagClass: "tag-comercio",
    description: "Gestor dinámico de entrada, salida y balance de productos en almacén con tabla de datos interactiva.",
    tech: ["HTML5", "CSS3", "JavaScript"],
    mainFile: "index.html"
  },
  {
    id: 8,
    folder: "convertidor-numeros",
    title: "Convertidor de Bases Numéricas",
    category: "algoritmos",
    categoryLabel: "Algoritmos",
    tagClass: "tag-algoritmos",
    description: "Herramienta algorítmica para convertir valores en tiempo real entre binario, octal, decimal y hexadecimal.",
    tech: ["HTML5", "CSS3", "JavaScript"],
    mainFile: "index.html"
  },
  {
    id: 9,
    folder: "data-fest",
    title: "DataFest Interactive App",
    category: "utilidades",
    categoryLabel: "Datos",
    tagClass: "tag-utilidades",
    description: "Plataforma de presentación interactiva para el evento DataFest con análisis de métricas y datos.",
    tech: ["HTML5", "CSS3", "JavaScript"],
    mainFile: "INDEX.html"
  },
  {
    id: 10,
    folder: "factura-tienda",
    title: "Generador de Facturas & Comprobantes",
    category: "comercio",
    categoryLabel: "Comercio",
    tagClass: "tag-comercio",
    description: "Módulo de facturación comercial con cálculo automático de subtotal, IGV (18%), descuentos y totales.",
    tech: ["HTML5", "CSS3", "JavaScript"],
    mainFile: "index.html"
  },
  {
    id: 11,
    folder: "generador-tarjetas-perfil",
    title: "Generador Dinámico de Tarjetas",
    category: "utilidades",
    categoryLabel: "Utilidades",
    tagClass: "tag-utilidades",
    description: "Creador visual de tarjetas de presentación y perfiles de usuario personalizables en tiempo real.",
    tech: ["HTML5", "CSS3", "JavaScript"],
    mainFile: "index.html"
  },
  {
    id: 12,
    folder: "horoscopo-zodiacal",
    title: "Sistema de Horóscopo Zodiacal",
    category: "utilidades",
    categoryLabel: "Utilidades",
    tagClass: "tag-utilidades",
    description: "Evaluador condicional de signos del zodiaco basado en fecha de nacimiento, elemento y predicciones.",
    tech: ["HTML5", "CSS3", "JavaScript"],
    mainFile: "oroscopo"
  },
  {
    id: 13,
    folder: "huella-carbono",
    title: "Calculadora de Huella de Carbono",
    category: "salud",
    categoryLabel: "Ecología",
    tagClass: "tag-salud",
    description: "Estimador de emisiones individuales de CO2 con recomendaciones ecológicas para reducir el impacto ambiental.",
    tech: ["HTML5", "CSS3", "JavaScript"],
    mainFile: "index.html"
  },
  {
    id: 14,
    folder: "inteligencia-emocional",
    title: "Test de Inteligencia Emocional",
    category: "ia",
    categoryLabel: "IA & Psicología",
    tagClass: "tag-ia",
    description: "Evaluación psicométrica sobre autoconocimiento, autorregulación y automotivación con informe interactivo.",
    tech: ["HTML5", "CSS3", "JavaScript"],
    mainFile: "1.- Autoconocimiento/index.html"
  },
  {
    id: 15,
    folder: "inteligencias-multiples",
    title: "Evaluación de Inteligencias Múltiples",
    category: "ia",
    categoryLabel: "IA & Psicología",
    tagClass: "tag-ia",
    description: "Test basado en la teoría de Howard Gardner (lógica, musical, espacial, interpersonal, corporativa).",
    tech: ["HTML5", "CSS3", "JavaScript"],
    mainFile: "inteligencia.html"
  },
  {
    id: 16,
    folder: "justicia-tribunal",
    title: "Sistema de Dictamen Legal & Tribunal",
    category: "ia",
    categoryLabel: "Sistemas Expertos",
    tagClass: "tag-ia",
    description: "Modelo condicional para evaluación de causas legales, análisis de evidencias y dictamen automatizado.",
    tech: ["HTML5", "CSS3", "JavaScript"],
    mainFile: "index.html"
  },
  {
    id: 17,
    folder: "machine-learning",
    title: "Simulador de Machine Learning",
    category: "ia",
    categoryLabel: "Machine Learning",
    tagClass: "tag-ia",
    description: "Modelos introductorios de clasificación y regresión aplicados a datasets mensuales de salud y finanzas.",
    tech: ["HTML5", "CSS3", "JavaScript", "Excel Data"],
    mainFile: "salud/index.html"
  },
  {
    id: 18,
    folder: "par-o-impar",
    title: "Evaluador de Paridad Numérica",
    category: "algoritmos",
    categoryLabel: "Algoritmos",
    tagClass: "tag-algoritmos",
    description: "Algoritmo clásico de validación condicional de números pares, impares y propiedades aritméticas.",
    tech: ["HTML5", "CSS3", "JavaScript"],
    mainFile: "index.html"
  },
  {
    id: 19,
    folder: "proyecto-ladrillos",
    title: "Calculadora de Materiales de Construcción",
    category: "utilidades",
    categoryLabel: "Utilidades",
    tagClass: "tag-utilidades",
    description: "Sistema para calcular cantidad exacta de ladrillos y mortero para muros y losas de techo.",
    tech: ["HTML5", "CSS3", "JavaScript"],
    mainFile: "EXPLORER proyecto-ladrillos/index.html"
  },
  {
    id: 20,
    folder: "reciclador-residuos",
    title: "Clasificador Ecológico de Residuos",
    category: "salud",
    categoryLabel: "Ecología",
    tagClass: "tag-salud",
    description: "Guía interactiva y juego de educación ambiental sobre separación de residuos orgánicos e inorgánicos.",
    tech: ["HTML5", "CSS3", "JavaScript"],
    mainFile: "index.html"
  },
  {
    id: 21,
    folder: "red-neuronal",
    title: "Visualizador de Red Neuronal Artificial",
    category: "ia",
    categoryLabel: "Redes Neuronales",
    tagClass: "tag-ia",
    description: "Simulador visual de capas de entrada, ocultas y de salida en un perceptrón con ponderación de pesos.",
    tech: ["HTML5", "CSS3", "JavaScript"],
    mainFile: "red.html"
  },
  {
    id: 22,
    folder: "simulador-clima-temperatura",
    title: "Monitoreo de Sensores Térmicos",
    category: "simulacion",
    categoryLabel: "Simulación",
    tagClass: "tag-simulacion",
    description: "Simulador en tiempo real con slider de temperatura, alertas cromáticas y registro de logs de seguridad.",
    tech: ["HTML5", "CSS3", "JavaScript"],
    mainFile: "index.html"
  },
  {
    id: 23,
    folder: "simulador-promedio-notas",
    title: "Simulador de Rendimiento Académico (V1)",
    category: "simulacion",
    categoryLabel: "Simulación",
    tagClass: "tag-simulacion",
    description: "Calculadora de promedio cuantitativo con conversión cualitativa y emisión de boleta académica.",
    tech: ["HTML5", "CSS3", "JavaScript"],
    mainFile: "index1.html"
  },
  {
    id: 24,
    folder: "simulador-promedio-notas-v2",
    title: "Simulador de Promedio Académico (V2)",
    category: "simulacion",
    categoryLabel: "Simulación",
    tagClass: "tag-simulacion",
    description: "Segunda versión optimizada con mejor interfaz de usuario, rangos de notas y alertas estilizadas.",
    tech: ["HTML5", "CSS3", "JavaScript"],
    mainFile: "index1.html"
  },
  {
    id: 25,
    folder: "sistema-experto-v1",
    title: "Sistema Experto & Motor de Reglas (V1)",
    category: "ia",
    categoryLabel: "Sistemas Expertos",
    tagClass: "tag-ia",
    description: "Motor de inferencia basado en reglas condicionales (If-Then) para encadenamiento hacia adelante.",
    tech: ["HTML5", "CSS3", "JavaScript"],
    mainFile: "index.html"
  },
  {
    id: 26,
    folder: "sistema-experto-v2",
    title: "Sistema Experto Avanzado (V2)",
    category: "ia",
    categoryLabel: "Sistemas Expertos",
    tagClass: "tag-ia",
    description: "Versión mejorada del motor de decisiones con interfaz moderna y diagnóstico en tiempo real.",
    tech: ["HTML5", "CSS3", "JavaScript"],
    mainFile: "index.html"
  },
  {
    id: 27,
    folder: "tienda-productos",
    title: "Catálogo & Tienda de Productos",
    category: "comercio",
    categoryLabel: "Comercio",
    tagClass: "tag-comercio",
    description: "E-commerce básico interactivo con selector de productos, cálculo de total y simulación de compra.",
    tech: ["HTML5", "CSS3", "JavaScript"],
    mainFile: "index.html"
  },
  {
    id: 28,
    folder: "tipos-de-matrices",
    title: "Generador de Matrices Algebraicas",
    category: "algoritmos",
    categoryLabel: "Algoritmos",
    tagClass: "tag-algoritmos",
    description: "Colección interactiva para renderizar 12 tipos de matrices (Serpiente, Rombo, Triangular, Caracol, L, Inversa).",
    tech: ["HTML5", "CSS3", "JavaScript"],
    mainFile: "matrizes/index.html"
  },
  {
    id: 29,
    folder: "trazado-de-codigo",
    title: "Simulador de Trazado de Código",
    category: "algoritmos",
    categoryLabel: "Algoritmos",
    tagClass: "tag-algoritmos",
    description: "Herramienta educativa para simular la ejecución paso a paso de variables y depuración algorítmica.",
    tech: ["HTML5", "CSS3", "JavaScript"],
    mainFile: "script.js"
  }
];

// Estado global de la aplicación
let activeCategory = 'todos';
let searchQuery = '';

document.addEventListener('DOMContentLoaded', () => {
  renderProjects();
  setupEventListeners();
});

// Renderizado principal de tarjetas
function renderProjects() {
  const container = document.getElementById('projectsGrid');
  if (!container) return;

  const filtered = projectsData.filter(p => {
    const matchesCategory = (activeCategory === 'todos') || (p.category === activeCategory);
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.folder.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 4rem 1rem; color: var(--text-muted);">
        <p style="font-size: 1.2rem; margin-bottom: 0.5rem;">🔍 No se encontraron proyectos</p>
        <p style="font-size: 0.9rem;">Prueba buscando con otro término o seleccionando otra categoría.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(p => {
    const projectUrl = `./${p.folder}/${p.mainFile}`;
    const formattedNum = String(p.id).padStart(2, '0');
    
    return `
      <div class="project-card">
        <div class="card-top">
          <div class="card-header-meta">
            <span class="category-tag ${p.tagClass}">${p.categoryLabel}</span>
            <span class="project-number">#${formattedNum}</span>
          </div>
          <h3 class="card-title">${p.title}</h3>
          <p class="card-desc">${p.description}</p>
        </div>
        
        <div>
          <div class="tech-stack">
            ${p.tech.map(t => `<span class="tech-badge">${t}</span>`).join('')}
          </div>
          
          <div class="card-actions">
            <a href="${projectUrl}" target="_blank" class="btn-open">
              ⚡ Abrir Proyecto
            </a>
            <button onclick="openPreviewModal('${projectUrl}', '${p.title}')" class="btn-preview">
              👁️ Previsualizar
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// Configuración de Filtros y Búsqueda
function setupEventListeners() {
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      renderProjects();
    });
  }

  const pillBtns = document.querySelectorAll('.pill-btn');
  pillBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      pillBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeCategory = btn.getAttribute('data-category');
      renderProjects();
    });
  });
}

// Control del Modal de Vista Previa
function openPreviewModal(url, title) {
  const modal = document.getElementById('previewModal');
  const iframe = document.getElementById('modalIframe');
  const modalTitle = document.getElementById('modalTitle');
  
  if (modal && iframe && modalTitle) {
    modalTitle.textContent = `Vista Previa: ${title}`;
    iframe.src = url;
    modal.classList.add('active');
  }
}

function closePreviewModal() {
  const modal = document.getElementById('previewModal');
  const iframe = document.getElementById('modalIframe');
  
  if (modal && iframe) {
    modal.classList.remove('active');
    iframe.src = 'about:blank';
  }
}
