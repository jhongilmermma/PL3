/* ================================================================
   HEALTHML ENGINE v3.0 - MACHINE LEARNING NATIVO
   ================================================================ */

// ----------------------------------------------------------------
// 1. CONFIGURACIÓN GLOBAL
// ----------------------------------------------------------------
const FEATURES = ['edad', 'imc', 'presion_sist', 'presion_diast', 'glucosa', 'colesterol'];
const TARGET = 'enfermedad';

let dataset = [];
let trainedTree = null;
let currentMetrics = {};

// ----------------------------------------------------------------
// 2. ÁRBOL DE DECISIÓN (CART) CON PROBABILIDADES
// ----------------------------------------------------------------
class DecisionTree {
    constructor(options = {}) {
        this.maxDepth = options.maxDepth || 5;
        this.minLeaf = options.minLeaf || 2;
        this.root = null;
        this.featureImportance = {};
    }

    // Entrenamiento principal
    train(data) {
        this.root = this._buildTree(data, 0);
        this._calculateImportance(data);
    }

    _buildTree(data, depth) {
        const labels = data.map(d => d[TARGET]);
        const unique = [...new Set(labels)];

        // Caso base: hoja
        if (unique.length === 1 || depth >= this.maxDepth || data.length < this.minLeaf) {
            const counts = labels.reduce((acc, v) => (acc[v] = (acc[v] || 0) + 1, acc), {});
            const total = data.length;
            return {
                isLeaf: true,
                output: parseInt(Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b)),
                distribution: { 0: (counts[0] || 0) / total, 1: (counts[1] || 0) / total }
            };
        }

        let bestGini = Infinity;
        let bestSplit = null;

        for (const feat of FEATURES) {
            const values = data.map(d => d[feat]);
            const sorted = [...new Set(values)].sort((a, b) => a - b);
            for (let i = 0; i < sorted.length - 1; i++) {
                const threshold = (sorted[i] + sorted[i + 1]) / 2;
                const left = data.filter(d => d[feat] <= threshold);
                const right = data.filter(d => d[feat] > threshold);
                if (left.length === 0 || right.length === 0) continue;

                const gini = (left.length / data.length) * this._gini(left) +
                             (right.length / data.length) * this._gini(right);

                if (gini < bestGini) {
                    bestGini = gini;
                    bestSplit = { feature: feat, threshold, left, right };
                }
            }
        }

        if (!bestSplit) {
            const counts = labels.reduce((acc, v) => (acc[v] = (acc[v] || 0) + 1, acc), {});
            const total = data.length;
            return {
                isLeaf: true,
                output: parseInt(Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b)),
                distribution: { 0: (counts[0] || 0) / total, 1: (counts[1] || 0) / total }
            };
        }

        // Guardar importancia (reducción de Gini)
        const impurityReduction = this._gini(data) - bestGini;
        this.featureImportance[bestSplit.feature] = (this.featureImportance[bestSplit.feature] || 0) + impurityReduction;

        return {
            isLeaf: false,
            feature: bestSplit.feature,
            threshold: bestSplit.threshold,
            left: this._buildTree(bestSplit.left, depth + 1),
            right: this._buildTree(bestSplit.right, depth + 1)
        };
    }

    _gini(group) {
        if (group.length === 0) return 0;
        const labels = group.map(d => d[TARGET]);
        const p0 = labels.filter(v => v === 0).length / labels.length;
        const p1 = labels.filter(v => v === 1).length / labels.length;
        return 1 - (p0 * p0 + p1 * p1);
    }

    // Predicción con probabilidad (confianza)
    predict(sample) {
        return this._predictNode(this.root, sample);
    }

    _predictNode(node, sample) {
        if (node.isLeaf) {
            return {
                class: node.output,
                confidence: node.distribution[1] || 0  // probabilidad de clase 1
            };
        }
        if (sample[node.feature] <= node.threshold) {
            return this._predictNode(node.left, sample);
        } else {
            return this._predictNode(node.right, sample);
        }
    }

    // Calcular importancia normalizada
    _calculateImportance(data) {
        const total = Object.values(this.featureImportance).reduce((a, b) => a + b, 0) || 1;
        for (const key in this.featureImportance) {
            this.featureImportance[key] = (this.featureImportance[key] / total) * 100;
        }
        // Asegurar que todas las features aparezcan
        for (const f of FEATURES) {
            if (!(f in this.featureImportance)) this.featureImportance[f] = 0;
        }
    }

    getImportance() {
        return this.featureImportance;
    }
}

