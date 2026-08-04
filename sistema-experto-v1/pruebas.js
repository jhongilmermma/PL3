/**
         * ============================================================
         * MOTOR DE INFERENCIA DIFUSO (Mamdani)
         * Basado en la tesis UNSAAC 2023
         * ============================================================
         */
        class MotorInferenciaDifuso {

            // ---- Fuzificación ----
            fuzzifyEdad(valor) {
                let joven = 0;
                if (valor >= 27 && valor <= 30) joven = 1;
                else if (valor > 30 && valor <= 35) joven = (35 - valor) / 5;
                let adulto = 0;
                if (valor >= 30 && valor < 45) adulto = (valor - 30) / 15;
                else if (valor >= 45 && valor <= 55) adulto = 1;
                else if (valor > 55 && valor <= 65) adulto = (65 - valor) / 10;
                let adultoMayor = 0;
                if (valor >= 60 && valor < 70) adultoMayor = (valor - 60) / 10;
                else if (valor >= 70) adultoMayor = 1;
                return { joven, adulto, adultoMayor };
            }

            fuzzifyPresion(valor) {
                let normal = 0;
                if (valor >= 0 && valor <= 90) normal = 1;
                else if (valor > 90 && valor <= 122) normal = (122 - valor) / 32;
                let elevada = 0;
                if (valor >= 118 && valor < 125) elevada = (valor - 118) / 7;
                else if (valor === 125) elevada = 1;
                else if (valor > 125 && valor <= 132) elevada = (132 - valor) / 7;
                let alta = 0;
                if (valor >= 128 && valor < 141) alta = (valor - 128) / 13;
                else if (valor >= 141) alta = 1;
                return { normal, elevada, alta };
            }

            fuzzifyIMC(valor) {
                let normal = 0;
                if (valor >= 0 && valor <= 20) normal = 1;
                else if (valor > 20 && valor <= 25) normal = (25 - valor) / 5;
                let sobrepeso = 0;
                if (valor >= 24 && valor < 27) sobrepeso = (valor - 24) / 3;
                else if (valor >= 27 && valor <= 28) sobrepeso = 1;
                else if (valor > 28 && valor <= 30) sobrepeso = (30 - valor) / 2;
                let obesidad = 0;
                if (valor >= 29 && valor < 35) obesidad = (valor - 29) / 6;
                else if (valor >= 35) obesidad = 1;
                return { normal, sobrepeso, obesidad };
            }

            fuzzifyColesterol(valor) {
                let optimo = 0;
                if (valor >= 0 && valor <= 180) optimo = 1;
                else if (valor > 180 && valor <= 205) optimo = (205 - valor) / 25;
                let moderado = 0;
                if (valor >= 190 && valor < 210) moderado = (valor - 190) / 20;
                else if (valor >= 210 && valor <= 235) moderado = 1;
                else if (valor > 235 && valor <= 245) moderado = (245 - valor) / 10;
                let elevado = 0;
                if (valor >= 235 && valor < 250) elevado = (valor - 235) / 15;
                else if (valor >= 250) elevado = 1;
                return { optimo, moderado, elevado };
            }

            fuzzifyTrigliceridos(valor) {
                let moderado = 0;
                if (valor >= 0 && valor <= 170) moderado = 1;
                else if (valor > 170 && valor <= 205) moderado = (205 - valor) / 35;
                let elevado = 0;
                if (valor >= 190 && valor < 210) elevado = (valor - 190) / 20;
                else if (valor >= 210 && valor <= 490) elevado = 1;
                else if (valor > 490 && valor <= 505) elevado = (505 - valor) / 15;
                let muyElevado = 0;
                if (valor >= 490 && valor < 510) muyElevado = (valor - 490) / 20;
                else if (valor >= 510) muyElevado = 1;
                return { moderado, elevado, muyElevado };
            }

            fuzzifyTabaquismo(valor) {
                let leve = 0;
                if (valor === 0) leve = 1;
                else if (valor > 0 && valor <= 6) leve = (6 - valor) / 6;
                let moderado = 0;
                if (valor >= 4 && valor < 9) moderado = (valor - 4) / 5;
                else if (valor >= 9 && valor <= 11) moderado = 1;
                else if (valor > 11 && valor <= 18) moderado = (18 - valor) / 7;
                let alto = 0;
                if (valor >= 14 && valor < 26) alto = (valor - 14) / 12;
                else if (valor >= 26) alto = 1;
                return { leve, moderado, alto };
            }

            fuzzifyDolorPecho(valor) {
                let poco = 0;
                if (valor === 0) poco = 1;
                else if (valor > 0 && valor <= 2) poco = (2 - valor) / 2;
                let mucho = 0;
                if (valor >= 1 && valor < 3) mucho = (valor - 1) / 2;
                else if (valor === 3) mucho = 1;
                else if (valor > 3 && valor <= 5) mucho = (5 - valor) / 2;
                let frecuente = 0;
                if (valor >= 3 && valor < 10) frecuente = (valor - 3) / 7;
                else if (valor >= 10) frecuente = 1;
                return { poco, mucho, frecuente };
            }

            getDominantLabel(obj) {
                let maxVal = -1,
                    label = '';
                for (let key in obj) {
                    if (obj[key] > maxVal) {
                        maxVal = obj[key];
                        label = key;
                    }
                }
                return label;
            }

            defuzzify(bajo, medio, alto, tipo = 'hta') {
                let centroBajo, centroMedio, centroAlto;
                if (tipo === 'hta') {
                    centroBajo = 15;
                    centroMedio = 40;
                    centroAlto = 75;
                } else {
                    centroBajo = 17.5;
                    centroMedio = 45;
                    centroAlto = 77.5;
                }
                const sumaPesos = bajo + medio + alto;
                if (sumaPesos === 0) return 0;
                return (bajo * centroBajo + medio * centroMedio + alto * centroAlto) / sumaPesos;
            }

            getRiskLevel(porcentaje, tipo) {
                if (tipo === 'hta') {
                    if (porcentaje <= 30) return { label: 'Bajo', class: 'low', desc: 'No presenta hipertensión arterial.' };
                    if (porcentaje <= 55) return { label: 'Medio', class: 'moderate',
                    desc: 'Riesgo moderado de hipertensión arterial.' };
                    return { label: 'Alto', class: 'high', desc: 'Alto riesgo de hipertensión arterial.' };
                } else {
                    if (porcentaje <= 30) return { label: 'Bajo', class: 'low', desc: 'No presenta isquemia cardíaca.' };
                    if (porcentaje <= 55) return { label: 'Moderado', class: 'moderate',
                        desc: 'Riesgo moderado de isquemia cardíaca.' };
                    return { label: 'Alto', class: 'high', desc: 'Alto riesgo de isquemia cardíaca.' };
                }
            }

            // ---- DIAGNÓSTICO PRINCIPAL ----
            diagnosticar(datos) {
                const fEdad = this.fuzzifyEdad(datos.edad);
                const fPresion = this.fuzzifyPresion(datos.presion);
                const fIMC = this.fuzzifyIMC(datos.imc);
                const fCol = this.fuzzifyColesterol(datos.colesterol);
                const fTrig = this.fuzzifyTrigliceridos(datos.trigliceridos);
                const fTab = this.fuzzifyTabaquismo(datos.tabaquismo);
                const fDolor = this.fuzzifyDolorPecho(datos.dolorPecho);

                const edadLabel = this.getDominantLabel(fEdad);
                const presionLabel = this.getDominantLabel(fPresion);
                const imcLabel = this.getDominantLabel(fIMC);
                const colLabel = this.getDominantLabel(fCol);
                const trigLabel = this.getDominantLabel(fTrig);
                const tabLabel = this.getDominantLabel(fTab);
                const dolorLabel = this.getDominantLabel(fDolor);

                let htaBajo = 0,
                    htaMedio = 0,
                    htaAlto = 0;
                let icBajo = 0,
                    icModerado = 0,
                    icAlto = 0;

                // ---- Reglas HTA ----
                if (colLabel === 'optimo' && trigLabel === 'moderado' && imcLabel === 'normal' &&
                    edadLabel === 'joven' && presionLabel === 'normal') {
                    htaBajo = Math.max(htaBajo, Math.min(fCol.optimo, fTrig.moderado, fIMC.normal, fEdad.joven, fPresion
                    .normal));
                }
                if (colLabel === 'elevado' && trigLabel === 'elevado' && imcLabel === 'normal' &&
                    edadLabel === 'adulto' && presionLabel === 'normal') {
                    htaMedio = Math.max(htaMedio, Math.min(fCol.elevado, fTrig.elevado, fIMC.normal, fEdad.adulto, fPresion
                        .normal));
                }
                if (colLabel === 'elevado' && trigLabel === 'elevado' && imcLabel === 'sobrepeso' &&
                    edadLabel === 'joven' && presionLabel === 'elevada') {
                    htaAlto = Math.max(htaAlto, Math.min(fCol.elevado, fTrig.elevado, fIMC.sobrepeso, fEdad.joven, fPresion
                        .elevada));
                }
                if (colLabel === 'elevado' && trigLabel === 'elevado' && imcLabel === 'sobrepeso' &&
                    edadLabel === 'joven' && presionLabel === 'alta') {
                    htaAlto = Math.max(htaAlto, Math.min(fCol.elevado, fTrig.elevado, fIMC.sobrepeso, fEdad.joven, fPresion
                        .alta));
                }
                if (colLabel === 'optimo' && trigLabel === 'moderado' && imcLabel === 'normal' &&
                    edadLabel === 'adultoMayor' && presionLabel === 'alta') {
                    htaBajo = Math.max(htaBajo, Math.min(fCol.optimo, fTrig.moderado, fIMC.normal, fEdad.adultoMayor,
                        fPresion.alta));
                }
                if (colLabel === 'elevado' && trigLabel === 'elevado' && imcLabel === 'normal' &&
                    edadLabel === 'joven' && presionLabel === 'elevada') {
                    htaMedio = Math.max(htaMedio, Math.min(fCol.elevado, fTrig.elevado, fIMC.normal, fEdad.joven, fPresion
                        .elevada));
                }
                if (colLabel === 'optimo' && trigLabel === 'moderado' && imcLabel === 'normal' &&
                    edadLabel === 'joven' && presionLabel === 'elevada') {
                    htaBajo = Math.max(htaBajo, Math.min(fCol.optimo, fTrig.moderado, fIMC.normal, fEdad.joven, fPresion
                        .elevada));
                }
                if (colLabel === 'optimo' && trigLabel === 'moderado' && imcLabel === 'normal' &&
                    edadLabel === 'joven' && presionLabel === 'alta') {
                    htaBajo = Math.max(htaBajo, Math.min(fCol.optimo, fTrig.moderado, fIMC.normal, fEdad.joven, fPresion
                        .alta));
                }

                // ---- Reglas IC ----
                if (edadLabel === 'joven' && tabLabel === 'leve' && dolorLabel === 'poco' &&
                    colLabel === 'optimo' && trigLabel === 'moderado') {
                    icBajo = Math.max(icBajo, Math.min(fEdad.joven, fTab.leve, fDolor.poco, fCol.optimo, fTrig.moderado));
                }
                if (edadLabel === 'joven' && tabLabel === 'leve' && dolorLabel === 'mucho' &&
                    colLabel === 'elevado' && trigLabel === 'elevado') {
                    icModerado = Math.max(icModerado, Math.min(fEdad.joven, fTab.leve, fDolor.mucho, fCol.elevado, fTrig
                        .elevado));
                }
                if (edadLabel === 'adultoMayor' && tabLabel === 'alto' && dolorLabel === 'mucho' &&
                    colLabel === 'optimo' && trigLabel === 'elevado') {
                    icAlto = Math.max(icAlto, Math.min(fEdad.adultoMayor, fTab.alto, fDolor.mucho, fCol.optimo, fTrig
                        .elevado));
                }
                if (edadLabel === 'adultoMayor' && tabLabel === 'alto' && dolorLabel === 'mucho' &&
                    colLabel === 'elevado' && trigLabel === 'elevado') {
                    icAlto = Math.max(icAlto, Math.min(fEdad.adultoMayor, fTab.alto, fDolor.mucho, fCol.elevado, fTrig
                        .elevado));
                }
                if (edadLabel === 'adulto' && tabLabel === 'leve' && dolorLabel === 'mucho' &&
                    colLabel === 'optimo' && trigLabel === 'moderado') {
                    icModerado = Math.max(icModerado, Math.min(fEdad.adulto, fTab.leve, fDolor.mucho, fCol.optimo, fTrig
                        .moderado));
                }
                if (edadLabel === 'adultoMayor' && tabLabel === 'alto' && dolorLabel === 'mucho' &&
                    colLabel === 'optimo' && trigLabel === 'moderado') {
                    icModerado = Math.max(icModerado, Math.min(fEdad.adultoMayor, fTab.alto, fDolor.mucho, fCol.optimo,
                        fTrig.moderado));
                }

                const htaPorcentaje = Math.round(this.defuzzify(htaBajo, htaMedio, htaAlto, 'hta'));
                const icPorcentaje = Math.round(this.defuzzify(icBajo, icModerado, icAlto, 'ic'));

                const riesgoHTA = this.getRiskLevel(htaPorcentaje, 'hta');
                const riesgoIC = this.getRiskLevel(icPorcentaje, 'ic');

                return {
                    hipertensionArterial: {
                        porcentaje: htaPorcentaje,
                        nivel: riesgoHTA.label,
                        class: riesgoHTA.class,
                        descripcion: riesgoHTA.desc
                    },
                    isquemiaCardiaca: {
                        porcentaje: icPorcentaje,
                        nivel: riesgoIC.label,
                        class: riesgoIC.class,
                        descripcion: riesgoIC.desc
                    },
                    fuzzificacion: {
                        edad: { label: edadLabel },
                        presion: { label: presionLabel },
                        imc: { label: imcLabel },
                        colesterol: { label: colLabel },
                        trigliceridos: { label: trigLabel },
                        tabaquismo: { label: tabLabel },
                        dolorPecho: { label: dolorLabel }
                    }
                };
            }
        }

