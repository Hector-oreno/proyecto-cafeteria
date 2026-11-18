const botonModificar =
document.getElementById("btnModificar");

botonModificar.addEventListener("click", function(){
    window.location.href = "nuevopedido.html";
});

const botonConfirmar = 
document.querySelector(".boton_confirmar");

botonConfirmar.addEventListener("click", function () {
    localStorage.setItem("pedidoConfirmado", JSON.stringify(pedido));
    window.location.href = "detallepedido.html";
});

const botonCancelar = document.querySelector(".boton_cancelar");

botonCancelar.addEventListener("click", function () {
    localStorage.removeItem("pedidoBorrador");
    window.location.href = "index.html";
});

let pedido = {
    numero: "001",
    fecha: "01/11/2026",
    hora: "10:00",
    productos: [
        {nombre: "Cafe americano", precio: 12, cantidad: 2},
        {nombre: "Sandwich", precio: 22, cantidad: 1}
    ]
};

const borradorGuardado = localStorage.getItem("pedidoBorrador");

if (borradorGuardado) {
    pedido = JSON.parse(borradorGuardado);
}

document.getElementById("numeroPedido").textContent =
    "Pedido #" + pedido.numero;

const cuerpoTabla = document.getElementById("productosPedido");

for (const producto of pedido.productos) {
    const fila = cuerpoTabla.insertRow();

    fila.insertCell().textContent = producto.nombre;
    fila.insertCell().textContent = "Q" + producto.precio.toFixed(2);
    fila.insertCell().textContent = producto.cantidad;
    fila.insertCell().textContent =
        "Q" + (producto.precio * producto.cantidad).toFixed(2);
}

    let total = 0;
    let unidades = 0;

for (const producto of pedido.productos) {
    total += producto.precio * producto.cantidad;
    unidades += producto.cantidad;
}

document.getElementById("datosPedido").textContent =
    pedido.fecha + " - " + pedido.hora + " - " +
    unidades + " unidades";

document.getElementById("totalPedido").textContent =
    "Q" + total.toFixed(2);