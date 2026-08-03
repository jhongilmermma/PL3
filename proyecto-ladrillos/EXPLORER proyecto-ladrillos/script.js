function calcular() {
    let alto = parseFloat(document.getElementById("alto").value);
    let ancho = parseFloat(document.getElementById("ancho").value);
    let descuento = parseFloat(document.getElementById("descuento").value) || 0;
    let tipo = document.getElementById("tipo").value;

    if (isNaN(alto) || isNaN(ancho)) {
        document.getElementById("resultado").innerText = "Ingrese valores válidos";
        return;
    }

    let area = alto * ancho;
    let areaReal = area - descuento;

    if (areaReal <= 0) {
        document.getElementById("resultado").innerText = "Área no válida";
        return;
    }

    let ladrillosPorM2;

    if (tipo === "soga") {
        ladrillosPorM2 = 40; // ✔ corregido
    } else if (tipo === "cabeza") {
        ladrillosPorM2 = 45;
    } else if (tipo === "canto") {
        ladrillosPorM2 = 60;
    }

    let total = Math.ceil(areaReal * ladrillosPorM2);

    document.getElementById("resultado").innerText =
        "Tipo: " + tipo.toUpperCase() + "\n" +
        "Área: " + areaReal.toFixed(2) + " m²\n" +
        "Ladrillos necesarios: " + total;
}