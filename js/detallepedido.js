const pedidoGuardado = localStorage.getItem("pedidoConfirmado");

if (pedidoGuardado) {
    const pedido = JSON.parse(pedidoGuardado);
const cuerpoTabla = document.getElementById("productosPedido");
cuerpoTabla.textContent = "";

for (const producto of pedido.productos) {
    const fila = cuerpoTabla.insertRow();

    fila.insertCell().textContent = producto.nombre;
    fila.insertCell().textContent = "Q" + producto.precio.toFixed(2);
    fila.insertCell().textContent = producto.cantidad;
    fila.insertCell().textContent =
        "Q" + (producto.precio * producto.cantidad).toFixed(2);
}
    document.getElementById("numeroPedido").textContent =
        "Pedido #" + pedido.numero;
        let unidades = 0;
let total = 0;

for (const producto of pedido.productos) {
    unidades += producto.cantidad;
    total += producto.precio * producto.cantidad;
}

document.getElementById("datosPedido").textContent =
    pedido.fecha + " - " + pedido.hora + " - " +
    unidades + " unidades";

document.getElementById("totalPedido").textContent =
    "Q" + total.toFixed(2);
}