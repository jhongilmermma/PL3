function convertirConCase() {
    // 1. DATO CUANTITATIVO
    const numero = parseInt(document.getElementById("numInput").value);
    const output = document.getElementById("output");

    if (isNaN(numero) || numero < 0 || numero > 1000) {
        output.innerText = "Error: Solo de 0 a 100";
        return;
    }

    // 2. CADENAS (Strings para construir el resultado)
    let palabraFinal = "";

    // 3. USO DE CASE (Para datos cualitativos según el valor)
    if (numero >= 0 && numero <= 15) {
        // Casos especiales únicos del 0 al 15
        switch (numero) {
            case 0: palabraFinal = "cero"; break;
            case 1: palabraFinal = "uno"; break;
            case 10: palabraFinal = "diez"; break;
            case 11: palabraFinal = "once"; break;
            case 12: palabraFinal = "doce"; break;
            case 13: palabraFinal = "trece"; break;
            case 14: palabraFinal = "catorce"; break;
            case 15: palabraFinal = "quince"; break;
            default: /* Maneja 2-9 si fuera necesario */ break;
        }
    } 
    
    // Si no se resolvió en el switch anterior (números mayores a 15)
    if (palabraFinal === "") {
        if (numero === 1000) {
            palabraFinal = "mil";
        } else {
            let centena  = Math.floor((numero%100)/10);
            let decena = Math.floor(numero / 10);
            let unidad = numero % 10;
            let strcentena = "";
            let strDecena = "";
            let strUnidad = "";

            // Switch para la decena (Categoría cualitativa)
            switch (centena) {
                case 1: strcentena = "ciento"; break;
                case 2: strcentena = (unidad === 0) ? "docientos" : "veinti"; break;
                case 3: strcentena = "trecientos "; break;
                case 4: strcentena = "cuatrocientos"; break;
                case 5: strcentena = "quinientos"; break;
                case 6: strcentena = "seiscientos"; break;
                case 7: strcentena = "setecientos"; break;
                case 8: strcentena = "ochocientos "; break;
                case 9: strcentena = "novecientos"; break;
            }


             // Switch para la decena (Categoría cualitativa)
            switch (decena) {
                case 1: strDecena = "dieci"; break;
                case 2: strDecena = (unidad === 0) ? "veinte" : "veinti"; break;
                case 3: strDecena = "treinta"; break;
                case 4: strDecena = "cuarenta"; break;
                case 5: strDecena = "cincuenta"; break;
                case 6: strDecena = "sesenta"; break;
                case 7: strDecena = "setenta"; break;
                case 8: strDecena = "ochenta"; break;
                case 9: strDecena = "noventa"; break;
            }

            // Switch para la unidad (Categoría cualitativa)
            switch (unidad) {
                case 1: strUnidad = "uno"; break;
                case 2: strUnidad = "dos"; break;
                case 3: strUnidad = "tres"; break;
                case 4: strUnidad = "cuatro"; break;
                case 5: strUnidad = "cinco"; break;
                case 6: strUnidad = "seis"; break;
                case 7: strUnidad = "siete"; break;
                case 8: strUnidad = "ocho"; break;
                case 9: strUnidad = "nueve"; break;
            }

            // Unir las CADENAS
            if ( centena >= 4 && decena >= 3 && unidad > 0) {
                palabraFinal =  strcentena +  strDecena + " y " + strUnidad;
            } else {
                palabraFinal = strcentena + strDecena + strUnidad;
            }
        }
    }

    // Mostrar el resultado final
    output.innerText = palabraFinal;
}