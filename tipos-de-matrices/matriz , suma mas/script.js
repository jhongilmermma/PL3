function crearMatriz() {

    let m = document.getElementById("filas").value;
    let n = document.getElementById("columnas").value;

    let contenedor = document.getElementById("matriz");

    contenedor.innerHTML = "";

    let tabla = "<table>";

    for (let i = 0; i < m; i++) {

        tabla += "<tr>";

        for (let j = 0; j < n; j++) {

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

function leerMatriz() {

    let m = document.getElementById("filas").value;
    let n = document.getElementById("columnas").value;

    let matriz = [];

    let suma = 0;

    for (let i = 0; i < m; i++) {

        matriz[i] = [];

        for (let j = 0; j < n; j++) {

            matriz[i][j] = parseInt(
                document.getElementById(`c${i}${j}`).value
            );

            suma += matriz[i][j];
        }
    }

    let salida = "Matriz ingresada:<br><br>";

    for (let i = 0; i < m; i++) {

        for (let j = 0; j < n; j++) {

            salida += matriz[i][j] + " ";
        }

        salida += "<br>";
    }

    document.getElementById("resultado").innerHTML = salida;

    document.getElementById("suma").innerHTML =
        "Suma total de la matriz = " + suma;

    console.log(matriz);
}