// ----------------------------------------------------------------
// 3. FUNCIONES AUXILIARES
// ----------------------------------------------------------------
function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

// ----------------------------------------------------------------
// 4. GENERADOR DE DATOS SINTÉTICOS
// ----------------------------------------------------------------
function generateSyntheticData(n = 500) {
    const data = [];
    for (let i = 0; i < n; i++) {
        const edad = Math.floor(Math.random() * 50) + 20;
        const imc = +(Math.random() * 20 + 18).toFixed(1);
        const presion_sist = Math.floor(Math.random() * 60) + 100;
        const presion_diast = Math.floor(Math.random() * 40) + 60;
        const glucosa = Math.floor(Math.random() * 100) + 70;
        const colesterol = Math.floor(Math.random() * 150) + 150;

        let riesgo = 0;
        if (edad > 52 && glucosa > 135) riesgo += 1;
        if (imc > 29.5 && presion_sist > 138) riesgo += 1;
        if (colesterol > 240) riesgo += 1;
        if (presion_sist > 145 || presion_diast > 92) riesgo += 1;

        let enfermedad = (riesgo >= 2) ? 1 : 0;
        if (Math.random() < 0.07) enfermedad = 1 - enfermedad;

        data.push({ edad, imc, presion_sist, presion_diast, glucosa, colesterol, enfermedad });
    }
    return data;
}

// ----------------------------------------------------------------
// 5. PIPELINE DE ENTRENAMIENTO Y EVALUACIÓN
// ----------------------------------------------------------------
function trainAndEvaluate() {
    if (dataset.length === 0) {
        alert('No hay datos cargados. Genera o carga un archivo primero.');
        return;
    }

    const depth = parseInt(document.getElementById('hyper-depth').value) || 5;
    const leaf = parseInt(document.getElementById('hyper-leaf').value) || 2;

    // Mezclar y dividir 80/20
    const shuffled = shuffleArray([...dataset]);
    const splitIdx = Math.floor(shuffled.length * 0.8);
    const train = shuffled.slice(0, splitIdx);
    const test = shuffled.slice(splitIdx);

    if (train.length === 0 || test.length === 0) {
        alert('División inválida. Ajusta los parámetros.');
        return;
    }

    // Entrenar
    const tree = new DecisionTree({ maxDepth: depth, minLeaf: leaf });
    tree.train(train);
    trainedTree = tree;

    // Evaluar en test
    let tn = 0, fp = 0, fn = 0, tp = 0;
    for (const sample of test) {
        const pred = tree.predict(sample);
        const real = sample[TARGET];
        if (real === 0 && pred.class === 0) tn++;
        else if (real === 0 && pred.class === 1) fp++;
        else if (real === 1 && pred.class === 0) fn++;
        else if (real === 1 && pred.class === 1) tp++;
    }

    const total = test.length;
    const acc = (tn + tp) / total;
    const precision = (tp + fp) === 0 ? 0 : tp / (tp + fp);
    const recall = (tp + fn) === 0 ? 0 : tp / (tp + fn);
    const specificity = (tn + fp) === 0 ? 0 : tn / (tn + fp);
    const f1 = (precision + recall) === 0 ? 0 : 2 * precision * recall / (precision + recall);
    const mcc = ((tp * tn) - (fp * fn)) / Math.sqrt((tp + fp) * (tp + fn) * (tn + fp) * (tn + fn) || 1);

    currentMetrics = { acc, precision, recall, specificity, f1, mcc, total };

    // Actualizar interfaz
    updateMetricsUI();
    updateStatusBadge(true);
    renderConfusionMatrix(tn, fp, fn, tp);
    renderFeatureImportance(tree.getImportance());

    // Evaluar automáticamente el paciente actual
    evaluatePatient();
}

