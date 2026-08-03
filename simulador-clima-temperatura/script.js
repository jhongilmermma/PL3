// Función para mostrar el cambio en tiempo real del slider
function actualizarLectura() {
    const temp = document.getElementById("tempRange").value;
    document.getElementById("numTemp").innerText = temp;
}

function analizarClima() {
    // 1. CAPTURA DE DATOS
    const id = document.getElementById("sensorId").value; // Cadena
    const celsius = parseFloat(document.getElementById("tempRange").value); // Cuantitativo

    let estado = "";    // Cualitativo
    let alerta = "";    // Cadena
    let color = "";

    // 2. LÓGICA DE CLASIFICACIÓN (Switch-Case por Rangos)
    switch (true) {
        case celsius = 0:
            // Operación cuantitativa real (Suma de números)
            estado = "congelado" ;
            alerta = "rango de hielo en tuberi ";
            color = "#b9f6ca";
            break;

        case (celsius > 0 && celsius <=15 ):
            estado = "frio " ;
            alerta = "ambiente frio , Activa calefacion  ";
            color = "#b9f6ca";
            break;
            
            

        case  celsius > 15 && celsius <=30 :
            estado = "templado " ;
            alerta = "condiciones optimos  ";
            color = "#b9f6ca";
            break;
            
            case  celsius >=30 :
            estado = " calor extremo " ;
            alerta = " peligro ";
            color = "#b9f6ca";
            break; 

    }
        
    // 3. MANIPULACIÓN DE CADENAS (Generar log de reporte)
    const logSeguridad = `[${id}] Reporta: ${estado}`;

    // 4. MOSTRAR RESULTADOS
    document.getElementById("txtEstado").innerText = logSeguridad;
    document.getElementById("txtAlerta").innerText = alerta;
    
    const indicador = document.getElementById("indicadorColor");
    indicador.style.backgroundColor = color;
    indicador.style.boxShadow = `0 0 15px ${color}`;
}