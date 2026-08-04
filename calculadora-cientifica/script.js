(function() {
            'use strict';

            // ---- CONFIGURACIÓN ----
            const CONFIG = {
                ACF_THRESHOLD: 0.15, // umbral para considerar decaimiento rápido (estacionario)
                DW_LOWER: 1.5, // límite inferior para autocorrelación positiva
                DW_UPPER: 2.5, // límite superior para autocorrelación negativa
                YEARS_SIM: 15,
                CHART_POINTS: 365, // últimos días a mostrar
            };

            // ---- ELEMENTOS DOM ----
            const fileInput = document.getElementById('fileInput');
            const fileStatus = document.getElementById('fileStatus');
            const btnSimulate = document.getElementById('btnSimulate');
            const btnRunModel = document.getElementById('btnRunModel');
            const dataCountEl = document.getElementById('dataCount');
            const dateRangeEl = document.getElementById('dateRange');

            // Métricas
            const stationarityValue = document.getElementById('stationarityValue');
            const stationarityDetail = document.getElementById('stationarityDetail');
            const stationarityStatus = document.getElementById('stationarityStatus');

            const coeffValue = document.getElementById('coeffValue');
            const coeffDetail = document.getElementById('coeffDetail');

            const r2Value = document.getElementById('r2Value');
            const maeValue = document.getElementById('maeValue');
            const rmseValue = document.getElementById('rmseValue');
            const dwValue = document.getElementById('dwValue');
            const dwInterpretation = document.getElementById('dwInterpretation');
            const dwStatus = document.getElementById('dwStatus');

            const ctx = document.getElementById('timeChart').getContext('2d');

            // ---- ESTADO ----
            let dataSeries = []; // array de objetos { date, temperature } (orden cronológico)
            let chartInstance = null;

            // ---- FUNCIONES AUXILIARES ----

            // Genera 15 años de datos sintéticos con estacionalidad y ruido gaussiano
            function generateSyntheticData(years = CONFIG.YEARS_SIM) {
                const startDate = new Date(2010, 0, 1);
                const endDate = new Date(startDate.getFullYear() + years, 11, 31);
                const series = [];
                let current = new Date(startDate);
                // Parámetros: tendencia anual, estacionalidad sinusoidal
                while (current <= endDate) {
                    const dayOfYear = (current - new Date(current.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24);
                    const year = current.getFullYear();
                    const base = 15 + 5 * Math.sin(2 * Math.PI * (dayOfYear - 15) / 365); // estacionalidad
                    // tendencia ligera
                    const trend = 0.02 * (year - 2010);
                    // ruido gaussiano (Box-Muller)
                    const u1 = Math.random(),
                        u2 = Math.random();
                    const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
                    const noise = 1.8 * z;
                    const temp = base + trend + noise;
                    series.push({
                        date: new Date(current),
                        temperature: Math.round(temp * 10) / 10
                    });
                    current.setDate(current.getDate() + 1);
                }
                return series;
            }

            // Normaliza columnas: busca fecha y temperatura
            function findColumns(headerRow) {
                let dateCol = -1,
                    tempCol = -1;
                headerRow.forEach((cell, idx) => {
                    if (!cell) return;
                    const lower = String(cell).toLowerCase().trim();
                    if (lower.includes('fecha') || lower.includes('date') || lower.includes('día')) {
                        dateCol = idx;
                    }
                    if (lower.includes('temperatura') || lower.includes('temp') || lower.includes('t°')) {
                        tempCol = idx;
                    }
                });
                return { dateCol, tempCol };
            }

            // Lee el archivo Excel y extrae series
            function parseExcelData(workbook) {
                const sheet = workbook.Sheets[workbook.SheetNames[0]];
                const json = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });
                if (json.length < 2) throw new Error('El archivo no contiene suficientes filas (cabecera + datos)');
                const header = json[0];
                const { dateCol, tempCol } = findColumns(header);
                if (dateCol === -1 || tempCol === -1) {
                    throw new Error('No se pudieron identificar columnas de fecha y temperatura. Revisa los nombres.');
                }
                const series = [];
                for (let i = 1; i < json.length; i++) {
                    const row = json[i];
                    let dateVal = row[dateCol];
                    let tempVal = row[tempCol];
                    if (dateVal === '' || tempVal === '') continue;
                    // parsear fecha
                    let dateObj;
                    if (typeof dateVal === 'number') {
                        // número de serie de Excel
                        dateObj = new Date((dateVal - 25569) * 86400 * 1000);
                    } else {
                        dateObj = new Date(dateVal);
                    }
                    if (isNaN(dateObj.getTime())) continue;
                    const temp = parseFloat(tempVal);
                    if (isNaN(temp)) continue;
                    series.push({ date: dateObj, temperature: temp });
                }
                if (series.length < 10) throw new Error('Se encontraron muy pocos registros válidos (mínimo 10).');
                // ordenar por fecha
                series.sort((a, b) => a.date - b.date);
                return series;
            }

            // ---- FUNCIONES ESTADÍSTICAS ----

            // Media
            function mean(arr) {
                if (arr.length === 0) return 0;
                return arr.reduce((a, b) => a + b, 0) / arr.length;
            }

            // Varianza muestral
            function variance(arr, sample = true) {
                const n = arr.length;
                if (n < 2) return 0;
                const m = mean(arr);
                const sq = arr.reduce((a, b) => a + (b - m) ** 2, 0);
                return sq / (n - (sample ? 1 : 0));
            }

            // Covarianza muestral entre x e y (misma longitud)
            function covariance(x, y) {
                const n = x.length;
                if (n < 2) return 0;
                const mx = mean(x),
                    my = mean(y);
                let sum = 0;
                for (let i = 0; i < n; i++) {
                    sum += (x[i] - mx) * (y[i] - my);
                }
                return sum / (n - 1);
            }

            // Autocorrelación para lag k (sobre arreglo numérico)
            function autocorrelation(series, lag) {
                if (lag >= series.length) return NaN;
                const n = series.length;
                const y = series.slice(0, n - lag);
                const yLag = series.slice(lag);
                const cov = covariance(y, yLag);
                const varY = variance(series, true);
                if (varY === 0) return 0;
                return cov / varY;
            }

            // Ajuste AR(1) por MCO: Y_t = c + phi * Y_{t-1} + e
            function fitAR1(series) {
                // series: array numérico (temperaturas)
                const n = series.length;
                if (n < 3) return null;
                const y = series.slice(1); // Y_t
                const x = series.slice(0, n - 1); // Y_{t-1}
                // regresión lineal simple con simple-statistics
                const regression = ss.linearRegression(x.map((v, i) => [v, y[i]]));
                const phi = regression.m;
                const c = regression.b;
                // valores ajustados
                const fitted = x.map(v => c + phi * v);
                // residuos
                const residuals = y.map((yi, i) => yi - fitted[i]);
                return { phi, c, fitted, residuals, x, y };
            }

            // R^2
            function rSquared(yTrue, yPred) {
                const n = yTrue.length;
                if (n === 0) return NaN;
                const m = mean(yTrue);
                const ssTot = yTrue.reduce((a, v) => a + (v - m) ** 2, 0);
                if (ssTot === 0) return 1;
                const ssRes = yTrue.reduce((a, v, i) => a + (v - yPred[i]) ** 2, 0);
                return 1 - ssRes / ssTot;
            }

            // MAE
            function mae(yTrue, yPred) {
                const n = yTrue.length;
                if (n === 0) return NaN;
                return yTrue.reduce((a, v, i) => a + Math.abs(v - yPred[i]), 0) / n;
            }

            // RMSE
            function rmse(yTrue, yPred) {
                const n = yTrue.length;
                if (n === 0) return NaN;
                return Math.sqrt(yTrue.reduce((a, v, i) => a + (v - yPred[i]) ** 2, 0) / n);
            }

            // Durbin-Watson
            function durbinWatson(residuals) {
                const n = residuals.length;
                if (n < 2) return NaN;
                let num = 0,
                    den = 0;
                for (let i = 1; i < n; i++) {
                    num += (residuals[i] - residuals[i - 1]) ** 2;
                }
                for (let i = 0; i < n; i++) {
                    den += residuals[i] ** 2;
                }
                if (den === 0) return 0;
                return num / den;
            }

            // ---- FUNCIÓN PRINCIPAL DE MODELADO ----

            function runModel(series) {
                if (!series || series.length < 5) {
                    alert('Se necesitan al menos 5 registros para modelar.');
                    return;
                }

                // Extraer temperaturas (array numérico)
                const temps = series.map(d => d.temperature);
                const n = temps.length;

                // 1. ACF para lags 1,2,3
                const acf1 = autocorrelation(temps, 1);
                const acf2 = autocorrelation(temps, 2);
                const acf3 = autocorrelation(temps, 3);
                // Diagnóstico de estacionariedad: si ACF(1) < umbral y decaimiento rápido
                const isStationary = (Math.abs(acf1) < CONFIG.ACF_THRESHOLD) &&
                    (Math.abs(acf2) < Math.abs(acf1) || Math.abs(acf2) < CONFIG.ACF_THRESHOLD) &&
                    (Math.abs(acf3) < Math.abs(acf2) || Math.abs(acf3) < CONFIG.ACF_THRESHOLD);

                // 2. Ajuste AR(1)
                const arResult = fitAR1(temps);
                if (!arResult) {
                    alert('No se pudo ajustar el modelo AR(1) (datos insuficientes).');
                    return;
                }
                const { phi, c, fitted, residuals, x, y } = arResult;

                // 3. Métricas
                const r2 = rSquared(y, fitted);
                const maeVal = mae(y, fitted);
                const rmseVal = rmse(y, fitted);
                const dw = durbinWatson(residuals);

                // Interpretación DW
                let dwText = '';
                let dwColor = 'green';
                if (dw < CONFIG.DW_LOWER) {
                    dwText = 'Autocorrelación positiva (residuos sistemáticos)';
                    dwColor = 'red';
                } else if (dw > CONFIG.DW_UPPER) {
                    dwText = 'Autocorrelación negativa (patrón oscilante)';
                    dwColor = 'yellow';
                } else {
                    dwText = 'Residuos independientes (sin autocorrelación)';
                    dwColor = 'green';
                }

                // ---- ACTUALIZAR UI ----

                // Estacionariedad
                stationarityValue.textContent = isStationary ? '✅ Estacionaria' : '⚠️ No estacionaria';
                stationarityDetail.textContent = `ACF(1) = ${acf1.toFixed(3)}  ·  ACF(2) = ${acf2.toFixed(3)}  ·  ACF(3) = ${acf3.toFixed(3)}`;
                stationarityStatus.className = 'status-indicator ' + (isStationary ? 'green' : 'yellow');

                // Coeficientes
                coeffValue.textContent = `c = ${c.toFixed(3)}  ·  φ = ${phi.toFixed(3)}`;
                coeffDetail.textContent = `Yₜ = ${c.toFixed(3)} + ${phi.toFixed(3)} · Yₜ₋₁ + εₜ`;

                // R², MAE, RMSE
                r2Value.textContent = r2.toFixed(4);
                maeValue.textContent = maeVal.toFixed(3);
                rmseValue.textContent = rmseVal.toFixed(3);

                // Durbin-Watson
                dwValue.textContent = dw.toFixed(3);
                dwInterpretation.textContent = dwText;
                dwStatus.className = 'status-indicator ' + dwColor;

                // Actualizar badge de conteo
                dataCountEl.textContent = `Registros: ${n}`;
                const firstDate = series[0].date;
                const lastDate = series[series.length - 1].date;
                const dateFormat = (d) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
                dateRangeEl.textContent = `Rango: ${dateFormat(firstDate)} → ${dateFormat(lastDate)}`;

                // ---- GRÁFICO (últimos N puntos) ----
                const pointsToShow = Math.min(CONFIG.CHART_POINTS, series.length);
                const startIdx = series.length - pointsToShow;
                const chartData = series.slice(startIdx);
                // Ajuste: necesitamos valores ajustados para esos mismos índices (el ajuste es para t>=1)
                // Los ajustados corresponden a los índices 1..n-1 de temps, así que mapeamos
                const fittedFull = arResult.fitted; // longitud n-1
                // Para cada punto en chartData, necesitamos su índice en la serie original
                const chartLabels = chartData.map(d => d.date.toLocaleDateString('es-ES'));
                const chartTemps = chartData.map(d => d.temperature);
                // Para el ajuste: el primer punto no tiene ajuste (t=0), el resto se alinea
                const chartFitted = chartData.map((d, i) => {
                    const idx = startIdx + i;
                    if (idx === 0) return null; // sin ajuste
                    return fittedFull[idx - 1];
                });

                // Actualizar o crear chart
                if (chartInstance) {
                    chartInstance.destroy();
                }
                chartInstance = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: chartLabels,
                        datasets: [{
                            label: 'Temperatura real',
                            data: chartTemps,
                            borderColor: '#2a9d8f',
                            backgroundColor: 'rgba(42,157,143,0.05)',
                            pointRadius: 1.2,
                            pointHoverRadius: 3,
                            borderWidth: 2,
                            tension: 0.2,
                            fill: false,
                        }, {
                            label: 'Ajuste AR(1)',
                            data: chartFitted,
                            borderColor: '#e76f51',
                            backgroundColor: 'rgba(231,111,81,0.05)',
                            pointRadius: 1.2,
                            pointHoverRadius: 3,
                            borderWidth: 2,
                            tension: 0.2,
                            borderDash: [5, 3],
                            fill: false,
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: { display: false },
                            tooltip: {
                                callbacks: {
                                    label: function(context) {
                                        let label = context.dataset.label || '';
                                        if (label) label += ': ';
                                        if (context.parsed.y !== null) label += context.parsed.y.toFixed(1) + ' °C';
                                        return label;
                                    }
                                }
                            }
                        },
                        scales: {
                            x: {
                                ticks: {
                                    maxTicksLimit: 20,
                                    font: { size: 9 }
                                }
                            },
                            y: {
                                title: { display: true, text: 'Temperatura (°C)' }
                            }
                        },
                        elements: {
                            line: { borderJoinStyle: 'round' }
                        }
                    }
                });
            }

            // ---- MANEJADORES DE EVENTOS ----

            // Cargar archivo Excel
            fileInput.addEventListener('change', function(e) {
                const file = e.target.files[0];
                if (!file) return;
                fileStatus.textContent = `Cargando: ${file.name} ...`;
                const reader = new FileReader();
                reader.onload = function(ev) {
                    try {
                        const data = new Uint8Array(ev.target.result);
                        const workbook = XLSX.read(data, { type: 'array' });
                        const series = parseExcelData(workbook);
                        dataSeries = series;
                        fileStatus.textContent = `✅ ${file.name} (${series.length} registros)`;
                        dataCountEl.textContent = `Registros: ${series.length}`;
                        // Actualizar rango
                        if (series.length > 0) {
                            const first = series[0].date;
                            const last = series[series.length - 1].date;
                            const fmt = d => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
                            dateRangeEl.textContent = `Rango: ${fmt(first)} → ${fmt(last)}`;
                        }
                        // Ejecutar automáticamente
                        runModel(series);
                    } catch (err) {
                        alert('Error al leer el archivo: ' + err.message);
                        console.error(err);
                        fileStatus.textContent = '❌ Error al cargar';
                    }
                };
                reader.readAsArrayBuffer(file);
            });

            // Simular datos
            btnSimulate.addEventListener('click', function() {
                const series = generateSyntheticData(CONFIG.YEARS_SIM);
                dataSeries = series;
                fileStatus.textContent = `🎲 Datos simulados (${series.length} registros)`;
                dataCountEl.textContent = `Registros: ${series.length}`;
                const first = series[0].date;
                const last = series[series.length - 1].date;
                const fmt = d => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
                dateRangeEl.textContent = `Rango: ${fmt(first)} → ${fmt(last)}`;
                runModel(series);
            });

            // Ejecutar modelo manualmente (con los datos actuales)
            btnRunModel.addEventListener('click', function() {
                if (!dataSeries || dataSeries.length === 0) {
                    alert('Primero carga un archivo o simula datos.');
                    return;
                }
                runModel(dataSeries);
            });

            // ---- INICIALIZACIÓN ----
            // Al cargar, generar datos de prueba por defecto
            window.addEventListener('DOMContentLoaded', function() {
                const series = generateSyntheticData(CONFIG.YEARS_SIM);
                dataSeries = series;
                fileStatus.textContent = `🎲 Datos simulados (${series.length} registros)`;
                dataCountEl.textContent = `Registros: ${series.length}`;
                const first = series[0].date;
                const last = series[series.length - 1].date;
                const fmt = d => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
                dateRangeEl.textContent = `Rango: ${fmt(first)} → ${fmt(last)}`;
                runModel(series);
            });

        })();