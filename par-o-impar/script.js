document.getElementById('energyForm').addEventListener('submit', function(e) {
    e.preventDefault();

    // 1. Obtener valores de entrada
    const watts = parseFloat(document.getElementById('watts').value);
    const hours = parseFloat(document.getElementById('hours').value);

    // 2. Aplicar fórmula científica
    const kwh = (watts * hours) / 1000;

    // 3. Lógica de clasificación mediante if / else
    let status = "";
    let colorClass = "";
    let desc = "";

    if (kwh < 1) {
        status = "Consumo Eficiente";
        colorClass = "status-eficiente";
        desc = "¡Excelente! Este artefacto tiene un impacto mínimo en tu recibo.";
    } 
    else if (kwh >= 1 && kwh <= 3) {
        status = "Consumo Moderado";
        colorClass = "status-moderado";
        desc = "El consumo está dentro de los rangos normales de uso doméstico.";
    } 
    else {
        status = "Consumo Excesivo";
        colorClass = "status-excesivo";
        desc = "Cuidado. El uso prolongado de este equipo elevará significativamente el costo.";
    }

    // 4. Mostrar resultados en la interfaz
    const resultDiv = document.getElementById('result');
    const statusLabel = document.getElementById('statusLabel');
    
    document.getElementById('kwhValue').innerText = kwh.toFixed(2);
    statusLabel.innerText = status;
    
    // Limpiar clases previas y aplicar la nueva
    statusLabel.className = colorClass;
    document.getElementById('description').innerText = desc;
    
    resultDiv.classList.remove('hidden');
});