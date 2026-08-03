document.getElementById('calcForm').addEventListener('submit', function(e) {
    e.preventDefault();

    // --- PLIEGO TARIFARIO OFICIAL (REFERENCIAL BT5B) ---
    const TARIFA_UNITARIA = 0.7942; 
    const CARGO_FIJO = 4.92;
    const ALUMBRADO = 6.15;
    const MANTENIMIENTO = 1.10;
    const LEY_FISE = 0.80;
    const IGV_RATE = 0.18;

    // Obtener inputs
    const watts = parseFloat(document.getElementById('watts').value);
    const hours = parseFloat(document.getElementById('hours').value);
    const dias = 30;

    // Cálculos de ingeniería
    const kwhDiario = (watts * hours) / 1000;
    const kwhMensual = kwhDiario * dias;
    
    const costoEnergia = kwhMensual * TARIFA_UNITARIA;
    const subtotal = costoEnergia + CARGO_FIJO + ALUMBRADO + MANTENIMIENTO + LEY_FISE;
    const igv = subtotal * IGV_RATE;
    const totalPagar = subtotal + igv;

    // Actualizar Recibo
    document.getElementById('fechaRecibo').innerText = new Date().toLocaleDateString();
    document.getElementById('resKwh').innerText = kwhMensual.toFixed(2);
    document.getElementById('resSub').innerText = subtotal.toFixed(2);
    document.getElementById('resIgv').innerText = igv.toFixed(2);
    document.getElementById('resTotal').innerText = totalPagar.toFixed(2);

    // Actualizar Gráfico
    const barCurrent = document.getElementById('barCurrent');
    barCurrent.style.height = Math.min(kwhMensual, 100) + "%"; // Limitar altura visual
    barCurrent.querySelector('span').innerText = kwhMensual.toFixed(0);

    // Lógica IF/ELSE Profesional
    const msg = document.getElementById('msgEficiencia');
    if (kwhDiario < 1.2) {
        msg.innerText = "CLASE A: CONSUMO EFICIENTE";
        msg.style.color = "#166534";
    } else if (kwhDiario <= 3.5) {
        msg.innerText = "CLASE B: CONSUMO MODERADO";
        msg.style.color = "#854d0e";
    } else {
        msg.innerText = "CLASE C: CONSUMO EXCESIVO";
        msg.style.color = "#991b1b";
    }

    // Mostrar el ticket
    document.getElementById('ticket').classList.remove('hidden');
});