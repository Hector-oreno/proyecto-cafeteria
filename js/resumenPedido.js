const botonConfirmar = document.querySelector(".boton_confirmar");
const botonCancelar = document.querySelector(".boton_cancelar");
const productosPedido = leerDatos("pedido", []);
let revision = leerDatos("pedidoBorrador", null);
const ventasIniciales = obtenerVentas();
let confirmando = false;

// El número se prepara para identificar esta revisión y evitar duplicados.
// Solo se convierte en venta al pulsar Confirmar.
if (productosValidos(productosPedido) && almacenamientoValido) {
    if (!revision || !Number.isSafeInteger(revision.numero) || revision.numero < 1) {
        let numero = 1;
        for (const venta of ventasIniciales) {
            if (venta.numero >= numero) numero = venta.numero + 1;
        }
        revision = { numero: numero };
        guardarDatos("pedidoBorrador", revision);
    }
    mostrarTablaProductos(productosPedido);
    document.getElementById("numeroPedido").textContent = "Pedido #" + numeroVisible(revision.numero) + " por confirmar";
    document.getElementById("datosPedido").textContent = contarUnidades(productosPedido) + " unidades. Revisa antes de registrar la venta.";
} else {
    botonConfirmar.disabled = true;
    if (almacenamientoValido) mostrarMensaje("No hay un pedido válido. Vuelve a Nuevo pedido para prepararlo.");
}

botonCancelar.addEventListener("click", function () {
    try {
        localStorage.removeItem("pedido");
        localStorage.removeItem("pedidoBorrador");
        window.location.href = "index.html";
    } catch (error) {
        mostrarMensaje("No se pudo descartar el borrador. Intenta nuevamente.");
    }
});

botonConfirmar.addEventListener("click", function () {
    if (confirmando || !revision || !productosValidos(productosPedido)) return;
    const ventas = obtenerVentas();
    if (!almacenamientoValido) return;

    // Si se vuelve a pulsar desde una página antigua, abre la venta existente.
    const existente = ventas.find(function (venta) { return venta.numero === revision.numero; });
    if (existente) {
        window.location.href = "detallepedido.html?numero=" + existente.numero;
        return;
    }
    const actual = leerDatos("pedido", []);
    if (JSON.stringify(actual) !== JSON.stringify(productosPedido)) {
        mostrarMensaje("El borrador cambió. Vuelve a Nuevo pedido y revisa de nuevo antes de confirmar.");
        return;
    }

    confirmando = true;
    botonConfirmar.disabled = true;
    const ahora = new Date();
    const venta = {
        numero: revision.numero,
        fechaClave: fechaClave(ahora),
        fecha: ahora.toLocaleDateString("es-GT"),
        hora: ahora.toLocaleTimeString("es-GT", { hour: "2-digit", minute: "2-digit", hour12: false }),
        productos: productosPedido,
        unidades: contarUnidades(productosPedido),
        total: calcularTotal(productosPedido)
    };
    ventas.push(venta);
    if (!guardarDatos("pedidosCafe", ventas)) {
        confirmando = false;
        botonConfirmar.disabled = false;
        return;
    }

    // La venta ya está guardada. Limpiar el borrador NO elimina el historial.
    try {
        localStorage.removeItem("pedido");
        localStorage.removeItem("pedidoBorrador");
    } catch (error) {
        mostrarMensaje("La venta se guardó, pero no se pudo limpiar el borrador.");
        return;
    }
    window.location.href = "detallepedido.html?numero=" + venta.numero;
});

window.addEventListener("pageshow", function () {
    if (!revision) return;
    const ventas = obtenerVentas();
    const existente = ventas.find(function (venta) { return venta.numero === revision.numero; });
    if (existente) {
        botonConfirmar.disabled = true;
        mostrarMensaje("Este pedido ya fue confirmado. Consulta su detalle desde Ventas del día.");
    }
});
