function crearMatriz() {

    let n = document.getElementById("filas").value;
    let m = document.getElementById("columnas").value;

    let contenedor = document.getElementById("matriz");

    contenedor.innerHTML = "";

    let tabla = "<table>";

    for (let i = 0; i < n; i++) {

        tabla += "<tr>";

        for (let j = 0; j < m; j++) {

            tabla += `
                <td>
                    <input 
                        type="number" 
                        id="c${i}${j}" 
                        value="0"
                    >
                </td>
            `;
        }

        tabla += "</tr>";
    }

    tabla += "</table>";

    contenedor.innerHTML = tabla;
}

function mostrarMatrices() {

    let n = document.getElementById("filas").value;
    let m = document.getElementById("columnas").value;

    let matriz = [];
    let traspuesta = [];

    // Leer matriz
    for (let i = 0; i < n; i++) {

        matriz[i] = [];

        for (let j = 0; j < m; j++) {

            matriz[i][j] = parseInt(
                document.getElementById(`c${i}${j}`).value
            );
        }
    }

    // Crear traspuesta
    for (let j = 0; j < m; j++) {

        traspuesta[j] = [];

        for (let i = 0; i < n; i++) {

            traspuesta[j][i] = matriz[i][j];
        }
    }

    // Mostrar matriz original
    let salida = "<h2>Matriz Original</h2>";

    for (let i = 0; i < n; i++) {

        for (let j = 0; j < m; j++) {

            salida += matriz[i][j] + " ";
        }

        salida += "<br>";
    }

    document.getElementById("resultado").innerHTML = salida;

    // Mostrar matriz traspuesta
    let salidaTraspuesta = "<h2>Matriz Traspuesta</h2>";

    for (let i = 0; i < m; i++) {

        for (let j = 0; j < n; j++) {

            salidaTraspuesta += traspuesta[i][j] + " ";
        }

        salidaTraspuesta += "<br>";
    }

    document.getElementById("traspuesta").innerHTML =
        salidaTraspuesta;
}