/**
 * ============================================================
 * APLICACIÓN - Sistema Experto Respiratorio (3 Pasos)
 * ============================================================
 */

(function() {
    'use strict';

    const motor = new MotorInferenciaRespiratorio();
    const QUESTIONS = motor.constructor.QUESTIONS;

    let currentIndex = 0;
    const answers = {};
    let history = [];

    // ==========================================================
    // ELEMENTOS DOM
    // ==========================================================

    const steps = {
        step1: document.getElementById('step1'),
        step2: document.getElementById('step2'),
        step3: document.getElementById('step3'),
        indicator1: document.getElementById('step1Indicator'),
        indicator2: document.getElementById('step2Indicator'),
        indicator3: document.getElementById('step3Indicator')
    };

    const elements = {
        // Paso 1
        nombre: document.getElementById('nombre'),
        apellido: document.getElementById('apellido'),
        dni: document.getElementById('dni'),
        edad: document.getElementById('edad'),
        sexo: document.getElementById('sexo'),
        telefono: document.getElementById('telefono'),
        email: document.getElementById('email'),
        direccion: document.getElementById('direccion'),
        btnGoToStep2: document.getElementById('btnGoToStep2'),

        // Paso 2
        qNumber: document.getElementById('qNumber'),
        qIcon: document.getElementById('qIcon'),
        qText: document.getElementById('qText'),
        qHint: document.getElementById('qHint'),
        btnYes: document.getElementById('btnYes'),
        btnNo: document.getElementById('btnNo'),
        btnPrev: document.getElementById('btnPrev'),
        btnNext: document.getElementById('btnNext'),
        progressFill: document.getElementById('progressFill'),
        currentQuestionNum: document.getElementById('currentQuestionNum'),
        totalQuestionsNum: document.getElementById('totalQuestionsNum'),
        answeredCounter: document.getElementById('answeredCounter'),
        btnBackToStep1: document.getElementById('btnBackToStep1'),

        // Paso 3
        rNombre: document.getElementById('rNombre'),
        rApellido: document.getElementById('rApellido'),
        rDNI: document.getElementById('rDNI'),
        rEdad: document.getElementById('rEdad'),
        rSexo: document.getElementById('rSexo'),
        resultIcon: document.getElementById('resultIcon'),
        diseaseName: document.getElementById('diseaseName'),
        diseaseDesc: document.getElementById('diseaseDesc'),
        symptomList: document.getElementById('symptomList'),
        recommendationText: document.getElementById('recommendationText'),
        summaryText: document.getElementById('summaryText'),
        btnRestart: document.getElementById('btnRestart'),
        btnPrint: document.getElementById('btnPrint'),
        btnSaveHistory: document.getElementById('btnSaveHistory'),
        btnBackToStep2: document.getElementById('btnBackToStep2'),
        historyList: document.getElementById('historyList')
    };

    // ==========================================================
    // TOAST
    // ==========================================================

    let toastTimeout;

    function showToast(message, type = 'info') {
        const toast = document.getElementById('toast');
        const toastMessage = document.getElementById('toastMessage');
        toast.className = 'toast';
        if (type === 'success') toast.classList.add('success');
        if (type === 'error') toast.classList.add('error');
        toastMessage.textContent = message;
        clearTimeout(toastTimeout);
        toast.classList.add('show');
        toastTimeout = setTimeout(() => {
            toast.classList.remove('show');
        }, 3500);
    }

    window.closeToast = function() {
        const toast = document.getElementById('toast');
        toast.classList.remove('show');
        clearTimeout(toastTimeout);
    };

    // ==========================================================
    // NAVEGACIÓN ENTRE PASOS
    // ==========================================================

    function goToStep(step) {
        // Ocultar todos
        steps.step1.style.display = 'none';
        steps.step2.style.display = 'none';
        steps.step3.style.display = 'none';

        // Mostrar el paso indicado
        if (step === 1) {
            steps.step1.style.display = 'block';
            steps.indicator1.classList.add('active');
            steps.indicator2.classList.remove('active');
            steps.indicator3.classList.remove('active');
        } else if (step === 2) {
            steps.step2.style.display = 'block';
            steps.indicator1.classList.remove('active');
            steps.indicator2.classList.add('active');
            steps.indicator3.classList.remove('active');
        } else if (step === 3) {
            steps.step3.style.display = 'block';
            steps.indicator1.classList.remove('active');
            steps.indicator2.classList.remove('active');
            steps.indicator3.classList.add('active');
        }

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // ==========================================================
    // PASO 1: DATOS DEL PACIENTE
    // ==========================================================

    function getPatientData() {
        return {
            nombre: elements.nombre.value.trim(),
            apellido: elements.apellido.value.trim(),
            dni: elements.dni.value.trim(),
            edad: parseInt(elements.edad.value) || 0,
            sexo: elements.sexo.value,
            telefono: elements.telefono.value.trim(),
            email: elements.email.value.trim(),
            direccion: elements.direccion.value.trim()
        };
    }

    function validatePatient() {
        const data = getPatientData();
        if (!data.nombre || data.nombre.length < 2) {
            showToast('⚠️ Ingrese un nombre válido', 'error');
            elements.nombre.focus();
            return false;
        }
        if (!data.apellido || data.apellido.length < 2) {
            showToast('⚠️ Ingrese un apellido válido', 'error');
            elements.apellido.focus();
            return false;
        }
        if (!data.dni || !/^\d{8}$/.test(data.dni)) {
            showToast('⚠️ Ingrese un DNI válido de 8 dígitos', 'error');
            elements.dni.focus();
            return false;
        }
        if (!data.edad || data.edad < 1 || data.edad > 120) {
            showToast('⚠️ Ingrese una edad válida', 'error');
            elements.edad.focus();
            return false;
        }
        if (!data.sexo) {
            showToast('⚠️ Seleccione el sexo', 'error');
            elements.sexo.focus();
            return false;
        }
        return true;
    }

    elements.btnGoToStep2.addEventListener('click', function() {
        if (validatePatient()) {
            // Iniciar cuestionario desde el principio
            currentIndex = 0;
            for (const key in answers) {
                delete answers[key];
            }
            showQuestion(0);
            goToStep(2);
        }
    });

    elements.btnBackToStep1.addEventListener('click', function() {
        goToStep(1);
    });

    // ==========================================================
    // PASO 2: CUESTIONARIO
    // ==========================================================

    function updateProgress() {
        const answered = Object.keys(answers).length;
        const total = QUESTIONS.length;
        const progress = (answered / total) * 100;

        elements.progressFill.style.width = progress + '%';
        elements.currentQuestionNum.textContent = currentIndex + 1;
        elements.totalQuestionsNum.textContent = total;
        elements.answeredCounter.textContent = `${answered} / ${total}`;

        elements.btnPrev.disabled = currentIndex === 0;

        if (currentIndex === total - 1) {
            elements.btnNext.innerHTML = '<i class="fas fa-check"></i> Ver Diagnóstico';
        } else {
            elements.btnNext.innerHTML = 'Siguiente <i class="fas fa-arrow-right"></i>';
        }

        const currentQ = QUESTIONS[currentIndex];
        const hasAnswered = answers[currentQ.id] !== undefined;

        elements.btnYes.disabled = hasAnswered;
        elements.btnNo.disabled = hasAnswered;

        if (hasAnswered) {
            elements.btnYes.style.borderColor = answers[currentQ.id] === 1 ? '#27ae60' : '#dce3ed';
            elements.btnYes.style.background = answers[currentQ.id] === 1 ? '#eafaf1' : '#ffffff';
            elements.btnNo.style.borderColor = answers[currentQ.id] === 0 ? '#e74c3c' : '#dce3ed';
            elements.btnNo.style.background = answers[currentQ.id] === 0 ? '#fdedec' : '#ffffff';
        } else {
            elements.btnYes.style.borderColor = '#dce3ed';
            elements.btnYes.style.background = '#ffffff';
            elements.btnNo.style.borderColor = '#dce3ed';
            elements.btnNo.style.background = '#ffffff';
        }
    }

    function showQuestion(index) {
        const q = QUESTIONS[index];
        elements.qNumber.textContent = `Pregunta ${index + 1}`;
        elements.qIcon.textContent = q.icon || '🤔';
        elements.qText.textContent = q.text;
        elements.qHint.textContent = q.hint || 'Selecciona una opción';
        updateProgress();
    }

    function handleAnswer(value) {
        const q = QUESTIONS[currentIndex];
        answers[q.id] = value;
        updateProgress();

        setTimeout(() => {
            if (currentIndex < QUESTIONS.length - 1) {
                currentIndex++;
                showQuestion(currentIndex);
            } else {
                // Verificar si todas las preguntas están respondidas
                if (QUESTIONS.every(q => answers[q.id] !== undefined)) {
                    showResults();
                } else {
                    elements.btnNext.click();
                }
            }
        }, 250);
    }

    elements.btnYes.addEventListener('click', function() {
        handleAnswer(1);
    });

    elements.btnNo.addEventListener('click', function() {
        handleAnswer(0);
    });

    elements.btnPrev.addEventListener('click', function() {
        if (currentIndex > 0) {
            currentIndex--;
            showQuestion(currentIndex);
        }
    });

    elements.btnNext.addEventListener('click', function() {
        const q = QUESTIONS[currentIndex];
        if (answers[q.id] === undefined) {
            showToast('⚠️ Responde la pregunta antes de continuar', 'error');
            return;
        }

        if (currentIndex < QUESTIONS.length - 1) {
            currentIndex++;
            showQuestion(currentIndex);
        } else {
            const allAnswered = QUESTIONS.every(q => answers[q.id] !== undefined);
            if (allAnswered) {
                showResults();
            } else {
                const firstUnanswered = QUESTIONS.findIndex(q => answers[q.id] === undefined);
                if (firstUnanswered !== -1) {
                    currentIndex = firstUnanswered;
                    showQuestion(currentIndex);
                    showToast(`⚠️ Faltan preguntas. Ve a la pregunta ${firstUnanswered + 1}`, 'error');
                }
            }
        }
    });

    elements.btnBackToStep2.addEventListener('click', function() {
        goToStep(2);
    });

    // ==========================================================
    // PASO 3: RESULTADOS
    // ==========================================================

    function showResults() {
        const patient = getPatientData();
        const result = motor.diagnosticar(answers);

        // Información del paciente
        elements.rNombre.textContent = patient.nombre;
        elements.rApellido.textContent = patient.apellido;
        elements.rDNI.textContent = patient.dni;
        elements.rEdad.textContent = patient.edad;
        elements.rSexo.textContent = patient.sexo;

        // Resultados
        elements.resultIcon.textContent = result.info.icon || '🏥';
        elements.diseaseName.textContent = `${result.info.icon || ''} ${result.info.name}`;
        elements.diseaseDesc.textContent = result.info.desc;

        // Síntomas
        elements.symptomList.innerHTML = '';
        if (result.symptoms.length === 0) {
            const tag = document.createElement('span');
            tag.className = 'symptom-tag';
            tag.innerHTML = '<i class="fas fa-info-circle"></i> No se reportaron síntomas';
            elements.symptomList.appendChild(tag);
        } else {
            for (const symptom of result.symptoms) {
                const tag = document.createElement('span');
                tag.className = 'symptom-tag';
                tag.innerHTML = `<i class="fas fa-check-circle" style="color:#27ae60;"></i> ${symptom}`;
                elements.symptomList.appendChild(tag);
            }
        }

        // Recomendación
        elements.recommendationText.textContent = result.info.recommendation || 'Consultar con un médico especialista.';

        // Resumen
        elements.summaryText.textContent =
            `Paciente ${patient.nombre} ${patient.apellido} (${patient.edad} años, ${patient.sexo}) presenta ` +
            `${result.symptoms.length} síntomas compatibles con "${result.info.name}". ` +
            `Se recomienda seguir las indicaciones y acudir a un especialista para confirmación. ` +
            `⚠️ Este diagnóstico es orientativo y NO reemplaza la consulta médica profesional.`;

        // Mostrar paso 3
        goToStep(3);
        renderHistory();
        showToast('✅ Diagnóstico completado exitosamente', 'success');
    }

    // ==========================================================
    // HISTORIAL
    // ==========================================================

    function renderHistory() {
        if (history.length === 0) {
            elements.historyList.innerHTML = '<div class="history-empty">No hay diagnósticos guardados aún.</div>';
            return;
        }

        let html = '';
        for (let i = history.length - 1; i >= 0; i--) {
            const item = history[i];
            html += `
                <div class="history-item">
                    <span>
                        <span class="h-disease">${item.disease}</span>
                        <span style="color:#6a7b8e;font-size:12px;"> - ${item.symptomsCount} síntomas</span>
                    </span>
                    <span class="h-date">${item.date} · ${item.patient}</span>
                </div>
            `;
        }
        elements.historyList.innerHTML = html;
    }

    function saveToHistory() {
        const patient = getPatientData();
        const result = motor.diagnosticar(answers);

        const entry = {
            patient: `${patient.nombre} ${patient.apellido}`,
            dni: patient.dni,
            disease: result.info.name,
            symptomsCount: result.symptoms.length,
            date: new Date().toLocaleDateString('es-ES', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })
        };

        history.push(entry);
        renderHistory();
        showToast('✅ Diagnóstico guardado en el historial', 'success');
    }

    elements.btnSaveHistory.addEventListener('click', function() {
        const patient = getPatientData();
        if (!patient.nombre || !patient.apellido || !patient.dni) {
            showToast('⚠️ Complete los datos del paciente para guardar', 'error');
            return;
        }
        saveToHistory();
    });

    // ==========================================================
    // BOTONES DE ACCIÓN
    // ==========================================================

    elements.btnRestart.addEventListener('click', function() {
        for (const key in answers) {
            delete answers[key];
        }
        currentIndex = 0;
        goToStep(1);
        showToast('🔄 Nuevo diagnóstico iniciado', 'info');
    });

    elements.btnPrint.addEventListener('click', function() {
        window.print();
    });

    // ==========================================================
    // ATALOS DE TECLADO
    // ==========================================================

    document.addEventListener('keydown', function(e) {
        // Solo funciona en el paso 2
        if (steps.step2.style.display !== 'block') return;

        if (e.key === 'ArrowLeft' && !elements.btnPrev.disabled) {
            elements.btnPrev.click();
        }
        if (e.key === 'ArrowRight' && !elements.btnNext.disabled) {
            elements.btnNext.click();
        }
        if (e.key === '1' || e.key === 's' || e.key === 'S') {
            elements.btnYes.click();
        }
        if (e.key === '0' || e.key === 'n' || e.key === 'N') {
            elements.btnNo.click();
        }
        if (e.key === 'Enter' && !elements.btnNext.disabled) {
            elements.btnNext.click();
        }
    });

    // ==========================================================
    // INICIALIZACIÓN
    // ==========================================================

    // Valores por defecto
    elements.nombre.value = 'María';
    elements.apellido.value = 'González';
    elements.dni.value = '12345678';
    elements.edad.value = '35';
    elements.sexo.value = 'Femenino';
    elements.telefono.value = '987654321';
    elements.email.value = 'maria.gonzalez@email.com';
    elements.direccion.value = 'Av. Principal 456';

    // Mostrar paso 1
    goToStep(1);
    showQuestion(0);

    console.log('✅ Sistema Experto Respiratorio cargado correctamente.');
    console.log('📋 30 preguntas disponibles.');
    console.log('🩺 Enfermedades: Gripe, Asma, EPOC, Hipertensión Pulmonar');

})();