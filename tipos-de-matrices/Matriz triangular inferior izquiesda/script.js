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



            // Triángulo inferior izquierdo
            if(i >= j){

                // Agregar 1
                tabla += `
                    <td class="activo">1</td>
                `;

            }else{

                // Agregar 0
                tabla += `
                    <td class="inactivo">0</td>
                `;
            }
        }

        // Cerrar fila
        tabla += "</tr>";
    }

    // Cerrar tabla
    tabla += "</table>";



    // Mostrar matriz
    document.getElementById("matriz").innerHTML = tabla;
}