// ----------------------------------------------------------------
// 6. ACTUALIZACIÓN DE UI
// ----------------------------------------------------------------
function updateMetricsUI() {
    const m = currentMetrics;
    document.getElementById('m-acc').textContent = (m.acc * 100).toFixed(1) + '%';
    document.getElementById('m-pre').textContent = (m.precision * 100).toFixed(1) + '%';
    document.getElementById('m-rec').textContent = (m.recall * 100).toFixed(1) + '%';
    document.getElementById('m-spec').textContent = (m.specificity * 100).toFixed(1) + '%';
    document.getElementById('m-f1').textContent = (m.f1 * 100).toFixed(1) + '%';
    document.getElementById('m-size').textContent = m.total || dataset.length;
}

function updateStatusBadge(active) {
    const badge = document.getElementById('modelStatus');
    if (active) {
        badge.textContent = '✅ Modelo activo';
        badge.className = 'status-badge active';
    } else {
        badge.textContent = '⚡ Sin entrenar';
        badge.className = 'status-badge';
    }
}

function updateTablePreview() {
    const tbody = document.getElementById('tableBody');
    tbody.innerHTML = '';
    if (dataset.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="empty-state">No hay datos cargados</td></tr>';
        document.getElementById('rowCount').textContent = '0 registros';
        return;
    }
    const preview = dataset.slice(0, 8);
    preview.forEach(row => {
        tbody.innerHTML += `
            <tr>
                <td>${row.edad}</td>
                <td>${row.imc}</td>
                <td>${row.presion_sist}</td>
                <td>${row.presion_diast}</td>
                <td>${row.glucosa}</td>
                <td>${row.colesterol}</td>
                <td style="color:${row.enfermedad === 1 ? 'var(--accent-rose)' : 'var(--accent-green)'}; font-weight:600;">${row.enfermedad}</td>
            </tr>
        `;
    });
    document.getElementById('rowCount').textContent = `${dataset.length} registros`;
}

// ----------------------------------------------------------------
// 7. MATRIZ DE CONFUSIÓN (Canvas)
// ----------------------------------------------------------------
function renderConfusionMatrix(tn, fp, fn, tp) {
    const canvas = document.getElementById('cmCanvas');
    const ctx = canvas.getContext('2d');
    const size = 180;
    canvas.width = size;
    canvas.height = size;
    ctx.clearRect(0, 0, size, size);

    const cell = size / 2;
    const maxVal = Math.max(tn, fp, fn, tp, 1);
    const matrix = [[tn, fp], [fn, tp]];

    for (let r = 0; r < 2; r++) {
        for (let c = 0; c < 2; c++) {
            const val = matrix[r][c];
            const intensity = Math.max(0.05, val / maxVal);
            const isCorrect = (r === c);
            ctx.fillStyle = isCorrect
                ? `rgba(46, 204, 113, ${0.15 + intensity * 0.7})`
                : `rgba(244, 63, 94, ${0.15 + intensity * 0.7})`;
            ctx.fillRect(c * cell, r * cell, cell, cell);
            ctx.strokeStyle = 'rgba(255,255,255,0.05)';
            ctx.lineWidth = 1;
            ctx.strokeRect(c * cell, r * cell, cell, cell);

            ctx.fillStyle = '#fff';
            ctx.font = 'bold 16px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(val, c * cell + cell / 2, r * cell + cell / 2);
        }
    }

    // Etiquetas
    ctx.fillStyle = 'var(--text-secondary)';
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText('Pred. Neg', cell / 2, size + 6);
    ctx.fillText('Pred. Pos', cell + cell / 2, size + 6);
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.fillText('Real Neg', 4, cell / 2);
    ctx.fillText('Real Pos', 4, cell + cell / 2);
}

