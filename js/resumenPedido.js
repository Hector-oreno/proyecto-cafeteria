
//Elementos del HTML
const botonModificar = document.getElementById("btnModificar");
const botonConfirmar = document.querySelector(".boton_confirmar");
const botonCancelar = document.querySelector(".boton_cancelar");

const numeroPedido = document.getElementById("numeroPedido");
const datosPedido = document.getElementById("datosPedido");
const cuerpoTabla = document.getElementById("productosPedido");
const totalPedido = document.getElementById("totalPedido");


//Recuperar borrador de Nuevo pedido
let pedido = null;

try {
    const borradorGuardado = localStorage.getItem("pedidoFinal");

    if (borradorGuardado) {
        pedido = JSON.parse(borradorGuardado);
    }

} catch (error) {
    console.error("Error al recuperar el pedido:", error);
}


//Calcular total y unidades
let total = 0;
let unidades = 0;
let pedidoValido = true;

if (!pedido ||
    !Array.isArray(pedido.productos) ||
    pedido.productos.length === 0) {

    pedidoValido = false;

} else {

    for (const producto of pedido.productos) {

        const cantidad = Number(producto.cantidad);
        const precio = Number(producto.precio);

        if (!producto.nombre ||
            !Number.isInteger(cantidad) ||
            cantidad <= 0 ||
            !Number.isFinite(precio) ||
            precio < 0) {

            pedidoValido = false;
            break;
        }

        unidades += cantidad;
        total += precio * cantidad;
    }
}


//Mostrar pedido o mensaje de error
if (!pedidoValido) {

    numeroPedido.textContent = "Pedido no disponible";
    datosPedido.textContent = "Regresa a Nuevo pedido";
    totalPedido.textContent = "Q0.00";

    botonConfirmar.disabled = true;

} else {

    numeroPedido.textContent = "Resumen del pedido";
    datosPedido.textContent = `${unidades} unidades`;

    cuerpoTabla.textContent = "";

    for (const producto of pedido.productos) {

        const fila = cuerpoTabla.insertRow();

        fila.insertCell().textContent = producto.nombre;
        fila.insertCell().textContent =
            `Q${producto.precio.toFixed(2)}`;

        fila.insertCell().textContent = producto.cantidad;

        fila.insertCell().textContent =
            `Q${(producto.precio * producto.cantidad).toFixed(2)}`;
    }

    totalPedido.textContent = `Q${total.toFixed(2)}`;
}


//Botón Modificar
botonModificar.addEventListener("click", function () {
    window.location.href = "nuevopedido.html";
});


//Botón Confirmar
botonConfirmar.addEventListener("click", function () {

    if (!pedidoValido) {
        alert("No se puede confirmar un pedido inválido");
        return;
    }

    //Evitar confirmar dos veces
    botonConfirmar.disabled = true;

    try {

        //Recuperar historial
        const historialGuardado = localStorage.getItem("pedidosCafe");

        let pedidos = [];

        if (historialGuardado) {
            pedidos = JSON.parse(historialGuardado);
        }

        if (!Array.isArray(pedidos)) {
            throw new Error("El historial no es válido");
        }

        //Recuperar último número utilizado
        const ultimoNumero = pedidos.reduce(function (mayor, actual) {
            const numero = Number(actual.numero);

            if (Number.isInteger(numero) && numero > mayor) {
                return numero;
            }

            return mayor;
        }, 0);

        const nuevoNumero = ultimoNumero + 1;

        //Obtener fecha y hora
        const ahora = new Date();

        const fecha = ahora.toLocaleDateString("es-GT");
        const hora = ahora.toLocaleTimeString("es-GT", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false
        });

        //Crear pedido confirmado
        const pedidoConfirmado = {
            numero: nuevoNumero,
            fecha: fecha,
            hora: hora,
            productos: pedido.productos,
            unidades: unidades,
            total: total
        };

        //Agregar al historial
        pedidos.push(pedidoConfirmado);

        //Guardar historial actualizado
        localStorage.setItem("pedidosCafe", JSON.stringify(pedidos));

        //Guardar pedido seleccionado
        localStorage.setItem(
            "pedidoSeleccionado",
            JSON.stringify(pedidoConfirmado)
        );

        //Limpiar el borrador y carrito
        localStorage.removeItem("pedidoFinal");
        localStorage.removeItem("pedido");

        //Abrir detalle
        window.location.href = "detallepedido.html";

    } catch (error) {

        console.error("Error al confirmar:", error);
        alert("No se pudo confirmar el pedido");

        botonConfirmar.disabled = false;
    }
});


//Botón Cancelar
botonCancelar.addEventListener("click", function () {

    localStorage.removeItem("pedidoFinal");
    localStorage.removeItem("pedido");

    window.location.href = "index.html";
});
