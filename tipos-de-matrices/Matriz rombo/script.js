function crearRombo(){

    let n = parseInt(
        document.getElementById("orden").value
    );

    if(isNaN(n) || n <= 0){

        alert("Ingrese un número válido");

        return;
    }

    let tabla = "<table>";

    let centro = Math.floor(n / 2);

    for(let i = 0; i < n; i++){

        tabla += "<tr>";

        for(let j = 0; j < n; j++){

            // Distancia al centro
            let distancia =
                Math.abs(i - centro) +
                Math.abs(j - centro);

            // Forma rombo
            if(distancia <= centro){

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

    document.getElementById("matriz").innerHTML = tabla;
}