/**
 * SISTEMA DE AUDITORÍA DE CARBONO
 * Factor: 0.45 kg/kWh
 * Absorción: 1.67 kg/árbol/mes
 */
function runAudit() {
    const energyValue = parseFloat(document.getElementById('energyInput').value);
    const period = parseInt(document.getElementById('periodType').value);
    const emissionFactor = 0.45;
    const treeAbsorption = 1.67; // Métrica de absorción mensual

    if (!energyValue || energyValue <= 0) {
        alert("Por favor, ingrese un valor de consumo eléctrico válido.");
        return;
    }

    // 1. Normalización a base mensual
    const monthlyKwh = energyValue / period;
    
    // 2. Cálculo de Huella de Carbono Mensual (kg CO2)
    const monthlyCO2 = monthlyKwh * emissionFactor;
    
    // 3. CÁLCULO DE ÁRBOLES (kg CO2 mensual / 1.67)
    const treesRequired = Math.ceil(monthlyCO2 / treeAbsorption);
    
    // 4. Proyección Anual (Toneladas)
    const annualTons = ((monthlyKwh * 12 * emissionFactor) / 1000).toFixed(3);

    // Actualización de la Interfaz
    displayResults(monthlyCO2.toFixed(2), treesRequired, annualTons);
}

function displayResults(co2, trees, tons) {
    const empty = document.getElementById('emptyState');
    const content = document.getElementById('resultsContent');
    const statusText = document.getElementById('statusText');

    // Animación del valor principal
    animateCount("monthlyCO2", 0, co2, 1000);
    
    document.getElementById('treesVal').innerText = trees;
    document.getElementById('annualProy').innerText = tons + " tCO₂";

    // Lógica de Semáforo de Auditoría
    if (co2 < 40) {
        statusText.innerText = "Nivel de Emisiones: Bajo/Eficiente";
        statusText.style.color = "#10b981";
    } else {
        statusText.innerText = "Nivel de Emisiones: Requiere Optimización";
        statusText.style.color = "#f59e0b";
    }

    empty.classList.add('hidden');
    content.classList.remove('hidden');
}

function animateCount(id, start, end, duration) {
    const obj = document.getElementById(id);
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        obj.innerHTML = (progress * (end - start) + start).toFixed(2);
        if (progress < 1) window.requestAnimationFrame(step);
    };
    window.requestAnimationFrame(step);
}