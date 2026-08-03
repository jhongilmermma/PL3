let alive = true;

function setABC(val) {
    alive = val;
    document.getElementById('abcSi').className = val ? 'active' : '';
    document.getElementById('abcNo').className = !val ? 'active' : '';
}

function evalTriage() {
    // Captura de datos
    const name = document.getElementById('pName').value || "PACIENTE NN";
    const age = parseInt(document.getElementById('pAge').value) || 0;
    const fc = parseInt(document.getElementById('vFC').value) || 0;
    const sat = parseInt(document.getElementById('vSat').value) || 0;
    const temp = parseFloat(document.getElementById('vTemp').value) || 36.5;
    const dolor = parseInt(document.getElementById('vDolor').value) || 0;
    const sintoma = document.getElementById('vSintoma').value;

    let res = { lvl: "", time: "", color: "", area: "", note: "" };

    // --- ALGORITMO DE TRIAJE REAL (Manchester Adaptation) ---

    // PRIORIDAD I (Rojo) - Riesgo Vital Inminente
    if (!alive || sat < 85 || (fc > 140 || (fc < 40 && fc > 0))) {
        res = { lvl: "PRIORIDAD I", time: "ATENCIÓN INMEDIATA", color: "#d32f2f", area: "SHOCK TRAUMA / REANIMACIÓN", note: "Amenaza inmediata a la vida. Requiere intervención médica inmediata sin demora." };
    }
    // PRIORIDAD II (Naranja) - Muy Urgente
    else if (sintoma === 'pecho' || sintoma === 'neuro' || sat < 91 || sintoma === 'hemorragia' || dolor >= 9) {
        res = { lvl: "PRIORIDAD II", time: "10 - 15 MINUTOS", area: "CUIDADOS CRÍTICOS / TRAUMA", note: "Situación de alto riesgo. Posible compromiso de órganos vitales. Evaluación en curso." };
    }
    // PRIORIDAD III (Amarillo) - Urgente
    else if (dolor >= 7 || temp >= 39 || (fc > 110 || fc < 55) || sintoma === 'trauma') {
        res = { lvl: "PRIORIDAD III", time: "60 MINUTOS", area: "URGENCIAS GENERALES", note: "Paciente requiere exámenes auxiliares y monitoreo. Condición estable pero con dolor severo." };
    }
    // PRIORIDAD IV (Verde) - Menos Urgente
    else if (dolor >= 4 || temp >= 38) {
        res = { lvl: "PRIORIDAD IV", time: "120 MINUTOS", area: "CONSULTORIOS / TRIAJE", note: "Paciente con síntomas moderados. Sin riesgo de deterioro inmediato." };
    }
    // PRIORIDAD V (Azul) - No Urgente
    else {
        res = { lvl: "PRIORIDAD V", time: "240 MINUTOS", area: "ADMISIÓN GENERAL", note: "Problema crónico o síntoma leve. Se recomienda atención por consulta externa." };
    }

    renderDisplay(name, res);
}

function renderDisplay(name, res) {
    document.getElementById('idle').classList.add('hidden');
    const result = document.getElementById('result');
    result.classList.remove('hidden');

    document.getElementById('prioBanner').style.backgroundColor = res.color;
    document.getElementById('prioLabel').innerText = res.lvl;
    document.getElementById('prioTime').innerText = res.time;
    
    document.getElementById('resName').innerText = name.toUpperCase();
    document.getElementById('resArea').innerText = res.area;
    document.getElementById('resNote').innerText = res.note;
}