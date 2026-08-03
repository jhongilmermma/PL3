function crearSerpiente() {

    let n = parseInt(document.getElementById("orden").value);

    let matriz = [];

    let numero = 1;

    for (let i = 0; i < n; i++) {

        matriz[i] = [];

        // Filas pares → izquierda a derecha
        if (i % 2 == 0) {

            for (let j = 0; j < n; j++) {

                matriz[i][j] = numero;
                numero++;
            }

        }
        // Filas impares → derecha a izquierda
        else {

            for (let j = n - 1; j >= 0; j--) {

                matriz[i][j] = numero;
                numero++;
            }
        }
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

    document.getElementById("matriz").innerHTML = tabla;
}