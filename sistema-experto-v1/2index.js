(function() {
            'use strict';

            // ============================================================
            // 1. BASE DE CONOCIMIENTOS (Página 23, 52 del PDF)
            // ============================================================
            const BASE_CONOCIMIENTO = {
                enfermedades: ['Neumonía', 'Bronquitis', 'Asma', 'EPOC'],
                medicamentos: ['Amoxicilina', 'Bromhexina', 'Budesonida', 'Tiotropio', 'Salbutamol', 'Teofilina'],
                reglas: {
                    'Neumonía': { fiebre: 35, tos: 10, disnea: 12, dolor: 9, expectoracion: 8, pesoBajo: 5 },
                    'Bronquitis': { tos: 14, expectoracion: 12, disnea: 6, fiebreMedia: 10, dolor: 4 },
                    'Asma': { disnea: 18, tos: 7, dolor: 6, fiebreBaja: 8 },
                    'EPOC': { disnea: 16, tos: 8, expectoracion: 10, pesoBajo: 10, dolor: 3 }
                },
                tratamientos: {
                    'Neumonía': {
                        medicamento: 'Amoxicilina + Ácido Clavulánico',
                        dosis: function(p) { return p < 60 ? '500 mg cada 8 horas' : '875 mg cada 12 horas'; },
                        duracion: '7 a 10 días',
                        recomendaciones: 'Reposo absoluto, hidratación abundante, control de fiebre con paracetamol.'
                    },
                    'Bronquitis': {
                        medicamento: 'Bromhexina + Salbutamol (inhalador)',
                        dosis: function() { return 'Bromhexina 8 mg cada 8 horas · Salbutamol 2 inhalaciones cada 6 horas'; },
                        duracion: '5 a 7 días',
                        recomendaciones: 'Evitar irritantes, usar humidificador, reposo relativo.'
                    },
                    'Asma': {
                        medicamento: 'Budesonida (inhalador) + Salbutamol',
                        dosis: function() { return 'Budesonida 200 µg cada 12 horas · Salbutamol según necesidad'; },
                        duracion: 'Mantenimiento continuo, evaluar en 7 días',
                        recomendaciones: 'Evitar alérgenos, mantener inhalador de rescate siempre disponible.'
                    },
                    'EPOC': {
                        medicamento: 'Tiotropio + Teofilina',
                        dosis: function() { return 'Tiotropio 18 µg cada 24 horas · Teofilina 200 mg cada 12 horas'; },
                        duracion: 'Tratamiento crónico, revisión en 14 días',
                        recomendaciones: 'Rehabilitación pulmonar, oxígeno suplementario si saturación < 90%.'
                    }
                }
            };

            // ============================================================
            // 2. MOTOR DE INFERENCIA (Página 23, 52 del PDF)
            // ============================================================
            function motorInferencia(sintomas) {
                var fiebre = parseFloat(sintomas.fiebre) || 36.8;
                var tos = parseInt(sintomas.tos) || 0;
                var disnea = parseInt(sintomas.disnea) || 0;
                var dolor = parseInt(sintomas.dolorToracico) || 0;
                var expectoracion = parseInt(sintomas.expectoracion) || 0;
                var peso = parseFloat(sintomas.peso) || 70;

                var resultados = {};
                var reglas = BASE_CONOCIMIENTO.reglas;

                for (var enfermedad in reglas) {
                    var regla = reglas[enfermedad];
                    var score = 0;

                    if (regla.fiebre && fiebre > 38.0) score += regla.fiebre;
                    if (regla.fiebreMedia && fiebre > 37.2) score += regla.fiebreMedia;
                    if (regla.fiebreBaja && fiebre < 37.5) score += regla.fiebreBaja;
                    if (regla.tos) score += tos * regla.tos;
                    if (regla.disnea) score += disnea * regla.disnea;
                    if (regla.dolor) score += dolor * regla.dolor;
                    if (regla.expectoracion) score += expectoracion * regla.expectoracion;
                    if (regla.pesoBajo && peso < 60) score += regla.pesoBajo;

                    resultados[enfermedad] = Math.min(100, Math.round((score / 120) * 100));
                }

                var ordenado = [];
                for (var nombre in resultados) {
                    ordenado.push({ nombre: nombre, prob: resultados[nombre] });
                }
                ordenado.sort(function(a, b) { return b.prob - a.prob; });

                var explicacion = generarExplicacion(ordenado, sintomas);

                return { resultados: ordenado, explicacion: explicacion };
            }

            // ============================================================
            // 3. MÓDULO DE EXPLICACIÓN (Página 24 del PDF)
            // ============================================================
            function generarExplicacion(resultados, sintomas) {
                var explicacion = [];
                var principal = resultados[0];

                explicacion.push('El síntoma con mayor peso para "' + principal.nombre + '" fue:');

                var fiebre = parseFloat(sintomas.fiebre) || 36.8;
                var tos = parseInt(sintomas.tos) || 0;
                var disnea = parseInt(sintomas.disnea) || 0;
                var dolor = parseInt(sintomas.dolorToracico) || 0;
                var expectoracion = parseInt(sintomas.expectoracion) || 0;

                if (fiebre > 38.0) explicacion.push('• Fiebre alta (>38°C) — contribución significativa');
                if (tos >= 2) explicacion.push('• Tos moderada/intensa — contribución media-alta');
                if (disnea >= 2) explicacion.push('• Disnea moderada/grave — contribución alta');
                if (dolor >= 2) explicacion.push('• Dolor torácico frecuente/constante — contribución media');
                if (expectoracion >= 2) explicacion.push('• Expectoración moderada/abundante — contribución media');

                if (explicacion.length === 1) {
                    explicacion.push('• No se detectaron síntomas de alta relevancia.');
                }

                explicacion.push('\nLa probabilidad del diagnóstico principal es del ' + principal.prob + '%.');
                explicacion.push('Se recomienda validación por un médico especialista.');

                return explicacion;
            }

            // ============================================================
            // 4. INTERFAZ DE USUARIO
            // ============================================================

            var btn = document.getElementById('btnDiagnosticar');
            var resultArea = document.getElementById('resultArea');

            function renderizarDiagnostico(resultados, explicacion, peso) {
                var html = '';

                html += '<div class="result-card">';
                html += '<div class="header">';
                html += '<span><i class="fas fa-chart-line"></i> Probabilidad por enfermedad</span>';
                html += '<span class="badge">Sistema Experto</span>';
                html += '</div>';

                for (var i = 0; i < resultados.length; i++) {
                    var item = resultados[i];
                    var cls = 'prob-low';
                    if (item.prob >= 70) cls = 'prob-high';
                    else if (item.prob >= 45) cls = 'prob-medium';
                    html += '<div class="diagnosis-item">';
                    html += '<span>' + item.nombre + '</span>';
                    html += '<span class="prob ' + cls + '">' + item.prob + '%</span>';
                    html += '</div>';
                }
                html += '</div>';

                var principal = resultados[0];
                var tratamiento = BASE_CONOCIMIENTO.tratamientos[principal.nombre];
                if (tratamiento) {
                    var dosis = typeof tratamiento.dosis === 'function' ? tratamiento.dosis(peso) : tratamiento.dosis;
                    html += '<div class="treatment-box">';
                    html += '<h4><i class="fas fa-prescription-bottle"></i> Tratamiento para ' + principal.nombre + '</h4>';
                    html += '<ul>';
                    html += '<li><i class="fas fa-capsules"></i> <strong>Medicamento:</strong> ' + tratamiento.medicamento +
                        '</li>';
                    html += '<li><i class="fas fa-weight-scale"></i> <strong>Dosis:</strong> ' + dosis + '</li>';
                    html += '<li><i class="fas fa-clock"></i> <strong>Duración:</strong> ' + tratamiento.duracion + '</li>';
                    html += '<li><i class="fas fa-notes-medical"></i> <strong>Recomendaciones:</strong> ' + tratamiento
                        .recomendaciones + '</li>';
                    html += '</ul>';
                    html += '</div>';
                }

                html += '<div class="explanation-box">';
                html += '<h4><i class="fas fa-lightbulb"></i> ¿Por qué este diagnóstico?</h4>';
                html += '<ul>';
                for (var j = 0; j < explicacion.length; j++) {
                    html += '<li><i class="fas fa-chevron-right"></i> ' + explicacion[j] + '</li>';
                }
                html += '</ul>';
                html += '</div>';

                resultArea.innerHTML = html;
            }

            btn.addEventListener('click', function() {
                var fiebre = document.getElementById('fiebre').value;
                var tos = document.getElementById('tos').value;
                var disnea = document.getElementById('disnea').value;
                var dolorToracico = document.getElementById('dolorToracico').value;
                var expectoracion = document.getElementById('expectoracion').value;
                var peso = parseFloat(document.getElementById('peso').value) || 70;

                var sintomas = {
                    fiebre: fiebre,
                    tos: tos,
                    disnea: disnea,
                    dolorToracico: dolorToracico,
                    expectoracion: expectoracion,
                    peso: peso
                };
                var resultado = motorInferencia(sintomas);

                renderizarDiagnostico(resultado.resultados, resultado.explicacion, peso);
                mostrarToast('Diagnóstico completado con éxito');
            });

            // ============================================================
            // 5. ADMINISTRACIÓN (Página 52 del PDF)
            // ============================================================

            function renderizarEnfermedades() {
                var container = document.getElementById('enfermedadesList');
                var html = '<ul style="list-style:none; padding:0;">';
                for (var i = 0; i < BASE_CONOCIMIENTO.enfermedades.length; i++) {
                    var e = BASE_CONOCIMIENTO.enfermedades[i];
                    html += '<li style="display:flex; justify-content:space-between; padding:6px 0; border-bottom:1px solid #eef2f6;">';
                    html += '<span><i class="fas fa-virus" style="color:#2563eb;"></i> ' + e + '</span>';
                    html += '<button class="btn-danger-sm" onclick="eliminarEnfermedad(\'' + e +
                        '\')"><i class="fas fa-trash"></i></button>';
                    html += '</li>';
                }
                html += '</ul>';
                container.innerHTML = html ||
                '<div class="empty-state"><i class="fas fa-database"></i>No hay enfermedades registradas</div>';
            }

            window.agregarEnfermedad = function() {
                var input = document.getElementById('newEnfermedad');
                var nombre = input.value.trim();
                if (nombre && !BASE_CONOCIMIENTO.enfermedades.includes(nombre)) {
                    BASE_CONOCIMIENTO.enfermedades.push(nombre);
                    BASE_CONOCIMIENTO.reglas[nombre] = { tos: 5, disnea: 5, dolor: 3, expectoracion: 3 };
                    renderizarEnfermedades();
                    renderizarMedicamentos();
                    renderizarReglas();
                    actualizarContadores();
                    input.value = '';
                    mostrarToast('Enfermedad "' + nombre + '" agregada');
                    guardarEstado();
                } else {
                    mostrarToast('La enfermedad ya existe o el nombre está vacío', 'error');
                }
            };

            window.eliminarEnfermedad = function(nombre) {
                var idx = BASE_CONOCIMIENTO.enfermedades.indexOf(nombre);
                if (idx > -1) {
                    BASE_CONOCIMIENTO.enfermedades.splice(idx, 1);
                    delete BASE_CONOCIMIENTO.reglas[nombre];
                    renderizarEnfermedades();
                    renderizarReglas();
                    actualizarContadores();
                    mostrarToast('Enfermedad "' + nombre + '" eliminada');
                    guardarEstado();
                }
            };

            function renderizarMedicamentos() {
                var container = document.getElementById('medicamentosList');
                var html = '<ul style="list-style:none; padding:0;">';
                for (var i = 0; i < BASE_CONOCIMIENTO.medicamentos.length; i++) {
                    var m = BASE_CONOCIMIENTO.medicamentos[i];
                    html += '<li style="display:flex; justify-content:space-between; padding:6px 0; border-bottom:1px solid #eef2f6;">';
                    html += '<span><i class="fas fa-pills" style="color:#16a34a;"></i> ' + m + '</span>';
                    html += '<button class="btn-danger-sm" onclick="eliminarMedicamento(\'' + m +
                        '\')"><i class="fas fa-trash"></i></button>';
                    html += '</li>';
                }
                html += '</ul>';
                container.innerHTML = html ||
                '<div class="empty-state"><i class="fas fa-database"></i>No hay medicamentos registrados</div>';
            }

            window.agregarMedicamento = function() {
                var input = document.getElementById('newMedicamento');
                var nombre = input.value.trim();
                if (nombre && !BASE_CONOCIMIENTO.medicamentos.includes(nombre)) {
                    BASE_CONOCIMIENTO.medicamentos.push(nombre);
                    renderizarMedicamentos();
                    actualizarContadores();
                    input.value = '';
                    mostrarToast('Medicamento "' + nombre + '" agregado');
                    guardarEstado();
                } else {
                    mostrarToast('El medicamento ya existe o el nombre está vacío', 'error');
                }
            };

            window.eliminarMedicamento = function(nombre) {
                var idx = BASE_CONOCIMIENTO.medicamentos.indexOf(nombre);
                if (idx > -1) {
                    BASE_CONOCIMIENTO.medicamentos.splice(idx, 1);
                    renderizarMedicamentos();
                    actualizarContadores();
                    mostrarToast('Medicamento "' + nombre + '" eliminado');
                    guardarEstado();
                }
            };

            function renderizarReglas() {
                var container = document.getElementById('reglasContainer');
                var html =
                    '<table class="admin-table"><thead><tr><th>Enfermedad</th><th>Síntoma</th><th>Peso</th></tr></thead><tbody>';
                var mapaSintomas = {
                    fiebre: 'Fiebre (>38°C)',
                    fiebreMedia: 'Fiebre (>37.2°C)',
                    fiebreBaja: 'Fiebre (<37.5°C)',
                    tos: 'Tos',
                    disnea: 'Disnea',
                    dolor: 'Dolor torácico',
                    expectoracion: 'Expectoración',
                    pesoBajo: 'Peso bajo (<60kg)'
                };
                for (var enfermedad in BASE_CONOCIMIENTO.reglas) {
                    var regla = BASE_CONOCIMIENTO.reglas[enfermedad];
                    for (var sintoma in regla) {
                        var nombreSintoma = mapaSintomas[sintoma] || sintoma;
                        html += '<tr><td>' + enfermedad + '</td><td>' + nombreSintoma + '</td><td>' + regla[sintoma] +
                            '</td></tr>';
                    }
                }
                html += '</tbody></table>';
                container.innerHTML = html;
            }

            function actualizarContadores() {
                var reglasCount = 0;
                for (var e in BASE_CONOCIMIENTO.reglas) {
                    reglasCount += Object.keys(BASE_CONOCIMIENTO.reglas[e]).length;
                }
                document.getElementById('reglasCount').textContent = reglasCount;
                document.getElementById('tratamientosCount').textContent = Object.keys(BASE_CONOCIMIENTO.tratamientos)
                    .length;
            }

            // ============================================================
            // 6. TOAST
            // ============================================================
            function mostrarToast(msg, type) {
                var toast = document.getElementById('toast');
                var toastMsg = document.getElementById('toastMsg');
                toastMsg.textContent = msg;
                toast.className = 'toast';
                if (type === 'error') {
                    toast.classList.add('error');
                }
                toast.classList.add('show');
                clearTimeout(toast._timer);
                toast._timer = setTimeout(function() {
                    toast.classList.remove('show');
                }, 3000);
            }
            window.mostrarToast = mostrarToast;

            // ============================================================
            // 7. TABS
            // ============================================================
            var tabButtons = document.querySelectorAll('.tab-btn');
            for (var t = 0; t < tabButtons.length; t++) {
                tabButtons[t].addEventListener('click', function() {
                    var allBtns = document.querySelectorAll('.tab-btn');
                    for (var b = 0; b < allBtns.length; b++) {
                        allBtns[b].classList.remove('active');
                    }
                    var allContents = document.querySelectorAll('.tab-content');
                    for (var c = 0; c < allContents.length; c++) {
                        allContents[c].classList.remove('active');
                    }
                    this.classList.add('active');
                    document.getElementById('tab-' + this.dataset.tab).classList.add('active');
                });
            }

            // ============================================================
            // 8. PERSISTENCIA LOCAL (Simula base de datos)
            // ============================================================
            function guardarEstado() {
                var estado = {
                    enfermedades: BASE_CONOCIMIENTO.enfermedades,
                    medicamentos: BASE_CONOCIMIENTO.medicamentos,
                    reglas: BASE_CONOCIMIENTO.reglas
                };
                try {
                    localStorage.setItem('sistemaExperto_estado', JSON.stringify(estado));
                } catch (e) {}
            }

            function cargarEstado() {
                try {
                    var data = localStorage.getItem('sistemaExperto_estado');
                    if (data) {
                        var estado = JSON.parse(data);
                        if (estado.enfermedades) BASE_CONOCIMIENTO.enfermedades = estado.enfermedades;
                        if (estado.medicamentos) BASE_CONOCIMIENTO.medicamentos = estado.medicamentos;
                        if (estado.reglas) BASE_CONOCIMIENTO.reglas = estado.reglas;
                        renderizarEnfermedades();
                        renderizarMedicamentos();
                        renderizarReglas();
                        actualizarContadores();
                    }
                } catch (e) {}
            }

            // ============================================================
            // 9. INICIALIZACIÓN
            // ============================================================
            renderizarEnfermedades();
            renderizarMedicamentos();
            renderizarReglas();
            actualizarContadores();
            cargarEstado();

            setTimeout(function() {
                btn.click();
            }, 300);

        })();