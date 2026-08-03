function crearMatriz(){

    // Leer N
    let n = parseInt(
        document.getElementById("orden").value
    );



    // Validar número
    if(isNaN(n) || n <= 0){

        alert("Ingrese un número válido");

        return;
    }



    // Crear tabla
    let tabla = "<table>";



    // Crear filas
    for(let i = 0; i < n; i++){

        tabla += "<tr>";



        // Crear columnas
        for(let j = 0; j < n; j++){



            // Triángulo superior izquierdo
            if(i + j <= n - 1){

                tabla += `
                    <td class="activo">1</td>
                `;

            }else{

                tabla += `
                    <td class="inactivo">0</td>
                `;
            }
        }

        tabla += "</tr>";
    }

    tabla += "</table>";



    // Mostrar matriz
    document.getElementById("resultado").innerHTML = tabla;
}