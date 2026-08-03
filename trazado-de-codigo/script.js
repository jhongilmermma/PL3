let suma = 0;

for (let i = 1; i <= 4; i++) {
    if (i === 2) {
        continue;
    }
    suma += i;
}

console.log(suma);
