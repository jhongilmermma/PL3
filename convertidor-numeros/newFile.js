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
