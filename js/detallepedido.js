
//Elementos del HTML
const numeroPedido = document.getElementById("numeroPedido");
const datosPedido = document.getElementById("datosPedido");
const cuerpoTabla = document.getElementById("productosPedido");
const totalPedido = document.getElementById("totalPedido");


//Recuperar pedido seleccionado
let pedido = null;

try {
    const pedidoGuardado = localStorage.getItem("pedidoSeleccionado");

    if (pedidoGuardado) {
        pedido = JSON.parse(pedidoGuardado);
    }

} catch (error) {
    console.error("Error al recuperar el pedido:", error);
}


//Mostrar información del pedido
if (pedido && Array.isArray(pedido.productos)) {

    numeroPedido.textContent =
        `Pedido #${String(pedido.numero).padStart(3, "0")}`;

    let unidades = 0;
    let total = 0;

    cuerpoTabla.textContent = "";

    //Mostrar productos
    for (const producto of pedido.productos) {

        const fila = cuerpoTabla.insertRow();

        fila.insertCell().textContent = producto.nombre;

        fila.insertCell().textContent =
            `Q${producto.precio.toFixed(2)}`;

        fila.insertCell().textContent = producto.cantidad;

        const subtotal = producto.precio * producto.cantidad;

        fila.insertCell().textContent =
            `Q${subtotal.toFixed(2)}`;

        unidades += producto.cantidad;
        total += subtotal;
    }

    //Mostrar fecha, hora y unidades
    datosPedido.textContent =
        `${pedido.fecha} - ${pedido.hora} - ${unidades} unidades`;

    //Mostrar total
    totalPedido.textContent = `Q${total.toFixed(2)}`;

} else {

    numeroPedido.textContent = "Pedido no encontrado";
    datosPedido.textContent = "No hay información disponible";
    totalPedido.textContent = "Q0.00";

}
