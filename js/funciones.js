// Este archivo se carga ANTES del JavaScript de cada pantalla.
// Solo contiene tareas que se repiten en varias páginas.
let almacenamientoValido = true;

function mostrarMensaje(texto) {
    document.getElementById("mensaje").textContent = texto;
}

function leerDatos(clave, valorInicial) {
    try {
        const texto = localStorage.getItem(clave);
        if (texto === null) return valorInicial;
        return JSON.parse(texto);
    } catch (error) {
        almacenamientoValido = false;
        mostrarMensaje("No se pudieron leer los datos guardados. No se sobrescribirán; revisa el almacenamiento del navegador.");
        return valorInicial;
    }
}

function guardarDatos(clave, datos) {
    if (!almacenamientoValido) return false;
    try {
        localStorage.setItem(clave, JSON.stringify(datos));
        return true;
    } catch (error) {
        mostrarMensaje("No se pudo guardar. Revisa el espacio o los permisos del navegador e intenta nuevamente.");
        return false;
    }
}

function productosValidos(lista) {
    if (!Array.isArray(lista) || lista.length === 0) return false;
    for (const producto of lista) {
        if (!producto || typeof producto.nombre !== "string" ||
            producto.nombre.trim() === "" ||
            !Number.isFinite(producto.precio) || producto.precio <= 0 ||
            !Number.isSafeInteger(producto.cantidad) || producto.cantidad < 1 ||
            !Number.isFinite(producto.precio * producto.cantidad)) {
            return false;
        }
    }
    return Number.isFinite(calcularTotal(lista));
}

function calcularTotal(lista) {
    let centavos = 0;
    for (const producto of lista) {
        centavos += Math.round(producto.precio * 100) * producto.cantidad;
    }
    return centavos / 100;
}

function contarUnidades(lista) {
    let unidades = 0;
    for (const producto of lista) unidades += producto.cantidad;
    return unidades;
}

function dinero(importe) {
    return "Q" + importe.toFixed(2);
}

function numeroVisible(numero) {
    return String(numero).padStart(3, "0");
}

// Usa la fecha LOCAL del dispositivo, sin convertirla a UTC.
function fechaClave(fecha) {
    const mes = String(fecha.getMonth() + 1).padStart(2, "0");
    const dia = String(fecha.getDate()).padStart(2, "0");
    return fecha.getFullYear() + "-" + mes + "-" + dia;
}

function obtenerVentas() {
    const ventas = leerDatos("pedidosCafe", []);
    if (Array.isArray(ventas)) {
        for (const venta of ventas) {
            if (!venta || !Number.isSafeInteger(venta.numero) || venta.numero < 1 ||
                typeof venta.fechaClave !== "string" ||
                typeof venta.fecha !== "string" || typeof venta.hora !== "string" ||
                !productosValidos(venta.productos)) {
                almacenamientoValido = false;
                mostrarMensaje("Hay ventas con un formato incompatible. Conserva un respaldo y revisa los datos antes de continuar.");
                return [];
            }
        }
        return ventas;
    }
    almacenamientoValido = false;
    mostrarMensaje("La lista de ventas guardada no tiene un formato válido.");
    return [];
}

// Resumen y Detalle utilizan la MISMA función para llenar sus tablas.
function mostrarTablaProductos(productos) {
    const cuerpo = document.getElementById("productosPedido");
    cuerpo.textContent = "";
    for (const producto of productos) {
        const fila = cuerpo.insertRow();
        fila.insertCell().textContent = producto.nombre;
        fila.insertCell().textContent = dinero(producto.precio);
        fila.insertCell().textContent = producto.cantidad;
        fila.insertCell().textContent = dinero(calcularTotal([producto]));
    }
    document.getElementById("totalPedido").textContent = dinero(calcularTotal(productos));
}
