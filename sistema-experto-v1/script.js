(function() {
            'use strict';

            // ==========================================================
            // 1. FUNCIONES DE PERTENENCIA (Fuzificación)
            // ==========================================================

            function fuzzifyEdad(valor) {
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

            function fuzzifyPresion(valor) {
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

            function fuzzifyIMC(valor) {
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

            function fuzzifyColesterol(valor) {
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

            function fuzzifyTrigliceridos(valor) {
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

            function fuzzifyTabaquismo(valor) {
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

            function fuzzifyDolorPecho(valor) {
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

            // ==========================================================
            // 2. MOTOR DE INFERENCIA
            // ==========================================================

            function getDominantLabel(obj) {
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

            function defuzzify(bajo, medio, alto) {
                const centroBajo = 15,
                    centroMedio = 40,
                    centroAlto = 75;
                const sumaPesos = bajo + medio + alto;
                if (sumaPesos === 0) return 0;
                return (bajo * centroBajo + medio * centroMedio + alto * centroAlto) / sumaPesos;
            }

            function getRiskLevel(porcentaje, tipo) {
                if (tipo === 'hta') {
                    if (porcentaje <= 30) return { label: 'Bajo Riesgo', class: 'risk-low', desc: 'No presenta hipertensión arterial.' };
                    if (porcentaje <= 55) return { label: 'Riesgo Medio', class: 'risk-moderate',
                    desc: 'Presenta riesgo moderado de hipertensión arterial. Se recomienda control.' };
                    return { label: 'Alto Riesgo', class: 'risk-high', desc: 'Alto riesgo de hipertensión arterial. Consulte a un médico.' };
                } else {
                    if (porcentaje <= 30) return { label: 'Bajo Riesgo', class: 'risk-low', desc: 'No presenta isquemia cardíaca.' };
                    if (porcentaje <= 55) return { label: 'Riesgo Moderado', class: 'risk-moderate',
                        desc: 'Riesgo moderado de isquemia cardíaca. Se recomienda evaluación.' };
                    return { label: 'Alto Riesgo', class: 'risk-high', desc: 'Alto riesgo de isquemia cardíaca. Consulte a un médico.' };
                }
            }

            function diagnosticar(datos) {
                const fEdad = fuzzifyEdad(datos.edad);
                const fPresion = fuzzifyPresion(datos.presion);
                const fIMC = fuzzifyIMC(datos.imc);
                const fCol = fuzzifyColesterol(datos.colesterol);
                const fTrig = fuzzifyTrigliceridos(datos.trigliceridos);
                const fTab = fuzzifyTabaquismo(datos.tabaquismo);
                const fDolor = fuzzifyDolorPecho(datos.dolorPecho);

                const edadLabel = getDominantLabel(fEdad);
                const presionLabel = getDominantLabel(fPresion);
                const imcLabel = getDominantLabel(fIMC);
                const colLabel = getDominantLabel(fCol);
                const trigLabel = getDominantLabel(fTrig);
                const tabLabel = getDominantLabel(fTab);
                const dolorLabel = getDominantLabel(fDolor);

                let htaBajo = 0,
                    htaMedio = 0,
                    htaAlto = 0;
                let icBajo = 0,
                    icModerado = 0,
                    icAlto = 0;

                // ---- REGLAS HTA ----
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

                // ---- REGLAS IC ----
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

                const htaPorcentaje = Math.round(defuzzify(htaBajo, htaMedio, htaAlto));
                const icPorcentaje = Math.round(defuzzify(icBajo, icModerado, icAlto));

                const riesgoHTA = getRiskLevel(htaPorcentaje, 'hta');
                const riesgoIC = getRiskLevel(icPorcentaje, 'ic');

                return {
                    hta: { porcentaje: htaPorcentaje, nivel: riesgoHTA.label, class: riesgoHTA.class, desc: riesgoHTA
                            .desc },
                    ic: { porcentaje: icPorcentaje, nivel: riesgoIC.label, class: riesgoIC.class, desc: riesgoIC.desc },
                    edadLabel,
                    presionLabel,
                    imcLabel,
                    colLabel,
                    trigLabel,
                    tabLabel,
                    dolorLabel
                };
            }

            // ==========================================================
            // 3. MANEJO DEL FORMULARIO Y RENDERIZADO
            // ==========================================================

            const form = document.getElementById('diagnosticForm');
            const resultsDiv = document.getElementById('results');
            const resultHTA = document.getElementById('resultHTA');
            const resultIC = document.getElementById('resultIC');
            const interpretacion = document.getElementById('interpretacion');

            // Elementos de datos personales
            const pNombre = document.getElementById('pNombre');
            const pApellido = document.getElementById('pApellido');
            const pDNI = document.getElementById('pDNI');
            const pEdad = document.getElementById('pEdad');
            const pSexo = document.getElementById('pSexo');

            const btnDiagnosticar = document.getElementById('btnDiagnosticar');

            form.addEventListener('submit', function(e) {
                e.preventDefault();

                // --- Validar DNI ---
                const dniInput = document.getElementById('dni');
                const dniValue = dniInput.value.trim();
                if (!/^\d{8}$/.test(dniValue)) {
                    alert('⚠️ El DNI debe tener 8 dígitos numéricos (ej: 12345678)');
                    dniInput.focus();
                    return;
                }

                // --- Validar nombres ---
                const nombre = document.getElementById('nombre').value.trim();
                const apellido = document.getElementById('apellido').value.trim();
                if (nombre.length < 2) {
                    alert('⚠️ Ingrese un nombre válido (mínimo 2 caracteres)');
                    document.getElementById('nombre').focus();
                    return;
                }
                if (apellido.length < 2) {
                    alert('⚠️ Ingrese un apellido válido (mínimo 2 caracteres)');
                    document.getElementById('apellido').focus();
                    return;
                }

                // --- Obtener datos del formulario ---
                const datos = {
                    edad: parseFloat(document.getElementById('edad').value),
                    imc: parseFloat(document.getElementById('imc').value),
                    presion: parseFloat(document.getElementById('presion').value),
                    colesterol: parseFloat(document.getElementById('colesterol').value),
                    trigliceridos: parseFloat(document.getElementById('trigliceridos').value),
                    tabaquismo: parseFloat(document.getElementById('tabaquismo').value),
                    dolorPecho: parseFloat(document.getElementById('dolorPecho').value),
                    sexo: document.getElementById('sexo').value,
                    nombre: nombre,
                    apellido: apellido,
                    dni: dniValue
                };

                // --- Validaciones clínicas ---
                if (datos.edad < 27 || datos.edad > 90) {
                    alert('⚠️ La edad debe estar entre 27 y 90 años.');
                    return;
                }
                if (datos.imc < 15 || datos.imc > 70) {
                    alert('⚠️ El IMC debe estar entre 15 y 70.');
                    return;
                }
                if (datos.presion < 80 || datos.presion > 200) {
                    alert('⚠️ La presión debe estar entre 80 y 200 mmHg.');
                    return;
                }
                if (datos.colesterol < 100 || datos.colesterol > 500) {
                    alert('⚠️ El colesterol debe estar entre 100 y 500 mg/dL.');
                    return;
                }
                if (datos.trigliceridos < 50 || datos.trigliceridos > 600) {
                    alert('⚠️ Los triglicéridos deben estar entre 50 y 600 mg/dL.');
                    return;
                }

                // --- Deshabilitar botón y mostrar loading ---
                btnDiagnosticar.disabled = true;
                btnDiagnosticar.innerHTML = '<span class="loading-spinner"></span> Diagnosticando...';

                // Simular procesamiento
                setTimeout(() => {

                    // --- Ejecutar diagnóstico ---
                    const resultado = diagnosticar(datos);

                    // --- Mostrar resultados ---
                    resultsDiv.classList.add('active');

                    // Datos del paciente
                    pNombre.textContent = datos.nombre;
                    pApellido.textContent = datos.apellido;
                    pDNI.textContent = datos.dni;
                    pEdad.textContent = datos.edad;
                    pSexo.textContent = datos.sexo === 'masculino' ? 'Masculino' : 'Femenino';

                    // Hipertensión Arterial
                    resultHTA.textContent = `${resultado.hta.porcentaje}% · ${resultado.hta.nivel}`;
                    resultHTA.className = `value ${resultado.hta.class}`;

                    // Isquemia Cardíaca
                    resultIC.textContent = `${resultado.ic.porcentaje}% · ${resultado.ic.nivel}`;
                    resultIC.className = `value ${resultado.ic.class}`;

                    // Interpretación
                    interpretacion.innerHTML = `
                            <strong>Paciente:</strong> ${datos.nombre} ${datos.apellido} (DNI: ${datos.dni}) · 
                            ${datos.sexo === 'masculino' ? 'Varón' : 'Mujer'}, ${datos.edad} años · 
                            IMC ${datos.imc.toFixed(1)} (${resultado.imcLabel}) · 
                            Presión ${datos.presion} mmHg (${resultado.presionLabel}) · 
                            Colesterol ${datos.colesterol} mg/dL (${resultado.colLabel}) · 
                            Triglicéridos ${datos.trigliceridos} mg/dL (${resultado.trigLabel}) · 
                            Tabaquismo: ${datos.tabaquismo} cig/día (${resultado.tabLabel}) · 
                            Dolor de pecho: ${datos.dolorPecho} veces/mes (${resultado.dolorLabel}).
                            <br><br>
                            <strong>🫀 Hipertensión Arterial:</strong> ${resultado.hta.desc}
                            <br>
                            <strong>❤️‍🩹 Isquemia Cardíaca:</strong> ${resultado.ic.desc}
                            <div class="warning">
                                ⚠️ <strong>ADVERTENCIA:</strong> Este diagnóstico es orientativo y <strong>NO reemplaza</strong> 
                                la consulta médica profesional. Si presenta síntomas, acuda a un especialista.
                            </div>
                        `;

                    // Scroll suave a los resultados
                    resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });

                    // Restaurar botón
                    btnDiagnosticar.disabled = false;
                    btnDiagnosticar.innerHTML = '🔍 Diagnosticar';

                }, 600);
            });

            // --- Diagnóstico automático con valores por defecto al cargar ---
            window.addEventListener('DOMContentLoaded', function() {
                // Cargar valores de ejemplo
                document.getElementById('nombre').value = 'Juan';
                document.getElementById('apellido').value = 'Pérez';
                document.getElementById('dni').value = '12345678';

                setTimeout(() => {
                    form.dispatchEvent(new Event('submit'));
                }, 400);
            });

            // --- Validar DNI en tiempo real (solo números) ---
            document.getElementById('dni').addEventListener('input', function() {
                this.value = this.value.replace(/\D/g, '').slice(0, 8);
            });

        })();