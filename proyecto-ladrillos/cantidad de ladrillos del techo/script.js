function calcularTecho() {
    // Dimensiones del ladrillo de techo estándar de tu pizarra
    const A = 0.30; 
    const L = 0.30;

    // Obtener valores del formulario
    const largo = parseFloat(document.getElementById('largoTecho').value);
    const ancho = parseFloat(document.getElementById('anchoTecho').value);
    const vigueta = parseFloat(document.getElementById('vigueta').value);

    // Validación simple
    if (!largo || !ancho || !vigueta) {
        alert("Por favor, completa todos los campos.");
        return;
    }

    // 1. Calcular el área total del techo
    const areaTotal = largo * ancho;

    // 2. Calcular cantidad de ladrillos por metro cuadrado
    // Fórmula de la pizarra: 1 / ((AnchoLadrillo + Vigueta) * LargoLadrillo)
    const ladrillosPorM2 = 1 / ((A + vigueta) * L);

    // 3. Cantidad total con 5% de desperdicio
    let total = areaTotal * ladrillosPorM2 * 1.05;

    // Mostrar resultados
    document.getElementById('area-text').innerText = areaTotal.toFixed(2);
    document.getElementById('total-text').innerText = Math.ceil(total);
    document.getElementById('resultado').style.display = 'block';
}