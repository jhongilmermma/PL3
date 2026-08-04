// Dataset estructurado directamente del Excel original
    const rawData = [
        {"year":2011,"month":1,"value":18.59},{"year":2012,"month":1,"value":18.18},{"year":2013,"month":1,"value":18.14},{"year":2014,"month":1,"value":17.94},{"year":2015,"month":1,"value":19.21},{"year":2016,"month":1,"value":19.39},{"year":2017,"month":1,"value":18.33},{"year":2018,"month":1,"value":19.22},{"year":2019,"month":1,"value":19.8},{"year":2020,"month":1,"value":19.9},{"year":2021,"month":1,"value":18.3},{"year":2022,"month":1,"value":18.5},{"year":2023,"month":1,"value":17.5},{"year":2024,"month":1,"value":18.5},
        {"year":2011,"month":2,"value":17.1},{"year":2012,"month":2,"value":17.84},{"year":2013,"month":2,"value":18.15},{"year":2014,"month":2,"value":18.75},{"year":2015,"month":2,"value":18.36},{"year":2016,"month":2,"value":19.12},{"year":2017,"month":2,"value":20.04},{"year":2018,"month":2,"value":18.5},{"year":2019,"month":2,"value":19.3},{"year":2020,"month":2,"value":19.2},{"year":2021,"month":2,"value":19.1},{"year":2022,"month":2,"value":18.1},{"year":2023,"month":2,"value":18.2},{"year":2024,"month":2,"value":19.2},
        {"year":2011,"month":3,"value":17.37},{"year":2012,"month":3,"value":18.37},{"year":2013,"month":3,"value":18.54},{"year":2014,"month":3,"value":19.02},{"year":2015,"month":3,"value":18.66},{"year":2016,"month":3,"value":19.93},{"year":2017,"month":3,"value":17.95},{"year":2018,"month":3,"value":17.87},{"year":2019,"month":3,"value":19.6},{"year":2020,"month":3,"value":19.2},{"year":2021,"month":3,"value":17.6},{"year":2022,"month":3,"value":18.3},{"year":2023,"month":3,"value":18.4},{"year":2024,"month":3,"value":17.4},
        {"year":2011,"month":4,"value":17.66},{"year":2012,"month":4,"value":17.12},{"year":2013,"month":4,"value":16.77},{"year":2014,"month":4,"value":17.33},{"year":2015,"month":4,"value":16.62},{"year":2016,"month":4,"value":17.28},{"year":2017,"month":4,"value":17.37},{"year":2018,"month":4,"value":17.16},{"year":2019,"month":4,"value":18.0},{"year":2020,"month":4,"value":18.0},{"year":2021,"month":4,"value":16.8},{"year":2022,"month":4,"value":16.9},{"year":2023,"month":4,"value":16.5},{"year":2024,"month":4,"value":16.5},
        {"year":2011,"month":5,"value":14.75},{"year":2012,"month":5,"value":14.77},{"year":2013,"month":5,"value":14.88},{"year":2014,"month":5,"value":14.49},{"year":2015,"month":5,"value":14.76},{"year":2016,"month":5,"value":14.47},{"year":2017,"month":5,"value":14.67},{"year":2018,"month":5,"value":15.11},{"year":2019,"month":5,"value":15.1},{"year":2020,"month":5,"value":16.1},{"year":2021,"month":5,"value":14.7},{"year":2022,"month":5,"value":14.2},{"year":2023,"month":5,"value":13.2},{"year":2024,"month":5,"value":12.2},
        {"year":2011,"month":6,"value":12.79},{"year":2012,"month":6,"value":12.65},{"year":2013,"month":6,"value":11.80},{"year":2014,"month":6,"value":12.55},{"year":2015,"month":6,"value":13.87},{"year":2016,"month":6,"value":12.27},{"year":2017,"month":6,"value":12.90},{"year":2018,"month":6,"value":11.95},{"year":2019,"month":6,"value":13.5},{"year":2020,"month":6,"value":13.8},{"year":2021,"month":6,"value":12.2},{"year":2022,"month":6,"value":11.6},{"year":2023,"month":6,"value":10.6},{"year":2024,"month":6,"value":10.6},
        {"year":2011,"month":7,"value":11.11},{"year":2012,"month":7,"value":12.39},{"year":2013,"month":7,"value":12.04},{"year":2014,"month":7,"value":12.14},{"year":2015,"month":7,"value":11.68},{"year":2016,"month":7,"value":12.19},{"year":2017,"month":7,"value":13.16},{"year":2018,"month":7,"value":12.49},{"year":2019,"month":7,"value":13.0},{"year":2020,"month":7,"value":13.2},{"year":2021,"month":7,"value":12.3},{"year":2022,"month":7,"value":13.1},{"year":2023,"month":7,"value":12.1},{"year":2024,"month":7,"value":11.1},
        {"year":2011,"month":8,"value":13.56},{"year":2012,"month":8,"value":13.67},{"year":2013,"month":8,"value":13.15},{"year":2014,"month":8,"value":13.68},{"year":2015,"month":8,"value":13.58},{"year":2016,"month":8,"value":13.95},{"year":2017,"month":8,"value":14.11},{"year":2018,"month":8,"value":13.29},{"year":2019,"month":8,"value":14.6},{"year":2020,"month":8,"value":14.0},{"year":2021,"month":8,"value":13.1},{"year":2022,"month":8,"value":13.6},{"year":2023,"month":8,"value":12.6},{"year":2024,"month":8,"value":13.6},
        {"year":2011,"month":9,"value":14.78},{"year":2012,"month":9,"value":16.24},{"year":2013,"month":9,"value":14.99},{"year":2014,"month":9,"value":15.59},{"year":2015,"month":9,"value":15.65},{"year":2016,"month":9,"value":15.38},{"year":2017,"month":9,"value":16.01},{"year":2018,"month":9,"value":15.79},{"year":2019,"month":9,"value":16.7},{"year":2020,"month":9,"value":16.2},{"year":2021,"month":9,"value":16.6},{"year":2022,"month":9,"value":15.8},{"year":2023,"month":9,"value":15.9},{"year":2024,"month":9,"value":14.2},
        {"year":2011,"month":10,"value":16.04},{"year":2012,"month":10,"value":17.37},{"year":2013,"month":10,"value":17.12},{"year":2014,"month":10,"value":18.17},{"year":2015,"month":10,"value":17.38},{"year":2016,"month":10,"value":17.11},{"year":2017,"month":10,"value":17.69},{"year":2018,"month":10,"value":18.05},{"year":2019,"month":10,"value":18.6},{"year":2020,"month":10,"value":18.0},{"year":2021,"month":10,"value":18.6},{"year":2022,"month":10,"value":16.7},{"year":2023,"month":10,"value":15.7},{"year":2024,"month":10,"value":15.1},
        {"year":2011,"month":11,"value":18.16},{"year":2012,"month":11,"value":18.91},{"year":2013,"month":11,"value":18.88},{"year":2014,"month":11,"value":18.55},{"year":2015,"month":11,"value":18.68},{"year":2016,"month":11,"value":18.10},{"year":2017,"month":11,"value":19.32},{"year":2018,"month":11,"value":19.57},{"year":2019,"month":11,"value":20.2},{"year":2020,"month":11,"value":19.3},{"year":2021,"month":11,"value":19.1},{"year":2022,"month":11,"value":18.7},{"year":2023,"month":11,"value":18.2},{"year":2024,"month":11,"value":18.4},
        {"year":2011,"month":12,"value":18.35},{"year":2012,"month":12,"value":18.61},{"year":2013,"month":12,"value":18.43},{"year":2014,"month":12,"value":19.03},{"year":2015,"month":12,"value":19.00},{"year":2016,"month":12,"value":19.20},{"year":2017,"month":12,"value":18.72},{"year":2018,"month":12,"value":18.61},{"year":2019,"month":12,"value":20.9},{"year":2020,"month":12,"value":19.6},{"year":2021,"month":12,"value":18.0},{"year":2022,"month":12,"value":18.4},{"year":2023,"month":12,"value":18.1},{"year":2024,"month":12,"value":17.2}
    ];

    // Ordenar cronológicamente para el gráfico de líneas continuo
    rawData.sort((a, b) => (a.year - b.year) || (a.month - b.month));

    let chart;
    let trainedModels = {};
    let bestModelName = "";
    
    // Inicializar Gráfico con Chart.js
    function initChart() {
        const labels = rawData.map(d => `${d.month}/${d.year}`);
        const values = rawData.map(d => d.value);

        const ctx = document.getElementById('mainChart').getContext('2d');
        chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Valores Reales del Dataset',
                    data: values,
                    borderColor: '#6366f1',
                    backgroundColor: 'rgba(99, 102, 241, 0.1)',
                    borderWidth: 2,
                    pointRadius: 2,
                    fill: true
                }, {
                    label: 'Predicción del Ajuste (Mejor Modelo)',
                    data: [],
                    borderColor: '#10b981',
                    borderDash: [5, 5],
                    borderWidth: 2,
                    pointRadius: 0,
                    fill: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: { ticks: { color: '#94a3b8', maxTicksLimit: 15 }, grid: { color: 'rgba(255,255,255,0.05)' } },
                    y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' } }
                },
                plugins: {
                    legend: { labels: { color: '#f8fafc', font: { family: 'Poppins' } } }
                }
            }
        });
    }

    function logger(msg) {
        const consoleEl = document.getElementById('console-log');
        consoleEl.innerHTML += `<br>> ${msg}`;
        consoleEl.scrollTop = consoleEl.scrollHeight;
    }

    // Normalización Min-Max para Redes Neuronales
    const minYear = 2011, maxYear = 2024;
    const minMonth = 1, maxMonth = 12;
    const minVal = 10.6, maxVal = 20.9;

    function normalizeInput(year, month) {
        return [
            (year - minYear) / (maxYear - minYear),
            (month - minMonth) / (maxMonth - minMonth)
        ];
    }
    
    function denormalizeOutput(val) {
        return val * (maxVal - minVal) + minVal;
    }

    // Tubería principal AutoML
    async function runPipeline() {
        document.getElementById('btn-train').disabled = true;
        logger("Preparando tensores y normalizando variables...");

        // Preparar vectores de entrada y salida
        const inputs = rawData.map(d => normalizeInput(d.year, d.month));
        const outputs = rawData.map(d => (d.value - minVal) / (maxVal - minVal));

        const xs = tf.tensor2d(inputs);
        const ys = tf.tensor2d(outputs, [outputs.length, 1]);

        let results = {};

        // --- MODELO 1: Regresión Lineal / Polinomial Simple ---
        logger("Entrenando Modelo 1: Regresión Polinomial Lineal...");
        updateRowStatus('row-m1', 'Entrenando...', 'badge-pending');
        
        const model1 = tf.sequential();
        model1.add(tf.layers.dense({inputShape: [2], units: 4, activation: 'tanh'}));
        model1.add(tf.layers.dense({units: 1}));
        model1.compile({optimizer: tf.train.adam(0.05), loss: 'meanSquaredError'});
        
        await model1.fit(xs, ys, {
            epochs: 50,
            callbacks: {
                onEpochEnd: (epoch, logs) => {
                    if(epoch % 25 === 0) console.log(`M1 Epoch ${epoch}: loss = ${logs.loss}`);
                }
            }
        });
        let m1Loss = evalMSE(model1, xs, ys);
        updateRowStatus('row-m1', 'Completado', 'badge-success', m1Loss.toFixed(5));
        trainedModels['Polynomial'] = model1;
        results['Polynomial'] = m1Loss;

        // --- MODELO 2: Red Neuronal Artificial (MLP Estándar) ---
        logger("Entrenando Modelo 2: Red Neuronal Artificial (MLP)...");
        updateRowStatus('row-m2', 'Entrenando...', 'badge-pending');

        const model2 = tf.sequential();
        model2.add(tf.layers.dense({inputShape: [2], units: 16, activation: 'relu'}));
        model2.add(tf.layers.dense({units: 8, activation: 'relu'}));
        model2.add(tf.layers.dense({units: 1}));
        model2.compile({optimizer: tf.train.adam(0.01), loss: 'meanSquaredError'});

        await model2.fit(xs, ys, {
            epochs: 100,
            callbacks: {
                onEpochEnd: (epoch, logs) => {
                    if(epoch % 25 === 0) console.log(`M2 Epoch ${epoch}: loss = ${logs.loss}`);
                }
            }
        });
        let m2Loss = evalMSE(model2, xs, ys);
        updateRowStatus('row-m2', 'Completado', 'badge-success', m2Loss.toFixed(5));
        trainedModels['MLP'] = model2;
        results['MLP'] = m2Loss;

        // --- MODELO 3: Red Neuronal Profunda con Regularización ---
        logger("Entrenando Modelo 3: Red Neuronal Profunda...");
        updateRowStatus('row-m3', 'Entrenando...', 'badge-pending');

        const model3 = tf.sequential();
        model3.add(tf.layers.dense({inputShape: [2], units: 32, activation: 'swish'}));
        model3.add(tf.layers.dense({units: 16, activation: 'swish'}));
        model3.add(tf.layers.dense({units: 8, activation: 'swish'}));
        model3.add(tf.layers.dense({units: 1}));
        model3.compile({optimizer: tf.train.adam(0.01), loss: 'meanSquaredError'});

        await model3.fit(xs, ys, {
            epochs: 120,
            callbacks: {
                onEpochEnd: (epoch, logs) => {
                    if(epoch % 30 === 0) console.log(`M3 Epoch ${epoch}: loss = ${logs.loss}`);
                }
            }
        });
        let m3Loss = evalMSE(model3, xs, ys);
        updateRowStatus('row-m3', 'Completado', 'badge-success', m3Loss.toFixed(5));
        trainedModels['DeepNetwork'] = model3;
        results['DeepNetwork'] = m3Loss;

        // Decisión del mejor modelo
        bestModelName = Object.keys(results).reduce((a, b) => results[a] < results[b] ? a : b);
        logger(`¡Proceso AutoML finalizado! El mejor modelo es: **${bestModelName}**`);
        
        // Renderizar el ajuste predictivo en la gráfica
        renderFitCurve(trainedModels[bestModelName], inputs);

        // Habilitar predicciones manuales
        document.getElementById('btn-predict').disabled = false;
        document.getElementById('btn-train').innerText = "Modelos Listos";
    }

    function evalMSE(model, xs, ys) {
        return tf.tidy(() => {
            const pred = model.predict(xs);
            const loss = tf.losses.meanSquaredError(ys, pred);
            return loss.dataSync()[0];
        });
    }

    function updateRowStatus(rowId, statusText, badgeClass, mse = "-") {
        const row = document.getElementById(rowId);
        row.querySelector('.badge').className = `badge ${badgeClass}`;
        row.querySelector('.badge').innerText = statusText;
        row.querySelector('.mse-val').innerText = mse;
    }

    function renderFitCurve(model, inputs) {
        tf.tidy(() => {
            const inputTensor = tf.tensor2d(inputs);
            const predictions = model.predict(inputTensor).dataSync();
            const denormPredictions = Array.from(predictions).map(v => denormalizeOutput(v));
            
            chart.data.datasets[1].data = denormPredictions;
            chart.update();
        });
    }

    // Evento de inferencia manual
    function makePrediction() {
        const year = parseFloat(document.getElementById('pred-year').value);
        const month = parseFloat(document.getElementById('pred-month').value);
        
        if (!bestModelName || !trainedModels[bestModelName]) return;

        tf.tidy(() => {
            const normIn = tf.tensor2d([normalizeInput(year, month)]);
            const normOut = trainedModels[bestModelName].predict(normIn).dataSync()[0];
            const finalPrediction = denormalizeOutput(normOut);

            document.getElementById('best-model-used').innerText = `Predicción usando el mejor modelo (${bestModelName})`;
            document.getElementById('predicted-value').innerText = finalPrediction.toFixed(2);
            document.getElementById('result-box').style.display = 'block';
        });
    }

    window.onload = initChart;