// ----------------------------------------------------------------
// 8. IMPORTANCIA DE CARACTERÍSTICAS
// ----------------------------------------------------------------
function renderFeatureImportance(importance) {
    const container = document.getElementById('importanceContainer');
    container.innerHTML = '';
    const sorted = Object.entries(importance).sort((a, b) => b[1] - a[1]);
    sorted.forEach(([feature, value]) => {
        const row = document.createElement('div');
        row.className = 'importance-row';
        row.innerHTML = `
            <span class="label">${feature.replace('_', ' ')}</span>
            <div class="track">
                <div class="fill" style="width: ${Math.min(value, 100)}%"></div>
            </div>
            <span class="value">${Math.round(value)}%</span>
        `;
        container.appendChild(row);
    });
}

// ----------------------------------------------------------------
// 9. EVALUACIÓN DE PACIENTE (con confianza)
// ----------------------------------------------------------------
function evaluatePatient() {
    if (!trainedTree) {
        document.getElementById('resultDisplay').className = 'result-box';
        document.getElementById('resultDisplay').querySelector('.result-text').textContent = '⚠️ Entrena el modelo primero.';
        document.getElementById('confidenceBadge').textContent = '';
        return;
    }

    const sample = {
        edad: parseFloat(document.getElementById('p-edad').value) || 0,
        imc: parseFloat(document.getElementById('p-imc').value) || 0,
        presion_sist: parseFloat(document.getElementById('p-sist').value) || 0,
        presion_diast: parseFloat(document.getElementById('p-diast').value) || 0,
        glucosa: parseFloat(document.getElementById('p-gluc').value) || 0,
        colesterol: parseFloat(document.getElementById('p-col').value) || 0
    };

    const result = trainedTree.predict(sample);
    const display = document.getElementById('resultDisplay');
    const textSpan = display.querySelector('.result-text');
    const badge = document.getElementById('confidenceBadge');

    if (result.class === 1) {
        display.className = 'result-box danger';
        textSpan.textContent = '⚠️ Alto riesgo clínico';
    } else {
        display.className = 'result-box success';
        textSpan.textContent = '✅ Parámetros normales / bajo riesgo';
    }

    const confidence = result.confidence * 100;
    let badgeClass = 'confidence-badge';
    if (confidence >= 75) badgeClass += ' high';
    else if (confidence >= 50) badgeClass += ' medium';
    else badgeClass += ' low';
    badge.className = badgeClass;
    badge.textContent = `Confianza: ${confidence.toFixed(1)}%`;
}

// ----------------------------------------------------------------
// 10. CARGA DE ARCHIVOS (Excel/CSV)
// ----------------------------------------------------------------
function loadFileContent(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const json = XLSX.utils.sheet_to_json(sheet);

            // Normalizar nombres de columnas
            const normalize = (str) => str.trim().toLowerCase().replace(/\s+/g, '_');
            const headers = Object.keys(json[0]);
            const map = {};
            headers.forEach(h => {
                const norm = normalize(h);
                if (norm.includes('edad') || norm.includes('age')) map[h] = 'edad';
                else if (norm.includes('imc') || norm.includes('bmi')) map[h] = 'imc';
                else if (norm.includes('sist') || norm.includes('systolic')) map[h] = 'presion_sist';
                else if (norm.includes('diast') || norm.includes('diastolic')) map[h] = 'presion_diast';
                else if (norm.includes('gluc')) map[h] = 'glucosa';
                else if (norm.includes('colester') || norm.includes('cholesterol')) map[h] = 'colesterol';
                else if (norm.includes('enferm') || norm.includes('disease')) map[h] = 'enfermedad';
                else map[h] = norm;
            });

            dataset = json.map(row => {
                const newRow = {};
                for (const k in row) {
                    const newKey = map[k] || k;
                    const val = parseFloat(row[k]);
                    newRow[newKey] = isNaN(val) ? row[k] : val;
                }
                // Asegurar columnas
                for (const f of FEATURES) {
                    if (!(f in newRow)) newRow[f] = 0;
                }
                if (!('enfermedad' in newRow)) newRow.enfermedad = 0;
                return newRow;
            });

            document.getElementById('fileInfo').textContent = `✅ ${dataset.length} registros cargados desde ${file.name}`;
            updateTablePreview();
            updateStatusBadge(false);
            // Entrenar automáticamente
            trainAndEvaluate();

        } catch (err) {
            alert('Error al leer el archivo: ' + err.message);
        }
    };
    reader.readAsArrayBuffer(file);
}

