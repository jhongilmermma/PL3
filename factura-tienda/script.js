// Evento principal
document.getElementById("btnCalcular").addEventListener("click", generarFactura);

// Función principal
function generarFactura() {
    const datos = obtenerDatos();

    if (!validarDatos(datos)) return;

    const calculo = calcularTotales(datos);
    mostrarFactura(datos, calculo);
}

// Obtener datos
function obtenerDatos() {
    return {
        cliente: document.getElementById("cliente").value.trim(),
        producto: document.getElementById("producto").value.trim(),
        precio: parseFloat(document.getElementById("precio").value),
        cantidad: parseInt(document.getElementById("cantidad").value),
        tipo: document.getElementById("tipoCliente").value
    };
}

// Validación
function validarDatos({cliente, producto, precio, cantidad}) {
    if (!cliente || !producto) {
        alert("Complete los campos de texto");
        return false;
    }

    if (isNaN(precio) || precio <= 0) {
        alert("Precio inválido");
        return false;
    }

    if (isNaN(cantidad) || cantidad <= 0) {
        alert("Cantidad inválida");
        return false;
    }

    return true;
}

// Lógica de negocio
function calcularTotales({precio, cantidad, tipo}) {
    const subtotal = precio * cantidad;

    // DESCUENTO (switch correcto)
    let descuento = 0;

    switch (tipo) {
        case "regular":
            descuento = 0.05;
            break;
        case "vip":
            descuento = 0.10;
            break;
        case "mayorista":
            descuento = 0.15;
            break;
        default:
            descuento = 0;
    }

    const montoDescuento = subtotal * descuento;

    // IGV 
    const IGV = 0.18;
    const montoIGV = (subtotal - montoDescuento) * IGV;

    const total = subtotal - montoDescuento + montoIGV;

    return { subtotal, descuento, montoDescuento, montoIGV, total };
}

// Formato moneda
function formatearMoneda(valor) {
    return `S/ ${valor.toFixed(2)}`;
}

// Mostrar resultado
function mostrarFactura(datos, calc) {
    const contenedor = document.getElementById("resultado");

    contenedor.innerHTML = `
        <div class="factura">
            <h2>Factura</h2>
            <p><strong>Cliente:</strong> ${datos.cliente}</p>
            <p><strong>Producto:</strong> ${datos.producto}</p>
            <p><strong>Cantidad:</strong> ${datos.cantidad}</p>
            <p><strong>Precio:</strong> ${formatearMoneda(datos.precio)}</p>
            <hr>
            <p>Subtotal: ${formatearMoneda(calc.subtotal)}</p>
            <p>Descuento (${calc.descuento * 100}%): ${formatearMoneda(calc.montoDescuento)}</p>
            <p>IGV (18%): ${formatearMoneda(calc.montoIGV)}</p>
            <hr>
            <p class="total">Total: ${formatearMoneda(calc.total)}</p>
        </div>
    `;
}