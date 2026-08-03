function crearMatrizL(){

    // Leer N
    let n = parseInt(
        document.getElementById("orden").value
    );
    if(isNaN(n) || n <= 0){
        alert("Ingrese un número válido");

        return;
    }
    let tabla = "<table>";
    // Crear filas
    for(let i = 0; i < n; i++){

        tabla += "<tr>";
        // Crear columnas
        for(let j = 0; j < n; j++){

            if(j == 0 || i == n - 1){

                // Agregar 1
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

    // Cerrar tabla
    tabla += "</table>";
    document.getElementById("matriz").innerHTML = tabla;
}