(function() {
            'use strict';

            const motor = new MotorInferenciaDifuso();

            // ----------------------------------------------------------
            // 1. DEFINICIÓN DE CASOS DE PRUEBA
            // Basados en la Tabla 15 del documento (páginas 95-98)
            // ----------------------------------------------------------

            const casosPrueba = [{
                id: 1,
                edad: 48,
                imc: 28.03,
                presion: 145,
                colesterol: 200,
                trigliceridos: 200,
                tabaquismo: 0,
                dolorPecho: 0,
                htaEsperado: 'Alto',
                icEsperado: 'Bajo',
                descripcion: 'Caso 1 - HTA confirmada'
            }, {
                id: 2,
                edad: 48,
                imc: 31.35,
                presion: 140,
                colesterol: 200,
                trigliceridos: 180,
                tabaquismo: 0,
                dolorPecho: 0,
                htaEsperado: 'Medio',
                icEsperado: 'Bajo',
                descripcion: 'Caso 2 - HTA confirmada'
            }, {
                id: 3,
                edad: 66,
                imc: 23.62,
                presion: 160,
                colesterol: 220,
                trigliceridos: 210,
                tabaquismo: 0,
                dolorPecho: 0,
                htaEsperado: 'Alto',
                icEsperado: 'Moderado',
                descripcion: 'Caso 3 - HTA confirmada'
            }, {
                id: 4,
                edad: 54,
                imc: 32.87,
                presion: 120,
                colesterol: 200,
                trigliceridos: 180,
                tabaquismo: 0,
                dolorPecho: 0,
                htaEsperado: 'Medio',
                icEsperado: 'Bajo',
                descripcion: 'Caso 4 - HTA sin tratamiento'
            }, {
                id: 5,
                edad: 60,
                imc: 27.9,
                presion: 196,
                colesterol: 340,
                trigliceridos: 14,
                tabaquismo: 0,
                dolorPecho: 0,
                htaEsperado: 'Moderado',
                icEsperado: 'Bajo',
                descripcion: 'Caso 5 - Isquemia cardíaca'
            }, {
                id: 8,
                edad: 41,
                imc: 27.13,
                presion: 134,
                colesterol: 249,
                trigliceridos: 500,
                tabaquismo: 1,
                dolorPecho: 1,
                htaEsperado: 'Alto',
                icEsperado: 'Bajo',
                descripcion: 'Caso 8 - HTA confirmada'
            }, {
                id: 10,
                edad: 40,
                imc: 30.14,
                presion: 150,
                colesterol: 300,
                trigliceridos: 3,
                tabaquismo: 0,
                dolorPecho: 0,
                htaEsperado: 'Medio',
                icEsperado: 'Bajo',
                descripcion: 'Caso 10 - Sin HTA (contradicción en tesis)'
            }, {
                id: 18,
                edad: 30,
                imc: 27.10,
                presion: 100,
                colesterol: 212,
                trigliceridos: 170,
                tabaquismo: 1,
                dolorPecho: 5,
                htaEsperado: 'Bajo',
                icEsperado: 'Moderado',
                descripcion: 'Caso 18 - Isquemia'
            }, {
                id: 24,
                edad: 72,
                imc: 26.11,
                presion: 235,
                colesterol: 220,
                trigliceridos: 5,
                tabaquismo: 0,
                dolorPecho: 0,
                htaEsperado: 'Bajo',
                icEsperado: 'Alto',
                descripcion: 'Caso 24 - Isquemia cardíaca'
            }, {
                id: 29,
                edad: 32,
                imc: 27.11,
                presion: 237,
                colesterol: 160,
                trigliceridos: 6,
                tabaquismo: 0,
                dolorPecho: 0,
                htaEsperado: 'Bajo',
                icEsperado: 'Alto',
                descripcion: 'Caso 29 - Isquemia'
            }, {
                id: 35,
                edad: 89,
                imc: 25.9,
                presion: 324,
                colesterol: 204,
                trigliceridos: 0,
                tabaquismo: 0,
                dolorPecho: 0,
                htaEsperado: 'Moderado',
                icEsperado: 'Alto',
                descripcion: 'Caso 35 - Isquemia'
            }, {
                id: 41,
                edad: 45,
                imc: 25.11,
                presion: 224,
                colesterol: 200,
                trigliceridos: 5,
                tabaquismo: 1,
                dolorPecho: 0,
                htaEsperado: 'Medio',
                icEsperado: 'Bajo',
                descripcion: 'Caso 41 - Sin HTA (contradicción)'
            }, {
                id: 42,
                edad: 55,
                imc: 23.11,
                presion: 230,
                colesterol: 300,
                trigliceridos: 4,
                tabaquismo: 0,
                dolorPecho: 0,
                htaEsperado: 'Moderado',
                icEsperado: 'Alto',
                descripcion: 'Caso 42 - Isquemia'
            }, {
                id: 44,
                edad: 49,
                imc: 24.11,
                presion: 218,
                colesterol: 500,
                trigliceridos: 2,
                tabaquismo: 3,
                dolorPecho: 0,
                htaEsperado: 'Moderado',
                icEsperado: 'Alto',
                descripcion: 'Caso 44 - Isquemia'
            }, {
                id: 49,
                edad: 59,
                imc: 24.10,
                presion: 250,
                colesterol: 310,
                trigliceridos: 4,
                tabaquismo: 0,
                dolorPecho: 0,
                htaEsperado: 'Moderado',
                icEsperado: 'Alto',
                descripcion: 'Caso 49 - Isquemia'
            }];

            // ----------------------------------------------------------
            // 2. FUNCIÓN DE PRUEBA
            // ----------------------------------------------------------

            function ejecutarPruebas() {
                const tbody = document.getElementById('testBody');
                let passed = 0,
                    failed = 0;
                let html = '';

                casosPrueba.forEach((caso, index) => {
                    // Ejecutar diagnóstico
                    const resultado = motor.diagnosticar({
                        edad: caso.edad,
                        imc: caso.imc,
                        presion: caso.presion,
                        colesterol: caso.colesterol,
                        trigliceridos: caso.trigliceridos,
                        tabaquismo: caso.tabaquismo,
                        dolorPecho: caso.dolorPecho
                    });

                    const htaObtenido = resultado.hipertensionArterial.nivel;
                    const icObtenido = resultado.isquemiaCardiaca.nivel;

                    // Comparar (normalizamos: Moderado == Medio)
                    const htaOk = htaObtenido === caso.htaEsperado ||
                        (htaObtenido === 'Moderado' && caso.htaEsperado === 'Medio') ||
                        (htaObtenido === 'Medio' && caso.htaEsperado === 'Moderado');
                    const icOk = icObtenido === caso.icEsperado ||
                        (icObtenido === 'Moderado' && caso.icEsperado === 'Medio') ||
                        (icObtenido === 'Medio' && caso.icEsperado === 'Moderado');

                    const ok = htaOk && icOk;
                    if (ok) passed++;
                    else failed++;

                    const badgeHTA = `<span class="badge-risk ${caso.htaEsperado.toLowerCase()}">${caso.htaEsperado}</span>`;
                    const badgeIC = `<span class="badge-risk ${caso.icEsperado.toLowerCase()}">${caso.icEsperado}</span>`;
                    const badgeHTAobt =
                        `<span class="badge-risk ${resultado.hipertensionArterial.class}">${htaObtenido}</span>`;
                    const badgeICobt =
                        `<span class="badge-risk ${resultado.isquemiaCardiaca.class}">${icObtenido}</span>`;

                    html += `
                            <tr>
                                <td><strong>${caso.id}</strong></td>
                                <td>${caso.edad}</td>
                                <td>${caso.imc}</td>
                                <td>${caso.presion}</td>
                                <td>${caso.colesterol}</td>
                                <td>${caso.trigliceridos}</td>
                                <td>${caso.tabaquismo}</td>
                                <td>${caso.dolorPecho}</td>
                                <td>${badgeHTA}</td>
                                <td>${badgeHTAobt} (${resultado.hipertensionArterial.porcentaje}%)</td>
                                <td>${badgeIC}</td>
                                <td>${badgeICobt} (${resultado.isquemiaCardiaca.porcentaje}%)</td>
                                <td>${ok ? '✅' : '❌'}</td>
                            </tr>
                        `;
                });

                tbody.innerHTML = html;

                // Actualizar estadísticas
                document.getElementById('totalTests').textContent = casosPrueba.length;
                document.getElementById('passedTests').textContent = passed;
                document.getElementById('failedTests').textContent = failed;
                const rate = casosPrueba.length > 0 ? Math.round((passed / casosPrueba.length) * 100) : 0;
                document.getElementById('successRate').textContent = rate + '%';

                // Resumen
                const summaryContainer = document.getElementById('summaryContainer');
                if (failed === 0) {
                    summaryContainer.innerHTML = `
                            <div class="summary-pass">
                                ✅ <strong>Todas las pruebas pasaron correctamente!</strong>
                                ${casosPrueba.length} casos evaluados con éxito. El motor de inferencia funciona correctamente.
                            </div>
                        `;
                } else {
                    summaryContainer.innerHTML = `
                            <div class="summary-fail">
                                ⚠️ <strong>${failed} prueba(s) fallaron</strong>
                                de ${casosPrueba.length} casos totales. 
                                Tasa de éxito: ${rate}%. Revisa los casos marcados con ❌.
                            </div>
                        `;
                }

                // Habilitar botón
                document.getElementById('runBtn').disabled = false;
                document.getElementById('runBtn').textContent = '🔄 Re-ejecutar Pruebas';
            }

            // ----------------------------------------------------------
            // 3. EVENTO DEL BOTÓN
            // ----------------------------------------------------------

            document.getElementById('runBtn').addEventListener('click', function() {
                this.disabled = true;
                this.innerHTML = '<span class="loading"></span> Ejecutando...';
                // Simular tiempo de procesamiento
                setTimeout(() => {
                    ejecutarPruebas();
                }, 400);
            });

            // Ejecutar automáticamente al cargar
            window.addEventListener('DOMContentLoaded', function() {
                setTimeout(() => {
                    document.getElementById('runBtn').click();
                }, 500);
            });

        })();