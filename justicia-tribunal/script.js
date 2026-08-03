document.getElementById('taxForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const ingreso = parseFloat(document.getElementById('income').value);
    const timeStamp = new Date().toLocaleString();
    
    let tasa = 0;
    let tramoMsg = "";
    let meterWidth = 0;

    // --- LÓGICA DE CATEGORIZACIÓN ---
    if (ingreso < 1000) {
        tasa = 0;
        tramoMsg = "ESTADO: EXENTO. Tu nivel de ingresos no genera obligaciones tributarias actuales.";
        meterWidth = 10;
    } 
    else if (ingreso <= 2500) {
        tasa = 0.10;
        tramoMsg = "TRAMO BAJO: Tu contribución ayuda a financiar servicios básicos de salud y educación.";
        meterWidth = 35;
    } 
    else if (ingreso <= 5000) {
        tasa = 0.20;
        tramoMsg = "TRAMO MEDIO: Aporte significativo para el desarrollo de infraestructura vial y seguridad.";
        meterWidth = 65;
    } 
    else {
        tasa = 0.35;
        tramoMsg = "TRAMO ALTO: Nivel de contribución estratégica para la redistribución y programas sociales.";
        meterWidth = 100;
    }

    // Cálculos
    const montoImpuesto = ingreso * tasa;
    const montoNeto = ingreso - montoImpuesto;

    // Actualizar Interfaz
    document.getElementById('timeStamp').innerText = "ID: " + Math.random().toString(36).substr(2, 9).toUpperCase() + " | " + timeStamp;
    document.getElementById('valBruto').innerText = "S/ " + ingreso.toLocaleString('es-PE', {minimumFractionDigits: 2});
    document.getElementById('valTasa').innerText = (tasa * 100);
    document.getElementById('valImpuesto').innerText = "S/ " + montoImpuesto.toLocaleString('es-PE', {minimumFractionDigits: 2});
    document.getElementById('valNeto').innerText = "S/ " + montoNeto.toLocaleString('es-PE', {minimumFractionDigits: 2});
    document.getElementById('msgTramo').innerText = tramoMsg;

    // Animación de Barra
    document.getElementById('resultPanel').classList.remove('hidden');
    setTimeout(() => {
        document.getElementById('meterProgress').style.width = meterWidth + "%";
        // Color dinámico de barra
        const color = meterWidth <= 10 ? '#10b981' : (meterWidth <= 65 ? '#2563eb' : '#ef4444');
        document.getElementById('meterProgress').style.background = color;
    }, 100);
});