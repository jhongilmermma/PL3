function analizar(){

    let sexo = document.getElementById("sexo").value;
    let peso = parseFloat(document.getElementById("peso").value);
    let altura = parseFloat(document.getElementById("altura").value);
    let cintura = parseFloat(document.getElementById("cintura").value);
    
    if(!peso || !altura || !cintura){
    alert("Completa todos los campos");
    return;
    }
    
    let metros = altura / 100;
    let imc = peso / (metros * metros);
    
    let grasa;
    
    if(sexo == "hombre"){
    grasa = (1.20 * imc) - 10;
    }else{
    grasa = (1.20 * imc);
    }
    
    let estado = "";
    
    if(imc < 18.5){
    estado = "Bajo peso";
    }
    else if(imc < 25){
    estado = "Normal";
    }
    else if(imc < 30){
    estado = "Sobrepeso";
    }
    else if(imc < 35){
    estado = "Obesidad I";
    }
    else if(imc < 40){
    estado = "Obesidad II";
    }
    else{
    estado = "Obesidad III";
    }
    
    let riesgo = "";
    
    if(sexo == "hombre"){
    if(cintura < 94){
    riesgo = "Bajo";
    }
    else if(cintura <= 101){
    riesgo = "Moderado";
    }
    else{
    riesgo = "Alto";
    }
    }else{
    if(cintura < 80){
    riesgo = "Bajo";
    }
    else if(cintura <= 87){
    riesgo = "Moderado";
    }
    else{
    riesgo = "Alto";
    }
    }
    
    document.getElementById("resultado").style.display="block";
    
    document.getElementById("titulo").innerText="Resultado";
    document.getElementById("imc").innerText="IMC: " + imc.toFixed(1) + " (" + estado + ")";
    document.getElementById("grasa").innerText="Grasa corporal estimada: " + grasa.toFixed(1) + "%";
    document.getElementById("abdomen").innerText="Riesgo abdominal: " + riesgo;
    
    document.getElementById("mensaje").innerText="Controla alimentación, actividad física y revisiones médicas.";
    
    }