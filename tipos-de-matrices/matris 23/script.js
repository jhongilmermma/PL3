function generarMatrices() {

    // Leer filas y columnas
    const rows = document.getElementById('rows').value;
    const cols = document.getElementById('cols').value;



    // Crear matriz A
    renderMatrix(
        'matrix1-container',
        'm1',
        rows,
        cols
    );



    // Crear matriz B
    renderMatrix(
        'matrix2-container',
        'm2',
        rows,
        cols
    );



    // Limpiar resultado
    document.getElementById(
        'result-container'
    ).innerHTML = '';



    // Mostrar botón sumar
    document.getElementById(
        'btn-sumar'
    ).style.display = 'inline-block';
}






function renderMatrix(
    containerId,
    prefix,
    rows,
    cols
) {

    // Buscar contenedor
    const container = document.getElementById(
        containerId
    );



    // Limpiar contenido
    container.innerHTML = '';



    // Crear grid
    const grid = document.createElement('div');

    grid.className = 'matrix-grid';



    // Crear columnas CSS
    grid.style.gridTemplateColumns =
        `repeat(${cols}, 1fr)`;


    
    // Crear filas y columnas
    for (let i = 0; i < rows; i++) {

        for (let j = 0; j < cols; j++) {

            // Crear input
            const input = document.createElement('input');



            // Tipo número
            input.type = 'number';



            // Crear id único
            input.id = `${prefix}_${i}_${j}`;



            // Valor inicial
            input.value = 0;



            // Agregar input
            grid.appendChild(input);
        }
    }



    // Agregar grid al contenedor
    container.appendChild(grid);
}







function sumarMatrices() {

    // Leer filas y columnas
    const rows = document.getElementById('rows').value;
    const cols = document.getElementById('cols').value;



    // Crear tabla resultado
    let tabla = `
        <h2 class="result-title">
            Resultado
        </h2>

        <table>
    `;



    // Recorrer filas
    for(let i = 0; i < rows; i++){

        tabla += "<tr>";



        // Recorrer columnas
        for(let j = 0; j < cols; j++){

            // Leer matriz A
            let a = parseInt(
                document.getElementById(
                    `m1_${i}_${j}`
                ).value
            );



            // Leer matriz B
            let b = parseInt(
                document.getElementById(
                    `m2_${i}_${j}`
                ).value
            );



            // Sumar
            let suma = a + b;



            // Agregar celda
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
        'result-container'
    ).innerHTML = tabla;
}