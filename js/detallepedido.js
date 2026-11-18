// La dirección indica QUÉ venta mostrar: detallepedido.html?numero=1
const parametros = new URLSearchParams(window.location.search);
const numero = Number(parametros.get("numero"));
const ventas = obtenerVentas();
const pedido = ventas.find(function (venta) { return venta.numero === numero; });

if (pedido) {
    mostrarTablaProductos(pedido.productos);
    document.getElementById("numeroPedido").textContent = "Pedido #" + numeroVisible(pedido.numero);
    document.getElementById("datosPedido").textContent = pedido.fecha + " - " + pedido.hora + " - " + contarUnidades(pedido.productos) + " unidades";
    document.getElementById("estado").hidden = false;
} else if (almacenamientoValido) {
    mostrarMensaje("No se encontró ese pedido. Selecciona uno en Ventas del día.");
}
