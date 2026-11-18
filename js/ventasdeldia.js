const filtroFecha = document.getElementById("fecha");
const tablaPedidos = document.getElementById("tabla-pedidos");
filtroFecha.value = fechaClave(new Date());

function mostrarVentas() {
    const ventas = obtenerVentas();
    tablaPedidos.textContent = "";
    let totalVentas = 0;
    let cantidadPedidos = 0;
    for (const pedido of ventas) {
        // Conserva todo el historial, pero muestra solo la fecha seleccionada.
        if (pedido.fechaClave !== filtroFecha.value) continue;
        const fila = tablaPedidos.insertRow();
        fila.insertCell().textContent = "#" + numeroVisible(pedido.numero);
        fila.insertCell().textContent = pedido.hora;
        fila.insertCell().textContent = contarUnidades(pedido.productos);
        fila.insertCell().textContent = dinero(calcularTotal(pedido.productos));
        const enlace = document.createElement("a");
        enlace.textContent = "Ver detalle";
        enlace.className = "btn-detalle";
        enlace.href = "detallepedido.html?numero=" + pedido.numero;
        fila.insertCell().appendChild(enlace);
        totalVentas += calcularTotal(pedido.productos);
        cantidadPedidos++;
    }
    document.getElementById("VR").textContent = dinero(totalVentas);
    document.getElementById("PC").textContent = cantidadPedidos + " pedidos";
    document.getElementById("sin-ventas").hidden = cantidadPedidos > 0;
}

filtroFecha.addEventListener("change", mostrarVentas);
// También actualiza al volver con Atrás desde el detalle.
window.addEventListener("pageshow", mostrarVentas);
mostrarVentas();
