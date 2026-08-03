const residueDatabase = {
    "papel": { color: "bg-blue", label: "Azul", icon: "📄", note: "Asegúrate de que no tenga restos de comida o grasa." },
    "carton": { color: "bg-blue", label: "Azul", icon: "📦", note: "Aplasta las cajas para ahorrar espacio." },
    "botella": { color: "bg-yellow", label: "Amarillo", icon: "🧴", note: "Enjuaga brevemente antes de tirar." },
    "plastico": { color: "bg-yellow", label: "Amarillo", icon: "🥤", note: "Incluye envases, bolsas y envoltorios limpios." },
    "lata": { color: "bg-yellow", label: "Amarillo", icon: "🥫", note: "Latas de refresco o conservas metálicas." },
    "vidrio": { color: "bg-green", label: "Verde", icon: "🍾", note: "Solo botellas y frascos. Sin tapas." },
    "fruta": { color: "bg-brown", label: "Marrón", icon: "🍎", note: "Residuo orgánico. Ideal para compost." },
    "comida": { color: "bg-brown", label: "Marrón", icon: "🍲", note: "Restos de alimentos procesados o crudos." },
    "organico": { color: "bg-brown", label: "Marrón", icon: "🍃", note: "Cáscaras, semillas y restos vegetales." },
    "pila": { color: "bg-grey", label: "Especial", icon: "🔋", note: "¡Peligroso! Llevar a un punto de acopio especializado." }
};

function classify() {
    const input = document.getElementById('residueInput').value.toLowerCase().trim();
    const card = document.getElementById('resultCard');
    
    // Buscar coincidencia en la base de datos
    let found = false;
    for (let key in residueDatabase) {
        if (input.includes(key) && input !== "") {
            const data = residueDatabase[key];
            showResult(key.toUpperCase(), data);
            found = true;
            break;
        }
    }

    if (!found) {
        card.classList.add('hidden');
    }
}

function showResult(name, data) {
    const card = document.getElementById('resultCard');
    document.getElementById('resName').innerText = name;
    document.getElementById('resIcon').innerText = data.icon;
    document.getElementById('resInstructions').innerText = data.note;
    
    const badge = document.getElementById('resColor');
    badge.innerText = `Contenedor ${data.label}`;
    badge.className = `badge ${data.color}`; // Cambia el color de fondo dinámicamente
    
    card.classList.remove('hidden');
}