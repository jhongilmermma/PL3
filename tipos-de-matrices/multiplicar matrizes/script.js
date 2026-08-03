function generarMatrices(){

    // Leer tamaños
    let filasA = parseInt(
        document.getElementById("filasA").value
    );

    let columnasA = parseInt(
        document.getElementById("columnasA").value
    );

    let columnasB = parseInt(
        document.getElementById("columnasB").value
    );



    // Validar
    if(
        isNaN(filasA) ||
        isNaN(columnasA) ||
        isNaN(columnasB)
    ){

        alert("Ingrese valores válidos");

        return;
    }



    // Crear matriz A
    crearGrid(
        "matrizA",
        "A",
        filasA,
        columnasA
    );



    // Crear matriz B
    crearGrid(
        "matrizB",
        "B",
        columnasA,
        columnasB
    );



    // Mostrar botón
    document.getElementById(
        "btnMultiplicar"
    ).style.display = "inline-block";



    // Limpiar resultado
    document.getElementById(
        "resultado"
    ).innerHTML = "";
}







function crearGrid(
    containerId,
    prefix,
    rows,
    cols
){

    // Buscar contenedor
    let container =
        document.getElementById(containerId);

    container.innerHTML = "";



    // Crear grid
    let grid = document.createElement("div");

    grid.className = "matrix-grid";



    // Crear columnas CSS
    grid.style.gridTemplateColumns =
        `repeat(${cols}, 1fr)`;



    // Crear inputs
    for(let i = 0; i < rows; i++){

        for(let j = 0; j < cols; j++){

            let input =
                document.createElement("input");

            input.type = "number";

            input.value = 0;

            input.id = `${prefix}_${i}_${j}`;

            grid.appendChild(input);
        }
    }



    // Mostrar grid
    container.appendChild(grid);
}








function multiplicarMatrices(){

    // Leer tamaños
    let filasA = parseInt(
        document.getElementById("filasA").value
    );

    let columnasA = parseInt(
        document.getElementById("columnasA").value
    );

    let columnasB = parseInt(
        document.getElementById("columnasB").value
    );



    // Crear tabla resultado
    let tabla = `
        <h2>Resultado</h2>
        <table>
    `;



    // Recorrer filas de A
    for(let i = 0; i < filasA; i++){

        tabla += "<tr>";



        // Recorrer columnas de B
        for(let j = 0; j < columnasB; j++){

            let suma = 0;



            // Multiplicación
            for(let k = 0; k < columnasA; k++){

                let a = parseInt(
                    document.getElementById(
                        `A_${i}_${k}`
                    ).value
                );

                let b = parseInt(
                    document.getElementById(
                        `B_${k}_${j}`
                    ).value
                );

                suma += a * b;
            }



            // Agregar resultado
            tabla += `
                <td>${suma}</td>
            `;
        }

        tabla += "</tr>";
    }



    // Cerrar tabla
    tabla += "</table>";



    // Mostrar resultado
    document.getElementById(
        "resultado"
    ).innerHTML = tabla;
}