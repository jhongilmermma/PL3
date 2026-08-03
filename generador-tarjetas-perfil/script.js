function generarPerfil() {
    // 1. CAPTURA DE CADENAS (Strings)
    // El .value de un input siempre devuelve una cadena de texto
    const nombre = document.getElementById("inputNombre").value;
    const paterno = document.getElementById("inputPaterno").value;
    const materno = document.getElementById("inputMaterno").value;

    const anioTexto = document.getElementById("inputAnio").value;
    const estado = document.getElementById("inputEstado").value; // Cualitativo Nominal

    // 2. PROCESAMIENTO CUANTITATIVO (Números)
    // Convertimos la cadena de texto a número para poder restar
    const anioActual = new Date().getFullYear();
    const edad = anioActual - Number(anioTexto);

    // 3. VALIDACIÓN Y SALIDA
    if (nombre === "" || paterno === "" || materno === "" || anioTexto === "") {
        alert("Por favor, completa todos los campos.");
        return;
    }

    // Manipulación de Cadenas: Concatenación
    document.getElementById("displayNombre").innerText = nombre.toUpperCase();
    document.getElementById("displayPaterno").innerText = paterno.toUpperCase();
    document.getElementById("displayMaterno").innerText = materno.toUpperCase();
    document.getElementById("displayEdad").innerText = "Edad: " + edad + " años";
    document.getElementById("displayEstado").innerText = "Estado actual: " + estado;

    // Lógica Cualitativa para cambiar el color según el estado
    const card = document.getElementById("card");
    if (estado === "Disponible") {
        card.style.borderLeftColor = "green";
    } else if (estado === "Ocupado") {
        card.style.borderLeftColor = "red";
    } else {
        card.style.borderLeftColor = "gray";
    }
}