
const fecha = document.getElementById("fecha");
const dineroVentas = document.getElementById("VR");
const pedidosConfirmados = document.getElementById("PC");
const tablaPedidos = document.getElementById("tabla-pedidos");

//Bloque Fecha Actual
const date = new Date();

const [month, day, year] = [
    date.getMonth() + 1,
    date.getDate(),
    date.getFullYear(),
];

fecha.textContent = `${day}/${month}/${year}`;


//Bloque Recuperar Pedidos de LocalStorage

let pedidosRecuperados = [];

try {
    const pedidosGuardados = localStorage.getItem("pedidosCafe");

    //Si hay pedidos guardados, convertirlos a un array
    if (pedidosGuardados) {
        const datos = JSON.parse(pedidosGuardados);

        //Verificar que los datos sean un array
        if (Array.isArray(datos)) {
            pedidosRecuperados = datos;
        }
    }

} catch (error) {
    console.error("Error al recuperar los pedidos:", error);
}


//Bloque Filtrar Ventas del Día

//Obtener la fecha actual en formato día/mes/año
const fechaActual = `${day}/${month}/${year}`;

//Array donde guardaremos los pedidos de hoy
const pedidosHoy = [];

//Recorrer todos los pedidos guardados
pedidosRecuperados.forEach(pedido => {

    //Comprobar que el pedido tenga fecha
    if (!pedido || !pedido.fecha) {
        return;
    }

    //Obtener solamente la fecha, sin la hora
    const fechaPedido = pedido.fecha.split(",")[0].trim();

    //Comparar con la fecha actual
    if (fechaPedido === fechaActual) {
        pedidosHoy.push(pedido);
    }

});


//Bloque Mostrar Pedidos Registrados

let totalVentas = 0;
let totalPedidos = 0;

pedidosHoy.forEach(pedido => {

    //Verificar que el pedido tenga productos
    if (!Array.isArray(pedido.productos) ||
        pedido.productos.length === 0) {
        return;
    }

    //Calcular unidades y total del pedido
    let unidades = 0;
    let total = 0;
    let pedidoValido = true;

    pedido.productos.forEach(producto => {

        const cantidad = Number(producto.cantidad);
        const precio = Number(producto.precio);

        //Evitar cantidades o precios incorrectos
        if (!Number.isInteger(cantidad) ||
            cantidad <= 0 ||
            !Number.isFinite(precio) ||
            precio < 0) {

            pedidoValido = false;
            return;
        }

        unidades += cantidad;
        total += precio * cantidad;

    });

    //No mostrar pedidos con datos inválidos
    if (!pedidoValido) {
        return;
    }

    //Bloque Mostrar la tabla de pedidos
    let newTablatr = document.createElement("tr");
    tablaPedidos.appendChild(newTablatr);

    let newtd = document.createElement("td");
    newTablatr.appendChild(newtd);

    newtd.textContent = `#${String(pedido.numero).padStart(3, "0")}`;


    //Bloque Mostrar la tabla de hora
    let newtdhora = document.createElement("td");
    newTablatr.appendChild(newtdhora);

    newtdhora.textContent = pedido.hora;


    //Bloque Mostrar la tabla de unidades
    let newtdUnidades = document.createElement("td");
    newTablatr.appendChild(newtdUnidades);

    newtdUnidades.textContent = unidades;


    //Bloque Mostrar la tabla de total
    let newtdPedido = document.createElement("td");
    newTablatr.appendChild(newtdPedido);

    newtdPedido.textContent = `Q${total.toFixed(2)}`;


    //Bloque Mostrar la tabla de detalle
    let newtdConsulta = document.createElement("td");
    newTablatr.appendChild(newtdConsulta);

    let botonDetalle = document.createElement("button");

    botonDetalle.type = "button";
    botonDetalle.textContent = "Ver Detalles";

    newtdConsulta.appendChild(botonDetalle);


    //Asignar el botón para el CSS
    botonDetalle.className = "btn-detalle";


//Abrir detalle del pedido seleccionado
botonDetalle.addEventListener("click", function () {

    //Guardar el pedido seleccionado
    localStorage.setItem(
        "pedidoSeleccionado",
        JSON.stringify(pedido)
    );

    //Abrir página de detalles
    window.location.href = "detallepedido.html";
});



    //Bloque Evento Ver Detalles
    botonDetalle.addEventListener("click", function () {

        //Guardar el pedido seleccionado
        localStorage.setItem(
            "pedidoSeleccionado",
            JSON.stringify(pedido)
        );

        //Abrir la página de detalles
        window.location.href = "detallepedido.html";

    });


    //Bloque Sumar Ventas y Pedidos Confirmados
    totalVentas += total;
    totalPedidos++;

});


//Bloque Mostrar Dinero de Ventas

dineroVentas.textContent = `Q${totalVentas.toFixed(2)}`;


//Bloque Mostrar Pedidos Confirmados

if (totalPedidos === 1) {
    pedidosConfirmados.textContent = "1 Pedido";
} else {
    pedidosConfirmados.textContent = `${totalPedidos} Pedidos`;
}


//Bloque Mostrar Mensaje si no hay Pedidos

if (totalPedidos === 0) {

    let newTablatr = document.createElement("tr");
    tablaPedidos.appendChild(newTablatr);

    let newtd = document.createElement("td");

    newtd.colSpan = 5;
    newtd.textContent = "No hay pedidos registrados para hoy";
    newtd.style.textAlign = "center";

    newTablatr.appendChild(newtd);

}
