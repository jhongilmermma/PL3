const btnCrear = document.getElementById("btnCrear");
const btnInversa = document.getElementById("btnInversa");
const btnLimpiar = document.getElementById("btnLimpiar");

btnCrear.addEventListener("click", crearMatriz);
btnInversa.addEventListener("click", calcularInversa);
btnLimpiar.addEventListener("click", limpiar);

function crearMatriz(){
    const n = parseInt(document.getElementById("orden").value, 10);

    if(Number.isNaN(n) || n < 2){
        mostrarMensaje("Ingrese un orden válido (2 o más).", true);
        return;
    }

    const container = document.getElementById("matriz-container");
    container.innerHTML = "";

    const grid = document.createElement("div");
    grid.className = "matrix-grid";
    grid.style.gridTemplateColumns = `repeat(${n}, 1fr)`;

    for(let i = 0; i < n; i++){
        for(let j = 0; j < n; j++){
            const input = document.createElement("input");
            input.type = "number";
            input.step = "any";
            input.value = 0;
            input.id = `m_${i}_${j}`;
            grid.appendChild(input);
        }
    }

    container.appendChild(grid);
    btnInversa.style.display = "inline-block";
    btnLimpiar.style.display = "inline-block";
    mostrarMensaje("");
}

function limpiar(){
    document.getElementById("matriz-container").innerHTML = "";
    document.getElementById("resultado").innerHTML = "";
    btnInversa.style.display = "none";
    btnLimpiar.style.display = "none";
}

function mostrarMensaje(text, isError){
    if(!text){
        document.getElementById("resultado").innerHTML = "";
        return;
    }

    const className = isError ? "error-message" : "info-message";
    document.getElementById("resultado").innerHTML = `<h2 class=\"${className}\">${text}</h2>`;
}









function intercambiarFilas(matriz, filaA, filaB){
    const temp = matriz[filaA];
    matriz[filaA] = matriz[filaB];
    matriz[filaB] = temp;
}

function calcularInversa(){
    const n = parseInt(document.getElementById("orden").value, 10);

    if(Number.isNaN(n) || n < 2){
        mostrarMensaje("Ingrese un orden válido antes de calcular.", true);
        return;
    }

    const matriz = [];
    for(let i = 0; i < n; i++){
        matriz[i] = [];
        for(let j = 0; j < n; j++){
            const field = document.getElementById(`m_${i}_${j}`);
            const value = parseFloat(field.value);
            if(Number.isNaN(value)){
                mostrarMensaje("Todos los valores deben ser números.", true);
                return;
            }
            matriz[i][j] = value;
        }
    }

    const identidad = [];
    for(let i = 0; i < n; i++){
        identidad[i] = [];
        for(let j = 0; j < n; j++){
            identidad[i][j] = i === j ? 1 : 0;
        }
    }

    const EPS = 1e-12;
    for(let i = 0; i < n; i++){
        let pivotRow = i;
        let maxAbs = Math.abs(matriz[i][i]);

        for(let r = i + 1; r < n; r++){
            const value = Math.abs(matriz[r][i]);
            if(value > maxAbs){
                maxAbs = value;
                pivotRow = r;
            }
        }

        if(maxAbs < EPS){
            mostrarMensaje("La matriz no tiene inversa.", true);
            return;
        }

        if(pivotRow !== i){
            intercambiarFilas(matriz, i, pivotRow);
            intercambiarFilas(identidad, i, pivotRow);
        }

        const pivote = matriz[i][i];
        for(let j = 0; j < n; j++){
            matriz[i][j] /= pivote;
            identidad[i][j] /= pivote;
        }

        for(let k = 0; k < n; k++){
            if(k === i) continue;
            const factor = matriz[k][i];
            for(let j = 0; j < n; j++){
                matriz[k][j] -= factor * matriz[i][j];
                identidad[k][j] -= factor * identidad[i][j];
            }
        }
    }

    let tabla = `<h2>Matriz Inversa</h2><table>`;
    for(let i = 0; i < n; i++){
        tabla += "<tr>";
        for(let j = 0; j < n; j++){
            tabla += `<td>${identidad[i][j].toFixed(2)}</td>`;
        }
        tabla += "</tr>";
    }
    tabla += "</table>";

    document.getElementById("resultado").innerHTML = tabla;
}