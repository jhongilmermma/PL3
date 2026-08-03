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
    let mensaje = "";
    
    /* Clasificación IMC con dos condiciones */
    
    if(imc >= 0 && imc < 18.5){
    estado = "Bajo Peso";
    mensaje = "Tu peso está por debajo de lo recomendable.";
    }
    else if(imc >= 18.5 && imc <= 24.9){
    estado = "Normal";
    mensaje = "Tienes un peso saludable.";
    }
    else if(imc >= 25 && imc <= 29.9){
    estado = "Sobrepeso";
    mensaje = "Debes mejorar hábitos alimenticios.";
    }
    else if(imc >= 30 && imc <= 34.9){
    estado = "Obesidad Grado I";
    mensaje = "Existe riesgo moderado para la salud.";
    }
    else if(imc >= 35 && imc <= 39.9){
    estado = "Obesidad Grado II";
    mensaje = "Existe riesgo alto para la salud.";
    }
    else if(imc >= 40){
    estado = "Obesidad Grado III";
    mensaje = "Riesgo muy alto. Consulta médica.";
    }
    
    let riesgo = "";
    
    /* Riesgo abdominal */
    
    if(sexo == "hombre"){
    
    if(cintura >= 0 && cintura < 94){
    riesgo = "Bajo";
    }
    else if(cintura >= 94 && cintura <= 101){
    riesgo = "Moderado";
    }
    else if(cintura >= 102){
    riesgo = "Alto";
    }
    
    }else{
    
    if(cintura >= 0 && cintura < 80){
    riesgo = "Bajo";
    }
    else if(cintura >= 80 && cintura <= 87){
    riesgo = "Moderado";
    }
    else if(cintura >= 88){
    riesgo = "Alto";
    }
    
    }
    
    document.getElementById("resultado").style.display="block";
    
    document.getElementById("titulo").innerText="Resultado";
    document.getElementById("imc").innerText="IMC: " + imc.toFixed(1) + " (" + estado + ")";
    document.getElementById("grasa").innerText="Grasa corporal estimada: " + grasa.toFixed(1) + "%";
    document.getElementById("abdomen").innerText="Riesgo abdominal: " + riesgo;
    document.getElementById("mensaje").innerText=mensaje;
    
    }