// ----------------------------------------------------------------
// 11. EVENTOS E INICIALIZACIÓN
// ----------------------------------------------------------------
document.addEventListener('DOMContentLoaded', function() {
    // Generar datos de ejemplo al inicio
    dataset = generateSyntheticData(500);
    updateTablePreview();
    trainAndEvaluate();

    // Botón generar datos falsos
    document.getElementById('btnFakeData').addEventListener('click', function() {
        dataset = generateSyntheticData(500);
        document.getElementById('fileInfo').textContent = '🧪 Datos sintéticos generados (500)';
        updateTablePreview();
        trainAndEvaluate();
    });

    // Botón entrenar manual
    document.getElementById('btnTrain').addEventListener('click', function() {
        if (dataset.length === 0) {
            alert('No hay datos. Genera o carga un archivo.');
            return;
        }
        trainAndEvaluate();
    });

    // Botón evaluar paciente
    document.getElementById('btnEvaluate').addEventListener('click', evaluatePatient);

    // Botón reset
    document.getElementById('btnReset').addEventListener('click', function() {
        if (confirm('¿Reiniciar todo? Se perderán los datos cargados.')) {
            dataset = [];
            trainedTree = null;
            updateTablePreview();
            document.getElementById('fileInfo').textContent = 'Ningún archivo cargado';
            document.getElementById('metricsStrip').querySelectorAll('.value').forEach(el => el.textContent = '—');
            document.getElementById('resultDisplay').className = 'result-box';
            document.getElementById('resultDisplay').querySelector('.result-text').textContent = 'Esperando evaluación...';
            document.getElementById('confidenceBadge').textContent = '';
            updateStatusBadge(false);
            renderConfusionMatrix(0,0,0,0);
            renderFeatureImportance({});
        }
    });

    // Dropzone y selector de archivos
    const dropzone = document.getElementById('dropzone');
    const fileSelector = document.getElementById('fileSelector');

    dropzone.addEventListener('click', () => fileSelector.click());
    dropzone.addEventListener('dragover', (e) => { e.preventDefault(); dropzone.style.borderColor = 'var(--accent-indigo)'; });
    dropzone.addEventListener('dragleave', () => { dropzone.style.borderColor = 'rgba(255,255,255,0.1)'; });
    dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzone.style.borderColor = 'rgba(255,255,255,0.1)';
        if (e.dataTransfer.files.length) {
            fileSelector.files = e.dataTransfer.files;
            loadFileContent(e.dataTransfer.files[0]);
        }
    });
    fileSelector.addEventListener('change', () => {
        if (fileSelector.files.length) {
            loadFileContent(fileSelector.files[0]);
        }
    });

    // Evaluación automática al cambiar inputs (opcional)
    document.querySelectorAll('#p-edad, #p-imc, #p-sist, #p-diast, #p-gluc, #p-col').forEach(input => {
        input.addEventListener('input', evaluatePatient);
    });
});