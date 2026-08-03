function crearCaracol() {

    let n = parseInt(document.getElementById("orden").value);

    if (n <= 0 || isNaN(n)) {
        alert("Ingrese un número válido");
        return;
    }

    // Evita congelar el navegador
    if (n > 100) {
        document.getElementById("info").innerHTML =
            "La matriz es demasiado grande para mostrar completa.<br>" +
            "Solo se generará información.";

        document.getElementById("matriz").innerHTML =
            `
            <h2>
                Matriz Caracol de ${n} x ${n} creada correctamente
            </h2>

            <p>Total de elementos: ${n * n}</p>
            `;

        return;
    }

    let matriz = Array.from(
        { length: n },
        () => Array(n).fill(0)
    );

    let inicioFila = 0;
    let finFila = n - 1;

    let inicioColumna = 0;
    let finColumna = n - 1;

    let numero = 1;

    while (numero <= n * n) {

        // izquierda -> derecha
        for (let i = inicioColumna; i <= finColumna; i++) {
            matriz[inicioFila][i] = numero++;
        }

        inicioFila++;

        // arriba -> abajo
        for (let i = inicioFila; i <= finFila; i++) {
            matriz[i][finColumna] = numero++;
        }

        finColumna--;

        // derecha -> izquierda
        for (let i = finColumna; i >= inicioColumna; i--) {
            matriz[finFila][i] = numero++;
        }

        finFila--;

        // abajo -> arriba
        for (let i = finFila; i >= inicioFila; i--) {
            matriz[i][inicioColumna] = numero++;
        }

        inicioColumna++;
    }

    let tabla = "<table>";

    for (let i = 0; i < n; i++) {

        tabla += "<tr>";

        for (let j = 0; j < n; j++) {

            tabla += `
                <td>${matriz[i][j]}</td>
            `;
        }

        tabla += "</tr>";
    }

    tabla += "</table>";

    document.getElementById("info").innerHTML =
        `Matriz ${n} x ${n} generada correctamente`;

    document.getElementById("matriz").innerHTML = tabla;
}