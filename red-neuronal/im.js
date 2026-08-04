// ========== CONFIGURACIÓN DE LA RED NEURONAL REAL ==========
        let model = null;
        let isTraining = false;
        
        // Configuración del canvas de dibujo
        const drawCanvas = document.getElementById('drawCanvas');
        const previewCanvas = document.getElementById('previewCanvas');
        const ctx = drawCanvas.getContext('2d');
        const previewCtx = previewCanvas.getContext('2d');
        
        let drawing = false;
        
        // Inicializar canvas de dibujo
        function initCanvas() {
            ctx.fillStyle = '#000000';
            ctx.fillRect(0, 0, 280, 280);
            ctx.strokeStyle = '#FFFFFF';
            ctx.lineWidth = 20;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            
            drawCanvas.addEventListener('mousedown', startDrawing);
            drawCanvas.addEventListener('mousemove', draw);
            drawCanvas.addEventListener('mouseup', stopDrawing);
            drawCanvas.addEventListener('mouseleave', stopDrawing);
            
            // Touch events para móviles
            drawCanvas.addEventListener('touchstart', startDrawingTouch);
            drawCanvas.addEventListener('touchmove', drawTouch);
            drawCanvas.addEventListener('touchend', stopDrawing);
        }
        
        function startDrawing(e) {
            drawing = true;
            ctx.beginPath();
            ctx.moveTo(e.offsetX, e.offsetY);
        }
        
        function draw(e) {
            if (!drawing) return;
            ctx.lineTo(e.offsetX, e.offsetY);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(e.offsetX, e.offsetY);
        }
        
        function startDrawingTouch(e) {
            e.preventDefault();
            drawing = true;
            const rect = drawCanvas.getBoundingClientRect();
            const x = e.touches[0].clientX - rect.left;
            const y = e.touches[0].clientY - rect.top;
            ctx.beginPath();
            ctx.moveTo(x, y);
        }
        
        function drawTouch(e) {
            e.preventDefault();
            if (!drawing) return;
            const rect = drawCanvas.getBoundingClientRect();
            const x = e.touches[0].clientX - rect.left;
            const y = e.touches[0].clientY - rect.top;
            ctx.lineTo(x, y);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x, y);
        }
        
        function stopDrawing() {
            drawing = false;
            updatePreview();
        }
        
        function updatePreview() {
            // Redimensionar a 28x28 píxeles (como MNIST)
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = 28;
            tempCanvas.height = 28;
            const tempCtx = tempCanvas.getContext('2d');
            tempCtx.drawImage(drawCanvas, 0, 0, 28, 28);
            
            // Invertir colores (MNIST: fondo negro, dígito blanco)
            const imgData = tempCtx.getImageData(0, 0, 28, 28);
            for (let i = 0; i < imgData.data.length; i += 4) {
                // Invertir y normalizar
                imgData.data[i] = 255 - imgData.data[i];     // R
                imgData.data[i+1] = 255 - imgData.data[i+1]; // G
                imgData.data[i+2] = 255 - imgData.data[i+2]; // B
            }
            tempCtx.putImageData(imgData, 0, 0);
            
            // Mostrar preview
            previewCtx.drawImage(tempCanvas, 0, 0, 140, 140);
            
            return tempCanvas;
        }
        
        function getImageTensor() {
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = 28;
            tempCanvas.height = 28;
            const tempCtx = tempCanvas.getContext('2d');
            tempCtx.drawImage(drawCanvas, 0, 0, 28, 28);
            
            // Normalizar a valores [0,1]
            const imgData = tempCtx.getImageData(0, 0, 28, 28);
            const pixels = [];
            for (let i = 0; i < imgData.data.length; i += 4) {
                // Promedio RGB e invertir (MNIST: fondo negro, dígito blanco)
                const gray = 1 - (imgData.data[i] + imgData.data[i+1] + imgData.data[i+2]) / (3 * 255);
                pixels.push(gray);
            }
            
            return tf.tensor4d(pixels, [1, 28, 28, 1]);
        }
        
        // ========== CREAR MODELO CNN REAL ==========
        function createModel() {
            const model = tf.sequential();
            
            // Capa convolucional 1
            model.add(tf.layers.conv2d({
                inputShape: [28, 28, 1],
                filters: 32,
                kernelSize: 3,
                activation: 'relu'
            }));
            
            // MaxPooling 1
            model.add(tf.layers.maxPooling2d({ poolSize: 2 }));
            
            // Capa convolucional 2
            model.add(tf.layers.conv2d({
                filters: 64,
                kernelSize: 3,
                activation: 'relu'
            }));
            
            // MaxPooling 2
            model.add(tf.layers.maxPooling2d({ poolSize: 2 }));
            
            // Flatten
            model.add(tf.layers.flatten());
            
            // Capa densa oculta
            model.add(tf.layers.dense({
                units: 128,
                activation: 'relu'
            }));
            
            // Capa de salida (10 clases, softmax)
            model.add(tf.layers.dense({
                units: 10,
                activation: 'softmax'
            }));
            
            // Compilar con optimizador y función de pérdida
            model.compile({
                optimizer: tf.train.adam(0.001),
                loss: 'categoricalCrossentropy',
                metrics: ['accuracy']
            });
            
            return model;
        }
        
        // ========== ENTRENAR CON DATOS MNIST ==========
        async function loadMNISTData() {
            // Cargar datos MNIST preprocesados (usamos una versión reducida para el navegador)
            // En una implementación real, se cargarían los archivos .gz completos
            
            // Datos de ejemplo para demostración (pequeño conjunto)
            // En producción se usarían los 60,000+ ejemplos de MNIST
            const numSamples = 1000;
            const inputs = [];
            const outputs = [];
            
            for (let i = 0; i < numSamples; i++) {
                const label = Math.floor(Math.random() * 10);
                const img = generateRandomDigitImage(label);
                inputs.push(img);
                const oneHot = new Array(10).fill(0);
                oneHot[label] = 1;
                outputs.push(oneHot);
            }
            
            return {
                inputs: tf.tensor4d(inputs, [numSamples, 28, 28, 1]),
                outputs: tf.tensor2d(outputs, [numSamples, 10])
            };
        }
        
        function generateRandomDigitImage(digit) {
            // Genera una imagen simulada para demostración
            const img = new Array(28 * 28).fill(0);
            const centerX = 14 + (Math.random() - 0.5) * 6;
            const centerY = 14 + (Math.random() - 0.5) * 6;
            
            for (let i = 0; i < 28 * 28; i++) {
                const x = i % 28;
                const y = Math.floor(i / 28);
                const dx = x - centerX;
                const dy = y - centerY;
                const dist = Math.sqrt(dx*dx + dy*dy);
                
                if (dist < 8 && (digit === 0 || digit === 6 || digit === 8 || digit === 9)) {
                    img[i] = Math.max(0, 1 - dist/10);
                } else if (dist < 5 && (digit === 1 || digit === 7)) {
                    img[i] = Math.max(0, 1 - dist/6);
                } else if (dist < 7 && (digit === 2 || digit === 3 || digit === 5)) {
                    img[i] = Math.max(0, 1 - dist/8);
                } else if (dist < 6 && digit === 4) {
                    img[i] = Math.max(0, 1 - dist/7);
                } else {
                    img[i] = Math.random() * 0.1;
                }
            }
            
            return img;
        }
        
        async function trainModel() {
            if (isTraining) return;
            isTraining = true;
            
            const statusText = document.getElementById('statusText');
            const accuracyText = document.getElementById('accuracyText');
            const lossText = document.getElementById('lossText');
            
            statusText.innerHTML = 'Entrenando...';
            
            // Crear modelo si no existe
            if (!model) {
                model = createModel();
            }
            
            // Generar datos de entrenamiento
            const numSamples = 2000;
            const trainInputs = [];
            const trainOutputs = [];
            const testInputs = [];
            const testOutputs = [];
            
            for (let i = 0; i < numSamples; i++) {
                const label = Math.floor(Math.random() * 10);
                const img = generateRandomDigitImage(label);
                const oneHot = new Array(10).fill(0);
                oneHot[label] = 1;
                
                if (i < numSamples * 0.8) {
                    trainInputs.push(img);
                    trainOutputs.push(oneHot);
                } else {
                    testInputs.push(img);
                    testOutputs.push(oneHot);
                }
            }
            
            const xs = tf.tensor4d(trainInputs, [trainInputs.length, 28, 28, 1]);
            const ys = tf.tensor2d(trainOutputs, [trainOutputs.length, 10]);
            
            // Entrenamiento con backpropagation real
            await model.fit(xs, ys, {
                epochs: 20,
                batchSize: 32,
                validationSplit: 0.2,
                callbacks: {
                    onEpochEnd: (epoch, logs) => {
                        statusText.innerHTML = `Entrenando... Época ${epoch + 1}/20`;
                        accuracyText.innerHTML = `${(logs.acc * 100).toFixed(1)}%`;
                        lossText.innerHTML = logs.loss.toFixed(4);
                    }
                }
            });
            
            // Evaluar en test
            const xsTest = tf.tensor4d(testInputs, [testInputs.length, 28, 28, 1]);
            const ysTest = tf.tensor2d(testOutputs, [testOutputs.length, 10]);
            const evaluation = await model.evaluate(xsTest, ysTest);
            const testAcc = evaluation[1].dataSync()[0];
            
            statusText.innerHTML = '✅ Entrenado';
            accuracyText.innerHTML = `${(testAcc * 100).toFixed(1)}%`;
            
            xs.dispose();
            ys.dispose();
            xsTest.dispose();
            ysTest.dispose();
            
            isTraining = false;
            
            // Guardar modelo en localStorage
            await model.save('localstorage://mnist-cnn-model');
        }
        
        async function loadPretrainedModel() {
            const statusText = document.getElementById('statusText');
            statusText.innerHTML = 'Cargando modelo...';
            
            try {
                // Intentar cargar desde localStorage
                const loadedModel = await tf.loadLayersModel('localstorage://mnist-cnn-model');
                model = loadedModel;
                statusText.innerHTML = '✅ Modelo cargado';
            } catch(e) {
                // Si no existe, crear y entrenar uno básico
                statusText.innerHTML = 'Creando modelo...';
                model = createModel();
                await trainModel();
            }
        }
        
        async function predict() {
            if (!model) {
                await loadPretrainedModel();
            }
            
            const tensor = getImageTensor();
            const prediction = await model.predict(tensor).data();
            tensor.dispose();
            
            // Mostrar resultados
            const resultDiv = document.getElementById('predictionResult');
            const classes = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
            const predictions = Array.from(prediction);
            
            // Ordenar por confianza
            const sorted = predictions.map((conf, idx) => ({ digit: classes[idx], confidence: conf }))
                                      .sort((a, b) => b.confidence - a.confidence);
            
            const topPrediction = sorted[0];
            
            let html = `
                <div style="text-align:center; margin-bottom:15px;">
                    <span style="font-size:2rem;">🎯</span>
                    <span style="font-size:1.5rem; font-weight:bold; color:#f5cb5c;">Predicción: ${topPrediction.digit}</span>
                    <span style="font-size:1rem;"> (${(topPrediction.confidence * 100).toFixed(1)}% confianza)</span>
                </div>
                <div style="margin-top:15px;">
            `;
            
            sorted.forEach((pred, i) => {
                const widthPercent = pred.confidence * 100;
                html += `
                    <div class="class-item">
                        <div class="class-name">Dígito ${pred.digit}</div>
                        <div class="confidence-bar">
                            <div class="confidence-fill" style="width: ${widthPercent}%">${widthPercent > 15 ? (pred.confidence * 100).toFixed(1) + '%' : ''}</div>
                        </div>
                        <div class="confidence-value">${(pred.confidence * 100).toFixed(1)}%</div>
                    </div>
                `;
            });
            
            html += `</div>`;
            resultDiv.innerHTML = html;
        }
        
        function clearCanvas() {
            ctx.fillStyle = '#000000';
            ctx.fillRect(0, 0, 280, 280);
            updatePreview();
            
            // Limpiar resultado
            document.getElementById('predictionResult').innerHTML = `
                <div style="text-align:center; color:#7ae2f0;">Dibuja un número y haz clic en Predecir</div>
            `;
        }
        
        // ========== INICIALIZACIÓN ==========
        async function init() {
            initCanvas();
            updatePreview();
            
            // Crear modelo base
            model = createModel();
            
            // Eventos
            document.getElementById('clearBtn').addEventListener('click', clearCanvas);
            document.getElementById('predictBtn').addEventListener('click', predict);
            document.getElementById('trainBtn').addEventListener('click', trainModel);
            document.getElementById('loadPretrainedBtn').addEventListener('click', loadPretrainedModel);
            
            // Cargar modelo si existe
            await loadPretrainedModel();
        }
        
        init();